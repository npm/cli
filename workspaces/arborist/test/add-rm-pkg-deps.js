const t = require('tap')
const addRm = require('../lib/add-rm-pkg-deps.js')

t.test('add', t => {
  const { add } = addRm
  const npa = require('npm-package-arg')
  const foo1 = npa('foo@1')
  const foo2 = npa('foo@2')
  const bar = npa('bar')
  const file = npa('file@file:/some/path/foo.tgz', '/')

  const logs = []
  const log = (l, ...args) => {
    if (l === 'warn') {
      logs.push(args)
    }
  }
  process.on('log', log)
  t.teardown(() => process.off('log', log))
  t.strictSame(add({
    pkg: {
      dependencies: { bar: '1' },
      devDependencies: { foo: '2' },
    },
    add: [
      foo1,
      bar,
    ],
    path: '/',
  }), {
    dependencies: { bar: '1' },
    devDependencies: { foo: '1' },
  }, 'inferred save types stay the same for each dependency')

  t.strictSame(logs, [])
  t.strictSame(add({
    pkg: {
      dependencies: { bar: '1' },
      devDependencies: { foo: '2' },
    },
    add: [
      foo1,
      bar,
      file,
    ],
    saveType: 'prod',
    path: '/',
  }), {
    dependencies: { foo: '1', bar: '1', file: 'file:/some/path/foo.tgz' },
  }, 'move foo to prod, leave bar as-is')
  t.strictSame(logs, [['idealTree', 'Removing devDependencies.foo in favor of dependencies.foo']])

  t.strictSame(add({
    pkg: {
      dependencies: { bar: '1' },
      devDependencies: { foo: '2' },
    },
    add: [foo1, bar],
    saveBundle: true,
    saveType: 'prod',
  }), {
    dependencies: { foo: '1', bar: '1' },
    bundleDependencies: ['bar', 'foo'],
  }, 'move to bundle deps, foo to deps, leave bar version unchanged')

  t.strictSame(add({
    pkg: {
      dependencies: { bar: '1' },
      devDependencies: { foo: '2' },
    },
    add: [foo1, bar],
    saveBundle: true,
    saveType: 'peer',
  }), {
    devDependencies: { foo: '1' },
    peerDependencies: { foo: '1', bar: '*' },
  }, 'never bundle peerDeps')

  t.strictSame(add({
    pkg: {
      dependencies: { bar: '1' },
      devDependencies: { foo: '2' },
    },
    add: [foo1, bar],
    saveBundle: true,
    saveType: 'peerOptional',
  }), {
    devDependencies: { foo: '1' },
    peerDependencies: { foo: '1', bar: '*' },
    peerDependenciesMeta: {
      foo: { optional: true },
      bar: { optional: true },
    },
  }, 'never bundle peerDeps')

  t.strictSame(add({
    pkg: {},
    add: [foo1, bar],
    saveBundle: true,
  }), {
    dependencies: { foo: '1', bar: '*' },
    bundleDependencies: ['bar', 'foo'],
  }, 'add all new stuff')

  t.strictSame(add({
    pkg: {
      peerDependencies: { foo: '1' },
      peerDependenciesMeta: { foo: { optional: true } },
    },
    add: [foo1],
    saveType: 'optional',
  }), {
    optionalDependencies: { foo: '1' },
    dependencies: { foo: '1' },
  }, 'move from peerOptional to optional, and adds to dependencies')

  t.strictSame(add({
    pkg: {
      optionalDependencies: { foo: '1' },
    },
    add: [foo1],
    saveType: 'peerOptional',
  }), {
    peerDependencies: { foo: '1' },
    peerDependenciesMeta: { foo: { optional: true } },
  }, 'move from optional to peerOptional')

  t.strictSame(add({
    pkg: {
      peerDependencies: { foo: '1' },
      peerDependenciesMeta: { foo: { optional: true } },
    },
    add: [foo1],
    saveType: 'peer',
  }), {
    peerDependencies: { foo: '1' },
    peerDependenciesMeta: { foo: { optional: false } },
  }, 'move from peerOptional to peer')

  t.strictSame(add({
    pkg: {
      peerDependencies: { foo: '1', bar: '2' },
      peerDependenciesMeta: { foo: { optional: true }, bar: { optional: true } },
    },
    add: [foo1],
    saveType: 'prod',
  }), {
    dependencies: { foo: '1' },
    peerDependencies: { bar: '2' },
    peerDependenciesMeta: { bar: { optional: true } },
  }, 'move from peerOptional to prod, remnants in peerDependencies')

  t.strictSame(add({
    pkg: {
      peerDependencies: { foo: '1' },
      peerDependenciesMeta: { foo: { optional: true } },
    },
    add: [foo1],
    saveType: 'prod',
  }), {
    dependencies: { foo: '1' },
  }, 'move from peerOptional to prod, empty peerDependencies')

  t.strictSame(add({
    pkg: {
      peerDependencies: { foo: '1' },
      peerDependenciesMeta: { foo: { optional: true } },
    },
    add: [foo2],
  }), {
    peerDependencies: { foo: '2' },
    peerDependenciesMeta: { foo: { optional: true } },
  }, 'update peerOptional')

  t.strictSame(add({
    pkg: {
      peerDependencies: { foo: '1' },
    },
    add: [foo2],
  }), {
    peerDependencies: { foo: '2' },
  }, 'update peer')

  t.strictSame(add({
    pkg: {
      optionalDependencies: { foo: '1' },
    },
    add: [foo2],
  }), {
    optionalDependencies: { foo: '2' },
    dependencies: { foo: '2' },
  }, 'update optional, adding to dependencies')

  t.strictSame(add({
    pkg: {
      devDependencies: { foo: '1' },
    },
    add: [foo2],
  }), {
    devDependencies: { foo: '2' },
  }, 'update dev')

  t.strictSame(add({
    pkg: {
      devDependencies: { foo: '1' },
      peerDependencies: { foo: '1' },
    },
    add: [foo2],
  }), {
    devDependencies: { foo: '2' },
    peerDependencies: { foo: '1' },
  }, 'update dev (peer is updated during reify)')

  t.strictSame(add({
    pkg: {
      devDependencies: { foo: '1' },
      peerDependencies: { foo: '1' },
      peerDependenciesMeta: { foo: { optional: true } },
    },
    add: [foo2],
  }), {
    devDependencies: { foo: '2' },
    peerDependencies: { foo: '1' },
    peerDependenciesMeta: { foo: { optional: true } },
  }, 'update dev (peer is updated during reify)')

  t.strictSame(add({
    pkg: {
      devDependencies: { foo: '*' },
      peerDependencies: { foo: '1' },
      peerDependenciesMeta: { foo: { optional: true } },
    },
    add: [foo2],
  }), {
    devDependencies: { foo: '2' },
    peerDependencies: { foo: '1' },
    peerDependenciesMeta: { foo: { optional: true } },
  }, 'update dev (peer is updated during reify)')

  t.strictSame(add({
    pkg: {
      devDependencies: { foo: '1' },
      peerDependencies: { foo: '*' },
      peerDependenciesMeta: { foo: { optional: true } },
    },
    add: [foo2],
  }), {
    devDependencies: { foo: '2' },
    peerDependencies: { foo: '*' },
    peerDependenciesMeta: { foo: { optional: true } },
  }, 'update dev (peer is updated during reify)')

  t.end()
})

t.test('rm', t => {
  const { rm } = addRm
  t.strictSame(rm({
    dependencies: { bar: '1' },
    devDependencies: { foo: '2' },
  }, ['foo']), {
    dependencies: { bar: '1' },
  }, 'remove foo, leave bar as-is')
  t.strictSame(rm({
    dependencies: { bar: '1' },
    devDependencies: { foo: '2' },
    bundleDependencies: ['foo'],
  }, ['foo']), {
    dependencies: { bar: '1' },
  }, 'remove foo from bundle deps too, leave bar as-is')
  t.strictSame(rm({
    dependencies: { bar: '1' },
    devDependencies: { foo: '2' },
    bundleDependencies: ['bar', 'foo'],
  }, ['foo']), {
    dependencies: { bar: '1' },
    bundleDependencies: ['bar'],
  }, 'remove foo from bundle deps too, leave bar as-is')

  t.end()
})
