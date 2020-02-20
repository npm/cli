// return a flattened config object with canonical names suitable for
// passing to dependencies like arborist, pacote, npm-registry-fetch, etc.

const log = require('npmlog')
const crypto = require('crypto')
const npmSession = crypto.randomBytes(8).toString('hex')
log.verbose('npm-session', npmSession)
const {join} = require('path')

const buildOmitList = npm => {
  const include = npm.config.get('include') || []
  const omit = new Set((npm.config.get('omit') || [])
    .filter(type => !include.includes(type)))
  const only = npm.config.get('only')

  if (/^prod(uction)?$/.test(only) || npm.config.get('production')) {
    omit.add('dev')
  }

  if (/dev/.test(npm.config.get('also'))) {
    omit.delete('dev')
  }

  if (npm.config.get('dev')) {
    omit.delete('dev')
  }

  if (npm.config.get('optional') === false) {
    omit.add('optional')
  }

  npm.config.set('omit', [...omit])
  return [...omit]
}

const flatOptions = npm => npm.flatOptions || Object.freeze({
  // Note that many of these do not come from configs or cli flags
  // per se, though they may be implied or defined by them.
  log,
  npmSession,
  dmode: npm.modes.exec,
  fmode: npm.modes.file,
  umask: npm.modes.umask,
  hashAlgorithm: 'sha1', // XXX should this be sha512?
  color: !!npm.color,
  includeStaged: npm.config.get('include-staged'),

  projectScope: npm.projectScope,
  npmVersion: npm.version,
  nodeVersion: npm.config.get('node-version'),
  npmCommand: npm.command,

  tmp: npm.tmp,
  cache: join(npm.config.get('cache'), '_cacache'),
  prefix: npm.prefix,
  globalPrefix: npm.globalPrefix,
  localPrefix: npm.localPrefix,
  global: npm.config.get('global'),

  metricsRegistry: npm.config.get('metrics-registry'),
  sendMetrics: npm.config.get('send-metrics'),
  registry: npm.config.get('registry'),
  get scope () {
    log.warn('FIXME', 'using opts.scope instead of opts.projectScope')
    return npm.projectScope
  },
  access: npm.config.get('access'),
  alwaysAuth: npm.config.get('always-auth'),
  audit: npm.config.get('audit'),
  auditLevel: npm.config.get('audit-level'),
  authType: npm.config.get('auth-type'),
  before: npm.config.get('before'),
  browser: npm.config.get('browser'),
  ca: npm.config.get('ca'),
  cafile: npm.config.get('cafile'),
  cert: npm.config.get('cert'),
  key: npm.config.get('key'),

  // XXX remove these when we don't use lockfile any more, once
  // arborist is handling the installation process
  cacheLockRetries: npm.config.get('cache-lock-retries'),
  cacheLockStale: npm.config.get('cache-lock-stale'),
  cacheLockWait: npm.config.get('cache-lock-wait'),
  lockFile: {
    retries: npm.config.get('cache-lock-retries'),
    stale: npm.config.get('cache-lock-stale'),
    wait: npm.config.get('cache-lock-wait')
  },

  // XXX remove these once no longer used
  get cacheMax () {
    log.warn('FIXME', 'using deprecated cacheMax option, should use offline/preferOffline/preferOnline')
    return npm.config.get('cache-max')
  },
  get cacheMin () {
    log.warn('FIXME', 'using deprecated cacheMin option, should use offline/preferOffline/preferOnline')
    return npm.config.get('cache-min')
  },

  // token creation options
  cidr: npm.config.get('cidr'),
  readOnly: npm.config.get('read-only'),

  // npm version options
  preid: npm.config.get('preid'),
  tagVersionPrefix: npm.config.get('tag-version-prefix'),
  allowSameVersion: npm.config.get('allow-same-version'),

  // npm version git options
  message: npm.config.get('message'),
  commitHooks: npm.config.get('commit-hooks'),
  gitTagVersion: npm.config.get('git-tag-version'),
  signGitCommit: npm.config.get('sign-git-commit'),
  signGitTag: npm.config.get('sign-git-tag'),

  // only used for npm ls in v7, not update
  depth: npm.config.get('depth'),

  // options for npm search
  // XXX need to refactor these to a cleaner search: { ... } block,
  // since libnpmsearch needs them in a different format anyway, or
  // maybe just not include them here at all, and construct an options
  // pojo in lib/search.js instead.
  description: npm.config.get('description'),
  searchexclude: npm.config.get('searchexclude'),
  searchlimit: npm.config.get('searchlimit'),
  searchopts: npm.config.get('searchopts'),
  searchstaleness: npm.config.get('searchstaleness'),

  dryRun: npm.config.get('dry-run'),
  engineStrict: npm.config.get('engine-strict'),

  retry: {
    retries: npm.config.get('fetch-retries'),
    factor: npm.config.get('fetch-retry-factor'),
    maxTimeout: npm.config.get('fetch-retry-maxtimeout'),
    minTimeout: npm.config.get('fetch-retry-mintimeout')
  },

  force: npm.config.get('force'),

  formatPackageLock: npm.config.get('format-package-lock'),
  fund: npm.config.get('fund'),

  // binary locators
  git: npm.config.get('git'),
  npmBin: require.main.filename,
  nodeBin: process.env.NODE || process.execPath,
  viewer: npm.config.get('viewer'),
  editor: npm.config.get('editor'),

  // configs that affect how we build trees
  binLinks: npm.config.get('bin-links'),
  rebuildBundle: npm.config.get('rebuild-bundle'),
  packageLock: npm.config.get('package-lock'),
  packageLockOnly: npm.config.get('package-lock-only'),
  globalStyle: npm.config.get('global-style'),
  legacyBundling: npm.config.get('legacy-bundling'),
  scriptShell: npm.config.get('script-shell'),
  omit: buildOmitList(npm),

  // used to build up the appropriate {add:{...}} options to Arborist.reify
  save: npm.config.get('save'),
  saveBundle: npm.config.get('save-bundle'),
  saveDev: npm.config.get('save-dev'),
  saveOptional: npm.config.get('save-optional'),
  savePeer: npm.config.get('save-peer'),
  saveProd: npm.config.get('save-prod'),
  saveExact: npm.config.get('save-exact'),
  savePrefix: npm.config.get('save-prefix'),

  // configs for npm-registry-fetch
  otp: npm.config.get('otp'),
  offline: npm.config.get('offline'),
  preferOffline: getPreferOffline(npm),
  preferOnline: getPreferOnline(npm),
  strictSSL: npm.config.get('strict-ssl'),
  defaultTag: npm.config.get('tag'),
  get tag () {
    log.warn('FIXME', 'using tag option, should be defaultTag')
    return npm.config.get('tag')
  },
  userAgent: npm.config.get('user-agent'),

  ...getScopesAndAuths(npm)
})

const getPreferOnline = npm => {
  const po = npm.config.get('prefer-online')
  if (po !== undefined) {
    return po
  }
  return npm.config.get('cache-max') <= 0
}

const getPreferOffline = npm => {
  const po = npm.config.get('prefer-offline')
  if (po !== undefined) {
    return po
  }
  return npm.config.get('cache-min') >= 9999
}

// pull out all the @scope:<key> and //host:key config fields
// these are used by npm-registry-fetch for authing against registries
const getScopesAndAuths = npm => {
  const scopesAndAuths = {}
  // pull out all the @scope:... configs into a flat object.
  for (const key in npm.config.list[0]) {
    if (/@.*:registry$/i.test(key) || /^\/\//.test(key)) {
      scopesAndAuths[key] = npm.config.get(key)
    }
  }
  return scopesAndAuths
}

module.exports = flatOptions
