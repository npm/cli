'use strict';

const minimist = require('minimist');

// this needs to go before the other require()s so that
// the other files can already use index.options
module.exports.options = minimist(process.argv.slice(2), {
  boolean: [
    'verbose',
    'stdout'
  ],
  alias: {
    'v': 'verbose',
    's': 'stdout'
  }
});

module.exports.convertLcovToCoveralls = require('./lib/convertLcovToCoveralls');
module.exports.sendToCoveralls = require('./lib/sendToCoveralls');
module.exports.getBaseOptions = require('./lib/getOptions').getBaseOptions;
module.exports.getOptions = require('./lib/getOptions').getOptions;
module.exports.handleInput = require('./lib/handleInput');
module.exports.logger = require('./lib/logger');
