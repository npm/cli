const pkgJson = require('@npmcli/package-json')
const { otplease } = require('../../utils/auth.js')
const npmFetch = require('npm-registry-fetch')
const npa = require('npm-package-arg')
const TrustGithub = require('./github.js')
const TrustGitlab = require('./gitlab.js')
const TrustCommand = require('../../trust-cmd.js')
const globalDefinitions = require('@npmcli/config/lib/definitions/definitions.js')

class TrustList extends TrustCommand {
  static description = 'List trusted relationships for a package'
  static name = 'list'
  static positionals = 1 // expects at most 1 positional (package name)

  static usage = [
    '[package]',
  ]

  static definitions = {
    json: globalDefinitions.json,
    registry: globalDefinitions.registry,
  }

  static bodyToOptions (body) {
    if (body.type === 'github') {
      return TrustGithub.bodyToOptions(body)
    } else if (body.type === 'gitlab') {
      return TrustGitlab.bodyToOptions(body)
    }
    return TrustCommand.bodyToOptions(body)
  }

  async exec (args) {
    const { content } = await pkgJson.normalize(this.npm.prefix)
    const packageName = args[0] || content.name
    if (!packageName) {
      throw new Error('Package name must be specified either as an argument or in the package.json file')
    }
    const spec = npa(packageName)
    const uri = `/-/package/${spec.escapedName}/trust`
    const body = await otplease(this.npm, this.npm.flatOptions, opts => npmFetch.json(uri, {
      ...opts,
      method: 'GET',
    }))
    this.displayResponseBody({ body, packageName })
  }
}

module.exports = TrustList
