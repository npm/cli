const localeCompare = require('@isaacs/string-locale-compare')('en')
const npa = require('npm-package-arg')
const pacote = require('pacote')
const npmFetch = require('npm-registry-fetch')
const { log, output } = require('proc-log')

const sortByNameVersion = (a, b) =>
  localeCompare(a.name, b.name) || localeCompare(a.version, b.version)

const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'always' })
const formatAge = (ms) => {
  const seconds = Math.round(ms / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)
  if (days >= 1) {
    return relativeTime.format(-days, 'day')
  }
  if (hours >= 1) {
    return relativeTime.format(-hours, 'hour')
  }
  return relativeTime.format(-Math.max(1, minutes), 'minute')
}

class AuditMinReleaseAge {
  constructor (tree, filterSet, npm, opts) {
    this.tree = tree
    this.filterSet = filterSet
    this.npm = npm
    this.opts = opts
    this.violations = []
    this.unverifiable = []
    this.verifiedCount = 0
    this.auditedCount = 0
    this.checked = new Set()
    // packument cache shared across all lookups in this run
    this.packumentCache = new Map()
  }

  async run () {
    const before = this.opts.before
    if (!before) {
      throw Object.assign(
        new Error(
          '`npm audit min-release-age` requires `--min-release-age=<days>` ' +
          'or `--before=<date>` to be set.'
        ),
        { code: 'EUSAGE' }
      )
    }

    const cutoff = before instanceof Date ? before : new Date(before)
    if (Number.isNaN(cutoff.getTime())) {
      throw Object.assign(
        new Error(`invalid \`--before\` value: ${before}`),
        { code: 'EUSAGE' }
      )
    }
    if (cutoff.getTime() > Date.now()) {
      throw Object.assign(
        new Error(
          `\`--min-release-age\`/\`--before\` cutoff is in the future ` +
          `(${cutoff.toISOString()}); refusing to run.`
        ),
        { code: 'EUSAGE' }
      )
    }
    this.cutoff = cutoff

    const start = process.hrtime.bigint()

    log.verbose('audit', 'collecting installable dependencies from lockfile')
    const edges = this.#collectEdges()
    if (edges.size === 0) {
      throw Object.assign(
        new Error('found no registry dependencies in lockfile to audit'),
        { code: 'EAUDITNOPKG' }
      )
    }

    log.verbose('audit', `auditing publish time for ${edges.size} edges`)
    const { default: pMap } = await import('p-map')
    await pMap(edges, (edge) => this.#checkEdge(edge), {
      concurrency: 20,
      stopOnError: false,
    })

    const violations = this.violations.sort(sortByNameVersion)
    const unverifiable = this.unverifiable.sort(sortByNameVersion)

    const allowUnverifiable = !!this.opts.allowUnverifiable
    // Always fail on confirmed policy violations.
    // Fail on unverifiable too, unless the user opted in to allowing them via --allow-unverifiable.
    if (violations.length || (unverifiable.length && !allowUnverifiable)) {
      process.exitCode = 1
    }

    if (this.npm.config.get('json')) {
      output.buffer({
        cutoff: this.cutoff.toISOString(),
        audited: this.auditedCount,
        verified: this.verifiedCount,
        allowUnverifiable,
        violations,
        unverifiable,
      })
      return
    }

    const elapsed = process.hrtime.bigint() - start
    this.#humanReport({ violations, unverifiable, allowUnverifiable, elapsedNs: elapsed })
  }

  #collectEdges () {
    const omit = new Set(this.npm.config.get('omit') || [])
    const edges = new Set()
    for (const node of this.tree.inventory.values()) {
      for (const edge of node.edgesOut.values()) {
        const filteredOut =
          edge.from &&
          this.filterSet &&
          this.filterSet.size > 0 &&
          !this.filterSet.has(edge.from.target)
        if (filteredOut) {
          continue
        }
        const target = edge.to
        if (!target) {
          continue
        }
        // Skip the project root and workspace roots — they are not installed from a registry.
        if (target.isRoot || target.isWorkspace) {
          continue
        }
        // Skip symlinks to local paths; they have no publish time.
        if (target.isLink) {
          continue
        }
        // Bundled deps inherit their freshness from the bundling parent's publish time.
        // The parent itself is in the tree and gets validated.
        if (target.inBundle) {
          continue
        }
        // Honor `omit` (e.g. dev/peer/optional) so e.g. `--omit=dev` excludes devDependencies from the policy check.
        let omitted = false
        for (const t of omit) {
          if (target[t]) {
            omitted = true
            break
          }
        }
        if (omitted) {
          continue
        }
        // Source must resolve to a registry; skip git, file:, http tarballs, workspace:, etc.
        const spec = this.#getEdgeSpec(edge)
        if (!spec || !spec.registry) {
          continue
        }
        edges.add(edge)
      }
    }
    return edges
  }

  #getEdgeSpec (edge) {
    let name = edge.name
    try {
      name = npa(edge.spec).subSpec.name
    } catch {
      // leave as edge.name
    }
    try {
      return npa(`${name}@${edge.spec}`)
    } catch {
      return null
    }
  }

  #getRegistry (spec) {
    return npmFetch.pickRegistry(spec, this.npm.flatOptions)
  }

  async #checkEdge (edge) {
    const target = edge.to
    const { name, version } = target.package || {}
    if (!name || !version) {
      return
    }
    const key = `${name}@${version}`
    if (this.checked.has(key)) {
      return
    }
    this.checked.add(key)
    this.auditedCount += 1

    const lookupSpec = npa(`${name}@${version}`)
    const registry = this.#getRegistry(lookupSpec)
    const locations = [target.location].filter(Boolean)

    let packument
    try {
      packument = await pacote.packument(lookupSpec, {
        ...this.npm.flatOptions,
        fullMetadata: true,
        packumentCache: this.packumentCache,
      })
    } catch (err) {
      this.unverifiable.push({
        name,
        version,
        registry,
        locations,
        code: err.code || 'EPACKUMENT',
        reason: err.message,
      })
      return
    }

    const versionExists = !!packument?.versions?.[version]
    const timeEntry = packument?.time?.[version]

    if (!timeEntry) {
      this.unverifiable.push({
        name,
        version,
        registry,
        locations,
        code: versionExists ? 'EMISSINGTIME' : 'EUNPUBLISHED',
        reason: versionExists
          ? `registry has no \`time\` data for ${name}@${version}`
          : `${name}@${version} is not present in the registry packument ` +
            '(possibly unpublished)',
      })
      return
    }

    const publishedAtMs = Date.parse(timeEntry)
    if (Number.isNaN(publishedAtMs)) {
      this.unverifiable.push({
        name,
        version,
        registry,
        locations,
        code: 'EINVALIDTIME',
        reason: `registry returned invalid \`time\` value for ${name}@${version}: ${timeEntry}`,
      })
      return
    }

    if (publishedAtMs > this.cutoff.getTime()) {
      this.violations.push({
        name,
        version,
        registry,
        locations,
        publishedAt: new Date(publishedAtMs).toISOString(),
        ageMs: Math.max(0, Date.now() - publishedAtMs),
      })
      return
    }

    this.verifiedCount += 1
  }

  #humanReport ({ violations, unverifiable, allowUnverifiable, elapsedNs }) {
    const elapsedSeconds = Math.floor(Number(elapsedNs) / 1e9)
    const auditedPlural = this.auditedCount === 1 ? '' : 's'
    output.standard(
      `audited ${this.auditedCount} package${auditedPlural} ` +
      `against cutoff ${this.cutoff.toISOString()} in ${elapsedSeconds}s`
    )
    output.standard()

    if (!violations.length && !unverifiable.length) {
      const verifiedBold = this.npm.chalk.bold('verified')
      output.standard(
        `all ${this.auditedCount} package${auditedPlural} ` +
        `${this.auditedCount === 1 ? 'was' : 'were'} ${verifiedBold} ` +
        'as published on or before the cutoff'
      )
      return
    }

    if (violations.length) {
      const violationClr = this.npm.chalk.redBright('too new')
      const verb = violations.length === 1 ? 'has' : 'have'
      output.standard(
        `${violations.length} package${violations.length === 1 ? '' : 's'} ` +
        `${verb} a publish time newer than the cutoff (${violationClr}):`
      )
      output.standard()
      for (const v of violations) {
        const age = formatAge(v.ageMs)
        output.standard(
          `${this.npm.chalk.red(`${v.name}@${v.version}`)} ` +
          `(published ${v.publishedAt}, ${age})`
        )
      }
      output.standard()
    }

    if (unverifiable.length) {
      const unverifClr = this.npm.chalk.yellow('unverifiable')
      const verb = unverifiable.length === 1 ? 'is' : 'are'
      const allowedSuffix = allowUnverifiable ? ', allowed by --allow-unverifiable' : ''
      output.standard(
        `${unverifiable.length} package${unverifiable.length === 1 ? '' : 's'} ` +
        `${verb} ${unverifClr} (no publish time available${allowedSuffix}):`
      )
      output.standard()
      for (const u of unverifiable) {
        output.standard(
          `${this.npm.chalk.yellow(`${u.name}@${u.version}`)} ` +
          `(${u.code}: ${u.reason})`
        )
      }
      output.standard()
    }

    output.standard(
      'Re-run with `--json` for machine-readable output, or update your ' +
      'lockfile by running `npm install` against a registry that satisfies ' +
      'the configured `min-release-age`.'
    )
  }
}

module.exports = AuditMinReleaseAge
