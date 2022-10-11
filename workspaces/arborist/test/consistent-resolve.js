const t = require('tap')
const { normalizePath } = require('./fixtures/utils.js')
const consistentResolve = require('../lib/consistent-resolve.js')
const cr = (...args) => {
  const r = consistentResolve(...args)
  return r && normalizePath(r)
}

t.test('file and directories resolved to toPath', t => {
  const tp = '/foo'
  const fp = '/foo/bar'
  t.equal(cr('/foo/bar/baz', fp, tp, true), 'file:bar/baz')
  t.equal(cr('/foo/bar/baz', fp, tp), 'file:/foo/bar/baz')

  t.equal(cr('./baz', fp, tp, true), 'file:bar/baz')
  t.equal(cr('./baz', fp, tp), 'file:/foo/bar/baz')

  t.equal(cr('/foo/bar/baz.tgz', fp, tp, true), 'file:bar/baz.tgz')
  t.equal(cr('/foo/bar/baz.tgz', fp, tp), 'file:/foo/bar/baz.tgz')

  t.equal(cr('baz.tgz', fp, tp, true), 'file:bar/baz.tgz')
  t.equal(cr('baz.tgz', fp, tp), 'file:/foo/bar/baz.tgz')

  t.equal(cr('file:/foo/bar/baz', fp, tp, true), 'file:bar/baz')
  t.equal(cr('file:/foo/bar/baz', fp, tp), 'file:/foo/bar/baz')

  t.equal(cr('file:baz', fp, tp, true), 'file:bar/baz')
  t.equal(cr('file:baz', fp, tp), 'file:/foo/bar/baz')

  t.equal(cr('file:/foo/bar/baz.tgz', fp, tp, true), 'file:bar/baz.tgz')
  t.equal(cr('file:/foo/bar/baz.tgz', fp, tp), 'file:/foo/bar/baz.tgz')

  t.equal(cr('file:baz.tgz', fp, tp, true), 'file:bar/baz.tgz')
  t.equal(cr('file:baz.tgz', fp, tp), 'file:/foo/bar/baz.tgz')
  t.end()
})

t.test('file and directories made consistent if toPath not set', t => {
  const fp = '/foo/bar'
  for (const rel of [true, false]) {
    // relative doesn't matter if toPath not set
    t.test(`rel=${rel}`, t => {
      t.equal(cr('/foo/bar/baz', fp, null, rel), 'file:/foo/bar/baz')
      t.equal(cr('./baz', fp, null, rel), 'file:/foo/bar/baz')
      t.equal(cr('/foo/bar/baz.tgz', fp, null, rel), 'file:/foo/bar/baz.tgz')
      t.equal(cr('baz.tgz', fp, null, rel), 'file:/foo/bar/baz.tgz')
      t.equal(cr('file:/foo/bar/baz', fp, null, rel), 'file:/foo/bar/baz')
      t.equal(cr('file:baz', fp, null, rel), 'file:/foo/bar/baz')
      t.equal(cr('file:/foo/bar/baz.tgz', fp, null, rel), 'file:/foo/bar/baz.tgz')
      t.equal(cr('file:baz.tgz', fp, null, rel), 'file:/foo/bar/baz.tgz')
      t.end()
    })
  }
  t.end()
})

t.test('consistent hosted git info urls', t => {
  const expect = 'git+ssh://git@github.com/a/b.git'
  const expectAuth = 'git+https://user:pass@github.com/a/b.git'
  t.equal(cr('a/b'), expect)
  t.equal(cr('github:a/b'), expect)
  t.equal(cr('git+https://github.com/a/b'), expect)
  t.equal(cr('git://github.com/a/b'), expect)
  t.equal(cr('git+ssh://git@github.com/a/b'), expect)
  t.equal(cr('git+https://github.com/a/b.git'), expect)
  t.equal(cr('git://github.com/a/b.git'), expect)
  t.equal(cr('git+ssh://git@github.com/a/b.git'), expect)
  t.equal(cr('git+https://user:pass@github.com/a/b.git'), expectAuth)

  const hash = '#0000000000000000000000000000000000000000'
  t.equal(cr('a/b' + hash), expect + hash)
  t.equal(cr('github:a/b' + hash), expect + hash)
  t.equal(cr('git+https://github.com/a/b' + hash), expect + hash)
  t.equal(cr('git://github.com/a/b' + hash), expect + hash)
  t.equal(cr('git+ssh://git@github.com/a/b' + hash), expect + hash)
  t.equal(cr('git+https://github.com/a/b.git' + hash), expect + hash)
  t.equal(cr('git://github.com/a/b.git' + hash), expect + hash)
  t.equal(cr('git+ssh://git@github.com/a/b.git' + hash), expect + hash)
  t.equal(cr('xyz@a/b' + hash), expect + hash)
  t.equal(cr('xyz@github:a/b' + hash), expect + hash)
  t.equal(cr('xyz@git+https://github.com/a/b' + hash), expect + hash)
  t.equal(cr('xyz@git://github.com/a/b' + hash), expect + hash)
  t.equal(cr('xyz@git+ssh://git@github.com/a/b' + hash), expect + hash)
  t.equal(cr('xyz@git+https://github.com/a/b.git' + hash), expect + hash)
  t.equal(cr('xyz@git://github.com/a/b.git' + hash), expect + hash)
  t.equal(cr('xyz@git+ssh://git@github.com/a/b.git' + hash), expect + hash)
  t.end()
})

t.test('unhosted git returns saveSpec', t => {
  const r = 'git+https://x.com/y.git#0000000000000000000000000000000000000000'
  t.equal(cr(r), r)
  t.equal(cr('xyz@' + r), r)
  t.end()
})

t.test('remotes returned as-is', t => {
  const r = 'http://x.com/y.tgz'
  t.equal(cr(r), r)
  t.equal(cr('xyz@' + r), r)
  t.end()
})

t.test('falsey resolved returns null', t => {
  t.equal(cr(null), null)
  t.equal(cr(0), null)
  t.equal(cr(false), null)
  t.equal(cr(undefined), null)
  t.end()
})

t.test('tag returns tag', t => {
  t.equal(cr('foo@latest'), 'latest')
  t.end()
})

t.test('package name returns package name', t => {
  t.equal(cr('foo'), 'foo')
  t.end()
})

t.test('invalid resolved returns as-is', t => {
  t.equal(cr('not ! a : v@lid t*A*g'), 'not ! a : v@lid t*A*g')
  t.end()
})
