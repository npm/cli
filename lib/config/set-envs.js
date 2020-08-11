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
    /* istanbul ignore next - there are no array configs where the default
     * is not an empty array, so this loop is a no-op, but it's the correct
     * thing to do if we ever DO add a config like that. */
    if (def[i] !== val[i]) {
      return false
    }
  }
  return true
}

const setEnv = (env, rawKey, rawVal) => {
  const val = envVal(rawVal)
  const key = envKey(rawKey, val)
  if (key && val !== null) {
    env[key] = val
  }
}

const setEnvs = (npm, env = process.env) => {
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
  const { config: { list: [cliConf, envConf] } } = npm
  const cliSet = new Set(Object.keys(cliConf))
  const envSet = new Set(Object.keys(envConf))
  const { defaults } = require('./defaults.js')
  // the configs form a prototype chain, so we can for/in over cli to
  // see all the current values, and hasOwnProperty to see if it's
  // set therre.
  for (const key in cliConf) {
    if (sameConfigValue(defaults[key], cliConf[key])) {
      if (!sameConfigValue(defaults[key], envConf[key])) {
        // getting set back to the default in the cli config
        setEnv(env, key, cliConf[key])
      }
    } else {
      // config is not the default
      if (!(envSet.has(key) && !cliSet.has(key))) {
        // was not set in the env, so we have to put it there
        setEnv(env, key, cliConf[key])
      }
    }
  }

  // also set some other common ones.
  env.npm_execpath = require.main.filename
  env.npm_node_execpath = process.execPath
  env.npm_command = npm.command

  // note: this doesn't afect the *current* node process, of course, since
  // it's already started, but it does affect the options passed to scripts.
  if (cliConf['node-options']) {
    env.NODE_OPTIONS = cliConf['node-options']
  }
}

module.exports = setEnvs
