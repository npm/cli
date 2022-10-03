'use strict'

const spawk = require('spawk')

module.exports = tspawk

function tspawk (t) {
  t.teardown(function () {
    spawk.unload()
  })
  t.afterEach(function () {
    spawk.done()
  })
  return spawk
}
