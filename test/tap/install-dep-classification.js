'use strict'
var path = require('path')
var fs = require('graceful-fs')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')
var test = require('tap').test
var common = require('../common-tap.js')

var base = path.join(__dirname, path.basename(__filename, '.js'))
var optionalDir = path.join(base, 'optional')
var optionalJson = {
  name: 'optional',
  version: '1.0.0',
  optionalDependencies: {
    'example': '../example-1.0.0.tgz'
  }
}
var devDir = path.join(base, 'dev')
var devJson = {
  name: 'dev',
  version: '1.0.0',
  devDependencies: {
    'example': '../example-1.0.0.tgz'
  }
}

function setup () {
  cleanup()
  mkdirp.sync(optionalDir)
  fs.writeFileSync(path.join(optionalDir, 'package.json'), JSON.stringify(optionalJson))
  mkdirp.sync(devDir)
  fs.writeFileSync(path.join(devDir, 'package.json'), JSON.stringify(devJson))

  fs.writeFileSync(path.join(base, 'example-1.0.0.tgz'), Buffer.from(
    '1f8b0800000000000003ed8fc10ac2300c8677f62946cedaa5d8f5e0db64' +
    '5b1853d795758a38f6ee4607e261370722f4bbfce5cb4f493c9527aa39f3' +
    '73aa63e85cb23288688d4997fc136d304df6b945adad45e9c923375a72ed' +
    '4596b884817a59e5db7fe65bd277fe0923386a190ec0376afd99610b57ee' +
    '43d339715aa14231157b7615bbb2e100871148664a65b47b15d450dfa554' +
    'ccb2f890d3b4f9f57d9148241259e60112d8208a00080000',
    'hex'
  ))
  fs.writeFileSync(path.join(base, 'a-1.0.0.tgz'), Buffer.from(
    '1f8b0800000000000003edcfc10e82300c0660ce3ec5d2b38e4eb71d789b' +
    '010d41e358187890f0ee56493c71319218937d977feb9aa50daebab886f2' +
    'b0a43cc7ce671b4344abb558ab3f2934223b198b4a598bdcc707a38f9c5b' +
    '0fb2668c83eb79946fff597611effc131378772528c0c11e6ed4c7b6f37c' +
    '53122572a5a640be265fb514a198a0e43729f3f2f06a9043738779defd7a' +
    '89244992e4630fd69e456800080000',
    'hex'
  ))
  fs.writeFileSync(path.join(base, 'b-1.0.0.tgz'), Buffer.from(
    '1f8b08000000000000032b484cce4e4c4fd52f80d07a59c5f9790c540606' +
    '06066626260ad8c4c1c0d85c81c1d8d4ccc0d0d0cccc00a80ec830353103' +
    'd2d4760836505a5c925804740aa5e640bca200a78708a856ca4bcc4d55b2' +
    '524a52d2512a4b2d2acecccf03f20cf50cf40c946ab906da79a360148c82' +
    '51300a680400106986b400080000',
    'hex'
  ))
}

function cleanup () {
  rimraf.sync(base)
}

test('setup', function (t) {
  setup()
  t.end()
})

test('optional dependency identification', function (t) {
  common.npm(
    ['install', '--no-optional'],
    {cwd: optionalDir},
    function (er, code, stdout, stderr) {
      t.is(code, 0, 'no error code')
      t.is(stderr, '', 'no error output')
      t.notOk(fs.existsSync(path.join(optionalDir, 'node_modules')), 'did not install anything')
      t.end()
    }
  )
})

test('development dependency identification', function (t) {
  common.npm(
    ['install', '--only=prod'],
    {cwd: devDir},
    function (er, code, stdout, stderr) {
      t.is(code, 0, 'no error code')
      t.is(stderr, '', 'no error output')
      t.notOk(fs.existsSync(path.join(devDir, 'node_modules')), 'did not install anything')
      t.end()
    }
  )
})

test('cleanup', function (t) {
  cleanup()
  t.end()
})
