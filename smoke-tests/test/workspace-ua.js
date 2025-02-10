
const t = require('tap')
const setup = require('./fixtures/setup.js')

t.test('basic', async t => {
  const { registry, npm } = await setup(t)

  const mock = () => registry.nock
    .get(`/fail_reflect_user_agent`)
    .reply(404, {}, { 'npm-notice': (req) => req.headers['user-agent'] })

  await t.test('npm install sends correct user-agent', async t => {
    await npm('init', '-y')
    await npm('init', '-y', `--workspace=foo`)

    mock()
    await t.rejects(
      npm('install', 'fail_reflect_user_agent'),
      {
        stderr: /workspaces\/false/,
      },
      'workspaces/false is present in output'
    )

    mock()
    await t.rejects(
      npm('install', 'fail_reflect_user_agent', '--workspaces'),
      {
        stderr: /workspaces\/true/,
      },
      'workspaces/true is present in output'
    )
  })
})
