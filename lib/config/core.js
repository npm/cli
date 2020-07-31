const CC = require('config-chain').ConfigChain
const inherits = require('inherits')
const configDefs = require('./defaults.js')
const types = configDefs.types
const fs = require('fs')
const path = require('path')
const nopt = require('nopt')
const ini = require('ini')
const Umask = configDefs.Umask
const mkdirp = require('mkdirp-infer-owner')
const umask = require('../utils/umask')
const isWindows = require('../utils/is-windows.js')

const myUid = process.getuid && process.getuid()
const myGid = process.getgid && process.getgid()

const { promisify } = require('util')
const load = async (cli, builtin) => {
  // clone the cli object that's passed in, so we don't mutate it
  cli = { ...cli }

  // check for a builtin if provided.
  exports.usingBuiltin = !!builtin
  const rc = exports.rootConf = new Conf()
  if (builtin) {
    rc.addFile(builtin, 'builtin')
  } else {
    rc.add({}, 'builtin')
  }

  return load_(builtin, rc, cli)
}

// XXX promisify this the rest of the way, and all the Conf class methods
const load_ = promisify(function load_ (builtin, rc, cli, cb) {
  const defaults = configDefs.defaults
  const conf = new Conf(rc)

  conf.usingBuiltin = !!builtin
  conf.add(cli, 'cli')
  conf.addEnv()

  conf.loadPrefix(er => {
    if (er) return cb(er)

    // If you're doing `npm --userconfig=~/foo.npmrc` then you'd expect
    // that ~/.npmrc won't override the stuff in ~/foo.npmrc (or, indeed
    // be used at all).
    //
    // However, if the cwd is ~, then ~/.npmrc is the home for the project
    // config, and will override the userconfig.
    //
    // If you're not setting the userconfig explicitly, then it will be loaded
    // twice, which is harmless but excessive.  If you *are* setting the
    // userconfig explicitly then it will override your explicit intent, and
    // that IS harmful and unexpected.
    //
    // Solution: Do not load project config file that is the same as either
    // the default or resolved userconfig value.  npm will log a "verbose"
    // message about this when it happens, but it is a rare enough edge case
    // that we don't have to be super concerned about it.
    const projectConf = path.resolve(conf.localPrefix, '.npmrc')
    const defaultUserConfig = rc.get('userconfig')
    const resolvedUserConfig = conf.get('userconfig')
    if (!conf.get('global') &&
        projectConf !== defaultUserConfig &&
        projectConf !== resolvedUserConfig) {
      conf.addFile(projectConf, 'project')
      conf.once('load', afterPrefix)
    } else {
      conf.add({}, 'project')
      afterPrefix()
    }
  })

  function afterPrefix () {
    conf.addFile(conf.get('userconfig'), 'user')
    conf.once('error', cb)
    conf.once('load', afterUser)
  }

  function afterUser () {
    // globalconfig and globalignorefile defaults
    // need to respond to the 'prefix' setting up to this point.
    // Eg, `npm config get globalconfig --prefix ~/local` should
    // return `~/local/etc/npmrc`
    // annoying humans and their expectations!
    if (conf.get('prefix')) {
      const etc = path.resolve(conf.get('prefix'), 'etc')
      defaults.globalconfig = path.resolve(etc, 'npmrc')
      defaults.globalignorefile = path.resolve(etc, 'npmignore')
    }

    conf.addFile(conf.get('globalconfig'), 'global')

    // move the builtin into the conf stack now.
    conf.root = defaults
    conf.add(rc.shift(), 'builtin')
    conf.once('load', function () {
      conf.loadExtras(afterExtras)
    })
  }

  function afterExtras (er) {
    if (er) return cb(er)

    // warn about invalid bits.
    validate(conf)

    const cafile = conf.get('cafile')

    if (cafile) {
      return conf.loadCAFile(cafile, finalize)
    }

    finalize()
  }

  function finalize (er) {
    if (er) {
      return cb(er)
    }

    exports.loaded = conf
    cb(er, conf)
  }
})

// Basically the same as CC, but:
// 1. Always ini
// 2. Parses environment variable names in field values
// 3. Field values that start with ~/ are replaced with process.env.HOME
// 4. Can inherit from another Conf object, using it as the base.
inherits(Conf, CC)
function Conf (base) {
  if (!(this instanceof Conf)) return new Conf(base)

  CC.call(this)

  if (base) {
    if (base instanceof Conf) {
      this.root = base.list[0] || base.root
    } else {
      this.root = base
    }
  } else {
    this.root = configDefs.defaults
  }
}

Conf.prototype.loadPrefix = require('./load-prefix.js')
Conf.prototype.loadCAFile = require('./load-cafile.js')
Conf.prototype.setUser = require('./set-user.js')
Conf.prototype.getCredentialsByURI = require('./get-credentials-by-uri.js')
Conf.prototype.setCredentialsByURI = require('./set-credentials-by-uri.js')
Conf.prototype.clearCredentialsByURI = require('./clear-credentials-by-uri.js')

Conf.prototype.loadExtras = function (cb) {
  this.setUser(function (er) {
    if (er) return cb(er)
    // Without prefix, nothing will ever work
    mkdirp(this.prefix).then(() => cb()).catch(cb)
  }.bind(this))
}

Conf.prototype.save = function (where, cb) {
  const target = this.sources[where]
  if (!target || !(target.path || target.source) || !target.data) {
    let er
    if (where !== 'builtin') er = new Error('bad save target: ' + where)
    if (cb) {
      process.nextTick(() => cb(er))
      return this
    }
    return this.emit('error', er)
  }

  if (target.source) {
    const pref = target.prefix || ''
    Object.keys(target.data).forEach(function (k) {
      target.source[pref + k] = target.data[k]
    })
    if (cb) process.nextTick(cb)
    return this
  }

  const data = ini.stringify(target.data)

  const then = er => {
    if (er) return done(er)
    fs.chmod(target.path, mode, done)
  }

  const done = er => {
    if (er) {
      if (cb) return cb(er)
      else return this.emit('error', er)
    }
    this._saving--
    if (this._saving === 0) {
      if (cb) cb()
      this.emit('save')
    }
  }

  this._saving++

  const mode = where === 'user' ? 0o600 : 0o666
  if (!data.trim()) {
    // ignore the possible error (e.g. the file doesn't exist)
    fs.unlink(target.path, () => done())
  } else {
    const dir = path.dirname(target.path)
    mkdirp(dir).catch(then).then(() => {
      fs.stat(dir, (er, st) => {
        if (er) return then(er)
        fs.writeFile(target.path, data, 'utf8', function (er) {
          if (er) return then(er)
          if (myUid === 0 && (myUid !== st.uid || myGid !== st.gid)) {
            fs.chown(target.path, st.uid, st.gid, then)
          } else {
            then()
          }
        })
      })
    })
  }

  return this
}

Conf.prototype.addFile = function (file, name) {
  name = name || file
  var marker = { __source__: name }
  this.sources[name] = { path: file, type: 'ini' }
  this.push(marker)
  this._await()
  fs.readFile(file, 'utf8', function (er, data) {
    // just ignore missing files.
    if (er) return this.add({}, marker)

    this.addString(data, file, 'ini', marker)
  }.bind(this))
  return this
}

// always ini files.
Conf.prototype.parse = function (content, file) {
  return CC.prototype.parse.call(this, content, file, 'ini')
}

Conf.prototype.add = function (data, marker) {
  try {
    Object.keys(data).forEach(function (k) {
      const newKey = envReplace(k)
      const newField = parseField(data[k], newKey)
      delete data[k]
      data[newKey] = newField
    })
  } catch (e) {
    this.emit('error', e)
    return this
  }
  return CC.prototype.add.call(this, data, marker)
}

Conf.prototype.addEnv = function (env) {
  env = env || process.env
  var conf = {}
  Object.keys(env)
    .filter(function (k) { return k.match(/^npm_config_/i) })
    .forEach(function (k) {
      if (!env[k]) return

      // leave first char untouched, even if
      // it is a '_' - convert all other to '-'
      var p = k.toLowerCase()
        .replace(/^npm_config_/, '')
        .replace(/(?!^)_/g, '-')
      conf[p] = env[k]
    })
  return CC.prototype.addEnv.call(this, '', conf, 'env')
}

function parseField (f, k, listElement = false) {
  if (typeof f !== 'string' && !(f instanceof String)) return f

  // type can be an array or single thing.
  const typeList = [].concat(types[k])
  const isPath = typeList.includes(path)
  const isBool = typeList.includes(Boolean)
  const isString = typeList.includes(String)
  const isUmask = typeList.includes(Umask)
  const isNumber = typeList.includes(Number)
  const isList = typeList.includes(Array) && !listElement

  f = ('' + f).trim()

  // list types get put in the environment separated by double-\n
  // usually a single \n would suffice, but ca/cert configs can contain
  // line breaks and multiple entries.
  if (isList) {
    return f.split('\n').map(field => parseField(field, k, true))
  }

  if (isBool && !isString && f === '') return true

  switch (f) {
    case 'true': return true
    case 'false': return false
    case 'null': return null
    case 'undefined': return undefined
  }

  f = envReplace(f)

  if (isPath) {
    var homePattern = isWindows ? /^~(\/|\\)/ : /^~\//
    if (f.match(homePattern) && process.env.HOME) {
      f = path.resolve(process.env.HOME, f.substr(2))
    }
    f = path.resolve(f)
  }

  if (isUmask) f = umask.fromString(f)

  if (isNumber && !isNaN(f)) f = +f

  return f
}

function envReplace (f) {
  if (typeof f !== 'string' || !f) return f

  // replace any ${ENV} values with the appropriate environ.
  var envExpr = /(\\*)\$\{([^}]+)\}/g
  return f.replace(envExpr, function (orig, esc, name) {
    esc = esc.length && esc.length % 2
    if (esc) return orig
    if (undefined === process.env[name]) {
      throw new Error('Failed to replace env in config: ' + orig)
    }

    return process.env[name]
  })
}

function validate (cl) {
  // warn about invalid configs at every level.
  cl.list.forEach(function (conf) {
    nopt.clean(conf, configDefs.types)
  })

  nopt.clean(cl.root, configDefs.types)
}

exports.load = load
exports.Conf = Conf
exports.loaded = false
exports.rootConf = null
exports.usingBuiltin = false
exports.defs = configDefs

Object.defineProperty(exports, 'defaults', {
  get: function () {
    return configDefs.defaults
  },
  enumerable: true
})

Object.defineProperty(exports, 'types', {
  get: function () {
    return configDefs.types
  },
  enumerable: true
})

exports.validate = validate
