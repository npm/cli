const t = require('tap')
const fs = require('fs')
const { fake: mockNpm } = require('../../fixtures/mock-npm')

const config = {
  global: false,
}
const flatOptions = {
  depth: 0,
}
const npm = mockNpm({
  config,
  flatOptions,
  lockfileVersion: 2,
  globalDir: '',
  prefix: '',
})
const tree = {
  meta: {
    hiddenLockfile: null,
    loadedFromDisk: false,
    filename: '',
    originalLockfileVersion: 2,
    save () {},
  },
}
const mocks = {
  npmlog: { notice () {} },
  '@npmcli/arborist': class {
    loadVirtual () {
      return tree
    }

    loadActual () {
      return tree
    }
  },
  '../../../lib/utils/usage.js': () => 'usage instructions',
  '../../../lib/utils/config/definitions.js': {},
}

t.afterEach(() => {
  npm.prefix = ''
  config.global = false
  npm.globalDir = ''
})

t.test('no args', async t => {
  t.plan(4)

  npm.prefix = '/project/a'

  class Arborist {
    constructor (args) {
      t.same(
        args,
        { ...flatOptions, path: npm.prefix },
        'should call arborist constructor with expected args'
      )
    }

    async loadVirtual () {
      t.ok('should load virtual tree')
      return {
        ...tree,
        meta: {
          ...tree.meta,
          save () {
            t.ok('should save the lockfile')
          },
        },
      }
    }
  }

  const npmlog = {
    notice (title, msg) {
      t.equal(
        msg,
        'created a lockfile as npm-shrinkwrap.json',
        'should log notice msg that file was successfully created'
      )
    },
  }

  const Shrinkwrap = t.mock('../../../lib/commands/shrinkwrap.js', {
    ...mocks,
    npmlog,
    '@npmcli/arborist': Arborist,
  })
  const shrinkwrap = new Shrinkwrap(npm)

  await shrinkwrap.exec([])
})

t.test('no virtual tree', async t => {
  t.plan(4)

  npm.prefix = '/project/a'

  class Arborist {
    constructor (args) {
      t.same(
        args,
        { ...flatOptions, path: npm.prefix },
        'should call arborist constructor with expected args'
      )
    }

    async loadVirtual () {
      throw new Error('ERR')
    }

    async loadActual () {
      t.ok('should load actual tree')
      return {
        ...tree,
        meta: {
          ...tree.meta,
          save () {
            t.ok('should save the lockfile')
          },
        },
      }
    }
  }

  const npmlog = {
    notice (title, msg) {
      t.equal(
        msg,
        'created a lockfile as npm-shrinkwrap.json',
        'should log notice msg that file was successfully created'
      )
    },
  }

  const Shrinkwrap = t.mock('../../../lib/commands/shrinkwrap.js', {
    ...mocks,
    npmlog,
    '@npmcli/arborist': Arborist,
  })
  const shrinkwrap = new Shrinkwrap(npm)

  await shrinkwrap.exec([])
})

t.test('existing package-json file', async t => {
  t.plan(5)

  npm.prefix = '/project/a'

  class Arborist {
    constructor (args) {
      t.same(
        args,
        { ...flatOptions, path: npm.prefix },
        'should call arborist constructor with expected args'
      )
    }

    async loadVirtual () {
      t.ok('should load virtual tree')
      return {
        ...tree,
        meta: {
          hiddenLockfile: false,
          loadedFromDisk: true,
          filename: 'package-lock.json',
          save () {
            t.ok('should save the lockfile')
          },
        },
      }
    }
  }

  const npmlog = {
    notice (title, msg) {
      t.equal(
        msg,
        'package-lock.json has been renamed to npm-shrinkwrap.json',
        'should log notice msg that file was renamed'
      )
    },
  }

  const fs = {
    promises: {
      unlink (filename) {
        t.equal(filename, 'package-lock.json', 'should remove old lockfile')
      },
    },
  }

  const Shrinkwrap = t.mock('../../../lib/commands/shrinkwrap.js', {
    ...mocks,
    fs,
    npmlog,
    '@npmcli/arborist': Arborist,
  })
  const shrinkwrap = new Shrinkwrap(npm)

  await shrinkwrap.exec([])
})

t.test('update shrinkwrap file version', async t => {
  t.plan(4)

  npm.prefix = '/project/a'

  class Arborist {
    constructor (args) {
      t.same(
        args,
        { ...flatOptions, path: npm.prefix },
        'should call arborist constructor with expected args'
      )
    }

    async loadVirtual () {
      t.ok('should load virtual tree')
      return {
        ...tree,
        meta: {
          hiddenLockfile: false,
          loadedFromDisk: true,
          filename: 'npm-shrinkwrap.json',
          originalLockfileVersion: 1,
          save () {
            t.ok('should save the lockfile')
          },
        },
      }
    }
  }

  const npmlog = {
    notice (title, msg) {
      t.equal(
        msg,
        'npm-shrinkwrap.json updated to version 2',
        'should log notice msg that file was updated'
      )
    },
  }

  const Shrinkwrap = t.mock('../../../lib/commands/shrinkwrap.js', {
    ...mocks,
    npmlog,
    '@npmcli/arborist': Arborist,
  })
  const shrinkwrap = new Shrinkwrap(npm)

  await shrinkwrap.exec([])
})

t.test('update to date shrinkwrap file', async t => {
  t.plan(4)

  npm.prefix = '/project/a'

  class Arborist {
    constructor (args) {
      t.same(
        args,
        { ...flatOptions, path: npm.prefix },
        'should call arborist constructor with expected args'
      )
    }

    async loadVirtual () {
      t.ok('should load virtual tree')
      return {
        ...tree,
        meta: {
          hiddenLockfile: false,
          loadedFromDisk: true,
          filename: 'npm-shrinkwrap.json',
          originalLockfileVersion: 2,
          save () {
            t.ok('should save the lockfile')
          },
        },
      }
    }
  }

  const npmlog = {
    notice (title, msg) {
      t.equal(
        msg,
        'npm-shrinkwrap.json up to date',
        'should log notice msg shrinkwrap up to date'
      )
    },
  }

  const Shrinkwrap = t.mock('../../../lib/commands/shrinkwrap.js', {
    ...mocks,
    npmlog,
    '@npmcli/arborist': Arborist,
  })
  const shrinkwrap = new Shrinkwrap(npm)

  await shrinkwrap.exec([])
})

t.test('shrinkwrap --global', async t => {
  const Shrinkwrap = t.mock('../../../lib/commands/shrinkwrap.js', mocks)

  config.global = true
  const shrinkwrap = new Shrinkwrap(npm)

  await t.rejects(
    shrinkwrap.exec([]),
    { code: 'ESHRINKWRAPGLOBAL', message: /does not work for global packages/ },
    'should throw no global support msg'
  )
})

t.test('works without fs.promises', async t => {
  t.doesNotThrow(() => {
    const Shrinkwrap = t.mock('../../../lib/commands/shrinkwrap.js', {
      ...mocks,
      fs: { ...fs, promises: null },
    })
    new Shrinkwrap(npm)
  })
})
