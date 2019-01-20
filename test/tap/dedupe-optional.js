'use strict'
const fs = require('fs')
const path = require('path')
const test = require('tap').test
const mr = require('npm-registry-mock')
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
  env: Object.assign({}, process.env, {
    npm_config_cache: cachedir,
    npm_config_tmp: tmpdir,
    npm_config_prefix: globaldir,
    npm_config_registry: common.registry,
    npm_config_loglevel: 'warn'
  })
}

let server
const fixture = new Tacks(Dir({
  cache: Dir(),
  global: Dir(),
  tmp: Dir(),
  testdir: Dir({
    'package-lock.json': File({
      name: 'dedupe-optional',
      version: '1.0.0',
      lockfileVersion: 1,
      requires: true,
      dependencies: {
        async: {
          version: '0.9.2',
          resolved: 'https://registry.npmjs.org/async/-/async-0.9.2.tgz',
          integrity: 'sha1-rqdNXmHB+JlhO/ZL2mbUx48v0X0=',
          optional: true
        }
      }
    }),
    'package.json': File({
      name: 'dedupe-optional',
      version: '1.0.0',
      optionalDependencies: {
        async: '*'
      }
    })
  })
}))

test('setup', function (t) {
  setup()
  mr({port: common.port, throwOnUnmatched: true}, function (err, s) {
    if (err) throw err
    server = s
    t.done()
  })
})

test('dedupe keeps uninstalled packages in package-lock.json', function (t) {
  t.comment('test for https://npm.community/t/3807')
  common.npm(['dedupe'], conf, function (err, code) {
    if (err) throw err
    t.is(code, 0, 'command ran ok')

    const shrinkwrap = JSON.parse(
      fs.readFileSync(
        path.join(testdir, 'package-lock.json'), 'utf8'))

    t.ok(shrinkwrap.dependencies, 'npm dedupe kept packages')
    t.done()
  })
})

test('cleanup', function (t) {
  server.close()
  cleanup()
  t.done()
})

function cleanup () {
  fixture.remove(basedir)
}

function setup () {
  cleanup()
  fixture.create(basedir)
}
