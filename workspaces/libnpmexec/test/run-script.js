const t = require('tap')

const mockRunScript = async (t, mocks, { level = 0 } = {}) => {
  const runScript = t.mock('../lib/run-script.js', mocks)
  const { Chalk } = await import('chalk')
  return (opts) => runScript({
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
}

t.test('disable, enable log progress', async t => {
  t.plan(3)

  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'pkg',
    }),
  })
  const runScript = await mockRunScript(t, {
    'ci-info': { isCI: false },
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/no-tty.js': () => false,
    npmlog: {
      disableProgress () {
        t.ok('should disable progress')
      },
      enableProgress () {
        t.ok('should enable progress')
      },
    },
  })

  await runScript({ path })
})

t.test('no package.json', async t => {
  t.plan(1)

  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'pkg',
    }),
  })
  const runScript = await mockRunScript(t, {
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

  const runScript = await mockRunScript(t, {
    'ci-info': { isCI: false },
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/no-tty.js': () => false,
  }, { level: 3 })

  const OUTPUT = []
  await runScript({
    output: msg => {
      OUTPUT.push(msg)
    },
    runPath: '/foo/',
  })
  t.matchSnapshot(OUTPUT.join('\n'), 'should print colorized output')
})

t.test('no color interactive mode msg', async t => {
  t.plan(2)

  const runScript = await mockRunScript(t, {
    'ci-info': { isCI: false },
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/no-tty.js': () => false,
  })

  const OUTPUT = []
  await runScript({
    output: msg => {
      OUTPUT.push(msg)
    },
    runPath: '/foo/',
  })
  t.matchSnapshot(OUTPUT.join('\n'), 'should print non-colorized output')
})

t.test('no tty', async t => {
  t.plan(1)

  const runScript = await mockRunScript(t, {
    'ci-info': { isCI: false },
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/no-tty.js': () => true,
  })

  await runScript()
})

t.test('ci env', async t => {
  t.plan(2)

  const runScript = await mockRunScript(t, {
    'ci-info': { isCI: true },
    '@npmcli/run-script': async () => {
      throw new Error('should not call run-script')
    },
    '../lib/no-tty.js': () => false,
    'proc-log': {
      warn (title, msg) {
        t.equal(title, 'exec', 'should have expected title')
        t.equal(
          msg,
          'Interactive mode disabled in CI environment',
          'should have expected ci environment message'
        )
      },
    },
  })

  await runScript()
})
