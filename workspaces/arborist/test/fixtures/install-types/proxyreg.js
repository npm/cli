const https = require('https')
const http = require('http')
const {resolve, format, parse} = require('url')
const server = http.createServer((q, s) => {
  if (q.method !== 'GET' && q.method !== 'HEAD') {
    s.statusCode = 405
    return s.end('method not supported')
  }
  const upstream = resolve('https://registry.npmjs.org/', q.url)
  console.log(upstream)
  if (q.url.endsWith('.tgz')) {
    https.get({
      hostname: 'registry.npmjs.org',
      path: q.url,
      method: q.method,
    }, res => res.pipe(s))
    return
  } else {
    https.get({
      hostname: 'registry.npmjs.org',
      path: q.url,
      method: q.method,
    }, res => {
      const out = []
      res.on('data', c => out.push(c))
      res.on('end', () => {
        const data = JSON.parse(Buffer.concat(out).toString('utf8'))
        if (data.dist)
          data.dist.tarball = format({
            ...parse(data.dist.tarball),
            host: 'localhost:8080',
          })
        if (data.versions) {
          for (const v in data.versions) {
            const version = data.versions[v]
            if (version.dist)
              version.dist.tarball = format({
                ...parse(version.dist.tarball),
                host: 'localhost:8080',
              })
          }
        }
        s.end(JSON.stringify(data))
      })
    })
    return
  }
})
server.listen(8080)
