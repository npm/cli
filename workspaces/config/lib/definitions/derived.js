const { resolve, join } = require('path')
const { readFileSync } = require('fs')

const maybeReadFile = file => {
  try {
    return readFileSync(file, 'utf8')
  } catch (er) {
    if (er.code !== 'ENOENT') {
      throw er
    }
    return null
  }
}

// we export a Map because a derived key can be an array of keys that we
// normalize when we create all the relationships in index.js
module.exports = new Map()
const derive = (key, ...values) => module.exports.set(key, values)

// derived values can read directly from config if necessary
derive('npm-bin', (_, config) => config.npmExecPath)
derive('node-bin', (_, config) => config.execPath)

derive(['omit', 'include'], ({ omit, include, dev, production, optional, also, only }) => {
  const derived = { omit: [...omit], include: [...include] }

  if (/^prod(uction)?$/.test(only) || production) {
    derived.omit.push('dev')
  } else if (production === false) {
    derived.include.push('dev')
  }

  if (/^dev/.test(also)) {
    derived.include.push('dev')
  }

  if (dev) {
    derived.include.push('dev')
  }

  if (optional === false) {
    derived.omit.push('optional')
  } else if (optional === true) {
    derived.include.push('optional')
  }

  derived.omit = [...new Set(derived.omit)].filter(type => !derived.include.includes(type))
  derived.include = [...new Set(derived.include)]

  return derived
}, ['dev', 'production', 'optional', 'also', 'only'])

const deriveGlobal = ({ global, location }) => {
  const isGlobal = global || location === 'global'
  return isGlobal ? { global: true, location: 'global' } : { global, location }
}
derive(['global', 'location'], deriveGlobal)

derive(['prefix', 'globalconfig', 'global-prefix'], ({ prefix, globalconfig }, config) => {
  const defaultPrefix = prefix ?? config.defaultGlobalPrefix
  // if the prefix is set on cli, env, or userconfig, then we need to
  // default the globalconfig file to that location, instead of the default
  // global prefix.  It's weird that `npm get globalconfig --prefix=/foo`
  // returns `/foo/etc/npmrc`, but better to not change it at this point.
  return {
    prefix: defaultPrefix,
    globalPrefix: defaultPrefix,
    globalconfig: globalconfig ?? resolve(defaultPrefix, 'etc/npmrc'),
  }
})

derive('local-prefix', ({ prefix, workspaces, global, location }, { defaultLocalPrefix, cwd }) => {
  if (prefix != null) {
    return prefix
  }

  if (defaultLocalPrefix.root && (workspaces === false || deriveGlobal({ global, location }))) {
    return defaultLocalPrefix.root ?? cwd
  }

  return defaultLocalPrefix.workspace ?? defaultLocalPrefix.root ?? cwd
}, ['prefix', 'workspaces', 'global', 'location'])

derive(['cache', 'npx-cache', 'logs-dir'], ({ cache, logsDir }) => {
  return {
    cache: join(cache, '_cacache'),
    npxCache: join(cache, '_npx'),
    logsDir: logsDir || join(cache, '_logs'),
  }
})

derive('prefer-online', ({ cacheMax, preferOnline }) => {
  return cacheMax <= 0 ? true : preferOnline
}, ['cache-max'])

derive('prefer-offline', ({ cacheMin, preferOffline }) => {
  return cacheMin >= 9999 ? true : preferOffline
}, ['cache-min'])

derive('ca', ({ cafile }) => {
  const raw = cafile ? maybeReadFile(cafile) : null
  if (!raw) {
    return
  }
  const delim = '-----END CERTIFICATE-----'
  return raw.replace(/\r\n/g, '\n')
    .split(delim)
    .filter(s => s.trim())
    .map(s => s.trimLeft() + delim)
}, ['cafile'])

derive('color', ({ color }) => {
  return !color ? false : color === 'always' ? true : !!process.stdout.isTTY
})

derive('log-color', ({ color }) => {
  return !color ? false : color === 'always' ? true : !!process.stderr.isTTY
}, ['color'])

derive('search.limit', ({ searchlimit }) => {
  return searchlimit
}, ['searchlimit'])

derive('search.description', ({ description }) => {
  return description
}, ['description'])

derive('search.exclude', ({ searchexclude }) => {
  return searchexclude.toLowerCase()
}, ['searchexclude'])

derive('search.opts', ({ searchopts }) => {
  return searchopts
}, ['searchopts'])

derive('progress', ({ progress }) => {
  return !progress ? false : !!process.stderr.isTTY && process.env.TERM !== 'dumb'
})

derive('save-bundle', ({ saveBundle, savePeer }) => {
  // XXX update arborist to just ignore it if resulting saveType is peer
  // otherwise this won't have the expected effect:
  //
  // npm config set save-peer true
  // npm i foo --save-bundle --save-prod <-- should bundle
  return saveBundle && !savePeer
}, ['save-peer'])

derive('install-strategy', ({ globalStyle, legacyBundling, installStrategy }) => {
  return globalStyle ? 'shallow' : legacyBundling ? 'nested' : installStrategy
}, ['global-style', 'legacy-bundling'])

derive('save-prefix', ({ savePrefix, saveExact }) => {
  return saveExact ? '' : savePrefix
}, ['save-exact'])

derive('save-type', ({ saveDev, saveOptional, savePeer, saveProd }) => {
  if (savePeer && saveOptional) {
    return 'peerOptional'
  }
  if (savePeer) {
    return 'peer'
  }
  if (saveOptional) {
    return 'optional'
  }
  if (saveDev) {
    return 'dev'
  }
  if (saveProd) {
    return 'prod'
  }
}, ['save-dev', 'save-optional', 'save-peer', 'save-prod'])

// projectScope is kept for compatibility with npm-registry-fetch
derive('project-scope', ({ scope }) => {
  return scope
}, ['scope'])

derive('user-agent', ({ userAgent, ciName, workspaces, workspace, npmVersion }) => {
  const ws = !!(workspaces || workspace?.length)
  return userAgent.replace(/\{node-version\}/gi, process.version)
    .replace(/\{npm-version\}/gi, npmVersion)
    .replace(/\{platform\}/gi, process.platform)
    .replace(/\{arch\}/gi, process.arch)
    .replace(/\{workspaces\}/gi, ws)
    .replace(/\{ci\}/gi, ciName ? `ci/${ciName}` : '')
    .trim()
}, ['ci-name', 'workspaces', 'workspace', 'npm-version'])

derive('silent', ({ loglevel }) => {
  return loglevel === 'silent'
}, ['loglevel'])

derive(['workspaces-enabled'], ({ workspaces }) => {
  return workspaces !== false
}, ['workspaces'])

derive(['package-lock', 'package-lock-only'], ({ packageLock, packageLockOnly }) => {
  const lock = !!(packageLock || packageLockOnly)
  return {
    packageLock: lock,
    packageLockOnly: lock,
  }
})
