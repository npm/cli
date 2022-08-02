const t = require('tap')

const baseOpts = {
  args: [],
  call: '',
  color: false,
  path: '',
  runPath: '',
  shell: process.platform === 'win32'
    ? process.env.ComSpec || 'cmd'
    : process.env.SHELL || 'sh',
}

t.test('disable, enable log progress', t => {
  t.plan(3)

  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'pkg',
    }),
  })
  const runScript = t.mock('../lib/run-script.js', {
    '@npmcli/ci-detect': () => false,
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

  runScript({
    ...baseOpts,
    path,
  })
})

t.test('no package.json', t => {
  t.plan(1)

  const runScript = t.mock('../lib/run-script.js', {
    '@npmcli/ci-detect': () => false,
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/no-tty.js': () => false,
  })

  runScript(baseOpts)
})

t.test('colorized interactive mode msg', t => {
  t.plan(2)

  const runScript = t.mock('../lib/run-script.js', {
    '@npmcli/ci-detect': () => false,
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/no-tty.js': () => false,
  })

  const OUTPUT = []
  runScript({
    ...baseOpts,
    output: msg => {
      OUTPUT.push(msg)
    },
    runPath: '/foo/',
    color: true,
  })
    .then(() => {
      t.matchSnapshot(OUTPUT.join('\n'), 'should print colorized output')
    })
    .catch(err => {
      throw err
    })
})

t.test('no color interactive mode msg', t => {
  t.plan(2)

  const runScript = t.mock('../lib/run-script.js', {
    '@npmcli/ci-detect': () => false,
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/no-tty.js': () => false,
  })

  const OUTPUT = []
  runScript({
    ...baseOpts,
    output: msg => {
      OUTPUT.push(msg)
    },
    runPath: '/foo/',
  })
    .then(() => {
      t.matchSnapshot(OUTPUT.join('\n'), 'should print non-colorized output')
    })
    .catch(err => {
      throw err
    })
})

t.test('no tty', t => {
  t.plan(1)

  const runScript = t.mock('../lib/run-script.js', {
    '@npmcli/ci-detect': () => false,
    '@npmcli/run-script': async () => {
      t.ok('should call run-script')
    },
    '../lib/no-tty.js': () => true,
  })

  runScript(baseOpts)
})

t.test('ci env', t => {
  t.plan(2)

  const runScript = t.mock('../lib/run-script.js', {
    '@npmcli/ci-detect': () => true,
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

  runScript({ ...baseOpts })
})
