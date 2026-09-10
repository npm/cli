const t = require('tap')

const mockRunScript = async (t, mocks, { level = 0 } = {}) => {
  const mockedRunScript = t.mock('../lib/run-script.js', mocks)
  const { Chalk } = await import('chalk')

  const outputs = []
  const handleOutput = (_level, msg) => {
    if (_level === 'standard') {
      outputs.push(msg)
    }
  }
  process.on('output', handleOutput)
  t.teardown(() => process.off('output', handleOutput))

  const logs = []
  const handleLog = (_level, title, msg) => {
    logs.push(`${_level} ${title} ${msg}`)
  }
  process.on('log', handleLog)
  t.teardown(() => process.off('log', handleLog))

  const runScript = (opts) => mockedRunScript({
    args: [],
    call: '',
    path: '',
    runPath: '',
    shell: process.platform === 'win32'
      ? process.env.ComSpec || 'cmd'
      : process.env.SHELL || 'sh',
    ...opts,
    flatOptions: { chalk: new Chalk({ level }) },
  })
  return { runScript, outputs, logs }
}

t.test('no package.json', async t => {
  t.plan(1)

  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'pkg',
    }),
  })
  const { runScript } = await mockRunScript(t, {
    'ci-info': { isCI: false },
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/no-tty.js': () => false,
  })

  await runScript({ path })
})

t.test('colorized interactive mode msg', async t => {
  t.plan(2)

  const { runScript, outputs } = await mockRunScript(t, {
    'ci-info': { isCI: false },
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/no-tty.js': () => false,
  }, { level: 3 })

  await runScript({
    runPath: '/foo/',
  })
  t.matchSnapshot(outputs.join('\n'), 'should print colorized output')
})

t.test('no color interactive mode msg', async t => {
  t.plan(2)

  const { runScript, outputs } = await mockRunScript(t, {
    'ci-info': { isCI: false },
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/no-tty.js': () => false,
  })

  await runScript({
    runPath: '/foo/',
  })
  t.matchSnapshot(outputs.join('\n'), 'should print non-colorized output')
})

t.test('no tty', async t => {
  t.plan(1)

  const { runScript } = await mockRunScript(t, {
    'ci-info': { isCI: false },
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/no-tty.js': () => true,
  })

  await runScript()
})

t.test('ci env', async t => {
  const { runScript, logs } = await mockRunScript(t, {
    'ci-info': { isCI: true },
    '@npmcli/run-script': async () => {
      throw new Error('should not call run-script')
    },
    '../lib/no-tty.js': () => false,

  })

  await runScript()

  t.equal(logs[0], 'warn exec Interactive mode disabled in CI environment')
})

t.test('isWindows', async t => {
  const { runScript } = await mockRunScript(t, {
    'ci-info': { isCI: true },
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/is-windows.js': true,
  })

  await runScript({ args: ['test'] })
  // need both arguments and no arguments for code coverage
  await runScript()
})

t.test('escapes executable name to neutralize shell metacharacters', async t => {
  let pkg
  const { runScript } = await mockRunScript(t, {
    'ci-info': { isCI: true },
    '@npmcli/run-script': async (opts) => {
      pkg = opts.pkg
    },
    '../lib/is-windows.js': false,
  })

  await runScript({ args: [`evil'; touch pwned #`] })
  t.equal(pkg.scripts.npx, `'evil'\\''; touch pwned #'`)
})

t.test('escapes Windows cmd.exe metacharacters in executable name', async t => {
  let pkg
  const { runScript } = await mockRunScript(t, {
    'ci-info': { isCI: true },
    '@npmcli/run-script': async (opts) => {
      pkg = opts.pkg
    },
    '../lib/is-windows.js': true,
  })

  await runScript({ args: ['hello&calc&echo'] })
  t.equal(pkg.scripts.npx, 'hello^&calc^&echo',
    'ampersands escaped with caret to prevent cmd.exe command splitting')
})

t.test('escapes all Windows cmd.exe metacharacters', async t => {
  let pkg
  const { runScript } = await mockRunScript(t, {
    'ci-info': { isCI: true },
    '@npmcli/run-script': async (opts) => {
      pkg = opts.pkg
    },
    '../lib/is-windows.js': true,
  })

  await runScript({ args: ['a&b|c<d>e^f(g)h@i!j'] })
  t.equal(pkg.scripts.npx, 'a^&b^|c^<d^>e^^f^(g^)h^@i^!j',
    'all cmd.exe metacharacters are escaped with caret')
})

t.test('escapes spaces in Windows bin names to prevent multi-token injection', async t => {
  const { runScript } = await mockRunScript(t, {
    'ci-info': { isCI: true },
    '@npmcli/run-script': async () => {
      throw new Error('should not call run-script')
    },
    '../lib/is-windows.js': true,
  })

  await t.rejects(runScript({ args: ['powershell -c calc'] }), {
    message: /Cannot execute bin name containing unsafe characters on Windows/,
  }, 'rejects bin names with spaces to prevent cmd.exe token splitting')
})

t.test('escapes double quotes in Windows bin names', async t => {
  let pkg
  const { runScript } = await mockRunScript(t, {
    'ci-info': { isCI: true },
    '@npmcli/run-script': async (opts) => {
      pkg = opts.pkg
    },
    '../lib/is-windows.js': true,
  })

  await runScript({ args: ['evil"&calc"'] })
  t.equal(pkg.scripts.npx, 'evil^"^&calc^"',
    'double quotes escaped to prevent opening quoted regions in cmd.exe')
})

t.test('escapes tabs in Windows bin names', async t => {
  const { runScript } = await mockRunScript(t, {
    'ci-info': { isCI: true },
    '@npmcli/run-script': async () => {
      throw new Error('should not call run-script')
    },
    '../lib/is-windows.js': true,
  })

  await t.rejects(runScript({ args: ['evil\tcalc'] }), {
    message: /Cannot execute bin name containing unsafe characters on Windows/,
  }, 'rejects bin names with tabs to prevent cmd.exe token splitting')
})

t.test('rejects Windows bin names containing percent sign', async t => {
  const { runScript } = await mockRunScript(t, {
    'ci-info': { isCI: true },
    '@npmcli/run-script': async () => {
      throw new Error('should not call run-script')
    },
    '../lib/is-windows.js': true,
  })

  await t.rejects(runScript({ args: ['%COMSPEC%'] }), {
    message: /Cannot execute bin name containing unsafe characters on Windows/,
  }, 'rejects bin names with % to prevent env var expansion in cmd.exe')
})

t.test('rejects Windows bin names containing newlines', async t => {
  const { runScript } = await mockRunScript(t, {
    'ci-info': { isCI: true },
    '@npmcli/run-script': async () => {
      throw new Error('should not call run-script')
    },
    '../lib/is-windows.js': true,
  })

  await t.rejects(runScript({ args: ['evil\ncalc'] }), {
    message: /Cannot execute bin name containing unsafe characters on Windows/,
  }, 'rejects bin names with newline to prevent command splitting in cmd.exe')

  await t.rejects(runScript({ args: ['evil\rcalc'] }), {
    message: /Cannot execute bin name containing unsafe characters on Windows/,
  }, 'rejects bin names with carriage return')
})

t.test('isNotWindows', async t => {
  const { runScript } = await mockRunScript(t, {
    'ci-info': { isCI: true },
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/is-windows.js': false,
  })

  await runScript({ args: ['test'] })
  // need both arguments and no arguments for code coverage
  await runScript()
})
