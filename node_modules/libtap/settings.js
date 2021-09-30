'use strict'

const process = require('./lib/process.js')

const fs = require('fs')
const path = require('path')
const StackUtils = require('stack-utils')

// Just unconditionally use fs.rmdirSync after LTS/12 is required
let rmdirRecursiveSync
let rmdirRecursive
let hasFsRm = false
let mkdirRecursive
let mkdirRecursiveSync

module.exports = {
  atTap: false,

  get mkdirpNeeded() {
    const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(Number)
    /* istanbul ignore next: version specific */
    return !mkdirRecursiveSync && (nodeMajor < 10 || (nodeMajor === 10 && nodeMinor < 12))
  },

  get mkdirRecursive() {
    /* istanbul ignore next: version specific */
    if (!mkdirRecursive) {
      return () => {
        throw new Error("require('libtap/settings').mkdirRecursive must be initialized for Node.js <10.12.0")
      }
    }

    return mkdirRecursive
  },

  set mkdirRecursive(value) {
    if (typeof value !== 'function' || value.length !== 2) {
      throw new TypeError('mkdirRecursive must be a function with exactly two arguments')
    }

    mkdirRecursive = value
  },

  get mkdirRecursiveSync() {
    /* istanbul ignore next: version specific */
    if (!mkdirRecursiveSync) {
      return () => {
        throw new Error("require('libtap/settings').mkdirRecursiveSync must be initialized for Node.js <10.12.0")
      }
    }

    return mkdirRecursiveSync
  },

  set mkdirRecursiveSync(value) {
    if (typeof value !== 'function' || value.length !== 1) {
      throw new TypeError('mkdirRecursiveSync must be a function with exactly one argument')
    }

    mkdirRecursiveSync = value
  },

  get rimrafNeeded() {
    const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(Number)
    /* istanbul ignore next: version specific */
    hasFsRm = (nodeMajor === 14 && nodeMinor >= 14) || nodeMajor >= 15
    /* istanbul ignore next: version specific */
    return !rmdirRecursiveSync && (nodeMajor < 12 || (nodeMajor === 12 && nodeMinor < 10))
  },

  get rmdirRecursive() {
    /* istanbul ignore next: version specific */
    if (!rmdirRecursive) {
      return () => {
        throw new Error("require('libtap/settings').rmdirRecursive must be initialized for Node.js <12.10.0")
      }
    }

    return rmdirRecursive
  },

  set rmdirRecursive(value) {
    if (typeof value !== 'function' || value.length !== 2) {
      throw new TypeError('rmdirRecursive must be a function with exactly two arguments')
    }

    rmdirRecursive = value
  },

  get rmdirRecursiveSync() {
    /* istanbul ignore next: version specific */
    if (!rmdirRecursiveSync) {
      return () => {
        throw new Error("require('libtap/settings').rmdirRecursiveSync must be initialized for Node.js <12.10.0")
      }
    }

    return rmdirRecursiveSync
  },

  set rmdirRecursiveSync(value) {
    if (typeof value !== 'function' || value.length !== 1) {
      throw new TypeError('rmdirRecursiveSync must be a function with exactly one argument')
    }

    rmdirRecursiveSync = value
  },

  StackUtils,
  stackUtils: {
    // Support `settings.stackUtils.internals.push()`
    internals: StackUtils.nodeInternals(),
    ignoredPackages: []
  },
  output: process.stdout,
  snapshotFile: (cwd, main, argv) => {
    return path.resolve(cwd, 'tap-snapshots', main + argv + '.test.cjs')
  }
}

/* istanbul ignore next: version specific */
if (!module.exports.rimrafNeeded) {
  const fs = require('fs')
  const rm = hasFsRm ? 'rm' : 'rmdir'
  const rmSync = `${rm}Sync`
  rmdirRecursiveSync = dir => fs[rmSync](dir, {recursive: true, force: true})
  rmdirRecursive = (dir, cb) => fs[rm](dir, {recursive: true, force: true}, cb)
}

/* istanbul ignore next: version specific */
if (!module.exports.mkdirpNeeded) {
  const { mkdir, mkdirSync } = require('fs')
  mkdirRecursiveSync = dir => mkdirSync(dir, { recursive: true })
  mkdirRecursive = (dir, cb) => mkdir(dir, { recursive: true }, cb)
}
