'use strict'
const npm = require('../npm.js')
const output = require('./output.js')
const opener = require('opener')

const {URL} = require('url')

const isUrlValid = url => {
  try {
    return /^https?:$/.test(new URL(url).protocol)
  } catch (_) {
    return false
  }
}

// attempt to open URL in web-browser, print address otherwise:
module.exports = function open (url, errMsg, cb, browser = npm.config.get('browser')) {
  function printAlternateMsg () {
    const json = npm.config.get('json')
    const alternateMsg = json
      ? JSON.stringify({
        title: errMsg,
        url
      }, null, 2)
      : `${errMsg}:\n\n${url}`

    output(alternateMsg)
  }

  const skipBrowser = process.argv.indexOf('--no-browser') > -1

  if (skipBrowser) {
    printAlternateMsg()
    return cb()
  }

  if (!isUrlValid(url)) {
    return cb(new Error('Invalid URL: ' + url))
  }

  opener(url, { command: browser }, (er) => {
    if (er && er.code === 'ENOENT') {
      printAlternateMsg()
      return cb()
    } else {
      return cb(er)
    }
  })
}
