// Read a config value only when it was passed on the command line.
// Values from .npmrc, env, or defaults resolve to undefined, so the flag cannot be set as project policy.
const cliOnlyFlag = (config, key) =>
  config.find(key) === 'cli' ? config.get(key) : undefined

module.exports = cliOnlyFlag
