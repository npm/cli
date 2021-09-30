'use strict'
const {deprecate} = require('util')
const settings = require('../settings.js')
const tap = require('libtap')

// Needs to be set before requiring mocha.js
module.exports = tap

tap.mocha = require('./mocha.js')
tap.mochaGlobals = tap.mocha.global
tap.synonyms = require('./synonyms.js')

/* istanbul ignore next: unsure how to test this function */
tap.Test.prototype.tearDown = deprecate(function (fn) {
  this.teardown(fn)
}, 'tearDown() is deprecated, use teardown() instead')

tap.tearDown = tap.tearDown.bind(tap)

Object.keys(tap.synonyms).forEach(c => {
  tap.synonyms[c].forEach(s => {
    if (c === s) {
      return
    }

    Object.defineProperty(tap.Test.prototype, s, {
      value: deprecate(tap.Test.prototype[c], `${s}() is deprecated, use ${c}() instead`),
      enumerable: false,
      configurable: true,
      writable: true
    })

    // Manually bind methods for the already created instance
    tap[s] = tap[s].bind(tap)
  })
})
