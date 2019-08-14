var test = require('tap').test
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')
var fs = require('fs')
var path = require('path')
var fixtures = path.resolve(__dirname, 'fixtures')

const matchSnapshot = (t, found, name) =>
  t.matchSnapshot(found.replace(/\r/g, '\\r'), name)

var cmdShim = require('../')

test('no shebang', function (t) {
  var from = path.resolve(fixtures, 'from.exe')
  var to = path.resolve(fixtures, 'exe.shim')
  cmdShim(from, to, function(er) {
    if (er)
      throw er
    matchSnapshot(t, fs.readFileSync(to, 'utf8'), 'shell')
    matchSnapshot(t, fs.readFileSync(to + '.cmd', 'utf8'), 'cmd')
    matchSnapshot(t, fs.readFileSync(to + '.ps1', 'utf8'), 'ps1')
    t.end()
  })
})

test('if exists (it does exist)', function (t) {
  var from = path.resolve(fixtures, 'from.exe')
  var to = path.resolve(fixtures, 'exe.shim')
  cmdShim.ifExists(from, to, function(er) {
    if (er)
      throw er
    matchSnapshot(t, fs.readFileSync(to, 'utf8'), 'shell')
    matchSnapshot(t, fs.readFileSync(to + '.cmd', 'utf8'), 'cmd')
    matchSnapshot(t, fs.readFileSync(to + '.ps1', 'utf8'), 'ps1')
    t.end()
  })
})

test('if exists (it does not exist)', function (t) {
  var from = path.resolve(fixtures, 'argle bargle we like to sparkle')
  var to = path.resolve(fixtures, 'argle-bargle-shim')
  cmdShim.ifExists(from, to, function(er) {
    if (er)
      throw er
    t.throws(() => fs.statSync(to))
    t.throws(() => fs.statSync(to + '.cmd'))
    t.throws(() => fs.statSync(to + '.ps1'))
    t.end()
  })
})

test('fails if from doesnt exist', t => {
  var from = path.resolve(fixtures, 'argle bargle we like to sparkle')
  var to = path.resolve(fixtures, 'argle-bargle-shim')
  cmdShim(from, to, function(er) {
    t.match(er, { code: 'ENOENT' })
    t.end()
  })
})

test('fails if mkdir fails', t => {
  var from = path.resolve(fixtures, 'from.env')
  var to = path.resolve(fixtures, 'from.env/a/b/c')
  cmdShim(from, to, er => {
    t.match(er, { code: 'ENOTDIR' })
    t.end()
  })
})

test('fails if to is a dir', t => {
  var from = path.resolve(fixtures, 'from.env')
  var to = path.resolve(fixtures)
  cmdShim(from, to, er => {
    t.match(er, { code: 'EISDIR' })
    rimraf.sync(to + '.cmd')
    rimraf.sync(to + '.ps1')
    t.end()
  })
})

test('just proceed if reading fails', t => {
  var from = fixtures
  var to = path.resolve(fixtures, 'env.shim')
  cmdShim(from, to, er => {
    if (er)
      throw er

    matchSnapshot(t, fs.readFileSync(to, 'utf8'), 'shell')
    matchSnapshot(t, fs.readFileSync(to + '.cmd', 'utf8'), 'cmd')
    matchSnapshot(t, fs.readFileSync(to + '.ps1', 'utf8'), 'ps1')
    t.end()
  })
})

test('env shebang', function (t) {
  var from = path.resolve(fixtures, 'from.env')
  var to = path.resolve(fixtures, 'env.shim')
  cmdShim(from, to, function(er) {
    if (er)
      throw er

    matchSnapshot(t, fs.readFileSync(to, 'utf8'), 'shell')
    matchSnapshot(t, fs.readFileSync(to + '.cmd', 'utf8'), 'cmd')
    matchSnapshot(t, fs.readFileSync(to + '.ps1', 'utf8'), 'ps1')
    t.end()
  })
})

test('env shebang with args', function (t) {
  var from = path.resolve(fixtures, 'from.env.args')
  var to = path.resolve(fixtures, 'env.args.shim')
  cmdShim(from, to, function(er) {
    if (er)
      throw er

    matchSnapshot(t, fs.readFileSync(to, 'utf8'), 'shell')
    matchSnapshot(t, fs.readFileSync(to + '.cmd', 'utf8'), 'cmd')
    matchSnapshot(t, fs.readFileSync(to + '.ps1', 'utf8'), 'ps1')
    t.end()
  })
})

test('env shebang with variables', function (t) {
  var from = path.resolve(fixtures, 'from.env.variables')
  var to = path.resolve(fixtures, 'env.variables.shim')
  cmdShim(from, to, function(er) {
    if (er)
      throw er

    matchSnapshot(t, fs.readFileSync(to, 'utf8'), 'shell')
    matchSnapshot(t, fs.readFileSync(to + '.cmd', 'utf8'), 'cmd')
    matchSnapshot(t, fs.readFileSync(to + '.ps1', 'utf8'), 'ps1')
    t.end()
  })
})

test('explicit shebang', function (t) {
  var from = path.resolve(fixtures, 'from.sh')
  var to = path.resolve(fixtures, 'sh.shim')
  cmdShim(from, to, function(er) {
    if (er)
      throw er

    matchSnapshot(t, fs.readFileSync(to, 'utf8'), 'shell')
    matchSnapshot(t, fs.readFileSync(to + '.cmd', 'utf8'), 'cmd')
    matchSnapshot(t, fs.readFileSync(to + '.ps1', 'utf8'), 'ps1')
    t.end()
  })
})

test('explicit shebang with args', function (t) {
  var from = path.resolve(fixtures, 'from.sh.args')
  var to = path.resolve(fixtures, 'sh.args.shim')
  cmdShim(from, to, function(er) {
    if (er)
      throw er

    matchSnapshot(t, fs.readFileSync(to, 'utf8'), 'shell')
    matchSnapshot(t, fs.readFileSync(to + '.cmd', 'utf8'), 'cmd')
    matchSnapshot(t, fs.readFileSync(to + '.ps1', 'utf8'), 'ps1')
    t.end()
  })
})
