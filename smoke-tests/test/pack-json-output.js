
const t = require('tap')
const setup = require('./fixtures/setup.js')

t.test('pack --json returns only json on stdout', async t => {
  const { npmLocal } = await setup(t)

  const { stderr, stdout } = await npmLocal('pack', '--json', { force: true })

  t.match(stderr, /> npm@.* prepack\n/, 'stderr has banner')
  t.ok(JSON.parse(stdout), 'stdout can be parsed as json')
})
