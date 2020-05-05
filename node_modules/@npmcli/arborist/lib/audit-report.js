// an object representing the set of vulnerabilities in a tree

const npa = require('npm-package-arg')
const pickManifest = require('npm-pick-manifest')
const pacote = require('pacote')

const Vuln = require('./vuln.js')

const _getReport = Symbol('getReport')
const _processDeps = Symbol('processDeps')
const _processDependent = Symbol('processDependent')
const _addVulnerability = Symbol('addVulnerability')
const _vulnDependents = Symbol('vulnDependents')
const _isVulnerable = Symbol('isVulnerable')
const _specVulnerable = Symbol('specVulnerable')
const _specVulnCheck = Symbol('specVulnCheck')
const _fixAvailable = Symbol('fixAvailable')
const _packument = Symbol('packument')
const _packuments = Symbol('packuments')
const _getDepSpec = Symbol('getDepSpec')
const _init = Symbol('init')
const procLog = require('./proc-log.js')

const fetch = require('npm-registry-fetch')

class AuditReport extends Map {
  static load (tree, opts) {
    return new AuditReport(tree, opts).run()
  }

  get auditReportVersion () {
    return 2
  }

  toJSON () {
    const obj = {
      auditReportVersion: this.auditReportVersion,
      vulnerabilities: {},
      metadata: {
        vulnerabilities: {
          info: 0,
          low: 0,
          moderate: 0,
          high: 0,
          critical: 0,
          total: this.size,
        },
        dependencies: {
          prod: 0,
          dev: 0,
          optional: 0,
          peer: 0,
          peerOptional: 0,
          total: this.tree.inventory.size,
        },
      },
    }

    for (const node of this.tree.inventory.values()) {
      const { dependencies } = obj.metadata
      let prod = true
      for (const type of [
        'dev',
        'optional',
        'peer',
        'peerOptional',
      ]) {
        if (node[type]) {
          dependencies[type]++
          prod = false
        }
      }
      if (prod)
        dependencies.prod ++
    }

    // if it doesn't have any topVulns, then it's fixable with audit fix
    // for each topVuln, figure out if it's fixable with audit fix --force,
    // or if we have to just delete the thing, and if the fix --force will
    // require a semver major update.
    for (const [name, vuln] of this.entries()) {
      obj.vulnerabilities[name] = vuln.toJSON()
      obj.metadata.vulnerabilities[vuln.severity]++
    }

    return obj
  }

  constructor (tree, opts = {}) {
    super()
    this[_vulnDependents] = new Set()
    this[_packuments] = new Map()
    this.topVulns = new Map()
    this.advisoryVulns = new Map()
    this.dependencyVulns = new Map()

    this.error = null
    this.options = opts
    this.log = opts.log || procLog
    this.tree = tree
  }

  async run () {
    this.report = await this[_getReport]()
    if (this.report) {
      await this[_init]()
      await this[_processDeps]()
    }
    return this
  }

  async [_init] () {
    process.emit('time', 'auditReport:init')
    const promises = []
    for (const advisory of Object.values(this.report.advisories)) {
      const {
        module_name: name,
        vulnerable_versions: range,
      } = advisory
      promises.push(this[_addVulnerability](name, range, advisory))
    }

    await Promise.all(promises)
    process.emit('timeEnd', 'auditReport:init')
  }

  // for each node P
  //  for each vulnerable dep Q
  //    pickManifest(Q, P's dep on Q, {avoid})
  //    if resulting version is vunlerable, then P@version is vulnerable
  //      find all versions of P depending on unsafe Q
  async [_processDeps] () {
    process.emit('time', 'auditReport:process')
    for (const p of this[_vulnDependents]) {
      await this[_processDependent](p)
    }
    process.emit('timeEnd', 'auditReport:process')
  }

  isVulnerable (node) {
    return node && this.has(node.name) &&
      this.get(node.name).isVulnerable(node)
  }

  [_specVulnCheck] (paku, spec) {
    // if it's not a thing that came from the registry, and for whatever
    // reason, it's vulnerable, and we have to assume we can't fix that.
    if (!paku || !paku.versions || typeof paku.versions !== 'object')
      return false

    // similarly, even if we HAVE a packument, but we're looking for a version
    // that doesn't come out of that packument, and what we've got is
    // vulnerable, then we're stuck with it.
    const specObj = npa(spec)
    if (!specObj.registry)
      return false

    return spec
  }

  // pass in the packument for the vulnerable dep, the spec that is
  // depended upon, and the range of dep versions to avoid.
  // returns true if every satisfying version is vulnerable.
  [_specVulnerable] (paku, spec, avoid) {
    spec = this[_specVulnCheck](paku, spec)
    if (spec === false)
      return true

    // if we can't avoid the vulnerable version range within the spec
    // required, then the dep range is entirely vulnerable.
    try {
      return pickManifest(paku, spec, {
        ...this.options,
        before: null,
        avoid,
      })._shouldAvoid
    } catch (er) {
      // not vulnerable per se, but also not installable, so best avoided
      // this can happen when dep versions are unpublished.
      /* istanbul ignore next */
      return true
    }
  }

  // see if the top node CAN be fixed, even with a semver major update
  // if not, then the user just has to find a different thing to use.
  [_fixAvailable] (paku, spec, avoid) {
    spec = this[_specVulnCheck](paku, spec)
    if (spec === false)
      return false

    try {
      const {
        _isSemVerMajor: isSemVerMajor,
        version,
        name,
      } = pickManifest(paku, spec, {
        ...this.options,
        before: null,
        avoid,
        avoidStrict: true,
      })
      return {name, version, isSemVerMajor}
    } catch (er) {
      return false
    }
  }

  async [_processDependent] (p) {
    const loc = p.location || '#ROOT'
    process.emit('time', `auditReport:dep:${loc}`)
    // remove it from the queue so we can process it again if another
    // vulnerability will affect it.
    this[_vulnDependents].delete(p)
    for (const edge of p.edgesOut.values()) {
      if (!this.isVulnerable(edge.to))
        continue

      const {name, type, spec} = edge
      process.emit('time', `auditReport:dep:${loc}:${edge.to.location}`)
      const vuln = this.get(name)
      const {packument, range: avoid} = vuln

      if (this[_specVulnerable](packument, spec, avoid)) {
        // whether it's the root, or just something we symlinked to a
        // random place on disk, we aren't going to update it by looking
        // in the registry.  Track these separately.
        if (p.isTop) {
          // this indicates that the root is vulnerable, and cannot be
          // upgraded out of the bad place without --force.  But, there's
          // no need to add it to the actual vulns list, because nothing
          // depends on root.
          this.topVulns.set(name, vuln)
          vuln.topNodes.add(p)
          // We don't provide fixes for top nodes other than root, but we
          // still check to see if the node is fixable, and if semver major
          vuln.fixAvailable = this[_fixAvailable](packument, spec, avoid)
        } else {
          // p is vulnerable!
          // mark all versions with this problem, and then add the
          // vulnerability for the dependent
          const paku = await this[_packument](p.name)
          const metaVuln = []
          if (!paku) {
            // not a dep that comes from the registry, apparently
            metaVuln.push(p.package.version)
          } else {
            for (const [version, pmani] of Object.entries(paku.versions)) {
              const spec = this[_getDepSpec](pmani, name)
              // if we don't even depend on the thing, we're in the clear
              if (typeof spec !== 'string')
                continue
              const specVuln = this[_specVulnerable](packument, spec, avoid)
              if (specVuln)
                metaVuln.push(version)
            }
          }
          await this[_addVulnerability](p.name, metaVuln.join(' || '), vuln)
        }
      }

      process.emit('timeEnd', `auditReport:dep:${loc}:${edge.to.location}`)
    }
    process.emit('timeEnd', `auditReport:dep:${loc}`)
  }

  async [_packument] (name) {
    return this[_packuments].has(name) ? this[_packuments].get(name)
      : pacote.packument(name, { ...this.options })
        .catch(() => null)
        .then(packument => {
          this[_packuments].set(name, packument)
          return packument
        })
  }

  [_getDepSpec] (mani, name) {
    // skip dev because that only matters at the root,
    // where we aren't fetching a manifest from the registry
    // with multiple versions anyway.
    return mani.dependencies && mani.dependencies[name] ||
      mani.optionalDependencies && mani.optionalDependencies[name] ||
      mani.peerDependencies && mani.peerDependencies[name]
  }

  delete (name) {
    super.delete(name)
    this.topVulns.delete(name)
    this.advisoryVulns.delete(name)
    this.dependencyVulns.delete(name)
  }

  set () {
    throw new Error('do not call AuditReport.set() directly')
  }

  async [_addVulnerability] (name, range, via) {
    const has = this.has(name)
    const vuln = has ? this.get(name) : new Vuln({ name, via })

    if (has)
      vuln.addVia(via)
    else
      super.set(name, vuln)

    // if we've already seen this exact range, just make sure that
    // we have the advisory or source already, but do nothing else,
    // because all the matching have already been collected.
    if (vuln.hasRange(range))
      return

    vuln.addRange(range)

    // track it in the appropriate maps for reporting on later
    super.set(name, vuln)
    if (!(via instanceof Vuln)) {
      this.dependencyVulns.delete(name)
      this.advisoryVulns.set(name, vuln)
    } else if (!this.advisoryVulns.has(name))
      this.dependencyVulns.set(name, vuln)

    process.emit('time', `auditReport:add:${name}@${range}`)

    for (const node of this.tree.inventory.query('name', name)) {
      if (vuln.nodes.has(node) || !vuln.isVulnerable(node))
        continue

      for (const {from} of node.edgesIn) {
        this[_vulnDependents].add(from)
      }
    }

    // if we didn't get anything, then why is this even here??
    if (vuln.nodes.size === 0)
      return this.delete(name)

    if (!vuln.packument)
      vuln.packument = await this[_packument](name)

    process.emit('timeEnd', `auditReport:add:${name}@${range}`)
  }

  async [_getReport] () {
    process.emit('time', 'auditReport:getReport')
    try {
      // if we're not auditing, just return false
      if (this.options.audit === false || this.tree.inventory.size === 0)
        return null

      // we always hit the quick endpoint, because we calculate remediations
      // locally anyway, to handle meta-vulnerabilities.
      const res = await fetch('/-/npm/v1/security/audits/quick', {
        ...this.options,
        registry: this.options.auditRegistry || this.options.registry,
        method: 'POST',
        gzip: true,
        body: prepareData(this.tree, this.options),
      })

      return await res.json()
    } catch (er) {
      this.log.verbose('audit error', er)
      this.log.silly('audit error', String(er.body))
      this.error = er
      return null
    } finally {
      process.emit('timeEnd', 'auditReport:getReport')
    }
  }
}

const prepareData = (tree, opts) => {
  const { npmVersion: npm_version } = opts
  const node_version = process.version
  const { platform, arch } = process
  const { NODE_ENV: node_env } = process.env
  const data = tree.meta.commit()
  return JSON.stringify({
    ...data,
    requires: {
      ...(tree.package.devDependencies || {}),
      ...(tree.package.peerDependencies|| {}),
      ...(tree.package.optionalDependencies|| {}),
      ...(tree.package.dependencies|| {}),
    },
    node_version,
    npm_version,
    platform,
    arch,
    node_env,
  }, 0, 2)
}

module.exports = AuditReport
