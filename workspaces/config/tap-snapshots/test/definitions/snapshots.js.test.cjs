/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/definitions/snapshots.js TAP basic > must match snapshot 1`] = `
Array [
  "definitions",
  "definitionKeys",
  "defaults",
  "types",
  "values",
  "valueKeys",
  "shorthands",
  "shortKeys",
  "derived",
  "derivedKeys",
  "LocationEntries",
  "Locations",
  "typeDefs",
  "Types",
  "getType",
  "updateType",
]
`

exports[`test/definitions/snapshots.js TAP definitions _auth > must match snapshot 1`] = `
#### \`_auth\`

* Default: null
* Type: null or String

A basic-auth string to use when authenticating against the npm registry.
This will ONLY be used to authenticate against the npm registry. For other
registries you will need to scope it like "//other-registry.tld/:_auth"

Warning: This should generally not be set via a command-line option. It is
safer to use a registry-provided authentication bearer token stored in the
~/.npmrc file by running \`npm login\`.
----------------------------------------
USAGE: --_auth <_auth>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(String)
----------------------------------------
DERIVED: _auth
`

exports[`test/definitions/snapshots.js TAP definitions access > must match snapshot 1`] = `
#### \`access\`

* Default: 'public' for new packages, existing packages it will not change the
  current level
* Type: null, "restricted", or "public"

If do not want your scoped package to be publicly viewable (and installable)
set \`--access=restricted\`.

Unscoped packages can not be set to \`restricted\`.

Note: This defaults to not changing the current access level for existing
packages. Specifying a value of \`restricted\` or \`public\` during publish will
change the access for an existing package the same way that \`npm access set
status\` would.
----------------------------------------
USAGE: --access <restricted|public>
----------------------------------------
INVALID: Must be one of: "restricted", "public"
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,restricted,public
----------------------------------------
DERIVED: access
`

exports[`test/definitions/snapshots.js TAP definitions all > must match snapshot 1`] = `
#### \`all\`

* Default: false
* Type: Boolean

When running \`npm outdated\` and \`npm ls\`, setting \`--all\` will show all
outdated or installed packages, rather than only those directly depended
upon by the current project.
----------------------------------------
USAGE: -a|--all
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: all
`

exports[`test/definitions/snapshots.js TAP definitions allow-same-version > must match snapshot 1`] = `
#### \`allow-same-version\`

* Default: false
* Type: Boolean

Prevents throwing an error when \`npm version\` is used to set the new version
to the same value as the current version.
----------------------------------------
USAGE: --allow-same-version
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: allowSameVersion
`

exports[`test/definitions/snapshots.js TAP definitions also > must match snapshot 1`] = `
#### \`also\`

* Default: null
* Type: null, "dev", or "development"
* DEPRECATED: Please use --include=dev instead.

When set to \`dev\` or \`development\`, this is an alias for \`--include=dev\`.
----------------------------------------
USAGE: --also <dev|development>
----------------------------------------
INVALID: Must be one of: "dev", "development"
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,dev,development
----------------------------------------
DERIVED: omit,include
`

exports[`test/definitions/snapshots.js TAP definitions audit > must match snapshot 1`] = `
#### \`audit\`

* Default: true
* Type: Boolean

When "true" submit audit reports alongside the current npm command to the
default registry and all registries configured for scopes. See the
documentation for [\`npm audit\`](/commands/npm-audit) for details on what is
submitted.
----------------------------------------
USAGE: --no-audit
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: audit
`

exports[`test/definitions/snapshots.js TAP definitions audit-level > must match snapshot 1`] = `
#### \`audit-level\`

* Default: null
* Type: null, "info", "low", "moderate", "high", "critical", or "none"

The minimum level of vulnerability for \`npm audit\` to exit with a non-zero
exit code.
----------------------------------------
USAGE: --audit-level <info|low|moderate|high|critical|none>
----------------------------------------
INVALID: Must be one of: "info", "low", "moderate", "high", "critical", "none"
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,info,low,moderate,high,critical,none
----------------------------------------
DERIVED: auditLevel
`

exports[`test/definitions/snapshots.js TAP definitions auth-type > must match snapshot 1`] = `
#### \`auth-type\`

* Default: "web"
* Type: "legacy" or "web"

What authentication strategy to use with \`login\`.
----------------------------------------
USAGE: --auth-type <legacy|web>
----------------------------------------
INVALID: Must be one of: "legacy", "web"
----------------------------------------
DEFAULT: web
----------------------------------------
TYPES: legacy,web
----------------------------------------
DERIVED: authType
`

exports[`test/definitions/snapshots.js TAP definitions before > must match snapshot 1`] = `
#### \`before\`

* Default: null
* Type: null or Date

If passed to \`npm install\`, will rebuild the npm tree such that only
versions that were available **on or before** the \`--before\` time get
installed. If there's no versions available for the current set of direct
dependencies, the command will error.

If the requested version is a \`dist-tag\` and the given tag does not pass the
\`--before\` filter, the most recent version less than or equal to that tag
will be used. For example, \`foo@latest\` might install \`foo@1.2\` even though
\`latest\` is \`2.0\`.
----------------------------------------
USAGE: --before <before>
----------------------------------------
INVALID: Must be a valid Date string
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(Date)
----------------------------------------
DERIVED: before
`

exports[`test/definitions/snapshots.js TAP definitions bin-links > must match snapshot 1`] = `
#### \`bin-links\`

* Default: true
* Type: Boolean

Tells npm to create symlinks (or \`.cmd\` shims on Windows) for package
executables.

Set to false to have it not do this. This can be used to work around the
fact that some file systems don't support symlinks, even on ostensibly Unix
systems.
----------------------------------------
USAGE: --no-bin-links
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: binLinks
`

exports[`test/definitions/snapshots.js TAP definitions browser > must match snapshot 1`] = `
#### \`browser\`

* Default: OS X: \`"open"\`, Windows: \`"start"\`, Others: \`"xdg-open"\`
* Type: null, Boolean, or String

The browser that is called by npm commands to open websites.

Set to \`false\` to suppress browser behavior and instead print urls to
terminal.

Set to \`true\` to use default system URL opener.
----------------------------------------
USAGE: --no-browser|--browser <browser>
----------------------------------------
INVALID: Must be one of: a boolean value (true or false), a string
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(BooleanOrString)
----------------------------------------
DERIVED: browser
`

exports[`test/definitions/snapshots.js TAP definitions ca > must match snapshot 1`] = `
#### \`ca\`

* Default: null
* Type: null or String (can be set multiple times)

The Certificate Authority signing certificate that is trusted for SSL
connections to the registry. Values should be in PEM format (Windows calls
it "Base-64 encoded X.509 (.CER)") with newlines replaced by the string
"\\n". For example:

\`\`\`ini
ca="-----BEGIN CERTIFICATE-----\\nXXXX\\nXXXX\\n-----END CERTIFICATE-----"
\`\`\`

Set to \`null\` to only allow "known" registrars, or to a specific CA cert to
trust only that specific signing authority.

Multiple CAs can be trusted by specifying an array of certificates:

\`\`\`ini
ca[]="..."
ca[]="..."
\`\`\`

See also the \`strict-ssl\` config.
----------------------------------------
USAGE: --ca <ca> [--ca <ca> ...]
----------------------------------------
INVALID: Must be one or more a string
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(String),Symbol(Array)
----------------------------------------
DERIVED: ca
`

exports[`test/definitions/snapshots.js TAP definitions cache > must match snapshot 1`] = `
#### \`cache\`

* Default: Windows: \`%LocalAppData%\\npm-cache\`, Posix: \`~/.npm\`
* Type: Path

The location of npm's cache directory.
----------------------------------------
USAGE: --cache <cache>
----------------------------------------
INVALID: Must be a valid filesystem path
----------------------------------------
DEFAULT: ~/.npm
----------------------------------------
TYPES: Symbol(Path)
----------------------------------------
DERIVED: cache,npxCache,logsDir
`

exports[`test/definitions/snapshots.js TAP definitions cache-max > must match snapshot 1`] = `
#### \`cache-max\`

* Default: Infinity
* Type: Number
* DEPRECATED: This option has been deprecated in favor of \`--prefer-online\`

\`--cache-max=0\` is an alias for \`--prefer-online\`
----------------------------------------
USAGE: --cache-max <number>
----------------------------------------
INVALID: Must be a numeric value
----------------------------------------
DEFAULT: Infinity
----------------------------------------
TYPES: Symbol(Number)
----------------------------------------
DERIVED: preferOnline
`

exports[`test/definitions/snapshots.js TAP definitions cache-min > must match snapshot 1`] = `
#### \`cache-min\`

* Default: 0
* Type: Number
* DEPRECATED: This option has been deprecated in favor of \`--prefer-offline\`.

\`--cache-min=9999 (or bigger)\` is an alias for \`--prefer-offline\`.
----------------------------------------
USAGE: --cache-min <number>
----------------------------------------
INVALID: Must be a numeric value
----------------------------------------
DEFAULT: 0
----------------------------------------
TYPES: Symbol(Number)
----------------------------------------
DERIVED: preferOffline
`

exports[`test/definitions/snapshots.js TAP definitions cafile > must match snapshot 1`] = `
#### \`cafile\`

* Default: null
* Type: null or Path

A path to a file containing one or multiple Certificate Authority signing
certificates. Similar to the \`ca\` setting, but allows for multiple CA's, as
well as for the CA information to be stored in a file on disk.
----------------------------------------
USAGE: --cafile <cafile>
----------------------------------------
INVALID: Must be a valid filesystem path
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(Path)
----------------------------------------
DERIVED: ca
`

exports[`test/definitions/snapshots.js TAP definitions call > must match snapshot 1`] = `
#### \`call\`

* Default: ""
* Type: String

Optional companion option for \`npm exec\`, \`npx\` that allows for specifying a
custom command to be run along with the installed packages.

\`\`\`bash
npm exec --package yo --package generator-node --call "yo node"
\`\`\`
----------------------------------------
USAGE: -c|--call <call>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: call
`

exports[`test/definitions/snapshots.js TAP definitions cert > must match snapshot 1`] = `
#### \`cert\`

* Default: null
* Type: null or String
* DEPRECATED: \`key\` and \`cert\` are no longer used for most registry
  operations. Use registry scoped \`keyfile\` and \`certfile\` instead. Example:
  //other-registry.tld/:keyfile=/path/to/key.pem
  //other-registry.tld/:certfile=/path/to/cert.crt

A client certificate to pass when accessing the registry. Values should be
in PEM format (Windows calls it "Base-64 encoded X.509 (.CER)") with
newlines replaced by the string "\\n". For example:

\`\`\`ini
cert="-----BEGIN CERTIFICATE-----\\nXXXX\\nXXXX\\n-----END CERTIFICATE-----"
\`\`\`

It is _not_ the path to a certificate file, though you can set a
registry-scoped "certfile" path like
"//other-registry.tld/:certfile=/path/to/cert.pem".
----------------------------------------
USAGE: --cert <cert>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(String)
----------------------------------------
DERIVED: cert
`

exports[`test/definitions/snapshots.js TAP definitions ci-name > must match snapshot 1`] = `
#### \`ci-name\`

* Default: The name of the current CI system, or \`null\` when not on a known CI
  platform.
* Type: null or String

The name of a continuous integration system. If not set explicitly, npm will
detect the current CI environment using the
[\`ci-info\`](http://npm.im/ci-info) module.
----------------------------------------
USAGE: --ci-name <ci-name>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(String)
----------------------------------------
DERIVED: ciName,userAgent
`

exports[`test/definitions/snapshots.js TAP definitions cidr > must match snapshot 1`] = `
#### \`cidr\`

* Default: null
* Type: null or String (can be set multiple times)

This is a list of CIDR address to be used when configuring limited access
tokens with the \`npm token create\` command.
----------------------------------------
USAGE: --cidr <cidr> [--cidr <cidr> ...]
----------------------------------------
INVALID: Must be one or more a string
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(String),Symbol(Array)
----------------------------------------
DERIVED: cidr
`

exports[`test/definitions/snapshots.js TAP definitions color > must match snapshot 1`] = `
#### \`color\`

* Default: true unless the NO_COLOR environ is set to something other than '0'
* Type: "always" or Boolean

If false, never shows colors. If \`"always"\` then always shows colors. If
true, then only prints color codes for tty file descriptors.
----------------------------------------
USAGE: --no-color <always|color>
----------------------------------------
INVALID: Must be one of: "always", a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: always,Symbol(Boolean)
----------------------------------------
DERIVED: color,logColor
`

exports[`test/definitions/snapshots.js TAP definitions commit-hooks > must match snapshot 1`] = `
#### \`commit-hooks\`

* Default: true
* Type: Boolean

Run git commit hooks when using the \`npm version\` command.
----------------------------------------
USAGE: --no-commit-hooks
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: commitHooks
`

exports[`test/definitions/snapshots.js TAP definitions depth > must match snapshot 1`] = `
#### \`depth\`

* Default: \`Infinity\` if \`--all\` is set, otherwise \`1\`
* Type: null or Number

The depth to go when recursing packages for \`npm ls\`.

If not set, \`npm ls\` will show only the immediate dependencies of the root
project. If \`--all\` is set, then npm will show all dependencies by default.
----------------------------------------
USAGE: --depth <number>
----------------------------------------
INVALID: Must be a numeric value
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(Number)
----------------------------------------
DERIVED: depth
`

exports[`test/definitions/snapshots.js TAP definitions description > must match snapshot 1`] = `
#### \`description\`

* Default: true
* Type: Boolean

Show the description in \`npm search\`
----------------------------------------
USAGE: --no-description
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: search.description
`

exports[`test/definitions/snapshots.js TAP definitions dev > must match snapshot 1`] = `
#### \`dev\`

* Default: false
* Type: Boolean
* DEPRECATED: Please use --include=dev instead.

Alias for \`--include=dev\`.
----------------------------------------
USAGE: --dev
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: omit,include
`

exports[`test/definitions/snapshots.js TAP definitions diff > must match snapshot 1`] = `
#### \`diff\`

* Default: []
* Type: Spec (can be set multiple times)

Define arguments to compare in \`npm diff\`.
----------------------------------------
USAGE: --diff <package-spec> [--diff <package-spec> ...]
----------------------------------------
INVALID: Must be one or more an npm package spec
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(Spec),Symbol(Array)
----------------------------------------
DERIVED: diff
`

exports[`test/definitions/snapshots.js TAP definitions diff-dst-prefix > must match snapshot 1`] = `
#### \`diff-dst-prefix\`

* Default: "b/"
* Type: String

Destination prefix to be used in \`npm diff\` output.
----------------------------------------
USAGE: --diff-dst-prefix <diff-dst-prefix>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: b/
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: diffDstPrefix
`

exports[`test/definitions/snapshots.js TAP definitions diff-ignore-all-space > must match snapshot 1`] = `
#### \`diff-ignore-all-space\`

* Default: false
* Type: Boolean

Ignore whitespace when comparing lines in \`npm diff\`.
----------------------------------------
USAGE: --diff-ignore-all-space
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: diffIgnoreAllSpace
`

exports[`test/definitions/snapshots.js TAP definitions diff-name-only > must match snapshot 1`] = `
#### \`diff-name-only\`

* Default: false
* Type: Boolean

Prints only filenames when using \`npm diff\`.
----------------------------------------
USAGE: --diff-name-only
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: diffNameOnly
`

exports[`test/definitions/snapshots.js TAP definitions diff-no-prefix > must match snapshot 1`] = `
#### \`diff-no-prefix\`

* Default: false
* Type: Boolean

Do not show any source or destination prefix in \`npm diff\` output.

Note: this causes \`npm diff\` to ignore the \`--diff-src-prefix\` and
\`--diff-dst-prefix\` configs.
----------------------------------------
USAGE: --diff-no-prefix
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: diffNoPrefix
`

exports[`test/definitions/snapshots.js TAP definitions diff-src-prefix > must match snapshot 1`] = `
#### \`diff-src-prefix\`

* Default: "a/"
* Type: String

Source prefix to be used in \`npm diff\` output.
----------------------------------------
USAGE: --diff-src-prefix <diff-src-prefix>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: a/
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: diffSrcPrefix
`

exports[`test/definitions/snapshots.js TAP definitions diff-text > must match snapshot 1`] = `
#### \`diff-text\`

* Default: false
* Type: Boolean

Treat all files as text in \`npm diff\`.
----------------------------------------
USAGE: --diff-text
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: diffText
`

exports[`test/definitions/snapshots.js TAP definitions diff-unified > must match snapshot 1`] = `
#### \`diff-unified\`

* Default: 3
* Type: Number

The number of lines of context to print in \`npm diff\`.
----------------------------------------
USAGE: --diff-unified <number>
----------------------------------------
INVALID: Must be a numeric value
----------------------------------------
DEFAULT: 3
----------------------------------------
TYPES: Symbol(Number)
----------------------------------------
DERIVED: diffUnified
`

exports[`test/definitions/snapshots.js TAP definitions dry-run > must match snapshot 1`] = `
#### \`dry-run\`

* Default: false
* Type: Boolean

Indicates that you don't want npm to make any changes and that it should
only report what it would have done. This can be passed into any of the
commands that modify your local installation, eg, \`install\`, \`update\`,
\`dedupe\`, \`uninstall\`, as well as \`pack\` and \`publish\`.

Note: This is NOT honored by other network related commands, eg \`dist-tags\`,
\`owner\`, etc.
----------------------------------------
USAGE: --dry-run
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: dryRun
`

exports[`test/definitions/snapshots.js TAP definitions editor > must match snapshot 1`] = `
#### \`editor\`

* Default: The EDITOR or VISUAL environment variables, or
  '%SYSTEMROOT%\\notepad.exe' on Windows, or 'vi' on Unix systems
* Type: String

The command to run for \`npm edit\` and \`npm config edit\`.
----------------------------------------
USAGE: --editor <editor>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: code -r -w
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: editor
`

exports[`test/definitions/snapshots.js TAP definitions engine-strict > must match snapshot 1`] = `
#### \`engine-strict\`

* Default: false
* Type: Boolean

If set to true, then npm will stubbornly refuse to install (or even consider
installing) any package that claims to not be compatible with the current
Node.js version.

This can be overridden by setting the \`--force\` flag.
----------------------------------------
USAGE: --engine-strict
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: engineStrict
`

exports[`test/definitions/snapshots.js TAP definitions fetch-retries > must match snapshot 1`] = `
#### \`fetch-retries\`

* Default: 2
* Type: Number

The "retries" config for the \`retry\` module to use when fetching packages
from the registry.

npm will retry idempotent read requests to the registry in the case of
network failures or 5xx HTTP errors.
----------------------------------------
USAGE: --fetch-retries <number>
----------------------------------------
INVALID: Must be a numeric value
----------------------------------------
DEFAULT: 2
----------------------------------------
TYPES: Symbol(Number)
----------------------------------------
DERIVED: retry.retries
`

exports[`test/definitions/snapshots.js TAP definitions fetch-retry-factor > must match snapshot 1`] = `
#### \`fetch-retry-factor\`

* Default: 10
* Type: Number

The "factor" config for the \`retry\` module to use when fetching packages.
----------------------------------------
USAGE: --fetch-retry-factor <number>
----------------------------------------
INVALID: Must be a numeric value
----------------------------------------
DEFAULT: 10
----------------------------------------
TYPES: Symbol(Number)
----------------------------------------
DERIVED: retry.factor
`

exports[`test/definitions/snapshots.js TAP definitions fetch-retry-maxtimeout > must match snapshot 1`] = `
#### \`fetch-retry-maxtimeout\`

* Default: 60000 (1 minute)
* Type: Number

The "maxTimeout" config for the \`retry\` module to use when fetching
packages.
----------------------------------------
USAGE: --fetch-retry-maxtimeout <number>
----------------------------------------
INVALID: Must be a numeric value
----------------------------------------
DEFAULT: 60000
----------------------------------------
TYPES: Symbol(Number)
----------------------------------------
DERIVED: retry.maxTimeout
`

exports[`test/definitions/snapshots.js TAP definitions fetch-retry-mintimeout > must match snapshot 1`] = `
#### \`fetch-retry-mintimeout\`

* Default: 10000 (10 seconds)
* Type: Number

The "minTimeout" config for the \`retry\` module to use when fetching
packages.
----------------------------------------
USAGE: --fetch-retry-mintimeout <number>
----------------------------------------
INVALID: Must be a numeric value
----------------------------------------
DEFAULT: 10000
----------------------------------------
TYPES: Symbol(Number)
----------------------------------------
DERIVED: retry.minTimeout
`

exports[`test/definitions/snapshots.js TAP definitions fetch-timeout > must match snapshot 1`] = `
#### \`fetch-timeout\`

* Default: 300000 (5 minutes)
* Type: Number

The maximum amount of time to wait for HTTP requests to complete.
----------------------------------------
USAGE: --fetch-timeout <number>
----------------------------------------
INVALID: Must be a numeric value
----------------------------------------
DEFAULT: 300000
----------------------------------------
TYPES: Symbol(Number)
----------------------------------------
DERIVED: timeout
`

exports[`test/definitions/snapshots.js TAP definitions force > must match snapshot 1`] = `
#### \`force\`

* Default: false
* Type: Boolean

Removes various protections against unfortunate side effects, common
mistakes, unnecessary performance degradation, and malicious input.

* Allow clobbering non-npm files in global installs.
* Allow the \`npm version\` command to work on an unclean git repository.
* Allow deleting the cache folder with \`npm cache clean\`.
* Allow installing packages that have an \`engines\` declaration requiring a
  different version of npm.
* Allow installing packages that have an \`engines\` declaration requiring a
  different version of \`node\`, even if \`--engine-strict\` is enabled.
* Allow \`npm audit fix\` to install modules outside your stated dependency
  range (including SemVer-major changes).
* Allow unpublishing all versions of a published package.
* Allow conflicting peerDependencies to be installed in the root project.
* Implicitly set \`--yes\` during \`npm init\`.
* Allow clobbering existing values in \`npm pkg\`
* Allow unpublishing of entire packages (not just a single version).

If you don't have a clear idea of what you want to do, it is strongly
recommended that you do not use this option!
----------------------------------------
USAGE: -f|--force
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: force
`

exports[`test/definitions/snapshots.js TAP definitions foreground-scripts > must match snapshot 1`] = `
#### \`foreground-scripts\`

* Default: false
* Type: Boolean

Run all build scripts (ie, \`preinstall\`, \`install\`, and \`postinstall\`)
scripts for installed packages in the foreground process, sharing standard
input, output, and error with the main npm process.

Note that this will generally make installs run slower, and be much noisier,
but can be useful for debugging.
----------------------------------------
USAGE: --foreground-scripts
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: foregroundScripts
`

exports[`test/definitions/snapshots.js TAP definitions format-package-lock > must match snapshot 1`] = `
#### \`format-package-lock\`

* Default: true
* Type: Boolean

Format \`package-lock.json\` or \`npm-shrinkwrap.json\` as a human readable
file.
----------------------------------------
USAGE: --no-format-package-lock
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: formatPackageLock
`

exports[`test/definitions/snapshots.js TAP definitions fund > must match snapshot 1`] = `
#### \`fund\`

* Default: true
* Type: Boolean

When "true" displays the message at the end of each \`npm install\`
acknowledging the number of dependencies looking for funding. See [\`npm
fund\`](/commands/npm-fund) for details.
----------------------------------------
USAGE: --no-fund
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: fund
`

exports[`test/definitions/snapshots.js TAP definitions git > must match snapshot 1`] = `
#### \`git\`

* Default: "git"
* Type: String

The command to use for git commands. If git is installed on the computer,
but is not in the \`PATH\`, then set this to the full path to the git binary.
----------------------------------------
USAGE: --git <git>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: git
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: git
`

exports[`test/definitions/snapshots.js TAP definitions git-tag-version > must match snapshot 1`] = `
#### \`git-tag-version\`

* Default: true
* Type: Boolean

Tag the commit when using the \`npm version\` command. Setting this to false
results in no commit being made at all.
----------------------------------------
USAGE: --no-git-tag-version
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: gitTagVersion
`

exports[`test/definitions/snapshots.js TAP definitions global > must match snapshot 1`] = `
#### \`global\`

* Default: false
* Type: Boolean

Operates in "global" mode, so that packages are installed into the \`prefix\`
folder instead of the current working directory. See
[folders](/configuring-npm/folders) for more on the differences in behavior.

* packages are installed into the \`{prefix}/lib/node_modules\` folder, instead
  of the current working directory.
* bin files are linked to \`{prefix}/bin\`
* man pages are linked to \`{prefix}/share/man\`
----------------------------------------
USAGE: -g|--global
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: global,location,localPrefix
`

exports[`test/definitions/snapshots.js TAP definitions global-style > must match snapshot 1`] = `
#### \`global-style\`

* Default: false
* Type: Boolean
* DEPRECATED: This option has been deprecated in favor of
  \`--install-strategy=shallow\`

Only install direct dependencies in the top level \`node_modules\`, but hoist
on deeper dependendencies. Sets \`--install-strategy=shallow\`.
----------------------------------------
USAGE: --global-style
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: installStrategy
`

exports[`test/definitions/snapshots.js TAP definitions globalconfig > must match snapshot 1`] = `
#### \`globalconfig\`

* Default: The global --prefix setting plus 'etc/npmrc'. For example,
  '/usr/local/etc/npmrc'
* Type: null or Path

The config file to read for global config options.
----------------------------------------
USAGE: --globalconfig <globalconfig>
----------------------------------------
INVALID: Must be a valid filesystem path
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(Path)
----------------------------------------
DERIVED: globalconfig,prefix,globalPrefix
`

exports[`test/definitions/snapshots.js TAP definitions heading > must match snapshot 1`] = `
#### \`heading\`

* Default: "npm"
* Type: String

The string that starts all the debugging log output.
----------------------------------------
USAGE: --heading <heading>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: npm
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: heading
`

exports[`test/definitions/snapshots.js TAP definitions https-proxy > must match snapshot 1`] = `
#### \`https-proxy\`

* Default: null
* Type: null or URL

A proxy to use for outgoing https requests. If the \`HTTPS_PROXY\` or
\`https_proxy\` or \`HTTP_PROXY\` or \`http_proxy\` environment variables are set,
proxy settings will be honored by the underlying \`make-fetch-happen\`
library.
----------------------------------------
USAGE: --https-proxy <https-proxy>
----------------------------------------
INVALID: Must be a full url with "http://"
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(URL)
----------------------------------------
DERIVED: httpsProxy
`

exports[`test/definitions/snapshots.js TAP definitions if-present > must match snapshot 1`] = `
#### \`if-present\`

* Default: false
* Type: Boolean

If true, npm will not exit with an error code when \`run-script\` is invoked
for a script that isn't defined in the \`scripts\` section of \`package.json\`.
This option can be used when it's desirable to optionally run a script when
it's present and fail if the script fails. This is useful, for example, when
running scripts that may only apply for some builds in an otherwise generic
CI setup.

This value is not exported to the environment for child processes.
----------------------------------------
USAGE: --if-present
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: ifPresent
`

exports[`test/definitions/snapshots.js TAP definitions ignore-scripts > must match snapshot 1`] = `
#### \`ignore-scripts\`

* Default: false
* Type: Boolean

If true, npm does not run scripts specified in package.json files.

Note that commands explicitly intended to run a particular script, such as
\`npm start\`, \`npm stop\`, \`npm restart\`, \`npm test\`, and \`npm run-script\`
will still run their intended script if \`ignore-scripts\` is set, but they
will *not* run any pre- or post-scripts.
----------------------------------------
USAGE: --ignore-scripts
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: ignoreScripts
`

exports[`test/definitions/snapshots.js TAP definitions include > must match snapshot 1`] = `
#### \`include\`

* Default: []
* Type: "prod", "dev", "optional", or "peer" (can be set multiple times)

Option that allows for defining which types of dependencies to install.

This is the inverse of \`--omit=<type>\`.

Dependency types specified in \`--include\` will not be omitted, regardless of
the order in which omit/include are specified on the command-line.
----------------------------------------
USAGE: --include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]
----------------------------------------
INVALID: Must be one or more of: "prod", "dev", "optional", "peer"
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(Array),prod,dev,optional,peer
----------------------------------------
DERIVED: omit,include
`

exports[`test/definitions/snapshots.js TAP definitions include-staged > must match snapshot 1`] = `
#### \`include-staged\`

* Default: false
* Type: Boolean

Allow installing "staged" published packages, as defined by [npm RFC PR
#92](https://github.com/npm/rfcs/pull/92).

This is experimental, and not implemented by the npm public registry.
----------------------------------------
USAGE: --include-staged
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: includeStaged
`

exports[`test/definitions/snapshots.js TAP definitions include-workspace-root > must match snapshot 1`] = `
#### \`include-workspace-root\`

* Default: false
* Type: Boolean

Include the workspace root when workspaces are enabled for a command.

When false, specifying individual workspaces via the \`workspace\` config, or
all workspaces via the \`workspaces\` flag, will cause npm to operate only on
the specified workspaces, and not on the root project.

This value is not exported to the environment for child processes.
----------------------------------------
USAGE: -iwr|--include-workspace-root
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: includeWorkspaceRoot
`

exports[`test/definitions/snapshots.js TAP definitions init-author-email > must match snapshot 1`] = `
#### \`init-author-email\`

* Default: ""
* Type: String

The value \`npm init\` should use by default for the package author's email.
----------------------------------------
USAGE: --init-author-email <init-author-email>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions init-author-name > must match snapshot 1`] = `
#### \`init-author-name\`

* Default: ""
* Type: String

The value \`npm init\` should use by default for the package author's name.
----------------------------------------
USAGE: --init-author-name <init-author-name>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions init-author-url > must match snapshot 1`] = `
#### \`init-author-url\`

* Default: ""
* Type: "" or URL

The value \`npm init\` should use by default for the package author's
homepage.
----------------------------------------
USAGE: --init-author-url <init-author-url>
----------------------------------------
INVALID: Must be a full url with "http://"
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: ,Symbol(URL)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions init-license > must match snapshot 1`] = `
#### \`init-license\`

* Default: "ISC"
* Type: String

The value \`npm init\` should use by default for the package license.
----------------------------------------
USAGE: --init-license <init-license>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: ISC
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions init-module > must match snapshot 1`] = `
#### \`init-module\`

* Default: "~/.npm-init.js"
* Type: Path

A module that will be loaded by the \`npm init\` command. See the
documentation for the
[init-package-json](https://github.com/npm/init-package-json) module for
more information, or [npm init](/commands/npm-init).
----------------------------------------
USAGE: --init-module <init-module>
----------------------------------------
INVALID: Must be a valid filesystem path
----------------------------------------
DEFAULT: ~/.npm-init.js
----------------------------------------
TYPES: Symbol(Path)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions init-version > must match snapshot 1`] = `
#### \`init-version\`

* Default: "1.0.0"
* Type: SemVer string

The value that \`npm init\` should use by default for the package version
number, if not already set in package.json.
----------------------------------------
USAGE: --init-version <init-version>
----------------------------------------
INVALID: Must be a full valid SemVer string
----------------------------------------
DEFAULT: 1.0.0
----------------------------------------
TYPES: Symbol(Semver)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions init.author.email > must match snapshot 1`] = `
#### \`init.author.email\`

* Default: ""
* Type: String
* DEPRECATED: Use \`--init-author-email\` instead.

Alias for \`--init-author-email\`
----------------------------------------
USAGE: --init.author.email <init.author.email>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions init.author.name > must match snapshot 1`] = `
#### \`init.author.name\`

* Default: ""
* Type: String
* DEPRECATED: Use \`--init-author-name\` instead.

Alias for \`--init-author-name\`
----------------------------------------
USAGE: --init.author.name <init.author.name>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions init.author.url > must match snapshot 1`] = `
#### \`init.author.url\`

* Default: ""
* Type: "" or URL
* DEPRECATED: Use \`--init-author-url\` instead.

Alias for \`--init-author-url\`
----------------------------------------
USAGE: --init.author.url <init.author.url>
----------------------------------------
INVALID: Must be a full url with "http://"
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: ,Symbol(URL)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions init.license > must match snapshot 1`] = `
#### \`init.license\`

* Default: "ISC"
* Type: String
* DEPRECATED: Use \`--init-license\` instead.

Alias for \`--init-license\`
----------------------------------------
USAGE: --init.license <init.license>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: ISC
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions init.module > must match snapshot 1`] = `
#### \`init.module\`

* Default: "~/.npm-init.js"
* Type: Path
* DEPRECATED: Use \`--init-module\` instead.

Alias for \`--init-module\`
----------------------------------------
USAGE: --init.module <init.module>
----------------------------------------
INVALID: Must be a valid filesystem path
----------------------------------------
DEFAULT: ~/.npm-init.js
----------------------------------------
TYPES: Symbol(Path)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions init.version > must match snapshot 1`] = `
#### \`init.version\`

* Default: "1.0.0"
* Type: SemVer string
* DEPRECATED: Use \`--init-version\` instead.

Alias for \`--init-version\`
----------------------------------------
USAGE: --init.version <init.version>
----------------------------------------
INVALID: Must be a full valid SemVer string
----------------------------------------
DEFAULT: 1.0.0
----------------------------------------
TYPES: Symbol(Semver)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions install-links > must match snapshot 1`] = `
#### \`install-links\`

* Default: true
* Type: Boolean

When set file: protocol dependencies will be packed and installed as regular
dependencies instead of creating a symlink. This option has no effect on
workspaces.
----------------------------------------
USAGE: --no-install-links
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: installLinks
`

exports[`test/definitions/snapshots.js TAP definitions install-strategy > must match snapshot 1`] = `
#### \`install-strategy\`

* Default: "hoisted"
* Type: "hoisted", "nested", or "shallow"

Sets the strategy for installing packages in node_modules. hoisted
(default): Install non-duplicated in top-level, and duplicated as necessary
within directory structure. nested: (formerly --legacy-bundling) install in
place, no hoisting. shallow (formerly --global-style) only install direct
deps at top-level. linked: (coming soon) install in node_modules/.store,
link in place, unhoisted.
----------------------------------------
USAGE: --install-strategy <hoisted|nested|shallow>
----------------------------------------
INVALID: Must be one of: "hoisted", "nested", "shallow"
----------------------------------------
DEFAULT: hoisted
----------------------------------------
TYPES: hoisted,nested,shallow
----------------------------------------
DERIVED: installStrategy
`

exports[`test/definitions/snapshots.js TAP definitions json > must match snapshot 1`] = `
#### \`json\`

* Default: false
* Type: Boolean

Whether or not to output JSON data, rather than the normal output.

* In \`npm pkg set\` it enables parsing set values with JSON.parse() before
  saving them to your \`package.json\`.

Not supported by all npm commands.
----------------------------------------
USAGE: --json
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: json
`

exports[`test/definitions/snapshots.js TAP definitions key > must match snapshot 1`] = `
#### \`key\`

* Default: null
* Type: null or String
* DEPRECATED: \`key\` and \`cert\` are no longer used for most registry
  operations. Use registry scoped \`keyfile\` and \`certfile\` instead. Example:
  //other-registry.tld/:keyfile=/path/to/key.pem
  //other-registry.tld/:certfile=/path/to/cert.crt

A client key to pass when accessing the registry. Values should be in PEM
format with newlines replaced by the string "\\n". For example:

\`\`\`ini
key="-----BEGIN PRIVATE KEY-----\\nXXXX\\nXXXX\\n-----END PRIVATE KEY-----"
\`\`\`

It is _not_ the path to a key file, though you can set a registry-scoped
"keyfile" path like "//other-registry.tld/:keyfile=/path/to/key.pem".
----------------------------------------
USAGE: --key <key>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(String)
----------------------------------------
DERIVED: key
`

exports[`test/definitions/snapshots.js TAP definitions legacy-bundling > must match snapshot 1`] = `
#### \`legacy-bundling\`

* Default: false
* Type: Boolean
* DEPRECATED: This option has been deprecated in favor of
  \`--install-strategy=nested\`

Instead of hoisting package installs in \`node_modules\`, install packages in
the same manner that they are depended on. This may cause very deep
directory structures and duplicate package installs as there is no
de-duplicating. Sets \`--install-strategy=nested\`.
----------------------------------------
USAGE: --legacy-bundling
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: installStrategy
`

exports[`test/definitions/snapshots.js TAP definitions legacy-peer-deps > must match snapshot 1`] = `
#### \`legacy-peer-deps\`

* Default: false
* Type: Boolean

Causes npm to completely ignore \`peerDependencies\` when building a package
tree, as in npm versions 3 through 6.

If a package cannot be installed because of overly strict \`peerDependencies\`
that collide, it provides a way to move forward resolving the situation.

This differs from \`--omit=peer\`, in that \`--omit=peer\` will avoid unpacking
\`peerDependencies\` on disk, but will still design a tree such that
\`peerDependencies\` _could_ be unpacked in a correct place.

Use of \`legacy-peer-deps\` is not recommended, as it will not enforce the
\`peerDependencies\` contract that meta-dependencies may rely on.
----------------------------------------
USAGE: --legacy-peer-deps
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: legacyPeerDeps
`

exports[`test/definitions/snapshots.js TAP definitions link > must match snapshot 1`] = `
#### \`link\`

* Default: false
* Type: Boolean

Used with \`npm ls\`, limiting output to only those packages that are linked.
----------------------------------------
USAGE: --link
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions local-address > must match snapshot 1`] = `
#### \`local-address\`

* Default: null
* Type: null or IP Address

The IP address of the local interface to use when making connections to the
npm registry. Must be IPv4 in versions of Node prior to 0.12.
----------------------------------------
USAGE: --local-address <local-address>
----------------------------------------
INVALID: Must be one of: {...LOCAL-IPS}
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(IpAddress)
----------------------------------------
DERIVED: localAddress
`

exports[`test/definitions/snapshots.js TAP definitions location > must match snapshot 1`] = `
#### \`location\`

* Default: "user" unless \`--global\` is passed, which will also set this value
  to "global"
* Type: "global", "user", or "project"

When passed to \`npm config\` this refers to which config file to use.

When set to "global" mode, packages are installed into the \`prefix\` folder
instead of the current working directory. See
[folders](/configuring-npm/folders) for more on the differences in behavior.

* packages are installed into the \`{prefix}/lib/node_modules\` folder, instead
  of the current working directory.
* bin files are linked to \`{prefix}/bin\`
* man pages are linked to \`{prefix}/share/man\`
----------------------------------------
USAGE: -L|--location <global|user|project>
----------------------------------------
INVALID: Must be one of: "global", "user", "project"
----------------------------------------
DEFAULT: user
----------------------------------------
TYPES: global,user,project
----------------------------------------
DERIVED: global,location,localPrefix
`

exports[`test/definitions/snapshots.js TAP definitions lockfile-version > must match snapshot 1`] = `
#### \`lockfile-version\`

* Default: Version 3 if no lockfile, auto-converting v1 lockfiles to v3,
  otherwise maintain current lockfile version.
* Type: null, 1, 2, or 3

Set the lockfile format version to be used in package-lock.json and
npm-shrinkwrap-json files. Possible options are:

1: The lockfile version used by npm versions 5 and 6. Lacks some data that
is used during the install, resulting in slower and possibly less
deterministic installs. Prevents lockfile churn when interoperating with
older npm versions.

2: The default lockfile version used by npm version 7 and 8. Includes both
the version 1 lockfile data and version 3 lockfile data, for maximum
determinism and interoperability, at the expense of more bytes on disk.

3: Only the new lockfile information introduced in npm version 7. Smaller on
disk than lockfile version 2, but not interoperable with older npm versions.
Ideal if all users are on npm version 7 and higher.
----------------------------------------
USAGE: --lockfile-version <lockfile-version>
----------------------------------------
INVALID: Must be one of: 1, 2, 3
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol([1,2,3])
----------------------------------------
DERIVED: lockfileVersion
`

exports[`test/definitions/snapshots.js TAP definitions loglevel > must match snapshot 1`] = `
#### \`loglevel\`

* Default: "notice"
* Type: "silent", "error", "warn", "notice", "http", "info", "verbose", or
  "silly"

What level of logs to report. All logs are written to a debug log, with the
path to that file printed if the execution of a command fails.

Any logs of a higher level than the setting are shown. The default is
"notice".

See also the \`foreground-scripts\` config.
----------------------------------------
USAGE: --loglevel <silent|error|warn|notice|http|info|verbose|silly>
----------------------------------------
INVALID: Must be one of: "silent", "error", "warn", "notice", "http", "info", "verbose", "silly"
----------------------------------------
DEFAULT: notice
----------------------------------------
TYPES: silent,error,warn,notice,http,info,verbose,silly
----------------------------------------
DERIVED: silent
`

exports[`test/definitions/snapshots.js TAP definitions logs-dir > must match snapshot 1`] = `
#### \`logs-dir\`

* Default: A directory named \`_logs\` inside the cache
* Type: null or Path

The location of npm's log directory. See [\`npm logging\`](/using-npm/logging)
for more information.
----------------------------------------
USAGE: --logs-dir <logs-dir>
----------------------------------------
INVALID: Must be a valid filesystem path
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(Path)
----------------------------------------
DERIVED: cache,npxCache,logsDir
`

exports[`test/definitions/snapshots.js TAP definitions logs-max > must match snapshot 1`] = `
#### \`logs-max\`

* Default: 10
* Type: Number

The maximum number of log files to store.

If set to 0, no log files will be written for the current run.
----------------------------------------
USAGE: --logs-max <number>
----------------------------------------
INVALID: Must be a numeric value
----------------------------------------
DEFAULT: 10
----------------------------------------
TYPES: Symbol(Number)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions long > must match snapshot 1`] = `
#### \`long\`

* Default: false
* Type: Boolean

Show extended information in \`ls\`, \`search\`, and \`help-search\`.
----------------------------------------
USAGE: -l|--long
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions maxsockets > must match snapshot 1`] = `
#### \`maxsockets\`

* Default: 15
* Type: Number

The maximum number of connections to use per origin (protocol/host/port
combination).
----------------------------------------
USAGE: --maxsockets <number>
----------------------------------------
INVALID: Must be a numeric value
----------------------------------------
DEFAULT: 15
----------------------------------------
TYPES: Symbol(Number)
----------------------------------------
DERIVED: maxSockets
`

exports[`test/definitions/snapshots.js TAP definitions message > must match snapshot 1`] = `
#### \`message\`

* Default: "%s"
* Type: String

Commit message which is used by \`npm version\` when creating version commit.

Any "%s" in the message will be replaced with the version number.
----------------------------------------
USAGE: -m|--message <message>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: %s
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: message
`

exports[`test/definitions/snapshots.js TAP definitions node-options > must match snapshot 1`] = `
#### \`node-options\`

* Default: null
* Type: null or String

Options to pass through to Node.js via the \`NODE_OPTIONS\` environment
variable. This does not impact how npm itself is executed but it does impact
how lifecycle scripts are called.
----------------------------------------
USAGE: --node-options <node-options>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(String)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions noproxy > must match snapshot 1`] = `
#### \`noproxy\`

* Default: The value of the NO_PROXY environment variable
* Type: String or Comma-delimited string (can be set multiple times)

Domain extensions that should bypass any proxies.

Also accepts a comma-delimited string.
----------------------------------------
USAGE: --noproxy <noproxy|noproxy> [--noproxy <noproxy|noproxy> ...]
----------------------------------------
INVALID: Must be one or more of: a string, a comma-delimited string
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(String),Symbol(CSV),Symbol(Array)
----------------------------------------
DERIVED: noProxy
`

exports[`test/definitions/snapshots.js TAP definitions offline > must match snapshot 1`] = `
#### \`offline\`

* Default: false
* Type: Boolean

Force offline mode: no network requests will be done during install. To
allow the CLI to fill in missing cache data, see \`--prefer-offline\`.
----------------------------------------
USAGE: --offline
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: offline
`

exports[`test/definitions/snapshots.js TAP definitions omit > must match snapshot 1`] = `
#### \`omit\`

* Default: 'dev' if the \`NODE_ENV\` environment variable is set to
  'production', otherwise empty.
* Type: "prod", "dev", "optional", or "peer" (can be set multiple times)

Dependency types to omit from the installation tree on disk.

Note that these dependencies _are_ still resolved and added to the
\`package-lock.json\` or \`npm-shrinkwrap.json\` file. They are just not
physically installed on disk.

If a package type appears in both the \`--include\` and \`--omit\` lists, then
it will be included.

If the resulting omit list includes \`'dev'\`, then the \`NODE_ENV\` environment
variable will be set to \`'production'\` for all lifecycle scripts.
----------------------------------------
USAGE: --omit <prod|dev|optional|peer> [--omit <prod|dev|optional|peer> ...]
----------------------------------------
INVALID: Must be one or more of: "prod", "dev", "optional", "peer"
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(Array),prod,dev,optional,peer
----------------------------------------
DERIVED: omit,include
`

exports[`test/definitions/snapshots.js TAP definitions omit-lockfile-registry-resolved > must match snapshot 1`] = `
#### \`omit-lockfile-registry-resolved\`

* Default: false
* Type: Boolean

This option causes npm to create lock files without a \`resolved\` key for
registry dependencies. Subsequent installs will need to resolve tarball
endpoints with the configured registry, likely resulting in a longer install
time.
----------------------------------------
USAGE: --omit-lockfile-registry-resolved
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: omitLockfileRegistryResolved
`

exports[`test/definitions/snapshots.js TAP definitions only > must match snapshot 1`] = `
#### \`only\`

* Default: null
* Type: null, "prod", or "production"
* DEPRECATED: Use \`--omit=dev\` to omit dev dependencies from the install.

When set to \`prod\` or \`production\`, this is an alias for \`--omit=dev\`.
----------------------------------------
USAGE: --only <prod|production>
----------------------------------------
INVALID: Must be one of: "prod", "production"
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,prod,production
----------------------------------------
DERIVED: omit,include
`

exports[`test/definitions/snapshots.js TAP definitions optional > must match snapshot 1`] = `
#### \`optional\`

* Default: null
* Type: null or Boolean
* DEPRECATED: Use \`--omit=optional\` to exclude optional dependencies, or
  \`--include=optional\` to include them.

Default value does install optional deps unless otherwise omitted.

Alias for --include=optional or --omit=optional
----------------------------------------
USAGE: --no-optional|--optional <optional>
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(Boolean)
----------------------------------------
DERIVED: omit,include
`

exports[`test/definitions/snapshots.js TAP definitions otp > must match snapshot 1`] = `
#### \`otp\`

* Default: null
* Type: null or String

This is a one-time password from a two-factor authenticator. It's needed
when publishing or changing package permissions with \`npm access\`.

If not set, and a registry response fails with a challenge for a one-time
password, npm will prompt on the command line for one.
----------------------------------------
USAGE: --otp <otp>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(String)
----------------------------------------
DERIVED: otp
`

exports[`test/definitions/snapshots.js TAP definitions pack-destination > must match snapshot 1`] = `
#### \`pack-destination\`

* Default: "."
* Type: String

Directory in which \`npm pack\` will save tarballs.
----------------------------------------
USAGE: --pack-destination <pack-destination>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: .
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: packDestination
`

exports[`test/definitions/snapshots.js TAP definitions package > must match snapshot 1`] = `
#### \`package\`

* Default: []
* Type: Spec (can be set multiple times)

The package or packages to install for [\`npm exec\`](/commands/npm-exec)
----------------------------------------
USAGE: --package <package-spec> [--package <package-spec> ...]
----------------------------------------
INVALID: Must be one or more an npm package spec
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(Spec),Symbol(Array)
----------------------------------------
DERIVED: package
`

exports[`test/definitions/snapshots.js TAP definitions package-lock > must match snapshot 1`] = `
#### \`package-lock\`

* Default: true
* Type: Boolean

If set to false, then ignore \`package-lock.json\` files when installing. This
will also prevent _writing_ \`package-lock.json\` if \`save\` is true.

This configuration does not affect \`npm ci\`.
----------------------------------------
USAGE: --no-package-lock
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: packageLock,packageLockOnly
`

exports[`test/definitions/snapshots.js TAP definitions package-lock-only > must match snapshot 1`] = `
#### \`package-lock-only\`

* Default: false
* Type: Boolean

If set to true, the current operation will only use the \`package-lock.json\`,
ignoring \`node_modules\`.

For \`update\` this means only the \`package-lock.json\` will be updated,
instead of checking \`node_modules\` and downloading dependencies.

For \`list\` this means the output will be based on the tree described by the
\`package-lock.json\`, rather than the contents of \`node_modules\`.
----------------------------------------
USAGE: --package-lock-only
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: packageLock,packageLockOnly
`

exports[`test/definitions/snapshots.js TAP definitions parseable > must match snapshot 1`] = `
#### \`parseable\`

* Default: false
* Type: Boolean

Output parseable results from commands that write to standard output. For
\`npm search\`, this will be tab-separated table format.
----------------------------------------
USAGE: -p|--parseable
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: parseable
`

exports[`test/definitions/snapshots.js TAP definitions prefer-offline > must match snapshot 1`] = `
#### \`prefer-offline\`

* Default: false
* Type: Boolean

If true, staleness checks for cached data will be bypassed, but missing data
will be requested from the server. To force full offline mode, use
\`--offline\`.
----------------------------------------
USAGE: --prefer-offline
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: preferOffline
`

exports[`test/definitions/snapshots.js TAP definitions prefer-online > must match snapshot 1`] = `
#### \`prefer-online\`

* Default: false
* Type: Boolean

If true, staleness checks for cached data will be forced, making the CLI
look for updates immediately even for fresh package data.
----------------------------------------
USAGE: --prefer-online
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: preferOnline
`

exports[`test/definitions/snapshots.js TAP definitions prefix > must match snapshot 1`] = `
#### \`prefix\`

* Default: In global mode, the folder where the node executable is installed.
  Otherwise, the nearest parent folder containing either a package.json file
  or a node_modules folder.
* Type: null or Path

The location to install global items. If set on the command line, then it
forces non-global commands to run in the specified folder.
----------------------------------------
USAGE: -C|--prefix <prefix>
----------------------------------------
INVALID: Must be a valid filesystem path
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(Path)
----------------------------------------
DERIVED: prefix,globalconfig,globalPrefix,localPrefix
`

exports[`test/definitions/snapshots.js TAP definitions preid > must match snapshot 1`] = `
#### \`preid\`

* Default: ""
* Type: String

The "prerelease identifier" to use as a prefix for the "prerelease" part of
a semver. Like the \`rc\` in \`1.2.0-rc.8\`.
----------------------------------------
USAGE: --preid <prerelease-id>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: preid
`

exports[`test/definitions/snapshots.js TAP definitions production > must match snapshot 1`] = `
#### \`production\`

* Default: null
* Type: null or Boolean
* DEPRECATED: Use \`--omit=dev\` instead.

Alias for \`--omit=dev\`
----------------------------------------
USAGE: --no-production|--production <production>
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(Boolean)
----------------------------------------
DERIVED: omit,include
`

exports[`test/definitions/snapshots.js TAP definitions progress > must match snapshot 1`] = `
#### \`progress\`

* Default: \`true\` unless running in a known CI system
* Type: Boolean

When set to \`true\`, npm will display a progress bar during time intensive
operations, if \`process.stderr\` is a TTY.

Set to \`false\` to suppress the progress bar.
----------------------------------------
USAGE: --no-progress
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: progress
`

exports[`test/definitions/snapshots.js TAP definitions proxy > must match snapshot 1`] = `
#### \`proxy\`

* Default: null
* Type: null, false, or URL

A proxy to use for outgoing http requests. If the \`HTTP_PROXY\` or
\`http_proxy\` environment variables are set, proxy settings will be honored
by the underlying \`request\` library.
----------------------------------------
USAGE: --no-proxy|--proxy <proxy>
----------------------------------------
INVALID: Must be a full url with "http://"
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,false,Symbol(URL)
----------------------------------------
DERIVED: proxy
`

exports[`test/definitions/snapshots.js TAP definitions read-only > must match snapshot 1`] = `
#### \`read-only\`

* Default: false
* Type: Boolean

This is used to mark a token as unable to publish when configuring limited
access tokens with the \`npm token create\` command.
----------------------------------------
USAGE: --read-only
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: readOnly
`

exports[`test/definitions/snapshots.js TAP definitions rebuild-bundle > must match snapshot 1`] = `
#### \`rebuild-bundle\`

* Default: true
* Type: Boolean

Rebuild bundled dependencies after installation.
----------------------------------------
USAGE: --no-rebuild-bundle
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: rebuildBundle
`

exports[`test/definitions/snapshots.js TAP definitions registry > must match snapshot 1`] = `
#### \`registry\`

* Default: "https://registry.npmjs.org/"
* Type: URL

The base URL of the npm registry.
----------------------------------------
USAGE: --registry <registry>
----------------------------------------
INVALID: Must be a full url with "http://"
----------------------------------------
DEFAULT: https://registry.npmjs.org/
----------------------------------------
TYPES: Symbol(URL)
----------------------------------------
DERIVED: registry
`

exports[`test/definitions/snapshots.js TAP definitions replace-registry-host > must match snapshot 1`] = `
#### \`replace-registry-host\`

* Default: "npmjs"
* Type: "npmjs", "never", "always", or String

Defines behavior for replacing the registry host in a lockfile with the
configured registry.

The default behavior is to replace package dist URLs from the default
registry (https://registry.npmjs.org) to the configured registry. If set to
"never", then use the registry value. If set to "always", then replace the
registry host with the configured host every time.

You may also specify a bare hostname (e.g., "registry.npmjs.org").
----------------------------------------
USAGE: --replace-registry-host <npmjs|never|always|replace-registry-host>
----------------------------------------
INVALID: Must be one of: "npmjs", "never", "always", a string
----------------------------------------
DEFAULT: npmjs
----------------------------------------
TYPES: npmjs,never,always,Symbol(String)
----------------------------------------
DERIVED: replaceRegistryHost
`

exports[`test/definitions/snapshots.js TAP definitions save > must match snapshot 1`] = `
#### \`save\`

* Default: \`true\` unless when using \`npm update\` where it defaults to \`false\`
* Type: Boolean

Save installed packages to a \`package.json\` file as dependencies.

When used with the \`npm rm\` command, removes the dependency from
\`package.json\`.

Will also prevent writing to \`package-lock.json\` if set to \`false\`.
----------------------------------------
USAGE: -S|--no-save
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: save
`

exports[`test/definitions/snapshots.js TAP definitions save-bundle > must match snapshot 1`] = `
#### \`save-bundle\`

* Default: false
* Type: Boolean

If a package would be saved at install time by the use of \`--save\`,
\`--save-dev\`, or \`--save-optional\`, then also put it in the
\`bundleDependencies\` list.

Ignored if \`--save-peer\` is set, since peerDependencies cannot be bundled.
----------------------------------------
USAGE: -B|--save-bundle
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: saveBundle
`

exports[`test/definitions/snapshots.js TAP definitions save-dev > must match snapshot 1`] = `
#### \`save-dev\`

* Default: false
* Type: Boolean

Save installed packages to a package.json file as \`devDependencies\`.
----------------------------------------
USAGE: -D|--save-dev
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: saveType
`

exports[`test/definitions/snapshots.js TAP definitions save-exact > must match snapshot 1`] = `
#### \`save-exact\`

* Default: false
* Type: Boolean

Dependencies saved to package.json will be configured with an exact version
rather than using npm's default semver range operator.
----------------------------------------
USAGE: -E|--save-exact
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: savePrefix
`

exports[`test/definitions/snapshots.js TAP definitions save-optional > must match snapshot 1`] = `
#### \`save-optional\`

* Default: false
* Type: Boolean

Save installed packages to a package.json file as \`optionalDependencies\`.
----------------------------------------
USAGE: -O|--save-optional
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: saveType
`

exports[`test/definitions/snapshots.js TAP definitions save-peer > must match snapshot 1`] = `
#### \`save-peer\`

* Default: false
* Type: Boolean

Save installed packages to a package.json file as \`peerDependencies\`
----------------------------------------
USAGE: --save-peer
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: saveBundle,saveType
`

exports[`test/definitions/snapshots.js TAP definitions save-prefix > must match snapshot 1`] = `
#### \`save-prefix\`

* Default: "^"
* Type: String

Configure how versions of packages installed to a package.json file via
\`--save\` or \`--save-dev\` get prefixed.

For example if a package has version \`1.2.3\`, by default its version is set
to \`^1.2.3\` which allows minor upgrades for that package, but after \`npm
config set save-prefix='~'\` it would be set to \`~1.2.3\` which only allows
patch upgrades.
----------------------------------------
USAGE: --save-prefix <save-prefix>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: ^
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: savePrefix
`

exports[`test/definitions/snapshots.js TAP definitions save-prod > must match snapshot 1`] = `
#### \`save-prod\`

* Default: false
* Type: Boolean

Save installed packages into \`dependencies\` specifically. This is useful if
a package already exists in \`devDependencies\` or \`optionalDependencies\`, but
you want to move it to be a non-optional production dependency.

This is the default behavior if \`--save\` is true, and neither \`--save-dev\`
or \`--save-optional\` are true.
----------------------------------------
USAGE: -P|--save-prod
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: saveType
`

exports[`test/definitions/snapshots.js TAP definitions scope > must match snapshot 1`] = `
#### \`scope\`

* Default: the scope of the current project, if any, or ""
* Type: Scope

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
----------------------------------------
USAGE: --scope <@scope>
----------------------------------------
INVALID: Must be an npm scope with or without the leading @
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(Scope)
----------------------------------------
DERIVED: scope,projectScope
`

exports[`test/definitions/snapshots.js TAP definitions script-shell > must match snapshot 1`] = `
#### \`script-shell\`

* Default: '/bin/sh' on POSIX systems, 'cmd.exe' on Windows
* Type: null or String

The shell to use for scripts run with the \`npm exec\`, \`npm run\` and \`npm
init <package-spec>\` commands.
----------------------------------------
USAGE: --script-shell <script-shell>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(String)
----------------------------------------
DERIVED: scriptShell
`

exports[`test/definitions/snapshots.js TAP definitions searchexclude > must match snapshot 1`] = `
#### \`searchexclude\`

* Default: ""
* Type: String

Space-separated options that limit the results from search.
----------------------------------------
USAGE: --searchexclude <searchexclude>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: search.exclude
`

exports[`test/definitions/snapshots.js TAP definitions searchlimit > must match snapshot 1`] = `
#### \`searchlimit\`

* Default: 20
* Type: Number

Number of items to limit search results to. Will not apply at all to legacy
searches.
----------------------------------------
USAGE: --searchlimit <number>
----------------------------------------
INVALID: Must be a numeric value
----------------------------------------
DEFAULT: 20
----------------------------------------
TYPES: Symbol(Number)
----------------------------------------
DERIVED: search.limit
`

exports[`test/definitions/snapshots.js TAP definitions searchopts > must match snapshot 1`] = `
#### \`searchopts\`

* Default: ""
* Type: Querystring

Space-separated options that are always passed to search.
----------------------------------------
USAGE: --searchopts <key=val key2=val2>
----------------------------------------
INVALID: Must be a space-delimited querystring
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(Querystring)
----------------------------------------
DERIVED: search.opts
`

exports[`test/definitions/snapshots.js TAP definitions searchstaleness > must match snapshot 1`] = `
#### \`searchstaleness\`

* Default: 900
* Type: Number

The age of the cache, in seconds, before another registry request is made if
using legacy search endpoint.
----------------------------------------
USAGE: --searchstaleness <number>
----------------------------------------
INVALID: Must be a numeric value
----------------------------------------
DEFAULT: 900
----------------------------------------
TYPES: Symbol(Number)
----------------------------------------
DERIVED: search.staleness
`

exports[`test/definitions/snapshots.js TAP definitions shell > must match snapshot 1`] = `
#### \`shell\`

* Default: SHELL environment variable, or "bash" on Posix, or "cmd.exe" on
  Windows
* Type: String

The shell to run for the \`npm explore\` command.
----------------------------------------
USAGE: --shell <shell>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: /bin/zsh
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: shell
`

exports[`test/definitions/snapshots.js TAP definitions shrinkwrap > must match snapshot 1`] = `
#### \`shrinkwrap\`

* Default: true
* Type: Boolean
* DEPRECATED: Use the --package-lock setting instead.

Alias for --package-lock
----------------------------------------
USAGE: --no-shrinkwrap
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: packageLock
`

exports[`test/definitions/snapshots.js TAP definitions sign-git-commit > must match snapshot 1`] = `
#### \`sign-git-commit\`

* Default: false
* Type: Boolean

If set to true, then the \`npm version\` command will commit the new package
version using \`-S\` to add a signature.

Note that git requires you to have set up GPG keys in your git configs for
this to work properly.
----------------------------------------
USAGE: --sign-git-commit
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: signGitCommit
`

exports[`test/definitions/snapshots.js TAP definitions sign-git-tag > must match snapshot 1`] = `
#### \`sign-git-tag\`

* Default: false
* Type: Boolean

If set to true, then the \`npm version\` command will tag the version using
\`-s\` to add a signature.

Note that git requires you to have set up GPG keys in your git configs for
this to work properly.
----------------------------------------
USAGE: --sign-git-tag
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: signGitTag
`

exports[`test/definitions/snapshots.js TAP definitions strict-peer-deps > must match snapshot 1`] = `
#### \`strict-peer-deps\`

* Default: false
* Type: Boolean

If set to \`true\`, and \`--legacy-peer-deps\` is not set, then _any_
conflicting \`peerDependencies\` will be treated as an install failure, even
if npm could reasonably guess the appropriate resolution based on non-peer
dependency relationships.

By default, conflicting \`peerDependencies\` deep in the dependency graph will
be resolved using the nearest non-peer dependency specification, even if
doing so will result in some packages receiving a peer dependency outside
the range set in their package's \`peerDependencies\` object.

When such and override is performed, a warning is printed, explaining the
conflict and the packages involved. If \`--strict-peer-deps\` is set, then
this warning is treated as a failure.
----------------------------------------
USAGE: --strict-peer-deps
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: strictPeerDeps
`

exports[`test/definitions/snapshots.js TAP definitions strict-ssl > must match snapshot 1`] = `
#### \`strict-ssl\`

* Default: true
* Type: Boolean

Whether or not to do SSL key validation when making requests to the registry
via https.

See also the \`ca\` config.
----------------------------------------
USAGE: --no-strict-ssl
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: strictSSL
`

exports[`test/definitions/snapshots.js TAP definitions tag > must match snapshot 1`] = `
#### \`tag\`

* Default: "latest"
* Type: String

If you ask npm to install a package and don't tell it a specific version,
then it will install the specified tag.

Also the tag that is added to the package@version specified by the \`npm tag\`
command, if no explicit tag is given.

When used by the \`npm diff\` command, this is the tag used to fetch the
tarball that will be compared with the local files by default.
----------------------------------------
USAGE: --tag <tag>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: latest
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: defaultTag
`

exports[`test/definitions/snapshots.js TAP definitions tag-version-prefix > must match snapshot 1`] = `
#### \`tag-version-prefix\`

* Default: "v"
* Type: String

If set, alters the prefix used when tagging a new version when performing a
version increment using \`npm version\`. To remove the prefix altogether, set
it to the empty string: \`""\`.

Because other tools may rely on the convention that npm version tags look
like \`v1.0.0\`, _only use this property if it is absolutely necessary_. In
particular, use care when overriding this setting for public packages.
----------------------------------------
USAGE: --tag-version-prefix <tag-version-prefix>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: v
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: tagVersionPrefix
`

exports[`test/definitions/snapshots.js TAP definitions timing > must match snapshot 1`] = `
#### \`timing\`

* Default: false
* Type: Boolean

If true, writes timing information to a process specific json file in the
cache or \`logs-dir\`. The file name ends with \`-timing.json\`.

You can quickly view it with this [json](https://npm.im/json) command line:
\`cat ~/.npm/_logs/*-timing.json | npm exec -- json -g\`.

Timing information will also be reported in the terminal. To suppress this
while still writing the timing file, use \`--silent\`.
----------------------------------------
USAGE: --timing
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions umask > must match snapshot 1`] = `
#### \`umask\`

* Default: 0
* Type: Octal numeric string in range 0000..0777 (0..511)

The "umask" value to use when setting the file creation mode on files and
folders.

Folders and executables are given a mode which is \`0o777\` masked against
this value. Other files are given a mode which is \`0o666\` masked against
this value.

Note that the underlying system will _also_ apply its own umask value to
files and folders that are created, and npm does not circumvent this, but
rather adds the \`--umask\` config to it.

Thus, the effective default umask value on most POSIX systems is 0o22,
meaning that folders and executables are created with a mode of 0o755 and
other files are created with a mode of 0o644.
----------------------------------------
USAGE: --umask <umask>
----------------------------------------
INVALID: Must be an octal number in range 0o000..0o777 (0..511)
----------------------------------------
DEFAULT: 0
----------------------------------------
TYPES: Symbol(Umask)
----------------------------------------
DERIVED: umask
`

exports[`test/definitions/snapshots.js TAP definitions unicode > must match snapshot 1`] = `
#### \`unicode\`

* Default: false on windows, true on mac/unix systems with a unicode locale,
  as defined by the \`LC_ALL\`, \`LC_CTYPE\`, or \`LANG\` environment variables.
* Type: Boolean

When set to true, npm uses unicode characters in the tree output. When
false, it uses ascii characters instead of unicode glyphs.
----------------------------------------
USAGE: --no-unicode
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: unicode
`

exports[`test/definitions/snapshots.js TAP definitions update-notifier > must match snapshot 1`] = `
#### \`update-notifier\`

* Default: true
* Type: Boolean

Set to false to suppress the update notification when using an older version
of npm than the latest.
----------------------------------------
USAGE: --no-update-notifier
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions usage > must match snapshot 1`] = `
#### \`usage\`

* Default: false
* Type: Boolean

Show short usage output about the command specified.
----------------------------------------
USAGE: -?|-H|-h|--usage
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions user-agent > must match snapshot 1`] = `
#### \`user-agent\`

* Default: "npm/{npm-version} node/{node-version} {platform} {arch}
  workspaces/{workspaces} {ci}"
* Type: String

Sets the User-Agent request header. The following fields are replaced with
their actual counterparts:

* \`{npm-version}\` - The npm version in use
* \`{node-version}\` - The Node.js version in use
* \`{platform}\` - The value of \`process.platform\`
* \`{arch}\` - The value of \`process.arch\`
* \`{workspaces}\` - Set to \`true\` if the \`workspaces\` or \`workspace\` options
  are set.
* \`{ci}\` - The value of the \`ci-name\` config, if set, prefixed with \`ci/\`, or
  an empty string if \`ci-name\` is empty.
----------------------------------------
USAGE: --user-agent <user-agent>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: npm/{npm-version} node/{node-version} {platform} {arch} workspaces/{workspaces} {ci}
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: userAgent
`

exports[`test/definitions/snapshots.js TAP definitions userconfig > must match snapshot 1`] = `
#### \`userconfig\`

* Default: "~/.npmrc"
* Type: Path

The location of user-level configuration settings.

This may be overridden by the \`npm_config_userconfig\` environment variable
or the \`--userconfig\` command line option, but may _not_ be overridden by
settings in the \`globalconfig\` file.
----------------------------------------
USAGE: --userconfig <userconfig>
----------------------------------------
INVALID: Must be a valid filesystem path
----------------------------------------
DEFAULT: ~/.npmrc
----------------------------------------
TYPES: Symbol(Path)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions version > must match snapshot 1`] = `
#### \`version\`

* Default: false
* Type: Boolean

If true, output the npm version and exit successfully.

Only relevant when specified explicitly on the command line.
----------------------------------------
USAGE: -v|--version
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions versions > must match snapshot 1`] = `
#### \`versions\`

* Default: false
* Type: Boolean

If true, output the npm version as well as node's \`process.versions\` map and
the version in the current working directory's \`package.json\` file if one
exists, and exit successfully.

Only relevant when specified explicitly on the command line.
----------------------------------------
USAGE: --versions
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: false
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions viewer > must match snapshot 1`] = `
#### \`viewer\`

* Default: "man" on Posix, "browser" on Windows
* Type: String

The program to use to view help content.

Set to \`"browser"\` to view html help content in the default web browser.
----------------------------------------
USAGE: --viewer <viewer>
----------------------------------------
INVALID: Must be a string
----------------------------------------
DEFAULT: man
----------------------------------------
TYPES: Symbol(String)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions which > must match snapshot 1`] = `
#### \`which\`

* Default: null
* Type: null or Positive integer

If there are multiple funding sources, which 1-indexed source URL to open.
----------------------------------------
USAGE: --which <1|2|3|n>
----------------------------------------
INVALID: Must be an integer greater than or equal to 1
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(PositiveInteger)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP definitions workspace > must match snapshot 1`] = `
#### \`workspace\`

* Default: []
* Type: String or Path (can be set multiple times)

Enable running a command in the context of the configured workspaces of the
current project while filtering by running only the workspaces defined by
this configuration option.

Valid values for the \`workspace\` config are either:

* Workspace names
* Path to a workspace directory
* Path to a parent workspace directory (will result in selecting all
  workspaces within that folder)

When set for the \`npm init\` command, this may be set to the folder of a
workspace which does not yet exist, to create the folder and set it up as a
brand new workspace within the project.

This value is not exported to the environment for child processes.
----------------------------------------
USAGE: -w|--workspace <workspace-name|workspace-path> [-w|--workspace <workspace-name|workspace-path> ...]
----------------------------------------
INVALID: Must be one or more a valid filesystem path
----------------------------------------
DEFAULT: 
----------------------------------------
TYPES: Symbol(String),Symbol(Path),Symbol(Array)
----------------------------------------
DERIVED: userAgent
`

exports[`test/definitions/snapshots.js TAP definitions workspaces > must match snapshot 1`] = `
#### \`workspaces\`

* Default: null
* Type: null or Boolean

Set to true to run the command in the context of **all** configured
workspaces.

Explicitly setting this to false will cause commands like \`install\` to
ignore workspaces altogether. When not set explicitly:

- Commands that operate on the \`node_modules\` tree (install, update, etc.)
will link workspaces into the \`node_modules\` folder. - Commands that do
other things (test, exec, publish, etc.) will operate on the root project,
_unless_ one or more workspaces are specified in the \`workspace\` config.

This value is not exported to the environment for child processes.
----------------------------------------
USAGE: -ws|--no-workspaces|--workspaces <workspaces>
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(Boolean)
----------------------------------------
DERIVED: localPrefix,userAgent,workspacesEnabled
`

exports[`test/definitions/snapshots.js TAP definitions workspaces-update > must match snapshot 1`] = `
#### \`workspaces-update\`

* Default: true
* Type: Boolean

If set to true, the npm cli will run an update after operations that may
possibly change the workspaces installed to the \`node_modules\` folder.
----------------------------------------
USAGE: --no-workspaces-update
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: true
----------------------------------------
TYPES: Symbol(Boolean)
----------------------------------------
DERIVED: workspacesUpdate
`

exports[`test/definitions/snapshots.js TAP definitions yes > must match snapshot 1`] = `
#### \`yes\`

* Default: null
* Type: null or Boolean

Automatically answer "yes" to any prompts that npm might print on the
command line.
----------------------------------------
USAGE: -y|--no-yes|--yes <yes>
----------------------------------------
INVALID: Must be a boolean value (true or false)
----------------------------------------
DEFAULT: null
----------------------------------------
TYPES: null,Symbol(Boolean)
----------------------------------------
DERIVED: 
`

exports[`test/definitions/snapshots.js TAP derived _auth > must match snapshot 1`] = `
Array [
  "_auth",
]
`

exports[`test/definitions/snapshots.js TAP derived access > must match snapshot 1`] = `
Array [
  "access",
]
`

exports[`test/definitions/snapshots.js TAP derived all > must match snapshot 1`] = `
Array [
  "all",
]
`

exports[`test/definitions/snapshots.js TAP derived allow-same-version > must match snapshot 1`] = `
Array [
  "allow-same-version",
]
`

exports[`test/definitions/snapshots.js TAP derived audit > must match snapshot 1`] = `
Array [
  "audit",
]
`

exports[`test/definitions/snapshots.js TAP derived audit-level > must match snapshot 1`] = `
Array [
  "audit-level",
]
`

exports[`test/definitions/snapshots.js TAP derived auth-type > must match snapshot 1`] = `
Array [
  "auth-type",
]
`

exports[`test/definitions/snapshots.js TAP derived before > must match snapshot 1`] = `
Array [
  "before",
]
`

exports[`test/definitions/snapshots.js TAP derived bin-links > must match snapshot 1`] = `
Array [
  "bin-links",
]
`

exports[`test/definitions/snapshots.js TAP derived browser > must match snapshot 1`] = `
Array [
  "browser",
]
`

exports[`test/definitions/snapshots.js TAP derived ca > must match snapshot 1`] = `
Array [
  "ca",
  "cafile",
]
`

exports[`test/definitions/snapshots.js TAP derived cache > must match snapshot 1`] = `
Array [
  "cache",
  "logs-dir",
]
`

exports[`test/definitions/snapshots.js TAP derived call > must match snapshot 1`] = `
Array [
  "call",
]
`

exports[`test/definitions/snapshots.js TAP derived cert > must match snapshot 1`] = `
Array [
  "cert",
]
`

exports[`test/definitions/snapshots.js TAP derived ci-name > must match snapshot 1`] = `
Array [
  "ci-name",
]
`

exports[`test/definitions/snapshots.js TAP derived cidr > must match snapshot 1`] = `
Array [
  "cidr",
]
`

exports[`test/definitions/snapshots.js TAP derived color > must match snapshot 1`] = `
Array [
  "color",
]
`

exports[`test/definitions/snapshots.js TAP derived commit-hooks > must match snapshot 1`] = `
Array [
  "commit-hooks",
]
`

exports[`test/definitions/snapshots.js TAP derived default-tag > must match snapshot 1`] = `
Array [
  "default-tag",
]
`

exports[`test/definitions/snapshots.js TAP derived depth > must match snapshot 1`] = `
Array [
  "depth",
]
`

exports[`test/definitions/snapshots.js TAP derived diff > must match snapshot 1`] = `
Array [
  "diff",
]
`

exports[`test/definitions/snapshots.js TAP derived diff-dst-prefix > must match snapshot 1`] = `
Array [
  "diff-dst-prefix",
]
`

exports[`test/definitions/snapshots.js TAP derived diff-ignore-all-space > must match snapshot 1`] = `
Array [
  "diff-ignore-all-space",
]
`

exports[`test/definitions/snapshots.js TAP derived diff-name-only > must match snapshot 1`] = `
Array [
  "diff-name-only",
]
`

exports[`test/definitions/snapshots.js TAP derived diff-no-prefix > must match snapshot 1`] = `
Array [
  "diff-no-prefix",
]
`

exports[`test/definitions/snapshots.js TAP derived diff-src-prefix > must match snapshot 1`] = `
Array [
  "diff-src-prefix",
]
`

exports[`test/definitions/snapshots.js TAP derived diff-text > must match snapshot 1`] = `
Array [
  "diff-text",
]
`

exports[`test/definitions/snapshots.js TAP derived diff-unified > must match snapshot 1`] = `
Array [
  "diff-unified",
]
`

exports[`test/definitions/snapshots.js TAP derived dry-run > must match snapshot 1`] = `
Array [
  "dry-run",
]
`

exports[`test/definitions/snapshots.js TAP derived editor > must match snapshot 1`] = `
Array [
  "editor",
]
`

exports[`test/definitions/snapshots.js TAP derived engine-strict > must match snapshot 1`] = `
Array [
  "engine-strict",
]
`

exports[`test/definitions/snapshots.js TAP derived force > must match snapshot 1`] = `
Array [
  "force",
]
`

exports[`test/definitions/snapshots.js TAP derived foreground-scripts > must match snapshot 1`] = `
Array [
  "foreground-scripts",
]
`

exports[`test/definitions/snapshots.js TAP derived format-package-lock > must match snapshot 1`] = `
Array [
  "format-package-lock",
]
`

exports[`test/definitions/snapshots.js TAP derived fund > must match snapshot 1`] = `
Array [
  "fund",
]
`

exports[`test/definitions/snapshots.js TAP derived git > must match snapshot 1`] = `
Array [
  "git",
]
`

exports[`test/definitions/snapshots.js TAP derived git-tag-version > must match snapshot 1`] = `
Array [
  "git-tag-version",
]
`

exports[`test/definitions/snapshots.js TAP derived global > must match snapshot 1`] = `
Array [
  "global",
  "location",
]
`

exports[`test/definitions/snapshots.js TAP derived global-prefix > must match snapshot 1`] = `
Array [
  "global-prefix",
  "prefix",
  "globalconfig",
]
`

exports[`test/definitions/snapshots.js TAP derived globalconfig > must match snapshot 1`] = `
Array [
  "globalconfig",
  "prefix",
]
`

exports[`test/definitions/snapshots.js TAP derived heading > must match snapshot 1`] = `
Array [
  "heading",
]
`

exports[`test/definitions/snapshots.js TAP derived https-proxy > must match snapshot 1`] = `
Array [
  "https-proxy",
]
`

exports[`test/definitions/snapshots.js TAP derived if-present > must match snapshot 1`] = `
Array [
  "if-present",
]
`

exports[`test/definitions/snapshots.js TAP derived ignore-scripts > must match snapshot 1`] = `
Array [
  "ignore-scripts",
]
`

exports[`test/definitions/snapshots.js TAP derived include > must match snapshot 1`] = `
Array [
  "include",
  "dev",
  "production",
  "optional",
  "also",
  "only",
  "omit",
]
`

exports[`test/definitions/snapshots.js TAP derived include-staged > must match snapshot 1`] = `
Array [
  "include-staged",
]
`

exports[`test/definitions/snapshots.js TAP derived include-workspace-root > must match snapshot 1`] = `
Array [
  "include-workspace-root",
]
`

exports[`test/definitions/snapshots.js TAP derived install-links > must match snapshot 1`] = `
Array [
  "install-links",
]
`

exports[`test/definitions/snapshots.js TAP derived install-strategy > must match snapshot 1`] = `
Array [
  "install-strategy",
  "global-style",
  "legacy-bundling",
]
`

exports[`test/definitions/snapshots.js TAP derived json > must match snapshot 1`] = `
Array [
  "json",
]
`

exports[`test/definitions/snapshots.js TAP derived key > must match snapshot 1`] = `
Array [
  "key",
]
`

exports[`test/definitions/snapshots.js TAP derived legacy-peer-deps > must match snapshot 1`] = `
Array [
  "legacy-peer-deps",
]
`

exports[`test/definitions/snapshots.js TAP derived local-address > must match snapshot 1`] = `
Array [
  "local-address",
]
`

exports[`test/definitions/snapshots.js TAP derived local-prefix > must match snapshot 1`] = `
Array [
  "local-prefix",
  "prefix",
  "workspaces",
  "global",
  "location",
]
`

exports[`test/definitions/snapshots.js TAP derived location > must match snapshot 1`] = `
Array [
  "location",
  "global",
]
`

exports[`test/definitions/snapshots.js TAP derived lockfile-version > must match snapshot 1`] = `
Array [
  "lockfile-version",
]
`

exports[`test/definitions/snapshots.js TAP derived log-color > must match snapshot 1`] = `
Array [
  "log-color",
  "color",
]
`

exports[`test/definitions/snapshots.js TAP derived logs-dir > must match snapshot 1`] = `
Array [
  "logs-dir",
  "cache",
]
`

exports[`test/definitions/snapshots.js TAP derived max-sockets > must match snapshot 1`] = `
Array [
  "max-sockets",
]
`

exports[`test/definitions/snapshots.js TAP derived message > must match snapshot 1`] = `
Array [
  "message",
]
`

exports[`test/definitions/snapshots.js TAP derived no-proxy > must match snapshot 1`] = `
Array [
  "no-proxy",
]
`

exports[`test/definitions/snapshots.js TAP derived node-bin > must match snapshot 1`] = `
Array [
  "node-bin",
]
`

exports[`test/definitions/snapshots.js TAP derived npm-bin > must match snapshot 1`] = `
Array [
  "npm-bin",
]
`

exports[`test/definitions/snapshots.js TAP derived npx-cache > must match snapshot 1`] = `
Array [
  "npx-cache",
  "cache",
  "logs-dir",
]
`

exports[`test/definitions/snapshots.js TAP derived offline > must match snapshot 1`] = `
Array [
  "offline",
]
`

exports[`test/definitions/snapshots.js TAP derived omit > must match snapshot 1`] = `
Array [
  "omit",
  "dev",
  "production",
  "optional",
  "also",
  "only",
  "include",
]
`

exports[`test/definitions/snapshots.js TAP derived omit-lockfile-registry-resolved > must match snapshot 1`] = `
Array [
  "omit-lockfile-registry-resolved",
]
`

exports[`test/definitions/snapshots.js TAP derived otp > must match snapshot 1`] = `
Array [
  "otp",
]
`

exports[`test/definitions/snapshots.js TAP derived pack-destination > must match snapshot 1`] = `
Array [
  "pack-destination",
]
`

exports[`test/definitions/snapshots.js TAP derived package > must match snapshot 1`] = `
Array [
  "package",
]
`

exports[`test/definitions/snapshots.js TAP derived package-lock > must match snapshot 1`] = `
Array [
  "package-lock",
  "package-lock-only",
]
`

exports[`test/definitions/snapshots.js TAP derived package-lock-only > must match snapshot 1`] = `
Array [
  "package-lock-only",
  "package-lock",
]
`

exports[`test/definitions/snapshots.js TAP derived parseable > must match snapshot 1`] = `
Array [
  "parseable",
]
`

exports[`test/definitions/snapshots.js TAP derived prefer-offline > must match snapshot 1`] = `
Array [
  "prefer-offline",
  "cache-min",
]
`

exports[`test/definitions/snapshots.js TAP derived prefer-online > must match snapshot 1`] = `
Array [
  "prefer-online",
  "cache-max",
]
`

exports[`test/definitions/snapshots.js TAP derived prefix > must match snapshot 1`] = `
Array [
  "prefix",
  "globalconfig",
]
`

exports[`test/definitions/snapshots.js TAP derived preid > must match snapshot 1`] = `
Array [
  "preid",
]
`

exports[`test/definitions/snapshots.js TAP derived progress > must match snapshot 1`] = `
Array [
  "progress",
]
`

exports[`test/definitions/snapshots.js TAP derived project-scope > must match snapshot 1`] = `
Array [
  "project-scope",
  "scope",
]
`

exports[`test/definitions/snapshots.js TAP derived proxy > must match snapshot 1`] = `
Array [
  "proxy",
]
`

exports[`test/definitions/snapshots.js TAP derived read-only > must match snapshot 1`] = `
Array [
  "read-only",
]
`

exports[`test/definitions/snapshots.js TAP derived rebuild-bundle > must match snapshot 1`] = `
Array [
  "rebuild-bundle",
]
`

exports[`test/definitions/snapshots.js TAP derived registry > must match snapshot 1`] = `
Array [
  "registry",
]
`

exports[`test/definitions/snapshots.js TAP derived replace-registry-host > must match snapshot 1`] = `
Array [
  "replace-registry-host",
]
`

exports[`test/definitions/snapshots.js TAP derived retry.factor > must match snapshot 1`] = `
Array [
  "retry.factor",
]
`

exports[`test/definitions/snapshots.js TAP derived retry.max-timeout > must match snapshot 1`] = `
Array [
  "retry.max-timeout",
]
`

exports[`test/definitions/snapshots.js TAP derived retry.min-timeout > must match snapshot 1`] = `
Array [
  "retry.min-timeout",
]
`

exports[`test/definitions/snapshots.js TAP derived retry.retries > must match snapshot 1`] = `
Array [
  "retry.retries",
]
`

exports[`test/definitions/snapshots.js TAP derived save > must match snapshot 1`] = `
Array [
  "save",
]
`

exports[`test/definitions/snapshots.js TAP derived save-bundle > must match snapshot 1`] = `
Array [
  "save-bundle",
  "save-peer",
]
`

exports[`test/definitions/snapshots.js TAP derived save-prefix > must match snapshot 1`] = `
Array [
  "save-prefix",
  "save-exact",
]
`

exports[`test/definitions/snapshots.js TAP derived save-type > must match snapshot 1`] = `
Array [
  "save-type",
  "save-dev",
  "save-optional",
  "save-peer",
  "save-prod",
]
`

exports[`test/definitions/snapshots.js TAP derived scope > must match snapshot 1`] = `
Array [
  "scope",
]
`

exports[`test/definitions/snapshots.js TAP derived script-shell > must match snapshot 1`] = `
Array [
  "script-shell",
]
`

exports[`test/definitions/snapshots.js TAP derived search.description > must match snapshot 1`] = `
Array [
  "search.description",
  "description",
]
`

exports[`test/definitions/snapshots.js TAP derived search.exclude > must match snapshot 1`] = `
Array [
  "search.exclude",
  "searchexclude",
]
`

exports[`test/definitions/snapshots.js TAP derived search.limit > must match snapshot 1`] = `
Array [
  "search.limit",
  "searchlimit",
]
`

exports[`test/definitions/snapshots.js TAP derived search.opts > must match snapshot 1`] = `
Array [
  "search.opts",
  "searchopts",
]
`

exports[`test/definitions/snapshots.js TAP derived search.staleness > must match snapshot 1`] = `
Array [
  "search.staleness",
]
`

exports[`test/definitions/snapshots.js TAP derived shell > must match snapshot 1`] = `
Array [
  "shell",
]
`

exports[`test/definitions/snapshots.js TAP derived sign-git-commit > must match snapshot 1`] = `
Array [
  "sign-git-commit",
]
`

exports[`test/definitions/snapshots.js TAP derived sign-git-tag > must match snapshot 1`] = `
Array [
  "sign-git-tag",
]
`

exports[`test/definitions/snapshots.js TAP derived silent > must match snapshot 1`] = `
Array [
  "silent",
  "loglevel",
]
`

exports[`test/definitions/snapshots.js TAP derived strict-peer-deps > must match snapshot 1`] = `
Array [
  "strict-peer-deps",
]
`

exports[`test/definitions/snapshots.js TAP derived strict-ssl > must match snapshot 1`] = `
Array [
  "strict-ssl",
]
`

exports[`test/definitions/snapshots.js TAP derived tag-version-prefix > must match snapshot 1`] = `
Array [
  "tag-version-prefix",
]
`

exports[`test/definitions/snapshots.js TAP derived timeout > must match snapshot 1`] = `
Array [
  "timeout",
]
`

exports[`test/definitions/snapshots.js TAP derived umask > must match snapshot 1`] = `
Array [
  "umask",
]
`

exports[`test/definitions/snapshots.js TAP derived unicode > must match snapshot 1`] = `
Array [
  "unicode",
]
`

exports[`test/definitions/snapshots.js TAP derived user-agent > must match snapshot 1`] = `
Array [
  "user-agent",
  "ci-name",
  "workspaces",
  "workspace",
  "npm-version",
]
`

exports[`test/definitions/snapshots.js TAP derived workspaces-enabled > must match snapshot 1`] = `
Array [
  "workspaces-enabled",
  "workspaces",
]
`

exports[`test/definitions/snapshots.js TAP derived workspaces-update > must match snapshot 1`] = `
Array [
  "workspaces-update",
]
`

exports[`test/definitions/snapshots.js TAP values Arborist > must match snapshot 1`] = `
Function Arborist(classArboristextendsBase)
`

exports[`test/definitions/snapshots.js TAP values hash-algorithm > must match snapshot 1`] = `
sha1
`

exports[`test/definitions/snapshots.js TAP values npm-command > must match snapshot 1`] = `

`

exports[`test/definitions/snapshots.js TAP values npm-version > must match snapshot 1`] = `
{NPM-VERSION}
`
