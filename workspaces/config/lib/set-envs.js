const NpmPrefix = `npm_`
const NpmConfigPrefx = `${NpmPrefix}config_`
const rePrefix = new RegExp(`^${NpmConfigPrefx}`, 'i')

// replace any ${ENV} values with the appropriate environ.
const envExpr = /(?<!\\)(\\*)\$\{([^${}]+)\}/g

const replaceEnv = (env, f) => f.replace(envExpr, (orig, esc, name) => {
  const val = env[name] !== undefined ? env[name] : `$\{${name}}`

  // consume the escape chars that are relevant.
  if (esc.length % 2) {
    return orig.slice((esc.length + 1) / 2)
  }

  return (esc.slice(esc.length / 2)) + val
})

const envKey = (key, val) => {
  if (!/^[/@_]/.test(key) && typeof envVal(val) === 'string') {
    const npmKey = key.replace(/-/g, '_').toLowerCase()
    return npmKey.startsWith(NpmConfigPrefx) ? npmKey : `${NpmConfigPrefx}${npmKey}`
  }
}

const envVal = val => Array.isArray(val) ? val.map(v => envVal(v)).join('\n\n')
  : val === null || val === undefined || val === false ? ''
  : typeof val === 'object' ? null
  : String(val)

const sameValue = (def, val) => {
  if (Array.isArray(val) && Array.isArray(def)) {
    return def.length === val.length && def.every((d, i) => d === val[i])
  }
  return def === val
}

const setEnv = (env, rawKey, rawVal) => {
  const val = envVal(rawVal)
  const key = envKey(rawKey, rawVal)
  if (key && val !== null) {
    env[key] = val
  }
}

module.exports = {
  setEnv,
  sameValue,
  replaceEnv,
  testEnvKey: (k) => rePrefix.test(k),
  envPrefix: NpmConfigPrefx,
}
