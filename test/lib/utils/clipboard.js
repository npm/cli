const t = require('tap')
const tmock = require('../../fixtures/tmock')

const makeSpawn = (results = {}) => {
  const spawned = []
  const spawn = (cmd, args) => {
    const EventEmitter = require('node:events')
    const child = new EventEmitter()
    child.stdin = {
      write: () => {},
      end: () => {
        const result = results[cmd]
        if (result instanceof Error) {
          child.emit('error', result)
        } else {
          child.emit('close', result ?? 0)
        }
      },
    }
    spawned.push({ cmd, args })
    return child
  }
  return { spawn, spawned }
}

const mockClipboard = (t, { platform, env, spawnResults } = {}) => {
  const { spawn, spawned } = makeSpawn(spawnResults)
  const { copyToClipboard } = tmock(t, '{LIB}/utils/clipboard.js', {
    'node:child_process': { spawn },
    'node:process': { platform, env: env ?? {} },
  })
  return { copyToClipboard, spawned }
}

t.test('clipboard', async t => {
  t.test('macOS uses pbcopy', async t => {
    const { copyToClipboard, spawned } = mockClipboard(t, { platform: 'darwin' })
    await copyToClipboard('https://example.com')
    t.equal(spawned[0].cmd, 'pbcopy')
    t.same(spawned[0].args, [])
  })

  t.test('Windows uses clip', async t => {
    const { copyToClipboard, spawned } = mockClipboard(t, { platform: 'win32' })
    await copyToClipboard('https://example.com')
    t.equal(spawned[0].cmd, 'clip')
    t.same(spawned[0].args, [])
  })

  t.test('Linux uses wl-copy when WAYLAND_DISPLAY is set', async t => {
    const { copyToClipboard, spawned } = mockClipboard(t, {
      platform: 'linux',
      env: { WAYLAND_DISPLAY: ':0' },
    })
    await copyToClipboard('hello')
    t.equal(spawned[0].cmd, 'wl-copy')
    t.same(spawned[0].args, [])
  })

  t.test('Linux uses xclip when DISPLAY is set', async t => {
    const { copyToClipboard, spawned } = mockClipboard(t, {
      platform: 'linux',
      env: { DISPLAY: ':0' },
    })
    await copyToClipboard('hello')
    t.equal(spawned[0].cmd, 'xclip')
    t.same(spawned[0].args, ['-selection', 'clipboard'])
  })

  t.test('Linux prefers wl-copy over xclip when both env vars are set', async t => {
    const { copyToClipboard, spawned } = mockClipboard(t, {
      platform: 'linux',
      env: { WAYLAND_DISPLAY: ':0', DISPLAY: ':0' },
    })
    await copyToClipboard('hello')
    t.equal(spawned[0].cmd, 'wl-copy', 'tries wl-copy first')
  })

  t.test('Linux falls back to xsel if xclip fails', async t => {
    const { copyToClipboard, spawned } = mockClipboard(t, {
      platform: 'linux',
      env: { DISPLAY: ':0' },
      spawnResults: { xclip: new Error('not found') },
    })
    await copyToClipboard('hello')
    t.equal(spawned[0].cmd, 'xclip', 'tried xclip first')
    t.equal(spawned[1].cmd, 'xsel', 'fell back to xsel')
    t.same(spawned[1].args, ['--clipboard', '--input'])
  })

  t.test('Linux falls back to all tools when no env vars set', async t => {
    const { copyToClipboard, spawned } = mockClipboard(t, {
      platform: 'linux',
      env: {},
    })
    await copyToClipboard('hello')
    t.equal(spawned[0].cmd, 'wl-copy', 'tried wl-copy as first fallback')
  })

  t.test('throws when no clipboard tool is available', async t => {
    const { copyToClipboard } = mockClipboard(t, {
      platform: 'linux',
      env: {},
      spawnResults: {
        'wl-copy': new Error('not found'),
        xclip: new Error('not found'),
        xsel: new Error('not found'),
      },
    })
    await t.rejects(copyToClipboard('hello'), /No clipboard tool available/, 'throws appropriate error')
  })
})
