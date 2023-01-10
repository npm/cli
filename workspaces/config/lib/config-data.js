const nopt = require('nopt').lib
const log = require('proc-log')
const ini = require('ini')
const fs = require('fs/promises')
const { dirname } = require('path')
const nerfDart = require('./nerf-dart')
const { typeDefs } = require('./type-defs')
const { definitions, shorthands, types } = require('./definitions')

const SYMBOLS = {
  set: Symbol('set'),
  delete: Symbol('delete'),
  clear: Symbol('clear'),
}

class ConfigData extends Map {
  static mutateSymbols = SYMBOLS

  #parent = null
  #where = null
  #description = null
  #type = null

  #envReplace = null

  #data = {}
  #file = null
  #loaded = null
  #valid = true
  #error = null

  constructor (type, { parent, data, envReplace }) {
    super()

    this.#parent = parent

    const { where, description = where, ...opts } = typeof type === 'string'
      ? { where: type } : type

    this.#where = where
    this.#description = description
    this.#type = opts
    this.#envReplace = envReplace

    for (const key of Object.keys(SYMBOLS)) {
      this[key] = () => {
        throw new Error(`Cannot call \`${key}\` directly on ConfigData:${this.where}`)
      }
    }

    if (data) {
      this.load(data)
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

  toString () {
    return ini.stringify(this.data).trim()
  }

  #assertLoaded (val = true) {
    if (!!this.#loaded !== val) {
      throw new Error(`config data ${this.where} ${val ? 'must' : 'must not'} ` +
        `be loaded to perform this action`)
    }
  }

  [SYMBOLS.set] (key, value) {
    this.#valid = false
    return this.#set(key, value)
  }

  [SYMBOLS.delete] (key) {
    this.#valid = false
    return this.#delete(key)
  }

  #set (key, value) {
    // XXX(npm9+) make this throw an error
    const dep = definitions[key]?.deprecated
    if (!this.#type.allowDeprecated && dep) {
      log.warn('config', key, dep)
    }
    Object.defineProperty(this.#data, key, {
      configurable: true,
      enumerable: true,
      get () {
        return value
      },
    })
    return super.set(key, value)
  }

  #delete (key) {
    delete this.#data[key]
    return super.delete(key)
  }

  ignore (reason) {
    this.#assertLoaded(false)
    this.#loaded = `${this.description}, ignored: ${reason}`
  }

  load (data, error, file) {
    this.#assertLoaded(false)

    this.#file = file
    this.#loaded = this.description + (file ? `, file: ${file}` : '')

    if (error) {
      if (error.code !== 'ENOENT') {
        log.verbose('config', `error loading ${this.where} config`, error)
      }
      this.#error = error
      return
    }

    if (!data) {
      throw new Error(`Cannot load config location without data: ${this.where}`)
    }

    // an array comes from argv so we parse it in the standard nopt way
    if (Array.isArray(data)) {
      return this.loadArray(data)
    }

    // if its a string then it came from a file and we need to parse it with ini
    // first
    return this.loadObject(typeof data === 'string' ? ini.parse(data) : data)
  }

  loadArray (data) {
    this.#assertLoaded()
    const { argv, ...parsedData } = nopt.nopt(data, {
      typeDefs,
      shorthands,
      types,
      invalidHandler: (...args) => this.#invalidHandler(...args),
    })
    this.#setAll(parsedData)
    return argv
  }

  loadObject (data) {
    this.#assertLoaded()
    // then do any env specific replacements
    const parsed = Object.entries(data).reduce((acc, [k, v]) => {
      acc[this.#envReplace(k)] = typeof v === 'string' ? this.#envReplace(v) : v
      return acc
    }, {})

    // and finally only do a nopt clean since it is already parsed
    this.#setAll(this.#clean(parsed))
  }

  #setAll (data) {
    for (const [key, value] of Object.entries(data)) {
      this.#set(key, value)
    }
  }

  #clean (d) {
    nopt.clean(d, {
      typeDefs,
      types,
      invalidHandler: (...args) => this.#invalidHandler(...args),
    })
    return d
  }

  #invalidHandler (key, val) {
    console.log(key, val, this.where)
    this.#valid = false
    const def = definitions[key]
    const msg = def
      ? `invalid item \`${key}\`, ${definitions[key].mustBe()} and got \`${val}\``
      : `unknown item \`${key}\``
    log.warn('config', msg)
  }

  async save (newFile) {
    this.#assertLoaded()

    if (!this.file) {
      throw new Error(`Cannot save config since it was not loaded from a file: ` +
        `\`${this.where}\` from \`${this.#description}\``)
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

    const { user } = this.#parent.constructor.Locations
    if (this.where === user) {
      // if email is nerfed, then we want to de-nerf it
      const nerfed = nerfDart(this.get('registry'))
      const email = this.get(`${nerfed}:email`, user)
      if (email) {
        this.delete(`${nerfed}:email`, user)
        this.set('email', email, user)
      }
    }

    const data = this.toString()
    if (!data) {
      // ignore the unlink error (eg, if file doesn't exist)
      await fs.unlink(this.file).catch(() => {})
      return
    }

    await fs.mkdir(dirname(this.file), { recursive: true })
    await fs.writeFile(this.file, data + '\n', 'utf8')
    await fs.chmod(this.file, this.#type.mode || 0o666)
  }

  validate () {
    this.#assertLoaded()

    if (this.#valid) {
      return true
    }

    this.#clean(this.data)

    if (this.#type.validateAuth) {
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

      // NOTE we pull registry without restricting to the current 'where' because we want to
      // suggest scoping things to the registry they would be applied to, which is the default
      // regardless of where it was defined
      const nerfedReg = nerfDart(this.#parent.getData('registry'))

      // keys that should be nerfed but currently are not
      for (const key of ['_auth', '_authToken', 'username', '_password']) {
        if (this.get(key)) {
        // username and _password must both exist in the same file to be recognized correctly
          if (key === 'username' && !this.get('_password')) {
            problems.push({ action: 'delete', key })
          } else if (key === '_password' && !this.get('username')) {
            problems.push({ action: 'delete', key })
          } else {
            problems.push({ action: 'rename', from: key, to: `${nerfedReg}:${key}` })
          }
        }
      }

      if (problems.length) {
        this.#valid = false
        return {
          problems: {
            auth: problems.map((p) => {
              p.where = this.#type.where
              return p
            }),
          },
        }
      }
    }

    return this.#valid
  }
}

module.exports = ConfigData
