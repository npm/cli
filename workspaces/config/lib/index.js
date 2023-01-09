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
const SetGlobal = require('./set-globals.js')
const { ErrInvalidAuth } = require('./errors')
const Credentials = require('./credentials.js')
const ConfigTypes = require('./config-locations')
const { definitions, defaults } = require('./definitions')
const { isNerfed } = require('./nerf-dart.js')
const replaceInfo = require('./replace-info')
const Locations = ConfigTypes.Locations

const fileExists = (...p) => fs.stat(resolve(...p))
  .then((st) => st.isFile())
  .catch(() => false)

const dirExists = (...p) => fs.stat(resolve(...p))
  .then((st) => st.isDirectory())
  .catch(() => false)

class Config {
  static TypeDefs = TypeDefs
  static Types = TypeDefs.Types
  static Locations = Locations
  static EnvKeys = [...SetGlobal.EnvKeys.values()]
  static ProcessKeys = [...SetGlobal.ProcessKeys.values()]
  static nerfDarts = Credentials.nerfDarts

  // state
  #configData = null

  // required options in constructor
  #npmRoot = null
  #argv = null
  #cwdRoot = null

  // options just to override in tests, mostly
  #process = null
  #env = null
  #platform = null
  #execPath = null
  #cwd = null

  // set during init which is called in ctor
  #command = null
  #args = null
  #clean = null
  #title = null

  // set when we load configs
  #globalPrefix = null
  #localPrefix = null
  #localPackage = null
  #loaded = false
  #home = null

  // functions
  #setEnv = null
  #setNpmEnv = null
  #setProc = null
  #credentials = null

  constructor ({
    npmRoot,
    argv,
    cwdRoot,

    // pass in process to set everything, but also allow
    // overriding specific parts of process that are used
    // these are only used for testing
    process: _process = process,
    env = _process.env,
    platform = _process.platform,
    execPath = _process.execPath,
    cwd = _process.cwd(),
  }) {
    this.#npmRoot = npmRoot

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

    this.#configData = new ConfigTypes({
      envReplace: (k) => SetGlobal.replaceEnv(this.#env),
      config: this,
    })

    this.#credentials = new Credentials(this)

    this.#setProc = (...args) => SetGlobal.setProcess(this.#process, ...args)
    this.#setEnv = (...args) => SetGlobal.setEnv(this.#env, ...args)
    this.#setNpmEnv = (...args) => SetGlobal.npm.setEnv(this.#env, ...args)

    this.#init()
  }

  // =============================================
  //
  // Public/Private Getters
  //
  // =============================================
  get loaded () {
    return this.#loaded
  }

  get globalPrefix () {
    return this.#globalPrefix
  }

  get localPrefix () {
    return this.#localPrefix
  }

  get localPackage () {
    return this.#localPackage
  }

  get flat () {
    return this.#configData.data
  }

  get valid () {
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

  get command () {
    return this.#command
  }

  get args () {
    return this.#args
  }

  get clean () {
    return this.#clean
  }

  get title () {
    return this.#title
  }

  // =============================================
  //
  // Data getters/setters
  //
  // * set/delete default to manipulating the CLI location
  // * get/find/has default to null which will search through
  //   all the locations
  //
  // =============================================
  find (key, where) {
    this.#assertLoaded()
    return this.#find(key, where)
  }

  #find (key, where = null) {
    return this.#configData.find(where, key)
  }

  has (key, where) {
    this.#assertLoaded()
    return this.#has(key, where)
  }

  #has (key, where = null) {
    return this.#configData.has(where, key)
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

  #set (key, val, where = Locations.cli) {
    return this.#configData.setData(where, key, val)
  }

  delete (key, where) {
    this.#assertLoaded()
    return this.#delete(key, where)
  }

  #delete (key, where = Locations.cli) {
    return this.#configData.deleteData(where, key)
  }

  // Returns true if the value is coming directly from the source defined
  // in default definitions, if the current value for the key config is
  // coming from any other different source, returns false
  isDefault (key) {
    this.#assertLoaded()
    return this.#find(key) === Locations.default
  }

  // =============================================
  //
  // Config type loaders
  //
  // =============================================
  #init () {
    // load env first because it has no dependencies
    this.#loadEnv()

    // then load the cli options since those have no dependencies but can have env
    // vars replaced in them. this gives us the command name and any remaining args
    // which will be passed to npm.exec().
    // NOTE: this is where command specific config could go since we now have a parsed
    // command name, the remaining args, and config values from the CLI and can rewrite
    // them or parse the remaining config files with this information.
    const { remain, cooked } = this.#loadObject(Locations.cli, this.#argv)
    this.#command = remain[0]
    this.#args = remain.slice(1)

    if (this.#get('versions', Locations.cli) || this.#get('version', Locations.cli)) {
      // npm --versions or npm --version both run the version command
      this.#command = 'version'
      this.#args = []
      this.#set('usage', false, Locations.cli)
    } else if (!this.#command) {
      // if there is no command, then we run the basic help command which print usage
      // but its an error so we need to set the exit code too
      this.#command = 'help'
      this.#args = []
      process.exitCode = 1
    }

    // Secrets are mostly in configs, so title is set using only the positional args
    // to keep those from being leaked.
    this.#title = `npm ${replaceInfo(remain).join(' ')}`.trim()
    this.#setProc('title', this.#title)
    log.verbose('title', this.#title)

    // The cooked argv is also logged separately for debugging purposes. It is
    // cleaned as a best effort by replacing known secrets like basic auth
    // password and strings that look like npm tokens. XXX: for this to be
    // safer the config should create a sanitized version of the argv as it
    // has the full context of what each option contains.
    this.#clean = replaceInfo(cooked)
    log.verbose('argv', this.#clean.map(JSON.stringify).join(' '))

    // Options are prefixed by a hyphen-minus (-, \u2d).
    // Other dash-type chars look similar but are invalid.
    const nonDashArgs = remain.filter(a => /^[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/.test(a))
    if (nonDashArgs.length) {
      log.error(
        'arg',
        'Argument starts with non-ascii dash, this is probably invalid:',
        nonDashArgs.join(', ')
      )
    }
  }

  async add (where, data) {
    this.#assertLoaded()
    return this.#configData.add(where, data)
  }

  async load () {
    this.#assertLoaded(false)
    return this.#time('load', () => this.#load())
  }

  async #load () {
    // first load the defaults, which sets the global prefix
    await this.#time(`load:${Locations.defaults}`, () => this.#loadDefaults())
    // next load the builtin config, as this sets new effective defaults
    await this.#time(`load:${Locations.builtin}`, () => this.#loadBuiltin())
    // next project config, which can affect userconfig location
    await this.#time(`load:${Locations.project}`, () => this.#loadProject())
    // then user config, which can affect globalconfig location
    await this.#time(`load:${Locations.user}`, () => this.#loadUser())
    // last but not least, global config file
    await this.#time(`load:${Locations.global}`, () => this.#loadGlobal())

    // set proper globalPrefix now that everything is loaded
    // needs to be set before setEnvs to use it
    this.#globalPrefix = this.#get('prefix')
    this.#time('load:setEnvs', () => this.#setEnvs())
    this.#loaded = true
  }

  async #loadDefaults () {
    await this.#time('whichnode', async () => {
      const node = await which(this.#argv[0]).catch(() => {})
      if (node?.toUpperCase() !== this.#execPath.toUpperCase()) {
        log.verbose('node symlink', node)
        this.#execPath = node
        SetGlobal.setProcess(this.#process, 'execPath', node)
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

    this.#loadObject(Locations.default, {
      ...defaults,
      prefix: this.#globalPrefix,
      globalconfig: resolve(this.#get('prefix'), 'etc/npmrc'),
    })
  }

  async #loadBuiltin () {
    await this.#loadFile(resolve(this.#npmRoot, 'npmrc'), Locations.builtin)
  }

  async #loadGlobal () {
    await this.#loadFile(this.#configData.data.globalconfig, Locations.global)
  }

  async #loadUser () {
    await this.#loadFile(this.#get('userconfig'), Locations.user)
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

    const config = this.#configData.get(Locations.project)

    if (this.global) {
      config.ignore('global mode enabled')
      return
    }

    const projectFile = resolve(this.#localPrefix, '.npmrc')
    // if we're in the ~ directory, and there happens to be a node_modules
    // folder (which is not TOO uncommon, it turns out), then we can end
    // up loading the "project" config where the "userconfig" will be,
    // which causes some calamaties.  So, we only load project config if
    // it doesn't match what the userconfig will be.
    if (projectFile === this.#get('userconfig')) {
      config.ignore('same as "user" config')
      return
    }
    await this.#loadFile(projectFile, Locations.project)
  }

  #loadEnv () {
    const data = Object.entries(this.#env).reduce((acc, [key, val]) => {
      if (!SetGlobal.npm.testKey(key) || !val) {
        return acc
      }
      const configKey = key.slice(SetGlobal.npm.envPrefix.length)
      if (isNerfed(configKey)) {
        // don't normalize nerf-darted keys
        acc[configKey] = val
      } else {
        // don't replace _ at the start of the key
        acc[configKey.replace(/(?!^)_/g, '-').toLowerCase()] = val
      }
      return acc
    }, {})
    this.#loadObject(Locations.env, data)
  }

  async #loadFile (file, where) {
    // only catch the error from readFile, not from the loadObject call
    await this.#time(`load:file:${file}`, () => fs.readFile(file, 'utf8').then(
      data => this.#loadObject(where, data, file),
      er => this.#loadObject(where, null, file, er)
    ))
  }

  #loadObject (where, data, file, error) {
    return this.#configData.get(where).load(data, error, file)
  }

  async #loadLocalPrefix () {
    const cliPrefix = this.#get('prefix', Locations.cli)
    if (cliPrefix) {
      this.#localPrefix = cliPrefix
      return
    }

    const cliWorkspaces = this.#get('workspaces', Locations.cli)

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
            const { data } = this.#configData.get(Locations.default)
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
    this.#setNpmEnv('global-prefix', this.#globalPrefix)
    this.#setNpmEnv('local-prefix', this.#localPrefix)

    // if the key is deprecated, skip it always.
    // if the key is the default value,
    //   if the environ is NOT the default value,
    //     set the environ
    //   else skip it, it's fine
    // if the key is NOT the default value,
    //   if the env is setting it, then leave it (already set)
    //   otherwise, set the env
    const cliConf = this.#configData.get(Locations.cli)
    const envConf = this.#configData.get(Locations.env)

    for (const [key, value] in cliConf.entries()) {
      const def = definitions[key]
      if (def?.deprecated || !def?.envExport) {
        continue
      }

      if (SetGlobal.sameValue(defaults[key], value)) {
        // config is the default, if the env thought different, then we
        // have to set it BACK to the default in the environment.
        if (!SetGlobal.sameValue(envConf.get(key), value)) {
          this.#setNpmEnv(key, value)
        }
      } else {
        // config is not the default.  if the env wasn't the one to set
        // it that way, then we have to put it in the env
        if (!(envConf.has(key) && !cliConf.has(key))) {
          this.#setNpmEnv(key, value)
        }
      }
    }

    // these depend on derived values so they use the flat data
    this.#setNpmEnv('user-agent', this.flat.userAgent)
    this.#setEnv('COLOR', this.flat.color ? '1' : '0')
    this.#setEnv('NODE_ENV', this.flat.omit.includes('dev') ? 'production' : null)
    // XXX make this the bin/npm-cli.js file explicitly instead
    // otherwise using npm programmatically is a bit of a pain.
    this.#setEnv('npm_execpath', this.flat.npmBin ?? null)

    // also set some other common nice envs that we want to rely on
    this.#setEnv('INIT_CWD', this.#cwd)
    this.#setEnv('HOME', this.#home)
    this.#setEnv('NODE', this.#execPath)
    this.#setEnv('npm_node_execpath', this.#execPath)
    this.#setEnv('npm_command', this.#command)
    this.#setEnv('EDITOR', cliConf.has('editor') ? cliConf.get('editor') : null)

    // note: this doesn't afect the *current* node process, of course, since
    // it's already started, but it does affect the options passed to scripts.
    if (cliConf.has('node-options')) {
      this.#setEnv('NODE_OPTIONS', cliConf.get('node-options'))
    }
  }

  // =============================================
  //
  // Save / Validation / Repair
  //
  // =============================================
  async save (where) {
    this.#assertLoaded()
    const conf = this.#configData.get(where)
    await conf.save()
    return conf
  }

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
  #assertLoaded (val = true) {
    if (this.loaded !== val) {
      throw new Error(`config ${val ? 'must' : 'must not'} be loaded to perform this action`)
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
