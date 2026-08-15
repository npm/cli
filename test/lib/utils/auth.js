const t = require('tap')
const setupMockNpm = require('../../fixtures/mock-npm')
const tmock = require('../../fixtures/tmock')

// TODO make this real and not a mock
const setupOtplease = async (t, { otp = {}, ...rest }, fn) => {
  const { otplease } = tmock(t, '{LIB}/utils/auth.js', {
    '{LIB}/utils/read-user-info.js': {
      otp: async () => '1234',
    },
    '{LIB}/utils/open-url.js': {
      createOpener: () => () => {},
    },
    'npm-profile': {
      webAuthOpener: async (opener) => {
        opener()
        return { token: '1234' }
      },
    },
  })
  return otplease(await setupMockNpm(t, rest).then(({ npm }) => npm), otp, fn)
}

t.test('returns function results on success', async (t) => {
  const result = await setupOtplease(t, {}, () => 'test string')
  t.equal('test string', result)
})

t.test('returns function results on otp success', async (t) => {
  const fn = ({ otp }) => {
    if (otp) {
      return 'success'
    }
    throw Object.assign(new Error('nope'), { code: 'EOTP' })
  }

  const result = await setupOtplease(t, {
    globals: {
      'process.stdin': { isTTY: true },
      'process.stdout': { isTTY: true },
    },
  }, fn)

  t.equal('success', result)
})

t.test('prompts for otp for EOTP', async (t) => {
  let called = false

  const fn = async (opts) => {
    if (!called) {
      called = true
      throw Object.assign(new Error('nope'), { code: 'EOTP' })
    }
    return opts
  }

  const result = await setupOtplease(t, {
    otp: { some: 'prop' },
    globals: {
      'process.stdin': { isTTY: true },
      'process.stdout': { isTTY: true },
    },
  }, fn)

  t.strictSame(result, { some: 'prop', otp: '1234' })
})

t.test('returns function results on webauth success', async (t) => {
  const fn = ({ otp }) => {
    if (!otp) {
      throw Object.assign(new Error('nope'), {
        code: 'EOTP',
        body: {
          authUrl: 'https://www.example.com/auth',
          doneUrl: 'https://www.example.com/done',
        },
      })
    }
    return 'success'
  }

  const result = await setupOtplease(t, {
    config: { browser: 'firefox' },
    globals: {
      'process.stdin': { isTTY: true },
      'process.stdout': { isTTY: true },
    },
  }, fn)

  t.equal('success', result)
})

t.test('prompts for otp for 401', async (t) => {
  let called = false

  const fn = async (opts) => {
    if (!called) {
      called = true
      throw Object.assign(new Error('nope'), {
        code: 'E401',
        body: 'one-time pass required',
      })
    }

    return opts
  }

  const result = await setupOtplease(t, {
    globals: {
      'process.stdin': { isTTY: true },
      'process.stdout': { isTTY: true },
    },
  }, fn)

  t.strictSame(result, { otp: '1234' })
})

t.test('does not prompt for non-otp errors', async (t) => {
  const fn = async () => {
    throw new Error('nope')
  }

  await t.rejects(setupOtplease(t, {
    globals: {
      'process.stdin': { isTTY: true },
      'process.stdout': { isTTY: true },
    },
  }, fn), { message: 'nope' }, 'rejects with the original error')
})

t.test('does not prompt if stdin or stdout is not a tty', async (t) => {
  const fn = async () => {
    throw Object.assign(new Error('nope'), { code: 'EOTP' })
  }

  await t.rejects(setupOtplease(t, {
    globals: {
      'process.stdin': { isTTY: false },
      'process.stdout': { isTTY: false },
    },
  }, fn), { message: 'nope' }, 'rejects with the original error')
})

const setupLogin = async (t, { creds = {}, loginWeb, ...rest }, opts = {}) => {
  const { login } = tmock(t, '{LIB}/utils/auth.js', {
    '{LIB}/utils/read-user-info.js': {
      username: async () => 'foo',
      password: async () => 'bar',
    },
    '{LIB}/utils/open-url.js': {
      createOpener: () => () => {},
    },
    'npm-profile': {
      loginCouch: async () => ({ token: 'test-token' }),
      ...(loginWeb ? { loginWeb } : {}),
    },
  })
  const { npm } = await setupMockNpm(t, {
    ...rest,
    config: { 'auth-type': 'legacy', ...rest.config },
  })
  return login(npm, { creds, registry: 'https://registry.npmjs.org/', ...opts })
}

t.test('login throws a clear error when stdin is not a tty', async (t) => {
  await t.rejects(setupLogin(t, {
    globals: {
      'process.stdin': { isTTY: false },
      'process.stdout': { isTTY: true },
    },
  }), {
    code: 'ENOTTYAUTH',
    message: /requires an interactive terminal/,
  }, 'rejects with a clear, actionable error instead of hanging')
})

t.test('login throws a clear error when stdout is not a tty', async (t) => {
  await t.rejects(setupLogin(t, {
    globals: {
      'process.stdin': { isTTY: true },
      'process.stdout': { isTTY: false },
    },
  }), {
    code: 'ENOTTYAUTH',
    message: /requires an interactive terminal/,
  }, 'rejects with a clear, actionable error instead of hanging')
})

t.test('login throws a clear error when neither stdin nor stdout is a tty', async (t) => {
  await t.rejects(setupLogin(t, {
    globals: {
      'process.stdin': { isTTY: false },
      'process.stdout': { isTTY: false },
    },
  }), {
    code: 'ENOTTYAUTH',
    message: /requires an interactive terminal/,
  }, 'rejects with a clear, actionable error instead of hanging')
})

t.test('login succeeds with couch when stdin and stdout are ttys', async (t) => {
  const result = await setupLogin(t, {
    globals: {
      'process.stdin': { isTTY: true },
      'process.stdout': { isTTY: true },
    },
  })

  t.strictSame(result, {
    message: 'Logged in on https://registry.npmjs.org/.',
    newCreds: { token: 'test-token' },
  })
})

t.test('login throws a clear error for the web login ENYI fallback when not a tty', async (t) => {
  await t.rejects(setupLogin(t, {
    config: { 'auth-type': 'web' },
    loginWeb: async () => {
      throw Object.assign(new Error('web login not supported'), { code: 'ENYI' })
    },
    globals: {
      'process.stdin': { isTTY: false },
      'process.stdout': { isTTY: false },
    },
  }), {
    code: 'ENOTTYAUTH',
    message: /requires an interactive terminal/,
  }, 'rejects with a clear, actionable error instead of hanging on the couch fallback')
})

t.test('login falls back to couch after web login ENYI when a tty', async (t) => {
  const result = await setupLogin(t, {
    config: { 'auth-type': 'web' },
    loginWeb: async () => {
      throw Object.assign(new Error('web login not supported'), { code: 'ENYI' })
    },
    globals: {
      'process.stdin': { isTTY: true },
      'process.stdout': { isTTY: true },
    },
  })

  t.strictSame(result, {
    message: 'Logged in on https://registry.npmjs.org/.',
    newCreds: { token: 'test-token' },
  })
})
