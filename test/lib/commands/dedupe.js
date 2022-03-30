const t = require('tap')
const { load: loadMockNpm } = require('../../fixtures/mock-npm')
const path = require('path')
const fs = require('fs')

const MockRegistry = require('../../fixtures/mock-registry.js')

t.test('should throw in global mode', async (t) => {
  const { npm } = await loadMockNpm(t, {
    config: {
      global: true,
    },
  })
  t.rejects(
    npm.exec('dedupe', []),
    { code: 'EDEDUPEGLOBAL' },
    'throws EDEDUPEGLOBALE'
  )
})

const testTop = {
  name: 'test-top',
  version: '1.0.0',
  dependencies: {
    'test-dep-a': '*',
    'test-dep-b': '*',
  },
}
const testDepA = {
  name: 'test-dep-a',
  version: '1.0.1',
  dependencies: { 'test-sub': '*' },
}
const testDepB = {
  name: 'test-dep-b',
  version: '1.0.0',
  dependencies: { 'test-sub': '*' },
}
const testSub = {
  name: 'test-sub',
  version: '1.0.0',
}

const treeWithDupes = {
  'package.json': JSON.stringify(testTop),
  node_modules: {
    'test-dep-a': {
      'package.json': JSON.stringify(testDepA),
      node_modules: {
        'test-sub': {
          'package.json': JSON.stringify(testSub),
        },
      },
    },
    'test-dep-b': {
      'package.json': JSON.stringify(testDepB),
      node_modules: {
        'test-sub': {
          'package.json': JSON.stringify(testSub),
        },
      },
    },
  },
}

t.test('dedupe', async (t) => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    prefixDir: treeWithDupes,
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  const manifestSub = registry.manifest({
    name: 'test-sub',
    packuments: [{ version: '1.0.0' }],
  })

  await registry.package({
    manifest: manifestSub,
    tarballs: {
      '1.0.0': path.join(npm.prefix, 'node_modules', 'test-dep-a', 'node_modules', 'test-sub'),
    },
  })
  await npm.exec('dedupe', [])
  t.match(joinedOutput(), /added 1 package, and removed 2 packages/)
  t.ok(fs.existsSync(path.join(npm.prefix, 'node_modules', 'test-sub')), 'test-sub was hoisted')
  t.notOk(
    fs.existsSync(path.join(npm.prefix, 'node_modules', 'test-dep-a', 'node_modules', 'test-sub')),
    'test-dep-a/test-sub was removed'
  )
  t.notOk(
    fs.existsSync(path.join(npm.prefix, 'node_modules', 'test-dep-b', 'node_modules', 'test-sub')),
    'test-dep-b/test-sub was removed')
})
