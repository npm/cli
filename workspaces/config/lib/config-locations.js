const ConfigData = require('./config-data')
const { camelCase } = require('./definitions/definition')
const {
  definitions,
  definitionKeys,
  derived,
  derivedKeys,
  valueKeys,
} = require('./definitions')

// TODO: flatten based on key
// if (/@.*:registry$/i.test(key) || /^\/\//.test(key)) {
//   flat[key] = val
// }

// this is in order from least -> most precedence
const LocationsList = Object.entries({
  default: { description: `npm's default values`, allowDeprecated: true },
  builtin: { description: `npm's builtin npmrc file` },
  global: { description: 'global .npmrc file', validateAuth: true },
  user: { description: 'user .npmrc file', validateAuth: true, mode: 0o600 },
  project: { description: 'project .npmrc file', validateAuth: true },
  env: { description: 'environment variables' },
  cli: { description: 'command line options' },
})

// an enum to export and use to make using `where` not rely on strings
const Locations = LocationsList.reduce((acc, [location]) => {
  acc[location] = location
  return acc
}, {})

class ConfigLocations extends Map {
  static Locations = Locations

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
      this.#createBaseDescriptor(key)
    }

    for (const key of derivedKeys) {
      this.#createDerivedDescriptor(key)
    }

    for (const [where, conf] of LocationsList) {
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
  * reverseValues (startWhere) {
    const index = startWhere ? this.#revList.length - 1 - this.#indexes[startWhere] : 0
    const locations = index ? this.#revList.slice(index) : this.#revList
    for (const where of locations) {
      yield this.get(where)
    }
  }

  find (where, key) {
    for (const config of this.reverseValues(where)) {
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

  hasData (where, key) {
    if (where === null) {
      for (const config of this.reverseValues()) {
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
    const definition = definitions[key]
    if (definition) {
      for (const s of definition.derived) {
        this.#derived.delete(s)
      }
    }
  }

  // TODO: move nerfdart auth stuff into a nested object that
  // is only passed along to paths that end up calling npm-registry-fetch.
  #createBaseDescriptor (k) {
    const descriptor = {
      configurable: true,
      enumerable: true,
      get: () => {
        if (this.#base.has(k)) {
          return this.#base.get(k)
        }
        const value = this.getData(null, k)
        this.#base.set(k, value)
        return value
      },
    }
    Object.defineProperty(this.#baseData, k, descriptor)
    Object.defineProperty(this.#baseData, camelCase(k), descriptor)
  }

  #createDerivedDescriptor (k) {
    const derive = derived[k]
    Object.defineProperty(this.#data, camelCase(k), {
      configurable: true,
      enumerable: true,
      get: () => {
        if (this.#derived.has(k)) {
          return this.#derived.get(k)
        }
        const value = derive.set(this.#baseData, this.#config)
        this.#derived.set(k, value)
        return value
      },
    })
  }
}

module.exports = ConfigLocations
