const { Definition, Derived } = require('./definition')
const definitions = require('./definitions')
const derivations = require('./derived')
const values = require('./values')
const shorthands = require('./shorthands')
const typeDefs = require('./type-defs')
const { LocationEntries, Locations } = require('./locations')

module.exports = {
  // definition instances and their keys
  definitions: {},
  definitionKeys: [],
  // type data and default values collected
  // from definitions since we need this info often
  // in object form
  defaults: {},
  types: {},
  // values
  values: {},
  valueKeys: [],
  // shorthands
  shorthands: shorthands,
  shortKeys: Object.keys(shorthands),
  // derived instances and their keys
  derived: {},
  derivedKeys: [],
  LocationEntries,
  Locations,
  ...typeDefs,
}

const define = (key, data) => {
  const def = new Definition(key, data)

  for (const derivedKey of def.derived) {
    if (derivations[derivedKey]) {
      throw new Error(`Config item ${key} cannot flatten to an existing derived config ` +
        `${derivedKey}. Instead the derived config should list ${key} in its sources.`)
    }
  }

  module.exports.definitions[key] = def
  module.exports.definitionKeys.push(key)

  module.exports.defaults[key] = def.default

  for (const [where] of LocationEntries) {
    // a type is allowed for each location if the definition didnt specify any
    // locations, or if the location is default or if this is one of the definitions
    // valid locations. anything else gets set to a special type that will not allow
    // any value
    const allowed =
      !def.location.length ||
      def.location.includes(where) ||
      [Locations.default, Locations.builtin].includes(where)
    module.exports.types[where][key] = allowed ? def.type : [typeDefs.Types.NotAllowed]
  }

  for (const s of def.short) {
    module.exports.shorthands[s] = [`--${key}`]
    module.exports.shortKeys.push(s)
  }
}

const derive = (keys, get, sources) => {
  const keysArr = [].concat(keys)
  const defSources = keysArr.filter((k) => module.exports.definitions[k])

  const opts = {
    nested: Array.isArray(keys) && keys.length > 1,
    sources,
    defSources,
    ...(typeof get === 'object' ? get : { get }),
  }

  for (const key of keysArr) {
    const derived = new Derived(key, opts)

    module.exports.derived[key] = derived
    module.exports.derivedKeys.push(key)

    for (const source of derived.sources) {
      const definition = module.exports.definitions[source]
      if (!definition && !module.exports.values[source] && source !== key) {
        throw new Error(`Derived key ${key} depends on missing definition: ${source}`)
      } else if (definition) {
        definition.addDerived(key)
      }
    }
  }
}

const value = (key, v) => {
  module.exports.values[key] = v
  module.exports.valueKeys.push(key)
}

const main = () => {
  for (const [where] of LocationEntries) {
    module.exports.types[where] = {}
  }

  for (const [key, def] of Object.entries(definitions)) {
    define(key, def)
  }

  // Everything needs to be added before derived values are created
  Object.freeze(module.exports.definitions)
  Object.freeze(module.exports.definitionKeys)
  Object.freeze(module.exports.defaults)
  Object.freeze(module.exports.types)
  Object.freeze(module.exports.shorthands)
  Object.freeze(module.exports.shortKeys)

  for (const [key, v] of Object.entries(values)) {
    value(key, v)
  }

  Object.freeze(module.exports.values)
  Object.freeze(module.exports.valueKeys)

  for (const [key, derived] of derivations.entries()) {
    derive(key, ...derived)
  }

  for (const key of module.exports.definitionKeys) {
    const definition = module.exports.definitions[key]
    for (const derivedKey of definition.derived) {
      if (!module.exports.derived[derivedKey]) {
        derive(derivedKey, { key })
      }
    }
  }

  Object.freeze(module.exports.derived)
  Object.freeze(module.exports.derivedKeys)
}

main()
