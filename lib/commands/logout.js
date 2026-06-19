const npmFetch = require('npm-registry-fetch')
const { getAuth } = npmFetch
const { log } = require('proc-log')
const BaseCommand = require('../base-cmd.js')

// Ensure the registry URL ends with / so it nerfs to the same key config writes
// credentials under. npm-registry-fetch's getAuth backtracks up the nerf dart
// path but does not itself normalize trailing slashes, so a registry configured
// as https://host/npm would otherwise resolve to //host/npm and never reach the
// //host/npm/ key where the token lives — leaving logout unable to find auth
// (ENEEDAUTH) and the token stranded in .npmrc.
const withTrailingSlash = (uri) => {
  try {
    const parsed = new URL(uri)
    if (!parsed.pathname.endsWith('/')) {
      parsed.pathname += '/'
    }
    return parsed.href
  } catch {
    return uri
  }
}

class Logout extends BaseCommand {
  static description = 'Log out of the registry'
  static name = 'logout'
  static params = [
    'registry',
    'scope',
  ]

  async exec () {
    const registry = this.npm.config.get('registry')
    const scope = this.npm.config.get('scope')
    const regRef = scope ? `${scope}:registry` : 'registry'
    const reg = withTrailingSlash(this.npm.config.get(regRef) || registry)

    const auth = getAuth(reg, this.npm.flatOptions)

    const level = this.npm.config.find(`${auth.regKey}:${auth.authKey}`)

    // find the config level and only delete from there
    if (auth.token) {
      log.verbose('logout', `clearing token for ${reg}`)
      await npmFetch(`/-/user/token/${encodeURIComponent(auth.token)}`, {
        ...this.npm.flatOptions,
        registry: reg,
        method: 'DELETE',
        ignoreBody: true,
      })
    } else if (auth.isBasicAuth) {
      log.verbose('logout', `clearing user credentials for ${reg}`)
    } else {
      const msg = `not logged in to ${reg}, so can't log out!`
      throw Object.assign(new Error(msg), { code: 'ENEEDAUTH' })
    }

    if (scope) {
      this.npm.config.delete(regRef, level)
    }

    this.npm.config.clearCredentialsByURI(reg, level)

    await this.npm.config.save(level)
  }
}

module.exports = Logout
