'use strict'

const spawk = require('spawk')

module.exports = tspawk

function tspawk (t) {
  t.teardown(function () {
    spawk.done()
    spawk.unload()
  })
  return spawk
}
