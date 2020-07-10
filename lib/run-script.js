module.exports = runScriptCmd

const run = require('@npmcli/run-script')
const npm = require('./npm.js')
const readJson = require('read-package-json-fast')
const { resolve, join } = require('path')
const output = require('./utils/output.js')
const log = require('npmlog')
const usage = require('./utils/usage')
const didYouMean = require('./utils/did-you-mean')
const isWindowsShell = require('./utils/is-windows-shell.js')

runScriptCmd.usage = usage(
  'run-script',
  'npm run-script <command> [-- <args>...]'
)

runScriptCmd.completion = function (opts, cb) {
  // see if there's already a package specified.
  var argv = opts.conf.argv.remain

  if (argv.length >= 4) return cb()

  if (argv.length === 3) {
    // either specified a script locally, in which case, done,
    // or a package, in which case, complete against its scripts
    var json = join(npm.localPrefix, 'package.json')
    return readJson(json, function (er, d) {
      if (er && er.code !== 'ENOENT' && er.code !== 'ENOTDIR') return cb(er)
      if (er) d = {}
      var scripts = Object.keys(d.scripts || {})
      if (scripts.indexOf(argv[2]) !== -1) return cb()
      // ok, try to find out which package it was, then
      var pref = npm.config.get('global') ? npm.config.get('prefix')
        : npm.localPrefix
      var pkgDir = resolve(pref, 'node_modules', argv[2], 'package.json')
      readJson(pkgDir, function (er, d) {
        if (er && er.code !== 'ENOENT' && er.code !== 'ENOTDIR') return cb(er)
        if (er) d = {}
        var scripts = Object.keys(d.scripts || {})
        return cb(null, scripts)
      })
    })
  }

  readJson(join(npm.localPrefix, 'package.json'), function (er, d) {
    if (er && er.code !== 'ENOENT' && er.code !== 'ENOTDIR') return cb(er)
    d = d || {}
    cb(null, Object.keys(d.scripts || {}))
  })
}

function runScriptCmd (args, cb) {
  const fn = args.length ? runScript : list
  fn(args).then(() => cb()).catch(cb)
}

const runScript = async (args) => {
  const path = npm.localPrefix
  const event = args.shift()
  const { scriptShell } = npm.flatOptions

  const pkg = await readJson(`${path}/package.json`)
  const { _id, scripts = {} } = pkg

  if (event === 'restart' && !scripts.restart) {
    scripts.restart = 'npm stop && npm start'
  } else if (event === 'env') {
    scripts.env = isWindowsShell ? 'SET' : 'env'
  }

  if (!scripts[event]) {
    if (npm.config.get('if-present')) {
      return
    }
    const suggestions = didYouMean(event, Object.keys(scripts))
    throw new Error(`missing script: ${event}${
      suggestions ? `\n${suggestions}` : '' }`)
  }

  // positional args only added to the main event, not pre/post
  const events = [[event, args]]
  if (scripts[`pre${event}`]) {
    events.unshift([`pre${event}`, []])
  }
  if (scripts[`post${event}`]) {
    events.push([`post${event}`, []])
  }

  const opts = {
    path,
    args,
    scriptShell,
    stdio: log.level === 'silent' ? 'pipe' : 'inherit',
    stdioString: true,
    pkg
  }

  for (const [event, args] of events) {
    await run({
      ...opts,
      event,
      args
    })
  }
}

const list = async () => {
  const path = npm.localPrefix
  const { scripts, name } = await readJson(`${path}/package.json`)
  const cmdList = [
    'publish',
    'install',
    'uninstall',
    'test',
    'stop',
    'start',
    'restart',
    'version'
  ].reduce((l, p) => l.concat(['pre' + p, p, 'post' + p]))

  if (!scripts) {
    return []
  }

  const allScripts = scripts ? Object.keys(scripts) : []
  if (log.level === 'silent') {
    return allScripts
  }

  if (npm.flatOptions.json) {
    output(JSON.stringify(scripts, null, 2))
    return allScripts
  }

  if (npm.flatOptions.parseable) {
    for (const [script, cmd] of Object.entries(scripts)) {
      output(`${script}:${cmd}`)
    }
    return allScripts
  }

  const indent = '\n    '
  const prefix = '  '
  const cmds = []
  const runScripts = []
  for (const script of allScripts) {
    const list = cmdList.includes(script) ? cmds : runScripts
    list.push(script)
  }

  if (cmds.length) {
    output(`Lifecycle scripts included in ${name}:`)
  }
  for (const script of cmds) {
    output(prefix + script + indent + scripts[script])
  }
  if (!cmds.length && runScripts.length) {
    output(`Scripts available in ${name} via \`npm run-script\`:`)
  } else if (runScripts.length) {
    output(`\navailable via \`npm run-script\`:`)
  }
  for (const script of runScripts) {
    output(prefix + script + indent + scripts[script])
  }
  return allScripts
}
