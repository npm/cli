const makeSpawnArgs = require('./make-spawn-args.js')
const promiseSpawn = require('@npmcli/promise-spawn')

const banner = (id, event, cmd) =>`> ${id ? id + ' ' : ''}${event}\n> ${cmd}`

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

  if (stdio === 'inherit') {
    // we're dumping to the parent's stdout, so print the banner
    console.log(banner(pkg._id, event, cmd))
  }

  const p = promiseSpawn(...makeSpawnArgs({
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
  if (p.stdin)
    p.stdin.end()
  return p
}

module.exports = runScriptPkg
