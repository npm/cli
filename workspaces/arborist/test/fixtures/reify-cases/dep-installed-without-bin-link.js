// generated from test/fixtures/dep-installed-without-bin-link
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    ".package-lock.json": JSON.stringify({
      "name": "@isaacs/dep-installed-without-bin-link",
      "version": "1.0.0",
      "lockfileVersion": 2,
      "requires": true,
      "packages": {
        "": {
          "name": "@isaacs/dep-installed-without-bin-link",
          "version": "1.0.0",
          "dependencies": {
            "mkdirp": "^1.0.4",
            "semver": "^7.3.2"
          }
        },
        "node_modules/mkdirp": {
          "version": "1.0.4",
          "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-1.0.4.tgz",
          "integrity": "sha512-vVqVZQyf3WLx2Shd0qJ9xuvqgAyKPLAiqITEtqW0oIUjzo3PePDd6fW9iFz30ef7Ysp/oiWqbhszeGWW2T6Gzw==",
          "bin": {
            "mkdirp": "bin/cmd.js"
          },
          "engines": {
            "node": ">=10"
          }
        },
        "node_modules/semver": {
          "version": "7.3.2",
          "resolved": "https://registry.npmjs.org/semver/-/semver-7.3.2.tgz",
          "integrity": "sha512-OrOb32TeeambH6UrhtShmF7CRDqhL6/5XpPNp2DuRH6+9QLw/orhp72j87v8Qa1ScDkvrrBNpZcDejAirJmfXQ==",
          "bin": {
            "semver": "bin/semver.js"
          },
          "engines": {
            "node": ">=10"
          }
        }
      }
    }),
    "mkdirp": {
      "bin": {
        "cmd.js": `#!/usr/bin/env node

const usage = () => \`
usage: mkdirp [DIR1,DIR2..] {OPTIONS}

  Create each supplied directory including any necessary parent directories
  that don't yet exist.

  If the directory already exists, do nothing.

OPTIONS are:

  -m<mode>       If a directory needs to be created, set the mode as an octal
  --mode=<mode>  permission string.

  -v --version   Print the mkdirp version number

  -h --help      Print this helpful banner

  -p --print     Print the first directories created for each path provided

  --manual       Use manual implementation, even if native is available
\`

const dirs = []
const opts = {}
let print = false
let dashdash = false
let manual = false
for (const arg of process.argv.slice(2)) {
  if (dashdash)
    dirs.push(arg)
  else if (arg === '--')
    dashdash = true
  else if (arg === '--manual')
    manual = true
  else if (/^-h/.test(arg) || /^--help/.test(arg)) {
    console.log(usage())
    process.exit(0)
  } else if (arg === '-v' || arg === '--version') {
    console.log(require('../package.json').version)
    process.exit(0)
  } else if (arg === '-p' || arg === '--print') {
    print = true
  } else if (/^-m/.test(arg) || /^--mode=/.test(arg)) {
    const mode = parseInt(arg.replace(/^(-m|--mode=)/, ''), 8)
    if (isNaN(mode)) {
      console.error(\`invalid mode argument: \${arg}\\nMust be an octal number.\`)
      process.exit(1)
    }
    opts.mode = mode
  } else
    dirs.push(arg)
}

const mkdirp = require('../')
const impl = manual ? mkdirp.manual : mkdirp
if (dirs.length === 0)
  console.error(usage())

Promise.all(dirs.map(dir => impl(dir, opts)))
  .then(made => print ? made.forEach(m => m && console.log(m)) : null)
  .catch(er => {
    console.error(er.message)
    if (er.code)
      console.error('  code: ' + er.code)
    process.exit(1)
  })
`
      },
      "index.js": `const optsArg = require('./lib/opts-arg.js')
const pathArg = require('./lib/path-arg.js')

const {mkdirpNative, mkdirpNativeSync} = require('./lib/mkdirp-native.js')
const {mkdirpManual, mkdirpManualSync} = require('./lib/mkdirp-manual.js')
const {useNative, useNativeSync} = require('./lib/use-native.js')


const mkdirp = (path, opts) => {
  path = pathArg(path)
  opts = optsArg(opts)
  return useNative(opts)
    ? mkdirpNative(path, opts)
    : mkdirpManual(path, opts)
}

const mkdirpSync = (path, opts) => {
  path = pathArg(path)
  opts = optsArg(opts)
  return useNativeSync(opts)
    ? mkdirpNativeSync(path, opts)
    : mkdirpManualSync(path, opts)
}

mkdirp.sync = mkdirpSync
mkdirp.native = (path, opts) => mkdirpNative(pathArg(path), optsArg(opts))
mkdirp.manual = (path, opts) => mkdirpManual(pathArg(path), optsArg(opts))
mkdirp.nativeSync = (path, opts) => mkdirpNativeSync(pathArg(path), optsArg(opts))
mkdirp.manualSync = (path, opts) => mkdirpManualSync(pathArg(path), optsArg(opts))

module.exports = mkdirp
`,
      "package.json": JSON.stringify({
        "name": "mkdirp",
        "description": "Recursively mkdir, like `mkdir -p`",
        "version": "1.0.4",
        "main": "index.js",
        "keywords": [
          "mkdir",
          "directory",
          "make dir",
          "make",
          "dir",
          "recursive",
          "native"
        ],
        "repository": {
          "type": "git",
          "url": "https://github.com/isaacs/node-mkdirp.git"
        },
        "scripts": {
          "test": "tap",
          "snap": "tap",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --follow-tags"
        },
        "tap": {
          "check-coverage": true,
          "coverage-map": "map.js"
        },
        "devDependencies": {
          "require-inject": "^1.4.4",
          "tap": "^14.10.7"
        },
        "bin": "bin/cmd.js",
        "license": "MIT",
        "engines": {
          "node": ">=10"
        },
        "files": [
          "bin",
          "lib",
          "index.js"
        ]
      })
    },
    "semver": {
      "bin": {
        "semver.js": `#!/usr/bin/env node
// Standalone semver comparison program.
// Exits successfully and prints matching version(s) if
// any supplied version is valid and passes all tests.

const argv = process.argv.slice(2)

let versions = []

const range = []

let inc = null

const version = require('../package.json').version

let loose = false

let includePrerelease = false

let coerce = false

let rtl = false

let identifier

const semver = require('../')

let reverse = false

const options = {}

const main = () => {
  if (!argv.length) return help()
  while (argv.length) {
    let a = argv.shift()
    const indexOfEqualSign = a.indexOf('=')
    if (indexOfEqualSign !== -1) {
      a = a.slice(0, indexOfEqualSign)
      argv.unshift(a.slice(indexOfEqualSign + 1))
    }
    switch (a) {
      case '-rv': case '-rev': case '--rev': case '--reverse':
        reverse = true
        break
      case '-l': case '--loose':
        loose = true
        break
      case '-p': case '--include-prerelease':
        includePrerelease = true
        break
      case '-v': case '--version':
        versions.push(argv.shift())
        break
      case '-i': case '--inc': case '--increment':
        switch (argv[0]) {
          case 'major': case 'minor': case 'patch': case 'prerelease':
          case 'premajor': case 'preminor': case 'prepatch':
            inc = argv.shift()
            break
          default:
            inc = 'patch'
            break
        }
        break
      case '--preid':
        identifier = argv.shift()
        break
      case '-r': case '--range':
        range.push(argv.shift())
        break
      case '-c': case '--coerce':
        coerce = true
        break
      case '--rtl':
        rtl = true
        break
      case '--ltr':
        rtl = false
        break
      case '-h': case '--help': case '-?':
        return help()
      default:
        versions.push(a)
        break
    }
  }

  const options = { loose: loose, includePrerelease: includePrerelease, rtl: rtl }

  versions = versions.map((v) => {
    return coerce ? (semver.coerce(v, options) || { version: v }).version : v
  }).filter((v) => {
    return semver.valid(v)
  })
  if (!versions.length) return fail()
  if (inc && (versions.length !== 1 || range.length)) { return failInc() }

  for (let i = 0, l = range.length; i < l; i++) {
    versions = versions.filter((v) => {
      return semver.satisfies(v, range[i], options)
    })
    if (!versions.length) return fail()
  }
  return success(versions)
}


const failInc = () => {
  console.error('--inc can only be used on a single version with no range')
  fail()
}

const fail = () => process.exit(1)

const success = () => {
  const compare = reverse ? 'rcompare' : 'compare'
  versions.sort((a, b) => {
    return semver[compare](a, b, options)
  }).map((v) => {
    return semver.clean(v, options)
  }).map((v) => {
    return inc ? semver.inc(v, inc, options, identifier) : v
  }).forEach((v, i, _) => { console.log(v) })
}

const help = () => console.log(
\`SemVer \${version}

A JavaScript implementation of the https://semver.org/ specification
Copyright Isaac Z. Schlueter

Usage: semver [options] <version> [<version> [...]]
Prints valid versions sorted by SemVer precedence

Options:
-r --range <range>
        Print versions that match the specified range.

-i --increment [<level>]
        Increment a version by the specified level.  Level can
        be one of: major, minor, patch, premajor, preminor,
        prepatch, or prerelease.  Default level is 'patch'.
        Only one version may be specified.

--preid <identifier>
        Identifier to be used to prefix premajor, preminor,
        prepatch or prerelease version increments.

-l --loose
        Interpret versions and ranges loosely

-p --include-prerelease
        Always include prerelease versions in range matching

-c --coerce
        Coerce a string into SemVer if possible
        (does not imply --loose)

--rtl
        Coerce version strings right to left

--ltr
        Coerce version strings left to right (default)

Program exits successfully if any valid version satisfies
all supplied ranges, and prints all satisfying versions.

If no satisfying versions are found, then exits failure.

Versions are printed in ascending order, so supplying
multiple versions to the utility will just sort them.\`)

main()
`
      },
      "index.js": `// just pre-load all the stuff that index.js lazily exports
const internalRe = require('./internal/re')
module.exports = {
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: require('./internal/constants').SEMVER_SPEC_VERSION,
  SemVer: require('./classes/semver'),
  compareIdentifiers: require('./internal/identifiers').compareIdentifiers,
  rcompareIdentifiers: require('./internal/identifiers').rcompareIdentifiers,
  parse: require('./functions/parse'),
  valid: require('./functions/valid'),
  clean: require('./functions/clean'),
  inc: require('./functions/inc'),
  diff: require('./functions/diff'),
  major: require('./functions/major'),
  minor: require('./functions/minor'),
  patch: require('./functions/patch'),
  prerelease: require('./functions/prerelease'),
  compare: require('./functions/compare'),
  rcompare: require('./functions/rcompare'),
  compareLoose: require('./functions/compare-loose'),
  compareBuild: require('./functions/compare-build'),
  sort: require('./functions/sort'),
  rsort: require('./functions/rsort'),
  gt: require('./functions/gt'),
  lt: require('./functions/lt'),
  eq: require('./functions/eq'),
  neq: require('./functions/neq'),
  gte: require('./functions/gte'),
  lte: require('./functions/lte'),
  cmp: require('./functions/cmp'),
  coerce: require('./functions/coerce'),
  Comparator: require('./classes/comparator'),
  Range: require('./classes/range'),
  satisfies: require('./functions/satisfies'),
  toComparators: require('./ranges/to-comparators'),
  maxSatisfying: require('./ranges/max-satisfying'),
  minSatisfying: require('./ranges/min-satisfying'),
  minVersion: require('./ranges/min-version'),
  validRange: require('./ranges/valid'),
  outside: require('./ranges/outside'),
  gtr: require('./ranges/gtr'),
  ltr: require('./ranges/ltr'),
  intersects: require('./ranges/intersects'),
  simplifyRange: require('./ranges/simplify'),
  subset: require('./ranges/subset'),
}
`,
      "package.json": JSON.stringify({
        "name": "semver",
        "version": "7.3.2",
        "description": "The semantic version parser used by npm.",
        "main": "index.js",
        "scripts": {
          "test": "tap",
          "snap": "tap",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --follow-tags"
        },
        "devDependencies": {
          "tap": "^14.10.7"
        },
        "license": "ISC",
        "repository": "https://github.com/npm/node-semver",
        "bin": {
          "semver": "./bin/semver.js"
        },
        "files": [
          "bin/**/*.js",
          "range.bnf",
          "classes/**/*.js",
          "functions/**/*.js",
          "internal/**/*.js",
          "ranges/**/*.js",
          "index.js",
          "preload.js"
        ],
        "tap": {
          "check-coverage": true,
          "coverage-map": "map.js"
        },
        "engines": {
          "node": ">=10"
        }
      })
    }
  },
  "package-lock.json": JSON.stringify({
    "name": "@isaacs/dep-installed-without-bin-link",
    "version": "1.0.0",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "name": "@isaacs/dep-installed-without-bin-link",
        "version": "1.0.0",
        "dependencies": {
          "mkdirp": "^1.0.4",
          "semver": "^7.3.2"
        }
      },
      "node_modules/mkdirp": {
        "version": "1.0.4",
        "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-1.0.4.tgz",
        "integrity": "sha512-vVqVZQyf3WLx2Shd0qJ9xuvqgAyKPLAiqITEtqW0oIUjzo3PePDd6fW9iFz30ef7Ysp/oiWqbhszeGWW2T6Gzw==",
        "bin": {
          "mkdirp": "bin/cmd.js"
        },
        "engines": {
          "node": ">=10"
        }
      },
      "node_modules/semver": {
        "version": "7.3.2",
        "resolved": "https://registry.npmjs.org/semver/-/semver-7.3.2.tgz",
        "integrity": "sha512-OrOb32TeeambH6UrhtShmF7CRDqhL6/5XpPNp2DuRH6+9QLw/orhp72j87v8Qa1ScDkvrrBNpZcDejAirJmfXQ==",
        "bin": {
          "semver": "bin/semver.js"
        },
        "engines": {
          "node": ">=10"
        }
      }
    },
    "dependencies": {
      "mkdirp": {
        "version": "1.0.4",
        "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-1.0.4.tgz",
        "integrity": "sha512-vVqVZQyf3WLx2Shd0qJ9xuvqgAyKPLAiqITEtqW0oIUjzo3PePDd6fW9iFz30ef7Ysp/oiWqbhszeGWW2T6Gzw=="
      },
      "semver": {
        "version": "7.3.2",
        "resolved": "https://registry.npmjs.org/semver/-/semver-7.3.2.tgz",
        "integrity": "sha512-OrOb32TeeambH6UrhtShmF7CRDqhL6/5XpPNp2DuRH6+9QLw/orhp72j87v8Qa1ScDkvrrBNpZcDejAirJmfXQ=="
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "@isaacs/dep-installed-without-bin-link",
    "version": "1.0.0",
    "description": "has some deps without bins linked, for rebuilding",
    "dependencies": {
      "semver": "^7.3.2",
      "mkdirp": "^1.0.4"
    }
  })
})
  const {utimesSync} = require('fs')
  const n = Date.now() + 10000
  const {resolve} = require('path')
  
  utimesSync(resolve(path, "node_modules/.package-lock.json"), new Date(n), new Date(n))
  return path
}
