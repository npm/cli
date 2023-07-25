const t = require('tap')
const MockRegistry = require('..')

t.test('it works', async t => {
  t.ok(new MockRegistry({
    registry: 'http://registry.npmjs.org/',
  }))
})
