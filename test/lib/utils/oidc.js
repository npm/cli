const t = require('tap')
const { readFile } = require('node:fs/promises')
const { join } = require('node:path')
const mockGlobals = require('@npmcli/mock-globals')
const mockNpm = require('../../fixtures/mock-npm')
const tmock = require('../../fixtures/tmock')
const nock = require('nock')
const fetch = require('make-fetch-happen')

const registry = 'https://registry.npmjs.org/'
const authTokenKey = '//registry.npmjs.org/:_authToken'
const fallbackToken = 'fallback-token'
const exchangeToken = 'exchange-token'

const setup = async (t, mocks = {}) => {
  const { npm } = await mockNpm(t, {
    config: ({ globalPrefix, home, prefix }) => ({
      globalconfig: join(globalPrefix, 'etc', 'npmrc'),
      prefix,
      userconfig: join(home, '.npmrc'),
    }),
    globals: ({ globalPrefix, home, prefix }) => ({
      'process.env.NPM_CONFIG_GLOBALCONFIG': join(globalPrefix, 'etc', 'npmrc'),
      'process.env.NPM_CONFIG_PREFIX': prefix,
      'process.env.NPM_CONFIG_USERCONFIG': join(home, '.npmrc'),
    }),
    npm: ({ other }) => ({
      npmRoot: join(other, 'node'),
    }),
    otherDirs: {
      node: { npmrc: '' },
    },
  })
  mockGlobals(t, {
    'process.env.NPM_ID_TOKEN': 'identity-token',
    'process.env.ACTIONS_ID_TOKEN_REQUEST_URL': 'https://github.com/actions/id-token',
    'process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN': 'request-token',
  })
  const ci = { GITLAB: true }
  const responses = [{ token: exchangeToken }]
  const { oidc } = tmock(t, '{LIB}/utils/oidc.js', {
    'ci-info': ci,
    'npm-registry-fetch': {
      json: async (_url, opts) => {
        const response = responses.shift()
        if (response instanceof Error) {
          throw response
        }
        if (typeof response === 'function') {
          return response(opts)
        }
        return response
      },
    },
    'make-fetch-happen': async () => ({
      ok: false,
      status: 500,
      json: async () => ({}),
    }),
    ...mocks,
  })
  const run = async (opts = { ...npm.flatOptions }, registryUrl = registry) => {
    await oidc({ packageName: 'test-package', registry: registryUrl, opts, config: npm.config })
    return opts
  }
  return { npm, ci, responses, run, oidc }
}

const setupAzure = async (t, mocks = {}, clientId) => {
  mockGlobals(t, { 'process.env.FPA_CLIENT_ID': clientId })
  const result = await setup(t, { 'make-fetch-happen': fetch, ...mocks })
  result.ci.GITLAB = false
  result.ci.AZURE_PIPELINES = true
  mockGlobals(t, {
    'process.env.NPM_ID_TOKEN': undefined,
    'process.env.SYSTEM_ACCESSTOKEN': 'system-token',
    'process.env.SYSTEM_COLLECTIONURI': 'https://dev.azure.com/test-org/',
    'process.env.SYSTEM_TEAMPROJECTID': 'project-id',
    'process.env.SYSTEM_HOSTTYPE': 'build',
    'process.env.SYSTEM_PLANID': 'plan-id',
    'process.env.SYSTEM_JOBID': 'job-id',
  })
  const request = (requestClientId = '') => {
    const scope = nock('https://dev.azure.com', {
      reqheaders: {
        authorization: 'Bearer system-token',
        'content-type': 'application/json',
      },
    })
      .post(`/test-org/project-id/_apis/distributedtask/hubs/build/plans/plan-id/jobs/job-id/app/${requestClientId}/accesstoken`, {})
      .query({ 'api-version': '7.2-preview.1' })
    return scope
  }
  t.teardown(() => nock.cleanAll())
  return { ...result, request }
}

t.test('Azure Pipelines retrieves and exchanges an attributed token', async t => {
  const { npm, responses, oidc, request } = await setupAzure(t)
  const scope = request().reply(200, { accessToken: 'azure-token' })
  responses[0] = opts => {
    t.equal(opts[authTokenKey], 'azure-token', 'exchanges the Azure token')
    return { token: exchangeToken }
  }
  const opts = { ...npm.flatOptions }
  await oidc({
    packageName: 'test-package',
    registry,
    opts,
    config: npm.config,
    enableProvenanceAutoConfiguration: true,
  })
  t.ok(scope.isDone(), 'requests the attributed token')
  t.equal(opts[authTokenKey], exchangeToken)
  t.equal(npm.config.get(authTokenKey, 'cli'), exchangeToken)
  t.notOk(opts.provenance, 'does not automatically enable unsupported provenance')
})

t.test('Azure Pipelines supports a collection URI without a trailing slash', async t => {
  const { run, request } = await setupAzure(t)
  process.env.SYSTEM_COLLECTIONURI = 'https://dev.azure.com/test-org'
  const scope = request().reply(200, { accessToken: 'azure-token' })
  const opts = await run()
  t.ok(scope.isDone())
  t.equal(opts[authTokenKey], exchangeToken)
})

t.test('Azure Pipelines supports a temporary FPA_CLIENT_ID override for the official registry', async t => {
  const { run, request } = await setupAzure(t, {}, 'test-client-id')
  const scope = request('test-client-id').reply(200, { accessToken: 'azure-token' })
  const opts = await run()
  t.ok(scope.isDone(), 'requests the token for the supplied application client ID')
  t.equal(opts[authTokenKey], exchangeToken)
})

t.test('Azure Pipelines prefers NPM_ID_TOKEN without requesting an attributed token', async t => {
  const { responses, run } = await setupAzure(t, {
    'make-fetch-happen': async () => {
      t.fail('must not request an Azure token')
    },
  })
  process.env.NPM_ID_TOKEN = 'provided-token'
  delete process.env.SYSTEM_ACCESSTOKEN
  responses[0] = opts => {
    t.equal(opts[authTokenKey], 'provided-token')
    return { token: exchangeToken }
  }
  const opts = await run()
  t.equal(opts[authTokenKey], exchangeToken)
})

t.test('Azure Pipelines exchanges NPM_ID_TOKEN for a registry without a configured application client ID', async t => {
  const registryUrl = 'https://other.registry.npmjs.org/'
  const tokenKey = '//other.registry.npmjs.org/:_authToken'
  const { run } = await setupAzure(t, {
    'make-fetch-happen': async () => {
      t.fail('must not request an Azure token')
    },
    'npm-registry-fetch': {
      json: async (url, opts) => {
        t.equal(url.href, `${registryUrl}-/npm/v1/oidc/token/exchange/package/test-package`)
        t.equal(opts[tokenKey], 'provided-token')
        return { token: exchangeToken }
      },
    },
  })
  process.env.NPM_ID_TOKEN = 'provided-token'
  const opts = await run(undefined, registryUrl)
  t.equal(opts[tokenKey], exchangeToken)
})

t.test('Azure Pipelines does not enable provenance when GitHub Actions is also detected', async t => {
  const { npm, ci, oidc } = await setupAzure(t, {
    libnpmaccess: {
      getVisibility: async () => {
        t.fail('must not check package visibility for unsupported provenance')
        return { public: true }
      },
    },
  })
  ci.GITHUB_ACTIONS = true
  const payload = Buffer.from(JSON.stringify({ repository_visibility: 'public' })).toString('base64')
  process.env.NPM_ID_TOKEN = `header.${payload}.signature`
  const opts = { ...npm.flatOptions }
  await oidc({
    packageName: 'test-package',
    registry,
    opts,
    config: npm.config,
    enableProvenanceAutoConfiguration: true,
  })
  t.equal(opts[authTokenKey], exchangeToken, 'still exchanges the supplied token')
  t.notOk(opts.provenance, 'does not enable provenance')
})

for (const registryUrl of [
  'https://other.registry.npmjs.org/',
  'http://registry.npmjs.org/',
  'https://registry.npmjs.org/custom/',
  'https://registry.npmjs.org:8443/',
]) {
  t.test(`Azure Pipelines skips token retrieval without a configured application client ID for ${registryUrl}`, async t => {
    const { responses, run } = await setupAzure(t, {
      'make-fetch-happen': async () => {
        t.fail('must not request an Azure token')
      },
    })
    await run(undefined, registryUrl)
    t.equal(responses.length, 1, 'does not attempt an exchange')
  })
}

for (const name of [
  'SYSTEM_ACCESSTOKEN',
  'SYSTEM_COLLECTIONURI',
  'SYSTEM_TEAMPROJECTID',
  'SYSTEM_HOSTTYPE',
  'SYSTEM_PLANID',
  'SYSTEM_JOBID',
]) {
  t.test(`Azure Pipelines skips token retrieval without ${name}`, async t => {
    const { npm, responses, run } = await setupAzure(t)
    delete process.env[name]
    npm.config.set(authTokenKey, fallbackToken, 'user')
    const opts = await run()
    t.equal(opts[authTokenKey], fallbackToken)
    t.equal(responses.length, 1, 'does not attempt an exchange')
  })
}

for (const [label, status, body] of [
  ['HTTP failure', 403, { message: 'Forbidden' }],
  ['missing token', 200, {}],
  ['empty token', 200, { accessToken: '' }],
  ['invalid token', 200, { accessToken: 123 }],
  ['invalid JSON', 200, 'not json'],
  ['redirect', 302, {}],
]) {
  t.test(`Azure Pipelines preserves fallback credentials after ${label}`, async t => {
    const { npm, responses, run, request } = await setupAzure(t)
    const scope = request().reply(status, body, { location: 'https://other.example/token' })
    npm.config.set(authTokenKey, fallbackToken, 'user')
    const opts = await run()
    t.ok(scope.isDone())
    t.equal(opts[authTokenKey], fallbackToken)
    t.equal(npm.config.get(authTokenKey), fallbackToken)
    t.equal(responses.length, 1, 'does not attempt an exchange')
  })
}

for (const failure of [
  'exchange failure',
  'missing exchange token',
  'missing identity token',
  'unsupported CI',
  'missing GitHub permissions',
  'GitHub identity request failure',
]) {
  t.test(`restores credentials before ${failure}`, async t => {
    const { npm, ci, responses, run } = await setup(t)
    npm.config.set(authTokenKey, fallbackToken, 'user')
    const firstOpts = await run()
    t.equal(firstOpts[authTokenKey], exchangeToken)
    t.equal(npm.config.get(authTokenKey), exchangeToken)
    t.equal(npm.config.get(authTokenKey, 'cli'), exchangeToken)
    t.equal(npm.config.get(authTokenKey, 'user'), fallbackToken, 'user config is never overwritten')

    if (failure === 'exchange failure') {
      responses.push(new Error('exchange failed'))
    } else if (failure === 'missing exchange token') {
      responses.push({})
    } else if (failure === 'unsupported CI') {
      ci.GITLAB = false
    } else {
      delete process.env.NPM_ID_TOKEN
      if (failure !== 'missing identity token') {
        ci.GITLAB = false
        ci.GITHUB_ACTIONS = true
        if (failure === 'missing GitHub permissions') {
          delete process.env.ACTIONS_ID_TOKEN_REQUEST_URL
        }
      }
    }

    const nextOpts = await run()
    t.equal(nextOpts[authTokenKey], fallbackToken, 'next request uses fallback credentials')
    t.equal(firstOpts[authTokenKey], fallbackToken, 'previous options no longer contain the token')
    t.equal(npm.config.get(authTokenKey, 'cli'), undefined, 'clears the runtime override')
    t.equal(npm.config.get(authTokenKey, 'user'), fallbackToken, 'preserves user config')
    t.equal(npm.flatOptions[authTokenKey], fallbackToken, 'restores flattened config')
  })
}

for (const source of ['user', 'global', 'project', 'env', 'cli', 'none']) {
  t.test(`preserves ${source} credentials when reusing flat options`, async t => {
    const { npm, responses, run } = await setup(t)
    if (source !== 'none') {
      npm.config.set(authTokenKey, fallbackToken, source)
    }
    const opts = npm.flatOptions
    await run(opts)
    t.equal(npm.config.getCredentialsByURI(registry).token, exchangeToken)
    // Populate the flat-options cache with the temporary runtime token.
    const nextOpts = npm.flatOptions
    responses.push({})
    await run(opts)

    const expected = source === 'none' ? undefined : fallbackToken
    t.equal(opts[authTokenKey], expected)
    t.equal(npm.config.get(authTokenKey), expected)
    t.equal(npm.flatOptions[authTokenKey], expected)
    t.equal(npm.config.get(authTokenKey, 'user'), source === 'user' ? fallbackToken : undefined)
    t.not(npm.flatOptions, nextOpts, 'invalidates the cached temporary credentials')
    if (source === 'none') {
      t.notOk(Object.hasOwn(opts, authTokenKey), 'removes the temporary option entirely')
    }
  })
}

t.test('does not restore an earlier exchange token after multiple successes', async t => {
  const { npm, responses, run } = await setup(t)
  npm.config.set(authTokenKey, fallbackToken, 'user')
  await run()
  responses.push({ token: 'second-exchange-token' })
  const secondOpts = await run()
  t.equal(secondOpts[authTokenKey], 'second-exchange-token')
  responses.push({})
  const thirdOpts = await run()
  t.equal(thirdOpts[authTokenKey], fallbackToken)
  t.equal(npm.config.get(authTokenKey), fallbackToken)
})

t.test('clears the previous token before starting another exchange', async t => {
  const { npm, responses, run } = await setup(t)
  npm.config.set(authTokenKey, fallbackToken, 'user')
  const firstOpts = await run()
  responses.push(opts => {
    t.equal(npm.config.get(authTokenKey), fallbackToken, 'old token is already cleared')
    t.equal(firstOpts[authTokenKey], fallbackToken, 'old request options are already cleared')
    t.equal(opts[authTokenKey], 'identity-token', 'exchange uses the identity token')
    return { token: 'new-exchange-token' }
  })
  const nextOpts = await run()
  t.equal(nextOpts[authTokenKey], 'new-exchange-token')
  t.equal(npm.config.get(authTokenKey), 'new-exchange-token')
})

t.test('clears the previous registry token when switching registries', async t => {
  const { npm, responses, run } = await setup(t)
  const otherRegistry = 'https://other.registry.npmjs.org/'
  const otherKey = '//other.registry.npmjs.org/:_authToken'
  npm.config.set(authTokenKey, fallbackToken, 'user')
  npm.config.set(otherKey, 'other-fallback', 'user')
  await run()
  responses.push({ token: 'other-exchange-token' })
  const otherOpts = await run(undefined, otherRegistry)
  t.equal(otherOpts[authTokenKey], fallbackToken)
  t.equal(otherOpts[otherKey], 'other-exchange-token')
  responses.push({})
  const nextOpts = await run()
  t.equal(nextOpts[authTokenKey], fallbackToken)
  t.equal(nextOpts[otherKey], 'other-fallback')
  t.equal(npm.config.get(otherKey), 'other-fallback')
})

t.test('preserves credentials explicitly replaced after an exchange', async t => {
  const { npm, responses, run } = await setup(t)
  const opts = await run()
  npm.config.set(authTokenKey, 'updated-user-token', 'user')
  opts[authTokenKey] = 'updated-request-token'
  responses.push({})
  await run(opts)
  t.equal(npm.config.get(authTokenKey), 'updated-user-token')
  t.equal(opts[authTokenKey], 'updated-request-token')
})

t.test('preserves a runtime credential replaced independently of OIDC', async t => {
  const { npm, responses, run } = await setup(t)
  await run()
  npm.config.set(authTokenKey, 'updated-runtime-token', 'cli')
  responses.push({})
  const opts = await run()
  t.equal(npm.config.get(authTokenKey, 'cli'), 'updated-runtime-token')
  t.equal(opts[authTokenKey], 'updated-runtime-token')
})

t.test('saving config during an exchange never persists the OIDC token', async t => {
  const { npm, run } = await setup(t)
  const sources = ['user', 'project', 'global']
  for (const source of sources) {
    npm.config.set(authTokenKey, `${source}-fallback`, source)
  }
  await run()
  t.equal(npm.config.get(authTokenKey, 'cli'), exchangeToken)
  await t.rejects(npm.config.save('cli'), { message: 'invalid config location param: cli' })
  for (const source of sources) {
    t.equal(npm.config.get(authTokenKey, source), `${source}-fallback`)
    await npm.config.save(source)
    const content = await readFile(npm.config.data.get(source).source, 'utf8')
    t.match(content, `${authTokenKey}=${source}-fallback`)
    t.notMatch(content, exchangeToken)
  }
})

t.test('the next invocation clears the token even with a different config', async t => {
  const { npm, ci, run, oidc } = await setup(t)
  npm.config.set(authTokenKey, fallbackToken, 'user')
  const opts = await run()
  ci.GITLAB = false
  await oidc({ packageName: 'other-package', registry, opts: {}, config: {} })
  t.equal(npm.config.get(authTokenKey, 'cli'), undefined)
  t.equal(npm.config.get(authTokenKey), fallbackToken)
  t.equal(opts[authTokenKey], fallbackToken)
})

t.test('does not copy package-specific fallback options into the next package', async t => {
  const { npm, responses, run } = await setup(t)
  npm.config.set(authTokenKey, fallbackToken, 'user')
  const firstOpts = await run({ ...npm.flatOptions, [authTokenKey]: 'package-specific-token' })
  responses.push({})
  const nextOpts = await run()
  t.equal(firstOpts[authTokenKey], 'package-specific-token')
  t.equal(nextOpts[authTokenKey], fallbackToken)
})
