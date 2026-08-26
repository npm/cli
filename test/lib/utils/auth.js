const t = require('tap')
const { EventEmitter } = require('node:events')
const mockGlobals = require('@npmcli/mock-globals')
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

// A real EventEmitter, not a plain `{ isTTY }` object: the fix races the prompt
// against stdin's own `end` event, so the mock needs working `.once`/`.removeListener`
// the way a real stream (TTY or piped) would have.
const mockStdin = (isTTY) => {
  const stdin = new EventEmitter()
  stdin.isTTY = isTTY
  return stdin
}

// A promise that never settles — the real `read()` genuinely hangs forever on
// EOF-without-a-line (that's the bug), so this is a more faithful mock than one
// that resolves after some number of microtask ticks. It also sidesteps having
// to time `stdin.emit('end')` against an artificial resolution: with a prompt
// that can never resolve on its own, only the `end` event can ever settle the
// race, so `end` can be emitted after any delay, on any code path (legacy or
// the web-login ENYI fallback, which has an extra await before reaching the
// prompt), without a risk of a flaky win/lose depending on exact tick count.
const hangingRead = () => new Promise(() => {})

const setupLogin = (t, params, opts = {}) => {
  const { creds = {}, loginWeb, stdin = mockStdin(true), hangs, ...rest } = params
  const { login } = tmock(t, '{LIB}/utils/auth.js', {
    '{LIB}/utils/read-user-info.js': {
      username: hangs ? hangingRead : async () => 'foo',
      password: hangs ? hangingRead : async () => 'bar',
    },
    '{LIB}/utils/open-url.js': {
      createOpener: () => () => {},
    },
    'npm-profile': {
      loginCouch: async () => ({ token: 'test-token' }),
      ...(loginWeb ? { loginWeb } : {}),
    },
  })
  return setupMockNpm(t, {
    ...rest,
    config: { 'auth-type': 'legacy', ...rest.config },
  }).then(({ npm }) => {
    // process.stdin/process.stdout are lazily-defined getters, not plain
    // assignable properties — mock-npm's own `globals` option merges them in
    // without `{ replace: true }`, which silently fails to swap them. Using
    // mockGlobals directly here (like test/lib/commands/login.js's mockLogin
    // does) is required for `process.stdin` inside login() to actually be
    // this test's `stdin` object.
    mockGlobals(t, {
      'process.stdin': stdin,
      'process.stdout': { isTTY: true },
      ...rest.globals,
    }, { replace: true })
    const result = login(npm, { creds, registry: 'https://registry.npmjs.org/', ...opts })
    if (hangs) {
      // Give login() a full event-loop turn to reach and register the
      // `end` listener (needed for the web-login ENYI fallback, which awaits
      // the rejected loginWeb() call first) before ending stdin.
      setImmediate(() => stdin.emit('end'))
    }
    return result
  })
}

t.test('login throws a clear error when stdin ends before answering', async (t) => {
  await t.rejects(setupLogin(t, {
    stdin: mockStdin(false),
    hangs: true,
  }), {
    code: 'ENOTTYAUTH',
    message: /requires an interactive terminal, or credentials piped/,
  }, 'rejects with a clear, actionable error instead of hanging')
})

t.test('login throws a clear error when a real tty session ends (e.g. Ctrl-D) before answering', async (t) => {
  await t.rejects(setupLogin(t, {
    stdin: mockStdin(true),
    hangs: true,
  }), {
    code: 'ENOTTYAUTH',
    message: /requires an interactive terminal, or credentials piped/,
  }, 'rejects instead of hanging even though stdin is a tty')
})

t.test('login succeeds with couch on a real tty', async (t) => {
  const result = await setupLogin(t, {
    stdin: mockStdin(true),
  })

  t.strictSame(result, {
    message: 'Logged in on https://registry.npmjs.org/.',
    newCreds: { token: 'test-token' },
  })
})

t.test('login succeeds with couch when credentials are piped and stdin is not a tty', async (t) => {
  // Not passing hangs: the mocked username/password resolve on
  // their own, standing in for "the pipe produced a line" — the fix must not
  // reject this just because isTTY is false.
  const result = await setupLogin(t, {
    stdin: mockStdin(false),
  })

  t.strictSame(result, {
    message: 'Logged in on https://registry.npmjs.org/.',
    newCreds: { token: 'test-token' },
  })
})

t.test('login throws a clear error for the web login ENYI fallback when stdin ends before answering', async (t) => {
  await t.rejects(setupLogin(t, {
    config: { 'auth-type': 'web' },
    loginWeb: async () => {
      throw Object.assign(new Error('web login not supported'), { code: 'ENYI' })
    },
    stdin: mockStdin(false),
    hangs: true,
  }), {
    code: 'ENOTTYAUTH',
    message: /requires an interactive terminal, or credentials piped/,
  }, 'rejects with a clear, actionable error instead of hanging on the couch fallback')
})

t.test('login falls back to couch after web login ENYI on a real tty', async (t) => {
  const result = await setupLogin(t, {
    config: { 'auth-type': 'web' },
    loginWeb: async () => {
      throw Object.assign(new Error('web login not supported'), { code: 'ENYI' })
    },
    stdin: mockStdin(true),
  })

  t.strictSame(result, {
    message: 'Logged in on https://registry.npmjs.org/.',
    newCreds: { token: 'test-token' },
  })
})
