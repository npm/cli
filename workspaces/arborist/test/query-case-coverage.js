const t = require('tap')
const q = require('../lib/query-selector-all.js')
const Arborist = require('../lib/index.js')

t.test('query-selector-all Windows case coverage', async (t) => {
  const originalPlatform = process.platform

  try {
    // Mock Windows platform
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      configurable: true,
    })

    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-query-case',
        version: '1.0.0',
      }),
      node_modules: {
        'MixedCase-Package': {
          'package.json': JSON.stringify({
            name: 'MixedCase-Package',
            version: '1.0.0',
          }),
        },
      },
    })

    const arborist = new Arborist({ path })
    const tree = await arborist.loadActual()

    // Test with various case combinations to ensure matchPath lowercase conversion
    const results1 = await q(tree, '*:path(NODE_MODULES/mixedcase-package)')
    const results2 = await q(tree, '*:path(node_modules/MIXEDCASE-PACKAGE)')
    const results3 = await q(tree, '*:path(Node_Modules/MixedCase-Package)')

    t.same(
      results1.map((n) => n.name),
      ['MixedCase-Package'],
      'uppercase path with lowercase package'
    )
    t.same(
      results2.map((n) => n.name),
      ['MixedCase-Package'],
      'lowercase path with uppercase package'
    )
    t.same(
      results3.map((n) => n.name),
      ['MixedCase-Package'],
      'mixed case path and package'
    )
  } finally {
    // Restore original platform
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      configurable: true,
    })
  }
})
