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

  const satisfies = require('semver/functions/satisfies')
  const ExitHandler = require('./utils/exit-handler.js')
  const exitHandler = new ExitHandler({ process })
  const Npm = require('./npm.js')
  const npm = new Npm()
  exitHandler.npm = npm

  // only log node and npm paths in argv initially since argv can contain sensitive info. a cleaned version will be logged later
  const { log, output } = require('proc-log')
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

  // Now actually fire up npm and run the command.
  // This is how to use npm programmatically:
  try {
    await npm.load()

    // npm -v
    if (npm.config.get('version', 'cli')) {
      output.standard(npm.version)
      return exitHandler.exit()
    }

    // npm --versions
    if (npm.config.get('versions', 'cli')) {
      npm.argv = ['version']
      npm.config.set('usage', false, 'cli')
    }

    const cmd = npm.argv.shift()
    if (!cmd) {
      output.standard(npm.usage)
      process.exitCode = 1
      return exitHandler.exit()
    }

    await npm.exec(cmd)
    return exitHandler.exit()
  } catch (err) {
    if (err.code === 'EUNKNOWNCOMMAND') {
      const didYouMean = require('./utils/did-you-mean.js')
      const suggestions = await didYouMean(npm.localPrefix, err.command)
      output.standard(`Unknown command: "${err.command}"${suggestions}\n`)
      output.standard('To see a list of supported npm commands, run:\n  npm help')
      process.exitCode = 1
      return exitHandler.exit()
    }
    return exitHandler.exit(err)
  }
}
