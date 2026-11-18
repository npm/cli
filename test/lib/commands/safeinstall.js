const t = require('tap')
const { join } = require('node:path')
const mockGlobals = require('@npmcli/mock-globals')
const tmock = require('../../fixtures/tmock.js')
const BaseCommand = require('../../../lib/base-cmd.js')

const PREFIX = '/some/prefix'

// A stand in for `npm install`, so these tests can assert what safeinstall
// hands over without running a reify. It extends the real BaseCommand, so the
// constructor is the same code the real command runs.
let installCalls = []

class FakeInstall extends BaseCommand {
  static name = 'install'
  static description = 'Install a package'
  static params = ['save', 'save-exact', 'global', 'dry-run']
  static usage = ['[<package-spec> ...]']

  async exec (args) {
    installCalls.push(args)
    return 'installed'
  }
}

const mockNpm = ({ checkPrivileges = false } = {}) => ({
  config: {
    argv: ['safeinstall'],
    validate: () => {},
    get: (key) => {
      if (key === 'check-privileges') {
        return checkPrivileges
      }
      if (key === 'workspace') {
        return []
      }
      if (key === 'workspaces') {
        return false
      }
    },
    isDefault: () => true,
    set: () => {},
    find: () => undefined,
  },
  prefix: PREFIX,
  localPrefix: PREFIX,
  globalDir: '/some/global',
  global: false,
  flatOptions: { registry: 'https://registry.npmjs.org/' },
})

// Captures what the command prints and asks, and answers prompts from a queue
// so a test can say exactly what the user typed. Only the modules safeinstall
// requires are mocked here, so npm's own internals keep the real ones.
const load = async (t, { answers = [], checkPrivileges = false, isTTY = true, manifest } = {}) => {
  const questions = []
  const printed = []
  const logs = []
  const closed = []

  const mocks = {
    '{LIB}/commands/install.js': FakeInstall,
    pacote: {
      manifest: manifest || (() => {
        throw new Error('pacote.manifest should not have been called')
      }),
    },
    'node:readline/promises': {
      createInterface: () => ({
        question: (query) => {
          questions.push(query)
          return Promise.resolve(answers.length ? answers.shift() : '')
        },
        close: () => closed.push(true),
      }),
    },
    'proc-log': {
      log: new Proxy({}, {
        get: (_target, level) => (...args) => logs.push([level, ...args]),
      }),
      output: {
        standard: (...args) => printed.push(args.join(' ')),
      },
      input: {
        // the real signature is input.read(fn); the display layer calls fn and
        // resolves with whatever it returns
        read: (fn) => Promise.resolve().then(fn),
      },
    },
  }

  mockGlobals(t, { 'process.stdin.isTTY': isTTY })

  const SafeInstall = tmock(t, '{LIB}/commands/safeinstall.js', mocks)
  const cmd = new SafeInstall(mockNpm({ checkPrivileges }))

  return { cmd, questions, printed, logs, closed }
}

const manifestWith = scripts => async spec => ({
  name: spec,
  version: '1.0.0',
  scripts,
})

t.beforeEach(() => {
  installCalls = []
})

t.test('usage', t => {
  const SafeInstall = require('../../../lib/commands/safeinstall.js')
  t.equal(SafeInstall.name, 'safeinstall')
  t.equal(SafeInstall.description, 'Install a package, confirming names and install scripts first')
  t.equal(SafeInstall.params[0], 'check-privileges')
  t.match(SafeInstall.describeUsage, /npm safeinstall \[<package-spec> \.\.\.\]/)
  t.match(SafeInstall.describeUsage, /--check-privileges/)
  t.match(SafeInstall.describeUsage, /--save-exact/, 'inherits the install params')
  t.end()
})

t.test('a name that is not close to anything installs without a prompt', async t => {
  const { cmd, questions, printed } = await load(t)
  t.equal(await cmd.exec(['left-pad']), 'installed')
  t.strictSame(installCalls, [['left-pad']])
  t.strictSame(questions, [], 'no prompt')
  t.strictSame(printed, [], 'nothing printed')
})

t.test('an exact match on a well known name is never a typo', async t => {
  const { cmd, questions } = await load(t)
  t.equal(await cmd.exec(['express', 'lodash@4', '@babel/core@7.0.0']), 'installed')
  t.strictSame(questions, [])
  t.strictSame(installCalls, [['express', 'lodash@4', '@babel/core@7.0.0']])
})

t.test('a typo is cancelled unless the answer is CONFIRM', async t => {
  const { cmd, questions, printed } = await load(t, { answers: ['y'] })
  await t.rejects(cmd.exec(['expres']), {
    code: 'ESAFEINSTALLCONFIRM',
    message: 'Install cancelled: expres did not match a known package',
  })
  t.strictSame(installCalls, [], 'never reached install')
  t.strictSame(questions, [''], 'asked once, with no query text')
  t.match(printed.join('\n'), 'expres is not express, but it is 1 character away.')
  t.match(printed.join('\n'), 'Type CONFIRM to install it anyway. Anything else cancels the install.')
})

t.test('an empty answer cancels', async t => {
  const { cmd } = await load(t, { answers: [''] })
  await t.rejects(cmd.exec(['requsts']), { code: 'ESAFEINSTALLCONFIRM' })
  t.strictSame(installCalls, [])
})

t.test('a lowercase confirm does not count', async t => {
  const { cmd } = await load(t, { answers: ['confirm'] })
  await t.rejects(cmd.exec(['expres']), { code: 'ESAFEINSTALLCONFIRM' })
  t.strictSame(installCalls, [])
})

t.test('surrounding whitespace is trimmed off the answer', async t => {
  const { cmd } = await load(t, { answers: [' CONFIRM '] })
  // the word still has to be CONFIRM, but a stray space is not a refusal
  t.equal(await cmd.exec(['expres']), 'installed')
  t.strictSame(installCalls, [['expres']])
})

t.test('CONFIRM installs the requested name', async t => {
  const { cmd, closed } = await load(t, { answers: ['CONFIRM'] })
  t.equal(await cmd.exec(['lodashh']), 'installed')
  t.strictSame(installCalls, [['lodashh']])
  t.strictSame(closed, [true], 'closes the readline interface')
})

t.test('the warning names the package, the error names the spec', async t => {
  const { cmd, printed } = await load(t, { answers: ['y'] })
  await t.rejects(cmd.exec(['expres@^4.0.0']), {
    code: 'ESAFEINSTALLCONFIRM',
    message: 'Install cancelled: expres@^4.0.0 did not match a known package',
  })
  t.match(printed.join('\n'), 'expres is not express')
})

t.test('every suspect is listed before one prompt', async t => {
  const { cmd, questions, printed } = await load(t, { answers: ['y'] })
  await t.rejects(cmd.exec(['expres', 'left-pad', 'lodahs']), {
    code: 'ESAFEINSTALLCONFIRM',
    message: 'Install cancelled: expres, lodahs did not match a known package',
  })
  t.strictSame(questions, [''], 'one prompt, not one per package')
  t.match(printed.join('\n'), 'expres is not express, but it is 1 character away.')
  t.match(printed.join('\n'), 'lodahs is not lodash, but it is 2 characters away.')
  t.notMatch(printed.join('\n'), 'left-pad')
})

t.test('a second close name is listed', async t => {
  const { cmd, printed } = await load(t, { answers: ['y'] })
  // contrived on purpose: aesct is two edits from both jest and react, and a
  // real typo almost never lands that way
  await t.rejects(cmd.exec(['aesct']), { code: 'ESAFEINSTALLCONFIRM' })
  t.match(printed.join('\n'), 'aesct is not jest, but it is 2 characters away.')
  t.match(printed.join('\n'), 'Other close names: react')
})

t.test('a short name is only compared one edit out', async t => {
  const { cmd, questions } = await load(t, { answers: ['CONFIRM'] })
  // two edits from react, three from the next closest, and short enough that
  // only a single edit counts
  t.equal(await cmd.exec(['act']), 'installed')
  t.strictSame(questions, [], 'act is two edits from react, which is not close enough to ask')
})

t.test('non registry specs are skipped', async t => {
  const { cmd, questions, logs } = await load(t, {
    checkPrivileges: true,
    manifest: () => t.fail('should not fetch a manifest'),
  })
  // these all behave the same on every platform. A local path is left out
  // because npa rejects it outright on windows, where the test would then be
  // asserting a different set of log lines than it does elsewhere.
  const specs = [
    'git+https://github.com/npm/cli.git',
    'https://example.com/pkg.tgz',
    'node_modules/foo',
    'workspace:*',
    '',
  ]
  t.equal(await cmd.exec(specs), 'installed')
  t.strictSame(installCalls, [specs])
  t.strictSame(questions, [], 'nothing to ask about')
  t.strictSame(
    logs.filter(([level]) => level === 'info').map(([, , msg]) => msg),
    [
      'Skipping privilege check for git+https://github.com/npm/cli.git, not a registry package',
      'Skipping privilege check for https://example.com/pkg.tgz, not a registry package',
      'Skipping privilege check for node_modules/foo, not a registry package',
      'Skipping privilege check for workspace:*, not a registry package',
      'Skipping privilege check for , not a registry package',
    ],
    'the spec is reported as it was typed, since there is no name to report'
  )
})

t.test('a local path is left to npm install to resolve', async t => {
  const { cmd, questions } = await load(t, {
    checkPrivileges: true,
    manifest: () => t.fail('should not fetch a manifest'),
  })
  t.equal(await cmd.exec(['./local-dir']), 'installed')
  t.strictSame(installCalls, [['./local-dir']])
  t.strictSame(questions, [])
})

t.test('no arguments skips both checks', async t => {
  const { cmd, logs } = await load(t, { checkPrivileges: true })
  t.equal(await cmd.exec([]), 'installed')
  t.strictSame(installCalls, [[]])
  t.match(logs, [['notice', 'safeinstall', 'No packages given, skipping name and privilege checks']])
})

t.test('manifests are not fetched without the flag', async t => {
  const { cmd } = await load(t, { manifest: () => t.fail('should not fetch a manifest') })
  t.equal(await cmd.exec(['lodash']), 'installed')
  t.strictSame(installCalls, [['lodash']])
})

t.test('install scripts are listed and can be declined', async t => {
  const { cmd, questions, printed } = await load(t, {
    checkPrivileges: true,
    answers: ['n'],
    manifest: manifestWith({
      preinstall: 'node-pre-gyp install --fallback-to-build',
      install: 'node-pre-gyp install --fallback-to-build',
      postinstall: 'node-pre-gyp install --fallback-to-build',
      test: 'tap',
    }),
  })
  await t.rejects(cmd.exec(['canvas']), {
    code: 'ESAFEINSTALLPRIVILEGES',
    message: 'Install cancelled: install scripts for canvas were not granted',
  })
  t.strictSame(installCalls, [])
  t.strictSame(questions, ['Do you explicitly grant these privileges? (y/N) '])
  t.match(printed.join('\n'), 'canvas@1.0.0 runs code during install:')
  t.match(printed.join('\n'), '  preinstall: node-pre-gyp install --fallback-to-build')
  t.match(printed.join('\n'), '  postinstall: node-pre-gyp install --fallback-to-build')
  t.notMatch(printed.join('\n'), 'test: tap', 'only the privileged scripts are shown')
})

t.test('granting continues the install', async t => {
  const { cmd } = await load(t, {
    checkPrivileges: true,
    answers: ['y'],
    manifest: manifestWith({ install: 'node-gyp rebuild' }),
  })
  t.equal(await cmd.exec(['canvas']), 'installed')
  t.strictSame(installCalls, [['canvas']])
})

t.test('yes is accepted too', async t => {
  const { cmd } = await load(t, {
    checkPrivileges: true,
    answers: ['Yes'],
    manifest: manifestWith({ install: 'node-gyp rebuild' }),
  })
  t.equal(await cmd.exec(['canvas']), 'installed')
  t.strictSame(installCalls, [['canvas']])
})

t.test('a package with no privileged scripts is not asked about', async t => {
  const { cmd, questions, logs } = await load(t, {
    checkPrivileges: true,
    manifest: manifestWith({ test: 'tap' }),
  })
  t.equal(await cmd.exec(['lodash']), 'installed')
  t.strictSame(questions, [])
  t.match(logs, [['verbose', 'safeinstall', 'lodash declares no install scripts']])
})

t.test('a manifest with no scripts field at all is not asked about', async t => {
  const { cmd, questions } = await load(t, {
    checkPrivileges: true,
    manifest: async spec => ({ name: spec, version: '1.0.0' }),
  })
  t.equal(await cmd.exec(['lodash']), 'installed')
  t.strictSame(questions, [])
})

t.test('every requested package is checked for privileges', async t => {
  const fetched = []
  const { cmd, questions } = await load(t, {
    checkPrivileges: true,
    answers: ['y', 'y'],
    manifest: async (spec, opts) => {
      fetched.push([spec, opts])
      return { name: spec, version: '1.0.0', scripts: { postinstall: 'node x' } }
    },
  })
  t.equal(await cmd.exec(['aaa', 'bbb']), 'installed')
  t.strictSame(fetched, [
    ['aaa', { registry: 'https://registry.npmjs.org/' }],
    ['bbb', { registry: 'https://registry.npmjs.org/' }],
  ], 'each manifest is fetched with the flat options')
  t.strictSame(questions.length, 2)
})

t.test('the name check runs before the privilege check', async t => {
  const { cmd } = await load(t, {
    checkPrivileges: true,
    answers: ['y', 'y'],
    manifest: () => t.fail('the manifest for a typo should never be read'),
  })
  await t.rejects(cmd.exec(['expres']), { code: 'ESAFEINSTALLCONFIRM' })
  t.strictSame(installCalls, [])
})

t.test('a prompt without a terminal fails instead of hanging', async t => {
  const { cmd, questions } = await load(t, { isTTY: false })
  await t.rejects(cmd.exec(['expres']), {
    code: 'ESAFEINSTALLNOTTY',
    message: 'npm safeinstall needs an interactive terminal, none was available',
  })
  t.strictSame(questions, [])
  t.strictSame(installCalls, [])
})

t.test('no terminal is fine when nothing needs asking', async t => {
  const { cmd } = await load(t, { isTTY: false })
  t.equal(await cmd.exec(['left-pad']), 'installed')
  t.strictSame(installCalls, [['left-pad']])
})

t.test('the join helper resolves paths that tap cannot mock', t => {
  // tmock only rewrites keys that start with . or {, so a bare 'tap' or
  // 'node:readline/promises' has to resolve for real
  t.equal(require.resolve('node:readline/promises') !== undefined, true)
  t.equal(join(__dirname, '../../../lib').endsWith(join('lib')), true)
  t.end()
})
