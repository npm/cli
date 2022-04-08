const { join, basename } = require('path')
const { existsSync, readFileSync } = require('fs')
const http = require('http')
const PORT = 12345 + (+process.env.TAP_CHILD_ID || 0)

let server = null
const corgiDoc = 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'

const start = () => new Promise((resolve) => {
  server = http.createServer((req, res) => {
    res.setHeader('connection', 'close')

    const f = join(__dirname, join('/', req.url.replace(/@/, '').replace(/%2f/i, '/')))

    // a magic package that causes us to return an error that will be logged
    if (basename(f) === 'fail_reflect_user_agent') {
      res.statusCode = 404
      res.setHeader('npm-notice', req.headers['user-agent'])
      return res.end()
    }

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
    } catch {
      res.statusCode = 500
      res.setHeader('content-type', 'text/plain')
      res.end('bad')
    }
  }).listen(PORT, resolve)
})

module.exports = {
  start,
  stop: () => server.close(),
  registry: `http://localhost:${PORT}/`,
}
