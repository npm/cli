const procLog = require('./proc-log.js')

const _progress = Symbol('_progress')
const _onError = Symbol('_onError')

module.exports = cls => class Tracker extends cls {
  constructor (options = {}) {
    super(options)
    this[_progress] = new Map()
    this.log = options.log || procLog
  }

  addTracker (section, subsection = null, key = null) {
    // TrackerGroup type object not found
    if (!this.log.newGroup)
      return

    if (section === null || section === undefined)
      this[_onError](`Tracker can't be null or undefined`)

    if (key === null)
      key = subsection

    const hasTracker = this[_progress].has(section)
    const hasSubtracker = this[_progress].has(`${section}:${key}`)

    // 0. existing tracker, no subsection
    if (hasTracker && subsection === null) {
      this[_onError](`Tracker "${section}" already exists`)
    }

    // 1. no existing tracker, no subsection
    // Create a new tracker from this.log
     else if (!hasTracker && subsection === null) {
      // starts progress bar
      if(this[_progress].size === 0) {
        this.log.enableProgress()
      }
      this[_progress].set(section, this.log.newGroup(section))
    }

    // 2. no parent tracker and subsection 
    else if (!hasTracker && subsection !== null) {
      this[_onError](`Parent tracker "${section}" does not exist`)
    }

    // 3. existing parent tracker, existing subsection tracker
    // skip it
    else if (hasTracker && hasSubtracker) {
      return
    }

    // 4. existing parent tracker, no subsection tracker
    // Create a new subtracker in this[_progress] from parent tracker
    else {
      this[_progress].set(`${section}:${key}`,
        this[_progress].get(section).newGroup(`${section}:${subsection}`)
      )
    }
  }

  finishTracker (section, subsection = null, key = null) {
    // TrackerGroup type object not found
    if (!this.log.newGroup)
      return

    if (section === null || section === undefined)
      this[_onError](`Tracker can't be null or undefined`)

    if (key === null)
      key = subsection

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
      this[_progress].get(section).finish()
      this[_progress].delete(section)

      // remove progress bar if all
      // trackers are finished
      if(this[_progress].size === 0) {
        this.log.disableProgress()
      }
    }

    // 1. no existing parent tracker, no subsection
    else if (!hasTracker && subsection === null) {
      this[_onError](`Tracker "${section}" does not exist`)
    }

    // 2. existing parent tracker, no subsection
    else if (hasTracker && !hasSubtracker) {
      return
    }

    // 3. subtracker exists
    // Finish subtracker and remove from this[_progress]
    else {
      this[_progress].get(`${section}:${key}`).finish()
      this[_progress].delete(`${section}:${key}`)
    }
  }

  [_onError] (msg) {
    this.log.disableProgress()
    throw new Error(msg)
  }
}
