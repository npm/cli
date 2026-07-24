const t = require('tap')
const fs = require('node:fs/promises')
const { join } = require('node:path')
const { cleanNewlines } = require('../../fixtures/clean-snapshot')
const tmock = require('../../fixtures/tmock')
const mockNpm = require('../../fixtures/mock-npm')

// windowwwwwwssss!!!!!
const readRc = async (dir) => {
  const res = await fs.readFile(join(dir, 'npmrc'), 'utf8').catch(() => '')
  return cleanNewlines(res).trim()
}

const mockReififyFinish = async (t, {
  actualTree = {},
  otherDirs = {},
  diff,
  unreviewedNodes,
  captureReifyOutput,
  ...config
} = {}) => {
  const mock = await mockNpm(t, {
    npm: ({ other }) => ({
      npmRoot: other,
    }),
    otherDirs: {
      npmrc: `key=value`,
      ...otherDirs,
    },
    config,
  })

  const mocks = {
    '{LIB}/utils/reify-output.js': captureReifyOutput || (() => {}),
  }
  if (unreviewedNodes !== undefined) {
    mocks['{LIB}/utils/check-allow-scripts.js'] = async () =>
      unreviewedNodes.map((node) => ({ node, scripts: { install: 'x' } }))
  }
  const reifyFinish = tmock(t, '{LIB}/utils/reify-finish.js', mocks)

  await reifyFinish(mock.npm, {
    options: { global: mock.npm.global },
    diff,
    actualTree: typeof actualTree === 'function' ? actualTree(mock) : actualTree,
  })

  const builtinRc = {
    raw: await readRc(mock.other),
    data: Object.fromEntries(Object.entries(mock.npm.config.data.get('builtin').data)),
  }

  return {
    builtinRc,
    ...mock,
  }
}

t.test('ok by default', async t => {
  const mock = await mockReififyFinish(t, {
    global: false,
  })
  t.same(mock.builtinRc.raw, 'key=value')
  t.strictSame(mock.builtinRc.data, { key: 'value' })
})

t.test('should not write if no global npm module', async t => {
  const mock = await mockReififyFinish(t, {
    global: true,
    actualTree: {
      inventory: new Map(),
    },
  })
  t.same(mock.builtinRc.raw, 'key=value')
  t.strictSame(mock.builtinRc.data, { key: 'value' })
})

t.test('should not write if builtin conf had load error', async t => {
  const mock = await mockReififyFinish(t, {
    global: true,
    otherDirs: {
      npmrc: {},
    },
    actualTree: {
      inventory: new Map([['node_modules/npm', {}]]),
    },
  })
  t.same(mock.builtinRc.raw, '')
  t.strictSame(mock.builtinRc.data, {})
})

t.test('should write if everything above passes', async t => {
  const mock = await mockReififyFinish(t, {
    global: true,
    otherDirs: {
      'new-npm': {},
    },
    actualTree: ({ other }) => ({
      inventory: new Map([['node_modules/npm', { path: join(other, 'new-npm') }]]),
    }),
  })

  t.same(mock.builtinRc.raw, 'key=value')
  t.strictSame(mock.builtinRc.data, { key: 'value' })

  const newFile = await readRc(join(mock.other, 'new-npm'))
  t.equal(mock.builtinRc.raw, newFile)
})

t.test('unreviewedScripts filtered to nodes touched by this reify (npm/cli#9797)', async t => {
  const captured = []
  const touched = { location: 'node_modules/touched', name: 'touched' }
  const untouched = { location: 'node_modules/untouched', name: 'untouched' }
  await mockReififyFinish(t, {
    global: false,
    unreviewedNodes: [touched, untouched],
    diff: {
      children: [
        { action: 'ADD', ideal: touched, children: [] },
        { action: 'REMOVE', actual: { location: 'node_modules/removed' }, children: [] },
      ],
    },
    captureReifyOutput: (_npm, _arb, extras) => captured.push(extras),
  })
  t.equal(captured.length, 1)
  t.equal(captured[0].unreviewedScripts.length, 1,
    'untouched package is filtered out; only touched package is warned about')
  t.equal(captured[0].unreviewedScripts[0].node.name, 'touched')
})

t.test('unreviewedScripts pass through when there is no diff (defensive)', async t => {
  const captured = []
  const a = { location: 'node_modules/a', name: 'a' }
  await mockReififyFinish(t, {
    global: false,
    unreviewedNodes: [a],
    captureReifyOutput: (_npm, _arb, extras) => captured.push(extras),
  })
  t.equal(captured[0].unreviewedScripts.length, 1)
})

t.test('diff walker handles CHANGE, nested children, and nullish diff entries', async t => {
  const captured = []
  const changed = { location: 'node_modules/changed', name: 'changed' }
  const nested = { location: 'node_modules/nested', name: 'nested' }
  const untouched = { location: 'node_modules/untouched', name: 'untouched' }
  await mockReififyFinish(t, {
    global: false,
    unreviewedNodes: [changed, nested, untouched],
    diff: {
      children: [
        null,
        { action: 'CHANGE', ideal: changed, children: [] },
        {
          action: 'ADD',
          ideal: { location: null },
          children: [
            { action: 'ADD', ideal: nested },
          ],
        },
      ],
    },
    captureReifyOutput: (_npm, _arb, extras) => captured.push(extras),
  })
  const names = captured[0].unreviewedScripts.map(u => u.node.name).sort()
  t.strictSame(names, ['changed', 'nested'])
})
