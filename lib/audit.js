const Arborist = require('@npmcli/arborist')
const auditReport = require('npm-audit-report')
const rpj = require('read-package-json-fast')
const licensee = require('licensee')
const reifyFinish = require('./utils/reify-finish.js')
const auditError = require('./utils/audit-error.js')
const ArboristWorkspaceCmd = require('./workspaces/arborist-cmd.js')

class Audit extends ArboristWorkspaceCmd {
  /* istanbul ignore next - see test/lib/load-all-commands.js */
  static get description () {
    return 'Run a security audit'
  }

  /* istanbul ignore next - see test/lib/load-all-commands.js */
  static get name () {
    return 'audit'
  }

  /* istanbul ignore next - see test/lib/load-all-commands.js */
  static get params () {
    return [
      'audit-level',
      'dry-run',
      'force',
      'json',
      'package-lock-only',
      'omit',
      ...super.params,
    ]
  }

  /* istanbul ignore next - see test/lib/load-all-commands.js */
  static get usage () {
    return ['[fix]']
  }

  async completion (opts) {
    const argv = opts.conf.argv.remain

    if (argv.length === 2)
      return ['fix']

    switch (argv[2]) {
      case 'fix':
        return []
      default:
        throw new Error(argv[2] + ' not recognized')
    }
  }

  exec (args, cb) {
    const auditType = this.npm.config.get('audit-type')
    if (auditType === 'license') {
      this.auditLicenses(args).then(() => cb()).catch(cb)
    } if (auditType === 'advisories') {
      this.auditAdvisories(args).then(() => cb()).catch(cb)
    } else {
      // we should probably collect the JSON from auditAdvisories and auditLicenses and merge them into a single object/output?
      this.auditAdvisories(args).then(() => cb()).catch(cb)
    }
  }

  async auditAdvisories (args) {
    const reporter = this.npm.config.get('json') ? 'json' : 'detail'
    const opts = {
      ...this.npm.flatOptions,
      audit: true,
      path: this.npm.prefix,
      reporter,
      workspaces: this.workspaceNames,
    }

    const arb = new Arborist(opts)
    const fix = args[0] === 'fix'
    await arb.audit({ fix })
    if (fix)
      await reifyFinish(this.npm, arb)
    else {
      // will throw if there's an error, because this is an audit command
      auditError(this.npm, arb.auditReport)
      const result = auditReport(arb.auditReport, opts)
      process.exitCode = process.exitCode || result.exitCode
      this.npm.output(result.report)
    }
  }

  async auditLicenses (args) {
    const reporter = this.npm.config.get('json') ? 'json' : 'detail'
    const packagejson = await rpj(`${this.npm.prefix}/package.json`)

    if (!packagejson.audit) throw new Error("No audit property specified in package.json")
    if (!packagejson.audit.licenses) throw new Error("No license specified in the audit property in package.json")
    if (Object.keys(packagejson.audit.licenses).length === 0) throw new Error("license property in package.json cannot be empty.")

    const config = await buildLicenseConfig(packagejson)

    await new Promise((resolve, reject) => {
      const licensesPath = this.npm.prefix
      licensee(config, licensesPath, (error, dependencies) => {
        if (error) reject(error)
        if (reporter === "detail") {
          // figure out pretty printing of license data
        }
        if (reporter === "json") {
          this.jsonStringifyOutput(dependencies)
        }
        resolve()
      })
    })
  }

  jsonStringifyOutput (dependencies) {
    const loggableProperties = [
      'name',
      'version',
      'approved',
      'license',
      'corrected',
      'repository',
      'homepage',
      'author',
      'contributors'
    ]

    const out = {}
    for (const dep of dependencies) {
      out[dep.name] = {}
      for (const prop of loggableProperties) {
        out[dep.name][prop] = dep[prop]
      }
    }
    this.npm.output(JSON.stringify(out, null, 2))
  }
}

async function buildLicenseConfig (packagejson) {
  const licenses = packagejson.audit.licenses
  const licenseConfig = {}

  if (licenses.identifiers) {
    licenseConfig.licenses = {}
    licenseConfig.licenses.spdx = licenses.identifiers
  }

  if (licenses.packages) {
    licenseConfig.packages = licenses.packages
  }

  if (licenses.corrections === "false") { // prioritize users choice
    licenseConfig.corrections = "false"
  } else { // default to true for DX
    licenseConfig.corrections = "true"
  }

  if (licenses.ignore) {
    licenseConfig.ignore = licenses.ignore
  }

  return licenseConfig
}

module.exports = Audit
