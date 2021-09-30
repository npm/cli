'use strict';

const logger = require('./logger')();
const index = require('..');

function handleInput(input, cb, userOptions) {
  logger.debug(input);
  logger.debug(`user options ${userOptions}`);
  index.getOptions((err, options) => {
    if (err) {
      logger.error('error from getOptions');
      cb(err);
      return;
    }

    logger.debug(options);

    index.convertLcovToCoveralls(input, options, (err, postData) => {
      if (err) {
        logger.error('error from convertLcovToCoveralls');
        cb(err);
        return;
      }

      logger.info('sending this to coveralls.io: ', JSON.stringify(postData));
      index.sendToCoveralls(postData, (err, response, body) => {
        if (err) {
          cb(err);
          return;
        }

        if (response.statusCode >= 400) {
          cb(`Bad response: ${response.statusCode} ${body}`);
          return;
        }

        logger.debug(response.statusCode);
        logger.debug(body);
        cb(null, body);
      });
    });
  }, userOptions);
}

module.exports = handleInput;
