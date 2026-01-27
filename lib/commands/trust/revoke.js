const globalDefinitions = require('@npmcli/config/lib/definitions/definitions.js')
const Definition = require('@npmcli/config/lib/definitions/definition.js')
const pkgJson = require('@npmcli/package-json')
const { otplease } = require('../../utils/auth.js')
const npmFetch = require('npm-registry-fetch')
const npa = require('npm-package-arg')
const TrustCommand = require('../../trust-cmd.js')

class TrustRevoke extends TrustCommand {
  static description = 'Revoke a trusted relationship for a package'
  static name = 'revoke'
  static positionals = 1 // expects at most 1 positional (package name)

  static usage = [
    '[package] --id=<trust-id>',
  ]

  static definitions = {
    'dry-run': globalDefinitions['dry-run'],
    registry: globalDefinitions.registry,
    id: new Definition('id', {
      default: null,
      type: String,
      description: 'ID of the trusted relationship to revoke',
    }),
  }

  async exec (positionalArgs, flags) {
    const dryRun = this.config.get('dry-run')
    const { content } = await pkgJson.normalize(this.npm.prefix)
    const pkgName = positionalArgs[0] || content.name
    if (!pkgName) {
      throw new Error('Package name must be specified either as an argument or in the package.json file')
    }
    const { id } = flags
    if (!id) {
      throw new Error('ID of the trusted relationship to revoke must be specified with the --id option')
    }
    this.dialogue`Attempting to revoke trusted configuration for package ${pkgName} with id ${id}`
    if (dryRun) {
      return
    }
    const spec = npa(pkgName)
    const uri = `/-/package/${spec.escapedName}/trust/${encodeURIComponent(id)}`
    await otplease(this.npm, this.npm.flatOptions, opts => npmFetch(uri, {
      ...opts,
      method: 'DELETE',
    }))
    this.dialogue`Revoked trusted configuration for package ${pkgName} with id ${id}`
  }
}

module.exports = TrustRevoke
