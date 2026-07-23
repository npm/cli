const t = require('tap')
const { logObject, logStageItem, defaultPredicate } = require('../../../lib/utils/key-values.js')
const { load: loadMockNpm } = require('../../fixtures/mock-npm.js')

t.test('defaultPredicate skips null and undefined', t => {
  t.equal(defaultPredicate('k', null), null)
  t.equal(defaultPredicate('k', undefined), null)
  t.equal(defaultPredicate('k', 'val'), 'val')
  t.end()
})

t.test('logObject json mode', async t => {
  const { joinedOutput } = await loadMockNpm(t)
  logObject({ a: 1, b: 2 }, { json: true })
  const out = JSON.parse(joinedOutput())
  t.same(out, { a: 1, b: 2 })
})

t.test('logObject skips null values with default predicate', async t => {
  const { joinedOutput } = await loadMockNpm(t)
  logObject({ a: 'yes', b: null, c: 'also' })
  const out = joinedOutput()
  t.match(out, /a: yes/)
  t.match(out, /c: also/)
  t.notMatch(out, /b:/)
})

t.test('logStageItem includes extra properties', async t => {
  const { joinedOutput } = await loadMockNpm(t)
  logStageItem({
    id: 'abc',
    packageName: 'pkg',
    version: '1.0.0',
    tag: 'latest',
    createdAt: '2026-01-01',
    actor: 'user',
    actorType: 'human',
    shasum: 'sha1',
    extra: 'bonus',
  })
  const out = joinedOutput()
  t.match(out, /extra: bonus/)
  t.match(out, /package name: pkg/)
})

t.test('logObject with custom predicate', async t => {
  const { joinedOutput } = await loadMockNpm(t)
  logObject({ a: 'one', b: 'two' }, {
    predicate: (key, value) => `[${value}]`,
  })
  const out = joinedOutput()
  t.match(out, /a: \[one\]/)
  t.match(out, /b: \[two\]/)
})

t.test('logStageItem without actorType shows actor alone', async t => {
  const { joinedOutput } = await loadMockNpm(t)
  logStageItem({
    id: 'abc',
    packageName: 'pkg',
    version: '1.0.0',
    tag: 'latest',
    createdAt: '2026-01-01',
    actor: 'user',
    shasum: 'sha1',
  })
  const out = joinedOutput()
  t.match(out, /staged by: user/)
  t.notMatch(out, /\(/)
})

t.test('logObject with all values skipped produces no output', async t => {
  const { joinedOutput } = await loadMockNpm(t)
  logObject({ a: null, b: undefined })
  t.equal(joinedOutput(), '')
})
