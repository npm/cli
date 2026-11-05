const t = require('tap')
const { resolve } = require('node:path')
const Node = require('../lib/node.js')
const { carryRegistryPackageName } = require('../lib/registry-package-name.js')

const {
  isRegistryResolvedTarball,
  registryResolved,
} = require('../lib/registry-resolved.js')

const registryNode = (resolved, {
  name = 'example',
  spec = '1.0.0',
  packageName = name,
  version = '1.0.0',
  overrides,
} = {}) => {
  const root = new Node({
    path: resolve(__dirname, 'registry-root'),
    loadOverrides: !!overrides,
    pkg: {
      name: 'root',
      version: '1.0.0',
      dependencies: { [name]: spec },
      overrides,
    },
  })
  return new Node({
    name,
    parent: root,
    resolved,
    pkg: { name: packageName, version },
  })
}

t.test('rewrites a full replaceRegistryHost URL including its path', t => {
  const options = {
    registry: 'https://mirror.example.com/npm/a',
    replaceRegistryHost: 'https://registry.example.com/npm/b',
  }

  t.equal(
    registryResolved(
      'https://registry.example.com/npm/b/example/-/example-1.0.0.tgz',
      options
    ),
    'https://mirror.example.com/npm/a/example/-/example-1.0.0.tgz'
  )
  t.equal(
    isRegistryResolvedTarball(
      registryNode('https://registry.example.com/npm/b/example/-/example-1.0.0.tgz'),
      options
    ),
    true
  )
  t.end()
})

t.test('preserves a configured registry path with default host replacement', t => {
  const options = {
    registry: 'https://mirror.example.com/npm/a',
    replaceRegistryHost: 'registry.example.com',
  }

  t.equal(
    registryResolved(
      'https://registry.example.com/example/-/example-1.0.0.tgz',
      options
    ),
    'https://mirror.example.com/npm/a/example/-/example-1.0.0.tgz'
  )
  t.end()
})

t.test('returns the original URL when replacement does not apply', t => {
  const resolved = 'https://remote.example.com/example-1.0.0.tgz'
  const options = {
    registry: 'https://mirror.example.com/npm/a',
    replaceRegistryHost: 'https://other.example.com/npm/b',
  }

  t.equal(registryResolved(resolved, options), resolved)
  t.end()
})

t.test('rewrites but does not exempt non-registry remote dependencies', t => {
  const node = {
    name: 'example',
    resolved: 'https://remote.example.com/npm/b/example-1.0.0.tgz',
    isRegistryDependency: false,
  }
  const options = {
    registry: 'https://mirror.example.com/npm/a',
    replaceRegistryHost: 'https://remote.example.com/npm/b',
  }

  t.equal(
    registryResolved(node.resolved, options),
    'https://mirror.example.com/npm/a/example-1.0.0.tgz'
  )
  t.equal(isRegistryResolvedTarball(node, options), false)
  t.end()
})

t.test('does not exempt same-origin tarballs outside the registry path', t => {
  const options = {
    registry: 'https://registry.example.com/npm',
    replaceRegistryHost: 'never',
  }

  t.equal(
    isRegistryResolvedTarball(
      registryNode('https://registry.example.com/other/example-1.0.0.tgz'),
      options
    ),
    false
  )
  t.end()
})

t.test('full-URL replacement matches the port as well as the hostname', t => {
  const options = {
    registry: 'https://mirror.example.com/npm/a',
    replaceRegistryHost: 'https://registry.example.com:8443/npm/b',
  }
  const otherPort = 'https://registry.example.com:9443/npm/b/example-1.0.0.tgz'
  t.equal(registryResolved(otherPort, options), otherPort, 'does not rewrite another port')
  t.equal(
    registryResolved('https://registry.example.com:8443/npm/b/example-1.0.0.tgz', options),
    'https://mirror.example.com/npm/a/example-1.0.0.tgz',
    'still rewrites the matching host and port'
  )
  t.end()
})

t.test('registry replacement preserves file, directory and Git sources', t => {
  const options = {
    registry: 'https://mirror.example.com/npm',
    replaceRegistryHost: 'always',
  }
  for (const resolved of [
    'file:../example-1.0.0.tgz',
    'file:///C:/packages/example-1.0.0.tgz',
    'file:../example',
    'git+https://git.example.com/example.git#0123456789012345678901234567890123456789',
    'git+ssh://git@git.example.com/example.git',
  ]) {
    t.equal(registryResolved(resolved, options), resolved)
  }
  t.end()
})

const aliasOptions = {
  registry: 'https://default.example.com/',
  '@private:registry': 'https://private.example.com/',
  replaceRegistryHost: 'never',
}

t.test('registry exemptions use the declared alias target', t => {
  const identity = { name: 'alias', spec: 'npm:@private/pkg@1', packageName: '@private/pkg' }
  t.equal(
    isRegistryResolvedTarball(
      registryNode('https://private.example.com/pkg-1.0.0.tgz', identity),
      aliasOptions
    ),
    true,
    'allows the target registry'
  )
  t.equal(
    isRegistryResolvedTarball(
      registryNode('https://default.example.com/pkg-1.0.0.tgz', identity),
      aliasOptions
    ),
    false,
    'does not trust the installed alias slot as the package identity'
  )
  t.end()
})

t.test('ordinary consumers and peers do not redefine a root-selected alias', t => {
  const node = registryNode('https://private.example.com/pkg-1.0.0.tgz', {
    name: 'alias',
    spec: 'npm:@private/pkg@1',
    packageName: '@private/pkg',
  })
  for (const field of ['dependencies', 'peerDependencies']) {
    new Node({
      parent: node.root,
      name: field,
      pkg: { name: field, version: '1.0.0', [field]: { alias: '*' } },
    })
  }
  t.equal(isRegistryResolvedTarball(node, aliasOptions), true)
  t.end()
})

t.test('conflicting alias declarations cannot grant an exemption', t => {
  const node = registryNode('https://default.example.com/pkg-1.0.0.tgz', {
    name: 'alias',
    spec: 'npm:@private/pkg@1',
    packageName: '@private/pkg',
  })
  new Node({
    parent: node.root,
    name: 'consumer',
    pkg: { name: 'consumer', version: '1.0.0', dependencies: { alias: 'npm:@other/pkg@1' } },
  })
  t.equal(isRegistryResolvedTarball(node, aliasOptions), false)
  t.end()
})

t.test('package metadata and invalid edges cannot supply registry identity', t => {
  const resolved = 'https://private.example.com/pkg-1.0.0.tgz'
  t.equal(
    isRegistryResolvedTarball(
      registryNode(resolved, { name: 'alias', packageName: '@private/pkg' }),
      aliasOptions
    ),
    false,
    'does not use a self-reported package name'
  )
  t.equal(
    isRegistryResolvedTarball(
      registryNode('https://default.example.com/pkg-1.0.0.tgz', { spec: '^2.0.0' }),
      aliasOptions
    ),
    false,
    'requires a valid dependency declaration'
  )
  t.equal(
    isRegistryResolvedTarball({
      name: 'example',
      resolved: 'https://default.example.com/pkg-1.0.0.tgz',
      isRegistryDependency: true,
      edgesIn: new Set(),
    }, aliasOptions),
    false,
    'serialized flags alone cannot grant an exemption'
  )
  t.end()
})

t.test('conditional override fallback preserves the selected package identity', t => {
  const node = registryNode('https://default.example.com/example-1.2.4.tgz', {
    spec: '^1.0.0',
    version: '1.2.4',
    overrides: { 'example@1.2.3': 'npm:@private/pkg@9.0.0' },
  })
  t.equal(isRegistryResolvedTarball(node, aliasOptions), true)
  t.end()
})

t.test('bundled dependencies retain their original identity instead of an override', t => {
  const bundler = registryNode('https://default.example.com/bundler-1.0.0.tgz', {
    name: 'bundler',
    overrides: { 'example@1.2.3': 'npm:@private/pkg@9.0.0' },
  })
  bundler.package = {
    ...bundler.package,
    dependencies: { example: '^1.0.0' },
    bundleDependencies: ['example'],
  }
  const node = new Node({
    name: 'example',
    parent: bundler,
    resolved: 'https://default.example.com/example-1.2.3.tgz',
    pkg: { name: 'example', version: '1.2.3' },
  })
  t.equal(isRegistryResolvedTarball(node, aliasOptions), true)
  t.end()
})

t.test('a valid peer-only declaration can identify its registry package', t => {
  const node = registryNode('https://private.example.com/pkg-1.0.0.tgz', {
    name: '@private/pkg',
  })
  node.root.edgesOut.get(node.name).detach()
  new Node({
    parent: node.root,
    name: 'consumer',
    pkg: {
      name: 'consumer',
      version: '1.0.0',
      peerDependencies: { '@private/pkg': '*' },
    },
  })
  t.equal(isRegistryResolvedTarball(node, aliasOptions), true)
  t.end()
})

t.test('linked transformations carry trusted identity without trusting copied metadata', t => {
  const source = registryNode('https://private.example.com/pkg-1.0.0.tgz', {
    name: 'alias',
    spec: 'npm:@private/pkg@1',
    packageName: '@private/pkg',
  })
  const proxy = {}
  const store = {
    name: 'untrusted-slot',
    package: { name: '@other/pkg' },
    resolved: source.resolved,
    edgesIn: new Set(),
  }
  carryRegistryPackageName(source, proxy)
  carryRegistryPackageName(proxy, store)
  t.equal(isRegistryResolvedTarball(store, aliasOptions), true)
  store.resolved = 'https://default.example.com/pkg-1.0.0.tgz'
  t.equal(isRegistryResolvedTarball(store, aliasOptions), false)
  t.end()
})

t.test('unverifiable or malformed identity cannot be carried into an exemption', t => {
  for (const edgesIn of [
    undefined,
    {},
    new Set([{ valid: true, name: 'example', spec: 'npm:./local-package' }]),
    new Set([{ valid: true, spec: '*' }]),
  ]) {
    const source = {
      name: 'example',
      package: { name: '@private/pkg' },
      resolved: 'https://default.example.com/pkg-1.0.0.tgz',
      isRegistryDependency: true,
      edgesIn,
    }
    const store = { ...source, edgesIn: new Set() }
    carryRegistryPackageName(source, store)
    t.equal(isRegistryResolvedTarball(store, aliasOptions), false)
  }
  t.end()
})

t.test('unparseable tarball and registry URLs fail closed', t => {
  const node = registryNode('https://default.example.com/example-1.0.0.tgz')
  const options = { ...aliasOptions, registry: 'not a registry URL' }
  t.equal(registryResolved(node.resolved, options), undefined)
  t.equal(isRegistryResolvedTarball(node, options), false)
  node.resolved = 'https://%'
  t.equal(registryResolved(node.resolved, aliasOptions), undefined)
  t.equal(isRegistryResolvedTarball(node, aliasOptions), false)
  t.end()
})
