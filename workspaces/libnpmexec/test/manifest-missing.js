const t = require('tap')
const Arborist = require('@npmcli/arborist')

const manifestMissing = require('../lib/manifest-missing.js')

t.test('missing version', async t => {
  const path = t.testdir({
    node_modules: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.0',
        }),
      },
    },
    'package.json': JSON.stringify({
      name: 'root',
      dependencies: {
        a: '^1.0.0',
      },
    }),
  })
  const arb = new Arborist({
    path,
  })
  const tree = await arb.loadActual()
  const manifest = {
    name: 'a',
    _from: 'a@',
  }
  t.notOk(manifestMissing({ tree, manifest }), 'manifest not missing')
})
