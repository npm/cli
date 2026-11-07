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
      'process.stderr': { isTTY: true },
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
      'process.stderr': { isTTY: true },
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
      'process.stderr': { isTTY: true },
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
      'process.stderr': { isTTY: true },
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
      'process.stderr': { isTTY: true },
    },
  }, fn), { message: 'nope' }, 'rejects with the original error')
})

t.test('does not prompt if stdin or stderr is not a tty', async (t) => {
  const fn = async () => {
    throw Object.assign(new Error('nope'), { code: 'EOTP' })
  }

  await t.rejects(setupOtplease(t, {
    globals: {
      'process.stdin': { isTTY: false },
      'process.stderr': { isTTY: false },
    },
  }, fn), { message: 'nope' }, 'rejects with the original error')
})

t.test('prompts when stdin and stderr are TTYs even if stdout is not', async (t) => {
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
      'process.stdout': { isTTY: false },
      'process.stderr': { isTTY: true },
    },
  }, fn)

  t.strictSame(result, { some: 'prop', otp: '1234' })
})
