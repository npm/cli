// TODO: set the scope config from package.json or explicit cli config
const walkUp = require('walk-up-path')
const which = require('which')
const mapWorkspaces = require('@npmcli/map-workspaces')
const rpj = require('read-package-json-fast')
const log = require('proc-log')
const { resolve, dirname, join } = require('path')
const { homedir } = require('os')
const fs = require('fs/promises')
const TypeDefs = require('./type-defs.js')
const nerfDart = require('./nerf-dart.js')
const { setEnv, setProcess, setNpmEnv, sameConfigValue, ...SetEnv } = require('./set-envs.js')
const { ErrInvalidAuth } = require('./errors')
const ConfigTypes = require('./config-types')
const Credentials = require('./credentials.js')
const ConfTypes = ConfigTypes.ConfTypes

const fileExists = (...p) => fs.stat(resolve(...p))
  .then((st) => st.isFile())
  .catch(() => false)

const dirExists = (...p) => fs.stat(resolve(...p))
  .then((st) => st.isDirectory())
  .catch(() => false)

// define a custom getter, but turn into a normal prop
// if we set it.  otherwise it can't be set on child objects
const settableGetter = (get, ...args) => Object.defineProperty(...args, {
  configurable: true,
  enumerable: true,
  get,
  set (value) {
    Object.defineProperty(...args, {
      value,
      configurable: true,
      writable: true,
      enumerable: true,
    })
  },
})

class Config {
  static get TypeDefs () {
    return TypeDefs
  }

  static get Types () {
    return TypeDefs.Types
  }

  static get ConfTypes () {
    return ConfTypes
  }

  static get EnvKeys () {
    return [...SetEnv.ALLOWED_ENV_KEYS.values()]
  }

  static get ProcessKeys () {
    return [...SetEnv.ALLOWED_PROCESS_KEYS.values()]
  }

  // required options in constructor
  #definitions = null
  #npmPath = null
  #derived = null

  // options just to override in tests, mostly
  #process = null
  #argv = null
  #env = null
  #execPath = null
  #platform = null
  #cwd = null
  #cwdRoot = null

  // set when we load configs
  #globalPrefix = null
  #localPrefix = null
  #localPackage = null

  #loaded = false
  #home = null
  #parsedArgv = null // from nopt
  // built in constructor from definitions
  #defaults = {}
  // data configs for each config type
  #configData = null
  #credentials = null

  constructor ({
    definitions,
    shorthands,
    flatten,
    npmPath,
    derived,

    // pass in process to set everything, but also allow
    // overriding specific parts of process that are used
    process: _process = process,
    env = _process.env,
    argv = _process.argv,
    platform = _process.platform,
    execPath = _process.execPath,
    cwd = _process.cwd(),
    cwdRoot = null,
  }) {
    this.#definitions = definitions
    this.#npmPath = npmPath

    this.#process = _process
    this.#env = env
    this.#argv = argv
    this.#platform = platform
    this.#execPath = execPath
    this.#cwd = cwd
    this.#cwdRoot = cwdRoot

    this.#home = this.#env.HOME || homedir()
    TypeDefs.typeDefs.path.HOME = this.#home
    TypeDefs.typeDefs.path.PLATFORM = this.#platform

    // turn the definitions into nopt's weirdo syntax
    const types = {}
    const deprecated = {}
    const effects = {}
    for (const [key, def] of Object.entries(this.#definitions)) {
      this.#defaults[key] = def.default
      types[key] = def.type
      if (def.deprecated) {
        deprecated[key] = def.deprecated.trim().replace(/\n +/, '\n')
      }
      if (def.derived) {
        effects[key] = def.derived
      }
    }
    Object.freeze(this.#definitions)
    Object.freeze(this.#defaults)
    Object.freeze(types)
    Object.freeze(deprecated)

    this.#configData = new ConfigTypes({
      flatten,
      deprecated,
      shorthands,
      effects,
      derived,
      types,
      env: this.#env,
    })

    this.#credentials = new Credentials(this)
  }

  // =============================================
  //
  // Public/Private Getters
  //
  // =============================================
  get loaded () {
    return this.#loaded
  }

  get prefix () {
    this.#assertLoaded()
    return this.#global ? this.globalPrefix : this.localPrefix
  }

  get globalPrefix () {
    this.#assertLoaded()
    return this.#globalPrefix
  }

  get localPrefix () {
    this.#assertLoaded()
    return this.#localPrefix
  }

  get localPackage () {
    this.#assertLoaded()
    return this.#localPackage
  }

  get parsedArgv () {
    this.#assertLoaded()
    return this.#parsedArgv
  }

  get flat () {
    this.#assertLoaded()
    return this.#configData.data
  }

  get valid () {
    this.#assertLoaded()
    for (const conf of this.#configData.values()) {
      if (!conf.validate()) {
        return false
      }
    }
    return true
  }

  get credentials () {
    return this.#credentials
  }

  get #global () {
    return this.#get('global') === true || this.#get('location') === 'global'
  }

  // =============================================
  //
  // Get/Set/Find/Delete, etc.
  //
  // =============================================
  find (key) {
    this.#assertLoaded()
    return this.#find(key)
  }

  #find (key) {
    return this.#configData.find(key)
  }

  get (key, where) {
    this.#assertLoaded()
    return this.#get(key, where)
  }

  #get (key, where = null) {
    return this.#configData.getData(where, key)
  }

  set (key, val, where) {
    this.#assertLoaded()
    return this.#set(key, val, where)
  }

  #set (key, val, where = ConfTypes.cli) {
    return this.#configData.setData(where, key, val)
  }

  delete (key, where) {
    this.#assertLoaded()
    return this.#delete(key, where)
  }

  #delete (key, where = ConfTypes.cli) {
    return this.#configData.deleteData(where, key)
  }

  // Returns true if the value is coming directly from the source defined
  // in default definitions, if the current value for the key config is
  // coming from any other different source, returns false
  isDefault (key) {
    this.#assertLoaded()
    return this.#find(key) === ConfTypes.default
  }

  // =============================================
  //
  // Config Type Loaders
  //
  // =============================================
  async load () {
    if (this.#loaded) {
      throw new Error(`attempting to call config.load() multiple times`)
    }
    return this.#time('load', () => this.#load())
  }

  async #load () {
    for (const { where } of this.#configData.values()) {
      await this.#time(`load:${where}`, () => this.#loadType(where))
    }

    // set proper globalPrefix now that everything is loaded
    // needs to be set before setEnvs to use it
    this.#globalPrefix = this.#get('prefix')
    this.#time('load:setEnvs', () => this.#setEnvs())
    this.#loaded = true
  }

  #loadType (where) {
    switch (where) {
      case ConfTypes.default:
        return this.#loadDefaults()
      case ConfTypes.builtin:
        return this.#loadBuiltin()
      case ConfTypes.global:
        return this.#loadGlobal()
      case ConfTypes.user:
        return this.#loadUser()
      case ConfTypes.project:
        return this.#loadProject()
      case ConfTypes.env:
        return this.#loadEnv()
      case ConfTypes.cli:
        return this.#loadCli()
    }
  }

  async #loadDefaults () {
    await this.#time('whichnode', async () => {
      const node = await which(this.#argv[0]).catch(() => {})
      if (node?.toUpperCase() !== this.#execPath.toUpperCase()) {
        log.verbose('node symlink', node)
        this.#execPath = node
        setProcess(this.#process, 'execPath', node)
      }
    })

    if (this.#env.PREFIX) {
      this.#globalPrefix = this.#env.PREFIX
    } else if (this.#platform === 'win32') {
      // c:\node\node.exe --> prefix=c:\node\
      this.#globalPrefix = dirname(this.#execPath)
    } else {
      // /usr/local/bin/node --> prefix=/usr/local
      this.#globalPrefix = dirname(dirname(this.#execPath))

      // destdir only is respected on Unix
      if (this.#env.DESTDIR) {
        this.#globalPrefix = join(this.#env.DESTDIR, this.#globalPrefix)
      }
    }

    this.#loadObject({ ...this.#defaults, prefix: this.#globalPrefix }, ConfTypes.default)

    const { data } = this.#configData.get(ConfTypes.default)

    // the metrics-registry defaults to the current resolved value of
    // the registry, unless overridden somewhere else.
    settableGetter(() => this.#get('registry'), data, 'metrics-registry')

    // if the prefix is set on cli, env, or userconfig, then we need to
    // default the globalconfig file to that location, instead of the default
    // global prefix.  It's weird that `npm get globalconfig --prefix=/foo`
    // returns `/foo/etc/npmrc`, but better to not change it at this point.
    settableGetter(() => resolve(this.#get('prefix'), 'etc/npmrc'), data, 'globalconfig')
  }

  async #loadBuiltin () {
    await this.#loadFile(resolve(this.#npmPath, 'npmrc'), ConfTypes.builtin)
  }

  async #loadGlobal () {
    await this.#loadFile(this.#get('globalconfig'), ConfTypes.global)
  }

  async #loadUser () {
    await this.#loadFile(this.#get('userconfig'), ConfTypes.user)
  }

  async #loadProject () {
    // the localPrefix can be set by the CLI config, but otherwise is
    // found by walking up the folder tree. either way, we load it before
    // we return to make sure localPrefix is set
    await this.#time('load:localprefix', async () => {
      await this.#loadLocalPrefix()

      // if we have not detected a local package json yet, try now that we
      // have a local prefix
      if (this.#localPackage == null) {
        this.#localPackage = await fileExists(this.#localPrefix, 'package.json')
      }
    })

    const config = this.#configData.get(ConfTypes.project)

    if (this.global) {
      config.load(null, null, 'global mode enabled')
      return
    }

    const projectFile = resolve(this.#localPrefix, '.npmrc')
    // if we're in the ~ directory, and there happens to be a node_modules
    // folder (which is not TOO uncommon, it turns out), then we can end
    // up loading the "project" config where the "userconfig" will be,
    // which causes some calamaties.  So, we only load project config if
    // it doesn't match what the userconfig will be.
    if (projectFile === this.#get('userconfig')) {
      config.load(null, null, 'same as "user" config')
      return
    }
    await this.#loadFile(projectFile, ConfTypes.project)
  }

  #loadEnv () {
    const data = Object.entries(this.#env).reduce((acc, [envKey, envVal]) => {
      if (!/^npm_config_/i.test(envKey) || envVal === '') {
        return acc
      }
      let key = envKey.slice('npm_config_'.length)
      if (!key.startsWith('//')) {
        // don't normalize nerf-darted keys
        // don't replace _ at the start of the key
        key = key.replace(/(?!^)_/g, '-').toLowerCase()
      }
      acc[key] = envVal
      return acc
    }, {})
    this.#loadObject(data, ConfTypes.env)
  }

  #loadCli () {
    const res = this.#loadObject(this.#argv.slice(2), ConfTypes.cli)
    this.#parsedArgv = res?.argv ?? null
  }

  async #loadFile (file, where) {
    // only catch the error from readFile, not from the loadObject call
    await this.#time(`load:file:${file}`, () => fs.readFile(file, 'utf8').then(
      data => this.#loadObject(data, where, file),
      er => this.#loadObject(null, where, file, er)
    ))
  }

  #loadObject (data, where, source, error) {
    return this.#configData.get(where).load(data, error, source)
  }

  async #loadLocalPrefix () {
    const cliPrefix = this.#get('prefix', ConfTypes.cli)
    if (cliPrefix) {
      this.#localPrefix = cliPrefix
      return
    }

    const cliWorkspaces = this.#get('workspaces', ConfTypes.cli)

    for (const p of walkUp(this.#cwd)) {
      if (p === this.#cwdRoot) {
        break
      }

      const hasPackageJson = await fileExists(p, 'package.json')

      if (!this.#localPrefix && (hasPackageJson || await dirExists(p, 'node_modules'))) {
        this.#localPrefix = p
        this.#localPackage = hasPackageJson

        // if workspaces are disabled, or we're in global mode, return now
        if (cliWorkspaces === false || this.global) {
          return
        }

        // otherwise, continue the loop
        continue
      }

      if (this.#localPrefix && hasPackageJson) {
        // if we already set localPrefix but this dir has a package.json
        // then we need to see if `p` is a workspace root by reading its package.json
        // however, if reading it fails then we should just move on
        const pkg = await rpj(resolve(p, 'package.json')).catch(() => false)
        if (!pkg) {
          continue
        }

        const workspaces = await mapWorkspaces({ cwd: p, pkg })
        for (const w of workspaces.values()) {
          if (w === this.#localPrefix) {
            // see if there's a .npmrc file in the workspace, if so log a warning
            if (await fileExists(this.#localPrefix, '.npmrc')) {
              log.warn(`ignoring workspace config at ${this.#localPrefix}/.npmrc`)
            }

            // set the workspace in the default layer, which allows it to be overridden easily
            const { data } = this.#configData.get(ConfTypes.default)
            data.workspace = [this.#localPrefix]
            this.#localPrefix = p
            this.#localPackage = hasPackageJson
            log.info(`found workspace root at ${this.#localPrefix}`)
            // we found a root, so we return now
            return
          }
        }
      }
    }

    if (!this.#localPrefix) {
      this.#localPrefix = this.#cwd
    }
  }

  // Set environment variables for any non-default configs,
  // so that they're already there when we run lifecycle scripts.
  //
  // See https://github.com/npm/rfcs/pull/90

  // Return the env key if this is a thing that belongs in the env.
  // Ie, if the key isn't a @scope, //nerf.dart, or _private,
  // and the value is a string or array.  Otherwise return false.

  // This ensures that all npm config values that are not the defaults are
  // shared appropriately with child processes, without false positives.
  #setEnvs () {
    setNpmEnv(this.#env, 'global-prefix', this.#globalPrefix)
    setNpmEnv(this.#env, 'local-prefix', this.#localPrefix)

    // if the key is deprecated, skip it always.
    // if the key is the default value,
    //   if the environ is NOT the default value,
    //     set the environ
    //   else skip it, it's fine
    // if the key is NOT the default value,
    //   if the env is setting it, then leave it (already set)
    //   otherwise, set the env
    const configValues = this.#configData.reverseValues()
    const cliConf = configValues.next().value
    const envConf = configValues.next().value

    for (const [key, value] in cliConf.entries()) {
      const { deprecated, envExport = true } = this.#definitions[key] || {}
      if (deprecated || envExport === false) {
        continue
      }

      if (sameConfigValue(this.#defaults[key], value)) {
        // config is the default, if the env thought different, then we
        // have to set it BACK to the default in the environment.
        if (!sameConfigValue(envConf.get(key), value)) {
          setNpmEnv(this.#env, key, value)
        }
      } else {
        // config is not the default.  if the env wasn't the one to set
        // it that way, then we have to put it in the env
        if (!(envConf.has(key) && !cliConf.has(key))) {
          setNpmEnv(this.#env, key, value)
        }
      }
    }

    // also set some other common nice envs that we want to rely on
    setEnv(this.#env, 'INIT_CWD', this.#cwd)
    setEnv(this.#env, 'HOME', this.#home)
    setEnv(this.#env, 'NODE', this.#execPath)
    setEnv(this.#env, 'npm_node_execpath', this.#execPath)
    setEnv(this.#env, 'npm_execpath', require.main?.filename ?? null)
    setEnv(this.#env, 'EDITOR', cliConf.has('editor') ? cliConf.get('editor') : null)

    // note: this doesn't afect the *current* node process, of course, since
    // it's already started, but it does affect the options passed to scripts.
    if (cliConf.has('node-options')) {
      setEnv(this.#env, 'NODE_OPTIONS', cliConf.get('node-options'))
    }
  }

  // =============================================
  //
  // Save
  //
  // =============================================
  async save (where) {
    this.#assertLoaded()

    if (where === ConfTypes.user) {
      // if email is nerfed, then we want to de-nerf it
      const nerfed = nerfDart(this.get('registry'))
      const email = this.get(`${nerfed}:email`, where)
      if (email) {
        this.delete(`${nerfed}:email`, where)
        this.set('email', email, where)
      }
    }

    const conf = this.#configData.get(where)
    const data = conf.toString()

    if (!data) {
      // ignore the unlink error (eg, if file doesn't exist)
      await fs.unlink(conf.source).catch(() => {})
      return
    }
    const dir = dirname(conf.source)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(conf.source, data + '\n', 'utf8')
    const mode = where === ConfTypes.user ? 0o600 : 0o666
    await fs.chmod(conf.source, mode)
  }

  // =============================================
  //
  // Validation / Repair
  //
  // =============================================
  validate () {
    this.#assertLoaded()

    let allValid = true
    const authProblems = []

    for (const conf of this.#configData.values()) {
      const valid = conf.validate()
      if (valid === true) {
        allValid = allValid && true
        continue
      }

      allValid = false

      if (valid?.problems?.auth) {
        authProblems.push(...valid.problems.auth)
      }
    }

    if (authProblems.length) {
      throw new ErrInvalidAuth(authProblems)
    }

    return allValid
  }

  // fixes problems identified by validate(), accepts the 'problems' property from a thrown
  // ErrInvalidAuth to avoid having to check everything again
  repair (problems) {
    this.#assertLoaded()

    if (!problems) {
      try {
        return this.validate()
      } catch (err) {
        // coverage skipped here because we don't need to test re-throwing an error
        // istanbul ignore next
        if (err.code !== 'ERR_INVALID_AUTH') {
          throw err
        }
        problems = err.problems
      }
    }

    for (const problem of problems) {
      // coverage disabled for else branch because it doesn't do anything and shouldn't
      // istanbul ignore else
      if (problem.action === 'delete') {
        this.delete(problem.key, problem.where)
      } else if (problem.action === 'rename') {
        const old = this.get(problem.from, problem.where)
        this.set(problem.to, old, problem.where)
        this.delete(problem.from, problem.where)
      }
    }
  }

  // =============================================
  //
  // Utils/Misc
  //
  // =============================================
  #assertLoaded () {
    if (!this.loaded) {
      throw new Error('call config.load() before reading values')
    }
  }

  #time (name, fn) {
    const k = `config:${name}`
    process.emit('time', k)
    const end = () => process.emit('timeEnd', k)
    const res = fn()
    return res?.finally ? res.finally(end) : (end(), res)
  }
}

module.exports = Config
