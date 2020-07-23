const log = require('npmlog')
const npm = require('./npm.js')
const { defs: { types }, defaults } = require('./config/core.js')
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const writeFileAtomic = require('write-file-atomic')
const ini = require('ini')
const editor = require('editor')
const { EOL } = require('os')
const { dirname } = require('path')
const mkdirp = require('mkdirp-infer-owner')
const umask = require('./utils/umask.js')
const usageUtil = require('./utils/usage.js')
const output = require('./utils/output.js')

const usage = usageUtil(
  'config',
  'npm config set <key> <value>' +
  '\nnpm config get [<key>]' +
  '\nnpm config delete <key>' +
  '\nnpm config list [--json]' +
  '\nnpm config edit' +
  '\nnpm set <key> <value>' +
  '\nnpm get [<key>]'
)

const completion = (opts, cb) => {
  const argv = opts.conf.argv.remain
  // same completion method used for `npm get` and `npm set`
  if (argv[1] !== 'config') {
    argv.unshift('config')
  }

  if (argv.length === 2) {
    const cmds = ['get', 'set', 'delete', 'ls', 'rm', 'edit']
    if (opts.partialWord !== 'l') {
      cmds.push('list')
    }
    return cb(null, cmds)
  }

  const action = argv[2]
  switch (action) {
    case 'set':
      // todo: complete with valid values, if possible.
      if (argv.length > 3) {
        return cb(null, [])
      }
      // fallthrough
      /* eslint no-fallthrough:0 */
    case 'get':
    case 'delete':
    case 'rm':
      return cb(null, Object.keys(types))
    case 'edit':
    case 'list':
    case 'ls':
    default:
      return cb(null, [])
  }
}

// npm config set key value
// npm config get key
// npm config list
const cmd = (args, cb) => config(args).then(() => cb()).catch(cb)

const config = args => {
  const action = args.shift()
  switch (action) {
    case 'set':
      return set(args[0], args[1])
    case 'get':
      return get(args[0])
    case 'delete':
    case 'rm':
    case 'del':
      return del(args[0])
    case 'list':
    case 'ls':
      return npm.flatOptions.json ? listJson() : list()
    case 'edit':
      return edit()
    default:
      return unknown(action)
  }
}

const edit = async () => {
  const e = npm.flatOptions.editor
  if (!e) {
    throw new Error('No EDITOR config or environ set.')
  }

  const which = npm.flatOptions.global ? 'global' : 'user'
  const f = npm.config.get(`${which}config`)

  await npm.config.save(which)
  const raw = await readFile(f, 'utf8').catch(er => '')
  const data = `;;;;
; npm ${npm.flatOptions.global ? 'globalconfig' : 'userconfig'} file
; this is a simple ini-formatted file
; lines that start with semi-colons are comments
; run \`npm help 7 config\` for help on the various options
;;;;

${raw}

;;;;
; all options shown below with default values
;;;;

${stringifyDefaults()}
`
  const writeData = EOL === '\n' ? data : data.split('\n').join(EOL)
  await mkdirp(dirname(f))
  npm.log.disableProgress()
  await new Promise((res, rej) => writeFileAtomic(
    f,
    data,
    // if we have an error, reject right away
    // otherwise run the editor, and resolve when done
    er => er ? rej(er) : () => editor(f, { editor: e }, (er) => {
      if (er) {
        return rej(er)
      }
      npm.log.enableProgress()
      res()
    })))
}

const stringifyDefaults = () => {
  const arr = []
  for (const [key, value] of Object.entries(defaults)) {
    const obj = { [key]: value }
    const lines = ini.stringify(obj)
      .replace(/\n$/m, '')
      .replace(/^/g, '; ')
      .replace(/\n/g, '\n; ')
      .split('\n')
    arr.push(...lines)
  }
  return arr.join('\n')
}

const del = async key => {
  if (!key) {
    throw new Error('no key provided')
  }
  const where = npm.flatOptions.global ? 'global' : 'user'
  npm.config.del(key, where)
  await npm.config.save(where)
}

const set = async (key, val) => {
  if (key === undefined) {
    return unknown('')
  }
  if (val === undefined) {
    if (key.indexOf('=') !== -1) {
      const split = key.split('=')
      key = split.shift()
      val = split.join('=')
    } else {
      val = ''
    }
  }
  key = key.trim()
  val = val.trim()
  log.info('config', 'set %j %j', key, val)
  const where = npm.flatOptions.global ? 'global' : 'user'
  if (key.match(/umask/)) {
    val = umask.fromString(val)
  }
  npm.config.set(key, val, where)
  return npm.config.save(where)
}

const get = async (key) => {
  if (!key) {
    return list()
  }

  if (!publicVar(key)) {
    throw new Error(`The ${key} config value may not be retrieved in this way`)
  }

  const val = npm.config.get(key)
  output(/umask/.test(key) ? umask.toString(val) : val)
}

const sort = (a, b) => a > b ? 1 : -1

const publicVar = k => !(k.charAt(0) === '_' || k.indexOf(':_') !== -1)

const getKeys = (data) => Object.keys(data).filter(publicVar).sort(sort)

const listJson = () => {
  const publicConf = {}
  for (const key of npm.config.keys) {
    if (!publicVar(key) || key === 'argv') {
      continue
    }
    publicConf[key] = npm.config.get(key)
  }
  output(JSON.stringify(publicConf, null, 2))
}

const listFromSource = (title, conf, long) => {
  const keys = getKeys(conf)
  const msg = []

  if (keys.length) {
    msg.push(`; ${title}`)
    for (const key of keys) {
      const val = JSON.stringify(conf[key])
      if (conf[key] !== npm.config.get(key)) {
        if (!long) {
          continue
        }
        msg.push(`; ${key} = ${val} (overridden)`)
      } else {
        msg.push(`${key} = ${val}`)
      }
    }
    msg.push('')
  }

  return msg
}

const list = () => {
  const msg = []
  const { long } = npm.flatOptions

  const cli = npm.config.sources.cli.data
  const cliKeys = getKeys(cli)
  if (cliKeys.length) {
    msg.push('; cli configs')
    for (const key of cliKeys) {
      if (cli[key] && typeof cli[key] === 'object' || key === 'argv') {
        continue
      }
      msg.push(`${key} = ${JSON.stringify(cli[key])}`)
    }
    msg.push('')
  }

  const { env, project, user, global, builtin = {} } = npm.config.sources
  const sources = [
    { title: 'environment configs', conf: env.data },
    { title: `project config ${project.path}`, conf: project.data },
    { title: `userconfig ${npm.config.get('userconfig')}`, conf: user.data },
    { title: `globalconfig ${npm.config.get('globalconfig')}`, conf: global.data }
  ]
  if (builtin.data) {
    sources.push({ title: `builtin config ${builtin.path}`, conf: builtin.data })
  }
  for (const source of sources) {
    msg.push(...listFromSource(source.title, source.conf, long))
  }

  // only show defaults if --long
  if (!long) {
    msg.push(
      '; node bin location = ' + process.execPath,
      '; cwd = ' + process.cwd(),
      '; HOME = ' + process.env.HOME,
      '; "npm config ls -l" to show all defaults.'
    )
    output(msg.join('\n'))
    return
  }

  const defKeys = getKeys(defaults)
  msg.push('; default values')
  for (const key of defKeys) {
    const def = defaults[key]
    const val = JSON.stringify(def)
    if (def !== npm.config.get(key)) {
      msg.push(`; ${key} = ${val} (overridden)`)
    } else {
      msg.push(`${key} = ${val}`)
    }
  }
  msg.push('')

  output(msg.join('\n'))
}

const unknown = action => {
  throw usage
}

module.exports = Object.assign(cmd, { completion, usage })
