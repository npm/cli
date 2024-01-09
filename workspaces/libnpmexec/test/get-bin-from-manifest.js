const t = require('tap')

const getBinFromManifest = require('../lib/get-bin-from-manifest.js')

t.test('extract scope from manifest name with multiple bins', t => {
  const bin = getBinFromManifest({
    name: '@npmcli/foo',
    bin: {
      foo: 'foo',
      bar: 'bar',
    },
  })

  t.equal(bin, 'foo', 'should pick same name as package')
  t.end()
})

t.test('can not figure out what executable to run', t => {
  t.throws(
    () => getBinFromManifest({
      name: 'lorem',
      bin: {
        foo: 'foo',
        bar: 'bar',
      },
    }),
    /could not determine executable to run/,
    'should throw executable to run'
  )
  t.end()
})

t.test('no bin value', t => {
  t.throws(
    () => getBinFromManifest({
      name: 'foo',
    }),
    /could not determine executable to run/,
    'should throw executable to run on missing bin'
  )
  t.end()
})
