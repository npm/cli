const _progress = Symbol('_progress')
const _onError = Symbol('_onError')
const log = require('proc-log')
const proggy = require('proggy')
const c = require('chalk')

const titles = {
  g: c.green('GROUP      '),
  gs: c.green('GROUP_SUB  '),
  f: c.red('FINISH     '),
  fs: c.red('FINISH_SUB '),
}

module.exports = cls => class Tracker extends cls {
  constructor (options = {}) {
    super(options)
    this[_progress] = new Map()
  }

  addTracker (section, subsection = null, key = null) {
    if (section === null || section === undefined) {
      this[_onError](`Tracker can't be null or undefined`)
    }

    if (key === null) {
      key = subsection
    }

    const hasTracker = this[_progress].has(section)
    const hasSubtracker = this[_progress].has(`${section}:${key}`)

    if (hasTracker && subsection === null) {
      // 0. existing tracker, no subsection
      this[_onError](`Tracker "${section}" already exists`)
    } else if (!hasTracker && subsection === null) {
      // 1. no existing tracker, no subsection
      // Create a new progress tracker
      this[_progress].set(section, proggy.createTracker(section))
    } else if (!hasTracker && subsection !== null) {
      // 2. no parent tracker and subsection
      this[_onError](`Parent tracker "${section}" does not exist`)
    } else if (!hasTracker || !hasSubtracker) {
      // 3. existing parent tracker, no subsection tracker
      // Create a new subtracker and update parents
      this[_progress].get(section).update(
        this[_progress].get(section).value,
        this[_progress].get(section).total + 1)
      this[_progress].set(`${section}:${key}`,
        proggy.createTracker(`${section}:${subsection}`))
    }
    // 4. existing parent tracker, existing subsection tracker
    // skip it
  }

  finishTracker (section, subsection = null, key = null) {
    if (section === null || section === undefined) {
      this[_onError](`Tracker can't be null or undefined`)
    }

    if (key === null) {
      key = subsection
    }

    const hasTracker = this[_progress].has(section)
    const hasSubtracker = this[_progress].has(`${section}:${key}`)

    // 0. parent tracker exists, no subsection
    // Finish parent tracker and remove from this[_progress]
    if (hasTracker && subsection === null) {
      // check if parent tracker does
      // not have any remaining children
      const keys = this[_progress].keys()
      for (const key of keys) {
        if (key.match(new RegExp(section + ':'))) {
          this.finishTracker(section, key)
        }
      }

      // remove parent tracker
      console.log(titles.f, `${section}:${key}__${subsection}`)
      this[_progress].get(section).finish()
      this[_progress].delete(section)
    } else if (!hasTracker && subsection === null) {
      // 1. no existing parent tracker, no subsection
      this[_onError](`Tracker "${section}" does not exist`)
    } else if (!hasTracker || hasSubtracker) {
      // 2. subtracker exists
      // Finish subtracker and remove from this[_progress]
      console.log(titles.fs, `${section}:${key}__${subsection}`)
      this[_progress].get(`${section}:${key}`).finish()
      this[_progress].delete(`${section}:${key}`)
    }
    // 3. existing parent tracker, no subsection
  }

  [_onError] (msg) {
    throw new Error(msg)
  }
}
