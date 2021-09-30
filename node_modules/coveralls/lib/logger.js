'use strict';

const logDriver = require('log-driver');
const index = require('..');

module.exports = () => logDriver({ level: getLogLevel() });

function getLogLevel() {
  if (index.options.verbose || process.env.NODE_COVERALLS_DEBUG === 1 || process.env.NODE_COVERALLS_DEBUG === '1') {
    return 'debug';
  }

  return 'error';
}
