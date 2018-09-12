'use strict'

var vendors = require('./vendors.json')

var env = process.env

// Used for testinging only
Object.defineProperty(exports, '_vendors', {
  value: vendors.map(function (v) { return v.constant })
})

exports.name = null
exports.isPR = null

vendors.forEach(function (vendor) {
  var envs = Array.isArray(vendor.env) ? vendor.env : [vendor.env]
  var isCI = envs.every(function (obj) {
    if (typeof obj === 'string') return !!env[obj]
    return Object.keys(obj).every(function (k) {
      return env[k] === obj[k]
    })
  })

  exports[vendor.constant] = isCI

  if (isCI) {
    exports.name = vendor.name

    if (vendor.pr) {
      var val = env[vendor.pr.env]
      if (val) {
        switch (vendor.pr.type) {
          case 'not-false':
            exports.isPR = val !== 'false'
            break
          case 'boolean':
            exports.isPR = val === 'true'
            break
          default:
            exports.isPR = true
        }
      } else {
        exports.isPR = false
      }
    }
  }
})

exports.isCI = !!(
  env.CI || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, dsari
  env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
  env.BUILD_NUMBER || // Jenkins, TeamCity
  env.RUN_ID || // TaskCluster, dsari
  exports.name ||
  false
)
