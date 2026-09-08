const t = require('tap')
const {
  carryRegistryPackageName,
  getRegistryPackageName,
} = require('../lib/registry-package-name.js')
const Node = require('../lib/node.js')

const edge = (name, spec, valid = true) => ({ name, spec, valid })
const peer = (name, spec) => ({ ...edge(name, spec), peer: true })
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
  getRegistryPackageName(node(
    edge('react', 'npm:@org/react-fork@18.2.0'),
    peer('react', '^18.0.0')
  )),
  '@org/react-fork',
  'ordinary peer requirements constrain the alias slot, not its target'
)

t.equal(
  getRegistryPackageName(node(
    peer('react', '^18.0.0'),
    peer('react', 'npm:@org/react-fork@18.2.0')
  )),
  '@org/react-fork',
  'an explicit peer alias supplies the target for ordinary peers'
)

t.equal(
  getRegistryPackageName(node(peer('react', '^18.0.0'), peer('react', '~18.2.0'))),
  'react',
  'ordinary peer-only installations still supply a registry identity'
)

t.equal(
  getRegistryPackageName(node(
    edge('react', 'npm:@org/react-fork@18.2.0'),
    peer('react', 'npm:@other/react-fork@18.2.0')
  )),
  null,
  'conflicting explicit peer aliases are not ignored'
)

t.equal(
  getRegistryPackageName(node(
    edge('react', 'npm:@org/react-fork@18.2.0'),
    edge('react', '^18.0.0')
  )),
  null,
  'conflicting non-peer selections remain ambiguous'
)

for (const from of [{ isProjectRoot: true }, { isWorkspace: true }]) {
  t.equal(
    getRegistryPackageName(node(
      { ...edge('react', 'npm:@org/react-fork@18.2.0'), from },
      edge('react', '^18.0.0')
    )),
    '@org/react-fork',
    'ordinary consumers preserve an alias selected by the project or workspace'
  )
  t.equal(
    getRegistryPackageName(node(
      { ...edge('react', '^18.0.0'), from },
      edge('react', 'npm:@org/react-fork@18.2.0')
    )),
    null,
    'a transitive alias cannot replace the project or workspace selection'
  )
  t.equal(
    getRegistryPackageName(node(
      { ...edge('react', 'npm:@org/react-fork@18.2.0'), from },
      edge('react', 'npm:@other/react-fork@18.2.0')
    )),
    null,
    'a root alias does not excuse a conflicting explicit transitive alias'
  )
}

t.equal(
  getRegistryPackageName(node(
    { ...edge('react', 'npm:@org/react-fork@18.2.0'), from: { isProjectRoot: true } },
    { ...edge('react', 'npm:@other/react-fork@18.2.0'), from: { isWorkspace: true } }
  )),
  null,
  'conflicting project and workspace selections remain ambiguous'
)

t.equal(
  getRegistryPackageName(node(peer('react', 'https://example.com/react.tgz'))),
  null,
  'ordinary peers do not exempt non-registry specifications'
)

t.equal(
  getRegistryPackageName(node(peer('react', '^18.0.0'), peer('other', '^18.0.0'))),
  null,
  'conflicting peer-only identities fail closed'
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

const storeNode = node()
carryRegistryPackageName(isolated, storeNode)
t.equal(getRegistryPackageName(storeNode), '@npm/hoek', 'carries through both linked transformations')

const untrusted = node()
const misleading = node(edge('trusted', '1.0.0'))
carryRegistryPackageName(untrusted, misleading)
t.equal(getRegistryPackageName(misleading), null, 'a carried failure cannot be replaced by synthetic edges')

t.test('real aliases satisfy regular and optional peers', t => {
  for (const optional of [false, true]) {
    const root = new Node({
      path: t.testdirName,
      pkg: {
        dependencies: { react: 'npm:@org/react-fork@18.2.0', widget: '1.0.0' },
      },
    })
    const target = new Node({
      name: 'react',
      parent: root,
      pkg: { name: '@org/react-fork', version: '18.2.0' },
    })
    new Node({
      name: 'widget',
      parent: root,
      pkg: {
        name: 'widget',
        version: '1.0.0',
        peerDependencies: { react: '^18.0.0' },
        ...(optional ? { peerDependenciesMeta: { react: { optional: true } } } : {}),
      },
    })
    t.equal(target.edgesIn.size, 2, 'both declarations resolve to the installed alias')
    t.ok([...target.edgesIn].every(e => e.valid), 'both edges are satisfied')
    t.equal(getRegistryPackageName(target), '@org/react-fork', 'uses the selected alias target')
  }
  t.end()
})

t.test('uses the effective alias selected by an override', t => {
  const root = new Node({
    path: t.testdirName,
    loadOverrides: true,
    pkg: {
      dependencies: { widget: '1.0.0' },
      overrides: { react: 'npm:@org/react-fork@18.2.0' },
    },
  })
  const consumer = new Node({
    name: 'widget',
    parent: root,
    pkg: {
      name: 'widget',
      version: '1.0.0',
      dependencies: { react: '^18.0.0' },
    },
  })
  const target = new Node({
    name: 'react',
    parent: root,
    pkg: { name: '@org/react-fork', version: '18.2.0' },
  })
  t.equal(consumer.edgesOut.get('react').rawSpec, '^18.0.0')
  t.ok(consumer.edgesOut.get('react').valid)
  t.equal(getRegistryPackageName(target), '@org/react-fork')
  t.end()
})

t.test('accepted version ranges preserve the registry identity', t => {
  const root = new Node({ path: t.testdirName })
  const consumer = new Node({
    name: 'widget',
    parent: root,
    pkg: {
      name: 'widget',
      version: '1.0.0',
      dependencies: { abbrev: '^1.0.0' },
      acceptDependencies: { abbrev: '^2.0.0' },
    },
  })
  const target = new Node({
    name: 'abbrev',
    parent: root,
    pkg: { name: 'abbrev', version: '2.0.0' },
  })
  t.ok(consumer.edgesOut.get('abbrev').valid, 'the accepted range satisfies this edge')
  t.equal(getRegistryPackageName(target), 'abbrev')
  t.end()
})
