const { join, resolve, basename } = require('path')
const t = require('tap')
const runScript = require('@npmcli/run-script')
const localeCompare = require('@isaacs/string-locale-compare')('en')
const tnock = require('../fixtures/tnock')
const fs = require('fs')
const fsp = require('fs/promises')
const npmFs = require('@npmcli/fs')

let failRm = false
let failRename = null
let failRenameOnce = null
let failMkdir = null
const { rename: realRename, rm: realRm, mkdir: realMkdir } = fs
const fsMock = {
  ...fs,
  mkdir (...args) {
    if (failMkdir) {
      process.nextTick(() => args.pop()(failMkdir))
      return
    }

    return realMkdir(...args)
  },
  rename (...args) {
    if (failRename) {
      process.nextTick(() => args.pop()(failRename))
    } else if (failRenameOnce) {
      const er = failRenameOnce
      failRenameOnce = null
      process.nextTick(() => args.pop()(er))
    } else {
      return realRename(...args)
    }
  },
  rm (...args) {
    if (failRm) {
      process.nextTick(() => args.pop()(new Error('rm fail')))
      return
    }

    realRm(...args)
  },
}
const fspMock = {
  ...fsp,
  mkdir: async (...args) => {
    if (failMkdir) {
      throw failMkdir
    }

    return fsp.mkdir(...args)
  },
  rename: async (...args) => {
    if (failRename) {
      throw failRename
    } else if (failRenameOnce) {
      const er = failRenameOnce
      failRenameOnce = null
      throw er
    } else {
      return fsp.rename(...args)
    }
  },
  rm: async (...args) => {
    if (failRm) {
      throw new Error('rm fail')
    }

    return fsp.rm(...args)
  },
}
// need this to be injected so that it doesn't pull from main cache
const { moveFile } = t.mock('@npmcli/fs', { 'fs/promises': fspMock })
const mocks = {
  fs: fsMock,
  'fs/promises': fspMock,
  '@npmcli/fs': { ...npmFs, moveFile },
}

const oldLockfileWarning = [
  'warn',
  'old lockfile',
  `
The package-lock.json file was created with an old version of npm,
so supplemental metadata must be fetched from the registry.

This is a one-time fix-up, please be patient...
`,
]

// track the warnings that are emitted.  returns a function that removes
// the listener and provides the list of what it saw.
const warningTracker = () => {
  const list = []
  const onlog = (...msg) => msg[0] === 'warn' && list.push(msg)
  process.on('log', onlog)
  return () => {
    process.removeListener('log', onlog)
    return list
  }
}

const debugLogTracker = () => {
  const list = []
  mockDebug.log = (...msg) => list.push(msg)
  return () => {
    mockDebug.log = () => {}
    return list
  }
}
const mockDebug = Object.assign(fn => fn(), { log: () => {} })

const Arborist = t.mock('../../lib/index.js', {
  ...mocks,
  // need to not mock this one, so we still can swap the process object
  '../../lib/signal-handling.js': require('../../lib/signal-handling.js'),

  // mock the debug so we can test these even when not enabled
  '../../lib/debug.js': mockDebug,
})

const { Node, Link, Shrinkwrap } = Arborist

const {
  start,
  stop,
  registry,
  advisoryBulkResponse,
  oneSocket,
} = require('../fixtures/server.js')

t.before(start)
t.teardown(stop)

const cache = t.testdir()

const {
  normalizePath,
  normalizePaths,
  printTree,
} = require('../fixtures/utils.js')

const cwd = normalizePath(process.cwd())
t.cleanSnapshot = s => s.split(cwd).join('{CWD}')
  .split(registry).join('https://registry.npmjs.org/')

const fixture = (t, p) => require('../fixtures/reify-cases/' + p)(t)

const printReified = (path, opt) => reify(path, opt).then(printTree)

const newArb = (opt) => new Arborist({
  audit: false,
  cache,
  registry,
  // give it a very long timeout so CI doesn't crash as easily
  timeout: 30 * 60 * 1000,
  ...opt,
})

const reify = (path, opt) => newArb({ path, ...(opt || {}) }).reify(opt)



t.test('second reify with file dependency should not change package-lock.json', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        '@test/a': 'file:a',
      },
    }),
    a: {
      'package.json': JSON.stringify({
        name: '@test/a',
      }),
    },
  })

  const arb = newArb({ path })
  await arb.reify()
  const packageLockContent1 = fs.readFileSync(path + '/package-lock.json', 'utf8')
  t.matchSnapshot(packageLockContent1)
  await arb.reify()
  const packageLockContent2 = fs.readFileSync(path + '/package-lock.json', 'utf8')
  t.equal(packageLockContent2, packageLockContent1)
})
