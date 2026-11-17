const t = require('tap')
const Node = require('../lib/node.js')
const {
  carryRegistryPackageName,
  getRegistryPackageName,
} = require('../lib/registry-package-name.js')

const edge = (name, spec, options = {}) => ({ name, spec, valid: true, ...options })
const node = (...edgesIn) => ({ edgesIn: new Set(edgesIn) })
const alias = () => edge('slot', 'npm:@private/target@1.1.1')

t.test('derives registry identity from valid dependency specifications', t => {
  t.equal(getRegistryPackageName(node(edge('abbrev', '^1.0.0'))), 'abbrev')
  t.equal(getRegistryPackageName(node(alias())), '@private/target')
  t.equal(getRegistryPackageName(node(
    alias(),
    edge('slot', 'npm:@other/target@1.1.1', { valid: false })
  )), '@private/target', 'invalid edges do not change the identity')
  t.equal(getRegistryPackageName(node(
    alias(),
    edge('slot', 'npm:@other/target@1.1.1')
  )), null, 'conflicting explicit aliases are ambiguous')
  t.equal(getRegistryPackageName(node(
    alias(),
    edge('slot', '^1.0.0', { peer: true })
  )), '@private/target', 'ordinary peers constrain the alias slot')
  t.equal(getRegistryPackageName(node(
    edge('slot', '^1.0.0', { peer: true }),
    { ...alias(), peer: true }
  )), '@private/target', 'explicit peer aliases select the target')
  t.equal(getRegistryPackageName(node(
    edge('slot', '^1.0.0', { peer: true }),
    edge('slot', '~1.1.0', { peer: true })
  )), 'slot', 'ordinary peer-only nodes still have an identity')
  t.equal(getRegistryPackageName(node(
    alias(),
    edge('slot', '^1.0.0')
  )), null, 'ordinary transitive selections alone are ambiguous')
  for (const from of [{ isProjectRoot: true }, { isWorkspace: true }]) {
    t.equal(getRegistryPackageName(node(
      { ...alias(), from },
      edge('slot', '^1.0.0')
    )), '@private/target', 'project and workspace selections take precedence')
    t.equal(getRegistryPackageName(node(
      edge('slot', '^1.0.0', { from }),
      alias()
    )), null, 'a transitive alias cannot replace a root selection')
  }
  for (const spec of ['https://example.test/pkg.tgz', 'file:../pkg', 'npm:']) {
    t.equal(getRegistryPackageName(node(edge('pkg', spec))), null, spec)
  }
  t.equal(getRegistryPackageName(node(edge(undefined, '1.0.0'))), null)
  t.equal(getRegistryPackageName({}), null)
  t.equal(getRegistryPackageName({ edgesIn: {} }), null)
  t.equal(getRegistryPackageName(node()), null)
  t.end()
})

t.test('preserves trusted identity across linked transformations', t => {
  const source = node(alias())
  const proxy = node()
  const store = node()
  carryRegistryPackageName(source, proxy)
  carryRegistryPackageName(proxy, store)
  t.equal(getRegistryPackageName(store), '@private/target')
  carryRegistryPackageName(node(), source)
  t.equal(getRegistryPackageName(source), null, 'carried ambiguity overrides synthetic edges')
  t.end()
})

t.test('uses v10 override and bundled dependency semantics', t => {
  const root = new Node({
    path: t.testdirName,
    loadOverrides: true,
    pkg: {
      dependencies: { widget: '1.0.0' },
      overrides: { slot: 'npm:@private/target@1.1.1' },
    },
  })
  const consumer = new Node({
    name: 'widget',
    parent: root,
    pkg: {
      name: 'widget',
      version: '1.0.0',
      dependencies: { slot: '^1.0.0' },
    },
  })
  const target = new Node({
    name: 'slot',
    parent: consumer,
    pkg: { name: '@untrusted/metadata', version: '1.1.1' },
  })
  t.ok(consumer.edgesOut.get('slot').valid)
  t.equal(getRegistryPackageName(target), '@private/target', 'uses the effective override')
  for (const flag of ['hasShrinkwrap', 'inShrinkwrap', 'inBundle']) {
    t.equal(getRegistryPackageName({
      [flag]: true,
      edgesIn: target.edgesIn,
    }), 'slot', `${flag} uses the raw spec, as v10 Edge.satisfiedBy does`)
  }
  t.end()
})
