/* eslint no-unused-vars: ["error", { "ignoreRestSiblings": false }] */
// Error on unused rest params since those are required to match the
// depends array for each definition

/* global Boolean:off, Array:off, String:off, Number:off, Date:off */

const ciInfo = require('ci-info')
const { homedir } = require('os')
const { resolve, join } = require('path')
const { Types } = require('../type-defs')
const { Locations } = require('./locations')
const Definition = require('./definition.js')

const {
  ComSpec = 'cmd',
  EDITOR,
  HOME,
  LANG,
  LC_ALL,
  LC_CTYPE,
  LOCALAPPDATA,
  NO_COLOR,
  NODE,
  NODE_ENV,
  SHELL = 'sh',
  SYSTEMROOT,
  TERM,
  VISUAL,
} = process.env
const StdoutTTY = !!process.stdout?.isTTY
const StderrTTY = !!process.stderr?.isTTY
const IsWindows = process.platform === 'win32'
const Editor = EDITOR || VISUAL || (IsWindows ? `${SYSTEMROOT}\\notepad.exe` : 'vi')
const Shell = IsWindows ? ComSpec : SHELL
const Unicode = /UTF-?8$/i.test(LC_ALL || LC_CTYPE || LANG)
// use LOCALAPPDATA on Windows, if set https://github.com/npm/cli/pull/899
const CacheRoot = `${(IsWindows && LOCALAPPDATA) || '~'}/${IsWindows ? 'npm-cache' : '.npm'}`
const CiName = ciInfo.name?.toLowerCase().split(' ').join('-') ?? null

module.exports = {
  displayKeys: [],
  changeKeys: {},
  definitions: {},
  definitionKeys: [],
  internals: {},
  internalKeys: [],
  derived: {},
  derivedKeys: [],
}

const define = (key, { deprecatedKey, ...v }) => {
  const d = new Definition(key, v)
  module.exports.definitions[d.key] = d
  module.exports.definitionKeys.push(d.key)
  module.exports.displayKeys.push(d.displayKey)
  if (d.displayKey !== d.key) {
    module.exports.changeKeys[d.displayKey] = d.key
  }

  if (deprecatedKey) {
    define(deprecatedKey, {
      ...v,
      depends: null,
      setEnv: null,
      setProcess: null,
      flatten: null,
      value: null,
      deprecated: `Use \`--${key}\` instead.`,
      description: `Alias for \`--${key}\``,
    })
  }
}

const internal = (key, v) => {
  const d = new Definition(key, {
    ...v,
    internal: true,
  })
  module.exports.internals[d.key] = d
  module.exports.internalKeys.push(d.key)
}

const derive = (key, v) => {
  const d = new Definition(key, {
    ...v,
    derived: true,
    type: null,
  })
  module.exports.derived[d.key] = d
  module.exports.derivedKeys.push(d.key)
}

/*
 *
 * Internal values
 * these are one that we know the value of right now
 *
 */
internal('arch', {
  default: process.arch,
  type: Types.String,
})

internal('cwd', {
  default: process.cwd(),
  type: Types.String,
  setEnv: {
    INIT_CWD: true,
  },
})

internal('exec-path', {
  default: process.execPath,
  type: Types.String,
  setEnv: {
    NODE: true,
    npm_node_execpath: true,
  },
  setProcess: {
    execPath: true,
  },
})

internal('home', {
  default: HOME ?? homedir(),
  type: Types.String,
  setEnv: {
    HOME: true,
  },
})

// XXX should this be sha512?  is it even relevant?
internal('hash-algorithm', {
  default: 'sha1',
  type: Types.String,
  flatten: true,
})

internal('node-version', {
  default: process.version,
  type: Types.String,
})

internal('npm-bin', {
  default: require.main?.filename ?? null,
  type: Types.String,
  flatten: true,
  setEnv: {
    // XXX make this the bin/npm-cli.js file explicitly instead
    // otherwise using npm programmatically is a bit of a pain.
    npm_execpath: true,
  },
})

internal('platform', {
  default: process.platform,
  type: Types.String,
})

/*
 *
 * Internal values
 * these are set at some point during config init/load. they are
 * registered here so that all keys are in a single place
 *
 */
internal('default-global-prefix', {
  type: Types.String,
})

internal('default-local-prefix-workspace', {
  type: Types.String,
})

internal('default-local-prefix-root', {
  type: Types.String,
})

internal('local-package', {
  type: Types.Boolean,
})

internal('npm-args', {
  default: [],
  type: [Types.String, Types.Array],
})

internal('npm-command', {
  type: Types.String,
  setEnv: {
    npm_command: true,
  },
})

internal('npm-version', {
  type: Types.String,
})

internal('title', {
  type: Types.String,
  setProcess: {
    title: true,
  },
})

/*
 *
 * Derived
 *
 *
 */
derive('cache', {
  depends: ['cache-root'],
  value: ({ cacheRoot }) => {
    return join(cacheRoot, '_cacache')
  },
})

derive('color', {
  depends: ['color-raw'],
  value: ({ colorRaw }) => {
    return colorRaw === false ? false : colorRaw === 'always' ? true : StdoutTTY
  },
  setEnv: {
    COLOR: (color) => color ? '1' : '0',
  },
})

derive('global', {
  depends: ['global-raw', 'location-raw'],
  value: ({ globalRaw, locationRaw }) => {
    return globalRaw ?? locationRaw === 'global'
  },
})

derive('global-prefix', {
  depends: ['prefix', 'default-global-prefix'],
  value: ({ prefix, defaultGlobalPrefix }) => {
    return prefix ?? defaultGlobalPrefix
  },
  setEnv: {
    npm_global_prefix: true,
  },
})

derive('local-prefix', {
  depends: [
    'prefix',
    'workspaces',
    'global',
    'default-local-prefix-root',
    'default-local-prefix-workspace',
    'cwd',
  ],
  value: ({
    prefix,
    workspaces,
    global,
    defaultLocalPrefixRoot,
    defaultLocalPrefixWorkspace,
    cwd,
  }) => {
    if (prefix != null) {
      return prefix
    }

    const defaultPrefix = defaultLocalPrefixRoot ?? cwd

    if (defaultLocalPrefixRoot && (workspaces === false || global)) {
      return defaultPrefix
    }

    return defaultLocalPrefixWorkspace ?? defaultPrefix
  },
  setEnv: {
    npm_local_prefix: true,
  },
})

derive('location', {
  depends: ['global-raw', 'location-raw'],
  value: ({ globalRaw, locationRaw }) => {
    return globalRaw ? 'global' : locationRaw
  },
})

derive('log-color', {
  depends: ['color-raw'],
  value: ({ colorRaw }) => {
    return colorRaw === false ? false : colorRaw === 'always' ? true : StderrTTY
  },
})

derive('npx-cache', {
  depends: ['cache-root'],
  value: ({ cacheRoot }) => {
    return join(cacheRoot, '_npx')
  },
})

derive('node-bin', {
  depends: ['exec-path'],
  value: ({ execPath }) => {
    return NODE ?? execPath
  },
})

derive('save-type', {
  depends: ['save-dev', 'save-optional', 'save-peer', 'save-prod'],
  value: ({ saveDev, saveOptional, savePeer, saveProd }) => {
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
  },
})

derive('silent', {
  depends: ['loglevel'],
  value: ({ loglevel }) => {
    return loglevel === 'silent'
  },
})

derive('tuf-cache', {
  depends: ['cache-root'],
  value: ({ cacheRoot }) => {
    return join(cacheRoot, '_tuf')
  },
})

derive('workspaces-enabled', {
  depends: ['workspaces'],
  value: ({ workspaces }) => {
    return workspaces !== false
  },
})

derive('workspaces-set', {
  depends: ['workspaces', 'workspace'],
  value: ({ workspaces, workspace }) => {
    return !!(workspaces || workspace.length)
  },
})

/*
 *
 * Defintions
 * Define all config keys we know about
 */
define('_auth', {
  type: Types.String,
  description: `
    A basic-auth string to use when authenticating against the npm registry.
    This will ONLY be used to authenticate against the npm registry.  For other
    registries you will need to scope it like "//other-registry.tld/:_auth"

    Warning: This should generally not be set via a command-line option.  It
    is safer to use a registry-provided authentication bearer token stored in
    the ~/.npmrc file by running \`npm login\`.
  `,
  flatten: true,
})

define('access', {
  type: ['restricted', 'public'],
  defaultDescription: `
    'public' for new packages, existing packages it will not change the current level
  `,
  description: `
    If you do not want your scoped package to be publicly viewable (and
    installable) set \`--access=restricted\`.

    Unscoped packages can not be set to \`restricted\`.

    Note: This defaults to not changing the current access level for existing
    packages.  Specifying a value of \`restricted\` or \`public\` during
    publish will change the access for an existing package the same way that
    \`npm access set status\` would.
  `,
  flatten: true,
})

define('all', {
  default: false,
  type: Types.Boolean,
  short: 'a',
  description: `
    When running \`npm outdated\` and \`npm ls\`, setting \`--all\` will show
    all outdated or installed packages, rather than only those directly
    depended upon by the current project.
  `,
  flatten: true,
})

define('allow-same-version', {
  default: false,
  type: Types.Boolean,
  description: `
    Prevents throwing an error when \`npm version\` is used to set the new
    version to the same value as the current version.
  `,
  flatten: true,
})

define('also', {
  type: ['dev', 'development'],
  description: `
    When set to \`dev\` or \`development\`, this is an alias for
    \`--include=dev\`.
  `,
  deprecated: 'Please use --include=dev instead.',
})

define('audit', {
  default: true,
  type: Types.Boolean,
  description: `
    When "true" submit audit reports alongside the current npm command to the
    default registry and all registries configured for scopes.  See the
    documentation for [\`npm audit\`](/commands/npm-audit) for details on what
    is submitted.
  `,
  flatten: true,
})

define('audit-level', {
  type: ['info', 'low', 'moderate', 'high', 'critical', 'none'],
  description: `
    The minimum level of vulnerability for \`npm audit\` to exit with
    a non-zero exit code.
  `,
  flatten: true,
})

define('auth-type', {
  default: 'web',
  type: ['legacy', 'web'],
  description: `
    What authentication strategy to use with \`login\`.
    Note that if an \`otp\` config is given, this value will always be set to \`legacy\`.
  `,
  depends: ['otp'],
  flatten: true,
  value: (authType, { otp }) => {
    return otp ? 'legacy' : authType
  },
})

define('before', {
  alias: 'enjoy-by',
  type: Types.Date,
  description: `
    If passed to \`npm install\`, will rebuild the npm tree such that only
    versions that were available **on or before** the \`--before\` time get
    installed.  If there's no versions available for the current set of
    direct dependencies, the command will error.

    If the requested version is a \`dist-tag\` and the given tag does not
    pass the \`--before\` filter, the most recent version less than or equal
    to that tag will be used. For example, \`foo@latest\` might install
    \`foo@1.2\` even though \`latest\` is \`2.0\`.
  `,
  flatten: true,
})

define('bin-links', {
  default: true,
  type: Types.Boolean,
  description: `
    Tells npm to create symlinks (or \`.cmd\` shims on Windows) for package
    executables.

    Set to false to have it not do this.  This can be used to work around the
    fact that some file systems don't support symlinks, even on ostensibly
    Unix systems.
  `,
  flatten: true,
})

define('browser', {
  type: Types.BooleanOrString,
  defaultDescription: `
    OS X: \`"open"\`, Windows: \`"start"\`, Others: \`"xdg-open"\`
  `,
  description: `
    The browser that is called by npm commands to open websites.

    Set to \`false\` to suppress browser behavior and instead print urls to
    terminal.

    Set to \`true\` to use default system URL opener.
  `,
  flatten: true,
})

define('ca', {
  type: [Types.String, Types.Array],
  description: `
    The Certificate Authority signing certificate that is trusted for SSL
    connections to the registry. Values should be in PEM format (Windows
    calls it "Base-64 encoded X.509 (.CER)") with newlines replaced by the
    string "\\n". For example:

    \`\`\`ini
    ca="-----BEGIN CERTIFICATE-----\\nXXXX\\nXXXX\\n-----END CERTIFICATE-----"
    \`\`\`

    Set to \`null\` to only allow "known" registrars, or to a specific CA
    cert to trust only that specific signing authority.

    Multiple CAs can be trusted by specifying an array of certificates:

    \`\`\`ini
    ca[]="..."
    ca[]="..."
    \`\`\`

    See also the \`strict-ssl\` config.
  `,
  depends: ['cafile'],
  flatten: true,
  value: (ca, { cafile }) => {
    return (ca ?? []).concat(cafile ?? [])
  },
})

define('cache', {
  key: 'cache-root',
  default: CacheRoot,
  defaultDescription: `
    Windows: \`%LocalAppData%\\npm-cache\`, Posix: \`~/.npm\`
  `,
  type: Types.Path,
  description: `
    The location of npm's cache directory.
  `,
})

define('cache-max', {
  default: Infinity,
  type: Types.Number,
  description: `
    \`--cache-max=0\` is an alias for \`--prefer-online\`
  `,
  deprecated: `
    This option has been deprecated in favor of \`--prefer-online\`
  `,
})

define('cache-min', {
  default: 0,
  type: Types.Number,
  description: `
    \`--cache-min=9999 (or bigger)\` is an alias for \`--prefer-offline\`.
  `,
  deprecated: `
    This option has been deprecated in favor of \`--prefer-offline\`.
  `,
})

define('cafile', {
  type: Types.File,
  description: `
    A path to a file containing one or multiple Certificate Authority signing
    certificates. Similar to the \`ca\` setting, but allows for multiple
    CA's, as well as for the CA information to be stored in a file on disk.
  `,
  flatten: true,
  value: (cafile) => {
    const delim = '-----END CERTIFICATE-----'
    return cafile
      ?.replace(/\r\n/g, '\n')
      .split(delim)
      .filter(s => s.trim())
      .map(s => s.trimStart() + delim)
  },
})

define('call', {
  type: Types.String,
  short: 'c',
  description: `
    Optional companion option for \`npm exec\`, \`npx\` that allows for
    specifying a custom command to be run along with the installed packages.

    \`\`\`bash
    npm exec --package yo --package generator-node --call "yo node"
    \`\`\`
  `,
  flatten: true,
})

define('cert', {
  type: Types.String,
  description: `
    A client certificate to pass when accessing the registry.  Values should
    be in PEM format (Windows calls it "Base-64 encoded X.509 (.CER)") with
    newlines replaced by the string "\\n". For example:

    \`\`\`ini
    cert="-----BEGIN CERTIFICATE-----\\nXXXX\\nXXXX\\n-----END CERTIFICATE-----"
    \`\`\`

    It is _not_ the path to a certificate file, though you can set a registry-scoped
    "certfile" path like "//other-registry.tld/:certfile=/path/to/cert.pem".
  `,
  deprecated: `
    \`key\` and \`cert\` are no longer used for most registry operations.
    Use registry scoped \`keyfile\` and \`certfile\` instead.
    Example:
    //other-registry.tld/:keyfile=/path/to/key.pem
    //other-registry.tld/:certfile=/path/to/cert.crt
  `,
  flatten: true,
})

define('ci-name', {
  default: CiName,
  defaultDescription: `
    The name of the current CI system, or \`null\` when not on a known CI
    platform.
  `,
  type: Types.String,
  deprecated: `
    This config is deprecated and will not be changeable in future version of npm.
  `,
  description: `
    The name of a continuous integration system.  If not set explicitly, npm
    will detect the current CI environment using the
    [\`ci-info\`](http://npm.im/ci-info) module.
  `,
  flatten: true,
})

define('cidr', {
  type: [Types.String, Types.Array],
  description: `
    This is a list of CIDR address to be used when configuring limited access
    tokens with the \`npm token create\` command.
  `,
  flatten: true,
})

define('color', {
  key: 'color-raw',
  default: !NO_COLOR || NO_COLOR === '0',
  defaultDescription: `
    true unless the NO_COLOR environ is set to something other than '0'
  `,
  type: ['always', Types.Boolean],
  description: `
    If false, never shows colors.  If \`"always"\` then always shows colors.
    If true, then only prints color codes for tty file descriptors.
  `,
})

define('commit-hooks', {
  default: true,
  type: Types.Boolean,
  description: `
    Run git commit hooks when using the \`npm version\` command.
  `,
  flatten: true,
})

define('depth', {
  type: Types.Number,
  defaultDescription: `
    \`Infinity\` if \`--all\` is set, otherwise \`1\`
  `,
  description: `
    The depth to go when recursing packages for \`npm ls\`.

    If not set, \`npm ls\` will show only the immediate dependencies of the
    root project.  If \`--all\` is set, then npm will show all dependencies
    by default.
  `,
  depends: ['all'],
  flatten: true,
  value: (depth, { all }) => {
    return depth ?? all ? Infinity : 1
  },
})

define('description', {
  default: true,
  type: Types.Boolean,
  alias: 'desc',
  description: `
    Show the description in \`npm search\`
  `,
  flatten: 'search.description',
})

define('dev', {
  default: false,
  type: Types.Boolean,
  description: `
    Alias for \`--include=dev\`.
  `,
  deprecated: 'Please use --include=dev instead.',
})

define('diff', {
  default: [],
  type: [Types.Spec, Types.Array],
  description: `
    Define arguments to compare in \`npm diff\`.
  `,
  flatten: true,
})

define('diff-ignore-all-space', {
  default: false,
  type: Types.Boolean,
  description: `
    Ignore whitespace when comparing lines in \`npm diff\`.
  `,
  flatten: true,
})

define('diff-name-only', {
  default: false,
  type: Types.Boolean,
  description: `
    Prints only filenames when using \`npm diff\`.
  `,
  flatten: true,
})

define('diff-no-prefix', {
  default: false,
  type: Types.Boolean,
  description: `
    Do not show any source or destination prefix in \`npm diff\` output.

    Note: this causes \`npm diff\` to ignore the \`--diff-src-prefix\` and
    \`--diff-dst-prefix\` configs.
  `,
  flatten: true,
})

define('diff-dst-prefix', {
  default: 'b/',
  hint: '<path>',
  type: Types.String,
  description: `
    Destination prefix to be used in \`npm diff\` output.
  `,
  flatten: true,
})

define('diff-src-prefix', {
  default: 'a/',
  hint: '<path>',
  type: Types.String,
  description: `
    Source prefix to be used in \`npm diff\` output.
  `,
  flatten: true,
})

define('diff-text', {
  default: false,
  type: Types.Boolean,
  description: `
    Treat all files as text in \`npm diff\`.
  `,
  flatten: true,
})

define('diff-unified', {
  default: 3,
  type: Types.Number,
  description: `
    The number of lines of context to print in \`npm diff\`.
  `,
  flatten: true,
})

define('dry-run', {
  default: false,
  type: Types.Boolean,
  description: `
    Indicates that you don't want npm to make any changes and that it should
    only report what it would have done.  This can be passed into any of the
    commands that modify your local installation, eg, \`install\`,
    \`update\`, \`dedupe\`, \`uninstall\`, as well as \`pack\` and
    \`publish\`.

    Note: This is NOT honored by other network related commands, eg
    \`dist-tags\`, \`owner\`, etc.
  `,
  flatten: true,
})

define('editor', {
  default: Editor,
  defaultDescription: `
    The EDITOR or VISUAL environment variables, or '%SYSTEMROOT%\\notepad.exe' on Windows,
    or 'vi' on Unix systems
  `,
  type: Types.String,
  description: `
    The command to run for \`npm edit\` and \`npm config edit\`.
  `,
  flatten: true,
  setEnv: {
    EDITOR: true,
  },
})

define('engine-strict', {
  default: false,
  type: Types.Boolean,
  description: `
    If set to true, then npm will stubbornly refuse to install (or even
    consider installing) any package that claims to not be compatible with
    the current Node.js version.

    This can be overridden by setting the \`--force\` flag.
  `,
  flatten: true,
})

define('fetch-retries', {
  default: 2,
  type: Types.Number,
  description: `
    The "retries" config for the \`retry\` module to use when fetching
    packages from the registry.

    npm will retry idempotent read requests to the registry in the case
    of network failures or 5xx HTTP errors.
  `,
  flatten: 'retry.retries',
})

define('fetch-retry-factor', {
  default: 10,
  type: Types.Number,
  description: `
    The "factor" config for the \`retry\` module to use when fetching
    packages.
  `,
  flatten: 'retry.factor',
})

define('fetch-retry-maxtimeout', {
  default: 60000,
  defaultDescription: '60000 (1 minute)',
  type: Types.Number,
  description: `
    The "maxTimeout" config for the \`retry\` module to use when fetching
    packages.
  `,
  flatten: 'retry.max-timeout',
})

define('fetch-retry-mintimeout', {
  default: 10000,
  defaultDescription: '10000 (10 seconds)',
  type: Types.Number,
  description: `
    The "minTimeout" config for the \`retry\` module to use when fetching
    packages.
  `,
  flatten: 'retry.min-timeout',
})

define('fetch-timeout', {
  default: 5 * 60 * 1000,
  defaultDescription: `${5 * 60 * 1000} (5 minutes)`,
  type: Types.Number,
  description: `
    The maximum amount of time to wait for HTTP requests to complete.
  `,
  flatten: 'timeout',
})

define('force', {
  default: false,
  type: Types.Boolean,
  short: 'f',
  description: `
    Removes various protections against unfortunate side effects, common
    mistakes, unnecessary performance degradation, and malicious input.

    * Allow clobbering non-npm files in global installs.
    * Allow the \`npm version\` command to work on an unclean git repository.
    * Allow deleting the cache folder with \`npm cache clean\`.
    * Allow installing packages that have an \`engines\` declaration
      requiring a different version of npm.
    * Allow installing packages that have an \`engines\` declaration
      requiring a different version of \`node\`, even if \`--engine-strict\`
      is enabled.
    * Allow \`npm audit fix\` to install modules outside your stated
      dependency range (including SemVer-major changes).
    * Allow unpublishing all versions of a published package.
    * Allow conflicting peerDependencies to be installed in the root project.
    * Implicitly set \`--yes\` during \`npm init\`.
    * Allow clobbering existing values in \`npm pkg\`
    * Allow unpublishing of entire packages (not just a single version).

    If you don't have a clear idea of what you want to do, it is strongly
    recommended that you do not use this option!
  `,
  flatten: true,
})

define('foreground-scripts', {
  default: false,
  type: Types.Boolean,
  description: `
    Run all build scripts (ie, \`preinstall\`, \`install\`, and
    \`postinstall\`) scripts for installed packages in the foreground
    process, sharing standard input, output, and error with the main npm
    process.

    Note that this will generally make installs run slower, and be much
    noisier, but can be useful for debugging.
  `,
  flatten: true,
})

define('format-package-lock', {
  default: true,
  type: Types.Boolean,
  description: `
    Format \`package-lock.json\` or \`npm-shrinkwrap.json\` as a human
    readable file.
  `,
  flatten: true,
})

define('fund', {
  default: true,
  type: Types.Boolean,
  description: `
    When "true" displays the message at the end of each \`npm install\`
    acknowledging the number of dependencies looking for funding.
    See [\`npm fund\`](/commands/npm-fund) for details.
  `,
  flatten: true,
})

define('git', {
  default: 'git',
  type: Types.String,
  description: `
    The command to use for git commands.  If git is installed on the
    computer, but is not in the \`PATH\`, then set this to the full path to
    the git binary.
  `,
  flatten: true,
})

define('git-tag-version', {
  default: true,
  type: Types.Boolean,
  description: `
    Tag the commit when using the \`npm version\` command.  Setting this to
    false results in no commit being made at all.
  `,
  flatten: true,
})

define('global', {
  key: 'global-raw',
  default: false,
  type: Types.Boolean,
  short: 'g',
  alias: {
    local: false,
  },
  description: `
    Operates in "global" mode, so that packages are installed into the
    \`prefix\` folder instead of the current working directory.  See
    [folders](/configuring-npm/folders) for more on the differences in
    behavior.

    * packages are installed into the \`{prefix}/lib/node_modules\` folder,
      instead of the current working directory.
    * bin files are linked to \`{prefix}/bin\`
    * man pages are linked to \`{prefix}/share/man\`
  `,
})

define('globalconfig', {
  type: Types.Path,
  defaultDescription: `
    The global --prefix setting plus 'etc/npmrc'. For example,
    '/usr/local/etc/npmrc'
  `,
  description: `
    The config file to read for global config options.
  `,
  depends: ['prefix', 'default-global-prefix'],
  flatten: true,
  value: (globalconfig, { prefix, defaultGlobalPrefix }) => {
    const def = prefix ?? defaultGlobalPrefix
    // if the prefix is set on cli, env, or userconfig, then we need to
    // default the globalconfig file to that location, instead of the default
    // global prefix.  It's weird that `npm get globalconfig --prefix=/foo`
    // returns `/foo/etc/npmrc`, but better to not change it at this point.
    return globalconfig ?? def != null ? resolve(def, 'etc/npmrc') : null
  },
})

define('global-style', {
  default: false,
  type: Types.Boolean,
  description: `
    Only install direct dependencies in the top level \`node_modules\`,
    but hoist on deeper dependencies.
    Sets \`--install-strategy=shallow\`.
  `,
  deprecated: `
    This option has been deprecated in favor of \`--install-strategy=shallow\`
  `,
})

define('heading', {
  default: 'npm',
  type: Types.String,
  description: `
    The string that starts all the debugging log output.
  `,
  flatten: true,
})

define('https-proxy', {
  type: Types.URL,
  description: `
    A proxy to use for outgoing https requests. If the \`HTTPS_PROXY\` or
    \`https_proxy\` or \`HTTP_PROXY\` or \`http_proxy\` environment variables
    are set, proxy settings will be honored by the underlying
    \`make-fetch-happen\` library.
  `,
  flatten: true,
})

define('if-present', {
  default: false,
  type: Types.Boolean,
  envExport: false,
  description: `
    If true, npm will not exit with an error code when \`run-script\` is
    invoked for a script that isn't defined in the \`scripts\` section of
    \`package.json\`. This option can be used when it's desirable to
    optionally run a script when it's present and fail if the script fails.
    This is useful, for example, when running scripts that may only apply for
    some builds in an otherwise generic CI setup.
  `,
  flatten: true,
})

define('ignore-scripts', {
  default: false,
  type: Types.Boolean,
  description: `
    If true, npm does not run scripts specified in package.json files.

    Note that commands explicitly intended to run a particular script, such
    as \`npm start\`, \`npm stop\`, \`npm restart\`, \`npm test\`, and \`npm
    run-script\` will still run their intended script if \`ignore-scripts\` is
    set, but they will *not* run any pre- or post-scripts.
  `,
  flatten: true,
})

define('include', {
  default: [],
  type: [Types.Array, 'prod', 'dev', 'optional', 'peer'],
  description: `
    Option that allows for defining which types of dependencies to install.

    This is the inverse of \`--omit=<type>\`.

    Dependency types specified in \`--include\` will not be omitted,
    regardless of the order in which omit/include are specified on the
    command-line.
  `,
  depends: ['dev', 'production', 'optional', 'also'],
  flatten: true,
  value: (include, { dev, production, optional, also }) => {
    const derived = [...include]

    if (production === false) {
      derived.push('dev')
    }

    if (/^dev/.test(also)) {
      derived.push('dev')
    }

    if (dev) {
      derived.push('dev')
    }

    if (optional === true) {
      derived.push('optional')
    }

    return [...new Set(derived)]
  },
})

define('include-staged', {
  default: false,
  type: Types.Boolean,
  description: `
    Allow installing "staged" published packages, as defined by [npm RFC PR
    #92](https://github.com/npm/rfcs/pull/92).

    This is experimental, and not implemented by the npm public registry.
  `,
  flatten: true,
})

define('include-workspace-root', {
  default: false,
  type: Types.Boolean,
  short: 'iwr',
  envExport: false,
  description: `
    Include the workspace root when workspaces are enabled for a command.

    When false, specifying individual workspaces via the \`workspace\` config,
    or all workspaces via the \`workspaces\` flag, will cause npm to operate only
    on the specified workspaces, and not on the root project.
  `,
  flatten: true,
})

// these deprecated version of these keys with dots instead of dashes as
// separators are historically supported in .npmrc files, unfortunately. They
// should be removed in a future npm version.
define('init-author-email', {
  type: Types.String,
  description: `
    The value \`npm init\` should use by default for the package author's
    email.
  `,
  deprecatedKey: 'init.author.email',
})

define('init-author-name', {
  type: Types.String,
  description: `
    The value \`npm init\` should use by default for the package author's name.
  `,
  deprecatedKey: 'init.author.name',
})

define('init-author-url', {
  type: Types.URL,
  description: `
    The value \`npm init\` should use by default for the package author's homepage.
  `,
  deprecatedKey: 'init.author.url',
})

define('init-license', {
  default: 'ISC',
  type: Types.String,
  description: `
    The value \`npm init\` should use by default for the package license.
  `,
  deprecatedKey: 'init.license',
})

define('init-module', {
  default: '~/.npm-init.js',
  type: Types.Path,
  description: `
    A module that will be loaded by the \`npm init\` command.  See the
    documentation for the
    [init-package-json](https://github.com/npm/init-package-json) module for
    more information, or [npm init](/commands/npm-init).
  `,
  deprecatedKey: 'init.module',
})

define('init-version', {
  default: '1.0.0',
  type: Types.SemVer,
  description: `
    The value that \`npm init\` should use by default for the package
    version number, if not already set in package.json.
  `,
  deprecatedKey: 'init.version',
})

define('install-links', {
  default: false,
  type: Types.Boolean,
  description: `
    When set file: protocol dependencies will be packed and installed as
    regular dependencies instead of creating a symlink. This option has
    no effect on workspaces.
  `,
  flatten: true,
})

define('install-strategy', {
  default: 'hoisted',
  type: ['hoisted', 'nested', 'shallow', 'linked'],
  description: `
    Sets the strategy for installing packages in node_modules.
    hoisted (default): Install non-duplicated in top-level, and duplicated as
      necessary within directory structure.
    nested: (formerly --legacy-bundling) install in place, no hoisting.
    shallow (formerly --global-style) only install direct deps at top-level.
    linked: (experimental) install in node_modules/.store, link in place,
      unhoisted.
  `,
  depends: ['global-style', 'legacy-bundling'],
  flatten: true,
  value: (installStrategy, { globalStyle, legacyBundling }) => {
    return globalStyle ? 'shallow' : legacyBundling ? 'nested' : installStrategy
  },
})

define('json', {
  default: false,
  type: Types.Boolean,
  description: `
    Whether or not to output JSON data, rather than the normal output.

    * In \`npm pkg set\` it enables parsing set values with JSON.parse()
    before saving them to your \`package.json\`.

    Not supported by all npm commands.
  `,
  flatten: true,
})

define('key', {
  type: Types.String,
  description: `
    A client key to pass when accessing the registry.  Values should be in
    PEM format with newlines replaced by the string "\\n". For example:

    \`\`\`ini
    key="-----BEGIN PRIVATE KEY-----\\nXXXX\\nXXXX\\n-----END PRIVATE KEY-----"
    \`\`\`

    It is _not_ the path to a key file, though you can set a registry-scoped
    "keyfile" path like "//other-registry.tld/:keyfile=/path/to/key.pem".
  `,
  deprecated: `
    \`key\` and \`cert\` are no longer used for most registry operations.
    Use registry scoped \`keyfile\` and \`certfile\` instead.
    Example:
    //other-registry.tld/:keyfile=/path/to/key.pem
    //other-registry.tld/:certfile=/path/to/cert.crt
  `,
  flatten: true,
})

define('legacy-bundling', {
  default: false,
  type: Types.Boolean,
  description: `
    Instead of hoisting package installs in \`node_modules\`, install packages
    in the same manner that they are depended on. This may cause very deep
    directory structures and duplicate package installs as there is no
    de-duplicating.
    Sets \`--install-strategy=nested\`.
  `,
  deprecated: `
    This option has been deprecated in favor of \`--install-strategy=nested\`
  `,
})

define('legacy-peer-deps', {
  default: false,
  type: Types.Boolean,
  description: `
    Causes npm to completely ignore \`peerDependencies\` when building a
    package tree, as in npm versions 3 through 6.

    If a package cannot be installed because of overly strict
    \`peerDependencies\` that collide, it provides a way to move forward
    resolving the situation.

    This differs from \`--omit=peer\`, in that \`--omit=peer\` will avoid
    unpacking \`peerDependencies\` on disk, but will still design a tree such
    that \`peerDependencies\` _could_ be unpacked in a correct place.

    Use of \`legacy-peer-deps\` is not recommended, as it will not enforce
    the \`peerDependencies\` contract that meta-dependencies may rely on.
  `,
  flatten: true,
})

define('link', {
  default: false,
  type: Types.Boolean,
  description: `
    Used with \`npm ls\`, limiting output to only those packages that are
    linked.
  `,
})

define('local-address', {
  type: Types.IpAddress,
  description: `
    The IP address of the local interface to use when making connections to
    the npm registry.  Must be IPv4 in versions of Node prior to 0.12.
  `,
  flatten: true,
})

define('location', {
  key: 'location-raw',
  default: 'user',
  short: 'L',
  type: [
    'global',
    'user',
    'project',
  ],
  defaultDescription: `
    "user" unless \`--global\` is passed, which will also set this value to "global"
  `,
  description: `
    When passed to \`npm config\` this refers to which config file to use.

    When set to "global" mode, packages are installed into the \`prefix\` folder
    instead of the current working directory. See
    [folders](/configuring-npm/folders) for more on the differences in behavior.

    * packages are installed into the \`{prefix}/lib/node_modules\` folder,
      instead of the current working directory.
    * bin files are linked to \`{prefix}/bin\`
    * man pages are linked to \`{prefix}/share/man\`
  `,
})

define('lockfile-version', {
  type: Types.Values(1, 2, 3),
  defaultDescription: `
    Version 3 if no lockfile, auto-converting v1 lockfiles to v3, otherwise
    maintain current lockfile version.
  `,
  description: `
    Set the lockfile format version to be used in package-lock.json and
    npm-shrinkwrap-json files.  Possible options are:

    1: The lockfile version used by npm versions 5 and 6.  Lacks some data that
    is used during the install, resulting in slower and possibly less
    deterministic installs.  Prevents lockfile churn when interoperating with
    older npm versions.

    2: The default lockfile version used by npm version 7 and 8.  Includes both
    the version 1 lockfile data and version 3 lockfile data, for maximum
    determinism and interoperability, at the expense of more bytes on disk.

    3: Only the new lockfile information introduced in npm version 7.  Smaller
    on disk than lockfile version 2, but not interoperable with older npm
    versions.  Ideal if all users are on npm version 7 and higher.
  `,
  flatten: true,
})

define('loglevel', {
  default: 'notice',
  type: [
    'silent',
    'error',
    'warn',
    'notice',
    'http',
    'info',
    'verbose',
    'silly',
  ],
  short: {
    d: 'info',
    dd: 'verbose',
    ddd: 'silly',
    q: 'warn',
    s: 'silent',
  },
  alias: {
    quiet: 'warn',
    silent: 'silent',
    verbose: 'verbose',
  },
  description: `
    What level of logs to report.  All logs are written to a debug log,
    with the path to that file printed if the execution of a command fails.

    Any logs of a higher level than the setting are shown. The default is
    "notice".

    See also the \`foreground-scripts\` config.
  `,
})

define('logs-dir', {
  type: Types.Path,
  defaultDescription: `
    A directory named \`_logs\` inside the cache
  `,
  description: `
    The location of npm's log directory.  See [\`npm
    logging\`](/using-npm/logging) for more information.
  `,
  depends: ['cache-root'],
  flatten: true,
  value: (logsDir, { cacheRoot }) => {
    return logsDir ?? join(cacheRoot, '_logs')
  },
})

define('logs-max', {
  default: 10,
  type: Types.Number,
  description: `
    The maximum number of log files to store.

    If set to 0, no log files will be written for the current run.
  `,
})

define('long', {
  default: false,
  type: Types.Boolean,
  short: 'l',
  description: `
    Show extended information in \`ls\`, \`search\`, and \`help-search\`.
  `,
})

define('maxsockets', {
  default: 15,
  type: Types.Number,
  description: `
    The maximum number of connections to use per origin (protocol/host/port
    combination).
  `,
  flatten: 'max-sockets',
})

define('message', {
  default: '%s',
  type: Types.String,
  short: 'm',
  description: `
    Commit message which is used by \`npm version\` when creating version commit.

    Any "%s" in the message will be replaced with the version number.
  `,
  flatten: true,
})

define('node-options', {
  type: Types.String,
  description: `
    Options to pass through to Node.js via the \`NODE_OPTIONS\` environment
    variable.  This does not impact how npm itself is executed but it does
    impact how lifecycle scripts are called.
  `,
  setEnv: {
    // note: this doesn't afect the *current* node process, of course, since
    // it's already started, but it does affect the options passed to scripts.
    NODE_OPTIONS: true,
  },
})

define('noproxy', {
  defaultDescription: `
    The value of the NO_PROXY environment variable
  `,
  type: [Types.String, Types.CSV, Types.Array],
  description: `
    Domain extensions that should bypass any proxies.

    Also accepts a comma-delimited string.
  `,
  flatten: 'no-proxy',
})

define('offline', {
  default: false,
  type: Types.Boolean,
  description: `
    Force offline mode: no network requests will be done during install. To allow
    the CLI to fill in missing cache data, see \`--prefer-offline\`.
  `,
  flatten: true,
})

define('omit', {
  default: NODE_ENV === 'production' ? ['dev'] : [],
  defaultDescription: `
    'dev' if the \`NODE_ENV\` environment variable is set to 'production',
    otherwise empty.
  `,
  type: [Types.Array, 'prod', 'dev', 'optional', 'peer'],
  description: `
    Dependency types to omit from the installation tree on disk.

    Note that these dependencies _are_ still resolved and added to the
    \`package-lock.json\` or \`npm-shrinkwrap.json\` file.  They are just
    not physically installed on disk.

    If a package type appears in both the \`--include\` and \`--omit\`
    lists, then it will be included.

    If the resulting omit list includes \`'dev'\`, then the \`NODE_ENV\`
    environment variable will be set to \`'production'\` for all lifecycle
    scripts.
  `,
  depends: ['production', 'optional', 'only', 'include'],
  flatten: true,
  value: (omit, { production, optional, only, include }) => {
    const derived = [...omit]

    if (/^prod(uction)?$/.test(only) || production) {
      derived.push('dev')
    }

    if (optional === false) {
      derived.push('optional')
    }

    return [...new Set(derived)].filter(type => !include.includes(type))
  },
  setEnv: {
    NODE_ENV: (omit) => omit.includes('dev') ? 'production' : null,
  },
})

define('omit-lockfile-registry-resolved', {
  default: false,
  type: Types.Boolean,
  description: `
    This option causes npm to create lock files without a \`resolved\` key for
    registry dependencies. Subsequent installs will need to resolve tarball
    endpoints with the configured registry, likely resulting in a longer install
    time.
  `,
  flatten: true,
})

define('only', {
  type: ['prod', 'production'],
  deprecated: `
    Use \`--omit=dev\` to omit dev dependencies from the install.
  `,
  description: `
    When set to \`prod\` or \`production\`, this is an alias for
    \`--omit=dev\`.
  `,
})

define('optional', {
  type: Types.Boolean,
  deprecated: `
    Use \`--omit=optional\` to exclude optional dependencies, or
    \`--include=optional\` to include them.

    Default value does install optional deps unless otherwise omitted.
  `,
  description: `
    Alias for --include=optional or --omit=optional
  `,
})

define('otp', {
  type: Types.String,
  description: `
    This is a one-time password from a two-factor authenticator.  It's needed
    when publishing or changing package permissions with \`npm access\`.

    If not set, and a registry response fails with a challenge for a one-time
    password, npm will prompt on the command line for one.
  `,
})

define('package', {
  default: [],
  type: [Types.Spec, Types.Array],
  description: `
    The package or packages to install for [\`npm exec\`](/commands/npm-exec)
  `,
  flatten: true,
})

define('package-lock', {
  default: true,
  type: Types.Boolean,
  description: `
    If set to false, then ignore \`package-lock.json\` files when installing.
    This will also prevent _writing_ \`package-lock.json\` if \`save\` is
    true.
  `,
  deprecatedKey: 'shrinkwrap',
  depends: ['package-lock-only'],
  flatten: true,
  value: (packageLock, { shrinkwrap, packageLockOnly }) => {
    return packageLock || shrinkwrap || packageLockOnly
  },
})

define('package-lock-only', {
  default: false,
  type: Types.Boolean,
  description: `
    If set to true, the current operation will only use the \`package-lock.json\`,
    ignoring \`node_modules\`.

    For \`update\` this means only the \`package-lock.json\` will be updated,
    instead of checking \`node_modules\` and downloading dependencies.

    For \`list\` this means the output will be based on the tree described by the
    \`package-lock.json\`, rather than the contents of \`node_modules\`.
  `,
})

define('pack-destination', {
  default: '.',
  type: Types.String,
  description: `
    Directory in which \`npm pack\` will save tarballs.
  `,
  flatten: true,
})

define('parseable', {
  default: false,
  type: Types.Boolean,
  short: 'p',
  alias: 'porcelain',
  description: `
    Output parseable results from commands that write to standard output. For
    \`npm search\`, this will be tab-separated table format.
  `,
  flatten: true,
})

define('prefer-dedupe', {
  default: false,
  type: Types.Boolean,
  description: `
    Prefer to deduplicate packages if possible, rather than
    choosing a newer version of a dependency.
  `,
  flatten: true,
})

define('prefer-offline', {
  default: false,
  type: Types.Boolean,
  description: `
    If true, staleness checks for cached data will be bypassed, but missing
    data will be requested from the server. To force full offline mode, use
    \`--offline\`.
  `,
  depends: ['cache-min'],
  flatten: true,
  value: (preferOffline, { cacheMin }) => {
    return cacheMin >= 9999 ? true : preferOffline
  },
})

define('prefer-online', {
  default: false,
  type: Types.Boolean,
  description: `
    If true, staleness checks for cached data will be forced, making the CLI
    look for updates immediately even for fresh package data.
  `,
  depends: ['cache-max'],
  flatten: true,
  value: (preferOnline, { cacheMax }) => {
    return cacheMax <= 0 ? true : preferOnline
  },
})

define('prefix', {
  type: Types.Path,
  short: 'C',
  defaultDescription: `
    In global mode, the folder where the node executable is installed.
    Otherwise, the nearest parent folder containing either a package.json
    file or a node_modules folder.
  `,
  description: `
    The location to install global items.  If set on the command line, then
    it forces non-global commands to run in the specified folder.
  `,
  depends: ['default-global-prefix'],
  flatten: true,
  value: (prefix, { defaultGlobalPrefix }) => {
    return prefix ?? defaultGlobalPrefix
  },
})

define('preid', {
  hint: 'prerelease-id',
  type: Types.String,
  description: `
    The "prerelease identifier" to use as a prefix for the "prerelease" part
    of a semver. Like the \`rc\` in \`1.2.0-rc.8\`.
  `,
  flatten: true,
})

define('production', {
  type: Types.Boolean,
  deprecated: 'Use `--omit=dev` instead.',
  description: 'Alias for `--omit=dev`',
})

define('progress', {
  default: !(ciInfo.isCI || !StderrTTY || TERM === 'dumb'),
  defaultDescription: `
    \`true\` unless running in a known CI system
  `,
  type: Types.Boolean,
  description: `
    When set to \`true\`, npm will display a progress bar during time
    intensive operations, if \`process.stderr\` is a TTY.

    Set to \`false\` to suppress the progress bar.
  `,
  flatten: true,
})

define('provenance', {
  default: false,
  type: Types.Boolean,
  exclusive: ['provenance-file'],
  description: `
    When publishing from a supported cloud CI/CD system, the package will be
    publicly linked to where it was built and published from.
  `,
  flatten: true,
})

define('provenance-file', {
  type: Types.Path,
  hint: '<file>',
  exclusive: ['provenance'],
  description: `
    When publishing, the provenance bundle at the given path will be used.
  `,
  flatten: true,
})

define('proxy', {
  type: [false, Types.URL], // allow proxy to be disabled explicitly
  description: `
    A proxy to use for outgoing http requests. If the \`HTTP_PROXY\` or
    \`http_proxy\` environment variables are set, proxy settings will be
    honored by the underlying \`request\` library.
  `,
  flatten: true,
})

define('read-only', {
  default: false,
  type: Types.Boolean,
  alias: 'readonly',
  description: `
    This is used to mark a token as unable to publish when configuring
    limited access tokens with the \`npm token create\` command.
  `,
  flatten: true,
})

define('rebuild-bundle', {
  default: true,
  type: Types.Boolean,
  description: `
    Rebuild bundled dependencies after installation.
  `,
  flatten: true,
})

define('registry', {
  default: 'https://registry.npmjs.org/',
  type: Types.URL,
  alias: 'reg',
  description: `
    The base URL of the npm registry.
  `,
  flatten: true,
})

define('replace-registry-host', {
  default: 'npmjs',
  type: ['npmjs', 'never', 'always', Types.Hostname],
  description: `
    Defines behavior for replacing the registry host in a lockfile with the
    configured registry.

    The default behavior is to replace package dist URLs from the default
    registry (https://registry.npmjs.org) to the configured registry. If set to
    "never", then use the registry value. If set to "always", then replace the
    registry host with the configured host every time.

    You may also specify a bare hostname (e.g., "registry.npmjs.org").
  `,
  flatten: true,
})

define('save', {
  default: true,
  defaultDescription: `
    \`true\` unless when using \`npm update\` where it defaults to \`false\`
  `,
  usage: '--save-prod|--save-dev|--save-optional|--save-peer|--save-bundle',
  type: Types.Boolean,
  short: 'S',
  description: `
    Save installed packages to a \`package.json\` file as dependencies.

    When used with the \`npm rm\` command, removes the dependency from
    \`package.json\`.

    Will also prevent writing to \`package-lock.json\` if set to \`false\`.
  `,
  flatten: true,
})

define('save-bundle', {
  default: false,
  type: Types.Boolean,
  short: 'B',
  description: `
    If a package would be saved at install time by the use of \`--save\`,
    \`--save-dev\`, or \`--save-optional\`, then also put it in the
    \`bundleDependencies\` list.

    Ignored if \`--save-peer\` is set, since peerDependencies cannot be bundled.
  `,
  depends: ['save-peer'],
  flatten: true,
  value: (saveBundle, { savePeer }) => {
    // XXX update arborist to just ignore it if resulting saveType is peer
    // otherwise this won't have the expected effect:
    //
    // npm config set save-peer true
    // npm i foo --save-bundle --save-prod <-- should bundle
    return saveBundle && !savePeer
  },
})

// XXX: We should really deprecate all these `--save-blah` switches
// in favor of a single `--save-type` option.  The unfortunate shortcut
// we took for `--save-peer --save-optional` being `--save-type=peerOptional`
// makes this tricky, and likely a breaking change.

define('save-dev', {
  default: false,
  type: Types.Boolean,
  short: 'D',
  description: `
    Save installed packages to a package.json file as \`devDependencies\`.
  `,
})

define('save-exact', {
  default: false,
  type: Types.Boolean,
  short: 'E',
  description: `
    Dependencies saved to package.json will be configured with an exact
    version rather than using npm's default semver range operator.
  `,
})

define('save-optional', {
  default: false,
  type: Types.Boolean,
  short: 'O',
  description: `
    Save installed packages to a package.json file as
    \`optionalDependencies\`.
  `,
})

define('save-peer', {
  default: false,
  type: Types.Boolean,
  description: `
    Save installed packages to a package.json file as \`peerDependencies\`
  `,
})

define('save-prefix', {
  default: '^',
  type: Types.String,
  description: `
    Configure how versions of packages installed to a package.json file via
    \`--save\` or \`--save-dev\` get prefixed.

    For example if a package has version \`1.2.3\`, by default its version is
    set to \`^1.2.3\` which allows minor upgrades for that package, but after
    \`npm config set save-prefix='~'\` it would be set to \`~1.2.3\` which
    only allows patch upgrades.
  `,
  depends: ['save-exact'],
  flatten: true,
  value: (savePrefix, { saveExact }) => {
    return saveExact ? '' : savePrefix
  },
})

define('save-prod', {
  default: false,
  type: Types.Boolean,
  short: 'P',
  description: `
    Save installed packages into \`dependencies\` specifically. This is
    useful if a package already exists in \`devDependencies\` or
    \`optionalDependencies\`, but you want to move it to be a non-optional
    production dependency.

    This is the default behavior if \`--save\` is true, and neither
    \`--save-dev\` or \`--save-optional\` are true.
  `,
})

define('scope', {
  defaultDescription: `
    the scope of the current project, if any, or ""
  `,
  type: Types.Scope,
  description: `
    Associate an operation with a scope for a scoped registry.

    Useful when logging in to or out of a private registry:

    \`\`\`
    # log in, linking the scope to the custom registry
    npm login --scope=@mycorp --registry=https://registry.mycorp.com

    # log out, removing the link and the auth token
    npm logout --scope=@mycorp
    \`\`\`

    This will cause \`@mycorp\` to be mapped to the registry for future
    installation of packages specified according to the pattern
    \`@mycorp/package\`.

    This will also cause \`npm init\` to create a scoped package.

    \`\`\`
    # accept all defaults, and create a package named "@foo/whatever",
    # instead of just named "whatever"
    npm init --scope=@foo --yes
    \`\`\`
  `,
  flatten: [true, 'project-scope'],
})

define('script-shell', {
  type: Types.String,
  defaultDescription: `
    '/bin/sh' on POSIX systems, 'cmd.exe' on Windows
  `,
  description: `
    The shell to use for scripts run with the \`npm exec\`,
    \`npm run\` and \`npm init <package-spec>\` commands.
  `,
  flatten: true,
})

define('searchexclude', {
  type: Types.LowercaseString,
  description: `
    Space-separated options that limit the results from search.
  `,
  flatten: 'search.exclude',
})

define('searchlimit', {
  default: 20,
  type: Types.Number,
  description: `
    Number of items to limit search results to. Will not apply at all to
    legacy searches.
  `,
  flatten: 'search.limit',
})

define('searchopts', {
  type: Types.Querystring,
  description: `
    Space-separated options that are always passed to search.
  `,
  flatten: 'search.opts',
})

define('searchstaleness', {
  default: 15 * 60,
  type: Types.Number,
  description: `
    The age of the cache, in seconds, before another registry request is made
    if using legacy search endpoint.
  `,
  flatten: 'search.staleness',
})

define('shell', {
  default: Shell,
  defaultDescription: `
    SHELL environment variable, or "bash" on Posix, or "cmd.exe" on Windows
  `,
  type: Types.String,
  description: `
    The shell to run for the \`npm explore\` command.
  `,
  flatten: true,
})

define('sign-git-commit', {
  default: false,
  type: Types.Boolean,
  description: `
    If set to true, then the \`npm version\` command will commit the new
    package version using \`-S\` to add a signature.

    Note that git requires you to have set up GPG keys in your git configs
    for this to work properly.
  `,
  flatten: true,
})

define('sign-git-tag', {
  default: false,
  type: Types.Boolean,
  description: `
    If set to true, then the \`npm version\` command will tag the version
    using \`-s\` to add a signature.

    Note that git requires you to have set up GPG keys in your git configs
    for this to work properly.
  `,
  flatten: true,
})

define('strict-peer-deps', {
  default: false,
  type: Types.Boolean,
  description: `
    If set to \`true\`, and \`--legacy-peer-deps\` is not set, then _any_
    conflicting \`peerDependencies\` will be treated as an install failure,
    even if npm could reasonably guess the appropriate resolution based on
    non-peer dependency relationships.

    By default, conflicting \`peerDependencies\` deep in the dependency graph
    will be resolved using the nearest non-peer dependency specification,
    even if doing so will result in some packages receiving a peer dependency
    outside the range set in their package's \`peerDependencies\` object.

    When such an override is performed, a warning is printed, explaining the
    conflict and the packages involved.  If \`--strict-peer-deps\` is set,
    then this warning is treated as a failure.
  `,
  flatten: true,
})

define('strict-ssl', {
  default: true,
  type: Types.Boolean,
  description: `
    Whether or not to do SSL key validation when making requests to the
    registry via https.

    See also the \`ca\` config.
  `,
  flatten: true,
})

define('tag', {
  default: 'latest',
  type: Types.String,
  description: `
    If you ask npm to install a package and don't tell it a specific version,
    then it will install the specified tag.

    Also the tag that is added to the package@version specified by the \`npm
    tag\` command, if no explicit tag is given.

    When used by the \`npm diff\` command, this is the tag used to fetch the
    tarball that will be compared with the local files by default.
  `,
  flatten: 'default-tag',
})

define('tag-version-prefix', {
  default: 'v',
  type: Types.String,
  description: `
    If set, alters the prefix used when tagging a new version when performing
    a version increment using  \`npm version\`. To remove the prefix
    altogether, set it to the empty string: \`""\`.

    Because other tools may rely on the convention that npm version tags look
    like \`v1.0.0\`, _only use this property if it is absolutely necessary_.
    In particular, use care when overriding this setting for public packages.
  `,
  flatten: true,
})

define('timing', {
  default: false,
  type: Types.Boolean,
  description: `
    If true, writes timing information to a process specific json file in
    the cache or \`logs-dir\`. The file name ends with \`-timing.json\`.

    You can quickly view it with this [json](https://npm.im/json) command
    line: \`cat ~/.npm/_logs/*-timing.json | npm exec -- json -g\`.

    Timing information will also be reported in the terminal. To suppress this
    while still writing the timing file, use \`--silent\`.
  `,
})

define('umask', {
  default: 0,
  type: Types.Umask,
  description: `
    The "umask" value to use when setting the file creation mode on files and
    folders.

    Folders and executables are given a mode which is \`0o777\` masked
    against this value.  Other files are given a mode which is \`0o666\`
    masked against this value.

    Note that the underlying system will _also_ apply its own umask value to
    files and folders that are created, and npm does not circumvent this, but
    rather adds the \`--umask\` config to it.

    Thus, the effective default umask value on most POSIX systems is 0o22,
    meaning that folders and executables are created with a mode of 0o755 and
    other files are created with a mode of 0o644.
  `,
  flatten: true,
})

define('unicode', {
  default: Unicode,
  defaultDescription: `
    false on windows, true on mac/unix systems with a unicode locale, as
    defined by the \`LC_ALL\`, \`LC_CTYPE\`, or \`LANG\` environment variables.
  `,
  type: Types.Boolean,
  description: `
    When set to true, npm uses unicode characters in the tree output.  When
    false, it uses ascii characters instead of unicode glyphs.
  `,
  flatten: true,
})

define('update-notifier', {
  default: true,
  type: Types.Boolean,
  description: `
    Set to false to suppress the update notification when using an older
    version of npm than the latest.
  `,
})

define('usage', {
  default: false,
  type: Types.Boolean,
  short: ['?', 'H', 'h'],
  alias: 'help',
  description: `
    Show short usage output about the command specified.
  `,
})

define('user-agent', {
  default: 'npm/{npm-version} node/{node-version} {platform} {arch} workspaces/{workspaces} {ci}',
  type: Types.String,
  description: `
    Sets the User-Agent request header.  The following fields are replaced
    with their actual counterparts:

    * \`{npm-version}\` - The npm version in use
    * \`{node-version}\` - The Node.js version in use
    * \`{platform}\` - The value of \`process.platform\`
    * \`{arch}\` - The value of \`process.arch\`
    * \`{workspaces}\` - Set to \`true\` if the \`workspaces\` or \`workspace\`
      options are set.
    * \`{ci}\` - The value of the \`ci-name\` config, if set, prefixed with
      \`ci/\`, or an empty string if \`ci-name\` is empty.
  `,
  depends: [
    'ci-name',
    'workspaces-set',
    'npm-version',
    'node-version',
    'platform',
    'arch',
  ],
  flatten: true,
  value: (userAgent, {
    ciName,
    workspacesSet,
    npmVersion,
    nodeVersion,
    platform,
    arch,
  }) => {
    return userAgent
      .replace(/\{node-version\}/gi, nodeVersion)
      .replace(/\{npm-version\}/gi, npmVersion)
      .replace(/\{platform\}/gi, platform)
      .replace(/\{arch\}/gi, arch)
      .replace(/\{workspaces\}/gi, workspacesSet)
      .replace(/\{ci\}/gi, ciName ? `ci/${ciName}` : '')
      .replace(/\s+/gi, ' ')
      .trim()
  },
  setEnv: {
    npm_user_agent: true,
  },
})

define('userconfig', {
  default: '~/.npmrc',
  type: Types.Path,
  description: `
    The location of user-level configuration settings.

    This may be overridden by the \`npm_config_userconfig\` environment
    variable or the \`--userconfig\` command line option, but may _not_
    be overridden by settings in the \`globalconfig\` file.
  `,
  location: [Locations.cli, Locations.env, Locations.project],
})

define('version', {
  default: false,
  type: Types.Boolean,
  short: 'v',
  description: `
    If true, output the npm version and exit successfully.

    Only relevant when specified explicitly on the command line.
  `,
  location: Locations.cli,
})

define('versions', {
  default: false,
  type: Types.Boolean,
  description: `
    If true, output the npm version as well as node's \`process.versions\`
    map and the version in the current working directory's \`package.json\`
    file if one exists, and exit successfully.

    Only relevant when specified explicitly on the command line.
  `,
  location: Locations.cli,
})

define('viewer', {
  default: IsWindows ? 'browser' : 'man',
  defaultDescription: `
    "man" on Posix, "browser" on Windows
  `,
  type: Types.String,
  description: `
    The program to use to view help content.

    Set to \`"browser"\` to view html help content in the default web browser.
  `,
})

define('which', {
  type: Types.PositiveInteger,
  description: `
    If there are multiple funding sources, which 1-indexed source URL to open.
  `,
})

define('workspace', {
  default: [],
  type: [Types.String, Types.Array],
  hint: ['workspace-name', 'workspace-path'],
  short: 'w',
  envExport: false,
  description: `
    Enable running a command in the context of the configured workspaces of the
    current project while filtering by running only the workspaces defined by
    this configuration option.

    Valid values for the \`workspace\` config are either:

    * Workspace names
    * Path to a workspace directory
    * Path to a parent workspace directory (will result in selecting all
      workspaces within that folder)

    When set for the \`npm init\` command, this may be set to the folder of
    a workspace which does not yet exist, to create the folder and set it
    up as a brand new workspace within the project.
  `,
})

define('workspaces', {
  type: Types.Boolean,
  short: 'ws',
  envExport: false,
  description: `
    Set to true to run the command in the context of **all** configured
    workspaces.

    Explicitly setting this to false will cause commands like \`install\` to
    ignore workspaces altogether.
    When not set explicitly:

    - Commands that operate on the \`node_modules\` tree (install, update,
      etc.) will link workspaces into the \`node_modules\` folder.
    - Commands that do other things (test, exec, publish, etc.) will operate
      on the root project, _unless_ one or more workspaces are specified in
      the \`workspace\` config.
  `,
})

define('workspaces-update', {
  default: true,
  type: Types.Boolean,
  description: `
    If set to true, the npm cli will run an update after operations that may
    possibly change the workspaces installed to the \`node_modules\` folder.
  `,
  flatten: true,
})

define('yes', {
  type: Types.Boolean,
  short: {
    y: true,
    n: false,
  },
  alias: {
    no: false,
  },
  description: `
    Automatically answer "yes" to any prompts that npm might print on
    the command line.
  `,
})
