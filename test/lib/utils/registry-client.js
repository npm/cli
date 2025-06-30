const t = require('tap')
const tmock = require('../../fixtures/tmock')

const mockNpmFetch = async (url, opts) => {
  return {
    json: async () => ({ mockData: true, url, opts }),
  }
}

const setupRegistryClient = async (t, {
  npmFetch = mockNpmFetch,
  readOtp = async () => '123456',
  webAuthOpener = async () => ({ token: '654321' }),
  createOpener = () => () => {},
  stdin = { isTTY: true },
  stdout = { isTTY: true },
  ...mocks
} = {}) => {
  const RegistryClient = tmock(t, '{LIB}/utils/registry-client.js', {
    'npm-registry-fetch': npmFetch,
    '{LIB}/utils/read-user-info.js': {
      otp: readOtp,
    },
    'npm-profile': {
      webAuthOpener,
    },
    '{LIB}/utils/open-url.js': {
      createOpener,
    },
    ...mocks,
  })

  const mockNpm = {
    flatOptions: { registry: 'https://registry.npmjs.org/' },
  }

  // Mock TTY for testing
  const originalStdin = process.stdin.isTTY
  const originalStdout = process.stdout.isTTY
  process.stdin.isTTY = stdin.isTTY
  process.stdout.isTTY = stdout.isTTY

  t.teardown(() => {
    process.stdin.isTTY = originalStdin
    process.stdout.isTTY = originalStdout
  })

  return new RegistryClient(mockNpm)
}

t.test('RegistryClient constructor', async (t) => {
  const client = await setupRegistryClient(t)
  t.ok(client, 'creates registry client instance')
  t.type(client.fetch, 'function', 'has fetch method')
  t.type(client.fetchJson, 'function', 'has fetchJson method')
  t.type(client.fetchWithJson, 'function', 'has fetchWithJson method')
  t.type(client.postJson, 'function', 'has postJson method')
  t.type(client.putJson, 'function', 'has putJson method')
  t.type(client.withOtp, 'function', 'has withOtp method')
})

t.test('fetch - basic functionality', async (t) => {
  const client = await setupRegistryClient(t, {
    npmFetch: async (url, opts) => {
      t.equal(url, '/test', 'passes correct URL')
      t.match(opts, { registry: 'https://registry.npmjs.org/' }, 'merges flatOptions')
      t.equal(opts.method, 'GET', 'passes custom options')
      return { json: async () => ({ success: true }) }
    },
  })

  const result = await client.fetch('/test', { method: 'GET' })
  t.ok(result, 'returns response')
})

t.test('fetchJson - automatic JSON parsing', async (t) => {
  const client = await setupRegistryClient(t, {
    npmFetch: async () => ({
      json: async () => ({ data: 'test' }),
    }),
  })

  const result = await client.fetchJson('/test')
  t.strictSame(result, { data: 'test' }, 'returns parsed JSON')
})

t.test('fetchWithJson - automatic JSON stringify and content-type', async (t) => {
  const client = await setupRegistryClient(t, {
    npmFetch: async (url, opts) => {
      t.equal(opts.body, '{"test":"data"}', 'stringifies JSON body')
      t.equal(opts.headers['content-type'], 'application/json', 'sets content-type header')
      return { json: async () => ({ success: true }) }
    },
  })

  await client.fetchWithJson('/test', { test: 'data' })
})

t.test('postJson - POST with JSON body and parsed response', async (t) => {
  const client = await setupRegistryClient(t, {
    npmFetch: async (url, opts) => {
      t.equal(opts.method, 'POST', 'sets POST method')
      t.equal(opts.body, '{"data":"test"}', 'stringifies JSON body')
      t.equal(opts.headers['content-type'], 'application/json', 'sets content-type header')
      return { json: async () => ({ created: true }) }
    },
  })

  const result = await client.postJson('/test', { data: 'test' })
  t.strictSame(result, { created: true }, 'returns parsed JSON response')
})

t.test('putJson - PUT with JSON body and parsed response', async (t) => {
  const client = await setupRegistryClient(t, {
    npmFetch: async (url, opts) => {
      t.equal(opts.method, 'PUT', 'sets PUT method')
      t.equal(opts.body, '{"data":"test"}', 'stringifies JSON body')
      t.equal(opts.headers['content-type'], 'application/json', 'sets content-type header')
      return { json: async () => ({ updated: true }) }
    },
  })

  const result = await client.putJson('/test', { data: 'test' })
  t.strictSame(result, { updated: true }, 'returns parsed JSON response')
})

t.test('withOtp - basic function execution', async (t) => {
  const client = await setupRegistryClient(t)

  const testFn = async (opts) => {
    t.match(opts, { registry: 'https://registry.npmjs.org/' }, 'merges flatOptions')
    return 'success'
  }

  const result = await client.withOtp(testFn, { custom: 'option' })
  t.equal(result, 'success', 'returns function result')
})

t.test('OTP retry - classic EOTP error', async (t) => {
  let callCount = 0
  const client = await setupRegistryClient(t, {
    readOtp: async (prompt) => {
      t.match(prompt, /one-time password/i, 'prompts for OTP')
      return '123456'
    },
  })

  const testFn = async (opts) => {
    callCount++
    if (callCount === 1) {
      throw Object.assign(new Error('OTP required'), { code: 'EOTP' })
    }
    t.equal(opts.otp, '123456', 'adds OTP to options')
    return 'success with otp'
  }

  const result = await client.withOtp(testFn)
  t.equal(result, 'success with otp', 'retries with OTP and succeeds')
  t.equal(callCount, 2, 'calls function twice')
})

t.test('OTP retry - E401 with one-time pass error', async (t) => {
  let callCount = 0
  const client = await setupRegistryClient(t, {
    readOtp: async () => '654321',
  })

  const testFn = async (opts) => {
    callCount++
    if (callCount === 1) {
      throw Object.assign(new Error('unauthorized'), {
        code: 'E401',
        body: 'one-time pass required',
      })
    }
    t.equal(opts.otp, '654321', 'adds OTP to options')
    return 'success with e401 otp'
  }

  const result = await client.withOtp(testFn)
  t.equal(result, 'success with e401 otp', 'retries with OTP and succeeds')
  t.equal(callCount, 2, 'calls function twice')
})

t.test('OTP retry - web-based OTP flow', async (t) => {
  let callCount = 0
  const client = await setupRegistryClient(t, {
    webAuthOpener: async (opener, authUrl, doneUrl) => {
      t.type(opener, 'function', 'receives opener function')
      t.equal(authUrl, 'https://example.com/auth', 'receives auth URL')
      t.equal(doneUrl, 'https://example.com/done', 'receives done URL')
      opener() // Call the opener to simulate user interaction
      return { token: 'web-otp-token' }
    },
    createOpener: (npm, message) => {
      t.match(message, /authenticate/i, 'creates opener with auth message')
      return () => {} // Mock opener function
    },
  })

  const testFn = async (opts) => {
    callCount++
    if (callCount === 1) {
      throw Object.assign(new Error('OTP required'), {
        code: 'EOTP',
        body: {
          authUrl: 'https://example.com/auth',
          doneUrl: 'https://example.com/done',
        },
      })
    }
    t.equal(opts.otp, 'web-otp-token', 'adds web OTP token to options')
    return 'success with web otp'
  }

  const result = await client.withOtp(testFn)
  t.equal(result, 'success with web otp', 'retries with web OTP and succeeds')
  t.equal(callCount, 2, 'calls function twice')
})

t.test('OTP retry - non-OTP errors are re-thrown', async (t) => {
  const client = await setupRegistryClient(t)

  const testFn = async () => {
    throw new Error('Some other error')
  }

  await t.rejects(
    client.withOtp(testFn),
    { message: 'Some other error' },
    're-throws non-OTP errors'
  )
})

t.test('OTP retry - E401 without one-time pass is re-thrown', async (t) => {
  const client = await setupRegistryClient(t)

  const testFn = async () => {
    throw Object.assign(new Error('unauthorized'), {
      code: 'E401',
      body: 'different auth error',
    })
  }

  await t.rejects(
    client.withOtp(testFn),
    { code: 'E401' },
    're-throws E401 errors that are not OTP-related'
  )
})

t.test('OTP retry - non-interactive terminal behavior', async (t) => {
  const client = await setupRegistryClient(t, {
    stdin: { isTTY: false },
    stdout: { isTTY: true },
  })

  const testFn = async () => {
    throw Object.assign(new Error('OTP required'), { code: 'EOTP' })
  }

  await t.rejects(
    client.withOtp(testFn),
    { code: 'EOTP' },
    'does not attempt OTP retry in non-interactive terminal'
  )
})

t.test('OTP retry - non-TTY stdout behavior', async (t) => {
  const client = await setupRegistryClient(t, {
    stdin: { isTTY: true },
    stdout: { isTTY: false },
  })

  const testFn = async () => {
    throw Object.assign(new Error('OTP required'), { code: 'EOTP' })
  }

  await t.rejects(
    client.withOtp(testFn),
    { code: 'EOTP' },
    'does not attempt OTP retry when stdout is not TTY'
  )
})

t.test('fetch - OTP retry integration', async (t) => {
  let callCount = 0
  const client = await setupRegistryClient(t, {
    npmFetch: async (url, opts) => {
      callCount++
      if (callCount === 1) {
        throw Object.assign(new Error('OTP required'), { code: 'EOTP' })
      }
      t.equal(opts.otp, '123456', 'adds OTP to fetch options')
      return { json: async () => ({ success: true }) }
    },
    readOtp: async () => '123456',
  })

  const result = await client.fetch('/test')
  t.ok(result, 'fetch succeeds after OTP retry')
  t.equal(callCount, 2, 'retries fetch with OTP')
})

t.test('fetchJson - OTP retry integration', async (t) => {
  let callCount = 0
  const client = await setupRegistryClient(t, {
    npmFetch: async (url, opts) => {
      callCount++
      if (callCount === 1) {
        throw Object.assign(new Error('OTP required'), { code: 'EOTP' })
      }
      t.equal(opts.otp, '123456', 'adds OTP to fetch options')
      return { json: async () => ({ data: 'success' }) }
    },
    readOtp: async () => '123456',
  })

  const result = await client.fetchJson('/test')
  t.strictSame(result, { data: 'success' }, 'fetchJson succeeds after OTP retry')
  t.equal(callCount, 2, 'retries fetch with OTP')
})

t.test('putJson - OTP retry integration', async (t) => {
  let callCount = 0
  const client = await setupRegistryClient(t, {
    npmFetch: async (url, opts) => {
      callCount++
      if (callCount === 1) {
        throw Object.assign(new Error('OTP required'), { code: 'EOTP' })
      }
      t.equal(opts.otp, '123456', 'adds OTP to fetch options')
      t.equal(opts.method, 'PUT', 'preserves PUT method')
      t.equal(opts.body, '{"data":"test"}', 'preserves JSON body')
      return { json: async () => ({ updated: true }) }
    },
    readOtp: async () => '123456',
  })

  const result = await client.putJson('/test', { data: 'test' })
  t.strictSame(result, { updated: true }, 'putJson succeeds after OTP retry')
  t.equal(callCount, 2, 'retries fetch with OTP')
})

t.test('headers preservation in fetchWithJson', async (t) => {
  const client = await setupRegistryClient(t, {
    npmFetch: async (url, opts) => {
      t.equal(opts.headers['content-type'], 'application/json', 'sets default content-type')
      t.equal(opts.headers.authorization, 'Bearer token', 'preserves existing headers')
      t.equal(opts.headers.custom, 'value', 'preserves custom headers')
      return { json: async () => ({ success: true }) }
    },
  })

  await client.fetchWithJson('/test', { data: 'test' }, {
    headers: {
      authorization: 'Bearer token',
      custom: 'value',
    },
  })
})

t.test('options merging precedence', async (t) => {
  const client = await setupRegistryClient(t, {
    npmFetch: async (url, opts) => {
      t.equal(opts.registry, 'https://custom.registry.com/', 'custom options override flatOptions')
      t.equal(opts.timeout, 5000, 'preserves flatOptions when not overridden')
      return { json: async () => ({ success: true }) }
    },
  })

  // Mock npm with more flatOptions
  client.npm.flatOptions = {
    registry: 'https://registry.npmjs.org/',
    timeout: 5000,
  }

  await client.fetch('/test', {
    registry: 'https://custom.registry.com/',
  })
})

t.test('error handling preserves original error properties', async (t) => {
  const client = await setupRegistryClient(t)

  const originalError = Object.assign(new Error('Custom error'), {
    code: 'ECUSTOM',
    statusCode: 500,
    body: { details: 'error details' },
  })

  const testFn = async () => {
    throw originalError
  }

  try {
    await client.withOtp(testFn)
    t.fail('Should have thrown error')
  } catch (err) {
    t.equal(err.message, 'Custom error', 'preserves error message')
    t.equal(err.code, 'ECUSTOM', 'preserves error code')
    t.equal(err.statusCode, 500, 'preserves error statusCode')
    t.strictSame(err.body, { details: 'error details' }, 'preserves error body')
  }
})
