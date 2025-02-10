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
