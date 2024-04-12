const t = require('tap')
const tmock = require('../../fixtures/tmock')
const mockLogs = require('../../fixtures/mock-logs')
const { inspect } = require('util')

const mockDisplay = async (t, { mocks, load } = {}) => {
  const { Chalk } = await import('chalk')
  const { log } = require('proc-log')
  const logs = mockLogs()
  const Display = tmock(t, '{LIB}/utils/display', mocks)
  const display = new Display(logs.streams)
  display.load({
    loglevel: 'silly',
    chalk: new Chalk({ level: 0 }),
    heading: 'npm',
    ...load,
  })
  t.teardown(() => display.off())
  return {
    display,
    log,
    ...logs.logs,
  }
}

t.test('can log cleanly', async (t) => {
  const explains = []
  const { log, logs } = await mockDisplay(t, {
    mocks: {
      '{LIB}/utils/explain-eresolve.js': {
        explain: (...args) => {
          explains.push(args)
          return 'explanation'
        },
      },
    },
  })

  log.error('', 'test\x00message')
  t.match(logs.error, ['test^@message'])

  log.warn('ERESOLVE', 'hello', { some: 'object' })
  t.match(logs.warn, ['ERESOLVE hello'])
  t.match(explains, [[{ some: 'object' }, Function, 2]])
})

t.test('can do progress', async (t) => {
  const { log, logs } = await mockDisplay(t, {
    load: {
      progress: true,
      loglevel: 'error',
    },
  })

  log.silly('', 'this would go to progress')

  t.strictSame(logs, [], 'no logs were shown normally')
})

t.test('handles log throwing', async (t) => {
  const { log, logs } = await mockDisplay(t, {
    mocks: {
      '{LIB}/utils/explain-eresolve.js': {
        explain: () => {
          throw new Error('explain')
        },
      },
    },
  })

  log.warn('ERESOLVE', 'hello', { some: 'object' })

  t.match(logs.verbose[0],
    `attempt to log crashed ERESOLVE hello { some: 'object' } Error: explain`)
})

t.test('Display.clean', async (t) => {
  const { display, outputs, clearOutput } = await mockDisplay(t)

  class CustomObj {
    #inspected

    constructor (val) {
      this.#inspected = val
    }

    [inspect.custom] () {
      return this.#inspected
    }
  }

  const tests = [
    [477, '477'],
    [null, 'null'],
    [NaN, 'NaN'],
    [true, 'true'],
    [undefined, 'undefined'],
    ['🚀', '🚀'],
    // Cover the bounds of each range and a few characters from inside each range
    // \x00 through \x1f
    ['hello\x00world', 'hello^@world'],
    ['hello\x07world', 'hello^Gworld'],
    ['hello\x1bworld', 'hello^[world'],
    ['hello\x1eworld', 'hello^^world'],
    ['hello\x1fworld', 'hello^_world'],
    // \x7f is C0
    ['hello\x7fworld', 'hello^?world'],
    // \x80 through \x9f
    ['hello\x80world', 'hello^@world'],
    ['hello\x87world', 'hello^Gworld'],
    ['hello\x9eworld', 'hello^^world'],
    ['hello\x9fworld', 'hello^_world'],
    // Allowed C0
    ['hello\tworld', 'hello\tworld'],
    ['hello\nworld', 'hello\nworld'],
    ['hello\vworld', 'hello\vworld'],
    ['hello\rworld', 'hello\rworld'],
    // Allowed SGR
    ['hello\x1b[38;5;254mworld', 'hello\x1b[38;5;254mworld'],
    ['hello\x1b[mworld', 'hello\x1b[mworld'],
    // Unallowed CSI / OSC
    ['hello\x1b[2Aworld', 'hello^[[2Aworld'],
    ['hello\x9b[2Aworld', 'hello^[[2Aworld'],
    ['hello\x9decho goodbye\x9cworld', 'hello^]echo goodbye^\\world'],
    // This is done twice to ensure we define inspect.custom as writable
    [{ test: 'object' }, "{ test: 'object' }"],
    // Make sure custom util.inspect doesn't bypass our cleaning
    [new CustomObj(NaN), 'NaN'],
    [new CustomObj(null), 'null'],
    [new CustomObj(477), '477'],
    [new CustomObj({ custom: 'rend\x00ering' }), "{ custom: 'rend\\x00ering' }"],
    [new CustomObj('custom\x00rendering'), 'custom^@rendering'],
    [new CustomObj(undefined), 'undefined'],
    // UTF-16 form of 8-bit C1
    ['hello\xc2\x9bworld', 'hello\xc2^[world'],
  ]

  for (const [dirty, clean] of tests) {
    display.output(dirty)
    t.equal(outputs[0], clean)
    clearOutput()
  }
})
