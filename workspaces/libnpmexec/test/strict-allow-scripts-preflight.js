const t = require('tap')

const strictAllowScriptsPreflight = require('../lib/strict-allow-scripts-preflight.js')

// a node carrying install scripts that the policy has not reviewed
const unreviewedTree = {
  inventory: new Map([
    ['node_modules/has-scripts', {
      name: 'has-scripts',
      location: 'node_modules/has-scripts',
      package: { scripts: { install: 'node-gyp rebuild' } },
    }],
  ]),
}

const orphanTree = {
  inventory: new Map([
    ['node_modules/orphan', {
      name: 'orphan',
      location: 'node_modules/orphan',
      resolved: 'https://registry.npmjs.org/orphan/-/orphan-1.0.0.tgz',
      extraneous: true,
      isRegistryDependency: false,
      edgesIn: new Set(),
      parent: null,
      linksIn: new Set(),
      package: { scripts: { install: 'node-gyp rebuild' } },
    }],
  ]),
}

const fakeArb = (idealTree, options = {}) => {
  const arb = {
    options,
    idealTree,
    buildIdealTreeCalled: false,
    async buildIdealTree () {
      arb.buildIdealTreeCalled = true
      arb.idealTree = unreviewedTree
    },
  }
  return arb
}

t.test('no-op when strictAllowScripts is not set', async t => {
  const arb = fakeArb(unreviewedTree)
  await t.resolves(strictAllowScriptsPreflight(arb, {}))
  t.notOk(arb.buildIdealTreeCalled, 'does not build the ideal tree')
})

t.test('bypassed by ignoreScripts', async t => {
  const arb = fakeArb(unreviewedTree)
  await t.resolves(strictAllowScriptsPreflight(arb,
    { strictAllowScripts: true, ignoreScripts: true }))
  t.notOk(arb.buildIdealTreeCalled, 'does not build the ideal tree')
})

t.test('bypassed by dangerouslyAllowAllScripts', async t => {
  const arb = fakeArb(unreviewedTree)
  await t.resolves(strictAllowScriptsPreflight(arb,
    { strictAllowScripts: true, dangerouslyAllowAllScripts: true }))
  t.notOk(arb.buildIdealTreeCalled, 'does not build the ideal tree')
})

t.test('builds the ideal tree when missing', async t => {
  const arb = fakeArb(null)
  await t.rejects(
    strictAllowScriptsPreflight(arb, { strictAllowScripts: true }),
    /install scripts/i,
    'throws on unreviewed scripts'
  )
  t.ok(arb.buildIdealTreeCalled, 'builds the ideal tree')
})

t.test('throws when unreviewed scripts are present', async t => {
  const arb = fakeArb(unreviewedTree)
  await t.rejects(
    strictAllowScriptsPreflight(arb, { strictAllowScripts: true }),
    { code: 'ESTRICTALLOWSCRIPTS' },
    'throws with the strict-allow-scripts error'
  )
})

t.test('only skips extraneous nodes when pruning is enabled', async t => {
  const cases = [
    ['default pruning', {}, {}, true],
    ['constructor disables pruning', { prune: false }, {}, false],
    ['call disables pruning', {}, { prune: false }, false],
    ['call overrides enabled pruning', { prune: true }, { prune: false }, false],
    ['call overrides disabled pruning', { prune: false }, { prune: true }, true],
    ['explicit undefined restores the default', { prune: false }, { prune: undefined }, true],
  ]
  for (const [name, options, opts, skips] of cases) {
    await t.test(name, async t => {
      const arb = fakeArb(orphanTree, options)
      const result = strictAllowScriptsPreflight(arb, {
        strictAllowScripts: true,
        allowScripts: { orphan: false },
        ...opts,
      })
      if (skips) {
        await t.resolves(result)
      } else {
        await t.rejects(result, { code: 'ESTRICTALLOWSCRIPTS', message: /orphan/ })
      }
      t.notOk(arb.buildIdealTreeCalled, 'reuses the ideal tree')
    })
  }
})

t.test('skips orphans in a newly built ideal tree', async t => {
  const arb = fakeArb(null)
  arb.buildIdealTree = async () => {
    arb.idealTree = orphanTree
  }
  await t.resolves(strictAllowScriptsPreflight(arb, { strictAllowScripts: true }))
  t.equal(arb.idealTree, orphanTree, 'built the ideal tree')
})

t.test('does not skip an extraneous target with an incoming link', async t => {
  const target = {
    ...orphanTree.inventory.get('node_modules/orphan'),
    linksIn: new Set([{}]),
  }
  const arb = fakeArb({ inventory: new Map([['node_modules/orphan', target]]) })
  await t.rejects(strictAllowScriptsPreflight(arb, {
    strictAllowScripts: true,
    allowScripts: { orphan: false },
  }), { code: 'ESTRICTALLOWSCRIPTS', message: /orphan/ })
})

t.test('skipping an orphan does not skip a required unreviewed package', async t => {
  const arb = fakeArb({
    inventory: new Map([...orphanTree.inventory, ...unreviewedTree.inventory]),
  })
  await t.rejects(strictAllowScriptsPreflight(arb, { strictAllowScripts: true }), {
    code: 'ESTRICTALLOWSCRIPTS',
    message: /1 package\(s\) have install scripts not covered by allowScripts:\n {2}has-scripts/,
  })
})

t.test('resolves when the only unreviewed node is inert', async t => {
  // Inert deps (platform/engine-incompatible) are removed before any script
  // runs, so strict mode must not reject them (npm/cli#9562).
  const inertTree = {
    inventory: new Map([
      ['node_modules/has-scripts', {
        name: 'has-scripts',
        location: 'node_modules/has-scripts',
        inert: true,
        package: { scripts: { install: 'node-gyp rebuild' } },
      }],
    ]),
  }
  const arb = fakeArb(inertTree)
  await t.resolves(
    strictAllowScriptsPreflight(arb, { strictAllowScripts: true }),
    'no error when the unreviewed node is inert'
  )
})

t.test('resolves when no unreviewed scripts are present', async t => {
  const cleanTree = {
    inventory: new Map([
      ['node_modules/no-scripts', {
        name: 'no-scripts',
        location: 'node_modules/no-scripts',
        package: {},
      }],
    ]),
  }
  const arb = fakeArb(cleanTree)
  await t.resolves(
    strictAllowScriptsPreflight(arb, { strictAllowScripts: true }),
    'no error when nothing is unreviewed'
  )
})
