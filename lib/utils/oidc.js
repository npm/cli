const { log } = require('proc-log')
const npmFetch = require('npm-registry-fetch')
const ciInfo = require('ci-info')
const fetch = require('make-fetch-happen')
const npa = require('npm-package-arg')

/**
 * Handles OpenID Connect (OIDC) token retrieval and exchange for CI environments.
 *
 * This function is designed to work in Continuous Integration (CI) environments such as GitHub Actions
 * and GitLab. It retrieves an OIDC token from the CI environment, exchanges it for an npm token, and
 * sets the token in the provided configuration for authentication with the npm registry.
 *
 * This function is intended to never throw, as it mutates the state of the `opts` and `config` objects on success.
 * OIDC is always an optional feature, and the function should not throw if OIDC is not configured by the registry.
 *
 * @see https://github.com/watson/ci-info for CI environment detection.
 * @see https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect for GitHub Actions OIDC.
 */
async function oidc ({ packageName, registry, opts, config }) {
  /*
   * This code should never run when people try to publish locally on their machines.
   * It is designed to execute only in Continuous Integration (CI) environments.
   */

  try {
    if (!(
      /** @see https://github.com/watson/ci-info/blob/v4.2.0/vendors.json#L152 */
      ciInfo.GITHUB_ACTIONS ||
      /** @see https://github.com/watson/ci-info/blob/v4.2.0/vendors.json#L161C13-L161C22 */
      ciInfo.GITLAB
    )) {
      log.silly('oidc', 'Not running OIDC, not in a supported CI environment')
      return undefined
    }

    log.silly('oidc', 'Determining if npm should use OIDC publishing')

    /**
     * Check if the environment variable `NPM_ID_TOKEN` is set.
     * In GitLab CI, the ID token is provided via an environment variable,
     * with `NPM_ID_TOKEN` serving as a predefined default. For consistency,
     * all supported CI environments are expected to support this variable.
     * In contrast, GitHub Actions uses a request-based approach to retrieve the ID token.
     * The presence of this token within GitHub Actions will override the request-based approach.
     * This variable follows the prefix/suffix convention from sigstore (e.g., `SIGSTORE_ID_TOKEN`).
     * @see https://docs.sigstore.dev/cosign/signing/overview/
     */
    let idToken = process.env.NPM_ID_TOKEN

    if (idToken) {
      log.silly('oidc', 'NPM_ID_TOKEN present')
    } else {
      log.silly('oidc', 'NPM_ID_TOKEN not present, checking for GITHUB_ACTIONS')
      if (ciInfo.GITHUB_ACTIONS) {
        /**
         * GitHub Actions provides these environment variables:
         * - `ACTIONS_ID_TOKEN_REQUEST_URL`: The URL to request the ID token.
         * - `ACTIONS_ID_TOKEN_REQUEST_TOKEN`: The token to authenticate the request.
         * Only when a workflow has the following permissions:
         * ```
         * permissions:
         *    id-token: write
         * ```
         * @see https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-cloud-providers#adding-permissions-settings
         */
        if (
          process.env.ACTIONS_ID_TOKEN_REQUEST_URL &&
          process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
        ) {
          /**
           * The specification for an audience is `npm:registry.npmjs.org`,
           * where "registry.npmjs.org" can be any supported registry.
           */
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
            log.verbose('oidc', `Failed to fetch id_token from GitHub: received an invalid response`)
            return undefined
          }

          if (!json.value) {
            log.verbose('oidc', `Failed to fetch id_token from GitHub: missing value`)
            return undefined
          }

          idToken = json.value
        } else {
          log.silly('oidc', 'GITHUB_ACTIONS detected. If you intend to publish using OIDC, please set workflow permissions for `id-token: write`')
          return undefined
        }
      }
    }

    if (!idToken) {
      log.silly('oidc', 'Exiting OIDC, no id_token available')
      return undefined
    }

    log.silly('oidc', `id_token has a length of ${idToken.length} characters`)

    const parsedRegistry = new URL(registry)
    const regKey = `//${parsedRegistry.host}${parsedRegistry.pathname}`
    const authTokenKey = `${regKey}:_authToken`

    const exitingToken = config.get(authTokenKey)
    if (exitingToken) {
      log.silly('oidc', 'Existing token found')
    } else {
      log.silly('oidc', 'No existing token found')
    }

    const escapedPackageName = npa(packageName).escapedName
    let response
    try {
      response = await npmFetch.json(new URL(`/-/npm/v1/oidc/token/exchange/package/${escapedPackageName}`, registry), {
        ...{
          ...opts,
          [authTokenKey]: idToken, // Use the idToken as the auth token for the request
        },
        method: 'POST',
        headers: {
          ...opts.headers,
          'Content-Type': 'application/json',
          // this will not work because the existing auth token will replace it.
          // authorization: `Bearer ${idToken}`,
        },
      })
    } catch (error) {
      if (error?.body?.message) {
        log.verbose('oidc', `Registry body response error message "${error.body.message}"`)
      }
      return undefined
    }

    if (!response?.token) {
      log.verbose('oidc', 'OIDC token exchange failure: missing token in response body')
      return undefined
    }
    /*
     * The "opts" object is a clone of npm.flatOptions and is passed through the `publish` command,
     * eventually reaching `otplease`. To ensure the token is accessible during the publishing process,
     * it must be directly attached to the `opts` object.
     * Additionally, the token is required by the "live" configuration or getters within `config`.
     */
    opts[authTokenKey] = response.token
    config.set(authTokenKey, response.token, 'user')
    log.silly('oidc', `OIDC token successfully retrieved`)
  } catch (error) {
    /* istanbul ignore next */
    log.verbose('oidc', 'Failure checking OIDC config', error)
  }
  return undefined
}

module.exports = {
  oidc,
}
