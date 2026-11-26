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
    // npm-shim.js then runs npm, maybe another version of it, in this same
    // process, so leave process.env as that npm expects to find it.
    setEnvs: false,
  })
  await config.load()
  return config.globalPrefix
}
