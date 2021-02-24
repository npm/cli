const { test } = require('tap')
const requireInject = require('require-inject')

test('should throw in global mode', (t) => {
  const Dedupe = requireInject('../../lib/dedupe.js')
  const dedupe = new Dedupe({ flatOptions: { global: true } })

  dedupe.exec([], er => {
    t.match(er, { code: 'EDEDUPEGLOBAL' }, 'throws EDEDUPEGLOBAL')
    t.end()
  })
})

test('should remove dupes using Arborist', (t) => {
  const Dedupe = requireInject('../../lib/dedupe.js', {
    '@npmcli/arborist': function (args) {
      t.ok(args, 'gets options object')
      t.ok(args.path, 'gets path option')
      t.ok(args.dryRun, 'gets dryRun from user')
      this.dedupe = () => {
        t.ok(true, 'dedupe is called')
      }
    },
    '../../lib/utils/reify-finish.js': (npm, arb) => {
      t.ok(arb, 'gets arborist tree')
    },
  })
  const dedupe = new Dedupe({
    prefix: 'foo',
    flatOptions: {
      dryRun: 'false',
    },
  })
  dedupe.exec({ dryRun: true }, er => {
    if (er)
      throw er
    t.ok(true, 'callback is called')
    t.end()
  })
})

test('should remove dupes using Arborist - no arguments', (t) => {
  const Dedupe = requireInject('../../lib/dedupe.js', {
    '@npmcli/arborist': function (args) {
      t.ok(args.dryRun, 'gets dryRun from flatOptions')
      this.dedupe = () => {}
    },
    '../../lib/utils/reify-output.js': () => {},
  })
  const dedupe = new Dedupe({
    prefix: 'foo',
    flatOptions: {
      dryRun: 'true',
    },
  })
  dedupe.exec(null, () => {
    t.end()
  })
})
