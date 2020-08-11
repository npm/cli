// Set environment variables for any non-default configs,
// so that they're already there when we run lifecycle scripts.
//
// See https://github.com/npm/rfcs/pull/90

// Return the env key if this is a thing that belongs in the env.
// Ie, if the key isn't a @scope, //nerf.dart, or _private,
// and the value is a string or array.  Otherwise return false.
const envKey = (key, val) => {
  return !/^[/@_]/.test(key) &&
    (typeof envVal(val) === 'string') &&
      `npm_config_${key.replace(/-/g, '_').toLowerCase()}`
}

const envVal = val => Array.isArray(val) ? val.map(v => envVal(v)).join('\n\n')
  : val === null || val === undefined || val === false ? ''
  : typeof val === 'object' ? null
  : String(val)

const sameConfigValue = (def, val) =>
  !Array.isArray(val) || !Array.isArray(def) ? def === val
  : sameArrayValue(def, val)

const sameArrayValue = (def, val) => {
  if (def.length !== val.length) {
    return false
  }
  for (let i = 0; i < def.length; i++) {
    if (def[i] !== val[i]) {
      return false
    }
  }
  return true
}

const setEnv = (rawKey, rawVal) => {
  const val = envVal(rawVal)
  const key = envKey(rawKey, val)
  if (key)
    process.env[key] = val
}

const setEnvs = npm => {
  // This ensures that all npm config values that are not the defaults are
  // shared appropriately with child processes, without false positives.
  //
  // if the key is the default value,
  //   if the environ is NOT the default value,
  //     set the environ
  //   else skip it, it's fine
  // if the key is NOT the default value,
  //   if the env is setting it, then leave it (already set)
  //   otherwise, set the env
  console.error(npm.config.list)
  const { config: { list: [cli, env] } } = npm
  const cliSet = new Set(Object.keys(cli))
  const envSet = new Set(Object.keys(env))
  const { defaults } = require('./defaults.js')
  // the configs form a prototype chain, so we can for/in over cli to
  // see all the current values, and hasOwnProperty to see if it's
  // set therre.
  for (const key in cli) {
    if (sameConfigValue(defaults[key], cli[key])) {
      if (!sameConfigValue(defaults[key], env[key])) {
        // getting set back to the default in the cli config
        setEnv(key, cli[key])
      }
    } else {
      // config is not the default
      if (!(envSet.has(key) && !cliSet.has(key))) {
        // was not set in the env, so we have to put it there
        setEnv(key, cli[key])
      }
    }
  }

  // also set some other common ones.
  process.env.npm_execpath = require.main.filename
  process.env.npm_node_execpath = process.execPath
  process.env.npm_command = npm.command

  // note: this doesn't afect the *current* node process, of course, since
  // it's already started, but it does affect the options passed to scripts.
  if (configs['node-options']) {
    process.env.NODE_OPTIONS = configs['node-options']
  }
}

module.exports = setEnvs
