const Definition = require('@npmcli/config/lib/definitions/definition.js')
const globalDefinitions = require('@npmcli/config/lib/definitions/definitions.js')
const TrustCommand = require('../../trust-cmd.js')
const { trustDefinitions } = require('../../trust-cmd.js')

class TrustBuildkite extends TrustCommand {
  static description = 'Create a trusted relationship between a package and Buildkite'
  static name = 'buildkite'
  static positionals = 1
  static providerName = 'Buildkite'
  static providerEntity = 'Buildkite pipeline'

  static usage = [
    '[package] --organization <slug> --pipeline <slug> [--allow-publish] [--allow-stage-publish] [-y|--yes]',
  ]

  static definitions = [
    new Definition('organization', {
      default: null,
      type: String,
      required: true,
      description: 'Buildkite organization slug',
      alias: ['org'],
    }),
    new Definition('pipeline', {
      default: null,
      type: String,
      required: true,
      description: 'Buildkite pipeline slug',
    }),
    trustDefinitions['allow-publish'],
    trustDefinitions['allow-stage-publish'],
    // globals are alphabetical
    globalDefinitions['dry-run'],
    globalDefinitions.json,
    globalDefinitions.registry,
    globalDefinitions.yes,
  ]

  static optionsToBody ({ organization, pipeline }) {
    return {
      type: 'buildkite',
      claims: {
        organization_slug: organization,
        pipeline_slug: pipeline,
      },
    }
  }

  static bodyToOptions (body) {
    return {
      ...(body.id) && { id: body.id },
      ...(body.type) && { type: body.type },
      ...(body.claims?.organization_slug) && {
        organization: body.claims.organization_slug,
      },
      ...(body.claims?.pipeline_slug) && { pipeline: body.claims.pipeline_slug },
    }
  }

  async flagsToOptions ({ positionalArgs, flags }) {
    const content = await this.optionalPkgJson()
    const pkgName = positionalArgs[0] || content.name
    const { organization, pipeline } = flags

    if (!pkgName) {
      throw new Error('Package name must be specified either as an argument or in package.json file')
    }
    if (!organization) {
      throw new Error('organization is required')
    }
    if (!pipeline) {
      throw new Error('pipeline is required')
    }

    return {
      values: {
        package: pkgName,
        organization,
        pipeline,
      },
      fromPackageJson: {
        package: !positionalArgs[0] && Boolean(content.name),
      },
      warnings: [],
      urls: {
        package: this.getFrontendUrl({ pkgName }),
        pipeline: new URL(`${organization}/${pipeline}`, 'https://buildkite.com').toString(),
      },
    }
  }

  async exec (positionalArgs, flags) {
    await this.createConfigCommand({ positionalArgs, flags })
  }
}

module.exports = TrustBuildkite
