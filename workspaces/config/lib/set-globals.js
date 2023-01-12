const NpmPrefix = `npm_`
const NpmConfigPrefx = `${NpmPrefix}config_`
const rePrefix = new RegExp(`^${NpmConfigPrefx}`, 'i')

// This is an allow list of env variables that this config
// module can set. Note that this only applies to environs
// that do not start with `npm_` which are always allowed.
// This list is exported so that the npm tests can reset any
// env vars between tests.
const EnvKeys = new Set([
  'INIT_CWD',
  'HOME',
  'EDITOR',
  'NODE',
  'NODE_OPTIONS',
  'COLOR',
  'NODE_ENV',
])

const ProcessKeys = new Set([
  'execPath',
  'title',
])

// replace any ${ENV} values with the appropriate environ.
const envExpr = /(?<!\\)(\\*)\$\{([^${}]+)\}/g
const envReplace = (env, f) => f.replace(envExpr, (orig, esc, name) => {
  const val = env[name] !== undefined ? env[name] : `$\{${name}}`

  // consume the escape chars that are relevant.
  if (esc.length % 2) {
    return orig.slice((esc.length + 1) / 2)
  }

  return (esc.slice(esc.length / 2)) + val
})

const setProcess = (proc, key, val) => {
  if (!ProcessKeys.has(key)) {
    throw new Error(`not allowed to set process key: ${key}`)
  }
  proc[key] = val
}

const envKey = (key, val) => !/^[/@_]/.test(key) &&
  typeof envVal(val) === 'string' &&
  `${NpmConfigPrefx}${key.replace(/-/g, '_').toLowerCase()}`

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
  if (!key.startsWith(NpmPrefix) && !EnvKeys.has(key)) {
    throw new Error(`not allowed to to set environ: \`${key}\``)
  }
  const val = envVal(rawVal)
  if (key && val !== null) {
    env[key] = val
  }
}

module.exports = {
  ProcessKeys,
  EnvKeys,
  setProcess,
  setEnv,
  sameValue,
  replaceEnv: envReplace,
  npm: {
    setEnv: setNpmEnv,
    testKey: (k) => rePrefix.test(k),
    envPrefix: NpmConfigPrefx,
  },
}
