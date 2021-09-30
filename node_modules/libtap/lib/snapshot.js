'use strict'

const fs = require('fs')
const path = require('path')

// initialize once so it doesn't get borked if process.argv is changed later
const process = require('./process.js')
const cwd = process.cwd()
const main = require('./find-main-script.js')('TAP')
const settings = require('../settings.js')

class Snapshot {
  constructor () {
    this.indexes = new Map()
    // name them .test.cjs so that nyc ignores them
    // base on main test filename, with sanitized argv
    const args = process.argv.slice(2)
    const head = path.relative(cwd, path.resolve(main))
    const tail = args.length === 0 ? ''
      : ('-' + args.join(' ').replace(/[^a-zA-Z0-9\._\-]/g, '-'))
    this.file = settings.snapshotFile(cwd, head, tail)

    this.snapshot = null
  }

  // should only ever call _one_ of read/save
  read (message) {
    const index = +this.indexes.get(message) || 1
    this.indexes.set(message, index + 1)
    try {
      // throw before the require() for missing file, because node
      // caches module load errors, and we might create it at some point.
      if (!fs.statSync(this.file).isFile())
        throw 'not a file'
      this.snapshot = this.snapshot || require(this.file)
    } catch {
      throw new Error(
        'Snapshot file not found: ' + this.file + '\n' +
        'Run with TAP_SNAPSHOT=1 in the environment\n' +
        'to create snapshot files'
      )
    }

    const entry = message + ' ' + index
    const s = this.snapshot[entry]
    if (s === undefined)
      throw new Error(
        'Snapshot entry not found: "' + entry + '"\n' +
        'Run with TAP_SNAPSHOT=1 in the environment\n' +
        'to create snapshots'
      )

    return s.replace(/^\n|\n$/g, '')
  }

  snap (data, message) {
    const index = +this.indexes.get(message) || 1
    this.indexes.set(message, index + 1)
    this.snapshot = this.snapshot || {}
    this.snapshot[message + ' ' + index] = data
  }

  save () {
    if (!this.snapshot) {
      try {
        fs.unlinkSync(this.file)
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error
        }
      }
    } else {
      const escape = s => s
        .replace(/\\/g, '\\\\')
        .replace(/\`/g, '\\\`')
        .replace(/\$\{/g, '\\${')

      const data =
        '/* IMPORTANT\n' +
        ' * This snapshot file is auto-generated, but designed for humans.\n' +
        ' * It should be checked into source control and tracked carefully.\n' +
        ' * Re-generate by setting TAP_SNAPSHOT=1 and running tests.\n' +
        ' * Make sure to inspect the output below.  Do not ignore changes!\n' +
        ' */\n\'use strict\'\n' + (
        Object.keys(this.snapshot).sort().map(s =>
          `exports[\`${
            escape(s)
          }\`] = \`\n${
            escape(this.snapshot[s])
          }\n\`\n`).join('\n'))
      settings.mkdirRecursiveSync(path.dirname(this.file))
      fs.writeFileSync(this.file, data, 'utf8')
    }
  }
}

module.exports = Snapshot
