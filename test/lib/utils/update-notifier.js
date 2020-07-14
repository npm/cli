const t = require('tap')
const requireInject = require('require-inject')
const notifierMock = {}
const unsupportedMock = {}
const unsupported = () => unsupportedMock
let ciMock = null
const updateNotifier = requireInject.installGlobally('../../../lib/utils/update-notifier.js', {
  'update-notifier': () => notifierMock,
  '../../../lib/utils/unsupported.js': { checkVersion: unsupported },
  '@npmcli/ci-detect': () => ciMock
})
const { version } = require('../../../package.json')
const semver = require('semver')

t.test('situations in which we do not notify', t => {
  t.test('nothing to do if notifier disabled', t => {
    Object.assign(notifierMock, {
      notify: () => { throw new Error('should not notify!') },
      update: { latest: '99.99.99' },
    })
    updateNotifier({
      config: { get: (k) => k === 'update-notifier' ? false : true },
    })
    t.end()
  })

  t.test('do not suggest update if already updating', t => {
    Object.assign(notifierMock, {
      notify: () => { throw new Error('should not notify!') },
      update: { latest: '99.99.99' },
    })
    updateNotifier({
      config: { get: (k) => true },
      command: 'install',
      argv: ['npm']
    })
    t.end()
  })

  t.test('do not suggest update if version if unsupported', t => {
    t.teardown(() => { delete unsupportedMock.unsupported })
    unsupportedMock.unsupported = true
    Object.assign(notifierMock, {
      notify: () => { throw new Error('should not notify!') },
      update: { latest: '99.99.99' },
    })
    updateNotifier({
      config: { get: (k) => k !== 'global' },
      command: 'view',
      argv: ['npm']
    })
    t.end()
  })

  t.test('do not update if nothing to update', t => {
    Object.assign(notifierMock, {
      notify: () => { throw new Error('should not notify!') },
      update: { latest: version },
    })
    updateNotifier({
      config: { get: (k) => k !== 'global' },
      command: 'view',
      argv: ['npm']
    })
    t.end()
  })

  t.test('do not update in CI', t => {
    t.teardown(() => { ciMock = null })
    ciMock = 'something'
    Object.assign(notifierMock, {
      notify: () => { throw new Error('should not notify!') },
      update: { latest: '99.99.99' },
    })
    updateNotifier({
      config: { get: (k) => k !== 'global' },
      command: 'view',
      argv: ['npm']
    })
    t.end()
  })

  t.end()
})

t.test('notification situations', t => {
  const runTests = (config, t) => {
    t.plan(3)
    t.test('major', t => runTest(config, 'major', t))
    t.test('minor', t => runTest(config, 'minor', t))
    t.test('minor', t => runTest(config, 'patch', t))
  }

  const runTest = (config, type, t) => {
    t.plan(1)
    const latest = type === 'major' ? semver.inc(version, 'major')
      : type === 'minor' ? semver.inc(version, 'minor')
      : type === 'patch' ? semver.inc(version, 'patch')
      : null

    Object.assign(notifierMock, {
      notify: ({ message }) => {
        // swap this out so we don't have to regen snapshots each version bump
        t.matchSnapshot(message.replace(latest, `<<${type}>>`))
      },
      update: { latest, type, current: version }
    })
    updateNotifier({
      color: config.color,
      config: { get: (k) => k === 'update-notifier' ? true : !!config[k] },
      command: 'view',
      argv: ['npm']
    })
  }

  t.plan(4)
  t.test('color and unicode', t => runTests({ unicode: true, color: true }, t))
  t.test('color, no unicode', t => runTests({ color: true }, t))
  t.test('unicode, no color', t => runTests({ unicode: true }, t))
  t.test('no color, no unicode', t => runTests({}, t))
})
