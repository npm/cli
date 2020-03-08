// Set environment variables for any non-default configs,
// so that they're already there when we run lifecycle scripts.
//
// See https://github.com/npm/rfcs/pull/90

const envName = name => `npm_config_${name.replace(/-/g, '_')}`

const envKey = (key, val) => {
  return !/^[\/@_]/.test(key) &&
    (typeof val === 'string' || Array.isArray(val)) &&
    `npm_config_${key.replace(/-/g, '_').toLowerCase()}`
}

const envVal = val => Array.isArray(val) ? val.join('\n\n') : val

const setEnvs = npm => {
  // The objects in the config.list array are arranged in
  // a prototype chain, so we can just for/in over the top
  // of the stack and grab any that don't match the default
  const { config: { list: [ configs ] } } = npm
  const { defaults } = require('./defaults.js')
  const set = {}
  for (const key in configs) {
    const val = configs[key]
    const environ = envKey(key, val)
    if (defaults[key] !== val && environ) {
      process.env[environ] = envVal(val)
    }
  }

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
