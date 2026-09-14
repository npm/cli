const t = require('tap')
const { resolve } = require('node:path')
const tspawk = require('../../fixtures/tspawk')
const { load: loadMockNpm } = require('../../fixtures/mock-npm')

const spawk = tspawk(t)

const isCmdRe = /(?:^|\\)cmd(?:\.exe)?$/i

t.test('should run test script from package.json', async t => {
  const { npm } = await loadMockNpm(t, {
    prefixDir: {
      'package.json': JSON.stringify({
        name: 'x',
        version: '1.2.3',
        scripts: {
          test: 'node ./test-test.js',
        },
      }),
    },
    config: {
      loglevel: 'silent',
      'script-shell': process.platform === 'win32' ? process.env.COMSPEC : 'sh',
    },
  })

  const scriptShell = npm.config.get('script-shell')
  const scriptArgs = isCmdRe.test(scriptShell)
    ? ['/d', '/s', '/c', 'node ./test-test.js foo']
    : ['-c', 'node ./test-test.js foo']
  const script = spawk.spawn(scriptShell, scriptArgs)
  await npm.exec('test', ['foo'])
  t.ok(script.called, 'script ran')
})

t.test('should run test script with a shell relative to the workspace root', async t => {
  const isWindows = process.platform === 'win32'
  const mockShell = isWindows ? 'mock-shell.cmd' : 'mock-shell.sh'
  const mockShellContent = isWindows
    ? '@echo off\necho mock shell output\n'
    : '#!/bin/sh\necho mock shell output\n'

  const { npm } = await loadMockNpm(t, {
    prefixDir: {
      'package.json': JSON.stringify({
        name: 'x',
        version: '1.2.3',
        workspaces: ['packages/*'],
      }),
      packages: {
        app: {
          'package.json': JSON.stringify({
            name: 'app',
            version: '1.2.3',
            scripts: {
              test: 'node ./test-test.js',
            },
          }),
        },
      },
      '.npmrc': `script-shell=./${mockShell}\n`,
      [mockShell]: mockShellContent,
    },
    config: {
      loglevel: 'silent',
      workspace: 'app',
    },
  })

  const scriptShell = npm.config.get('script-shell')
  t.equal(scriptShell, resolve(npm.prefix, mockShell))
  const scriptArgs = isCmdRe.test(scriptShell)
    ? ['/d', '/s', '/c', 'node ./test-test.js foo']
    : ['-c', 'node ./test-test.js foo']
  const script = spawk.spawn(scriptShell, scriptArgs)
    .stdout('mock shell output')
  await npm.exec('test', ['foo'])
  t.ok(script.called, 'script ran with the workspace-root shell')
})
