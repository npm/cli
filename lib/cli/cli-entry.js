/* eslint-disable max-len */

// Separated out for easier unit testing
module.exports = async (process, validateEngines) => {
  // set it here so that regardless of what happens later, we don't
  // leak any private CLI configs to other programs
  process.title = 'npm'

  // if npm is called as "npmg" or "npm_g", then run in global mode.
  if (process.argv[1].endsWith('g')) {
    process.argv.splice(1, 1, 'npm', '-g')
  }

  // Patch the global fs module here at the root level
  require('graceful-fs').gracefulify(require('fs'))

  const satisfies = require('semver/functions/satisfies')
  const ExitHandler = require('./exit-handler.js')
  const exitHandler = new ExitHandler({ process })
  const Npm = require('../npm.js')
  const npm = new Npm()
  exitHandler.npm = npm

  // only log node and npm paths in argv initially since argv can contain sensitive info. a cleaned version will be logged later
  const { log } = require('proc-log')
  log.verbose('cli', process.argv.slice(0, 2).join(' '))
  log.info('using', 'npm@%s', npm.version)
  log.info('using', 'node@%s', process.version)

  // At this point we've required a few files and can be pretty sure we dont contain invalid syntax for this version of node. It's possible a lazy require would, but that's unlikely enough that it's not worth catching anymore and we attach the more important exit handlers.
  validateEngines.off()
  exitHandler.registerUncaughtHandlers()

  // It is now safe to log a warning if they are using a version of node that is not going to fail on syntax errors but is still unsupported and untested and might not work reliably. This is safe to use the logger now which we want since this will show up in the error log too.
  if (!satisfies(validateEngines.node, validateEngines.engines)) {
    log.warn('cli', validateEngines.unsupportedMessage)
  }

  try {
    await npm.load()
    await npm.exec()
    return exitHandler.exit()
  } catch (err) {
    return exitHandler.exit(err)
  }
}
