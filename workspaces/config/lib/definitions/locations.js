// this is in order from least -> most precedence
const LocationOptions = {
  default: { description: `npm's default values`, allowDeprecated: true, throw: true },
  builtin: { description: `npm's builtin npmrc file` },
  global: { description: 'global .npmrc file', validateAuth: true },
  user: { description: 'user .npmrc file', validateAuth: true, mode: 0o600 },
  project: { description: 'project .npmrc file', validateAuth: true },
  env: { description: 'environment variables' },
  cli: { description: 'command line options', default: true },
  publish: { description: 'publish config' },
  internal: { description: 'npm internal config values', throw: true },
}

const LocationNames = Object.keys(LocationOptions)

// an enum to export and use to make using `where` not rely on strings
const Locations = LocationNames.reduce((acc, location) => {
  acc[location] = location
  if (location.default) {
    acc.default = location
  }
  return acc
}, {})

module.exports = {
  LocationNames,
  LocationOptions,
  Locations,
}
