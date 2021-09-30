const chokidar = require('chokidar')
const EE = require('events')
const Minipass = require('minipass')
const bin = require.resolve('../bin/run.js')
const {spawn} = require('child_process')
const onExit = require('signal-exit')
const {writeFileSync, readFileSync} = require('fs')
const {stringify} = require('tap-yaml')
const {resolve} = require('path')

class Watch extends Minipass {
  constructor (options) {
    if (!options.coverage)
      throw new Error('--watch requires coverage to be enabled')
    super()
    this.args = [bin, ...options._.parsed, '--no-watch']
    this.positionals = [...options._]
    this.log('initial test run', this.args)
    this.proc = spawn(process.execPath, this.args, {
      stdio: 'inherit'
    })
    this.proc.on('close', () => this.main())
    const saveFolder = 'node_modules/.cache/tap'
    require('../settings.js').mkdirRecursiveSync(saveFolder)
    this.saveFile = saveFolder + '/watch-' + process.pid
    /* istanbul ignore next */
    onExit(() => require('../settings.js').rmdirRecursiveSync(this.saveFile))
    this.index = null
    this.indexFile = '.nyc_output/processinfo/index.json'
    this.fileList = []
    this.queue = []
    this.watcher = null
    this.env = { ...process.env }
  }

  readIndex () {
    this.index = JSON.parse(readFileSync(this.indexFile, 'utf8'))
  }

  kill (signal) {
    if (this.proc)
      this.proc.kill(signal)
  }

  watchList () {
    if (!this.index)
      this.readIndex()
    // externalIds are the relative path to a test file
    // the files object keys are fully resolved.
    // If a test is covered, it'll show up in both!
    // Since a covered test was definitely included in its own
    // test run, don't add it a second time, so we don't get
    // two chokidar events for the same file change.
    const cwd = process.cwd()
    const fileSet = new Set(Object.keys(this.index.files))
    Object.keys(this.index.externalIds)
      .filter(f => !fileSet.has(resolve(f)))
      .forEach(f => fileSet.add(f))
    return [...fileSet]
  }

  pause () {
    if (this.watcher)
      this.watcher.close()
    this.watcher = null
  }

  resume () {
    if (!this.watcher)
      this.watch()
  }

  main () {
    this.emit('main')
    this.proc = null
    this.fileList = this.watchList()
    this.watch()
  }

  watch () {
    this.pause()
    const sawAdd = new Map()
    const watcher = this.watcher = chokidar.watch(this.fileList)
    // ignore the first crop of add events, since we already ran the tests
    watcher.on('all', (ev, file) => {
      if (ev === 'add' && !sawAdd.get(file))
        sawAdd.set(file, true)
      else
        this.onChange(ev, file)
    })
    return watcher
  }

  onChange (ev, file) {
    const tests = this.testsFromChange(file)

    this.queue.push(...tests)
    this.log(ev + ' ' + file)

    if (this.proc)
      return this.log('test in progress, queuing for next run')

    this.run()
  }

  run (env) {
    const set = [...new Set(this.queue)]
    this.log('running tests', set)
    writeFileSync(this.saveFile, set.join('\n') + '\n')
    this.queue.length = 0

    this.proc = spawn(process.execPath, [
      ...this.args, '--save=' + this.saveFile, '--nyc-arg=--no-clean'
    ], {
      stdio: 'inherit',
      env: this.env,
    })
    this.proc.on('close', (code, signal) => this.onClose(code, signal))
    this.emit('process', this.proc)
  }

  onClose (code, signal) {
    this.readIndex()
    this.proc = null

    // only add if it's not already there as either a test or included file
    const newFileList = this.watchList().filter(f =>
        !this.fileList.includes(f) &&
        !this.fileList.includes(resolve(f)))

    this.fileList.push(...newFileList)
    this.resume()
    newFileList.forEach(f => this.watcher.add(f))

    // if there are any failures (especially, from a bail out)
    // then add those, but ignore if it's not there.
    const leftover = (() => {
      try {
        return fs.readFileSync(saveFile, 'utf8').trim().split('\n')
      } catch (er) {
        return []
      }
    })()
    // run again if something was added during the process
    const runAgain = this.queue.length
    this.queue.push(...leftover)

    if (runAgain)
      this.run()
    else
      this.emit('afterProcess', {code, signal})
  }

  log (msg, arg) {
    if (arg && typeof arg !== 'string')
      msg += '\n' + stringify(arg)
    this.write(msg + '\n')
  }

  testsFromChange (file) {
    return this.index.externalIds[file] ? [file]
      : this.testsFromFile(file)
  }

  testsFromFile (file) {
    const reducer = (set, uuid) => {
      for (let process = this.index.processes[uuid];
          process;
          process = process.parent && this.index.processes[process.parent]) {
        if (process.externalId)
          set.add(process.externalId)
      }
      return set
    }
    const procs = this.index.files[file] || /* istanbul ignore next */ []
    return [...procs.reduce(reducer, new Set())]
  }
}

module.exports = {Watch}
