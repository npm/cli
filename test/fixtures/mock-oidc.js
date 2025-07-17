const nock = require('nock')
const ciInfo = require('ci-info')

// this is an effort to not add a dependency to the cli just for testing
function makeJwt (payload) {
  const header = { alg: 'none', typ: 'JWT' }
  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64')
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64')
  // empty signature section
  return `${headerB64}.${payloadB64}.`
}

function gitlabIdToken ({ visibility = 'public' } = { visibility: 'public' }) {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    project_visibility: visibility,
    iat: now,
    exp: now + 3600, // 1 hour expiration
  }
  return makeJwt(payload)
}

function githubIdToken ({ visibility = 'public' } = { visibility: 'public' }) {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    repository_visibility: visibility,
    iat: now,
    exp: now + 3600, // 1 hour expiration
  }
  return makeJwt(payload)
}

class MockOidc {
  constructor (opts) {
    const defaultOpts = {
      github: false,
      gitlab: false,
      ACTIONS_ID_TOKEN_REQUEST_URL: 'https://github.com/actions/id-token',
      ACTIONS_ID_TOKEN_REQUEST_TOKEN: 'ACTIONS_ID_TOKEN_REQUEST_TOKEN',
      NPM_ID_TOKEN: 'NPM_ID_TOKEN',
      GITHUB_ID_TOKEN: 'mock-github-id-token',
      SIGSTORE_ID_TOKEN: undefined,
    }
    const options = { ...defaultOpts, ...opts }

    this.github = options.github
    this.gitlab = options.gitlab
    this.ACTIONS_ID_TOKEN_REQUEST_URL = options.ACTIONS_ID_TOKEN_REQUEST_URL
    this.ACTIONS_ID_TOKEN_REQUEST_TOKEN = options.ACTIONS_ID_TOKEN_REQUEST_TOKEN
    this.SIGSTORE_ID_TOKEN = options.SIGSTORE_ID_TOKEN

    this.NPM_ID_TOKEN = options.NPM_ID_TOKEN
    this.GITHUB_ID_TOKEN = options.GITHUB_ID_TOKEN

    // Backup only the relevant environment variables and ciInfo values
    this.originalEnv = {
      CI: process.env.CI,
      GITHUB_ACTIONS: process.env.GITHUB_ACTIONS,
      ACTIONS_ID_TOKEN_REQUEST_URL: process.env.ACTIONS_ID_TOKEN_REQUEST_URL,
      ACTIONS_ID_TOKEN_REQUEST_TOKEN: process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN,
      GITLAB_CI: process.env.GITLAB_CI,
      NPM_ID_TOKEN: process.env.NPM_ID_TOKEN,
      SIGSTORE_ID_TOKEN: process.env.SIGSTORE_ID_TOKEN,
    }

    this.originalCiInfo = {
      GITLAB: ciInfo.GITLAB,
      GITHUB_ACTIONS: ciInfo.GITHUB_ACTIONS,
    }
    this.setupEnvironment()
  }

  get idToken () {
    if (this.github) {
      return this.GITHUB_ID_TOKEN
    }
    if (this.gitlab) {
      return this.NPM_ID_TOKEN
    }
    return undefined
  }

  setupEnvironment () {
    delete process.env.CI
    delete process.env.GITHUB_ACTIONS
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_URL
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
    delete process.env.GITLAB_CI
    delete process.env.NPM_ID_TOKEN
    delete process.env.SIGSTORE_ID_TOKEN

    ciInfo.GITHUB_ACTIONS = false
    ciInfo.GITLAB = false

    if (this.github) {
      if (typeof this.ACTIONS_ID_TOKEN_REQUEST_URL === 'string') {
        process.env.ACTIONS_ID_TOKEN_REQUEST_URL = this.ACTIONS_ID_TOKEN_REQUEST_URL
      }
      if (typeof this.ACTIONS_ID_TOKEN_REQUEST_TOKEN === 'string') {
        process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = this.ACTIONS_ID_TOKEN_REQUEST_TOKEN
      }
      ciInfo.GITHUB_ACTIONS = true
    }

    if (this.gitlab) {
      if (typeof this.NPM_ID_TOKEN === 'string') {
        process.env.NPM_ID_TOKEN = this.NPM_ID_TOKEN
      }
      if (typeof this.SIGSTORE_ID_TOKEN === 'string') {
        process.env.SIGSTORE_ID_TOKEN = this.SIGSTORE_ID_TOKEN
      }
      ciInfo.GITLAB = true
    }
  }

  mockGithubOidc ({ idToken = this.GITHUB_ID_TOKEN, audience, statusCode = 200 } = {}) {
    const url = new URL(this.ACTIONS_ID_TOKEN_REQUEST_URL)
    return nock(url.origin)
      .get(url.pathname)
      .query({ audience })
      .matchHeader('authorization', `Bearer ${this.ACTIONS_ID_TOKEN_REQUEST_TOKEN}`)
      .matchHeader('accept', 'application/json')
      .reply(statusCode, statusCode !== 500 ? { value: idToken } : { message: 'Internal Server Error' })
  }

  reset () {
    // Restore only the backed-up environment variables

    for (const key in this.originalEnv) {
      if (typeof this.originalEnv[key] === 'string') {
        process.env[key] = this.originalEnv[key]
      } else {
        delete process.env[key]
      }
    }

    // Restore the original ciInfo values
    ciInfo.GITLAB = this.originalCiInfo.GITLAB
    ciInfo.GITHUB_ACTIONS = this.originalCiInfo.GITHUB_ACTIONS

    nock.cleanAll()
  }

  static tnock (t, opts = {}, { debug = false, strict = false } = {}) {
    const instance = new MockOidc(opts)

    const noMatch = (req) => {
      if (debug) {
        /* eslint-disable-next-line no-console */
        console.error('NO MATCH', t.name, req.options ? req.options : req.path)
      }
      if (strict) {
        t.comment(`Unmatched request: ${req.method} ${req.path}`)
        t.fail(`Unmatched request: ${req.method} ${req.path}`)
      }
    }

    nock.emitter.on('no match', noMatch)
    nock.disableNetConnect()

    if (strict) {
      t.afterEach(() => {
        t.strictSame(nock.pendingMocks(), [], 'no pending mocks after each')
      })
    }

    t.teardown(() => {
      nock.enableNetConnect()
      nock.emitter.off('no match', noMatch)
      nock.cleanAll()
      instance.reset()
    })

    return instance
  }
}

module.exports = {
  MockOidc,
  gitlabIdToken,
  githubIdToken,
}
