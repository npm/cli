'use strict';

const process = require('./process.js')

// Node.js should provide an API for this
function mainScript(defaultName) {
  if (typeof repl !== 'undefined' || '_eval' in process) {
    return defaultName
  }

  return process.argv[1] || defaultName
}

module.exports = mainScript;
