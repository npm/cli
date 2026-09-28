const t = require('tap')

const {
  isRegistryResolvedTarball,
  registryResolved,
} = require('../lib/registry-resolved.js')

const registryNode = resolved => ({
  name: 'example',
  resolved,
  isRegistryDependency: true,
})

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
