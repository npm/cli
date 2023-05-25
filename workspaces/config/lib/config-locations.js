const ConfigData = require('./config-data')
const { getFlatKey } = require('./definitions/definition')
const { LocationNames, Locations } = require('./definitions/locations')
const {
  definitions,
  derived,
  internals,
  sortedKeys,
  defaults,
  internalDefaults,
} = require('./definitions')

const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

class ConfigLocations {
  static Locations = Locations

  #locations = new Map()

  #list = []
  #revList = []
  #indexes = {}

  #flatData = {}
  #cacheData = {}
  #cache = new Map()
  #definitions = new Map()

  constructor () {
    for (const where of LocationNames) {
      let data
      if (where === Locations.default) {
        data = defaults
      } else if (where === Locations.internal) {
        data = internalDefaults
      }
      this.#addLocation(where, data)
    }

    for (const key of sortedKeys) {
      const def = derived[key] ?? internals[key] ?? definitions[key]
      this.#definitions.set(key, def)
      const getValue = () => {
        if (this.#cache.has(def)) {
          return this.#cache.get(def)
        }
        const result = def.isDerived
          ? def.getValue(this.#cacheData)
          : def.getValue(this.#getRaw(def.key), this.#cacheData)
        this.#cache.set(def, result)
        return result
      }
      this.#defineData(key, getValue, this.#cacheData)
      for (const flatKey of def.flatten) {
        this.#defineData(flatKey.split('.'), getValue, this.#flatData)
      }
    }
  }

  get data () {
    return this.#flatData
  }

  load (where, ...args) {
    return this.#getLocation(where)[ConfigData.mutateSymbols.load](...args)
  }

  find (key) {
    for (const config of this.#reverseLocations(key)) {
      return config.where
    }
    return null
  }

  has (key, where) {
    if (where) {
      return this.#getLocation(where).has(key)
    }
    for (const _ of this.#reverseLocations(key)) {
      return true
    }
    return false
  }

  get (key) {
    if (this.#definitions.has(key)) {
      return this.#getData(key.split('.'))
    }
  }

  set (key, val, where = Locations.default) {
    this.#mutateData(key)
    return this.#getLocation(where)[ConfigData.mutateSymbols.set](key, val)
  }

  delete (key, where = Locations.default) {
    this.#mutateData(key)
    return this.#getLocation(where)[ConfigData.mutateSymbols.delete](key)
  }

  #getRaw (key, where) {
    if (where) {
      return this.#getLocation(where).get(key)
    }
    for (const config of this.#reverseLocations(key)) {
      return config.get(key)
    }
  }

  #getData (keys, obj = this.#flatData) {
    if (keys.length === 1 || typeof keys === 'string') {
      const key = Array.isArray(keys) ? keys[0] : keys
      return obj[getFlatKey(key)]
    }
    const next = getFlatKey(keys.shift())
    return this.#getData(keys, obj[next])
  }

  #defineData (keys, getValue, obj) {
    if (keys.length === 1 || typeof keys === 'string') {
      const key = Array.isArray(keys) ? keys[0] : keys
      return Object.defineProperty(obj, getFlatKey(key), {
        configurable: false,
        enumerable: true,
        get: getValue,
      })
    }
    const next = getFlatKey(keys.shift())
    if (!hasOwn(obj, next)) {
      Object.defineProperty(obj, next, {
        configurable: false,
        enumerable: true,
        value: {},
      })
    }
    return this.#defineData(keys, getValue, obj[next])
  }

  #getLocation (where) {
    if (!this.#locations.has(where)) {
      throw new Error(`Cannot get invalid config location of \`${where}\``)
    }
    return this.#locations.get(where)
  }

  #addLocation (location, configData) {
    const data = new ConfigData(location, {
      getData: (k) => this.get(k),
      data: configData,
    })

    this.#indexes[data.where] = this.#list.push(data.where) - 1
    this.#revList.unshift(data.where)
    this.#locations.set(data.where, data)

    // TODO: for later, figure out how to invalidate and cache these
    for (const [k, v] of data.flatData.entries()) {
      this.#defineData([k], () => v, this.#flatData)
    }
  }

  #mutateData (key) {
    const def = this.#definitions.get(key)
    this.#cache.delete(def)
    for (const d of def.dependencies) {
      this.#cache.delete(this.#definitions.get(d))
    }
  }

  // internal -> defaults
  * #reverseLocations (key = null) {
    for (const where of this.#revList) {
      const c = this.#getLocation(where)
      if (key === null || c.has(key)) {
        yield c
      }
    }
  }
}

module.exports = ConfigLocations
