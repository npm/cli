const makeSpawnArgs = require('./make-spawn-args.js')
const promiseSpawn = require('@npmcli/promise-spawn')
const packageEnvs = require('./package-envs.js')

// you wouldn't like me when I'm angry...
const bruce = (id, event, cmd) =>`\n> ${id ? id + ' ' : ''}${event}\n> ${cmd}\n`

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
    // note: only used when stdio:inherit
    banner = true,
  } = options

  const cmd = options.cmd ? options.cmd
    : pkg.scripts && pkg.scripts[event]
      ? pkg.scripts[event] +
        args.map(a => ` ${JSON.stringify(a)}`).join('')
    : null

  if (!cmd)
    return Promise.resolve({ code: 0, signal: null })

  if (stdio === 'inherit' && banner !== false) {
    // we're dumping to the parent's stdout, so print the banner
    console.log(bruce(pkg._id, event, cmd))
  }

  const p = promiseSpawn(...makeSpawnArgs({
    event,
    path,
    scriptShell,
    env: packageEnvs(env, pkg),
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
