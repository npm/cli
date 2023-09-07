const t = require('tap')
const setup = require('./fixtures/setup.js')
const { createProxy } = require('proxy')
const http = require('http')

t.test('basic', async t => {
  const PORT = setup.PROXY_PORT
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

  await t.test('npm install prodDep@version', async t => {
    await npm('install', 'abbrev@1.0.4')

    t.strictSame(await readFile('package.json'), {
      dependencies: { abbrev: '^1.0.4' },
    })
  })
})
