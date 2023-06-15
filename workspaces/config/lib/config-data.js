const nopt = require('nopt').lib
const log = require('proc-log')
const ini = require('ini')
const spawn = require('@npmcli/promise-spawn')
const fs = require('fs/promises')
const { dirname } = require('path')
const nerfDart = require('./nerf-dart')
const { typeDefs, Types } = require('./type-defs')
const { Locations, LocationOptions } = require('./definitions/locations')
const { definitions, internals, shorthands, types, changeKeys, aliases } = require('./definitions')
const tmpFile = require('./tmp-file')
const { replaceEnv } = require('./set-envs')
const { EOL } = require('os')

const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

const isNerfed = (s) => /^\/\//.test(s)
const isScopedRegistry = (s) => /^@[^:/]+:registry$/.test(s)

const SYMBOLS = {
  set: Symbol('set'),
  delete: Symbol('delete'),
  clear: Symbol('clear'),
  load: Symbol('load'),
}

class ConfigData {
  static mutateSymbols = SYMBOLS

  #getData = null
  #where = null
  #description = null
  #opts = null

  #noptOpts = null

  #data = {}
  #flatData = new Map()
  #cache = new Map()

  #file = null
  #source = null
  #valid = true
  #error = null

  constructor (where, { getData, data: initialData } = {}) {
    if (!hasOwn(LocationOptions, where)) {
      throw new Error(`Cannot create ConfigData with invalid location: ${where}`)
    }

    this.#getData = getData
    this.#where = where

    const { description, ...opts } = LocationOptions[where]
    this.#description = description
    this.#opts = {
      allowDeprecated: opts.allowDeprecated ?? false,
      throw: opts.throw ?? false,
      mode: opts.mode ?? 0o666,
      validateAuth: opts.validateAuth ?? false,
      removeUnknown: opts.removeUnknown ?? true,
    }

    this.#noptOpts = {
      typeDefs,
      shorthands,
      types: types[this.#where],
      typeDefault: this.#opts.removeUnknown ? Types.NotAllowed : undefined,
      invalidHandler: (...args) => this.#invalidHandler(...args),
    }

    if (initialData) {
      this.load(initialData)
    }
  }

  get where () {
    return this.#where
  }

  get file () {
    return this.#file
  }

  get data () {
    return this.#data
  }

  get flatData () {
    return this.#flatData
  }

  get source () {
    return this.#source
  }

  #internalKey (key) {
    return changeKeys[key] ?? key
  }

  get (key) {
    return this.#cache.get(this.#internalKey(key))
  }

  set (key, value) {
    this.#valid = false
    const res = this.#set(key, value)
    const d = { [key]: this.#data[key] }
    this.#clean(d)
    if (!hasOwn(d, key)) {
      this.#delete(key)
    }
    return res
  }

  #set (key, value) {
    // XXX(npm9+) make this throw an error
    const dep = definitions[key]?.deprecated
    if (!this.#opts.allowDeprecated && dep) {
      log.warn('config', key, dep)
    }

    const internalKey = this.#internalKey(key)
    if (this.#flatData.has(internalKey)) {
      this.#flatData.set(internalKey, value)
    } else {
      Object.defineProperty(this.#data, internalKey, {
        configurable: true,
        enumerable: true,
        get: () => this.get(key),
      })
    }

    return this.#cache.set(internalKey, value)
  }

  #setAll (data) {
    for (const [key, value] of Object.entries(data)) {
      this.#set(key, value)
    }
  }

  delete (key) {
    this.#valid = false
    this.#delete(key)
  }

  #delete (key) {
    delete this.#data[key]
    this.#flatData.delete(key)
    this.#cache.delete(key)
  }

  clear () {
    this.#valid = false
    this.#clear()
  }

  #clear () {
    this.#data = {}
    this.#flatData.clear()
    this.#cache.clear()
  }

  ignore (reason) {
    this.#assertLoaded(false)
    this.#source = `${this.#description}, ignored: ${reason}`
  }

  load (data, file, error) {
    this.#assertLoaded(false)

    this.#file = file
    this.#source = this.#description + (file ? `, file: ${file}` : '')

    if (error) {
      if (error.code !== 'ENOENT') {
        log.verbose('config', `error loading ${this.#where} config`, error)
      }
      this.#error = error
      return
    }

    if (!data) {
      throw new Error(`Cannot load config location without data: ${this.#where}`)
    }

    // an array comes from argv so we parse it in the standard nopt way
    if (Array.isArray(data)) {
      return this.#loadArray(data)
    }

    // if its a string then it came from a file and we need to parse it with ini
    // first
    if (typeof data === 'string') {
      return this.#loadString(data)
    }

    return this.#loadObject(data)
  }

  #loadArray (data) {
    this.#assertLoaded()
    const { argv, ...parsedData } = nopt.nopt(data, this.#noptOpts)
    this.#setAll(parsedData)
    return { argv, ...parsedData }
  }

  #loadString (str) {
    this.#assertLoaded()
    const data = ini.parse(str)

    // then do any env specific replacements
    const parsed = Object.entries(data).reduce((acc, [k, v]) => {
      const key = replaceEnv(process.env, k)
      const value = typeof v === 'string' ? replaceEnv(process.env, v) : v
      for (const alias of aliases[key]) {
        acc[alias] = value
      }
      acc[key] = value
      return acc
    }, {})

    return this.#loadObject(parsed)
  }

  #loadObject (data) {
    this.#assertLoaded()

    // and finally only do a nopt clean since it is already parsed
    this.#setAll(this.#clean(data))
  }

  #clean (d) {
    // invalid keys are deleted from this object
    nopt.clean(d, this.#noptOpts)
    return d
  }

  #invalidHandler (key, val, type, data) {
    const def = definitions[key] || internals[key]

    // TODO: move nerfdart auth stuff into a nested object that
    // is only passed along to paths that end up calling npm-registry-fetch.
    if (!def && isNerfed(key) || isScopedRegistry(key)) {
      // add back nerf darts and scoped registries to the data object
      // these are dynamic keys that will trigger the invalid handler.
      // they have never been validated before but if we want to start
      // validating them in the future we can do any additional checks here
      data[key] = val
      this.#flatData.set(key, val)
      return
    }

    this.#valid = false

    let msg = `${def ? 'invalid' : 'unknown'} item \`${key}\` set with \`${val}\`, `

    if (def) {
      msg += type === Types.NotAllowed
        ? `not allowed to be set on config layer \`${this.#where}\``
        : def.invalidUsage()
    } else {
      msg += `not allowed to be set`
    }

    if (this.#opts.throw) {
      throw new Error(msg)
    } else {
      log.warn('config', msg)
    }
  }

  async #writeFile (data) {
    data = data.trim().split('\n').join(EOL) + EOL
    await fs.mkdir(dirname(this.file), { recursive: true })
    await fs.writeFile(this.file, data, 'utf8')
    await fs.chmod(this.file, this.#opts.mode)
  }

  toString () {
    return ini.stringify(this.#data).trim()
  }

  async save (newFile) {
    this.#assertLoaded()

    if (!this.#file) {
      throw new Error(`Cannot save config since it was not loaded from a file: ` +
        `\`${this.#where}\` from \`${this.#description}\``)
    }

    if (this.#error) {
      // Dont save a file that had an error while loading
      return
    }

    if (newFile) {
      // allow saving a config file to a new location. used by reify-finish
      // to preserve builtin config when installing global npm
      this.#file = newFile
    }

    if (this.#where === Locations.user) {
      // if email is nerfed, then we want to de-nerf it
      const nerfed = nerfDart(this.get('registry'))
      const email = this.get(`${nerfed}:email`)
      if (email) {
        this.#delete(`${nerfed}:email`)
        this.#set('email', email)
      }
    }

    const data = this.toString()
    if (!data) {
      // ignore the unlink error (eg, if file doesn't exist)
      await fs.unlink(this.#file).catch(() => {})
      return
    }

    await this.#writeFile(data)
  }

  async edit ({ editor }) {
    this.#assertLoaded()

    if (!this.#file) {
      throw new Error(`Cannot edit config since it was not loaded from a file: ` +
        `\`${this.#where}\` from \`${this.#description}\``)
    }

    if (this.#error) {
      // Dont save a file that had an error while loading
      throw new Error(`Cannot edit config that had an error while loading: ` +
        `\`${this.#where}\` loaded with error: \`${this.#error}\``)
    }

    // save first, just to make sure it's synced up
    // this also removes all the comments from the last time we edited it.
    await this.save()

    // then get the temporary file data, write it and open an editor
    // for the user to edit it
    const data = await tmpFile({ file: this.#file, where: this.#where })
    await this.#writeFile(data)
    const [bin, ...args] = editor.split(/\s+/)
    try {
      await spawn(bin, [...args, this.#file], { stdio: 'inherit' })
    } catch (er) {
      throw new Error(`editor process exited with code: ${er.code}`)
    }
  }

  validate () {
    this.#assertLoaded()

    if (this.#valid) {
      return true
    }

    this.#clean(this.#data)

    if (this.#opts.validateAuth) {
      const problems = []
      // after validating everything else, we look for old auth configs we no longer support
      // if these keys are found, we build up a list of them and the appropriate action and
      // attach it as context on the thrown error

      // first, keys that should be removed
      for (const key of ['_authtoken', '-authtoken']) {
        if (this.get(key)) {
          problems.push({ action: 'delete', key })
        }
      }

      // keys that should be nerfed but currently are not
      for (const key of ['_auth', '_authToken', 'username', '_password']) {
        if (this.get(key)) {
        // username and _password must both exist in the same file to be recognized correctly
          if (key === 'username' && !this.get('_password')) {
            problems.push({ action: 'delete', key })
          } else if (key === '_password' && !this.get('username')) {
            problems.push({ action: 'delete', key })
          } else {
            // NOTE we pull registry without restricting to the current 'where' because we want to
            // suggest scoping things to the registry they would be applied to, which is the default
            // regardless of where it was defined
            const nerfedReg = nerfDart(this.#getData('registry'))
            problems.push({ action: 'rename', from: key, to: `${nerfedReg}:${key}` })
          }
        }
      }

      if (problems.length) {
        this.#valid = false
        return {
          problems: {
            auth: problems.map((p) => {
              p.where = this.#where
              return p
            }),
          },
        }
      }
    }

    return this.#valid
  }

  #assertLoaded (val = true) {
    if (!!this.#source !== val) {
      throw new Error(`config data ${this.#where} ${val ? 'must' : 'must not'} ` +
        `be loaded to perform this action`)
    }
  }
}

module.exports = ConfigData
