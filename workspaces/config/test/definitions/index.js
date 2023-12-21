const t = require('tap')
const config = require('../../lib/definitions/index.js')
const definitions = require('../../lib/definitions/definitions.js')

t.test('defaults', t => {
  // just spot check a few of these to show that we got defaults assembled
  t.match(config.defaults, {
    registry: definitions.registry.default,
    'init-module': definitions['init-module'].default,
  })

  t.end()
})

t.test('flatten', t => {
  const obj = {
    'save-exact': true,
    'save-prefix': 'ignored',
    'save-dev': true,
    '@foobar:registry': 'https://foo.bar.com/',
    '//foo.bar.com:_authToken': 'foobarbazquuxasdf',
    userconfig: '/path/to/.npmrc',
  }

  const flat = config.flatten(obj)

  t.strictSame(flat, {
    saveType: 'dev',
    savePrefix: '',
    '@foobar:registry': 'https://foo.bar.com/',
    '//foo.bar.com:_authToken': 'foobarbazquuxasdf',
  })

  // now flatten something else on top of it.
  config.flatten({ 'save-dev': false }, flat)

  t.strictSame(flat, {
    savePrefix: '',
    '@foobar:registry': 'https://foo.bar.com/',
    '//foo.bar.com:_authToken': 'foobarbazquuxasdf',
  })

  t.end()
})
