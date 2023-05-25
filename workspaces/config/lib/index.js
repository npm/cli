// TODO: set the scope config from package.json or explicit cli config
const { walkUp } = require('walk-up-path')
const which = require('which')
const mapWorkspaces = require('@npmcli/map-workspaces')
const rpj = require('read-package-json-fast')
const log = require('proc-log')
const { resolve, dirname, join } = require('path')
const { realpathSync } = require('fs')
const fs = require('fs/promises')
const SetGlobal = require('./set-envs.js')
const { ErrInvalidAuth } = require('./errors')
const ConfigTypes = require('./config-locations')
const ConfigData = require('./config-data')
const Definitions = require('./definitions')
const nerfDart = require('./nerf-dart.js')
const replaceInfo = require('./replace-info')
const { Locations } = require('./definlocations')

const fileExists = (...p) => fs.stat(resolve(...p))
  .then((st) => st.isFile())
  .catch(() => false)

const dirExists = (...p) => fs.stat(resolve(...p))
  .then((st) => st.isDirectory())
  .catch(() => false)

const builtinNpm = () => {
  try {
    const realNpm = realpathSync(which.sync('npm'))
    return dirname(require.resolve('npm/package.json'), { paths: [realNpm] })
  } catch {
    return null
  }
}

class Config {
  // required options in constructor
  #npmRoot = null
  #argv = null
  #localPrefixRoot = null

  // set during init which is called in ctor
  #clean = null

  // set when we load configs
  #loaded = false
  #bailout = null

  // functions
  #credentials = null

  // state
  #configData = null

  constructor ({
    npmRoot = builtinNpm(),
    argv = [],
    localPrefixRoot = null,
  }) {
    this.#npmRoot = npmRoot
    this.#argv = argv
    this.#localPrefixRoot = localPrefixRoot

    try {
      const { version } = require(join(this.#npmRoot, 'package.json'))
      this.#setInternal('npm-version', version)
    } catch {
      // in some weird state where the passed in npmPath does not have a package.json
      // this will never happen in npm, but is guarded here in case this is consumed
      // in other ways + tests
    }

    // this allows the Path type definition to do replacements
    // using the detected home and platform
    Definitions.getData((k) => this.#getInternal(k))

    this.#configData = new ConfigTypes()

    this.#credentials = {
      setByURI: (uri) => this.#setByURI(uri),
      getByURI: (uri) => this.#getByURI(uri),
      clearByURI: (uri) => this.#clearByURI(uri),
    }

    // load env first because it has no dependencies
    this.#loadEnv()

    // then load the cli options since those have no dependencies but can have env
    // vars replaced in them. this gives us the command name and any remaining args
    // which will be passed to npm.exec().
    this.#bailout = this.#loadCli()
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
    return this.#get('global-prefix')
  }

  get localPrefix () {
    return this.#get('local-prefix')
  }

  get localPackage () {
    return this.#getInternal('local-package')
  }

  get command () {
    return this.#getInternal('npm-command')
  }

  get args () {
    return this.#getInternal('npm-args')
  }

  get title () {
    return this.#getInternal('title')
  }

  get flat () {
    return this.#configData.data
  }

  get data () {
    return this.#configData
  }

  get bailout () {
    return this.#bailout
  }

  get valid () {
    for (const conf of this.#configData.values()) {
      if (!conf.valid) {
        return false
      }
    }
    return true
  }

  get credentials () {
    return this.#credentials
  }

  get clean () {
    return this.#clean
  }

  // this is used in init-package-json (which it probably shouldn't be)
  // but to not have breakages there we need to have an instance getter
  // to return the raw data there
  get defaults () {
    return Definitions.defaults
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

  #getInternal (key) {
    return this.#get(key, Locations.internal)
  }

  set (key, val, where) {
    this.#assertLoaded()
    return this.#set(key, val, where)
  }

  #set (key, val, where = Locations.cli) {
    return this.#configData.setData(where, key, val)
  }

  #setInternal (key, value) {
    return this.#set(key, value, Locations.internal)
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
  #loadEnv () {
    const data = Object.entries(process.env).reduce((acc, [key, val]) => {
      if (!SetGlobal.testEnvKey(key) || !val) {
        return acc
      }
      const configKey = key.slice(SetGlobal.envPrefix.length)
      if (nerfDart.isNerfed(configKey)) {
        // don't normalize nerf-darted keys
        acc[configKey] = val
      } else {
        // don't replace _ at the start of the key
        acc[configKey.replace(/(?!^)_/g, '-').toLowerCase()] = val
      }
      return acc
    }, {})
    log.silly('config:env', data)
    this.#loadObject(Locations.env, data)
  }

  #loadCli () {
    // NOTE: this is where command specific config could go since we now have a parsed
    // command name, the remaining args, and config values from the CLI and can rewrite
    // them or parse the remaining config files with this information.
    const { argv: { remain, cooked } } = this.#loadObject(Locations.cli, this.#argv)

    let command = remain[0]
    let positionals = remain.slice(1)

    if (this.#get('version', Locations.cli)) {
      // npm --version is a special case that bails out of all other execing
      // the version is returned from this method and then lib/npm will
      // output it without trying anything else. this helps make npm --version
      // faster since it is often used in shell prompts
      return this.#getInternal('npm-version')
    }

    if (this.#get('versions', Locations.cli)) {
      // npm --versions always runs the version command with usage off regardless of other config
      command = 'version'
      positionals = []
      this.#set('usage', false, Locations.cli)
    }

    if (!command) {
      // if there is no command, then we run the basic help command which print usage
      // but its an error so we need to set the exit code too
      command = 'help'
      positionals = []
      process.exitCode = 1
    }

    this.#setInternal('npm-command', command)
    this.#setInternal('npm-args', positionals)

    // Secrets are mostly in configs, so title is set using only the positional args
    // to keep those from being leaked.
    this.#setInternal('title', `npm ${replaceInfo(remain).join(' ')}`.trim())
    log.verbose('config', 'title', this.#getInternal('title'))

    // The cooked argv is also logged separately for debugging purposes. It is
    // cleaned as a best effort by replacing known secrets like basic auth
    // password and strings that look like npm tokens. XXX: for this to be
    // safer the config should create a sanitized version of the argv as it
    // has the full context of what each option contains.
    this.#clean = replaceInfo(cooked)
    log.verbose('config', 'argv', this.#clean.map(JSON.stringify).join(' '))

    // Options are prefixed by a hyphen-minus (-, \u2d).
    // Other dash-type chars look similar but are invalid.
    const nonDashArgs = remain.filter(a => /^[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/.test(a))
    if (nonDashArgs.length) {
      log.error(
        'config',
        'Argument starts with non-ascii dash, this is probably invalid:',
        nonDashArgs.join(', ')
      )
    }
  }

  async load () {
    this.#assertLoaded(false)
    await this.#time('load', () => this.#load())
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
    // now that everything is loaded we can set our env vars
    this.#time('load:setEnvs', () => this.#setEnvs())
    this.#loaded = true
  }

  async #loadDefaults () {
    await this.#findGlobalPrefix()
    this.#loadObject(Locations.default, Definitions.defaults)
  }

  async #loadBuiltin () {
    const where = Locations.builtin
    if (this.#npmRoot) {
      await this.#loadFile(resolve(this.#npmRoot, 'npmrc'), where)
    } else {
      this.#loadObject(where, null, null, new Error('npmRoot is not set'))
    }
  }

  async #loadGlobal () {
    await this.#loadFile(this.#get('globalconfig'), Locations.global)
  }

  async #loadUser () {
    await this.#loadFile(this.#get('userconfig'), Locations.user)
  }

  async #loadProject () {
    // the localPrefix can be set by the CLI config, but otherwise is
    // found by walking up the folder tree. either way, we load it before
    // we return to make sure localPrefix is set
    await this.#time('load:localprefix', () => this.#findLocalPrefix())

    const { localPrefix } = this

    if (this.#get('default-local-prefix-workspace') === localPrefix) {
      // set the workspace in the default layer, which allows it to be overridden easily
      this.#set('workspace', [localPrefix], Locations.default)
      if (await fileExists(localPrefix, '.npmrc')) {
        log.warn('config', `ignoring workspace config at ${localPrefix}/.npmrc`)
      }
    }

    this.#setInternal('local-package', await fileExists(localPrefix, 'package.json'))

    const config = this.#configData.get(Locations.project)

    if (this.#get('global')) {
      config.ignore('global mode enabled')
      return
    }

    const projectFile = resolve(localPrefix, '.npmrc')
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

  async #loadFile (file, where) {
    // only catch the error from readFile, not from the loadObject call
    await this.#time(`load:file:${file}`, () => fs.readFile(file, 'utf8').then(
      data => this.#loadObject(where, data, file),
      er => this.#loadObject(where, null, file, er)
    ))
  }

  #loadObject (where, data, file, error) {
    return this.#configData.load(where, data, file, error)
  }

  async #findGlobalPrefix () {
    await this.#time('whichnode', async () => {
      const execPath = this.#getInternal('exec-path')
      const node = await which(execPath).catch(() => {})
      if (node?.toUpperCase() !== execPath.toUpperCase()) {
        log.verbose('config', 'node symlink', node)
        this.#setInternal('exec-path', node)
      }
    })

    let prefix
    if (process.env.PREFIX) {
      prefix = process.env.PREFIX
    } else if (this.#getInternal('platform') === 'win32') {
      // c:\node\node.exe --> prefix=c:\node\
      prefix = dirname(this.#getInternal('exec-path'))
    } else {
      // /usr/local/bin/node --> prefix=/usr/local
      prefix = dirname(dirname(this.#getInternal('exec-path')))
      // destdir only is respected on Unix
      if (process.env.DESTDIR) {
        prefix = join(process.env.DESTDIR, prefix)
      }
    }

    this.#setInternal('default-global-prefix', prefix)
  }

  async #findLocalPrefix () {
    const prefix = { root: null, workspace: null }

    for (const p of walkUp(this.#getInternal('cwd'))) {
      const hasPackageJson = await fileExists(p, 'package.json')

      if (!prefix.root && (hasPackageJson || await dirExists(p, 'node_modules'))) {
        prefix.root = p
        continue
      }

      if (prefix.root && hasPackageJson) {
        // if we already set localPrefix but this dir up the chain has a package.json
        // then we need to see if `p` is a workspace root by reading its package.json
        // however, if reading it fails then we should just move on
        const pkg = await rpj(resolve(p, 'package.json')).catch(() => false)

        if (!pkg) {
          continue
        }

        for (const w of (await mapWorkspaces({ cwd: p, pkg })).values()) {
          if (w === prefix.root) {
            prefix.workspace = p
            // we found a root, so we return now
            break
          }
        }
      }

      // This property tells us to stop looking if we reach this directory no
      // matter what else has been found
      if (p === this.#localPrefixRoot) {
        break
      }
    }

    this.#setInternal('default-local-prefix-root', prefix.root)
    this.#setInternal('default-local-prefix-workspace', prefix.workspace)
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
      const def = Definitions.definitions[key]
      if (def?.deprecated || !def?.envExport) {
        continue
      }

      if (SetGlobal.sameValue(Definitions.defaults[key], value)) {
        // config is the default, if the env thought different, then we
        // have to set it BACK to the default in the environment.
        if (!SetGlobal.sameValue(envConf.get(key), value)) {
          SetGlobal.setEnv(process.env, key, value)
        }
      } else {
        // config is not the default.  if the env wasn't the one to set
        // it that way, then we have to put it in the env
        if (!(envConf.has(key) && !cliConf.has(key))) {
          SetGlobal.setEnv(process.env, key, value)
        }
      }
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

  async edit (where, opts) {
    this.#assertLoaded()
    const conf = this.#configData.get(where)
    await conf.edit(opts)
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
        const raw = this.data.get(problem.where).raw?.[problem.from]
        const calculated = this.get(problem.from, problem.where)
        this.set(problem.to, raw || calculated, problem.where)
        this.delete(problem.from, problem.where)
      }
    }
  }

  // =============================================
  //
  // Credentials
  //
  // =============================================

  #clearByURI (uri) {
    const nerfed = nerfDart(uri)
    const def = nerfDart(this.#get('registry'))
    if (def === nerfed) {
      this.#delete(`-authtoken`, Locations.user)
      this.#delete(`_authToken`, Locations.user)
      this.#delete(`_authtoken`, Locations.user)
      this.#delete(`_auth`, Locations.user)
      this.#delete(`_password`, Locations.user)
      this.#delete(`username`, Locations.user)
      // de-nerf email if it's nerfed to the default registry
      const email = this.#get(`${nerfed}:email`, Locations.user)
      if (email) {
        this.#set('email', email)
      }
    }
    for (const k of Definitions.nerfDarts) {
      this.#delete(`${nerfed}:${k}`)
    }
  }

  #setByURI (uri, { token, username, password, email, certfile, keyfile }) {
    const nerfed = nerfDart(uri)

    // email is either provided, a top level key, or nothing
    email = email || this.#get('email', Locations.user)

    // field that hasn't been used as documented for a LONG time,
    // and as of npm 7.10.0, isn't used at all.  We just always
    // send auth if we have it, only to the URIs under the nerf dart.
    this.#delete(`${nerfed}:always-auth`, Locations.user)

    this.#delete(`${nerfed}:email`, Locations.user)
    if (certfile && keyfile) {
      this.#set(`${nerfed}:certfile`, certfile, Locations.user)
      this.#set(`${nerfed}:keyfile`, keyfile, Locations.user)
      // cert/key may be used in conjunction with other credentials, thus no `else`
    }
    if (token) {
      this.#set(`${nerfed}:_authToken`, token, Locations.user)
      this.#delete(`${nerfed}:_password`, Locations.user)
      this.#delete(`${nerfed}:username`, Locations.user)
    } else if (username || password) {
      if (!username) {
        throw new Error('must include username')
      }
      if (!password) {
        throw new Error('must include password')
      }
      this.#delete(`${nerfed}:_authToken`, Locations.user)
      this.#set(`${nerfed}:username`, username, Locations.user)
      // note: not encrypted, no idea why we bothered to do this, but oh well
      // protects against shoulder-hacks if password is memorable, I guess?
      const encoded = Buffer.from(password, 'utf8').toString('base64')
      this.#set(`${nerfed}:_password`, encoded, Locations.user)
    } else if (!certfile || !keyfile) {
      throw new Error('No credentials to set.')
    }
  }

  // this has to be a bit more complicated to support legacy data of all forms
  #getByURI (uri) {
    const nerfed = nerfDart(uri)
    const def = nerfDart(this.#get('registry'))
    const creds = {}

    // email is handled differently, it used to always be nerfed and now it never should be
    // if it's set nerfed to the default registry, then we copy it to the unnerfed key
    // TODO: evaluate removing 'email' from the credentials object returned here
    const email = this.#get(`${nerfed}:email`) || this.#get('email')
    if (email) {
      if (nerfed === def) {
        this.#set('email', email)
      }
      creds.email = email
    }

    const certfileReg = this.#get(`${nerfed}:certfile`)
    const keyfileReg = this.#get(`${nerfed}:keyfile`)
    if (certfileReg && keyfileReg) {
      creds.certfile = certfileReg
      creds.keyfile = keyfileReg
      // cert/key may be used in conjunction with other credentials, thus no `return`
    }

    const tokenReg = this.#get(`${nerfed}:_authToken`)
    if (tokenReg) {
      creds.token = tokenReg
      return creds
    }

    const userReg = this.#get(`${nerfed}:username`)
    const passReg = this.#get(`${nerfed}:_password`)
    if (userReg && passReg) {
      creds.username = userReg
      creds.password = Buffer.from(passReg, 'base64').toString('utf8')
      const auth = `${creds.username}:${creds.password}`
      creds.auth = Buffer.from(auth, 'utf8').toString('base64')
      return creds
    }

    const authReg = this.#get(`${nerfed}:_auth`)
    if (authReg) {
      const authDecode = Buffer.from(authReg, 'base64').toString('utf8')
      const authSplit = authDecode.split(':')
      creds.username = authSplit.shift()
      creds.password = authSplit.join(':')
      creds.auth = authReg
      return creds
    }

    // at this point, nothing else is usable so just return what we do have
    return creds
  }

  // =============================================
  //
  // Utils/Misc
  //
  // =============================================
  #assertLoaded (val = true) {
    if (!!this.#loaded !== val) {
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

module.exports = {
  Config,
  Locations,
  ConfigData,
}
