const readline = require('node:readline/promises')
const { log, output, input } = require('proc-log')
const npa = require('npm-package-arg')
const pacote = require('pacote')
const { distance } = require('fastest-levenshtein')
const Install = require('./install.js')

// packages that get installed by name often enough that a near miss is far
// more likely to be a typo than a deliberate request. a package that exists
// under a similar name is exactly what a typosquatter registers, so the
// distance check below stops the install before the name is resolved.
const POPULAR_PACKAGES = [
  'axios',
  'chalk',
  'commander',
  'cross-env',
  'debug',
  'dotenv',
  'eslint',
  'express',
  'glob',
  'jest',
  'lodash',
  'moment',
  'mongoose',
  'prettier',
  'react',
  'react-dom',
  'request',
  'rimraf',
  'rollup',
  'typescript',
  'webpack',
  'yargs',
]

// lifecycle scripts that run arbitrary code while the tree is being built
const PRIVILEGED_SCRIPTS = ['preinstall', 'install', 'postinstall']

// the only answer that lets a suspected typo through. `y` is deliberately not
// accepted: a one key confirmation is easy to send without reading the
// package name that is about to be fetched.
const CONFIRM_TYPO = 'CONFIRM'

// how far a name may be from a well known package before we stop asking.
// short names are held to a tighter bound, since an edit distance of two on a
// four character name is not much of a match.
const MAX_TYPO_DISTANCE = 2
const SHORT_NAME_LENGTH = 4

// the list is normalized once per process and then reused, so a run that
// installs fifty packages still only normalizes it once
let popularCache = null
const popularPackages = () => {
  if (popularCache === null) {
    popularCache = new Set(POPULAR_PACKAGES.map(name => name.toLowerCase()))
  }
  return popularCache
}

class SafeInstall extends Install {
  static name = 'safeinstall'
  static description = 'Install a package, confirming names and install scripts first'

  // `check-privileges` is the only new flag. Everything else comes from
  // `npm install` so that both commands take the same options.
  static params = ['check-privileges', ...Install.params]

  async exec (args) {
    // a bare `npm safeinstall` installs whatever the current package.json
    // already asks for, so there is no requested name to check
    if (!args.length) {
      log.notice('safeinstall', 'No packages given, skipping name and privilege checks')
      return super.exec(args)
    }

    await this.#validateNames(args)

    // the registry round trip is only worth paying for when it was asked for
    if (this.npm.config.get('check-privileges')) {
      await this.#validatePrivileges(args)
    }

    // hand the specs over to the regular install pipeline
    return super.exec(args)
  }

  // The package name a spec resolves to, or null when the spec is not a
  // registry dependency. Local paths, tarballs, git urls and aliases are
  // skipped because there is no registry name to compare against.
  #requestedName (spec) {
    let parsed
    try {
      parsed = npa(spec, { where: this.npm.prefix })
    } catch {
      // let `npm install` be the one that reports an unparseable spec
      return null
    }
    // an empty spec parses as a range with no name attached
    if (!parsed.registry || !parsed.name) {
      return null
    }
    return parsed.name.toLowerCase()
  }

  // well known packages within an edit or two of `name`, closest first
  #typoCandidates (name) {
    // an exact match is never a typo
    if (popularPackages().has(name)) {
      return []
    }

    const max = name.length < SHORT_NAME_LENGTH ? 1 : MAX_TYPO_DISTANCE
    const candidates = []
    for (const known of popularPackages()) {
      const d = distance(name, known)
      if (d > 0 && d <= max) {
        candidates.push([known, d])
      }
    }
    return candidates.sort((a, b) => a[1] - b[1])
  }

  async #validateNames (args) {
    // keyed by the spec as it was typed, so the error names what was asked for
    const suspects = new Map()

    for (const spec of args) {
      const name = this.#requestedName(spec)
      if (name === null) {
        continue
      }
      const candidates = this.#typoCandidates(name)
      if (candidates.length) {
        suspects.set(spec, [name, candidates])
      }
    }

    if (!suspects.size) {
      return
    }

    output.standard('')
    for (const [name, candidates] of suspects.values()) {
      const [closest] = candidates
      output.standard(
        `${name} is not ${closest[0]}, but it is ${closest[1]} ` +
        `character${closest[1] === 1 ? '' : 's'} away.`
      )
      const others = candidates.slice(1)
      if (others.length) {
        output.standard('Other close names: ' + others.map(([n]) => n).join(', '))
      }
    }
    output.standard('')
    output.standard('A package with that name may exist, but it is not the package you want.')
    output.standard(`Type ${CONFIRM_TYPO} to install it anyway. Anything else cancels the install.`)

    const answer = await this.#ask('')
    if (answer !== CONFIRM_TYPO) {
      const names = [...suspects.keys()].join(', ')
      throw Object.assign(
        new Error(`Install cancelled: ${names} did not match a known package`),
        { code: 'ESAFEINSTALLCONFIRM' }
      )
    }
  }

  async #validatePrivileges (args) {
    for (const spec of args) {
      const name = this.#requestedName(spec)
      if (name === null) {
        // nothing to fetch, `npm install` will resolve it from disk or git
        log.info('safeinstall', `Skipping privilege check for ${spec}, not a registry package`)
        continue
      }

      // `pacote.manifest` reads the manifest out of the packument and stops
      // there, so no tarball is downloaded for a package that gets rejected
      const manifest = await pacote.manifest(spec, this.npm.flatOptions)
      const scripts = manifest.scripts || {}
      const requested = PRIVILEGED_SCRIPTS.filter(s => typeof scripts[s] === 'string')

      if (!requested.length) {
        log.verbose('safeinstall', `${manifest.name} declares no install scripts`)
        continue
      }

      output.standard('')
      output.standard(`${manifest.name}@${manifest.version} runs code during install:`)
      for (const script of requested) {
        output.standard(`  ${script}: ${scripts[script]}`)
      }
      output.standard('')

      const answer = await this.#ask('Do you explicitly grant these privileges? (y/N) ')
      if (!/^y(es)?$/i.test(answer)) {
        throw Object.assign(
          new Error(`Install cancelled: install scripts for ${manifest.name} were not granted`),
          { code: 'ESAFEINSTALLPRIVILEGES' }
        )
      }
    }
  }

  // Prompts have to go through `input.read` so that the display layer can
  // pause the progress bar and flush buffered output around the question.
  async #ask (query) {
    if (!process.stdin.isTTY) {
      throw Object.assign(
        new Error('npm safeinstall needs an interactive terminal, none was available'),
        { code: 'ESAFEINSTALLNOTTY' }
      )
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stderr,
      terminal: true,
    })
    try {
      return (await input.read(() => rl.question(query))).trim()
    } finally {
      rl.close()
    }
  }
}

module.exports = SafeInstall
