const t = require('tap')
const requireInject = require('require-inject')
const enforceClean = requireInject('../lib/enforce-clean.js', {
  '@npmcli/git': {
    isClean: async ({ cwd }) => {
      switch (cwd) {
        case 'clean': return true
        case 'unclean': return false
        case 'nogit': throw Object.assign(new Error('no git'), {
          code: 'ENOGIT',
        })
        case 'error': throw new Error('poop')
        default:
          console.error('unknown cwd: %j', cwd)
          process.exit(1)
      }
    },
  },
  'proc-log': { warn: (...msg) => warnings.push(msg) },
})

const warnings = []

t.afterEach(() => {
  warnings.length = 0
})

t.test('clean, ok', async t => {
  await t.resolveMatch(enforceClean({ cwd: 'clean' }), true)
  t.strictSame(warnings, [])
})

t.test('unclean, no force, throws', async t => {
  await t.rejects(enforceClean({ cwd: 'unclean' }))
  t.strictSame(warnings, [])
})

t.test('unclean, forced, no throw', async t => {
  await t.resolveMatch(enforceClean({ cwd: 'unclean', force: true }), true)
  t.strictSame(warnings, [
    [
      'version',
      'Git working directory not clean, proceeding forcefully.',
    ],
  ])
})

t.test('nogit, return false, no throw', async t => {
  await t.resolveMatch(enforceClean({ cwd: 'nogit' }), false)
  t.strictSame(warnings, [
    [
      'version',
      'This is a Git checkout, but the git command was not found.',
      'npm could not create a Git tag for this release!',
    ],
  ])
})

t.test('other error, throw it', async t => {
  await t.rejects(enforceClean({ cwd: 'error' }), new Error('poop'))
  t.strictSame(warnings, [])
})
