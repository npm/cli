const ciInfo = require('ci-info')
const runScript = require('@npmcli/run-script')
const pkgJson = require('@npmcli/package-json')
const { log, output } = require('proc-log')
const noTTY = require('./no-tty.js')
const isWindowsShell = require('./is-windows.js')

const run = async ({
  args,
  call,
  flatOptions,
  locationMsg,
  path,
  binPaths,
  runPath,
  scriptShell,
}) => {
  // escape executable path
  // necessary for preventing bash/cmd keywords from overriding
  if (!isWindowsShell) {
    if (args.length > 0) {
      // single-quote so shell metacharacters in the executable name are taken
      // literally; double quotes still expand $(), backticks, $var and "
      args[0] = `'${args[0].replace(/'/g, `'\\''`)}'`
    }
  } else {
    if (args.length > 0) {
      // On Windows, cmd.exe interprets metacharacters (&, |, <, >, ^, (, ), @, !)
      // and uses spaces/tabs as token delimiters. Unlike on POSIX where single-quoting
      // the entire name makes it an opaque filename, on Windows there is no escaping
      // strategy that reliably prevents cmd.exe from splitting on spaces and executing
      // the first token as a command. Therefore, reject any bin name containing
      // characters that cannot be safely neutralized:
      // - spaces/tabs: always split into multiple tokens regardless of ^ or quoting
      // - % : cmd.exe expands environment variables (%VAR%) before ^ processing
      // - newlines/carriage returns: act as command separators
      if (/[%\r\n\t ]/.test(args[0])) {
        throw new Error(
          `Cannot execute bin name containing unsafe characters on Windows: ${args[0]}`
        )
      }
      args[0] = args[0].replace(/([&|<>^()@!"])/g, '^$1')
    }
  }

  // turn list of args into command string
  const script = call || args.shift() || scriptShell

  // do the fakey runScript dance
  // still should work if no package.json in cwd
  const { content: realPkg } = await pkgJson.normalize(path, { steps: [
    'binDir',
    ...pkgJson.normalizeSteps,
  ] }).catch(() => ({ content: {} }))
  const pkg = {
    ...realPkg,
    scripts: {
      ...(realPkg.scripts || {}),
      npx: script,
    },
  }

  if (script === scriptShell) {
    if (!noTTY()) {
      if (ciInfo.isCI) {
        return log.warn('exec', 'Interactive mode disabled in CI environment')
      }

      const { chalk } = flatOptions

      output.standard(`${
        chalk.reset('\nEntering npm script environment')
      }${
        chalk.reset(locationMsg || ` at location:\n${chalk.dim(runPath)}`)
      }${
        chalk.bold('\nType \'exit\' or ^D when finished\n')
      }`)
    }
  }
  return runScript({
    ...flatOptions,
    pkg,
    // we always run in cwd, not --prefix
    path: runPath,
    binPaths,
    event: 'npx',
    args,
    stdio: 'inherit',
    scriptShell,
  })
}

module.exports = run
