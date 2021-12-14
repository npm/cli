const t = require('tap')
const requireInject = require('require-inject')
let tag
const retrieveTag = requireInject('../lib/retrieve-tag.js', {
  '@npmcli/git': {
    spawn: async (cmd, opts) => ({ stdout: tag + '\n' }),
  },
})

t.test('not a valid semver tag', t => {
  tag = 'this is not a version'
  return t.rejects(retrieveTag(), {
    message: 'Tag is not a valid version: "this is not a version"',
  })
})

t.test('yes a valid semver tag', async t => {
  tag = 'this is a version tho: Release-1.2.3 candidate'
  t.equal(await retrieveTag(), '1.2.3')
})
