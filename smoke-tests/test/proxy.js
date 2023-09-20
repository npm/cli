const t = require('tap')
const setup = require('./fixtures/setup.js')

t.test('proxy', async t => {
  const { npm, readFile } = await setup(t, {
    mockRegistry: false,
    useProxy: true,
  })

  await npm('install', 'abbrev@1.0.4')

  t.strictSame(await readFile('package.json'), {
    dependencies: { abbrev: '^1.0.4' },
  })
})
