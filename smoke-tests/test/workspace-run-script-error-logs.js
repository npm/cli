
const t = require('tap')
const setup = require('./fixtures/setup.js')

t.test('basic', async t => {
  const { npm } = await setup(t)

  await t.test('npm install sends correct user-agent', async t => {
    await npm('init', '-y')
    await npm('init', '-y', `--workspace=pkga`)
    await npm('init', '-y', `--workspace=pkgb`)

    await npm('pkg', 'set', '-w=pkga', `scripts.hello=echo a`)

    const logs = await npm('run', 'hello', '-ws').catch((r) => r.stderr)

    t.match(logs, 'A complete log of this run can be found in:', 'has log message')
  })
})
