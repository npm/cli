const ConfigData = require('./config-data')

// this is in order from least -> most precedence
const ConfTypesList = [
  { where: 'default', source: 'default values', allowDeprecated: true },
  { where: 'builtin' },
  { where: 'global', validateAuth: true },
  { where: 'user', validateAuth: true },
  { where: 'project', validateAuth: true },
  { where: 'env', source: 'environment' },
  { where: 'cli', source: 'command line options' },
]

// an enum to export and use to make using `where` not rely on strings
const ConfTypes = ConfTypesList.reduce((acc, type) => {
  acc[type.where] = type.where
  return acc
}, {})

class ConfigDataTypes extends Map {
  #frozen = false

  #list = []
  #indexes = {}
  #revList = []
  #revIndexes = {}

  #flat = null
  #derived = {}
  #effects = {}
  #dirty = new Set()
  #flatten = null

  static get ConfTypes () {
    return ConfTypes
  }

  constructor ({ flatten, derived, effects, ...opts }) {
    super()

    this.#flatten = flatten
    this.#derived = derived
    this.#effects = effects

    for (const type of ConfTypesList) {
      const data = new ConfigData(type, { ...opts, parent: this })
      this.set(type.where, data)
      this.#indexes[type.where] = this.#list.push(type.where) - 1
      this.#revIndexes[type.where] = ConfTypesList.length - this.#revList.unshift(type.where)
    }

    this.#frozen = true

    // symbols for mutating config data are shared here so that no method is exposed
    // that can mutate a types config data execpt for these
    for (const [key, symbol] of Object.entries(ConfigData.mutateSymbols)) {
      this[`${key}Data`] = (...args) => this.#mutateData(symbol, ...args)
    }
  }

  get data () {
    if (this.#flat) {
      return this.#flat
    }
    process.emit('time', `config:flatten`)
    this.#flat = {}
    // walk from least priority to highest
    for (const { data } of this.values()) {
      //this.#flatten(data, this.#flat)
    }
    process.emit('timeEnd', `config:flatten`)
    // return Object.freeze(this.#flat)
    return this.#flat
  }

  get (where) {
    if (!this.has(where)) {
      throw new Error(`Cannot get invalid config type of \`${where}\``)
    }
    return super.get(where)
  }

  set (key, value) {
    if (this.#frozen) {
      throw new Error(`cannot change config types after init`)
    }
    return super.set(key, value)
  }

  delete () {
    throw new Error('cannot change config types after init')
  }

  clear () {
    throw new Error('cannot change config types after init')
  }

  // defaults -> cli
  * values (startWhere) {
    const index = startWhere ? this.#indexes[startWhere] : 0
    const locations = index ? this.#list.slice(index) : this.#list
    for (const where of locations) {
      yield this.get(where)
    }
  }

  // cli -> defaults
  * reverseValues (startWhere) {
    const index = startWhere ? this.#revIndexes[startWhere] : 0
    const locations = index ? this.#revList.slice(index) : this.#revList
    for (const where of locations) {
      yield this.get(where)
    }
  }

  find (key) {
    for (const config of this.reverseValues()) {
      if (config.has(key)) {
        return config.where
      }
    }
    return null
  }

  getData (where, key) {
    if (where === null) {
      for (const config of this.reverseValues()) {
        if (config.has(key)) {
          return config.get(key)
        }
      }
      return
    }

    return this.get(where).get(key)
  }

  #mutateData(symbol, where, key) {
    const effected = this.#effects(key)
    // the flat options are invalidated, regenerate next time they're needed
        this.#flat = null
        return this.get(where)[symbol](...args)
      }
  }
}

module.exports = ConfigDataTypes
