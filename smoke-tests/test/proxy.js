const t = require('tap')
const setup = require('./fixtures/setup.js')

t.test('proxy', async t => {
  const { npm, readFile } = await setup(t, {
    testdir: {
      project: {
        '.npmrc': '',
        'package.json': {
          name: 'placeholder',
        },
      },
    },
    mockRegistry: false,
    useProxy: true,
  })

  await npm('install', 'abbrev@1.0.4')

  t.strictSame(await readFile('package.json'), {
    name: 'placeholder',
    dependencies: { abbrev: '^1.0.4' },
  })
})
