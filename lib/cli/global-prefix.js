// Finds the global prefix the way npm does, without loading the rest of npm.
// The Windows shims use it (through bin/npm-shim.js and bin/npm-prefix.js) to
// run the npm installed in the global prefix, if there is one, instead of the
// npm that came with Node.js.

const { resolve } = require('node:path')
const Config = require('@npmcli/config')
const { definitions, flatten, shorthands } = require('@npmcli/config/lib/definitions')

module.exports = async () => {
  const config = new Config({
    npmPath: resolve(__dirname, '../..'),
    // argv is explicitly not looked at since prefix is not something that can be changed via argv
    argv: [],
    definitions,
    flatten,
    shorthands,
    excludeNpmCwd: false,
  })
  // load() exports npm_config_* variables to process.env, and npm-shim.js then
  // runs npm, maybe another version of it, in this same process, so put the
  // environment back. A copy of process.env would not do: on Windows it would
  // lose case-insensitive lookups, e.g. for ${AppData} in an npmrc.
  const env = { ...process.env }
  try {
    await config.load()
  } finally {
    for (const key of Object.keys(process.env)) {
      if (!Object.hasOwn(env, key)) {
        delete process.env[key]
      }
    }
    Object.assign(process.env, env)
  }
  return config.globalPrefix
}
