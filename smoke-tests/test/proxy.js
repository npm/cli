const t = require('tap')
const setup = require('./fixtures/setup.js')
const { createProxy } = require('proxy')
const http = require('http')

t.test('proxy', async t => {
  const { PROXY_PORT: PORT } = setup

  const { npm, readFile } = await setup(t, {
    registry: false,
    testdir: {
      home: {
        '.npmrc': `proxy = "http://localhost:${PORT}/"`,
      },
    },
  })

  const server = createProxy(http.createServer())
  await new Promise(res => server.listen(PORT, res))
  t.teardown(() => server.close())

  await npm('install', 'abbrev@1.0.4')

  t.strictSame(await readFile('package.json'), {
    dependencies: { abbrev: '^1.0.4' },
  })
})
