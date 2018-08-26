'use strict'
/* eslint-disable camelcase */
const child_process = require('child_process')

module.exports = launchCheck

if (require.main === module) main()

function launchCheck () {
  try {
    return runInBackground(__filename, [])
  } catch (ex) {
    // ignore failures
  }
}

function runInBackground (js, args, opts) {
  if (!args) args = []
  args.unshift(js)
  if (!opts) opts = {}
  opts.detached = true
  var child = child_process.spawn(process.execPath, args, opts)
  child.unref()
  return child
}

function main () {
  var check = require('./version-checker').doCheck
  check()
}
