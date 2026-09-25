const t = require('tap')
const { existsSync } = require('node:fs')
const { resolve } = require('node:path')
const PackageJson = require('@npmcli/package-json')
const realRunScript = require('@npmcli/run-script')

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

t.test('escapes cmd.exe executable tokens', async t => {
  for (const scriptShell of ['cmd', 'CMD.EXE', 'C:\\Windows\\System32\\cmd.exe']) {
    const { runScript } = await mockRunScript(t, {
      '@npmcli/run-script': async ({ pkg, args }) => {
        t.equal(pkg.scripts.npx, '^"bin^&echo^ injected^"')
        t.same(args, ['an argument', 'literal&argument'])
      },
      '../lib/is-windows.js': false,
    })
    await runScript({
      args: ['bin&echo injected', 'an argument', 'literal&argument'],
      scriptShell,
    })
  }
})

t.test('cmd.exe quoting preserves paths and literal metacharacters', async t => {
  const cases = [
    ['if', '^"if^"'],
    ['two words', '^"two^ words^"'],
    ['C:\\Program Files\\bin.cmd', '^"C:\\Program^ Files\\bin.cmd^"'],
    ["bin'name", '^"bin\'name^"'],
    ['bin(^);,=@', '^"bin^(^^^)^;^,^=^@^"'],
  ]
  let script
  const { runScript } = await mockRunScript(t, {
    '@npmcli/run-script': async ({ pkg }) => {
      script = pkg.scripts.npx
    },
  })
  for (const [command, expected] of cases) {
    await runScript({ args: [command], scriptShell: 'cmd.exe' })
    t.equal(script, expected, command)
  }
})

t.test('rejects cmd.exe executable tokens that cannot be quoted safely', async t => {
  const { runScript } = await mockRunScript(t, {
    '@npmcli/run-script': async () => t.fail('must not spawn'),
  })
  for (const command of [
    'bin%PATH%',
    'bin!PATH!',
    'bin" & echo injected',
    'bin\necho injected',
    'bin\recho injected',
    'bin\0name',
    'bin\tname',
  ]) {
    await t.rejects(runScript({ args: [command], scriptShell: 'cmd.exe' }), {
      code: 'EINVALIDCOMMAND',
      message: `Invalid executable name for cmd.exe: ${JSON.stringify(command)}`,
    })
  }
})

t.test('uses POSIX escaping for a POSIX shell on Windows', async t => {
  const { runScript } = await mockRunScript(t, {
    '@npmcli/run-script': async ({ pkg }) => {
      t.equal(pkg.scripts.npx, '\'bin$(echo injected)\'\\\'\'name\'')
    },
    '../lib/is-windows.js': true,
  })
  await runScript({ args: ["bin$(echo injected)'name"], scriptShell: 'bash' })
})

t.test('call remains a shell script and its arguments are not executable tokens', async t => {
  for (const scriptShell of ['sh', 'cmd.exe']) {
    const { runScript } = await mockRunScript(t, {
      '@npmcli/run-script': async ({ pkg, args }) => {
        t.equal(pkg.scripts.npx, 'echo first && echo second')
        t.same(args, ['an argument', '%literal%'])
      },
    })
    await runScript({
      call: 'echo first && echo second',
      args: ['an argument', '%literal%'],
      scriptShell,
    })
  }
})

t.test('normalized missing executable is not a shell script', async t => {
  const path = t.testdir()
  const windows = process.platform === 'win32'
  const commands = windows ? [
    'missing&echo injected>cli170-marker',
    'missing|echo injected>cli170-marker',
    'echo injected>cli170-marker',
  ] : [
    'missing$(echo injected>cli170-marker)',
    'missing`echo injected>cli170-marker`',
    "missing';echo injected>cli170-marker;#",
  ]
  const { runScript } = await mockRunScript(t, {
    '@npmcli/run-script': opts => realRunScript({ ...opts, stdio: 'pipe' }),
  })
  if (windows) {
    commands.push('%COMSPEC%', '!COMSPEC!')
  }
  for (const command of commands) {
    const pkg = await new PackageJson().fromContent({
      name: 'test',
      version: '1.0.0',
      bin: { [command]: 'bin.js' },
    }).normalize()
    t.same(Object.keys(pkg.content.bin), [command], 'payload survives normalization')
    await t.rejects(runScript({
      args: [command],
      path,
      runPath: path,
      scriptShell: windows ? 'cmd.exe' : 'sh',
    }), { code: /[%!]/.test(command) ? 'EINVALIDCOMMAND' : windows ? 1 : 127 })
    t.notOk(existsSync(resolve(path, 'cli170-marker')), 'no injected command ran')
  }
})

t.test('native executables receive literal arguments', async t => {
  const path = t.testdir()
  const args = ['two words', 'literal&argument', 'literal^argument', '"quoted"', "single'quote"]
  const { runScript } = await mockRunScript(t, {
    '@npmcli/run-script': opts => realRunScript({ ...opts, stdio: 'pipe' }),
  })
  const result = await runScript({
    args: [process.execPath, '-e', 'console.log(JSON.stringify(process.argv.slice(1)))', ...args],
    path,
    runPath: path,
    scriptShell: process.platform === 'win32' ? 'cmd.exe' : 'sh',
  })
  t.same(JSON.parse(result.stdout), args)
})
