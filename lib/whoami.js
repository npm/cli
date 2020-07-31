'use strict'

const npm = require('./npm.js')
const output = require('./utils/output.js')
const getIdentity = require('./utils/get-identity')

module.exports = whoami

whoami.usage = 'npm whoami [--registry <registry>]\n(just prints username according to given registry)'

function whoami ([spec], silent, cb) {
  // FIXME: need tighter checking on this, but is a breaking change
  if (typeof cb !== 'function') {
    cb = silent
    silent = false
  }
  const opts = npm.flatOptions
  getIdentity(opts, spec).then(username => {
    if (silent) {} else if (opts.json) {
      output(JSON.stringify(username))
    } else {
      output(username)
    }
  }).then(() => cb(), cb)
}
