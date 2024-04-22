const EventEmitter = require('events')
const tmock = require('./tmock')
const mockGlobals = require('@npmcli/mock-globals')

class MockProcess extends EventEmitter {
  version = process.version

  constructor (opts) {
    super()
    Object.assign(this, opts)
  }

  cwd () {
    return process.cwd()
  }

  exit (code) {
    this.emit('exit', code)
  }
}

const mockExit = (t, { mocks } = {}) => {
  const consoleErrors = []

  mockGlobals(t, {
    'console.error': (err) => consoleErrors.push(err),
  })

  const ExitHandler = tmock(t, '{LIB}/cli/exit-handler.js', {
    os: {
      type: () => 'Foo',
      release: () => '1.0.0',
    },
    ...mocks,
  })

  const mockProcess = new MockProcess()
  const exitHandler = new ExitHandler({ process: mockProcess })

  return {
    process: mockProcess,
    exitHandler,
    consoleErrors,
  }
}

module.exports = {
  mockExit,
  MockProcess,
}
