const { test } = require('tap')
const requireInject = require('require-inject')

test('should run dedupe in dryRun mode', (t) => {
  const FindDupes = requireInject('../../lib/find-dupes.js', {
    '../../lib/dedupe.js': function (args, cb) {
      t.ok(args.dryRun, 'dryRun is true')
      cb()
    },
  })
  const findDupes = new FindDupes()
  findDupes.exec(null, () => {
    t.ok(true, 'callback is called')
    t.end()
  })
})
