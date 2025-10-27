const { log, output } = require('proc-log')
const { listTokens, createToken, removeToken } = require('npm-profile')
const { otplease } = require('../utils/auth.js')
const BaseCommand = require('../base-cmd.js')

class Token extends BaseCommand {
  static description = 'Manage your authentication tokens'
  static name = 'token'
  static usage = [
    'list',
    'revoke <id|token>',
    'create --name=<name> --access=<read-only|read-write> [--expires=<YYYY-MM-DD>] [--packages=<pkg1,pkg2>] [--scopes=<scope1,scope2>] [--orgs=<org1,org2>] [--cidr=<ip-range>] [--bypass-2fa]',
  ]

  static params = [
    'name',
    'expires',
    'access',
    'packages',
    'scopes',
    'orgs',
    'cidr',
    'bypass-2fa',
    'registry',
    'otp',
    'read-only',
  ]

  static async completion (opts) {
    const argv = opts.conf.argv.remain
    const subcommands = ['list', 'revoke', 'create']
    if (argv.length === 2) {
      return subcommands
    }

    if (subcommands.includes(argv[2])) {
      return []
    }

    throw new Error(argv[2] + ' not recognized')
  }

  async exec (args) {
    if (args.length === 0) {
      return this.list()
    }
    switch (args[0]) {
      case 'list':
      case 'ls':
        return this.list()
      case 'rm':
      case 'delete':
      case 'revoke':
      case 'remove':
        return this.rm(args.slice(1))
      case 'create':
        return this.create(args.slice(1))
      default:
        throw this.usageError(`${args[0]} is not a recognized subcommand.`)
    }
  }

  async list () {
    const json = this.npm.config.get('json')
    const parseable = this.npm.config.get('parseable')
    log.info('token', 'getting list')
    const tokens = await listTokens(this.npm.flatOptions)
    if (json) {
      output.buffer(tokens)
      return
    }
    if (parseable) {
      output.standard(['key', 'token', 'created', 'readonly', 'CIDR whitelist'].join('\t'))
      tokens.forEach(token => {
        // Handle both classic tokens (readonly) and GATs (access)
        const isReadonly = token.readonly || token.access === 'read-only'
        output.standard(
          [
            token.key,
            token.token,
            token.created,
            isReadonly ? 'true' : 'false',
            token.cidr_whitelist ? token.cidr_whitelist.join(',') : '',
          ].join('\t')
        )
      })
      return
    }
    this.generateTokenIds(tokens, 6)
    const chalk = this.npm.chalk
    for (const token of tokens) {
      // Handle both classic tokens (readonly) and GATs (access)
      const isReadonly = token.readonly || token.access === 'read-only'
      const level = isReadonly ? 'Read only token' : 'Publish token'
      const created = String(token.created).slice(0, 10)
      output.standard(`${chalk.blue(level)} ${token.token}… with id ${chalk.cyan(token.id)} created ${created}`)
      if (token.cidr_whitelist) {
        output.standard(`with IP whitelist: ${chalk.green(token.cidr_whitelist.join(','))}`)
      }
      output.standard()
    }
  }

  async rm (args) {
    if (args.length === 0) {
      throw this.usageError('`<tokenKey>` argument is required.')
    }

    const json = this.npm.config.get('json')
    const parseable = this.npm.config.get('parseable')
    const toRemove = []
    const opts = { ...this.npm.flatOptions }
    log.info('token', `removing ${toRemove.length} tokens`)
    const tokens = await listTokens(opts)
    args.forEach(id => {
      const matches = tokens.filter(token => token.key.indexOf(id) === 0)
      if (matches.length === 1) {
        toRemove.push(matches[0].key)
      } else if (matches.length > 1) {
        throw new Error(
          `Token ID "${id}" was ambiguous, a new token may have been created since you last ran \`npm token list\`.`
        )
      } else {
        const tokenMatches = tokens.some(t => id.indexOf(t.token) === 0)
        if (!tokenMatches) {
          throw new Error(`Unknown token id or value "${id}".`)
        }

        toRemove.push(id)
      }
    })
    await Promise.all(
      toRemove.map(key => {
        return otplease(this.npm, opts, c => removeToken(key, c))
      })
    )
    if (json) {
      output.buffer(toRemove)
    } else if (parseable) {
      output.standard(toRemove.join('\t'))
    } else {
      output.standard('Removed ' + toRemove.length + ' token' + (toRemove.length !== 1 ? 's' : ''))
    }
  }

  async create () {
    const json = this.npm.config.get('json')
    const parseable = this.npm.config.get('parseable')
    const cidr = this.npm.config.get('cidr')
    const name = this.npm.config.get('name')
    const expires = this.npm.config.get('expires')
    const access = this.npm.config.get('access')
    const packages = this.npm.config.get('packages')
    const scopes = this.npm.config.get('scopes')
    const orgs = this.npm.config.get('orgs')
    const bypassTwoFactor = this.npm.config.get('bypass-2fa')

    // Validate required parameters
    if (!name) {
      throw this.usageError('--name is required for token creation')
    }
    if (!access) {
      throw this.usageError('--access is required (use "read-only" or "read-write")')
    }
    if (!['read-only', 'read-write'].includes(access)) {
      throw this.usageError('--access must be either "read-only" or "read-write"')
    }

    const validCIDR = await this.validateCIDRList(cidr)

    // Build GAT token data structure
    const tokenData = {
      type: 'granular',
      name,
      access,
    }

    // Add expiry (default to 7 days from now if not provided)
    if (expires) {
      tokenData.expires = new Date(expires).toISOString()
    } else {
      const defaultExpiry = new Date()
      defaultExpiry.setDate(defaultExpiry.getDate() + 7)
      tokenData.expires = defaultExpiry.toISOString()
    }

    // Add optional fields
    if (packages?.length > 0) {
      tokenData.packages = packages
    }
    if (scopes?.length > 0) {
      tokenData.scopes = scopes
    }
    if (orgs?.length > 0) {
      tokenData.orgs = orgs
    }
    if (validCIDR?.length > 0) {
      tokenData.cidr_whitelist = validCIDR
    }
    if (bypassTwoFactor) {
      tokenData.bypass_2fa = true
    }

    log.info('token', 'creating')
    const result = await otplease(
      this.npm,
      { ...this.npm.flatOptions },
      c => createToken(tokenData, c)
    )
    delete result.key
    delete result.updated
    if (json) {
      output.buffer(result)
    } else if (parseable) {
      Object.keys(result).forEach(k => output.standard(k + '\t' + result[k]))
    } else {
      const chalk = this.npm.chalk
      // Display based on access level
      const level = result.access === 'read-only' || result.readonly ? 'read only' : 'publish'
      output.standard(`Created ${chalk.blue(level)} token ${result.token}`)
      if (result.cidr_whitelist?.length) {
        output.standard(`with IP whitelist: ${chalk.green(result.cidr_whitelist.join(','))}`)
      }
      if (result.expires) {
        output.standard(`expires: ${result.expires}`)
      }
    }
  }

  invalidCIDRError (msg) {
    return Object.assign(new Error(msg), { code: 'EINVALIDCIDR' })
  }

  generateTokenIds (tokens, minLength) {
    for (const token of tokens) {
      token.id = token.key
      for (let ii = minLength; ii < token.key.length; ++ii) {
        const match = tokens.some(
          ot => ot !== token && ot.key.slice(0, ii) === token.key.slice(0, ii)
        )
        if (!match) {
          token.id = token.key.slice(0, ii)
          break
        }
      }
    }
  }

  async validateCIDRList (cidrs) {
    const { v4: isCidrV4, v6: isCidrV6 } = await import('is-cidr')
    const maybeList = [].concat(cidrs).filter(Boolean)
    const list = maybeList.length === 1 ? maybeList[0].split(/,\s*/) : maybeList
    for (const cidr of list) {
      if (isCidrV6(cidr)) {
        throw this.invalidCIDRError(
          `CIDR whitelist can only contain IPv4 addresses, ${cidr} is IPv6`
        )
      }

      if (!isCidrV4(cidr)) {
        throw this.invalidCIDRError(`CIDR whitelist contains invalid CIDR entry: ${cidr}`)
      }
    }
    return list
  }
}

module.exports = Token
