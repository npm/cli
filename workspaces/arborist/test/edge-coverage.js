const t = require('tap')
const Edge = require('../lib/edge.js')
const Node = require('../lib/node.js')
const OverrideSet = require('../lib/override-set.js')

t.test('edge error handling coverage', async (t) => {
  // Test line 282 - conflicting overrides case
  t.test('conflicting overrides INVALID error', (t) => {
    const parent = new Node({ name: 'parent', version: '1.0.0', path: '/test' })
    const child = new Node({
      name: 'child',
      version: '1.0.0',
      path: '/test/child',
    })

    // Create conflicting override sets using proper constructor
    const parentOverrides = new OverrideSet({ overrides: { child: '2.0.0' } })
    const childOverrides = new OverrideSet({ overrides: { child: '1.0.0' } })

    // Create edge
    const edge = new Edge({
      from: parent,
      to: child,
      type: 'prod',
      name: 'child',
      spec: '^1.0.0',
    })

    // Set overrides on the edge and child
    edge.overrides = parentOverrides
    child.overrides = childOverrides

    // Add dependency to child to trigger edgesOut.size check
    const grandchild = new Node({
      name: 'grandchild',
      version: '1.0.0',
      path: '/test/child/grandchild',
    })
    child.addEdgeOut(
      new Edge({
        from: child,
        to: grandchild,
        type: 'prod',
        name: 'grandchild',
        spec: '^1.0.0',
      })
    )

    // Mock the conflict detection to return true
    const originalConflict = OverrideSet.doOverrideSetsConflict
    OverrideSet.doOverrideSetsConflict = () => true

    try {
      // Check that error is set to INVALID due to conflicting overrides
      const error = edge.explain()
      t.equal(
        error,
        'INVALID',
        'conflicting overrides should cause INVALID error'
      )
    } finally {
      OverrideSet.doOverrideSetsConflict = originalConflict
    }

    t.end()
  })

  // Test lines 325-326 - override set update propagation
  t.test('override set update propagation', (t) => {
    const parent = new Node({ name: 'parent', version: '1.0.0', path: '/test' })
    const child = new Node({
      name: 'child',
      version: '1.0.0',
      path: '/test/child',
    })

    const edge = new Edge({
      from: parent,
      to: child,
      type: 'prod',
      name: 'child',
      spec: '^1.0.0',
    })

    // Mock the update methods to verify they're called
    let removedCalled = false
    let addedCalled = false
    child.updateOverridesEdgeInRemoved = () => {
      removedCalled = true
    }
    child.updateOverridesEdgeInAdded = () => {
      addedCalled = true
    }

    // Create old and new override sets
    const oldOverrides = new OverrideSet({ overrides: { child: '1.0.0' } })
    const newOverrides = new OverrideSet({ overrides: { child: '2.0.0' } })

    // Set initial overrides
    edge.overrides = oldOverrides

    // Update the edge overrides (should trigger propagation)
    edge.overrides = newOverrides

    t.ok(removedCalled, 'updateOverridesEdgeInRemoved should be called')
    t.ok(addedCalled, 'updateOverridesEdgeInAdded should be called')
    t.end()
  })
})
