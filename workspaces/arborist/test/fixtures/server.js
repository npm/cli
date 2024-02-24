const { join, dirname } = require('path')
const { promisify } = require('util')
const fs = require('fs/promises')
const http = require('http')
const https = require('https')
const zlib = require('zlib')
const mrm = require('minify-registry-metadata')

const gzip = promisify(zlib.gzip)
const unzip = promisify(zlib.unzip)
const mkdirp = (p) => fs.mkdir(p, { recursive: true })
const exists = (p) => fs.stat(p).then(() => true).catch(() => false)
const writeJson = (p, d) => fs.writeFile(p, JSON.stringify(d, null, 2) + '\n')

const PORT = 12345 + (+process.env.TAP_CHILD_ID || 0)
const doProxy = process.env.ARBORIST_TEST_PROXY

const missing = /\/@isaacs(\/|%2[fF])(this-does-not-exist-at-all|testing-missing-tgz\/-\/)/
const corgiDoc = 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'

let advisoryBulkResponse = null
let failAdvisoryBulk = false
let auditResponse = null
let failAudit = false

const proxyRegistry = async (req, res) => {
  const upstream = await new Promise((resolve) => {
    https.get({
      host: 'registry.npmjs.org',
      path: req.url,
      headers: {
        ...req.headers,
        accept: '*',
        'accept-encoding': 'identity',
        host: 'registry.npmjs.org',
        connection: 'close',
        'if-none-match': '',
      },
    }).on('response', response => {
      const { statusCode, headers } = response
      const data = []
      const error = statusCode >= 300 || statusCode < 200
      const contentEncoding = headers['content-encoding']
      const contentType = headers['content-type']

      console.error('[PROXY] START', `${req.url}: ${statusCode} ${contentType}`)
      if (error) {
        console.error('[PROXY] UPSTREAM ERROR', statusCode)
      }

      res.statusCode = statusCode
      res.setHeader('content-encoding', contentEncoding)
      res.setHeader('content-type', contentType)

      response.on('end', () => {
        console.error('[PROXY] END', req.url)
        resolve({ error, data: Buffer.concat(data), contentType })
      })
      response.on('data', c => data.push(c))
    }).end()
  })

  return upstream
}

const bulkAdvisoriesRoute = async (req, res) => {
  if (failAdvisoryBulk) {
    res.statusCode = 503
    return res.end('no advisory bulk for you')
  }

  const file = advisoryBulkResponse

  if (!file) {
    if (auditResponse && !failAudit) {
      // simulate what the registry does when quick audits are allowed,
      // but advisory bulk requests are not
      res.statusCode = 405
      return res.end(JSON.stringify({
        code: 'MethodNotAllowedError',
        message: 'POST is not allowed',
      }))
    }
    res.statusCode = 404
    return res.end('not found')
  }

  if (doProxy && !(await exists(file))) {
    const { error, data } = await proxyRegistry(req, res)

    if (!error) {
      await mkdirp(dirname(file))
      const obj = await unzip(data).then(r => JSON.parse(r.toString()))
      await writeJson(file, obj)
    }

    return res.end(data)
  }

  res.setHeader('content-encoding', 'gzip')
  const data = await fs.readFile(file).then(r => gzip(r))
  return res.end(data)
}

const quickAuditRoute = async (req, res) => {
  if (failAudit) {
    res.statusCode = 503
    return res.end('no audit for you')
  }

  const file = auditResponse

  if (!file) {
    res.statusCode = 404
    return res.end('not found')
  }

  if (doProxy && !(await exists(file))) {
    const { error, data } = await proxyRegistry(req, res)

    if (!error) {
      await mkdirp(dirname(file))
      const unzipped = await unzip(data).then(r => r.toString())
      const obj = JSON.parse(unzipped)
      await writeJson(file, obj)
    }

    return res.end(data)
  }

  res.setHeader('content-encoding', 'gzip')
  const data = await fs.readFile(file).then(r => gzip(r))
  return res.end(data)
}

const onRequest = async (req, res) => {
  res.setHeader('connection', 'close')

  if (req.url === '/-/npm/v1/security/advisories/bulk') {
    return await bulkAdvisoriesRoute(req, res)
  }

  if (req.url === '/-/npm/v1/security/audits/quick') {
    return await quickAuditRoute(req, res)
  }

  const f = join(__dirname, 'registry-mocks', 'content', join('/', req.url.replace(/@/g, '').replace(/%2f/gi, '/')))
  const isCorgi = req.headers.accept.includes('application/vnd.npm.install-v1+json')

  let file = f
  if (isCorgi && await exists(`${f}.min.json`)) {
    file += '.min.json'
  } else if (await exists(`${f}.json`)) {
    file += '.json'
  } else if (await exists(`${f}/index.json`)) {
    file += 'index.json'
  }

  const { body, error } = await fs.readFile(file)
    .then((body) => ({ body }))
    .catch((error) => ({ error }))

  if (error) {
    // testing things going missing from the registry somehow
    if (missing.test(req.url)) {
      res.statusCode = 404
      return res.end('{"error": "not found"}')
    }

    if (doProxy) {
      const { error: proxyError, contentType, data } = await proxyRegistry(req, res)

      if (!proxyError) {
        await mkdirp(dirname(f))

        if (contentType.includes('application/json')) {
          const file = `${f}.json`
          const obj = JSON.parse(data.toString())
          await Promise.all([
            writeJson(file, obj),
            writeJson(file.replace(/\.json$/, '.min.json'), mrm(obj)),
          ])
        } else {
          await fs.writeFile(f, data)
        }
      }

      return res.end(data)
    }

    res.statusCode = error.code === 'ENOENT' ? 404 : 500
    if (res.method === 'GET') {
      console.error(error)
    }
    res.setHeader('content-type', 'text/plain')
    return res.end(error.stack)
  }

  res.setHeader('content-length', body.length)
  res.setHeader('content-type', /\.min\.json$/.test(file) ? corgiDoc
    : /\.json$/.test(file) ? 'application/json'
    : 'application/octet-stream')
  return res.end(body)
}

const startServer = async () => {
  const server = exports.server = http.createServer(onRequest)
  await new Promise(res => server.listen(PORT, res))
}

exports.auditResponse = value => {
  if (auditResponse && auditResponse !== value) {
    throw new Error('setting audit response, but already set\n' +
      '(did you forget to call the returned function on teardown?)')
  }
  auditResponse = value
  return () => auditResponse = null
}

exports.failAudit = () => {
  failAudit = true
  return () => failAudit = false
}

exports.advisoryBulkResponse = value => {
  if (advisoryBulkResponse && advisoryBulkResponse !== value) {
    throw new Error('setting advisory bulk response, but already set\n' +
      '(did you forget to call the returned function on teardown?)')
  }
  advisoryBulkResponse = value
  return () => advisoryBulkResponse = null
}

exports.failAdvisoryBulk = () => {
  failAdvisoryBulk = true
  return () => failAdvisoryBulk = false
}

exports.registry = `http://localhost:${PORT}/`

exports.start = startServer
exports.stop = () => exports.server.close()

exports.oneSocket = (t) => {
  t.comment('using http.Agent with maxSockets:1, this is a hack that should be fixed')
  // work around an unknown issue for know where agents on localhost need a
  // low maxSockets to avoid ECONNRESET issues when dealing with ipv4 and ipv6
  // dns resolution (i think)
  return {
    agent: new http.Agent({
      maxSockets: 1,
    }),
  }
}

if (require.main === module) {
  startServer()
    .then(() => console.log(`Mock registry live at:\n${exports.registry}\nPress ^D to close gracefully.`))
    .catch(console.error)
  process.openStdin()
  process.stdin.on('end', () => exports.stop())
}
