const nopt = require('nopt').lib
const log = require('proc-log')
const envReplace = require('./env-replace')
const nerfDart = require('./nerf-dart')
const { typeDefs, Types, getType } = require('./type-defs')
const ini = require('ini')

const SYMBOLS = {
  set: Symbol('set'),
  delete: Symbol('delete'),
}

const typeDescription = type => {
  if (Array.isArray(type)) {
    return type.map(t => typeDescription(t))
  }
  const def = getType(type)
  return def ? def.description ?? def.typeDescription : type
}

class ConfigData extends Map {
  #type = null

  #data = null
  #source = null
  #valid = true

  #parent = null
  #deprecated = null
  #shorthands = null
  #types = null
  #env = null

  static get mutateSymbols () {
    return SYMBOLS
  }

  constructor (type, { parent, deprecated, shorthands, types, env }) {
    super()
    this.#type = type

    this.#parent = parent
    this.#deprecated = deprecated
    this.#shorthands = shorthands
    this.#types = types
    this.#env = env

    for (const key of Object.keys(SYMBOLS)) {
      this[key] = () => {
        throw new Error(`attempted to call \`${key}\` directly on ConfigData:${this.#type.where}`)
      }
    }
  }

  get where () {
    return this.#type.where
  }

  get source () {
    return this.#source
  }

  get data () {
    if (this.#data) {
      return this.#data
    }
    this.#data = Object.fromEntries([...this.entries()])
    return this.#data
  }

  toString () {
    return ini.stringify(this.data).trim()
  }

  [SYMBOLS.set] (key, value) {
    // XXX(npm9+) make this throw an error
    if (!this.#type.allowDeprecated && this.#deprecated[key]) {
      log.warn('config', key, this.#deprecated[key])
    }
    // this is now dirty, the next call to this.valid will have to check it
    this.#valid = false
    // data will also be regnerated
    this.#data = null
    return super.set(key, value)
  }

  [SYMBOLS.delete] (key) {
    this.#data = null
    return super.delete(key)
  }

  clear () {
    throw new Error(`attempted to call \`clear\` directly on ConfigData:${this.#type.where}`)
  }

  load (data, error, source = this.#type.defaultSource) {
    this.#data = null

    if (this.source) {
      throw new Error(`Double load ${this.where} ${this.source}`)
    }

    if (error) {
      if (error.code !== 'ENOENT') {
        log.verbose('config', `error loading ${this.where} config`, error)
      }
      return
    }

    const result = {}
    let cleanData = null

    if (Array.isArray(data)) {
      const { argv, ...parsedData } = nopt.nopt(data, {
        typeDefs,
        types: this.#types,
        shorthands: this.#shorthands,
        invalidHandler: (...args) => this.#invalidHandler(...args),
      })
      result.argv = argv
      cleanData = parsedData
    } else if (data) {
      if (typeof data === 'string') {
        data = ini.parse(data)
      }
      cleanData = {}
      for (const [k, v] of Object.entries(data)) {
        cleanData[envReplace(k, this.#env)] = typeof v === 'string' ? envReplace(v, this.#env) : v
      }
      this.#clean(cleanData)
    }

    if (cleanData) {
      // this.set reset #valid so we check the status before and reset
      // it after setting all the properties because we just validated
      // everything with nopt
      const isValid = this.#valid
      for (const [k, v] of Object.entries(cleanData)) {
        this[SYMBOLS.set](k, v)
      }
      this.#valid = isValid
      return result
    }

    this.#source = `(${source}, ignored)`
  }

  validate () {
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

  #clean (d) {
    nopt.clean(d, {
      typeDefs,
      types: this.#types,
      invalidHandler: (...args) => this.#invalidHandler(...args),
    })
  }

  #invalidHandler (k, val, type) {
    this.#valid = false

    if (Array.isArray(type)) {
      if (type.includes(Types.url)) {
        type = Types.url
      } else /* istanbul ignore next */ if (type.includes(Types.path)) {
        /* no actual configs matching this, but
          * path types SHOULD be handled this way, like URLs, for the
          * same reason */
        type = Types.path
      }
    }

    const typeDesc = [].concat(typeDescription(type))
    const oneOrMore = typeDesc.includes(Types.Array)
    const mustBe = typeDesc.filter(m => m !== Types.Array)

    const oneOf = mustBe.length === 1 && oneOrMore ? 'one or more'
      : mustBe.length > 1 && oneOrMore ? 'one or more of:'
      : mustBe.length > 1 ? 'one of:'
      : ''
    const desc = mustBe.length === 1 ? mustBe[0] : mustBe.filter(m => m !== Types.Array)
      .map(n => typeof n === 'string' ? n : JSON.stringify(n))
      .join(', ')

    log.warn('config',
      `invalid item \`${k}\`.`,
      `Must be ${oneOf}`.trim(),
      `${desc}. Received value of \`${val}\``
    )
  }
}

module.exports = ConfigData
