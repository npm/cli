// this is in order from least -> most precedence
const LOCATIONS = [
  ['Default', { description: `npm's default values`, allowDeprecated: true, throw: true }],
  ['Builtin', { description: `npm's builtin npmrc file` }],
  ['Global', { description: 'global .npmrc file', validateAuth: true }],
  ['User', { description: 'user .npmrc file', validateAuth: true, mode: 0o600 }],
  ['Project', { description: 'project .npmrc file', validateAuth: true }],
  ['Env', { description: 'environment variables' }],
  ['Cli', { description: 'command line options' }],
  ['Publish', { description: 'publish config' }],
  ['Internal', { description: 'npm internal config values', throw: true }],
]

module.exports = {
  LocationNames: [],
  Locations: {}, // an enum to export and use to make using `where` not rely on strings
  LocationOptions: {},
}

for (const [name, options] of LOCATIONS) {
  const symbol = Symbol(name)

  options.name = name
  options.symbol = symbol

  module.exports.LocationNames.push(symbol)
  module.exports.Locations[name] = symbol
  module.exports.LocationOptions[symbol] = options
}
