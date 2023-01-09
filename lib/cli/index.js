// Separated out for easier unit testing
module.exports = async (process, validateEngines) => {
  // set it here so that regardless of what happens later, we don't
  // leak any private CLI configs to other programs
  process.title = 'npm'

  // if npm is called as "npmg" or "npm_g", then run in global mode.
  if (process.argv[1].endsWith('g')) {
    process.argv.splice(1, 1, 'npm', '-g')
  }

  const { dirname } = require('path')
  const satisfies = require('semver/functions/satisfies')
  const exitHandler = require('../utils/exit-handler.js')
  const log = require('../utils/log-shim.js')
  const Npm = require('../npm.js')

  // At this point we've required a few files and can be pretty sure
  // we dont contain invalid syntax for this version of node. It's
  // possible a lazy require would, but that's unlikely enough that
  // it's not worth catching anymore and we attach the more important
  // exit handlers.
  validateEngines.off()
  process.on('uncaughtException', exitHandler)
  process.on('unhandledRejection', exitHandler)

  const npm = exitHandler.setNpm(new Npm({
    npmRoot: dirname(__dirname),
    argv: process.argv,
    // This is to prevent the config module from walking past this
    // directory when looking for a parent package.json. This is currently
    // only used in tests but if this feature would be added in the future
    // it would need to be implemented something like this since the
    // directory would need to be available before configs are parsed
    cwdRoot: null,
  }))

  // only log node and npm paths in argv initially since argv can contain
  // sensitive info. a cleaned version will be logged later
  log.verbose('cli', process.argv.slice(0, 2).join(' '))
  log.info('using', 'npm@%s', npm.version)
  log.info('using', 'node@%s', process.version)

  // It is now safe to log a warning if they are using a version of node
  // that is not going to fail on syntax errors but is still unsupported
  // and untested and might not work reliably. This is safe to use the logger
  // now which we want since this will show up in the error log too.
  if (!satisfies(validateEngines.node, validateEngines.engines)) {
    log.warn('cli', validateEngines.unsupportedMessage)
  }

  let exitErr
  try {
    // now actually fire up npm and run the command
    // calling exec will read from the previously parsed proceess.argv
    await npm.load()
    await npm.exec()
  } catch (err) {
    if (err.code === 'EUNKNOWNCOMMAND') {
      const didYouMean = require('../utils/did-you-mean.js')
      const suggestions = await didYouMean(npm.localPrefix, npm.command)
      npm.output(`Unknown command: "${npm.command}"${suggestions}\n`)
      npm.output('To see a list of supported npm commands, run:\n  npm help')
      process.exitCode = 1
    } else {
      exitErr = err
    }
  }

  return exitHandler(exitErr)
}
