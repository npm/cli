// An object representing a vulnerability either as the result of an
// advisory or due to the package in question depending exclusively on
// vulnerable versions of a dep.
//
// - name: package name
// - range: Set of vulnerable versions
// - nodes: Set of nodes affected
// - effects: Set of vulns triggered by this one
// - via: Set of advisories or vulnerabilities causing this vuln
//
// These objects are filled in by the operations in the AuditReport
// class, which sets the the packument and calls addRange() with
// the vulnerable range.

const {satisfies, simplifyRange} = require('semver')
const semverOpt = { loose: true, includePrerelease: true }

const _range = Symbol('_range')
const _ranges = Symbol('_ranges')
const _simpleRange = Symbol('_simpleRange')
const _fixAvailable = Symbol('_fixAvailable')

const severities = new Map([
  ['info', 0],
  ['low', 1],
  ['moderate', 2],
  ['high', 3],
  ['critical', 4],
  [null, -1],
])

for (const [name, val] of severities.entries()) {
  severities.set(val, name)
}

class Vuln {
  constructor ({ name, via }) {
    this.name = name
    this.via = new Set()
    this.severity = null
    this.addVia(via)
    this.effects = new Set()
    this.topNodes = new Set()
    this[_ranges] = new Set()
    this[_range] = null
    this[_simpleRange] = null
    this.nodes = new Set()
    this.packument = null
    // assume a fix is available unless it hits a top node
    // that locks it in place, setting this to false or {isSemVerMajor, version}.
    this[_fixAvailable] = true
  }

  get fixAvailable () {
    return this[_fixAvailable]
  }
  set fixAvailable (f) {
    this[_fixAvailable] = f
    // if there's a fix available for this at the top level, it means that
    // it will also fix the vulns that led to it being there.
    for (const v of this.via) {
      if (v.fixAvailable === true)
        v.fixAvailable = f
    }
  }

  toJSON () {
    return {
      name: this.name,
      severity: this.severity,
      via: [...this.via].map(v => v instanceof Vuln ? v.name : v),
      effects: [...this.effects].map(v => v.name),
      range: this.simpleRange,
      nodes: [...this.nodes].map(n => n.location),
      fixAvailable: this[_fixAvailable],
    }
  }

  deleteVia (via) {
    this.via.delete(via)
    // make sure we have the max severity of all the vulns causing this one
    this.severity = null
    for (const via of this.via) {
      this.addVia(via)
    }
  }

  addVia (via) {
    this.via.add(via)
    const sev = severities.get(via.severity)
    if (sev > severities.get(this.severity))
      this.severity = via.severity

    if (via instanceof Vuln)
      via.effects.add(this)
  }

  hasRange (range) {
    return this[_ranges].has(range)
  }

  addRange (range) {
    this[_ranges].add(range)
    this[_range] = [...this[_ranges]].join(' || ')
    this[_simpleRange] = null
  }

  get range () {
    return this[_range] || (this[_range] = [...this[_ranges]].join(' || '))
  }

  get simpleRange () {
    if (this[_simpleRange] && this[_simpleRange] === this[_range])
      return this[_simpleRange]
    const range = this.range
    if (!this.packument)
      return range
    const versions = Object.keys(this.packument.versions)
    const simple = simplifyRange(versions, range, semverOpt)
    return this[_simpleRange] = this[_range] = simple
  }

  isVulnerable (node) {
    if (this.nodes.has(node))
      return true

    const { version } = node.package
    if (version && satisfies(version, this.range, semverOpt)) {
      this.nodes.add(node)
      return true
    }

    return false
  }
}

module.exports = Vuln
