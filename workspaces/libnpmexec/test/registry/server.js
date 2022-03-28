const { join, dirname } = require('path')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const PORT = 12345 + (+process.env.TAP_CHILD_ID || 0)
const http = require('http')
const https = require('https')

const mkdirp = require('mkdirp')
const doProxy = process.env.ARBORIST_TEST_PROXY
const missing = /\/@isaacs(\/|%2[fF])(this-does-not-exist-at-all|testing-missing-tgz\/-\/)/
const corgiDoc = 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
const { gzipSync, unzipSync } = require('zlib')

let advisoryBulkResponse = null
let failAdvisoryBulk = false
let auditResponse = null
let failAudit = false
const startServer = cb => {
  const server = module.exports.server = http.createServer((req, res) => {
    res.setHeader('connection', 'close')

    if (req.url === '/-/npm/v1/security/advisories/bulk') {
      const body = []
      req.on('data', c => body.push(c))
      req.on('end', () => {
        res.setHeader('connection', 'close')
        if (failAdvisoryBulk) {
          res.statusCode = 503
          return res.end('no advisory bulk for you')
        }
        if (!advisoryBulkResponse) {
          if (auditResponse && !failAudit) {
            // simulate what the registry does when quick audits are allowed,
            // but advisory bulk requests are not
            res.statusCode = 405
            return res.end(JSON.stringify({
              code: 'MethodNotAllowedError',
              message: 'POST is not allowed',
            }))
          } else {
            res.statusCode = 404
            return res.end('not found')
          }
        }
        if (doProxy && !existsSync(advisoryBulkResponse)) {
          // hit the main registry, then fall back to staging for now
          // XXX: remove this when bulk advisory endpoint pushed to production!
          const opts = {
            host: 'registry.npmjs.org',
            method: req.method,
            path: req.url,
            headers: {
              ...req.headers,
              accept: '*',
              host: 'registry.npmjs.org',
              connection: 'close',
              'if-none-match': '',
            },
          }
          const handleUpstream = upstream => {
            res.statusCode = upstream.statusCode
            if (upstream.statusCode >= 300 || upstream.statusCode < 200) {
              console.error('UPSTREAM ERROR', upstream.statusCode)
              return upstream.pipe(res)
            }
            res.setHeader('content-encoding', upstream.headers['content-encoding'])
            const file = advisoryBulkResponse
            console.error('PROXY', `${req.url} -> ${file} ${upstream.statusCode}`)
            mkdirp.sync(dirname(file))
            const data = []
            upstream.on('end', () => {
              const out = Buffer.concat(data)
              const obj = JSON.parse(unzipSync(out).toString())
              writeFileSync(file, JSON.stringify(obj, 0, 2) + '\n')
              res.end(out)
            })
            upstream.on('data', c => data.push(c))
          }
          return https.request(opts).on('response', upstream => {
            if (upstream.statusCode !== 200) {
              console.error('ATTEMPTING TO PROXY FROM STAGING')
              console.error('NOTE: THIS WILL FAIL WHEN NOT ON VPN!')
              opts.host = 'security-microservice-3-west.npm.red'
              opts.headers.host = opts.host
              opts.path = '/v1/advisories/bulk'
              https.request(opts)
                .on('response', r => handleUpstream(r))
                .end(Buffer.concat(body))
            } else {
              handleUpstream(upstream)
            }
          }).end(Buffer.concat(body))
        } else {
          res.setHeader('content-encoding', 'gzip')
          res.end(gzipSync(readFileSync(advisoryBulkResponse)))
        }
      })
      return
    } else if (req.url === '/-/npm/v1/security/audits/quick') {
      const body = []
      req.on('data', c => body.push(c))
      req.on('end', () => {
        res.setHeader('connection', 'close')
        if (failAudit) {
          res.statusCode = 503
          return res.end('no audit for you')
        }
        if (!auditResponse) {
          res.statusCode = 404
          return res.end('not found')
        }
        if (doProxy && !existsSync(auditResponse)) {
          return https.request({
            host: 'registry.npmjs.org',
            method: req.method,
            path: req.url,
            headers: {
              ...req.headers,
              accept: '*',
              host: 'registry.npmjs.org',
              connection: 'close',
              'if-none-match': '',
            },
          }).on('response', upstream => {
            res.statusCode = upstream.statusCode
            if (upstream.statusCode >= 300 || upstream.statusCode < 200) {
              console.error('UPSTREAM ERROR', upstream.statusCode)
              // don't save if it's not a valid response
              return upstream.pipe(res)
            }
            res.setHeader('content-encoding', upstream.headers['content-encoding'])
            const file = auditResponse
            console.error('PROXY', `${req.url} -> ${file} ${upstream.statusCode}`)
            mkdirp.sync(dirname(file))
            const data = []
            upstream.on('end', () => {
              const out = Buffer.concat(data)
              // make it a bit prettier to read later
              const obj = JSON.parse(unzipSync(out).toString())
              writeFileSync(file, JSON.stringify(obj, 0, 2) + '\n')
              res.end(out)
            })
            upstream.on('data', c => data.push(c))
          }).end(Buffer.concat(body))
        } else {
          res.setHeader('content-encoding', 'gzip')
          res.end(gzipSync(readFileSync(auditResponse)))
        }
      })
      return
    }

    const f = join(__dirname, 'content', join('/', req.url.replace(/@/, '').replace(/%2f/i, '/')))
    const isCorgi = req.headers.accept.includes('application/vnd.npm.install-v1+json')
    const file = f + (
      isCorgi && existsSync(`${f}.min.json`) ? '.min.json'
      : existsSync(`${f}.json`) ? '.json'
      : existsSync(`${f}/index.json`) ? 'index.json'
      : ''
    )

    try {
      const body = readFileSync(file)
      res.setHeader('content-length', body.length)
      res.setHeader('content-type', /\.min\.json$/.test(file) ? corgiDoc
        : /\.json$/.test(file) ? 'application/json'
        : 'application/octet-stream')
      res.end(body)
    } catch (er) {
      // testing things going missing from the registry somehow
      if (missing.test(req.url)) {
        res.statusCode = 404
        res.end('{"error": "not found"}')
        return
      }

      if (doProxy) {
        return https.get({
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
        }).on('response', upstream => {
          const errorStatus =
            upstream.statusCode >= 300 || upstream.statusCode < 200

          if (errorStatus) {
            console.error('UPSTREAM ERROR', upstream.statusCode)
          }

          const ct = upstream.headers['content-type']
          const isJson = ct.includes('application/json')
          const proxyFile = isJson ? f + '.json' : f
          console.error('PROXY', `${req.url} -> ${proxyFile} ${ct}`)
          mkdirp.sync(dirname(proxyFile))
          const data = []
          res.statusCode = upstream.statusCode
          res.setHeader('content-type', ct)
          upstream.on('end', () => {
            console.error('ENDING', req.url)
            const out = Buffer.concat(data)
            if (!errorStatus) {
              if (isJson) {
                const obj = JSON.parse(out.toString())
                writeFileSync(proxyFile, JSON.stringify(obj, 0, 2) + '\n')
                const mrm = require('minify-registry-metadata')
                const minFile = proxyFile.replace(/\.json$/, '.min.json')
                writeFileSync(minFile, JSON.stringify(mrm(obj), 0, 2) + '\n')
                console.error('WROTE JSONS', [proxyFile, minFile])
              } else {
                writeFileSync(proxyFile, out)
              }
            }
            res.end(out)
          })
          upstream.on('data', c => data.push(c))
        }).end()
      }

      res.statusCode = er.code === 'ENOENT' ? 404 : 500
      if (res.method === 'GET') {
        console.error(er)
      }
      res.setHeader('content-type', 'text/plain')
      res.end(er.stack)
    }
  })
  server.listen(PORT, cb)
}

module.exports = t => startServer(() => {
  t.parent.teardown(() => module.exports.server.close())
  t.end()
})

module.exports.auditResponse = value => {
  if (auditResponse && auditResponse !== value) {
    throw new Error('setting audit response, but already set\n' +
      '(did you forget to call the returned function on teardown?)')
  }
  auditResponse = value
  return () => auditResponse = null
}
module.exports.failAudit = () => {
  failAudit = true
  return () => failAudit = false
}

module.exports.advisoryBulkResponse = value => {
  if (advisoryBulkResponse && advisoryBulkResponse !== value) {
    throw new Error('setting advisory bulk response, but already set\n' +
      '(did you forget to call the returned function on teardown?)')
  }
  advisoryBulkResponse = value
  return () => advisoryBulkResponse = null
}
module.exports.failAdvisoryBulk = () => {
  failAdvisoryBulk = true
  return () => failAdvisoryBulk = false
}

module.exports.registry = `http://localhost:${PORT}/`

module.exports.start = startServer
module.exports.stop = () => module.exports.server.close()

if (require.main === module) {
  startServer(() => {
    console.log(`Mock registry live at:
  ${module.exports.registry}
Press ^D to close gracefully.`)
  })
  process.openStdin()
  process.stdin.on('end', () => module.exports.server.close())
}
