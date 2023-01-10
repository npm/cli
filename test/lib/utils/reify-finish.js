const t = require('tap')
const fs = require('fs')
const { join } = require('path')
const { cleanNewlines } = require('../../fixtures/clean-snapshot')
const tmock = require('../../fixtures/tmock')
const mockNpm = require('../../fixtures/mock-npm')

const mockReififyFinish = async (t, { actualTree = {}, ...config }) => {
  const mock = await mockNpm(t, {
    npm: ({ other }) => ({
      npmRoot: other,
    }),
    otherDirs: {
      npmrc: `key=value`,
    },
    config,
  })

  const reifyFinish = tmock(t, '{LIB}/utils/reify-finish.js', {
    '{LIB}/utils/reify-output.js': () => {},
  })

  await reifyFinish(mock.npm, {
    options: { global: config.global },
    actualTree: typeof actualTree === 'function' ? actualTree(mock) : actualTree,
  })

  return mock
}

t.test('ok by default', async t => {
  const mock = await mockReififyFinish(t, {
    global: false,
  })
  t.strictSame(mock.npm.config.data.get('builtin').data, {})
})

t.test('should not write if no global npm module', async t => {
  const mock = await mockReififyFinish(t, {
    global: true,
    actualTree: {
      inventory: new Map(),
    },
  })
  t.strictSame(mock.npm.config.data.get('builtin').data, {})
})

t.test('should not write if builtin conf had load error', async t => {
  const mock = await mockReififyFinish(t, {
    global: true,
    actualTree: {
      inventory: new Map([['node_modules/npm', {}]]),
    },
  })
  t.strictSame(mock.npm.config.data.get('builtin').data, {})
})

t.test('should write if everything above passes', async t => {
  const mock = await mockReififyFinish(t, {
    global: true,
    actualTree: ({ other }) => ({
      inventory: new Map([['node_modules/npm', { path: join(other, 'new-npm') }]]),
    }),
  })

  t.strictSame(mock.npm.config.data.get('builtin').data, {})

  // windowwwwwwssss!!!!!
  const oldFile = cleanNewlines(fs.readFileSync(join(mock.other, 'npmrc'), 'utf8'))
  const newFile = cleanNewlines(fs.readFileSync(join(mock.other, 'new-npm/npmrc'), 'utf8'))
  t.equal(oldFile, newFile)
  t.matchSnapshot(newFile, 'written config')
})
