const { Types } = require('../type-defs')
const { LocationNames } = require('./locations')
const Graph = require('./graph')
const {
  displayKeys,
  changeKeys,
  definitions,
  definitionKeys,
  internals,
  internalKeys,
  derived,
  derivedKeys,
} = require('./definitions')

const graph = new Graph()
const shorthands = {}
const shorthandKeys = []
const defaults = { '@hello:registry': 'https://corp.npm.com', '//hello': 'itsme' }
const internalDefaults = {}
const types = LocationNames.reduce((acc, n) => {
  acc[n] = {}
  return acc
}, { })

const setTypes = (def, defaultsObj) => {
  const { displayKey: key } = def

  defaultsObj[key] = def.default

  for (const where of LocationNames) {
    // a type is allowed for each location if the definition didnt specify any
    // locations, or if the location is default or if this is one of the definitions
    // valid locations. anything else gets set to a special type that will not allow
    // any value
    types[where][key] = def.isAllowed(where) ? def.type : Types.NotAllowed
  }
}

for (const key of definitionKeys) {
  const def = definitions[key]
  setTypes(def, defaults)
  for (const [k, v] of def.shorthands) {
    shorthands[k] = v
    shorthandKeys.push(k)
  }
  graph.addDefinition(def)
}

for (const key of internalKeys) {
  const def = internals[key]
  setTypes(def, internalDefaults)
  graph.addDefinition(def)
}

for (const key of derivedKeys) {
  graph.addDefinition(derived[key])
}

graph.build()

for (const key of graph.vertices) {
  graph.definition(key).setDependencies(graph.walkFrom(key))
}

module.exports = {
  definitions,
  definitionKeys,
  internals,
  internalKeys,
  derived,
  derivedKeys,
  sortedKeys: [...graph.sorted],
  changeKeys,
  displayKeys,
  // These are the configs that we can nerf-dart. Not all of them currently even
  // *have* config definitions so we have to explicitly validate them here
  nerfDarts: [
    '_auth',
    '_authToken',
    'username',
    '_password',
    'email',
    'certfile',
    'keyfile',
  ],
  // shorthands
  shorthands,
  shorthandKeys,
  // type data and default values collected from definitions since we need this
  // info often in object form
  defaults,
  internalDefaults,
  types,
}
