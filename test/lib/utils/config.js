const t = require('tap')
const requireInject = require('require-inject')
Object.defineProperty(process, 'umask', {
  value: () => 0o26,
  writable: true,
  configurable: true,
  enumerable: true
})

process.env.ComSpec = 'cmd.exe'
process.env.SHELL = '/usr/local/bin/bash'
process.env.LANG = 'UTF-8'
delete process.env.LC_ALL
delete process.env.LC_CTYPE
process.env.EDITOR = 'vim'
process.env.VISUAL = 'mate'

const networkInterfacesThrow = () => {
  throw new Error('no network interfaces for some reason')
}
const networkInterfaces = () => ({
  'eth420': [{ address: '127.0.0.1' }],
  'eth69': [{ address: 'no place like home' }]
})
const tmpdir = () => '/tmp'
const os = { networkInterfaces, tmpdir }

t.test('working network interfaces, not windows', t => {
  const config = requireInject('../../../lib/utils/config.js', {
    os,
    '@npmcli/ci-detect': () => false,
    '../../../lib/utils/is-windows.js': false
  })
  t.matchSnapshot(config)
  t.end()
})

t.test('no working network interfaces, on windows', t => {
  const config = requireInject('../../../lib/utils/config.js', {
    os: { tmpdir, networkInterfaces: networkInterfacesThrow },
    '@npmcli/ci-detect': () => false,
    '../../../lib/utils/is-windows.js': true
  })
  t.matchSnapshot(config)
  t.end()
})

t.test('no process.umask() method', t => {
  Object.defineProperty(process, 'umask', {
    value: null,
    writable: true,
    configurable: true,
    enumerable: true
  })
  t.teardown(() => {
    Object.defineProperty(process, 'umask', {
      value: () => 0o26,
      writable: true,
      configurable: true,
      enumerable: true
    })
  })
  const config = requireInject('../../../lib/utils/config.js', {
    os: { tmpdir, networkInterfaces: networkInterfacesThrow },
    '@npmcli/ci-detect': () => false,
    '../../../lib/utils/is-windows.js': true
  })
  t.equal(config.defaults.umask, 0o22)
  t.matchSnapshot(config)
  t.end()
})

t.test('no comspec on windows', t => {
  delete process.env.ComSpec
  const config = requireInject('../../../lib/utils/config.js', {
    os: { tmpdir, networkInterfaces: networkInterfacesThrow },
    '@npmcli/ci-detect': () => false,
    '../../../lib/utils/is-windows.js': true
  })
  t.equal(config.defaults.shell, 'cmd')
  t.end()
})

t.test('no shell on posix', t => {
  delete process.env.SHELL
  const config = requireInject('../../../lib/utils/config.js', {
    os,
    '@npmcli/ci-detect': () => false,
    '../../../lib/utils/is-windows.js': false
  })
  t.equal(config.defaults.shell, 'bash')
  t.end()
})

t.test('no EDITOR env, use VISUAL', t => {
  delete process.env.EDITOR
  const config = requireInject('../../../lib/utils/config.js', {
    os,
    '@npmcli/ci-detect': () => false,
    '../../../lib/utils/is-windows.js': false
  })
  t.equal(config.defaults.editor, 'mate')
  t.end()
})

t.test('no VISUAL, use system default, not windows', t => {
  delete process.env.VISUAL
  const config = requireInject('../../../lib/utils/config.js', {
    os,
    '@npmcli/ci-detect': () => false,
    '../../../lib/utils/is-windows.js': false
  })
  t.equal(config.defaults.editor, 'vi')
  t.end()
})

t.test('no VISUAL, use system default, not windows', t => {
  delete process.env.VISUAL
  const config = requireInject('../../../lib/utils/config.js', {
    os,
    '@npmcli/ci-detect': () => false,
    '../../../lib/utils/is-windows.js': true
  })
  t.equal(config.defaults.editor, 'notepad.exe')
  t.end()
})
