const Module = require('module')
const { isAbsolute } = require('path')
const process = require('./process.js')

const isPlainObject = obj => obj
  && typeof obj === 'object'
  && (Object.getPrototypeOf(obj) === null
    || Object.getPrototypeOf(obj) === Object.prototype)

class Mock {
  constructor(parentFilename, filename, mocks = {}) {
    this.filename = filename
    this.mocks = new Map()

    if (!parentFilename || typeof parentFilename !== 'string') {
      throw new TypeError('A parentFilename is required to resolve Mocks paths')
    }

    if (!filename || typeof filename !== 'string') {
      throw new TypeError('t.mock() first argument should be a string')
    }

    if (!isPlainObject(mocks)) {
      throw new TypeError(
        'mocks should be a a key/value object in which keys ' +
        `are the same used in ${filename} require calls`
      )
    }

    const self = this
    const callerTestRef = Module._cache[parentFilename]
    const filePath = Module._resolveFilename(filename, callerTestRef)

    // populate mocks Map from resolved filenames
    for (const key of Object.keys(mocks)) {
      const mockFilePath = Module._resolveFilename(key, callerTestRef)
      this.mocks.set(mockFilePath, mocks[key])
    }

    // keep a cache system for non-mocked files
    const seen = new Map()

    class MockedModule extends Module {
      require (id) {
        const requiredFilePath = Module._resolveFilename(id, this)

        // if it's a mocked file, just serve that instead
        if (self.mocks.has(requiredFilePath))
          return self.mocks.get(requiredFilePath)

        // builtin, not-mocked modules need to be loaded via regular require fn
        const isWindows = process.platform === 'win32';
        /* istanbul ignore next - platform dependent code path */
        const isRelative = id.startsWith('./') ||
          id.startsWith('../') ||
          ((isWindows && id.startsWith('.\\')) ||
          id.startsWith('..\\'))
        if (!isRelative && !isAbsolute(id))
          return super.require(id)

        // if non-mocked file that we've seen, return that instead
        // this enable cicle-required deps to work
        if (seen.has(requiredFilePath))
          return seen.get(requiredFilePath).exports

        // load any not-mocked module via our MockedModule class
        // also sets them in our t.mock realm cache to avoid cicles
        const unmockedModule = new MockedModule(requiredFilePath, this)
        seen.set(requiredFilePath, unmockedModule)
        unmockedModule.load(requiredFilePath)
        return unmockedModule.exports
      }
    }

    this.module = new MockedModule(filePath, callerTestRef)
    this.module.load(filePath)
  }

  static get(parentFilename, filename, mocks) {
    const mock = new Mock(parentFilename, filename, mocks)
    return mock.module.exports
  }
}

module.exports = Mock
