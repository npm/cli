const t = require('tap')
const requireInject = require('require-inject')
const npm = requireInject('../../../lib/npm.js')

const dym = require('../../../lib/utils/did-you-mean.js')
t.test('did-you-mean', t => {
  npm.load(err => {
    t.notOk(err)
    t.test('nistall', async t => {
      const result = await dym(npm, 'nistall')
      t.match(result, 'Unknown command')
      t.match(result, 'npm install')
    })
    t.test('sttest', async t => {
      const result = await dym(npm, 'sttest')
      t.match(result, 'Unknown command')
      t.match(result, 'npm test')
      t.match(result, 'npm run posttest')
    })
    t.test('npz', async t => {
      const result = await dym(npm, 'npxx')
      t.match(result, 'Unknown command')
      t.match(result, 'npm exec npx')
    })
    t.test('qwuijbo', async t => {
      const result = await dym(npm, 'qwuijbo')
      t.match(result, 'Unknown command')
    })
    t.end()
  })
})
