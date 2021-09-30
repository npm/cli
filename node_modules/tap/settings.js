'use strict'

const sourceMapSupport = require('source-map-support')
const settings = require('libtap/settings')

sourceMapSupport.install({environment:'node', hookRequire: true})

if (+process.env.TAP_DEV_LONGSTACK !== 1) {
  settings.stackUtils.ignoredPackages.push(
    'libtap',
    'tap',
    'nyc',
    'import-jsx',
    'function-loop'
  )
  settings.stackUtils.internals.push(
    /at Generator\.next \(<anonymous>\)/iu
  )
} else {
  settings.atTap = true
}

settings.stackUtils.wrapCallSite = sourceMapSupport.wrapCallSite

/* istanbul ignore next - version specific */
if (settings.rimrafNeeded) {
  const rimraf = require('rimraf')
  settings.rmdirRecursive = (path, cb) => rimraf(path, { glob: false }, cb)
  settings.rmdirRecursiveSync = path => rimraf.sync(path, { glob: false })
}

/* istanbul ignore next - version specific */
if (settings.mkdirpNeeded) {
  const mkdirp = require('mkdirp')
  settings.mkdirRecursive = (path, cb) => mkdirp(path).then(() => cb).catch(cb)
  settings.mkdirRecursiveSync = path => mkdirp.sync(path)
}

if (process.env.TAP_LIBTAP_SETTINGS) {
  const overrides = require(process.env.TAP_LIBTAP_SETTINGS)
  const type = typeof overrides
  const isArray = Array.isArray(overrides)
  if (!overrides || isArray || type !== 'object') {
    throw new Error('invalid libtap settings: ' + (
      isArray ? 'array'
      : type === 'object' ? 'null'
      : type
    ))
  }

  for (const [key, value] of Object.entries(overrides)) {
    if (!Object.prototype.hasOwnProperty.call(settings, key))
      throw new Error('Unrecognized libtap setting: ' + key)
    if (typeof value !== typeof settings[key]) {
      throw new Error(`Invalid type for libtap setting ${key}. Expected ${
        typeof settings[key]}, received ${typeof value}.`)
    }
    settings[key] = value
  }
}

module.exports = settings
