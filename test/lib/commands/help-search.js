const t = require('tap')
const { load: loadMockNpm } = require('../../fixtures/mock-npm.js')

t.test('help-search install', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t)
  await npm.exec('help-search', ['install'])
  t.matchSnapshot(joinedOutput(), 'outputs results')
})

t.test('help-search run install', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t)
  await npm.exec('help-search', ['run', 'install'])
  t.matchSnapshot(joinedOutput(), 'shows sorted hit counts for both terms')
})

t.test('help-search run script', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t)
  await npm.exec('help-search', ['run', 'script'])
  t.matchSnapshot(joinedOutput(), 'shows sorted hit counts for both terms')
})

t.test('--long', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: { long: true },
  })
  await npm.exec('help-search', ['exec'])
  t.matchSnapshot(joinedOutput(), 'outputs detailed results')
})

t.test('--color', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: { long: true, color: 'always' },
  })
  await npm.exec('help-search', ['help-search'])
  t.matchSnapshot(joinedOutput(), 'contains color highlighted search term')
})

t.test('npm help-search no args', async t => {
  const { npm } = await loadMockNpm(t)
  await t.rejects(
    npm.exec('help-search', []),
    { code: 'EUSAGE' },
    'outputs usage'
  )
})

t.test('npm help-search no matches', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t)
  await npm.exec('help-search', ['asdfasdf'])
  t.equal(joinedOutput(), 'No matches in help for: asdfasdf\n')
})
