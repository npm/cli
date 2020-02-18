const makeSpawnArgs = require('./make-spawn-args.js')
const promiseSpawn = require('./promise-spawn.js')

const runScriptPkg = options => {
  const {
    event,
    path,
    scriptShell,
    env = {},
    stdio = 'pipe',
    pkg,
    args = [],
    stdioString = false,
  } = options

  const cmd = options.cmd ? options.cmd
    : pkg.scripts && pkg.scripts[event]
      ? pkg.scripts[event] +
        args.map(a => ` ${JSON.stringify(a)}`).join('')
    : null

  if (!cmd)
    return Promise.resolve({ code: 0, signal: null })

  return promiseSpawn(...makeSpawnArgs({
    event,
    path,
    scriptShell,
    env,
    stdio,
    cmd,
    stdioString,
  }), {
    event,
    script: cmd,
    pkgid: pkg._id,
    path,
  })
}

module.exports = runScriptPkg
