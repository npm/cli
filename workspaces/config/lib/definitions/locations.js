// this is in order from least -> most precedence
const LocationEntries = Object.entries({
  default: { description: `npm's default values`, allowDeprecated: true, throw: true },
  builtin: { description: `npm's builtin npmrc file` },
  global: { description: 'global .npmrc file', validateAuth: true },
  user: { description: 'user .npmrc file', validateAuth: true, mode: 0o600 },
  project: { description: 'project .npmrc file', validateAuth: true },
  env: { description: 'environment variables' },
  cli: { description: 'command line options' },
})

// an enum to export and use to make using `where` not rely on strings
const Locations = LocationEntries.reduce((acc, [location]) => {
  acc[location] = location
  acc[location.charAt(0).toUpperCase() + location.slice(1)] = location
  acc[location.toUpperCase()] = location
  return acc
}, {})

module.exports = {
  LocationEntries,
  Locations,
}
