const { log, output } = require('proc-log')
const semver = require('semver')
const pkgJson = require('@npmcli/package-json')
const { trustedDisplay } = require('@npmcli/arborist/lib/script-allowed.js')
const getInstallScripts = require('@npmcli/arborist/lib/install-scripts.js')
const checkAllowScripts = require('./check-allow-scripts.js')
const resolveAllowScripts = require('./resolve-allow-scripts.js')
const {
  parseSpec,
  applyApprovalForPackage,
  applyDenyForPackage,
  nameKeyFor,
  versionedKeyFor,
} = require('./allow-scripts-writer.js')
const { classifyUnusedEntries } = require('./allow-scripts-prune.js')
const BaseCommand = require('../base-cmd.js')

// Registry selectors may include a version range. Every other parsed spec is
// treated as an exact source selector; non-registry manifest versions are not
// trusted for positional matching.
const parseSelector = (arg) => {
  const parsed = parseSpec(arg)
  if (!parsed) {
    return {
      name: arg,
      range: null,
      exactSource: null,
      allowNonRegistryName: false,
    }
  }

  const name = parsed.name || arg
  const exactSource = (parsed.registry || parsed.type === 'alias') ? null : arg
  const allowNonRegistryName = parsed.registry && parsed.raw === parsed.name
  if (parsed.type === 'version' || parsed.type === 'range') {
    const spec = parsed.fetchSpec
    const range = (!spec || spec === '*' || parsed.rawSpec === '' || parsed.rawSpec === '*')
      ? null
      : spec
    return { name, range, exactSource, allowNonRegistryName }
  }
  return { name, range: null, exactSource, allowNonRegistryName }
}

const selectorDetails = (node) => {
  const policyKey = nameKeyFor(node)
  const versionedPolicyKey = versionedKeyFor(node)
  if (parseSpec(policyKey)?.registry) {
    return {
      ...trustedDisplay(node),
      exactSource: null,
      displaySource: versionedPolicyKey || policyKey,
      trustAnchor: `registry:${policyKey}`,
      isRegistry: true,
      policyKey,
    }
  }

  const exactSource = versionedPolicyKey
  let trustAnchor = exactSource ? `source:${exactSource}` : null
  if (parseSpec(exactSource)?.type === 'git' && policyKey) {
    trustAnchor = `git:${policyKey}`
  }

  return {
    name: node.name || null,
    version: null,
    exactSource,
    displaySource: exactSource || policyKey,
    trustAnchor,
    isRegistry: false,
    policyKey,
  }
}

const isSelectableNode = (node) =>
  !node.isProjectRoot &&
  !node.isWorkspace &&
  !node.isLink &&
  !node.inBundle &&
  !node.inert

// Shared implementation for `npm approve-scripts`, `npm deny-scripts`, and the `npm install-scripts` namespace.
// `npm install-scripts` dispatches to `runMode('approve' | 'deny' | 'list', ...)`.
// The standalone commands set `static verb` and run through the default `exec`.
//
// Extends `BaseCommand` rather than `ArboristCmd` on purpose. Per RFC,
// `allowScripts` is read from the workspace root's `package.json` only;
// individual workspaces don't have their own `allowScripts` field, and
// running approve/deny inside a sub-workspace is identical to running
// it at the root. There's no per-workspace targeting to do, so the
// `--workspace` / `--workspaces` / `--include-workspace-root` params
// from `ArboristCmd` would be misleading no-ops.
class AllowScriptsCmd extends BaseCommand {
  static params = ['all', 'allow-scripts-pending', 'allow-scripts-pin', 'json']
  static ignoreImplicitWorkspace = false

  // Mode of the current run, set by runMode.
  // One of 'approve', 'deny', 'list', or 'prune'.
  #mode = null

  // verb drives the writers and summaries, which only run in the two write modes, so it is never read while listing.
  get verb () {
    return this.#mode
  }

  // Standalone `npm approve-scripts` / `npm deny-scripts` pick their mode from `static verb`.
  async exec (args) {
    return this.runMode(this.constructor.verb, args)
  }

  async runMode (mode, args) {
    this.#mode = mode

    if (this.npm.global) {
      throw Object.assign(
        new Error(`\`npm ${this.constructor.name}\` does not work for global installs`),
        { code: 'EGLOBAL' }
      )
    }

    // `prune` has its own flow: it reads the literal package.json#allowScripts
    // map, not the resolved policy.
    if (mode === 'prune') {
      return this.runPrune(args)
    }

    // `--allow-scripts-pending` is only honored by commands that declare it; the namespace lists via `ls` instead.
    const pending = this.constructor.params.includes('allow-scripts-pending') &&
      !!this.npm.config.get('allow-scripts-pending')
    const all = !!this.npm.config.get('all')
    // The `ls` subcommand lists, and so does `--allow-scripts-pending` on the write commands.
    const list = mode === 'list' || pending

    if (list && (args.length > 0 || all)) {
      const what = mode === 'list' ? '`npm install-scripts ls`' : '`--allow-scripts-pending`'
      throw this.usageError(
        `${what} cannot be combined with positional arguments or \`--all\`.`
      )
    }
    if (!list && !all && args.length === 0) {
      throw this.usageError()
    }
    if (mode === 'deny' && pending) {
      throw this.usageError(
        '`npm deny-scripts --allow-scripts-pending` is not supported; ' +
        'run `npm install-scripts ls` to list unreviewed packages.'
      )
    }

    const Arborist = require('@npmcli/arborist')
    const { policy } = await resolveAllowScripts(this.npm)
    const arb = new Arborist({
      ...this.npm.flatOptions,
      path: this.npm.prefix,
      allowScripts: policy,
    })
    await arb.loadActual()

    // Keep listing unreviewed packages even with ignore-scripts set, so
    // you can move from a blanket ignore-scripts to an allowlist. This
    // only lists; nothing runs.
    const unreviewed = await checkAllowScripts({ arb, npm: this.npm, includeWhenIgnored: true })

    if (list) {
      return this.runPending(unreviewed)
    }

    if (all) {
      return this.runAll(unreviewed)
    }

    return this.runPositional(args, arb)
  }

  runPending (unreviewed) {
    if (this.npm.flatOptions.json) {
      output.buffer({ allowScripts: this.pendingSummary(unreviewed) })
      return
    }
    if (unreviewed.length === 0) {
      output.standard('No packages with unreviewed install scripts.')
      return
    }
    const count = unreviewed.length
    const has = count === 1 ? 'has' : 'have'
    const pkg = count === 1 ? 'package' : 'packages'
    output.standard(
      `${count} ${pkg} ${has} install scripts blocked because they are not covered by allowScripts:`
    )
    for (const { node, scripts } of unreviewed) {
      const { name, version, exactSource, isRegistry } = selectorDetails(node)
      /* istanbul ignore next: every test node has a name */
      const display = name || '<unknown>'
      const versionSuffix = version ? `@${version}` : ''
      const sourceSuffix = isRegistry ? '' : ` [${exactSource || 'untrusted source'}]`
      const events = Object.entries(scripts)
        .map(([event, cmd]) => `${event}: ${cmd}`)
        .join('; ')
      output.standard(`  ${display}${versionSuffix}${sourceSuffix} (${events})`)
    }
    output.standard('')
    output.standard(
      'Run `npm install-scripts approve <pkg>` to allow, ' +
      'or `npm install-scripts deny <pkg>` to deny.'
    )
  }

  // Build the same `{ name, changes }` shape printSummary uses for writes,
  // but tag every entry as `pending` since nothing is written. Selectors are
  // derived exactly like the text listing above.
  pendingSummary (unreviewed) {
    const groups = new Map()
    for (const { node } of unreviewed) {
      const { name, version, exactSource } = selectorDetails(node)
      /* istanbul ignore next: every test node has a name */
      const display = name || '<unknown>'
      const key = exactSource || (version ? `${display}@${version}` : display)
      if (!groups.has(display)) {
        groups.set(display, [])
      }
      groups.get(display).push({ key, change: 'pending' })
    }
    return [...groups].map(([name, changes]) => ({ name, changes }))
  }

  async runAll (unreviewed) {
    if (unreviewed.length === 0) {
      if (this.npm.flatOptions.json) {
        output.buffer({ allowScripts: [] })
        return
      }
      output.standard('No packages with unreviewed install scripts.')
      return
    }
    // Bundled dependencies never appear in `unreviewed` (checkAllowScripts
    // skips them because they never run their install scripts and cannot
    // be allowlisted), so there is nothing extra to filter here.
    const groups = this.groupByPackage(unreviewed.map(({ node }) => node))
    await this.writePolicyChanges(groups)
  }

  async runPositional (args, arb) {
    const { matched, unmatched, ambiguous } = this.findNodesForArgs(args, arb)
    if (ambiguous.length > 0) {
      const details = ambiguous.map(({ arg, sources }) =>
        `Package selector "${arg}" matches multiple sources:\n` +
        sources.map(source => `  ${source}`).join('\n')
      ).join('\n')
      throw Object.assign(
        new Error(`${details}\nRe-run with an exact source selector.`),
        { code: 'EINSTALLSCRIPTSAMBIGUOUS' }
      )
    }
    if (unmatched.length > 0) {
      throw Object.assign(
        new Error(`No installed packages match: ${unmatched.join(', ')}`),
        { code: 'ENOMATCH' }
      )
    }
    const groups = this.groupByPackage(matched)
    /* istanbul ignore if: matched is non-empty here; groups only empties when a
       matched node has no trusted key, which groupByPackage already warns on */
    if (Object.keys(groups).length === 0) {
      throw Object.assign(
        new Error(`No installed packages match: ${args.join(', ')}`),
        { code: 'ENOMATCH' }
      )
    }
    await this.writePolicyChanges(groups)
  }

  findNodesForArgs (args, arb) {
    // Registry dependencies match their trusted name and may be narrowed by
    // version. Non-registry dependencies match their installed name, while an
    // exact source selector matches their versioned policy identity.
    const matched = []
    const unmatched = []
    const ambiguous = []
    const candidates = [...arb.actualTree.inventory.values()]
      .filter(isSelectableNode)
      .map((node, index) => {
        const details = selectorDetails(node)
        const location = node.location || node.path
        return {
          node,
          ...details,
          trustAnchor: details.trustAnchor ||
            `untrusted:${location || `${node.name || '<unknown>'}:${index}`}`,
          displaySource: details.displaySource ||
            location ||
            node.name ||
            '<untrusted source>',
        }
      })

    for (const arg of args) {
      const {
        name: wantedName,
        range,
        exactSource,
        allowNonRegistryName,
      } = parseSelector(arg)
      const found = candidates.filter(candidate => {
        if (exactSource) {
          return candidate.exactSource === exactSource
        }
        if (!candidate.name || candidate.name !== wantedName) {
          return false
        }
        if (!candidate.isRegistry && !allowNonRegistryName) {
          return false
        }
        if (!range) {
          return true
        }
        return candidate.isRegistry &&
          Boolean(candidate.version) &&
          semver.satisfies(candidate.version, range, { loose: true })
      })

      if (found.length === 0) {
        unmatched.push(arg)
        continue
      }

      if (this.verb === 'approve' && !exactSource) {
        const trustAnchors = new Set(found.map(({ trustAnchor }) => trustAnchor))
        if (trustAnchors.size > 1) {
          ambiguous.push({
            arg,
            sources: [...new Set(found.map(({ displaySource }) => displaySource))],
          })
          continue
        }
      }

      matched.push(...found.map(({ node }) => node))
    }
    return { matched, unmatched, ambiguous }
  }

  get logTitle () {
    return this.constructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

  groupByPackage (nodes) {
    const groups = {}
    for (const node of nodes) {
      const key = nameKeyFor(node)
      /* istanbul ignore if: callers prefilter via inBundle and trustedDisplay so untrusted nodes don't reach here */
      if (!key) {
        log.warn(
          this.logTitle,
          `skipping ${node.name || '<unknown>'}: no trusted identity for policy key`
        )
        continue
      }
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(node)
    }
    return groups
  }

  async writePolicyChanges (groups) {
    const pin = this.npm.config.get('allow-scripts-pin') !== false

    const pkg = await pkgJson.load(this.npm.prefix)
    const content = pkg.content
    const existing = content.allowScripts && typeof content.allowScripts === 'object'
      ? content.allowScripts
      : {}

    let updated = existing
    const summary = []

    for (const [name, nodes] of Object.entries(groups)) {
      const result = this.verb === 'approve'
        ? applyApprovalForPackage(updated, nodes, { pin })
        : applyDenyForPackage(updated, nodes)

      if (result.warning) {
        log.warn(this.logTitle, result.warning)
      }
      updated = result.allowScripts
      summary.push({ name, changes: result.changes })
    }

    /* istanbul ignore else: writePolicyChanges only called when changes are expected */
    if (updated !== existing) {
      pkg.update({ allowScripts: updated })
      await pkg.save()
    }

    this.printSummary(summary)
  }

  printSummary (summary) {
    if (this.npm.flatOptions.json) {
      output.buffer({ allowScripts: summary })
      return
    }
    const verb = this.verb === 'approve' ? 'Approved' : 'Denied'
    let touched = 0
    for (const { name, changes } of summary) {
      if (changes.length === 0) {
        continue
      }
      touched++
      output.standard(`${verb} ${name}:`)
      for (const { key, change } of changes) {
        output.standard(`  ${change} ${key}`)
      }
    }
    if (touched === 0) {
      output.standard(`Nothing to ${this.verb}; allowScripts unchanged.`)
    }
  }

  // `npm install-scripts prune`: drop package.json#allowScripts entries that no
  // longer match an installed package with an install script. Edits only
  // package.json (never `.npmrc`/CLI policy); `--dry-run` reports without writing.
  async runPrune (args) {
    const all = !!this.npm.config.get('all')
    if (args.length > 0 || all) {
      throw this.usageError(
        '`npm install-scripts prune` cannot be combined with positional arguments or `--all`.'
      )
    }

    const dryRun = !!this.npm.config.get('dry-run')
    const pkg = await pkgJson.load(this.npm.prefix)
    const existing = pkg.content.allowScripts && typeof pkg.content.allowScripts === 'object'
      ? pkg.content.allowScripts
      : {}

    let removed = []
    if (Object.keys(existing).length > 0) {
      const Arborist = require('@npmcli/arborist')
      const arb = new Arborist({
        ...this.npm.flatOptions,
        path: this.npm.prefix,
      })
      await arb.loadActual()

      // Candidate install nodes (mirrors collectUnreviewedScripts), tagged with
      // whether each has install scripts so the classifier can tell "gone" from
      // "no longer has scripts".
      const nodes = []
      for (const node of arb.actualTree.inventory.values()) {
        if (!isSelectableNode(node)) {
          continue
        }
        const scripts = await getInstallScripts(node)
        nodes.push({ node, hasScripts: Object.keys(scripts).length > 0 })
      }

      const { remaining, removed: unused } = classifyUnusedEntries(existing, nodes)
      removed = unused

      if (removed.length > 0 && !dryRun) {
        // Drop the field entirely when nothing is left rather than leaving `{}`.
        pkg.update({
          allowScripts: Object.keys(remaining).length > 0 ? remaining : undefined,
        })
        await pkg.save()
      }
    }

    this.printPruneSummary({ removed, dryRun })
  }

  printPruneSummary ({ removed, dryRun }) {
    if (this.npm.flatOptions.json) {
      output.buffer({ allowScripts: { removed, dryRun } })
      return
    }
    if (removed.length === 0) {
      output.standard('No unused allowScripts entries.')
      return
    }
    const entry = removed.length === 1 ? 'entry' : 'entries'
    output.standard(
      `${dryRun ? 'Would remove' : 'Removed'} ${removed.length} unused allowScripts ${entry}:`
    )
    for (const { key, reason } of removed) {
      const text = reason === 'not-installed' ? 'package not installed' : 'no install scripts'
      output.standard(`  ${key} (${text})`)
    }
  }
}

module.exports = AllowScriptsCmd
