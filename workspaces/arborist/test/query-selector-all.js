'use strict'

const t = require('tap')
const Arborist = require('..')

const q = require('../lib/query-selector-all.js')

// test helper that spits out pkgid for readability
// and deduplicates link/target from results
const querySelectorAll = async (tree, query) => {
  const res = await q(tree, query)
  return [...new Set(res.map(i => i.pkgid))]
}

t.test('query-selector-all', async t => {
  /*
   fixture tree:

    query-selector-all-tests@1.0.0
    ├── @npmcli/abbrev@2.0.0 (extraneous)
    ├─┬ a@1.0.0 -> ./a (production dep of query-selector-all-tests, workspace)
    │ └─┬ baz@1.0.0 (optional dep of a)
    │   └── lorem@1.0.0 (production dep of baz)
    ├── abbrev@1.1.1 (production dep of query-selector-all-tests)
    ├─┬ b@1.0.0 -> ./b (workspace)
    │ └── bar@2.0.0 (production dep of b, deduped)
    ├─┬ bar@2.0.0 (production dep of query-selector-all-tests)
    │ └── moo@3.0.0 (production dep of bar)
    ├─┬ foo@2.2.2 (dev dep of query-selector-all-tests)
    │ ├─┬ bar@1.4.0 (production dep of foo, deduped)
    │ │ └── dasher@2.0.0 (peer dep of bar)
    │ └── dash-separated-pkg@1.0.0 (production dep of foo)
    ├── moo@3.0.0 (dev dep of query-selector-all-tests)
    └─┬ recur@1.0.0 (dev dep of query-selector-all-tests)
      └─┬ sive@1.0.0 (production dep of recur)
        └── recur@1.0.0 (recursive production dep of recur, deduped)

   */
  const path = t.testdir({
    node_modules: {
      '@npmcli': {
        abbrev: {
          'package.json': JSON.stringify({
            name: '@npmcli/abbrev',
            version: '2.0.0-beta.45',
          }),
        },
      },
      a: t.fixture('symlink', '../a'),
      abbrev: {
        'package.json': JSON.stringify({
          name: 'abbrev',
          version: '1.1.1',
          license: 'ISC',
        }),
      },
      b: t.fixture('symlink', '../b'),
      bar: {
        'package.json': JSON.stringify({
          name: 'bar',
          version: '2.0.0',
          dependencies: {
            moo: '3.0.0',
          },
          arbitrary: {
            foo: [
              false,
              'foo',
              'bar',
              { funding: { type: 'GH' } },
              { funding: { type: 'MS' } },
              10000,
              13000,
              15000,
            ],
            bar: 'bar',
            baz: ['a', 'b', 'c'],
          },
        }),
      },
      baz: {
        'package.json': JSON.stringify({
          name: 'baz',
          version: '1.0.0',
          license: ['ISC', 'Something'],
          dependencies: {
            lorem: 'latest',
          },
          scripts: {
            test: 'tap',
          },
        }),
      },
      foo: {
        node_modules: {
          bar: {
            'package.json': JSON.stringify({
              name: 'bar',
              version: '1.4.0',
              peerDependencies: {
                dasher: '2.0.0',
              },
            }),
          },
        },
        'package.json': JSON.stringify({
          name: 'foo',
          version: '2.2.2',
          arbitrary: 'foo key',
          dependencies: {
            bar: '^1.0.0',
            'dash-separated-pkg': '^1.0.0',
          },
        }),
      },
      'dash-separated-pkg': {
        'package.json': JSON.stringify({
          name: 'dash-separated-pkg',
          version: '1.0.0',
          description: 'One of the best libraries every dev should know about.',
        }),
      },
      dasher: {
        'package.json': JSON.stringify({
          name: 'dasher',
          version: '2.0.0',
          description: 'The best library ever.',
        }),
      },
      ipsum: {
        'package.json': JSON.stringify({
          name: 'sit',
          version: '1.0.0',
          keywords: ['lorem', 'ipsum', 'dolor'],
          dependencies: {
            'missing-dep': '^1.0.0',
          },
        }),
      },
      lorem: {
        'package.json': JSON.stringify({
          name: 'lorem',
          version: '1.0.0',
          keywords: ['lorem', 'ipsum', 'sit', 'amet'],
          devDependencies: {
            moo: '^3.0.0',
          },
          funding: [
            { type: 'GitHub', url: 'https://github.com/sponsors' },
          ],
        }),
      },
      moo: {
        'package.json': JSON.stringify({
          name: 'moo',
          version: '3.0.0',
        }),
      },
      recur: {
        'package.json': JSON.stringify({
          name: 'recur',
          version: '1.0.0',
          dependencies: {
            sive: '1.0.0',
          },
        }),
      },
      sive: {
        'package.json': JSON.stringify({
          name: 'sive',
          version: '1.0.0',
          dependencies: {
            recur: '1.0.0',
          },
        }),
      },
    },
    a: { 'package.json': JSON.stringify({
      name: 'a',
      version: '1.0.0',
      optionalDependencies: {
        baz: '^1.0.0',
      },
    }) },
    b: { 'package.json': JSON.stringify({
      name: 'b',
      version: '1.0.0',
      private: true,
      devDependencies: {
        a: '^1.0.0',
      },
      dependencies: {
        bar: '^2.0.0',
      },
    }) },
    'package.json': JSON.stringify({
      name: 'query-selector-all-tests',
      version: '1.0.0',
      workspaces: ['a', 'b'],
      dependencies: {
        a: '^1.0.0',
        abbrev: '^1.1.1',
        bar: '^2.0.0',
        ipsum: 'npm:sit@1.0.0',
      },
      devDependencies: {
        foo: '^2.0.0',
        moo: '^3.0.0',
        recur: '1.0.0',
      },
      bundleDependencies: ['abbrev'],
    }),
  })

  const opts = {
    path,
    fullMetadata: true,
  }
  const arb = new Arborist(opts)
  const tree = await arb.loadActual(opts)

  // empty query?
  const emptyRes = await q(tree, '')
  t.same(emptyRes, [], 'empty query')

  // missing pseudo selector
  t.rejects(
    q(tree, ':foo'),
    { code: 'EQUERYNOPSEUDO' },
    'should throw on missing pseudo selector'
  )

  // missing depType
  t.rejects(
    q(tree, '.foo'),
    { code: 'EQUERYNODEPTYPE' },
    'should throw on missing dep type'
  )

  // missing attribute matcher on :attr
  t.rejects(
    q(tree, ':attr(foo, bar)'),
    { code: 'EQUERYATTR' },
    'should throw on missing attribute matcher on :attr pseudo'
  )

  // no type or tag selectors, as documented
  t.rejects(
    q(tree, 'node'),
    { code: 'EQUERYNOSELECTOR' },
    'should throw in invalid selector'
  )

  // :scope pseudo
  const [nodeFoo] = await q(tree, '#foo')
  const scopeRes = await querySelectorAll(nodeFoo, ':scope')
  t.same(scopeRes, ['foo@2.2.2'], ':scope')

  const scopeChildren = await querySelectorAll(nodeFoo, ':scope > *')
  t.same(scopeChildren, [
    'dash-separated-pkg@1.0.0',
    'bar@1.4.0',
  ], ':scope > *')

  const runSpecParsing = async testCase => {
    for (const [selector, expected] of testCase) {
      t.test(selector, async t => {
        const res = await querySelectorAll(tree, selector)
        t.same(
          res,
          expected,
          selector
        )
      })
    }
  }

  await runSpecParsing([
    // universal selector
    ['*', [
      'query-selector-all-tests@1.0.0',
      'a@1.0.0',
      'b@1.0.0',
      '@npmcli/abbrev@2.0.0-beta.45',
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
      'bar@1.4.0',
      'ipsum@npm:sit@1.0.0',
      'lorem@1.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
      'sive@1.0.0',
    ]],
    ['* > *', [
      'a@1.0.0',
      'b@1.0.0',
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
      'bar@1.4.0',
      'ipsum@npm:sit@1.0.0',
      'lorem@1.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
      'sive@1.0.0',
    ]],
    ['> #a', ['a@1.0.0']],

    // pseudo :root
    [':root', ['query-selector-all-tests@1.0.0']],
    [':scope', ['query-selector-all-tests@1.0.0']], // same as root in this context
    [':root > *', [
      'a@1.0.0',
      'b@1.0.0',
      'abbrev@1.1.1',
      'bar@2.0.0',
      'foo@2.2.2',
      'ipsum@npm:sit@1.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
    ]],
    [':root > .workspace', ['a@1.0.0', 'b@1.0.0']],
    [':root > *.workspace', ['a@1.0.0', 'b@1.0.0']],
    [':root > .workspace[name=a]', ['a@1.0.0']],
    [':root > [name=bar]', ['bar@2.0.0']],
    [':root > .workspace[version=1.0.0]', ['a@1.0.0', 'b@1.0.0']],
    [':root > .workspace[name=a][version=1.0.0]', ['a@1.0.0']],
    [':root > :root', []],
    ['* > :root', []],
    ['* :root', []],
    [':root, :root', ['query-selector-all-tests@1.0.0']],
    ['#a *:root', []],
    ['#a > :root', []],
    ['#a ~ :root', []],

    // pseudo miscelaneous
    [':empty', [
      '@npmcli/abbrev@2.0.0-beta.45',
      'a@1.0.0',
      'abbrev@1.1.1',
      'b@1.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'lorem@1.0.0',
      'moo@3.0.0',
    ]],
    [':root > :empty', [
      'a@1.0.0',
      'abbrev@1.1.1',
      'b@1.0.0',
      'moo@3.0.0',
    ]],
    [':extraneous', ['@npmcli/abbrev@2.0.0-beta.45']],
    [':invalid', ['lorem@1.0.0']],
    [':link', ['a@1.0.0', 'b@1.0.0']],
    [':link', ['a@1.0.0', 'b@1.0.0']],
    [':deduped', [
      'bar@2.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
    ]],
    [':missing', ['missing-dep@^1.0.0']],
    [':private', ['b@1.0.0']],

    // :not pseudo
    [':not(#foo)', [
      'query-selector-all-tests@1.0.0',
      'a@1.0.0',
      'b@1.0.0',
      '@npmcli/abbrev@2.0.0-beta.45',
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'bar@1.4.0',
      'ipsum@npm:sit@1.0.0',
      'lorem@1.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
      'sive@1.0.0',
    ]],
    [':root > .workspace:not(#b)', ['a@1.0.0']],
    [':root > .workspace > *:not(#bar)', ['a@1.0.0', 'baz@1.0.0']],
    ['.bundled ~ :not(.workspace)', [
      'bar@2.0.0',
      'foo@2.2.2',
      'ipsum@npm:sit@1.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
    ]],
    ['*:root > *:empty:not(*[name^=a], #b)', ['moo@3.0.0']],
    [':not(:not(:link))', [
      'a@1.0.0',
      'b@1.0.0',
    ]],

    // has pseudo
    [':root > *:has(* > #bar@1.4.0)', ['foo@2.2.2']],
    ['*:has(* > #bar@1.4.0)', ['foo@2.2.2']],
    ['*:has(> #bar@1.4.0)', ['foo@2.2.2']],
    ['.workspace:has(> * > #lorem)', ['a@1.0.0']],
    ['.workspace:has(* #lorem, ~ #b)', ['a@1.0.0']],

    // is pseudo
    [':is(#a, #b) > *', ['a@1.0.0', 'bar@2.0.0', 'baz@1.0.0']],
    // TODO: ipsum is not empty but its child is missing so it doesn't return a
    // result here
    [':root > *:is(.prod:not(:empty), .dev > [name=bar]) > *', [
      'a@1.0.0',
      'bar@2.0.0',
      'baz@1.0.0',
      'dasher@2.0.0',
      'moo@3.0.0',
    ]],
    [':is(*:semver(2.0.0), :semver(=2.0.0-beta.45))', [
      '@npmcli/abbrev@2.0.0-beta.45',
      'bar@2.0.0',
      'dasher@2.0.0',
    ]],

    // type pseudo
    [':type()', [
      'query-selector-all-tests@1.0.0',
      'a@1.0.0',
      'b@1.0.0',
      '@npmcli/abbrev@2.0.0-beta.45',
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
      'bar@1.4.0',
      'ipsum@npm:sit@1.0.0',
      'lorem@1.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
      'sive@1.0.0',
    ]],
    [':type(tag)', ['lorem@1.0.0']],
    [':type(alias)', ['ipsum@npm:sit@1.0.0']],
    [':type(range)', [
      'a@1.0.0',
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'dash-separated-pkg@1.0.0',
      'foo@2.2.2',
      'bar@1.4.0',
      'moo@3.0.0',
    ]],
    [':type(git)', []],

    // path pseudo
    [':path(node_modules/*)', [
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
      'ipsum@npm:sit@1.0.0',
      'lorem@1.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
      'sive@1.0.0',
    ]],
    [':path(node_modules/bar)', ['bar@2.0.0']],
    [':path(./node_modules/bar)', ['bar@2.0.0']],
    [':path(node_modules/foo/node_modules/bar)', ['bar@1.4.0']],
    [':path(**/bar)', ['bar@2.0.0', 'bar@1.4.0']],
    [':path(*)', ['a@1.0.0', 'b@1.0.0']],
    [':path()', [
      'query-selector-all-tests@1.0.0',
      'a@1.0.0',
      'b@1.0.0',
      '@npmcli/abbrev@2.0.0-beta.45',
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
      'bar@1.4.0',
      'ipsum@npm:sit@1.0.0',
      'lorem@1.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
      'sive@1.0.0',
    ]],

    // semver pseudo
    [':semver()', [
      'query-selector-all-tests@1.0.0',
      'a@1.0.0',
      'b@1.0.0',
      '@npmcli/abbrev@2.0.0-beta.45',
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
      'bar@1.4.0',
      'ipsum@npm:sit@1.0.0',
      'lorem@1.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
      'sive@1.0.0',
    ]],
    [':semver(*)', [
      'query-selector-all-tests@1.0.0',
      'a@1.0.0',
      'b@1.0.0',
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
      'bar@1.4.0',
      'ipsum@npm:sit@1.0.0',
      'lorem@1.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
      'sive@1.0.0',
    ]],
    [':semver(2.0.0)', [
      'bar@2.0.0',
      'dasher@2.0.0',
    ]],
    [':semver(>=2)', [
      'bar@2.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
      'moo@3.0.0',
    ]],
    [':semver(~2.0.x)', [
      'bar@2.0.0',
      'dasher@2.0.0',
    ]],
    [':semver(2 - 3)', [
      'bar@2.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
      'moo@3.0.0',
    ]],
    [':semver(=1.4.0)', ['bar@1.4.0']],
    [':semver(1.4.0 || 2.2.2)', ['foo@2.2.2', 'bar@1.4.0']],

    // attr pseudo
    [':attr([name=dasher])', ['dasher@2.0.0']],
    [':attr(dependencies, [bar="^1.0.0"])', ['foo@2.2.2']],
    [':attr(dependencies, :attr([bar="^1.0.0"]))', ['foo@2.2.2']],
    [':attr([keywords=lorem])', ['ipsum@npm:sit@1.0.0', 'lorem@1.0.0']],
    [':attr(arbitrary, [foo$=oo])', ['bar@2.0.0']],
    [':attr(arbitrary, [foo*=oo])', ['bar@2.0.0']],
    [':attr(arbitrary, [foo|=oo])', []],
    [':attr(funding, :attr([type=GitHub]))', ['lorem@1.0.0']],
    [':attr(arbitrary, foo, :attr(funding, [type=GH]))', ['bar@2.0.0']],
    [':attr(arbitrary, foo, :attr(funding, [type=gh i]))', ['bar@2.0.0']],
    [':attr(arbitrary, :attr([foo=10000]))', ['bar@2.0.0']],

    // attribute matchers
    ['[scripts]', [
      'baz@1.0.0',
    ]],
    ['[name]', [
      'query-selector-all-tests@1.0.0',
      'a@1.0.0',
      'b@1.0.0',
      '@npmcli/abbrev@2.0.0-beta.45',
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
      'bar@1.4.0',
      'ipsum@npm:sit@1.0.0',
      'lorem@1.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
      'sive@1.0.0',
    ]],
    ['[name=a]', ['a@1.0.0']],
    ['[name=@npmcli/abbrev]', ['@npmcli/abbrev@2.0.0-beta.45']],
    ['[name=a], [name=b]', ['a@1.0.0', 'b@1.0.0']],
    ['[name=a], *[name=b]', ['a@1.0.0', 'b@1.0.0']],
    ['[name^=a]', ['a@1.0.0', 'abbrev@1.1.1']],
    ['[name|=dash]', ['dash-separated-pkg@1.0.0']],
    ['[name$=oo]', ['foo@2.2.2', 'moo@3.0.0']],
    ['[description]', [
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
    ]],
    ['[description~=ever]', ['dasher@2.0.0']],
    ['[description~=best]', [
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
    ]],
    ['[name*=a]', [
      'query-selector-all-tests@1.0.0',
      'a@1.0.0',
      '@npmcli/abbrev@2.0.0-beta.45',
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'bar@1.4.0',
    ]],
    ['[arbitrary^=foo]', ['foo@2.2.2']],
    ['[license=ISC]', ['abbrev@1.1.1', 'baz@1.0.0']],
    ['[license=isc i]', ['abbrev@1.1.1', 'baz@1.0.0']],

    // types
    ['.prod', [
      'query-selector-all-tests@1.0.0',
      'a@1.0.0',
      'b@1.0.0',
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'ipsum@npm:sit@1.0.0',
      'lorem@1.0.0',
      'moo@3.0.0',
    ]],
    ['.workspace', ['a@1.0.0', 'b@1.0.0']],
    ['.workspace > *', ['a@1.0.0', 'bar@2.0.0', 'baz@1.0.0']],
    ['.workspace ~ *', [
      'abbrev@1.1.1',
      'bar@2.0.0',
      'foo@2.2.2',
      'ipsum@npm:sit@1.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
    ]],
    ['.dev', [
      '@npmcli/abbrev@2.0.0-beta.45',
      'a@1.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
      'bar@1.4.0',
      'moo@3.0.0',
      'recur@1.0.0',
      'sive@1.0.0',
    ]],
    ['.dev *', [
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'bar@1.4.0',
      'recur@1.0.0',
      'sive@1.0.0',
    ]],
    ['.peer', ['@npmcli/abbrev@2.0.0-beta.45', 'dasher@2.0.0']],
    ['.optional', ['@npmcli/abbrev@2.0.0-beta.45', 'baz@1.0.0', 'lorem@1.0.0']],
    ['.bundled', ['abbrev@1.1.1']],
    ['.bundled ~ *', [
      'a@1.0.0',
      'b@1.0.0',
      'bar@2.0.0',
      'foo@2.2.2',
      'ipsum@npm:sit@1.0.0',
      'moo@3.0.0',
      'recur@1.0.0',
    ]],

    // id selector
    ['#bar', ['bar@2.0.0', 'bar@1.4.0']],
    ['#bar@2.0.0', ['bar@2.0.0']],
    ['#@npmcli/abbrev@2.0.0-beta.45', ['@npmcli/abbrev@2.0.0-beta.45']],
    ['#bar:semver(2.0)', ['bar@2.0.0']],
    ['#bar:semver(2)', ['bar@2.0.0']],
    ['#bar:semver(^2.0.0)', ['bar@2.0.0']],
    ['#bar:semver(~2.0.0)', ['bar@2.0.0']],
    ['#bar:semver(=2.0.0)', ['bar@2.0.0']],
    ['#bar:semver(>=2.0.0)', ['bar@2.0.0']],
    ['#bar:semver(<3.0.0)', ['bar@2.0.0', 'bar@1.4.0']],
    ['#bar:semver(2 - 3)', ['bar@2.0.0']],
    ['#bar:semver(2.0.0 - 3.0.0)', ['bar@2.0.0']],
    ['#bar:semver(*)', ['bar@2.0.0', 'bar@1.4.0']],
    ['#bar:semver(^2.0.0-beta.0)', ['bar@2.0.0']],
    ['#bar:semver(>1.5.0 <3.0.0)', ['bar@2.0.0']],
    ['#bar:semver(2.x)', ['bar@2.0.0']],
    ['#bar:semver(2.x.x)', ['bar@2.0.0']],
    ['#bar:semver(1||2)', ['bar@2.0.0', 'bar@1.4.0']],
    ['#bar:semver(1 || 2)', ['bar@2.0.0', 'bar@1.4.0']],
    ['#bar:semver(1 || 2.0.0)', ['bar@2.0.0', 'bar@1.4.0']],
    ['#bar:semver(1.4.0 || 2)', ['bar@2.0.0', 'bar@1.4.0']],
    ['#ipsum', ['ipsum@npm:sit@1.0.0']],
    ['#bar > *', ['dasher@2.0.0', 'moo@3.0.0']],
    [':root > #bar', ['bar@2.0.0']],
    [':root > #bar > *', ['moo@3.0.0']],
    [':root #bar > *', ['dasher@2.0.0', 'moo@3.0.0']],
    [':root #bar:semver(1) > *', ['dasher@2.0.0']],
    [':root #bar:semver(1) ~ *', ['dash-separated-pkg@1.0.0']],
    ['#bar:semver(2), #foo', ['bar@2.0.0', 'foo@2.2.2']],
    ['#a, #bar:semver(2), #foo@2.2.2', ['a@1.0.0', 'bar@2.0.0', 'foo@2.2.2']],
  ])
})
