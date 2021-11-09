const t = require('tap')
const fs = require('fs').promises
const path = require('path')
const os = require('os')

const LogFiles = require('../../../lib/utils/log-file.js')
const Timers = require('../../../lib/utils/timers.js')

const log = (...args) => process.emit('log', ...args)
const time = (...args) => process.emit('time', ...args)
const timeEnd = (...args) => process.emit('timeEnd', ...args)
const last = arr => arr[arr.length - 1]

const readLogs = async (dir) => {
  const logDirPath = path.join(dir, '_logs')
  const logDir = await fs.readdir(logDirPath)
  return Promise.all(logDir.map(async (f) => {
    const logs = await fs.readFile(path.join(logDirPath, f), 'utf-8')
    const rawLogs = logs.split(os.EOL)
    return {
      filename: f,
      rawLogs,
      logs: rawLogs.filter(Boolean),
    }
  }))
}

t.test('stuff', async t => {
  const root = t.testdir()

  const logFiles = new LogFiles({
    maxLogsPerFile: 10,
    timers: new Timers(),
  })

  log('error', 'buffered')

  logFiles.on({
    dir: root,
    maxFiles: 10,
  })

  for (const i of [...new Array(50)].map((_, i) => i)) {
    log('error', `log ${i}`)
    time(`log ${i}`)
  }

  // Ignored
  log('pause')
  log('resume')
  log('pause')

  for (const i of [...new Array(50)].map((_, i) => i)) {
    timeEnd(`log ${i}`)
  }

  logFiles.off()

  log('error', 'ignored')

  const logs = await readLogs(root)

  console.error(logs)

  t.equal(logs.length, 11)
  t.ok(logs.slice(0, 10).every(f => f.logs.length === 10))
  t.ok(last(logs).logs.length, 1)
  t.ok(logs.every(f => last(f.rawLogs) === ''))
  t.strictSame(
    logFiles.writtenFiles,
    logs.map((l) => path.resolve(root, '_logs', l.filename))
  )
})

// const glob = require('glob')
// const rimraf = require('rimraf')
// const mocks = { glob, rimraf }
// const cleanup = t.mock('../../../lib/utils/cleanup-log-files.js', {
//   glob: (...args) => mocks.glob(...args),
//   rimraf: (...args) => mocks.rimraf(...args),
// })
// const { basename } = require('path')

// const fs = require('fs')

// t.test('clean up those files', t => {
//   const cache = t.testdir({
//     _logs: {
//       '1-debug.log': 'hello',
//       '2-debug.log': 'hello',
//       '3-debug.log': 'hello',
//       '4-debug.log': 'hello',
//       '5-debug.log': 'hello',
//     },
//   })
//   const warn = (...warning) => t.fail('failed cleanup', { warning })
//   return cleanup(cache, 3, warn).then(() => {
//     t.strictSame(fs.readdirSync(cache + '/_logs').sort(), [
//       '3-debug.log',
//       '4-debug.log',
//       '5-debug.log',
//     ])
//   })
// })

// t.test('nothing to clean up', t => {
//   const cache = t.testdir({
//     _logs: {
//       '4-debug.log': 'hello',
//       '5-debug.log': 'hello',
//     },
//   })
//   const warn = (...warning) => t.fail('failed cleanup', { warning })
//   return cleanup(cache, 3, warn).then(() => {
//     t.strictSame(fs.readdirSync(cache + '/_logs').sort(), [
//       '4-debug.log',
//       '5-debug.log',
//     ])
//   })
// })

// t.test('glob fail', t => {
//   mocks.glob = (pattern, cb) => cb(new Error('no globbity'))
//   t.teardown(() => mocks.glob = glob)
//   const cache = t.testdir({})
//   const warn = (...warning) => t.fail('failed cleanup', { warning })
//   return cleanup(cache, 3, warn)
// })

// t.test('rimraf fail', t => {
//   mocks.rimraf = (file, cb) => cb(new Error('youll never rimraf me!'))
//   t.teardown(() => mocks.rimraf = rimraf)

//   const cache = t.testdir({
//     _logs: {
//       '1-debug.log': 'hello',
//       '2-debug.log': 'hello',
//       '3-debug.log': 'hello',
//       '4-debug.log': 'hello',
//       '5-debug.log': 'hello',
//     },
//   })
//   const warnings = []
//   const warn = (...warning) => warnings.push(basename(warning[2]))
//   return cleanup(cache, 3, warn).then(() => {
//     t.strictSame(warnings.sort((a, b) => a.localeCompare(b, 'en')), [
//       '1-debug.log',
//       '2-debug.log',
//     ])
//   })
// })
