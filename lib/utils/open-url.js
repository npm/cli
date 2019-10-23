'use strict'
const npm = require('../npm.js')
const output = require('./output.js')
const opener = require('opener')

// attempt to open URL in web-browser, print address otherwise:
module.exports = function open (url, errMsg, cb, browser = npm.config.get('browser')) {
  opener(url, { command: npm.config.get('browser') }, (er) => {
    if (er && er.code === 'ENOENT') {
      const alternateMsg = npm.config.get('json')
        ? JSON.stringify({
          title: errMsg,
          url
        }, null, 2)
        : `${errMsg}:\n\n${url}`

      output(alternateMsg)
      return cb()
    } else {
      return cb(er)
    }
  })
}
