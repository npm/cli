'use strict'

const fs = require('fs')
const path = require('path')

const test = require('tap').test
const Tacks = require('tacks')
const Dir = Tacks.Dir
const File = Tacks.File
const common = require('../common-tap.js')

const base = common.pkg
const noFunding = path.join(base, 'no-funding-package')
const maintainerOwnsAllDeps = path.join(base, 'maintainer-owns-all-deps')
const nestedNoFundingPackages = path.join(base, 'nested-no-funding-packages')

function getFixturePackage ({ name, version, dependencies, funding }, extras) {
  const getDeps = () => Object
    .keys(dependencies)
    .reduce((res, dep) => (Object.assign({}, res, {
      [dep]: '*'
    })), {})

  return Dir(Object.assign({
    'package.json': File({
      name,
      version: version || '1.0.0',
      funding: (funding === undefined) ? {
        type: 'individual',
        url: 'http://example.com/donate'
      } : funding,
      dependencies: dependencies && getDeps(dependencies)
    })
  }, extras))
}

const fixture = new Tacks(Dir({
  'no-funding-package': Dir({
    'package.json': File({
      name: 'no-funding-package',
      version: '0.0.0'
    })
  }),
  'maintainer-owns-all-deps': getFixturePackage({
    name: 'maintainer-owns-all-deps',
    dependencies: {
      'dep-foo': '*',
      'dep-bar': '*'
    }
  }, {
    node_modules: Dir({
      'dep-foo': getFixturePackage({
        name: 'dep-foo',
        dependencies: {
          'dep-sub-foo': '*'
        }
      }, {
        node_modules: Dir({
          'dep-sub-foo': getFixturePackage({
            name: 'dep-sub-foo'
          })
        })
      }),
      'dep-bar': getFixturePackage({
        name: 'dep-bar'
      })
    })
  }),
  'nested-no-funding-packages': getFixturePackage({
    name: 'nested-no-funding-packages',
    funding: null,
    dependencies: {
      foo: '*'
    },
    devDependencies: {
      lorem: '*'
    }
  }, {
    node_modules: Dir({
      foo: getFixturePackage({
        name: 'foo',
        dependencies: {
          bar: '*'
        },
        funding: null
      }, {
        node_modules: Dir({
          bar: getFixturePackage({
            name: 'bar'
          }, {
            node_modules: Dir({
              'sub-bar': getFixturePackage({
                name: 'sub-bar',
                funding: {
                  url: 'https://example.com/sponsor'
                }
              })
            })
          })
        })
      }),
      lorem: getFixturePackage({
        name: 'lorem',
        funding: {
          url: 'https://example.com/lorem'
        }
      })
    })
  })
}))

function checkOutput (t, { code, stdout, stderr }) {
  t.is(code, 0, `exited code 0`)
  t.is(stderr, '', 'no warnings')
}

function testFundCmd ({ title, expect, args = [], opts = {}, output = checkOutput }) {
  const validate = (t, json) => (err, code, stdout, stderr) => {
    if (err) throw err

    output(t, { code, stdout, stderr })

    let parsed = stdout
    if (json) {
      t.doesNotThrow(function () {
        parsed = JSON.parse(stdout)
      }, 'valid JSON')
    }

    t.matchSnapshot(parsed, expect)
    t.end()
  }

  test(title, (t) => {
    common.npm(['fund'].concat(args), opts, validate(t))
  })

  test(`${title}, using --json option`, (t) => {
    common.npm(['fund', '--json'].concat(args), opts, validate(t, true))
  })
}

test('setup', function (t) {
  fixture.remove(base)
  fixture.create(base)
  t.end()
})

testFundCmd({
  title: 'fund with no package containing funding',
  expect: 'should print empty funding info',
  opts: { cwd: noFunding }
})

testFundCmd({
  title: 'fund in which same maintainer owns all its deps',
  expect: 'should print stack packages together',
  opts: { cwd: maintainerOwnsAllDeps }
})

testFundCmd({
  title: 'fund containing multi-level nested deps with no funding',
  expect: 'should omit dependencies with no funding declared',
  opts: { cwd: nestedNoFundingPackages }
})

testFundCmd({
  title: 'fund does not support global',
  expect: 'should throw EFUNDGLOBAL error',
  args: ['--global'],
  output: (t, { code, stdout, stderr }) => {
    t.is(code, 1, `exited code 0`)
    const [ errCode, errCmd ] = stderr.split('\n')
    t.matchSnapshot(`${errCode}\n${errCmd}`, 'should write error msgs to stderr')
  }
})

testFundCmd({
  title: 'fund using package argument with no browser',
  expect: 'should open funding url',
  args: ['--browser', 'undefined', '.'],
  opts: { cwd: maintainerOwnsAllDeps }
})

test('fund using package argument', function (t) {
  const fakeBrowser = path.join(common.pkg, '_script.sh')
  const outFile = path.join(common.pkg, '_output')

  const s = '#!/usr/bin/env bash\n' +
          'echo "$@" > ' + JSON.stringify(common.pkg) + '/_output\n'
  fs.writeFileSync(fakeBrowser, s)
  fs.chmodSync(fakeBrowser, '0755')

  common.npm([
    'fund', '.',
    '--loglevel=silent',
    '--browser=' + fakeBrowser
  ], { cwd: maintainerOwnsAllDeps }, function (err, code, stdout, stderr) {
    t.ifError(err, 'repo command ran without error')
    t.equal(code, 0, 'exit ok')
    var res = fs.readFileSync(outFile, 'utf8')
    t.equal(res, 'http://example.com/donate\n')
    t.end()
  })
})

test('cleanup', function (t) {
  t.pass(base)
  fixture.remove(base)
  t.end()
})
