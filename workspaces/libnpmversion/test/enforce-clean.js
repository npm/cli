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

t.test('clean, ok', t =>
  t.resolveMatch(enforceClean({ cwd: 'clean' }), true)
    .then(() => t.strictSame(warnings, []))
    .then(() => {
      warnings.length = 0
    }))

t.test('unclean, no force, throws', t =>
  t.rejects(enforceClean({ cwd: 'unclean' }))
    .then(() => t.strictSame(warnings, []))
    .then(() => {
      warnings.length = 0
    }))

t.test('unclean, forced, no throw', t =>
  t.resolveMatch(enforceClean({ cwd: 'unclean', force: true }), true)
    .then(() => t.strictSame(warnings, [
      [
        'version',
        'Git working directory not clean, proceeding forcefully.',
      ],
    ]))
    .then(() => {
      warnings.length = 0
    }))

t.test('nogit, return false, no throw', t =>
  t.resolveMatch(enforceClean({ cwd: 'nogit' }), false)
    .then(() => t.strictSame(warnings, [
      [
        'version',
        'This is a Git checkout, but the git command was not found.',
        'npm could not create a Git tag for this release!',
      ],
    ]))
    .then(() => {
      warnings.length = 0
    }))

t.test('other error, throw it', t =>
  t.rejects(enforceClean({ cwd: 'error' }), new Error('poop'))
    .then(() => t.strictSame(warnings, []))
    .then(() => {
      warnings.length = 0
    }))
