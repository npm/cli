const t = require('tap')
const { basename } = require('path')
const tmock = require('../../fixtures/tmock')
const mockNpm = require('../../../fixtures/mock-npm')

const CURRENT_VERSION = '123.420.69'
const CURRENT_MAJOR = '122.420.69'
const CURRENT_MINOR = '123.419.69'
const CURRENT_PATCH = '123.420.68'
const NEXT_VERSION = '123.421.70'
const NEXT_MINOR = '123.420.70'
const NEXT_PATCH = '123.421.69'
const CURRENT_BETA = '124.0.0-beta.99999'
const HAVE_BETA = '124.0.0-beta.0'

const runUpdateNotifier = async (t, {
  STAT_ERROR,
  WRITE_ERROR,
  PACOTE_ERROR,
  STAT_MTIME,
  mocks = {},
  color = true,
  command = null,
  exec= [],
  ...npmOptions
} = {}) => {
  const mockFs = {
    ...require('fs/promises'),
    stat: async (path) => {
      if (basename(path) !== '_update-notifier-last-checked') {
        t.fail('no stat allowed for non upate notifier files')
      }
      if (STAT_ERROR) {
        throw STAT_ERROR
      }
      return { mtime: new Date(STAT_MTIME) }
    },
    writeFile: (path, content) => {
      if (content !== '') {
        t.fail('no write file content allowed')
      }
      if (basename(path) !== '_update-notifier-last-checked') {
        t.fail('no writefile allowed for non upate notifier files')
      }
      if (WRITE_ERROR) {
        throw WRITE_ERROR
      }
    },
  }

  const MANIFEST_REQUEST = []
  const mockPacote = {
    manifest: async (spec) => {
      if (!spec.match(/^npm@/)) {
        t.fail('no pacote manifest allowed for non npm packages')
      }
      MANIFEST_REQUEST.push(spec)
      if (PACOTE_ERROR) {
        throw PACOTE_ERROR
      }
      const version = spec === 'npm@latest' ? CURRENT_VERSION : /-/.test(spec) ?
        CURRENT_BETA :
        NEXT_VERSION
      return { version }
    },
  }

  const mock = await mockNpm(t, {
    command,
    mocks: {
      pacote: mockPacote,
      fs: mockFs,
      ...mocks,
    },
  })

  if (mock[command]) {
    await mock[command].exec(exec)
  }

  const updateNotifier = tmock(t, '{LIB}/utils/update-notifier.js', {
    pacote: mockPacote,
    fs: mockFs,
    ...mocks,
  })
}

t.test('situations in which we do not notify', t => {
  t.test('nothing to do if notifier disabled', async t => {
    t.equal(
      await runUpdateNotifier(t, {
        config: { get: k => k !== 'update-notifier' },
      }),
      null
    )
    t.strictSame(MANIFEST_REQUEST, [], 'no requests for manifests')
  })

  t.test('do not suggest update if already updating', async t => {
    t.equal(
      await runUpdateNotifier(t, {
        flatOptions: { ...flatOptions, global: true },
        command: 'install',
        argv: ['npm'],
      }),
      null
    )
    t.strictSame(MANIFEST_REQUEST, [], 'no requests for manifests')
  })

  t.test('do not suggest update if already updating with spec', async t => {
    t.equal(
      await runUpdateNotifier(t, {
        flatOptions: { ...flatOptions, global: true },
        command: 'install',
        argv: ['npm@latest'],
      }),
      null
    )
    t.strictSame(MANIFEST_REQUEST, [], 'no requests for manifests')
  })

  t.test('do not update if same as latest', async t => {
    t.equal(await runUpdateNotifier(t), null)
    t.strictSame(MANIFEST_REQUEST, ['npm@latest'], 'requested latest version')
  })
  t.test('check if stat errors (here for coverage)', async t => {
    STAT_ERROR = new Error('blorg')
    t.equal(await runUpdateNotifier(t), null)
    t.strictSame(MANIFEST_REQUEST, ['npm@latest'], 'requested latest version')
  })
  t.test('ok if write errors (here for coverage)', async t => {
    WRITE_ERROR = new Error('grolb')
    t.equal(await runUpdateNotifier(t), null)
    t.strictSame(MANIFEST_REQUEST, ['npm@latest'], 'requested latest version')
  })
  t.test('ignore pacote failures (here for coverage)', async t => {
    PACOTE_ERROR = new Error('pah-KO-tchay')
    t.equal(await runUpdateNotifier(t), null)
    t.strictSame(MANIFEST_REQUEST, ['npm@latest'], 'requested latest version')
  })
  t.test('do not update if newer than latest, but same as next', async t => {
    t.equal(await runUpdateNotifier(t, { version: NEXT_VERSION }), null)
    const reqs = ['npm@latest', `npm@^${NEXT_VERSION}`]
    t.strictSame(MANIFEST_REQUEST, reqs, 'requested latest and next versions')
  })
  t.test('do not update if on the latest beta', async t => {
    t.equal(await runUpdateNotifier(t, { version: CURRENT_BETA }), null)
    const reqs = [`npm@^${CURRENT_BETA}`]
    t.strictSame(MANIFEST_REQUEST, reqs, 'requested latest and next versions')
  })

  t.test('do not update in CI', async t => {
    t.teardown(() => {
      ciMock = {}
    })
    ciMock = { isCI: true, name: 'something' }
    t.equal(await runUpdateNotifier(t), null)
    t.strictSame(MANIFEST_REQUEST, [], 'no requests for manifests')
  })

  t.test('only check weekly for GA releases', async t => {
    // One week (plus five minutes to account for test environment fuzziness)
    STAT_MTIME = Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 5
    t.equal(await runUpdateNotifier(t), null)
    t.strictSame(MANIFEST_REQUEST, [], 'no requests for manifests')
  })

  t.test('only check daily for betas', async t => {
    // One day (plus five minutes to account for test environment fuzziness)
    STAT_MTIME = Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 5
    t.equal(await runUpdateNotifier(t, { version: HAVE_BETA }), null)
    t.strictSame(MANIFEST_REQUEST, [], 'no requests for manifests')
  })

  t.end()
})

t.test('notification situations', t => {
  t.test('new beta available', async t => {
    const version = HAVE_BETA
    t.matchSnapshot(await runUpdateNotifier(t, { version }), 'color')
    t.matchSnapshot(
      await runUpdateNotifier(t, { version, color: false }),
      'no color'
    )
    t.strictSame(MANIFEST_REQUEST, [`npm@^${version}`, `npm@^${version}`])
  })

  t.test('patch to next version', async t => {
    const version = NEXT_PATCH
    t.matchSnapshot(await runUpdateNotifier(t, { version }), 'color')
    t.matchSnapshot(
      await runUpdateNotifier(t, { version, color: false }),
      'no color'
    )
    t.strictSame(MANIFEST_REQUEST, [
      'npm@latest',
      `npm@^${version}`,
      'npm@latest',
      `npm@^${version}`,
    ])
  })

  t.test('minor to next version', async t => {
    const version = NEXT_MINOR
    t.matchSnapshot(await runUpdateNotifier(t, { version }), 'color')
    t.matchSnapshot(
      await runUpdateNotifier(t, { version, color: false }),
      'no color'
    )
    t.strictSame(MANIFEST_REQUEST, [
      'npm@latest',
      `npm@^${version}`,
      'npm@latest',
      `npm@^${version}`,
    ])
  })

  t.test('patch to current', async t => {
    const version = CURRENT_PATCH
    t.matchSnapshot(await runUpdateNotifier(t, { version }), 'color')
    t.matchSnapshot(
      await runUpdateNotifier(t, { version, color: false }),
      'no color'
    )
    t.strictSame(MANIFEST_REQUEST, ['npm@latest', 'npm@latest'])
  })

  t.test('minor to current', async t => {
    const version = CURRENT_MINOR
    t.matchSnapshot(await runUpdateNotifier(t, { version }), 'color')
    t.matchSnapshot(
      await runUpdateNotifier(t, { version, color: false }),
      'no color'
    )
    t.strictSame(MANIFEST_REQUEST, ['npm@latest', 'npm@latest'])
  })

  t.test('major to current', async t => {
    const version = CURRENT_MAJOR
    t.matchSnapshot(await runUpdateNotifier(t, { version }), 'color')
    t.matchSnapshot(
      await runUpdateNotifier(t, { version, color: false }),
      'no color'
    )
    t.strictSame(MANIFEST_REQUEST, ['npm@latest', 'npm@latest'])
  })

  t.end()
})
