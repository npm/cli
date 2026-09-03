const t = require('tap')
const {
  carryRegistryPackageName,
  getRegistryPackageName,
} = require('../lib/registry-package-name.js')

const edge = (name, spec, valid = true) => ({ name, spec, valid })
const node = (...edgesIn) => ({ edgesIn: new Set(edgesIn) })

t.equal(
  getRegistryPackageName(node(edge('abbrev', '^1.0.0'))),
  'abbrev',
  'uses the dependency name for a registry range'
)

t.equal(
  getRegistryPackageName(node(edge('hoek', 'npm:@npm/hoek@6.1.4'))),
  '@npm/hoek',
  'uses the target package name for an alias'
)

t.equal(
  getRegistryPackageName(node(
    edge('hoek', 'npm:@npm/hoek@6.1.4'),
    edge('hoek', 'npm:@other/hoek@6.1.4', false)
  )),
  '@npm/hoek',
  'ignores invalid inbound edges'
)

t.equal(
  getRegistryPackageName(node(
    edge('hoek', 'npm:@npm/hoek@6.1.4'),
    edge('hoek', 'npm:@other/hoek@6.1.4')
  )),
  null,
  'rejects conflicting valid registry identities'
)

t.equal(
  getRegistryPackageName(node(edge('pkg', 'https://example.com/pkg.tgz'))),
  null,
  'rejects non-registry dependency specs'
)

t.equal(
  getRegistryPackageName(node(edge('pkg', 'npm:'))),
  null,
  'rejects invalid dependency specs'
)

t.equal(
  getRegistryPackageName(node(edge(undefined, '1.0.0'))),
  null,
  'rejects registry specs without a package name'
)

t.equal(
  getRegistryPackageName({}),
  null,
  'rejects nodes without inbound edges'
)

t.equal(
  getRegistryPackageName({ edgesIn: {} }),
  null,
  'rejects nodes whose inbound edges are not iterable'
)

t.equal(
  getRegistryPackageName(node()),
  null,
  'rejects nodes without a valid inbound identity'
)

const source = node(edge('hoek', 'npm:@npm/hoek@6.1.4'))
const isolated = node()
carryRegistryPackageName(source, isolated)
t.equal(
  getRegistryPackageName(isolated),
  '@npm/hoek',
  'carries the trusted identity to an isolated node'
)
