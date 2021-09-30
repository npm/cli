const {Watch} = require('./watch.js')
const repl = require('repl')
const rimraf = require('rimraf').sync
const {stringify} = require('tap-yaml')
const path = require('path')
const fs = require('fs')
/* istanbul ignore next */
const noop = () => {}

// XXX useGlobal = true, because it doesn't matter, so save the cycles
class Repl {
  constructor (options, input, output) {
    this.output = output || /* istanbul ignore next */ process.stdout
    this.input = input || /* istanbul ignore next */ process.stdin

    this.repl = null
    this._cb = null
    this.watch = new Watch(options)
    this.watch.on('afterProcess', (...args) => this.afterProcess(...args))
    this.watch.on('main', () => this.start(options, input, output))
  }

  start (options, input, output) {
    this.repl = repl.start({
      useColors: options.color,
      input,
      output,
      prompt: 'TAP> ',
      eval: (...args) => this.parseCommand(...args),
      completer: /* istanbul ignore next */ input => this.completer(input),
      writer: res => stringify(res),
    })
    this.repl.history = this.loadHistory()
    // doens't really make sense to have all default Node.js repl commands
    // since we're not parsing JavaScript
    this.repl.commands = {}
    this.repl.removeAllListeners('SIGINT')
    this.repl.on('SIGINT', () => {
      if (this.watch.proc) {
        this.watch.queue.length = 0
        rimraf(this.watch.saveFile)
        this.watch.kill('SIGTERM')
      } else
        this.parseCommand('exit', null, null, noop)
    })
    this.repl.on('close', () => {
      this.saveHistory()
      this.watch.pause()
    })
  }

  loadHistory () {
    const dir = process.env.HOME || 'node_modules/.cache/tap'

    try {
      return fs.readFileSync(dir + '/.tap_repl_history', 'utf8')
        .trim().split('\n')
    } catch (_) {
      return []
    }
  }

  saveHistory () {
    const dir = process.env.HOME || 'node_modules/.cache/tap'

    require('../settings.js').mkdirRecursiveSync(dir)
    try {
      fs.writeFileSync(dir + '/.tap_repl_history',
        this.repl.history.join('\n').trim())
    } catch (e) {}
  }

  get running () {
    return !!this.watch.proc
  }

  parseCommand (input, _, __, cb) {
    if (this.running)
      return cb(null, 'test in progress, please wait')

    input = input.trimLeft().split(' ')
    const cmd = input.shift().trim()
    const arg = input.join(' ').trim()

    switch (cmd) {
      case 'r':
        return this.run(arg, cb)
      case 'u':
        return this.update(arg, cb)
      case 'n':
        return this.changed(cb)
      case 'p':
        return this.pauseResume(cb)
      case 'c':
        return this.coverageReport(arg, cb)
      case 'exit':
        return this.exit(cb)
      case 'clear':
        return this.clear(cb)
      case 'cls':
        this.repl.output.write('\u001b[2J\u001b[H')
        return cb()
      default:
        return this.help(cb)
    }
  }

  run (arg, cb) {
    this.watch.queue.length = 0
    rimraf(this.watch.saveFile)
    if (arg) {
      const tests = this.watch.positionals
      if (tests.length && !tests.includes(arg)) {
        tests.push(arg)
        this.watch.args.push(arg)
      }
      this.watch.queue.push(arg)
    }
    this._cb = cb
    this.watch.run()
  }

  afterProcess (res) {
    if (this._cb) {
      const cb = this._cb
      this._cb = null
      cb(null, res)
    } else {
      this.output.write(stringify(res))
      this.repl.displayPrompt(true)
    }
  }

  update (arg, cb) {
    const envBefore = this.watch.env
    this.watch.env = {
      ...this.watch.env,
      TAP_SNAPSHOT: '1'
    }
    this.run(arg, (er, res) => {
      this.watch.env = envBefore
      cb(er, res)
    })
  }

  changed (cb) {
    this.watch.args.push('--changed')
    this.run(null, (er, res) => {
      this.watch.args.pop()
      cb(er, res)
    })
  }

  pauseResume (cb) {
    if (this.watch.watcher)
      this.watch.pause()
    else
      this.watch.resume()
    this.output.write(this.watch.watcher ? 'resumed\n' : 'paused\n')
    cb()
  }

  coverageReport (arg, cb) {
    const report = arg || 'text'
    const args = this.watch.args
    this.watch.args = [this.watch.args[0], '--coverage-report=' + report]
    this.run(null, (er, res) => {
      this.watch.args = args
      cb(er, res)
    })
  }

  clear (cb) {
    rimraf('.nyc_output')
    this.run(null, cb)
  }

  exit (cb) {
    this.watch.pause()
    this.watch.kill('SIGTERM')
    this.repl.close()
  }

  help (cb) {
    this.output.write(`TAP Repl Commands:

r [<filename>]
  run test suite, or the supplied filename

u [<filename>]
  update snapshots in the suite, or in the supplied filename

n
  run the suite with --changed

p
  pause/resume the file watcher

c [<report style>]
  run coverage report. Default to 'text' style.

exit
  exit the repl

clear
  delete all coverage info and re-run the test suite

cls
  clear the screen
`)
    cb()
  }

  filterCompletions (list, input) {
    const hits = list.filter(l => l.startsWith(input))
    return hits.length ? hits : list
  }

  completer (input) {
    const cmdArg = input.trimLeft().split(' ')
    const cmd = cmdArg.shift()
    const arg = cmdArg.join(' ').trimLeft()
    const commands = ['r', 'u', 'n', 'p', 'c', 'exit', 'clear', 'cls']
    if (cmd === 'r' || cmd === 'u') {
      const d = path.dirname(arg)
      const dir = arg.slice(-1) === '/' ? arg : d === '.' ? '' : d + '/'
      try {
        const set = this.filterCompletions(
          fs.readdirSync(dir || '.')
            .map(f => fs.statSync(dir + f).isDirectory() ? f + '/' : f)
            .map(f => cmd + ' ' + dir + f), input)
        return [set, input]
      } catch (er) {
        return [[cmd], input]
      }
    } else {
      return [this.filterCompletions(commands, input), input]
    }
  }
}

module.exports = {Repl}
