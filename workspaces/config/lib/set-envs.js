const NPM_PREFIX = `npm_`
const CONFIG_PREFIX = `${NPM_PREFIX}config_`
const rePrefix = new RegExp(`^${CONFIG_PREFIX}`, 'i')

// This is an allow list of env variables that this config
// module can set. Note that this only applies to environs
// that do not start with `npm_` which are always allowed.
// This list is exported so that the npm tests can reset any
// env vars between tests.
const ALLOWED_ENV_KEYS = new Set([
  'INIT_CWD',
  'HOME',
  'EDITOR',
  'NODE',
  'NODE_OPTIONS',
  'COLOR',
  'NODE_ENV',
])

const ALLOWED_PROCESS_KEYS = new Set([
  'execPath',
])

const setProcess = (proc, key, val) => {
  if (ALLOWED_PROCESS_KEYS.has(key)) {
    throw new Error(`attempted to set non-allowed process: ${key}`)
  }
  proc[key] = val
}

const envKey = (key, val) => !/^[/@_]/.test(key) &&
  typeof envVal(val) === 'string' &&
  `${CONFIG_PREFIX}${key.replace(/-/g, '_').toLowerCase()}`

const envVal = val => Array.isArray(val) ? val.map(v => envVal(v)).join('\n\n')
  : val === null || val === undefined || val === false ? ''
  : typeof val === 'object' ? null
  : String(val)

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

const sameValue = (def, val) =>
  !Array.isArray(val) || !Array.isArray(def) ? def === val
  : sameArrayValue(def, val)

const setNpmEnv = (env, rawKey, rawVal) => {
  const val = envVal(rawVal)
  const key = envKey(rawKey, val)
  if (key && val !== null) {
    env[key] = val
  }
}

const setEnv = (env, key, rawVal) => {
  if (!key.startsWith(NPM_PREFIX) && !ALLOWED_ENV_KEYS.has(key)) {
    throw new Error(`not allowed to to set environ: \`${key}\``)
  }
  const val = envVal(rawVal)
  if (key && val !== null) {
    env[key] = val
  }
}

module.exports = {
  ALLOWED_PROCESS_KEYS,
  ALLOWED_ENV_KEYS,
  setProcess,
  setEnv,
  sameValue,
  npm: {
    setEnv: setNpmEnv,
    testKey: (k) => rePrefix.test(k),
    prefix: CONFIG_PREFIX,
  },
}
