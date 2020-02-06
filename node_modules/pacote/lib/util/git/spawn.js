const spawn = require('../spawn.js')
const promiseRetry = require('promise-retry')
const shouldRetry = require('./should-retry.js')
const whichGit = require('./which.js')
const makeOpts = require('./opts.js')
const procLog = require('../proc-log.js')

module.exports = (gitArgs, gitOpts, opts = {}) => {
  const gitPath = whichGit(opts)

  if (gitPath instanceof Error)
    return Promise.reject(gitPath)

  const log = opts.log || procLog
  return promiseRetry((retry, number) => {
    if (number !== 1)
      log.silly('pacote', `Retrying git command: ${
        gitArgs.join(' ')} attempt # ${number}`)

    return spawn(gitPath, gitArgs, makeOpts(gitOpts, opts))
      .catch(er => {
        if (shouldRetry(er.stderr, number))
          retry(er)
        else
          throw er
      })
      .then(({stdout}) => stdout)
  }, opts.retry !== null && opts.retry !== undefined ? opts.retry : {
    retries: opts['fetch-retries'] || 2,
    factor: opts['fetch-retry-factor'] || 10,
    maxTimeout: opts['fetch-retry-maxtimeout'] || 60000,
    minTimeout: opts['fetch-retry-mintimeout'] || 1000,
  })
}
