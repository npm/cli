const { log } = require('proc-log')
const npmFetch = require('npm-registry-fetch')
const ciInfo = require('ci-info')
const fetch = require('make-fetch-happen')
const npa = require('npm-package-arg')
const libaccess = require('libnpmaccess')

/**
 * Caches the runtime state of the active OIDC token exchange
 * so it can be cleared on subsequent OIDC attempts in workflows
 * that run OIDC multiple times within one runtime execution,
 * preventing the previous exchange token from being reused.
 */
let activeExchangeRecord

const setOidcToken = ({ config, opts, authTokenKey, token }) => {
  activeExchangeRecord = {
    config,
    authTokenKey,
    token,
    previousCliToken: config.get(authTokenKey, 'cli'),
    opts,
    previousOptsToken: opts[authTokenKey],
  }
  opts[authTokenKey] = token
  config.set(authTokenKey, token, 'cli')
  log.notice('oidc', 'Successfully retrieved and set token')
}

const clearOidcToken = ({ config, opts }) => {
  if (!activeExchangeRecord) {
    return
  }

  const {
    config: previousConfig,
    authTokenKey,
    token,
    previousCliToken,
    opts: previousOpts,
    previousOptsToken,
  } = activeExchangeRecord
  if (previousConfig.get(authTokenKey, 'cli') === token) {
    if (previousCliToken === undefined) {
      previousConfig.delete(authTokenKey, 'cli')
    } else {
      previousConfig.set(authTokenKey, previousCliToken, 'cli')
    }
  }
  for (const requestOpts of new Set([previousOpts, opts])) {
    if (requestOpts[authTokenKey] === token) {
      const fallback = requestOpts === previousOpts ? previousOptsToken : config.get(authTokenKey)
      if (fallback === undefined) {
        delete requestOpts[authTokenKey]
      } else {
        requestOpts[authTokenKey] = fallback
      }
    }
  }
  activeExchangeRecord = undefined
  log.verbose('oidc', 'Cleared previous exchange token')
}

const getGitHubIdentityToken = async ({ registry, opts }) => {
  if (!(
    process.env.ACTIONS_ID_TOKEN_REQUEST_URL &&
    process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
  )) {
    return undefined
  }

  const audience = `npm:${new URL(registry).hostname}`
  const url = new URL(process.env.ACTIONS_ID_TOKEN_REQUEST_URL)
  url.searchParams.append('audience', audience)
  const startTime = Date.now()
  const response = await fetch(url.href, {
    retry: opts.retry,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}`,
    },
  })

  const elapsedTime = Date.now() - startTime

  log.http(
    'fetch',
    `GET ${url.href} ${response.status} ${elapsedTime}ms`
  )

  const json = await response.json()

  if (!response.ok) {
    log.verbose('oidc', 'Failed to fetch id_token from GitHub: received an invalid response')
    return undefined
  }

  if (!json.value) {
    log.verbose('oidc', 'Failed to fetch id_token from GitHub: missing value')
    return undefined
  }

  return json.value
}

const getOidcIdentityToken = async ({
  registry,
  opts,
  explicitIdToken,
}) => {
  if (!(
    /** @see https://github.com/watson/ci-info/blob/v4.2.0/vendors.json#L152 */
    ciInfo.GITHUB_ACTIONS ||
    /** @see https://github.com/watson/ci-info/blob/v4.2.0/vendors.json#L161C13-L161C22 */
    ciInfo.GITLAB ||
    /** @see https://github.com/watson/ci-info/blob/v4.2.0/vendors.json#L78 */
    ciInfo.CIRCLE
  )) {
    return undefined
  }

  /**
   * NPM_ID_TOKEN is the explicit OIDC path used by GitLab and CircleCI.
   * GitHub Actions discovers an identity token through its request environment.
   */
  let idToken = explicitIdToken

  if (explicitIdToken) {
    log.notice('oidc', 'Using NPM_ID_TOKEN for authentication')
  }

  if (!idToken && ciInfo.GITHUB_ACTIONS) {
    idToken = await getGitHubIdentityToken({ registry, opts })
  }

  if (!idToken) {
    return undefined
  }

  return idToken
}

const exchangeOidcToken = async ({
  packageName,
  registry,
  opts,
  idToken,
  failureLogLevel,
}) => {
  const parsedRegistry = new URL(registry)
  const regKey = `//${parsedRegistry.host}${parsedRegistry.pathname}`
  const authTokenKey = `${regKey}:_authToken`
  const escapedPackageName = npa(packageName).escapedName

  let response
  try {
    response = await npmFetch.json(new URL(`/-/npm/v1/oidc/token/exchange/package/${escapedPackageName}`, registry), {
      ...opts,
      [authTokenKey]: idToken,
      method: 'POST',
    })
  } catch (error) {
    const message = `Failed token exchange request with body message: ${error?.body?.message || 'Unknown error'}`
    log[failureLogLevel]('oidc', message)
    return undefined
  }

  if (!response?.token) {
    const message = 'Failed because token exchange was missing the token in the response body'
    log[failureLogLevel]('oidc', message)
    return undefined
  }

  return {
    authTokenKey,
    token: response.token,
  }
}

const autoConfigureProvenance = async ({ packageName, opts, config, idToken }) => {
  try {
    const isDefaultProvenance = config.isDefault('provenance')
    // Respect an explicitly configured provenance value.
    if (!isDefaultProvenance) {
      return undefined
    }
    // CircleCI does not support provenance yet.
    if (ciInfo.CIRCLE) {
      return undefined
    }
    // An explicitly provided provenance file takes precedence over auto-generated provenance.
    if (opts.provenanceFile) {
      return undefined
    }

    const [headerB64, payloadB64] = idToken.split('.')
    // Provenance visibility cannot be determined without a valid JWT header and payload.
    if (!headerB64 || !payloadB64) {
      return undefined
    }

    const payloadJson = Buffer.from(payloadB64, 'base64').toString('utf8')
    const payload = JSON.parse(payloadJson)
    const isPublicGitHubRepository =
      ciInfo.GITHUB_ACTIONS && payload.repository_visibility === 'public'
    // GitLab also requires SIGSTORE_ID_TOKEN to generate provenance.
    const isPublicGitLabRepository =
      ciInfo.GITLAB &&
      payload.project_visibility === 'public' &&
      Boolean(process.env.SIGSTORE_ID_TOKEN)
    const isPublicRepository = isPublicGitHubRepository || isPublicGitLabRepository
    // Automatic provenance is only supported for public repositories.
    if (!isPublicRepository) {
      return undefined
    }

    const visibility = await libaccess.getVisibility(packageName, opts)
    // Automatic provenance requires the package to be publicly visible.
    if (!visibility?.public) {
      return undefined
    }

    log.notice('oidc', 'Enabling provenance')
    opts.provenance = true
  } catch (error) {
    log.warn('oidc', `Failed to set provenance with message: ${error?.message || 'Unknown error'}`)
  }
}

/**
 * Handles OpenID Connect (OIDC) token retrieval and exchange for CI environments.
 *
 * This function is designed to work in Continuous Integration (CI) environments such as GitHub Actions, GitLab, and CircleCI.
 * It retrieves an OIDC token from the CI environment, exchanges it for an npm token, and sets the token in the provided configuration for authentication with the npm registry.
 *
 * This function is intended to never throw, as it mutates the state of the `opts` and `config` objects on success.
 * OIDC is always an optional feature, and the function should not throw if OIDC is not configured by the registry.
 * Before each attempt, it restores credentials replaced by the previous exchange so package-specific tokens are never used as fallback credentials.
 *
 * @see https://github.com/watson/ci-info for CI environment detection.
 * @see https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect for GitHub Actions OIDC.
 * @see https://circleci.com/docs/openid-connect-tokens/ for CircleCI OIDC.
 */
async function oidc ({
  // Selects the package-specific npm token exchange endpoint.
  packageName,
  // Determines the OIDC audience, exchange host, and registry-scoped auth key.
  registry,
  // Mutable request options for the current command, often called flatOptions.
  // The exchanged token is added here so subsequent registry requests use it immediately.
  opts,
  // npm's live configuration state. This is also updated so credential lookups see the token.
  config,
  // Publish and stage publish can infer provenance from trusted-publishing claims and package
  // visibility so users do not need to set --provenance. Other commands that use OIDC, such as
  // npm dist-tag, only need token exchange and must not enable unrelated publish provenance.
  enableProvenanceAutoConfiguration = false,
}) {
  const explicitIdToken = process.env.NPM_ID_TOKEN
  const failureLogLevel = explicitIdToken ? 'warn' : 'verbose'
  let idToken
  let exchange

  // OIDC state is undetermined unless NPM_ID_TOKEN is explicit; discovery failures stay verbose otherwise.
  try {
    clearOidcToken({ config, opts })

    idToken = await getOidcIdentityToken({
      registry,
      opts,
      explicitIdToken,
    })

    if (!idToken) {
      return undefined
    }

    exchange = await exchangeOidcToken({
      packageName,
      registry,
      opts,
      idToken,
      failureLogLevel,
    })

    if (!exchange) {
      return undefined
    }
  } catch (error) {
    log[failureLogLevel]('oidc', `Failure before successful token exchange: ${error?.message || 'Unknown error'}`)
    return undefined
  }

  // OIDC state is determined after a successful token exchange; subsequent failures must warn.
  try {
    /*
     * Publish and dist-tag pass opts to later registry requests, including
     * mutations wrapped by otplease. The non-persistable cli layer also makes
     * the token available to credential lookups without modifying disk config.
     */
    setOidcToken({
      config,
      opts,
      authTokenKey: exchange.authTokenKey,
      token: exchange.token,
    })

    if (!enableProvenanceAutoConfiguration) {
      return undefined
    }

    await autoConfigureProvenance({ packageName, opts, config, idToken })
  } catch (error) {
    log.warn('oidc', `Failure after successful token exchange: ${error?.message || 'Unknown error'}`)
  }
  return undefined
}

module.exports = {
  oidc,
}
