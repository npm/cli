const t = require('tap')
const { relative, join } = require('path')
const { load: loadMockNpm } = require('../../fixtures/mock-npm')
const mockGlobals = require('../../fixtures/mock-globals')

const mockBin = async (t, { args = [], config = {} } = {}) => {
  const { npm, outputs, ...rest } = await loadMockNpm(t, {
    config,
  })
  const cmd = await npm.cmd('bin')
  await npm.exec('bin', args)

  return {
    npm,
    cmd,
    bin: outputs[0][0],
    ...rest,
  }
}

t.test('bin', async t => {
  const { cmd, bin, prefix, outputErrors } = await mockBin(t, {
    config: { global: false },
  })

  t.match(cmd.usage, 'bin', 'usage has command name in it')
  t.equal(relative(prefix, bin), join('node_modules/.bin'), 'prints the correct directory')
  t.strictSame(outputErrors, [])
})

t.test('bin -g', async t => {
  mockGlobals(t, { 'process.platform': 'posix' })
  const { globalPrefix, bin, outputErrors } = await mockBin(t, {
    config: { global: true },
  })

  t.equal(relative(globalPrefix, bin), 'bin', 'prints the correct directory')
  t.strictSame(outputErrors, [])
})

t.test('bin -g win32', async t => {
  mockGlobals(t, { 'process.platform': 'win32' })
  const { globalPrefix, bin, outputErrors } = await mockBin(t, {
    config: { global: true },
  })

  t.equal(relative(globalPrefix, bin), '', 'prints the correct directory')
  t.strictSame(outputErrors, [])
})

t.test('bin -g (not in path)', async t => {
  const { logs } = await mockBin(t, {
    config: { global: true },
    globals: {
      'process.env.PATH': 'emptypath',
    },
  })

  t.strictSame(logs.error[0], ['bin', '(not in PATH env variable)'])
})
