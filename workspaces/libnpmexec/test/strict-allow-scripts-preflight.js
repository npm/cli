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

const fakeArb = (idealTree) => {
  const arb = {
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
