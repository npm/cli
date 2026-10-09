const t = require('tap')
const { existsSync } = require('node:fs')
const { basename, join, resolve } = require('node:path')
const tmock = require('../../fixtures/tmock')
const mockNpm = require('../../fixtures/mock-npm')
const MockRegistry = require('@npmcli/mock-registry')
const mockGlobals = require('@npmcli/mock-globals')

const CURRENT_VERSION = '123.420.69'
const CURRENT_MAJOR = '122.420.69'
const CURRENT_MINOR = '123.419.69'
const CURRENT_PATCH = '123.420.68'
const NEXT_VERSION = '123.421.70'
const NEXT_VERSION_ENGINE_COMPATIBLE = '123.421.60'
const NEXT_VERSION_ENGINE_COMPATIBLE_MINOR = `123.420.70`
const NEXT_VERSION_ENGINE_COMPATIBLE_PATCH = `123.421.58`
const NEXT_MINOR = '123.420.70'
const NEXT_PATCH = '123.421.69'
const CURRENT_BETA = '124.0.0-beta.99999'
const HAVE_BETA = '124.0.0-beta.0'

const packumentResponse = {
  _id: 'npm',
  name: 'npm',
  'dist-tags': {
    latest: CURRENT_VERSION,
  },
  access: 'public',
  versions: {
    [CURRENT_VERSION]: { version: CURRENT_VERSION, engines: { node: '>1' } },
    [CURRENT_MAJOR]: { version: CURRENT_MAJOR, engines: { node: '>1' } },
    [CURRENT_MINOR]: { version: CURRENT_MINOR, engines: { node: '>1' } },
    [CURRENT_PATCH]: { version: CURRENT_PATCH, engines: { node: '>1' } },
    [NEXT_VERSION]: { version: NEXT_VERSION, engines: { node: '>1' } },
    [NEXT_MINOR]: { version: NEXT_MINOR, engines: { node: '>1' } },
    [NEXT_PATCH]: { version: NEXT_PATCH, engines: { node: '>1' } },
    [CURRENT_BETA]: { version: CURRENT_BETA, engines: { node: '>1' } },
    [HAVE_BETA]: { version: HAVE_BETA, engines: { node: '>1' } },
    [NEXT_VERSION_ENGINE_COMPATIBLE]: {
      version: NEXT_VERSION_ENGINE_COMPATIBLE,
      engines: { node: '<=1' },
    },
    [NEXT_VERSION_ENGINE_COMPATIBLE_MINOR]: {
      version: NEXT_VERSION_ENGINE_COMPATIBLE_MINOR,
      engines: { node: '<=1' },
    },
    [NEXT_VERSION_ENGINE_COMPATIBLE_PATCH]: {
      version: NEXT_VERSION_ENGINE_COMPATIBLE_PATCH,
      engines: { node: '<=1' },
    },
  },
}

const runUpdateNotifier = async (t, {
  STAT_ERROR,
  PACOTE_ERROR,
  PACOTE_MOCK_REQ_COUNT = 1,
  STAT_MTIME = 0,
  mocks: _mocks = {},
  command = 'help',
  prefixDir,
  version = CURRENT_VERSION,
  argv = [],
  ...config
} = {}) => {
  const cache = join(t.testdir(), '.npm')
  const mockFs = {
    ...require('node:fs/promises'),
    stat: async (path) => {
      if (basename(path) !== '_update-notifier-last-checked') {
        t.fail('no stat allowed for non update notifier files')
      }
      if (STAT_ERROR) {
        throw STAT_ERROR
      }
      return { mtime: new Date(STAT_MTIME) }
    },
    writeFile: async () => {
      t.fail('sentinel must not be written before a notification is shown')
    },
  }

  const mocks = {
    'node:fs/promises': mockFs,
    '{ROOT}/package.json': { version },
    'ci-info': { isCI: false, name: null },
    ..._mocks,
  }

  const mock = await mockNpm(t, {
    command,
    mocks,
    config: { cache, ...config },
    exec: true,
    prefixDir,
    argv,
  })
  const registry = new MockRegistry({
    tap: t,
    registry: mock.npm.config.get('registry'),
  })

  if (PACOTE_MOCK_REQ_COUNT > 0) {
    registry.nock.get('/npm').times(PACOTE_MOCK_REQ_COUNT).reply(200, packumentResponse)
  }

  const updateNotifier = tmock(t, '{LIB}/cli/update-notifier.js', mocks)

  const result = await updateNotifier(mock.npm)
  const sentinelPath = resolve(mock.npm.flatOptions.cache, '../_update-notifier-last-checked')

  return {
    wroteFile: existsSync(sentinelPath),
    sentinelPath,
    result,
  }
}

t.test('duration has elapsed, no updates', async t => {
  const { wroteFile, result } = await runUpdateNotifier(t)
  t.equal(wroteFile, false)
  t.not(result)
})

t.test('situations in which we do not notify', t => {
  t.test('nothing to do if notifier disabled', async t => {
    const { wroteFile, result } = await runUpdateNotifier(t, {
      PACOTE_MOCK_REQ_COUNT: 0,
      'update-notifier': false,
    })
    t.equal(wroteFile, false)
    t.equal(result, null)
  })

  t.test('do not suggest update if already updating', async t => {
    const { wroteFile, result } = await runUpdateNotifier(t, {
      PACOTE_MOCK_REQ_COUNT: 0,
      command: 'install',
      prefixDir: { 'package.json': `{"name":"${t.testName}"}` },
      argv: ['npm'],
      global: true,
    })
    t.equal(wroteFile, false)
    t.equal(result, null)
  })

  t.test('do not suggest update if already updating with spec', async t => {
    const { wroteFile, result } = await runUpdateNotifier(t, {
      PACOTE_MOCK_REQ_COUNT: 0,
      command: 'install',
      prefixDir: { 'package.json': `{"name":"${t.testName}"}` },
      argv: ['npm@latest'],
      global: true,
    })
    t.equal(wroteFile, false)
    t.equal(result, null)
  })

  t.test('do not update if same as latest', async t => {
    const { wroteFile, result } = await runUpdateNotifier(t)
    t.equal(wroteFile, false)
    t.equal(result, null)
  })
  t.test('check if stat errors (here for coverage)', async t => {
    const STAT_ERROR = new Error('blorg')
    const { wroteFile, result } = await runUpdateNotifier(t, { STAT_ERROR })
    t.equal(wroteFile, false)
    t.equal(result, null)
  })
  t.test('ignore pacote failures (here for coverage)', async t => {
    const PACOTE_ERROR = new Error('pah-KO-tchay')
    const { wroteFile, result } = await runUpdateNotifier(t, {
      PACOTE_ERROR, PACOTE_MOCK_REQ_COUNT: 0,
    })
    t.equal(result, null)
    t.equal(wroteFile, false)
  })
  t.test('do not update if newer than latest, but same as next', async t => {
    const {
      wroteFile,
      result,
    } = await runUpdateNotifier(t, { version: NEXT_VERSION })
    t.equal(result, null)
    t.equal(wroteFile, false)
  })
  t.test('do not update if on the latest beta', async t => {
    const {
      wroteFile,
      result,
    } = await runUpdateNotifier(t, { version: CURRENT_BETA })
    t.equal(result, null)
    t.equal(wroteFile, false)
  })

  t.test('do not update in CI', async t => {
    const { wroteFile, result } = await runUpdateNotifier(t, { mocks: {
      'ci-info': { isCI: true, name: 'something' },
    },
    PACOTE_MOCK_REQ_COUNT: 0 })
    t.equal(wroteFile, false)
    t.equal(result, null)
  })

  t.test('only check daily for GA releases', async t => {
    // One day minus five minutes to account for test environment fuzziness
    const STAT_MTIME = Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 5
    const { wroteFile, result } = await runUpdateNotifier(t, {
      STAT_MTIME,
      PACOTE_MOCK_REQ_COUNT: 0,
    })
    t.equal(wroteFile, false, 'duration was not reset')
    t.equal(result, null)
  })

  t.test('check GA releases after one day', async t => {
    // One day plus five minutes to account for test environment fuzziness
    const STAT_MTIME = Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 5
    const { wroteFile, result } = await runUpdateNotifier(t, {
      STAT_MTIME,
      PACOTE_MOCK_REQ_COUNT: 1,
    })
    t.equal(wroteFile, false)
    t.equal(result, null)
  })

  t.test('only check daily for prereleases', async t => {
    // One day (plus five minutes to account for test environment fuzziness)
    const STAT_MTIME = Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 5
    const {
      wroteFile,
      result,
    } = await runUpdateNotifier(t, { STAT_MTIME, version: HAVE_BETA, PACOTE_MOCK_REQ_COUNT: 0 })
    t.equal(wroteFile, false, 'duration was not reset')
    t.equal(result, null)
  })

  t.end()
})

t.test('notification situation with engine compatibility', async t => {
  // no version which are greater than node 1.0.0 should be selected.
  mockGlobals(t, { 'process.version': 'v1.0.0' }, { replace: true })

  const {
    wroteFile,
    sentinelPath,
    result,
  } = await runUpdateNotifier(t, {
    version: NEXT_VERSION_ENGINE_COMPATIBLE_MINOR,
    PACOTE_MOCK_REQ_COUNT: 1 })

  t.matchSnapshot(result.message)
  t.equal(wroteFile, false)
  result.onShown()
  t.equal(existsSync(sentinelPath), true)
})

t.test('notification situations', async t => {
  const cases = {
    [HAVE_BETA]: 1,
    [NEXT_PATCH]: 2,
    [NEXT_MINOR]: 2,
    [CURRENT_PATCH]: 1,
    [CURRENT_MINOR]: 1,
    [CURRENT_MAJOR]: 1,
  }

  for (const [version, requestCount] of Object.entries(cases)) {
    for (const color of [false, 'always']) {
      await t.test(`${version} - color=${color}`, async t => {
        const {
          wroteFile,
          result,
        } = await runUpdateNotifier(t, { version, color, PACOTE_MOCK_REQ_COUNT: requestCount })
        t.matchSnapshot(result.message)
        t.equal(wroteFile, false)
      })
    }
  }
})
