'use strict'
const path = require('path')
const fs = require('fs')
const test = require('tap').test
const Tacks = require('tacks')
const File = Tacks.File
const Dir = Tacks.Dir
const common = require('../common-tap.js')

const basedir = path.join(__dirname, path.basename(__filename, '.js'))
const testdir = path.join(basedir, 'testdir')
const cachedir = path.join(basedir, 'cache')
const globaldir = path.join(basedir, 'global')
const tmpdir = path.join(basedir, 'tmp')

const conf = {
  cwd: testdir,
  env: common.newEnv().extend({
    npm_config_cache: cachedir,
    npm_config_tmp: tmpdir,
    npm_config_prefix: globaldir,
    npm_config_registry: common.registry,
    npm_config_loglevel: 'warn'
  })
}

const fixture = new Tacks(Dir({
  cache: Dir(),
  global: Dir(),
  tmp: Dir(),
  testdir: Dir({
    package: Dir({
      'package.json': File({
        name: 'package',
        version: '1.0.0',
        dependencies: {
          'base-dep': '../packages/base-dep-1.0.0.tgz',
          'plugin-dep': '../packages/plugin-dep-1.0.0.tgz'
        }
      })
    }),
    'package.json': File({
      version: '1.0.0',
      dependencies: {
        package: 'file:./package',
        'base-dep': './packages/base-dep-2.0.0.tgz'
      }
    }),
    // file: dependencies do not work as they are symlinked and behave
    // differently. Instead installation from tgz files is used.
    packages: Dir({
      'base-dep-1.0.0.tgz': File(Buffer.from(
        '1f8b080000000000000a2b484cce4e4c4fd52f80d07a59c5f9790c540606' +
        '06066666660ad8c4c1c0d45c81c1d8d4ccc0d0d0ccccc0448101c8303505' +
        'd1d4760836505a5c925804740aa5e640bca200a78708a8e6525050ca4bcc' +
        '4d55b252504a4a2c4ed54d492d50d2018996a5161567e6e781240cf50cf4' +
        '0c94b86ab906dab9a360148c8251300aa80400a44d97d100080000',
        'hex'
      )),
      'base-dep-2.0.0.tgz': File(Buffer.from(
        '1f8b080000000000000a2b484cce4e4c4fd52f80d07a59c5f9790c540606' +
        '06066666660ad8c4c1c0d45c81c1d8d4ccc0d0d0ccccc0448101c8303505' +
        'd1d4760836505a5c925804740aa5e640bca200a78708a8e6525050ca4bcc' +
        '4d55b252504a4a2c4ed54d492d50d2018996a5161567e6e781248cf40cf4' +
        '0c94b86ab906dab9a360148c8251300aa80400aebbeeba00080000',
        'hex'
      )),
      'plugin-dep-1.0.0.tgz': File(Buffer.from(
        '1f8b080000000000000aed8f3d0e83300c8599394594b904476d3274e622' +
        '295888fe8488408756dcbd0e513bb115a9aa946f79ce7bb1653b535f4c8b' +
        'a58b2acebeb7d9c60080d69aadf90119b2bdd220a98203cba8504a916ebd' +
        'c81a931fcd40ab7c3b27dec23efa273c73c6b83537e447c6dd756a3b5b34' +
        'e8f82ef8771c7cd7db10490102a2eb10870a1dda066ddda1a7384ca1e464' +
        '3c2eddd42044f97e164bb318db07a77f733ee7bfbe3a914824122f4e04e9' +
        '2e00080000',
        'hex'
      ))
    })
  })
}))

function setup () {
  cleanup()
  fixture.create(basedir)
}

function cleanup () {
  fixture.remove(basedir)
}

test('setup', t => {
  setup()
  return common.fakeRegistry.listen()
})

test('example', t => {
  return common.npm(['install'], conf).then(([code, stdout, stderr]) => {
    t.is(code, 0, 'command ran ok')
    t.comment(stdout.trim())
    t.comment(stderr.trim())
    t.ok(fs.existsSync(path.join(testdir, 'node_modules')), 'did install')
    var packageLock = JSON.parse(fs.readFileSync(path.join(testdir, 'package-lock.json'), 'utf8'))
    t.similar(packageLock, {
      dependencies: {
        'base-dep': {
          version: 'file:packages/base-dep-2.0.0.tgz'
        },
        'package': {
          version: 'file:package',
          dependencies: {
            'base-dep': {
              version: 'file:packages/base-dep-1.0.0.tgz'
            },
            // plugin-dep must not placed on top-level
            'plugin-dep': {
              version: 'file:packages/plugin-dep-1.0.0.tgz'
            }
          }
        }
      }
    }, 'locks dependencies as unhoisted')
    t.similar(Object.keys(packageLock.dependencies), ['base-dep', 'package'], 'has correct packages on top-level')
  })
})

test('cleanup', t => {
  common.fakeRegistry.close()
  cleanup()
  t.done()
})
