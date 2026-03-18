const t = require('tap')
const { load: loadMockNpm } = require('../../fixtures/mock-npm.js')
const MockRegistry = require('@npmcli/mock-registry')
const libnpmsearchResultFixture =
  require('../../fixtures/libnpmsearch-stream-result.js')

t.test('search', t => {
  t.test('no args', async t => {
    const { npm } = await loadMockNpm(t)
    await t.rejects(
      npm.exec('search', []),
      /search must be called with arguments/,
      'should throw usage instructions'
    )
  })

  t.test('<name> text', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t)
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: libnpmsearchResultFixture })
    await npm.exec('search', ['libnpm'])
    t.matchSnapshot(joinedOutput(), 'should have expected search results')
  })

  t.test('multiple terms text', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t)
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: libnpmsearchResultFixture })
    await npm.exec('search', ['libnpm', 'publish'])
    t.matchSnapshot(joinedOutput(), 'should have expected search results')
  })

  t.test('<name> --json', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, { config: { json: true } })
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: libnpmsearchResultFixture })

    await npm.exec('search', ['libnpm'])

    t.same(
      JSON.parse(joinedOutput()),
      libnpmsearchResultFixture,
      'should have expected search results as json'
    )
  })

  t.test('<name> --parseable', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, { config: { parseable: true } })
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: libnpmsearchResultFixture })
    await npm.exec('search', ['libnpm'])
    t.matchSnapshot(joinedOutput(), 'should have expected search results as parseable')
  })

  t.test('<name> --color', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, { config: { color: 'always' } })
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: libnpmsearchResultFixture })
    await npm.exec('search', ['libnpm'])
    t.matchSnapshot(joinedOutput(), 'should have expected search results with color')
  })

  t.test('multiple terms --color', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, { config: { color: 'always' } })
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: libnpmsearchResultFixture })
    await npm.exec('search', ['libnpm', 'publish'])
    t.matchSnapshot(joinedOutput(), 'should have expected search results with color')
  })

  t.test('/<name>/--color', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, { config: { color: 'always' } })
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: libnpmsearchResultFixture })
    await npm.exec('search', ['/libnpm/'])
    t.matchSnapshot(joinedOutput(), 'should have expected search results with color')
  })

  t.test('<name>', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t)
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: [{
      name: 'foo',
      scope: 'unscoped',
      version: '1.0.0',
      description: '',
      keywords: [],
      date: null,
      author: { name: 'Foo', email: 'foo@npmjs.com' },
      publisher: { username: 'foo', email: 'foo@npmjs.com' },
      maintainers: [
        { username: 'foo', email: 'foo@npmjs.com' },
      ],
    }, {
      name: 'custom-registry',
      scope: 'unscoped',
      version: '1.0.0',
      description: '',
      keywords: [],
      date: null,
      author: { name: 'Foo', email: 'foo@npmjs.com' },
      maintainers: [
        { username: 'foo', email: 'foo@npmjs.com' },
      ],
    }, {
      name: 'libnpmversion',
      scope: 'unscoped',
      version: '1.0.0',
      description: '',
      keywords: [],
      date: null,
      author: { name: 'Foo', email: 'foo@npmjs.com' },
      publisher: { username: 'foo', email: 'foo@npmjs.com' },
      maintainers: [
        { username: 'foo', email: 'foo@npmjs.com' },
      ],
    }] })

    await npm.exec('search', ['foo'])

    t.matchSnapshot(joinedOutput(), 'should have filtered expected search results')
  })

  t.test('no publisher', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t)
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: [{
      name: 'custom-registry',
      scope: 'unscoped',
      version: '1.0.0',
      description: '',
      keywords: [],
      date: null,
      author: { name: 'Foo', email: 'foo@npmjs.com' },
      maintainers: [
        { username: 'foo', email: 'foo@npmjs.com' },
      ],
    }, {
      name: 'libnpmversion',
      scope: 'unscoped',
      version: '1.0.0',
      description: '',
      keywords: [],
      date: null,
      author: { name: 'Foo', email: 'foo@npmjs.com' },
      publisher: { username: 'foo', email: 'foo@npmjs.com' },
      maintainers: [
        { username: 'foo', email: 'foo@npmjs.com' },
      ],
    }] })

    await npm.exec('search', ['custom'])

    t.matchSnapshot(joinedOutput(), 'should have filtered expected search results')
  })

  t.test('empty search results', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t)
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: [] })
    await npm.exec('search', ['foo'])

    t.matchSnapshot(joinedOutput(), 'should have expected search results')
  })

  t.test('empty search results --json', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, { config: { json: true } })
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: [] })

    await npm.exec('search', ['foo'])
    t.equal(joinedOutput(), '\n[]', 'should have expected empty square brackets')
  })

  t.test('api response error', async t => {
    const { npm } = await loadMockNpm(t)

    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ error: 'ERR' })

    await t.rejects(
      npm.exec('search', ['foo']),
      /ERR/,
      'should throw response error'
    )
  })

  t.test('exclude string', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      config: {
        searchexclude: 'libnpmversion',
      },
    })
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: libnpmsearchResultFixture })
    await npm.exec('search', ['libnpm'])
    t.matchSnapshot(joinedOutput(), 'results should not have libnpmversion')
  })
  t.test('exclude string json', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      config: {
        json: true,
        searchexclude: 'libnpmversion',
      },
    })
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: libnpmsearchResultFixture })
    await npm.exec('search', ['libnpm'])
    t.matchSnapshot(JSON.parse(joinedOutput()), 'results should not have libnpmversion')
  })

  t.test('exclude username with upper case letters', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, { config: { searchexclude: 'NLF' } })
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: libnpmsearchResultFixture })
    await npm.exec('search', ['libnpm'])
    t.matchSnapshot(joinedOutput(), 'results should not have nlf')
  })

  t.test('exclude regex', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, { config: { searchexclude: '/version/' } })
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: libnpmsearchResultFixture })
    await npm.exec('search', ['libnpm'])
    t.matchSnapshot(joinedOutput(), 'results should not have libnpmversion')
  })

  t.test('json output is not corrupted by redaction', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, { config: { json: true } })
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    const results = [{
      name: '@scope/pkg-name',
      scope: 'scope',
      version: '1.0.0',
      description: 'a]package with id 12345678-1234-1234-1234-123456789abc',
      keywords: [],
      date: '2020-01-01T00:00:00.000Z',
      author: { name: 'Foo', email: 'foo@npmjs.com' },
      publisher: { username: 'foo', email: 'foo@npmjs.com' },
      maintainers: [
        { username: 'foo', email: 'foo@npmjs.com' },
      ],
      sanitized_name: 'scope/pkg-name',
    }]
    registry.search({ results })

    await npm.exec('search', ['pkg-name'])
    const output = joinedOutput()
    const parsed = JSON.parse(output)
    t.equal(parsed[0].name, '@scope/pkg-name', 'name should not be redacted')
    t.match(parsed[0].description, /12345678/, 'uuid-like strings in values should not be redacted')
  })

  t.test('exclude forward slash', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, { config: { searchexclude: '/version' } })
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })

    registry.search({ results: libnpmsearchResultFixture })
    await npm.exec('search', ['libnpm'])
    t.matchSnapshot(joinedOutput(), 'results should not have libnpmversion')
  })
  t.end()
})
