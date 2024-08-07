const t = require('tap')
const tmock = require('../../fixtures/tmock')
const mockNpm = require('../../fixtures/mock-npm')
const EventEmitter = require('node:events')
const { createOpener } = require('../../../lib/utils/open-url.js')

function setup (t, cb) {
  return mockNpm(t).then(mock => {
    let spawnCalled = false
    let spawnArgs = null

    const spawn = (command, args) => {
      spawnCalled = true
      spawnArgs = { command, args }
      return {
        on: (event, callback) => {
          if (event === 'error') {
            setTimeout(() => callback(new Error('Simulated spawn error')), 0)
          } else if (event === 'close') {
            setTimeout(() => callback(null, 0), 0)
          }
          return { on: () => {} }
        },
      }
    }

    const exec = (cmd, callback) => {
      callback(null, { stdout: 'Microsoft' })
    }

    const { openUrl } = tmock(t, '{LIB}/utils/open-url.js', {
      '@npmcli/promise-spawn': {
        open: async () => {
          return new Promise((resolve, reject) => {
            const child = spawn()
            child.on('error', reject)
            child.on('close', (code) => {
              if (code === 0) {
                resolve()
              } else {
                reject(new Error(`Child process exiited with code ${code}`))
              }
            })
          })
        },
      },
      'node:child_process': { spawn, exec },
      'node:util': {
        promisify: (fn) => async (...args) => {
          return new Promise((resolve, reject) => fn(...args, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          }))
        },
      },
    })
    return cb(null, {
      npm: mock.npm,
      openUrl,
      spawnCalled: () => spawnCalled,
      spawnArgs: () => spawnArgs,
    })
  }).catch(err => {
    cb(err)
    throw err
  })
}

const mockOpenUrl = async (t, args, { openerResult, ...config } = {}) => {
  let openerUrl = null
  let openerOpts = null

  const open = async (url, options) => {
    openerUrl = url
    openerOpts = options
    if (openerResult) {
      throw openerResult
    }
  }

  const mock = await mockNpm(t, { config })

  const { openUrl } = tmock(t, '{LIB}/utils/open-url.js', {
    '@npmcli/promise-spawn': { open },
  })

  const openWithNpm = (...a) => openUrl(mock.npm, ...a)

  if (args) {
    await openWithNpm(...args)
  }

  mock.npm.finish()

  return {
    ...mock,
    openUrl: openWithNpm,
    openerUrl: () => openerUrl,
    openerOpts: () => openerOpts,
  }
}

const mockOpenUrlPrompt = async (t, {
  questionShouldResolve = true,
  openUrlPromptInterrupted = false,
  openerResult = null,
  isTTY = true,
  abort = false,
  url: openUrl = 'https://www.npmjs.com',
  ...config
}) => {
  const mock = await mockNpm(t, {
    globals: {
      'process.stdin.isTTY': isTTY,
      'process.stdout.isTTY': isTTY,
    },
    config,
  })

  let openerUrl = null
  let openerOpts = null

  const { openUrlPrompt } = tmock(t, '{LIB}/utils/open-url.js', {
    '@npmcli/promise-spawn': {
      open: async (url, options) => {
        openerUrl = url
        openerOpts = options
        if (openerResult) {
          throw openerResult
        }
      },
    },
    'node:readline/promises': {
      createInterface: () => {
        return Object.assign(new EventEmitter(), {
          question: async (p, { signal } = {}) => {
            if (questionShouldResolve !== true) {
              await new Promise((res, rej) => {
                if (signal) {
                  signal.addEventListener('abort', () => {
                    const err = new Error('abort')
                    err.name = 'AbortError'
                    rej(err)
                  })
                }
              })
            }
          },
          close: () => {},
          once: function (event, cb) {
            if (openUrlPromptInterrupted && event === 'SIGINT') {
              cb()
            }
          },
        })
      },
    },
  })

  let error
  const abortController = new AbortController()
  const args = [mock.npm, openUrl, 'npm home', 'prompt', { signal: abortController.signal }]
  if (abort) {
    mock.open = openUrlPrompt(...args)
  } else {
    await openUrlPrompt(...args).catch((er) => error = er)
  }

  mock.npm.finish()

  return {
    ...mock,
    openerUrl,
    openerOpts,
    OUTPUT: mock.joinedOutput(),
    error,
    abortController,
  }
}

t.test('openUrl in WSL environment - success case', (t) => {
  setup(t, (err, context) => {
    if (err) {
      t.error(err)
      return t.end()
    }
    return context.openUrl(context.npm, 'https://www.npmjs.com', 'npm home')
      .then(() => {
        t.fail('openUrl should have rejected')
        throw new Error('openurl should have rejected')
      })
      .catch(error => {
        t.match(error.message, /Simulated spawn error/, 'openUrl rejects with spawn error')
        t.ok(context.spawnCalled(), 'spawn was called for WSL env')
        t.equal(context.spawnArgs().command, 'powershell.exe', 'powershell.exe was called')
        t.same(context.spawnArgs().args, ['-Command', `Start-Process 'https://www.npmjs.com'`],
          'correct arg passed to powershell')
      })
      .finally(() => {
        t.end()
      })
  })
})

t.test('openUrl in WSL environment - erro case', (t) => {
  setup(t, (err, context) => {
    if (err) {
      t.error(err)
      return t.end()
    }
    tmock(t, '{LIB}/utils/open-url.js', {
      '@npmcli/promise-spawn': {
        open: async () => {
          throw new Error('Simulated spawn error')
        },
      },
    })
    return context.openUrl(context.npm, 'https://www.npmjs.com', 'npm home')
      .then(() => {
        t.fail('openUrl should have rejected')
        throw new Error('openUrl should have rejected')
      })
      .catch(error => {
        t.match(error.message, /Simulated spawn error/, 'openUrl rejects spawn error')
      })
      .finally(() => {
        t.end()
      })
  })
})

t.test('openUrl handles error when checking for WSL', async (t) => {
  let openCalled = false
  let spawnCalled = false
  const mockExec = async () => {
    throw new Error('Simulated exec error')
  }

  const mockOpen = async () => {
    openCalled = true
  }

  const mockSpawn = () => {
    spawnCalled = true
    return {
      on: () => {},
    }
  }

  const { openUrl } = tmock(t, '{LIB}/utils/open-url.js', {
    'node:util': {
      promisify: () => mockExec,
    },
    '@npmcli/promise-spawn': {
      open: mockOpen,
    },
    'node:child_process': {
      spawn: mockSpawn,
    },
  })

  const mock = await mockNpm(t, {
    config: {
      browser: true,
    },
  })

  await openUrl(mock.npm, 'https://www.npmjs.com', 'test')

  t.ok(openCalled, 'open was called (non wsl method)')
  t.notOk(spawnCalled, 'spawn was not called (wsl method)')
})

t.test('createOpener function', async t => {
  const openerSetup = async () => {
    const mock = await mockNpm(t)
    const title = 'Test'
    const prompt = 'Test prompt'
    const url = 'https://www.npmjs.com'
    const opts = { singal: null }

    const opener = createOpener(mock.npm, title, prompt)

    return { mock, title, prompt, url, opts, opener }
  }

  await t.test('calls openUrlPrompt with correct arguments', async t => {
    const { mock, title, prompt, url, opts, opener } = await openerSetup()

    // mock openUrlPropmt
    tmock(t, '{LIB}/utils/open-url.js', {
      '../../../../lib/utils/open-url.js': {
        openUrlPrompt: async (npm, u, t, p, o) => {
          t.equal(npm, mock.npm, 'npm instance matches')
          t.equal(u, url, 'URL matches')
          t.equal(t, title, 'Title matches')
          t.equal(p, prompt, 'Prompt matches')
          t.same(o, opts, 'Options match')
        },
      },
    })
    await opener(url, opts)
  })
})

t.test('open url prompt', async t => {
  t.test('does not open a url in non-interactive environments', async t => {
    const { openerUrl, openerOpts } = await mockOpenUrlPrompt(t, { isTTY: false })

    t.equal(openerUrl, null, 'did not open')
    t.same(openerOpts, null, 'did not open')
  })

  t.test('opens a url', async t => {
    const { OUTPUT, openerUrl, openerOpts } = await mockOpenUrlPrompt(t, { browser: true })

    t.equal(openerUrl, 'https://www.npmjs.com', 'opened the given url')
    t.same(openerOpts, { command: null }, 'passed command as null (the default)')
    t.matchSnapshot(OUTPUT)
  })

  t.test('opens a url with browser string', async t => {
    const { openerUrl, openerOpts } = await mockOpenUrlPrompt(t, { browser: 'firefox' })

    t.equal(openerUrl, 'https://www.npmjs.com', 'opened the given url')
    // FIXME: browser string is parsed as a boolean in config layer
    // this is a bug that should be fixed or the config should not allow it
    t.same(openerOpts, { command: null }, 'passed command as null (the default)')
  })

  t.test('prints json output', async t => {
    const { OUTPUT } = await mockOpenUrlPrompt(t, { json: true })

    t.matchSnapshot(OUTPUT)
  })

  t.test('returns error for non-https url', async t => {
    const { error, OUTPUT, openerUrl, openerOpts } = await mockOpenUrlPrompt(t, {
      url: 'ftp://www.npmjs.com',
    })

    t.match(error, /Invalid URL/, 'got the correct error')
    t.equal(openerUrl, null, 'did not open')
    t.same(openerOpts, null, 'did not open')
    t.same(OUTPUT, '', 'printed no output')
  })

  t.test('does not open url if canceled', async t => {
    const { openerUrl, openerOpts, open, abortController } = await mockOpenUrlPrompt(t, {
      questionShouldResolve: false,
      abort: true,
    })

    abortController.abort()

    await open

    t.equal(openerUrl, null, 'did not open')
    t.same(openerOpts, null, 'did not open')
  })

  t.test('returns error when opener errors', async t => {
    const { error, openerUrl } = await mockOpenUrlPrompt(t, {
      openerResult: Object.assign(new Error('Opener failed'), { code: 1 }),
    })

    t.match(error, /Opener failed/, 'got the correct error')
    t.equal(openerUrl, 'https://www.npmjs.com', 'did not open')
  })

  t.test('does not error when opener can not find command', async t => {
    const { OUTPUT, error, openerUrl } = await mockOpenUrlPrompt(t, {
      openerResult: Object.assign(new Error('Opener failed'), { code: 127 }),
    })

    t.notOk(error, 'Did not error')
    t.equal(openerUrl, 'https://www.npmjs.com', 'did not open')
    t.matchSnapshot(OUTPUT, 'Outputs extra Browser unavailable message and url')
  })

  t.test('throws "canceled" error on SIGINT', async t => {
    const { open } = await mockOpenUrlPrompt(t, {
      questionShouldResolve: false,
      openUrlPromptInterrupted: true,
      abort: true,
    })

    await t.rejects(open, /canceled/, 'message is canceled')
  })
})

t.test('open url', async t => {
  t.test('opens a url', async t => {
    const { openerUrl, openerOpts, joinedOutput } = await mockOpenUrl(t,
      ['https://www.npmjs.com', 'npm home'])
    t.equal(openerUrl(), 'https://www.npmjs.com', 'opened the given url')
    t.same(openerOpts(), { command: null }, 'passed command as null (the default)')
    t.same(joinedOutput(), '', 'printed no output')
  })

  t.test('returns error for non-https url', async t => {
    const { openUrl, openerUrl, openerOpts, joinedOutput } = await mockOpenUrl(t)
    await t.rejects(
      openUrl('ftp://www.npmjs.com', 'npm home'),
      /Invalid URL/,
      'got the correct error'
    )
    t.equal(openerUrl(), null, 'did not open')
    t.same(openerOpts(), null, 'did not open')
    t.same(joinedOutput(), '', 'printed no output')
  })

  t.test('returns error for file url', async t => {
    const { openUrl, openerUrl, openerOpts, joinedOutput } = await mockOpenUrl(t)
    await t.rejects(
      openUrl('file:///usr/local/bin/ls', 'npm home'),
      /Invalid URL/,
      'got the correct error'
    )
    t.equal(openerUrl(), null, 'did not open')
    t.same(openerOpts(), null, 'did not open')
    t.same(joinedOutput(), '', 'printed no output')
  })

  t.test('file url allowed if explicitly asked for', async t => {
    const { openerUrl, openerOpts, joinedOutput } = await mockOpenUrl(t,
      ['file:///man/page/npm-install', 'npm home', true])
    t.equal(openerUrl(), 'file:///man/page/npm-install', 'opened the given url')
    t.same(openerOpts(), { command: null }, 'passed command as null (the default)')
    t.same(joinedOutput(), '', 'printed no output')
  })

  t.test('returns error for non-parseable url', async t => {
    const { openUrl, openerUrl, openerOpts, joinedOutput } = await mockOpenUrl(t)
    await t.rejects(
      openUrl('git+ssh://user@host:repo.git', 'npm home'),
      /Invalid URL/,
      'got the correct error'
    )
    t.equal(openerUrl(), null, 'did not open')
    t.same(openerOpts(), null, 'did not open')
    t.same(joinedOutput(), '', 'printed no output')
  })

  t.test('encodes non-URL-safe characters in url provided', async t => {
    const { openerUrl, openerOpts, joinedOutput } = await mockOpenUrl(t,
      ['https://www.npmjs.com/|cat', 'npm home'])
    t.equal(openerUrl(), 'https://www.npmjs.com/%7Ccat', 'opened the encoded url')
    t.same(openerOpts(), { command: null }, 'passed command as null (the default)')
    t.same(joinedOutput(), '', 'printed no output')
  })

  t.test('opens a url with the given browser', async t => {
    const { openerUrl, openerOpts, joinedOutput } = await mockOpenUrl(t,
      ['https://www.npmjs.com', 'npm home'], { browser: 'chrome' })
    t.equal(openerUrl(), 'https://www.npmjs.com', 'opened the given url')
    // FIXME: browser string is parsed as a boolean in config layer
    // this is a bug that should be fixed or the config should not allow it
    t.same(openerOpts(), { command: null }, 'passed the given browser as command')
    t.same(joinedOutput(), '', 'printed no output')
  })

  t.test('prints where to go when browser is disabled', async t => {
    const { openerUrl, openerOpts, joinedOutput } = await mockOpenUrl(t,
      ['https://www.npmjs.com', 'npm home'], { browser: false })
    t.equal(openerUrl(), null, 'did not open')
    t.same(openerOpts(), null, 'did not open')
    t.matchSnapshot(joinedOutput(), 'printed expected message')
  })

  t.test('prints where to go when browser is disabled and json is enabled', async t => {
    const { openerUrl, openerOpts, joinedOutput } = await mockOpenUrl(t,
      ['https://www.npmjs.com', 'npm home'], { browser: false, json: true })
    t.equal(openerUrl(), null, 'did not open')
    t.same(openerOpts(), null, 'did not open')
    t.matchSnapshot(joinedOutput(), 'printed expected message')
  })

  t.test('prints where to go when given browser does not exist', async t => {
    const { openerUrl, openerOpts, joinedOutput } = await mockOpenUrl(t,
      ['https://www.npmjs.com', 'npm home'],
      {
        openerResult: Object.assign(new Error('failed'), { code: 127 }),
      }
    )

    t.equal(openerUrl(), 'https://www.npmjs.com', 'tried to open the correct url')
    t.same(openerOpts(), { command: null }, 'tried to use the correct browser')
    t.matchSnapshot(joinedOutput(), 'printed expected message')
  })

  t.test('handles unknown opener error', async t => {
    const { openUrl } = await mockOpenUrl(t, null, {
      browser: 'firefox',
      openerResult: Object.assign(new Error('failed'), { code: 'ENOBRIAN' }),
    })

    await t.rejects(openUrl('https://www.npmjs.com', 'npm home'), 'failed', 'got the correct error')
  })
})
