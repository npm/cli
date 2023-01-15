const ConfigData = require('./config-data')
const { getFlatKey } = require('./definitions/definition')
const {
  definitions,
  definitionKeys,
  derived,
  derivedKeys,
  valueKeys,
  values,
  LocationEntries,
} = require('./definitions')

// TODO: flatten based on key match
// if (/@.*:registry$/i.test(key) || /^\/\//.test(key)) {
//   flat[key] = val
// }

const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

const cacheDescriptor = ({ key, cache }, getValue) => ({
  configurable: false,
  enumerable: true,
  get: () => {
    if (cache.has(key)) {
      return cache.get(key)
    }
    const value = getValue()
    cache.set(key, value)
    return value
  },
})

const defineBaseAndFlat = (obj, key, descriptor) => {
  Object.defineProperty(obj, key, descriptor)
  const flatKey = getFlatKey(key)
  if (key !== flatKey) {
    Object.defineProperty(obj, flatKey, descriptor)
  }
}

class ConfigLocations extends Map {
  #envReplace = null
  #config = null

  #list = []
  #revList = []
  #indexes = {}

  #data = {}
  #baseData = {}

  #base = new Map()
  #derived = new Map()

  constructor ({ envReplace, config }) {
    super()

    this.#envReplace = envReplace
    this.#config = config

    for (const key of definitionKeys) {
      this.#createBaseDescriptor(key)
    }

    for (const key of valueKeys) {
      this.#createValueDescriptor(key)
    }

    for (const key of derivedKeys) {
      this.#createDerivedDescriptor(key)
    }

    for (const [where, conf] of LocationEntries) {
      this.add({ ...conf, where }, conf.data)
    }

    // symbols for mutating config data are shared here so that no method is exposed
    // that can mutate a location's config data execpt for these
    for (const key of Object.keys(ConfigData.mutateSymbols)) {
      this[key] = () => {
        throw new Error(`Cannot call ${key} on config locations`)
      }
    }
  }

  get data () {
    return this.#data
  }

  get (where) {
    if (!this.has(where)) {
      throw new Error(`Cannot get invalid config location of \`${where}\``)
    }
    return super.get(where)
  }

  add (location, configData) {
    const data = new ConfigData(location, {
      parent: this,
      data: configData,
      envReplace: this.#envReplace,
    })

    this.#indexes[data.where] = this.#list.push(data.where) - 1
    this.#revList.unshift(data.where)
    super.set(data.where, data)

    return data
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
  * #reverseValues (startWhere) {
    const index = startWhere ? this.#revList.length - 1 - this.#indexes[startWhere] : 0
    const locations = index ? this.#revList.slice(index) : this.#revList
    for (const where of locations) {
      yield this.get(where)
    }
  }

  find (where, key) {
    for (const config of this.#reverseValues(where)) {
      if (config.has(key)) {
        return config.where
      }
    }
    return null
  }

  getData (where, key) {
    if (where === null) {
      const [found, value] = this.#getDerivedData(key)
      if (found) {
        return value
      }
    }
    return this.#getBaseData(where, key)
  }

  #getBaseData (where, key) {
    if (where === null) {
      for (const config of this.#reverseValues()) {
        if (config.has(key)) {
          return config.get(key)
        }
      }
      return
    }
    return this.get(where).get(key)
  }

  #getDerivedData (k, data = this.#data) {
    const key = getFlatKey(k)
    const split = key.indexOf('.')
    if (split !== -1) {
      return this.#getDerivedData(key.slice(split + 1), data[key.slice(0, split)])
    }
    return hasOwn(data, key) ? [true, data[key]] : [false]
  }

  hasData (where, key) {
    if (where === null) {
      for (const config of this.#reverseValues()) {
        if (config.has(key)) {
          return true
        }
      }
      return false
    }
    return this.get(where).has(key)
  }

  setData (where, key, val) {
    this.#mutateData(key)
    return this.get(where)[ConfigData.mutateSymbols.set](key, val)
  }

  deleteData (where, key) {
    this.#mutateData(key)
    return this.get(where)[ConfigData.mutateSymbols.delete](key)
  }

  #mutateData (key) {
    this.#base.delete(key)
    this.#derived.delete(key)
    const definition = definitions[key]
    for (const s of definition?.derived || []) {
      this.#derived.delete(s)
    }
  }

  // TODO: move nerfdart auth stuff into a nested object that
  // is only passed along to paths that end up calling npm-registry-fetch.
  #createBaseDescriptor (key, data = this.#baseData) {
    defineBaseAndFlat(data, key, cacheDescriptor(
      { key, cache: this.#base },
      () => this.#getBaseData(null, key)
    ))
  }

  #createValueDescriptor (key) {
    Object.defineProperty(this.#data, getFlatKey(key), {
      configurable: false,
      enumerable: true,
      value: values[key],
    })
  }

  #createDerivedDescriptor (key, data = this.#data) {
    const split = key.indexOf('.')
    if (split !== -1) {
      const [parentKey, childKey] = [key.slice(0, split), key.slice(split + 1)]
      if (!hasOwn(data, parentKey)) {
        defineBaseAndFlat(data, parentKey, {
          configurable: false,
          enumerable: true,
          value: {},
        })
      }
      return this.#createBaseDescriptor(childKey, data[parentKey])
    }

    const derive = derived[key]
    Object.defineProperty(data, derive.flatKey, cacheDescriptor(
      { key, cache: this.#derived },
      () => derive.get(this.#baseData, this.#config)
    ))
  }
}

module.exports = ConfigLocations
