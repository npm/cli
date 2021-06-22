const Arborist = require('@npmcli/arborist')
const auditReport = require('npm-audit-report')
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
    } else { 
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
    const config = { // this is extremely limited and should consume user input rather than our own config
      "licenses": {
        "spdx": [
          "MIT" 
        ]    
      }
    }
    await new Promise((res, rej) => {
      const licensesPath = this.npm.prefix
      licensee(config, licensesPath, (error, dependencies) => {
        if (error) rej(error)
        if (reporter === "json") {
          this.jsonStringifyOutput(dependencies)
        }
        res()
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
    for(const dep of dependencies) {
      out[dep.name] = {}
      for (const prop of loggableProperties) {
        out[dep.name][prop] = dep[prop]
      }
    }
    this.npm.output(JSON.stringify(out, null, 2))
  }
}

module.exports = Audit
