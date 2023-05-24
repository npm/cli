const t = require('tap')
const { join } = require('path')
const mockGlobals = require('@npmcli/mock-globals')
const { getFlatKey } = require('../../lib/definitions/definition.js')

const flatKeys = (obj) => {
  const entries = Object.entries(obj).map(([k, v]) => [getFlatKey(k), v])
  return Object.fromEntries(entries)
}

// have to fake the node version, or else it'll only pass on this one
mockGlobals(t, { 'process.version': 'v14.8.0', 'process.env.NODE_ENV': undefined })

const mockAll = (mocks = {}) => t.mock('../../lib/definitions/definitions.js', mocks)
const mockDefs = (mocks = {}) => mockAll(mocks).definitions

const mockValue = (key, baseObj = {}) => (obj = {}, value = null) => {
  const { definitions, derived } = mockAll()
  const def = derived[key] ?? definitions[key]
  const dependencies = flatKeys({ ...baseObj, ...obj })
  if (def.isDerived) {
    return def.getValue(dependencies)
  }
  return def.getValue(value ?? def.default, dependencies)
}

const isWin = (t, isWindows) => {
  mockGlobals(t, { 'process.platform': isWindows ? 'win32' : 'not-windows' })
}

t.test('basic get value functioin', t => {
  const { 'prefer-online': preferOnline } = mockDefs()
  t.strictSame(
    preferOnline.getValue(preferOnline.default, { cacheMax: 0 }),
    true
  )
  t.end()
})

t.test('editor', t => {
  t.test('has EDITOR and VISUAL, use EDITOR', t => {
    mockGlobals(t, { 'process.env': { EDITOR: 'vim', VISUAL: 'mate' } })
    const defs = mockDefs()
    t.equal(defs.editor.default, 'vim')
    t.end()
  })
  t.test('has VISUAL but no EDITOR, use VISUAL', t => {
    mockGlobals(t, { 'process.env': { EDITOR: undefined, VISUAL: 'mate' } })
    const defs = mockDefs()
    t.equal(defs.editor.default, 'mate')
    t.end()
  })
  t.test('has neither EDITOR nor VISUAL, system specific', t => {
    mockGlobals(t, {
      'process.env': {
        EDITOR: undefined,
        VISUAL: undefined,
        SYSTEMROOT: 'C:\\Windows',
      },
    })
    const defsWin = mockDefs(isWin(t, true))
    t.equal(defsWin.editor.default, 'C:\\Windows\\notepad.exe')
    const defsNix = mockDefs(isWin(t, false))
    t.equal(defsNix.editor.default, 'vi')
    t.end()
  })
  t.end()
})

t.test('shell', t => {
  t.test('windows, env.ComSpec then cmd.exe', t => {
    mockGlobals(t, { 'process.env.ComSpec': 'command.com' })
    const defsComSpec = mockDefs(isWin(t, true))
    t.equal(defsComSpec.shell.default, 'command.com')
    mockGlobals(t, { 'process.env.ComSpec': undefined })
    const defsNoComSpec = mockDefs(isWin(t, true))
    t.equal(defsNoComSpec.shell.default, 'cmd')
    t.end()
  })

  t.test('nix, SHELL then sh', t => {
    mockGlobals(t, { 'process.env.SHELL': '/usr/local/bin/bash' })
    const defsShell = mockDefs(isWin(t, false))
    t.equal(defsShell.shell.default, '/usr/local/bin/bash')
    mockGlobals(t, { 'process.env.SHELL': undefined })
    const defsNoShell = mockDefs(isWin(t, false))
    t.equal(defsNoShell.shell.default, 'sh')
    t.end()
  })

  t.end()
})

t.test('local-address allowed types', t => {
  t.test('get list from os.networkInterfaces', t => {
    const os = {
      networkInterfaces: () => ({
        eth420: [{ address: '127.0.0.1' }],
        eth69: [{ address: 'no place like home' }],
      }),
    }
    const defs = mockDefs({ os })
    t.same(defs['local-address'].typeValues, [
      null,
      '127.0.0.1',
      'no place like home',
    ])
    t.end()
  })
  t.test('handle os.networkInterfaces throwing', t => {
    const os = {
      tmpdir: () => '/tmp',
      networkInterfaces: () => {
        throw new Error('no network interfaces for some reason')
      },
    }
    const defs = mockDefs({ os })
    t.same(defs['local-address'].typeValues, [null])
    t.end()
  })
  t.end()
})

t.test('unicode allowed?', t => {
  const setGlobal = (obj = {}) => mockGlobals(t, { 'process.env': obj })

  setGlobal({ LC_ALL: 'utf8', LC_CTYPE: 'UTF-8', LANG: 'Unicode utf-8' })

  const lcAll = mockDefs()
  t.equal(lcAll.unicode.default, true)
  setGlobal({ LC_ALL: 'no unicode for youUUUU!' })
  const noLcAll = mockDefs()
  t.equal(noLcAll.unicode.default, false)

  setGlobal({ LC_ALL: undefined })
  const lcCtype = mockDefs()
  t.equal(lcCtype.unicode.default, true)
  setGlobal({ LC_CTYPE: 'something other than unicode version 8' })
  const noLcCtype = mockDefs()
  t.equal(noLcCtype.unicode.default, false)

  setGlobal({ LC_CTYPE: undefined })
  const lang = mockDefs()
  t.equal(lang.unicode.default, true)
  setGlobal({ LANG: 'ISO-8859-1' })
  const noLang = mockDefs()
  t.equal(noLang.unicode.default, false)
  t.end()
})

t.test('cache', t => {
  mockGlobals(t, { 'process.env.LOCALAPPDATA': 'app/data/local' })
  const defsWinLocalAppData = mockDefs(isWin(t, true))
  t.equal(defsWinLocalAppData.cache.default, 'app/data/local/npm-cache')

  mockGlobals(t, { 'process.env.LOCALAPPDATA': undefined })
  const defsWinNoLocalAppData = mockDefs(isWin(t, true))
  t.equal(defsWinNoLocalAppData['cache-root'].default, '~/npm-cache')

  const defsNix = mockDefs(isWin(t, false))
  t.equal(defsNix['cache-root'].default, '~/.npm')

  const { derived } = mockAll(isWin(t, false))
  const cacheRoot = '/some/cache/value'
  t.equal(derived.cache.getValue({ cacheRoot }), join(cacheRoot, '_cacache'))
  t.equal(derived['npx-cache'].getValue({ cacheRoot }), join(cacheRoot, '_npx'))

  t.end()
})

t.test('flatteners that populate flat.omit array', t => {
  const mockOmit = (t, obj, expected = {}, msg) => {
    const defs = mockDefs()
    const include = defs.include.getValue(obj.include ?? defs.include.default, obj)
    const omit = defs.omit.getValue(obj.omit ?? defs.omit.default, { ...obj, include })
    t.strictSame({ omit, include }, { omit: [], include: [], ...expected }, msg)
  }

  t.test('also', t => {
    mockOmit(t, { also: 'ignored' }, {})
    mockOmit(t, { also: 'development' }, { include: ['dev'] })
    mockOmit(t, { also: 'dev', omit: ['dev', 'optional'] }, {
      omit: ['optional'],
      include: ['dev'],
    })
    t.end()
  })

  t.test('include', t => {
    mockOmit(t, { include: ['dev'] }, { include: ['dev'] })
    mockOmit(t, { include: ['dev'], omit: ['optional', 'dev'] }, {
      omit: ['optional'],
      include: ['dev'],
    })
    t.end()
  })

  t.test('omit', t => {
    mockOmit(t, { include: ['dev'], omit: ['dev', 'optional'] }, {
      include: ['dev'],
      omit: ['optional'] },
    'do not omit what is included')

    mockGlobals(t, { 'process.env.NODE_ENV': 'production' })
    const defProdEnv = mockDefs()
    t.strictSame(defProdEnv.omit.default, ['dev'], 'omit dev in production')
    t.end()
  })

  t.test('only', t => {
    mockOmit(t, { only: 'asdf' }, {}, 'ignored if value is not production')
    mockOmit(t, { only: 'prod' }, { omit: ['dev'] }, 'omit dev when --only=prod')
    mockOmit(t, { only: 'prod', include: ['dev'] }, { include: ['dev'] },
      'do not omit when included')
    t.end()
  })

  t.test('optional', t => {
    mockOmit(t, { optional: null }, {}, 'do nothing by default')
    mockOmit(t, { optional: true }, { include: ['optional'] }, 'include optional when set')
    mockOmit(t, { optional: false }, { omit: ['optional'] }, 'omit optional when set false')
    t.end()
  })

  t.test('production', t => {
    mockOmit(t, { production: true }, { omit: ['dev'] }, '--production sets --omit=dev')
    mockOmit(t, { production: false }, { include: ['dev'] }, '--no-production has no effect')
    mockOmit(t, { production: true, include: ['dev'] }, { include: ['dev'] },
      'do not omit dev when included')
    t.end()
  })

  t.test('dev', t => {
    mockOmit(t, { dev: true }, { include: ['dev'] })
    t.end()
  })

  t.end()
})

t.test('cache-max', t => {
  const def = mockDefs()['prefer-online']
  t.strictSame(def.getValue(def.default, { cacheMax: 10342 }), false)
  t.strictSame(def.getValue(def.default, { cacheMax: 0 }), true)
  t.end()
})

t.test('cache-min', t => {
  const def = mockDefs()['prefer-offline']
  t.strictSame(def.getValue(def.default, { cacheMin: 123 }), false)
  t.strictSame(def.getValue(def.default, { cacheMin: 9999 }), true)
  t.end()
})

t.test('color', t => {
  t.test('values', t => {
    const setTTY = ({ stdout, stderr }) => mockGlobals(t, {
      'process.stdout.isTTY': stdout,
      'process.stderr.isTTY': stderr,
    })

    const mockColor = (t, v, expected = {}, msg) => {
      const { derived, definitions } = mockAll()
      const value = v ?? definitions['color-raw'].default
      const color = derived.color.getValue({ colorRaw: value })
      const logColor = derived['log-color'].getValue({ colorRaw: value })
      t.strictSame({ color, logColor }, expected, msg)
    }

    mockColor(t, 'always', { color: true, logColor: true }, 'true when --color=always')
    mockColor(t, false, { color: false, logColor: false }, 'false when --no-color')

    setTTY({ stdout: false, stderr: false })
    mockColor(t, true, { color: false, logColor: false }, 'no color when stdout not tty')

    setTTY({ stdout: true, stderr: false })
    mockColor(t, true, { color: true, logColor: false }, 'color:true when stdout is tty')

    setTTY({ stdout: false, stderr: false })
    mockColor(t, true, { color: false, logColor: false }, 'no color when stderr not tty')

    setTTY({ stdout: false, stderr: true })
    mockColor(t, true, { color: false, logColor: true }, 'logColor:true when stderr is tty')

    t.end()
  })

  t.test('defaults', t => {
    const setColor = (value) => mockGlobals(t, { 'process.env.NO_COLOR': value })

    setColor(undefined)
    t.equal(mockDefs().color.default, true, 'default true when no NO_COLOR env')

    setColor('0')
    t.equal(mockDefs().color.default, true, 'default true when no NO_COLOR=0')

    setColor('1')
    t.equal(mockDefs().color.default, false, 'default false when no NO_COLOR=1')

    t.end()
  })

  t.end()
})

t.test('progress', t => {
  const setEnv = ({ tty, term } = {}) => mockGlobals(t, {
    'process.stderr.isTTY': tty,
    'process.env.TERM': term,
  })

  t.strictSame(mockDefs().progress.default, false)

  setEnv({ tty: true, term: 'notdumb' })
  t.strictSame(mockDefs().progress.default, true)

  setEnv({ tty: false, term: 'notdumb' })
  t.strictSame(mockDefs().progress.default, false)

  setEnv({ tty: true, term: 'dumb' })
  t.strictSame(mockDefs().progress.default, false)

  t.end()
})

t.skip('shrinkwrap/package-lock', t => {
  const defs = mockDefs()
  const packageLock = mockValue('package-lock', {
    shrinkwrap: defs.shrinkwrap.default,
    packageLockOnly: defs['package-lock-only'].default,
  })

  t.equal(packageLock(), true)
  t.equal(packageLock({ shrinkwrap: false }), false)
  t.equal(packageLock({ shrinkwrap: true }), true)
  t.equal(packageLock({}, true), true)
  t.equal(packageLock({}, false), false)

  t.end()
})

t.test('package-lock/package-lock-only', t => {
  const packageLock = mockValue('package-lock', {
    packageLockOnly: mockDefs()['package-lock-only'].default,
  })
  t.equal(packageLock({ packageLockOnly: true }, false), true)
  t.equal(packageLock({ packageLockOnly: false }, false), false)
  t.equal(packageLock({}, false), false)
  t.equal(packageLock(), true)
  t.end()
})

t.test('saveType', t => {
  const saveType = mockValue('save-type')

  // use a single object and mutate after each assertion to test
  // order of rules
  const obj = {}

  t.equal(saveType(obj), null)

  obj['save-prod'] = true
  t.equal(saveType(obj), 'prod')

  obj['save-dev'] = true
  t.equal(saveType(obj), 'dev')

  obj['save-optional'] = true
  t.equal(saveType(obj), 'optional')

  obj['save-optional'] = false
  obj['save-peer'] = true
  t.equal(saveType(obj), 'peer')

  obj['save-optional'] = true
  t.equal(saveType(obj), 'peerOptional')

  t.end()
})

t.test('ca/cafile', t => {
  const cert = (v, j = '') => [
    '-----BEGIN CERTIFICATE-----',
    v,
    v,
    '-----END CERTIFICATE-----',
  ].join(j + '\n')

  const dir = t.testdir({
    cafile: ['', cert('XXXX'), '', '', cert('YYYY', '\r'), ''].join('\n'),
  })

  const ca = mockValue('ca')
  const cafile = mockValue('cafile')
  const cafileDep = { cafile: cafile({}, join(dir, 'cafile')) }

  t.strictSame(ca(), [])
  t.strictSame(ca(cafileDep), [cert('XXXX'), cert('YYYY')])
  t.strictSame(ca(cafileDep, []), [cert('XXXX'), cert('YYYY')])
  t.strictSame(ca(cafileDep, null), [cert('XXXX'), cert('YYYY')])
  t.strictSame(ca(cafileDep, ['CA', 'CA2']), ['CA', 'CA2', cert('XXXX'), cert('YYYY')])

  t.end()
})

t.test('detect CI', t => {
  const defnNoCI = mockDefs({
    'ci-info': { isCI: false, name: null },
  })
  const defnCIFoo = mockDefs({
    'ci-info': { isCI: false, name: 'foo' },
  })
  t.equal(defnNoCI['ci-name'].default, null, 'null when not in CI')
  t.equal(defnCIFoo['ci-name'].default, 'foo', 'name of CI when in CI')
  t.end()
})

t.test('user-agent', t => {
  const userAgent = mockValue('user-agent')

  const npmVersion = '1.2.3'
  const obj = {
    'npm-version': npmVersion,
    'node-version': process.version,
    platform: process.platform,
    arch: process.arch,
    'workspaces-set': false,
  }

  const expectNoCI = `npm/${npmVersion} node/${process.version} ` +
    `${process.platform} ${process.arch} workspaces/false`
  t.equal(userAgent(obj), expectNoCI)

  obj['ci-name'] = 'foo'
  const expectCI = `${expectNoCI} ci/foo`
  t.equal(userAgent(obj), expectCI)

  delete obj['ci-name']
  obj['workspaces-set'] = true
  obj['user-agent'] = mockDefs()['user-agent'].default
  const expectWorkspaces = expectNoCI.replace('workspaces/false', 'workspaces/true')
  t.equal(userAgent(obj), expectWorkspaces)

  t.end()
})

t.test('save-prefix/save-exact', t => {
  const savePrefix = mockValue('save-prefix')

  t.equal(savePrefix({ 'save-exact': true }), '')
  t.equal(savePrefix({ 'save-exact': false }), '^')
  t.equal(savePrefix({ 'save-exact': false }, '~'), '~')

  t.end()
})

t.test('location', t => {
  const mockLocation = (t, v, expected = {}, msg) => {
    const { derived, definitions } = mockAll()
    const defGlobal = v.global ?? definitions['global-raw'].default
    const defLoc = v.location ?? definitions['location-raw'].default
    const deps = flatKeys({ 'global-raw': defGlobal, 'location-raw': defLoc })
    const global = derived.global.getValue(deps)
    const location = derived.location.getValue(deps)
    t.strictSame({ global, location }, expected, msg)
  }

  // global:true or location:global always takes precendence and sets the other
  mockLocation(t,
    { global: true, location: 'user' },
    { global: true, location: 'global' }
  )
  mockLocation(t,
    { global: false, location: 'user' },
    { global: false, location: 'user' }
  )
  mockLocation(t,
    { global: false, location: 'global' },
    { global: true, location: 'global' }
  )
  mockLocation(t,
    { global: true, location: 'global' },
    { global: true, location: 'global' }
  )

  t.end()
})

t.test('workspaces', t => {
  const {
    workspaces: { default: workspaces },
    workspace: { default: workspace },
  } = mockDefs()
  const wsEnabled = mockValue('workspaces-enabled', { workspaces })
  const wsSet = mockValue('workspaces-set', { workspaces, workspace })

  t.equal(wsEnabled(), true, 'workspacesEnabled default')
  t.equal(wsEnabled({ workspaces: true }), true)
  t.equal(wsEnabled({ workspaces: false }), false)
  t.equal(wsEnabled({ workspaces: false, workspace: ['a'] }), false,
    'workspace array has no effect on workspaces-enabled')

  t.equal(wsSet(), false, 'workspaces-set default')
  t.equal(wsSet({ workspaces: true, workspace: [] }), true)
  t.equal(wsSet({ workspaces: null, workspace: ['a'] }), true)
  t.equal(wsSet({ workspaces: false, workspace: ['a'] }), true)
  t.equal(wsSet({ workspaces: false, workspace: [] }), false)
  t.equal(wsSet({ workspaces: null, workspace: [] }), false)

  t.end()
})

t.test('loglevel silent', t => {
  const silent = mockValue('silent')
  t.equal(silent(), false)
  t.equal(silent({ loglevel: 'silent' }), true)
  t.end()
})

t.test('install strategy', t => {
  const value = mockValue('install-strategy')

  t.equal(value(), 'hoisted')
  t.equal(value({ 'legacy-bundling': true }), 'nested')
  t.equal(value({ 'global-style': true }), 'shallow')
  t.end()
})

t.test('otp changes auth-type', t => {
  const authType = mockValue('auth-type')
  t.strictSame(authType({ otp: 123456 }, 'web'), 'legacy')
  t.strictSame(authType({ otp: 123456 }), 'legacy')
  t.strictSame(authType({}), 'web')
  t.strictSame(authType({}, 'legacy'), 'legacy')
  t.end()
})
