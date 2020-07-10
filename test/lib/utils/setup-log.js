const t = require('tap')
const requireInject = require('require-inject')

const settings = {}
t.afterEach(cb => {
  Object.keys(settings).forEach(k => { delete settings[k] })
  cb()
})

const setupLog = requireInject('../../../lib/utils/setup-log.js', {
  npmlog: {
    settings,
    enableColor: () => { settings.color = true },
    disableColor: () => { settings.color = false },
    enableUnicode: () => { settings.unicode = true },
    disableUnicode: () => { settings.unicode = false },
    enableProgress: () => { settings.progress = true },
    disableProgress: () => { settings.progress = false },
    set heading (h) { settings.heading = h },
    set level (l) { settings.level = l }
  }
})

const config = obj => ({
  get (k) {
    return obj[k]
  },
  set (k, v) {
    obj[k] = v
  }
})

t.test('setup with color=always and unicode', t => {
  t.equal(setupLog(config({
    loglevel: 'warn',
    color: 'always',
    unicode: true,
    progress: false
  })), true)

  t.strictSame(settings, {
    level: 'warn',
    color: true,
    unicode: true,
    progress: false,
    heading: 'npm'
  })

  t.end()
})

t.test('setup with color=true, no unicode, and non-TTY terminal', t => {
  const { isTTY: stderrIsTTY } = process.stderr
  const { isTTY: stdoutIsTTY } = process.stdout
  t.teardown(() => {
    process.stderr.isTTY = stderrIsTTY
    process.stdout.isTTY = stdoutIsTTY
  })
  process.stderr.isTTY = false
  process.stdout.isTTY = false

  t.equal(setupLog(config({
    loglevel: 'warn',
    color: false,
    progress: false,
    heading: 'asdf'
  })), false)

  t.strictSame(settings, {
    level: 'warn',
    color: false,
    unicode: false,
    progress: false,
    heading: 'asdf'
  })

  t.end()
})

t.test('setup with color=true, no unicode, and dumb TTY terminal', t => {
  const { isTTY: stderrIsTTY } = process.stderr
  const { isTTY: stdoutIsTTY } = process.stdout
  const { TERM } = process.env
  t.teardown(() => {
    process.stderr.isTTY = stderrIsTTY
    process.stdout.isTTY = stdoutIsTTY
    process.env.TERM = TERM
  })
  process.stderr.isTTY = true
  process.stdout.isTTY = true
  process.env.TERM = 'dumb'

  t.equal(setupLog(config({
    loglevel: 'warn',
    color: true,
    progress: false,
    heading: 'asdf'
  })), true)

  t.strictSame(settings, {
    level: 'warn',
    color: true,
    unicode: false,
    progress: false,
    heading: 'asdf'
  })

  t.end()
})

t.test('setup with color=true, no unicode, and non-dumb TTY terminal', t => {
  const { isTTY: stderrIsTTY } = process.stderr
  const { isTTY: stdoutIsTTY } = process.stdout
  const { TERM } = process.env
  t.teardown(() => {
    process.stderr.isTTY = stderrIsTTY
    process.stdout.isTTY = stdoutIsTTY
    process.env.TERM = TERM
  })
  process.stderr.isTTY = true
  process.stdout.isTTY = true
  process.env.TERM = 'totes not dum'

  t.equal(setupLog(config({
    loglevel: 'warn',
    color: true,
    progress: true,
    heading: 'asdf'
  })), true)

  t.strictSame(settings, {
    level: 'warn',
    color: true,
    unicode: false,
    progress: true,
    heading: 'asdf'
  })

  t.end()
})

t.test('setup with non-TTY stdout, TTY stderr', t => {
  const { isTTY: stderrIsTTY } = process.stderr
  const { isTTY: stdoutIsTTY } = process.stdout
  const { TERM } = process.env
  t.teardown(() => {
    process.stderr.isTTY = stderrIsTTY
    process.stdout.isTTY = stdoutIsTTY
    process.env.TERM = TERM
  })
  process.stderr.isTTY = true
  process.stdout.isTTY = false
  process.env.TERM = 'definitely not a dummy'

  t.equal(setupLog(config({
    loglevel: 'warn',
    color: true,
    progress: true,
    heading: 'asdf'
  })), false)

  t.strictSame(settings, {
    level: 'warn',
    color: true,
    unicode: false,
    progress: true,
    heading: 'asdf'
  })

  t.end()
})

t.test('setup with TTY stdout, non-TTY stderr', t => {
  const { isTTY: stderrIsTTY } = process.stderr
  const { isTTY: stdoutIsTTY } = process.stdout
  const { TERM } = process.env
  t.teardown(() => {
    process.stderr.isTTY = stderrIsTTY
    process.stdout.isTTY = stdoutIsTTY
    process.env.TERM = TERM
  })
  process.stderr.isTTY = false
  process.stdout.isTTY = true

  t.equal(setupLog(config({
    loglevel: 'warn',
    color: true,
    progress: true,
    heading: 'asdf'
  })), true)

  t.strictSame(settings, {
    level: 'warn',
    color: false,
    unicode: false,
    progress: false,
    heading: 'asdf'
  })

  t.end()
})

t.test('set loglevel to timing', t => {
  setupLog(config({
    timing: true,
    loglevel: 'notice'
  }))
  t.equal(settings.level, 'timing')
  t.end()
})
