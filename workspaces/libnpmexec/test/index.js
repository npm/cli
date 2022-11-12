const t = require('tap')
const { setup } = require('./fixtures/setup.js')

t.test('no args', async t => {
  t.plan(1)

  const { exec } = setup(t, {
    mocks: {
      '../../lib/run-script': ({ args }) => {
        t.ok(args.length === 0, 'should call run-script with no args')
      },
    },
  })

  await exec()
})
