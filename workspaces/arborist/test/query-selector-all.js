'use strict'

const util = require('util')
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
   fixture:

    query-selector-all-tests@1.0.0
    ├── @npmcli/abbrev@2.0.0 extraneous
    ├─┬ a@1.0.0 -> ./a
    │ └─┬ baz@1.0.0
    │   └── lorem@1.0.0
    ├── abbrev@1.1.1
    ├─┬ b@1.0.0 -> ./b
    │ └── bar@2.0.0 deduped
    ├── bar@2.0.0
    └─┬ foo@2.2.2
      ├─┬ bar@1.4.0
      │ └── dasher@2.0.0
      └── dash-separated-pkg@1.0.0
   */
  const path = t.testdir({
    'node_modules': {
      '@npmcli': {
        abbrev: {
          'package.json': JSON.stringify({
            name: '@npmcli/abbrev',
            version: '2.0.0-beta.45'
          }),
        },
      },
      a: t.fixture('symlink', '../a'),
      abbrev: {
        'package.json': JSON.stringify({
          name: 'abbrev',
          version: '1.1.1',
          license: 'ISC'
        }),
      },
      b: t.fixture('symlink', '../b'),
      bar: {
        'package.json': JSON.stringify({
          name: 'bar',
          version: '2.0.0',
          arbitrary: {
            foo: [
              'foo',
              'bar',
              { funding: { type: 'GH' } },
              { funding: { type: 'MS' } },
              10000,
              13000,
              15000,
            ],
            bar: 'bar',
            baz: [ 'a', 'b', 'c' ],
          }
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
        }),
      },
      foo: {
        'node_modules': {
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
          description: 'One of the best libraries every dev should know about.'
        }),
      },
      'dasher': {
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
          funding: [
            { type: 'GitHub', url: 'https://github.com/sponsors' }
          ],
        }),
      },
    },
    a: { 'package.json': JSON.stringify({
      name: 'a',
      version: '1.0.0',
      optionalDependencies: {
        baz: '^1.0.0',
      },
    }), },
    b: { 'package.json': JSON.stringify({
      name: 'b',
      version: '1.0.0',
      private: true,
      dependencies: {
        bar: '^2.0.0',
      },
    }), },
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
      },
      bundleDependencies: [ 'abbrev' ],
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

  // missing pseudo-class
  t.rejects(
    q(tree, ':foo'),
    { code: 'EQUERYNOPSEUDOCLASS' },
    'should throw on missing pseudo-class'
  )

  // missing class
  t.rejects(
    q(tree, '.foo'),
    { code: 'EQUERYNOCLASS' },
    'should throw on missing class'
  )

  // missing attribute matcher on :attr
  t.rejects(
    q(tree, ':attr(foo, bar)'),
    { code: 'EQUERYATTR' },
    'should throw on missing attribute matcher on :attr pseudo-class'
  )

  // :scope pseudo-class
  const [nodeFoo] = await q(tree, '#foo')
  const scopeRes = await querySelectorAll(nodeFoo, ':scope')
  t.same(scopeRes, [ 'foo@2.2.2' ], ':scope')

  const scopeChildren = await querySelectorAll(nodeFoo, ':scope > *')
  t.same(scopeChildren, [
    'dash-separated-pkg@1.0.0',
    'bar@1.4.0',
  ], ':scope > *')

  const runSpecParsing = async testCase => {
    for (const [selector, expected] of testCase) {
      const res = await querySelectorAll(tree, selector)
      t.same(
        res,
        expected,
        selector
      )
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
    ]],
    ['> #a', [ 'a@1.0.0' ]],

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
    ]],
    [':root > .workspace', [ 'a@1.0.0', 'b@1.0.0' ]],
    [':root > *.workspace', [ 'a@1.0.0', 'b@1.0.0' ]],
    [':root > .workspace[name=a]', [ 'a@1.0.0' ]],
    [':root > [name=bar]', [ 'bar@2.0.0' ]],
    [':root > .workspace[version=1.0.0]', [ 'a@1.0.0', 'b@1.0.0' ]],
    [':root > .workspace[name=a][version=1.0.0]', [ 'a@1.0.0' ]],
    [':root > :root', []],
    ['* > :root', []],
    ['* :root', []],
    [':root, :root', ['query-selector-all-tests@1.0.0']],
    ['#a *:root', []],
    ['#a > :root', []],
    ['#a ~ :root', []],

    // pseudo miscelaneous
    [':empty', [
      'a@1.0.0',
      'b@1.0.0',
      '@npmcli/abbrev@2.0.0-beta.45',
      'abbrev@1.1.1',
      'bar@2.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'lorem@1.0.0',
    ]],
    [':root > :empty', [
      'a@1.0.0',
      'b@1.0.0',
      'abbrev@1.1.1',
      'bar@2.0.0',
    ]],
    [':extraneous', [ '@npmcli/abbrev@2.0.0-beta.45' ]],
    [':invalid', [ 'lorem@1.0.0' ]],
    [':link', [ 'a@1.0.0', 'b@1.0.0' ]],
    [':link', [ 'a@1.0.0', 'b@1.0.0' ]],
    [':missing', [ 'missing-dep@^1.0.0' ]],
    [':private', [ 'b@1.0.0' ]],

    // :not pseudo-class
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
    ]],
    [':root > .workspace:not(#b)', [ 'a@1.0.0' ]],
    [':root > .workspace > *:not(#bar)', [ 'baz@1.0.0' ]],
    ['.bundled ~ :not(.workspace)', [
      'bar@2.0.0',
      'foo@2.2.2',
      'ipsum@npm:sit@1.0.0',
    ]],
    ['*:root > *:empty:not(*[name^=a], #b)', [ 'bar@2.0.0', ]],
    [':not(:not(:link))', [
      'a@1.0.0',
      'b@1.0.0',
    ]],

    // has pseudo-class
    [':root > *:has(* > #bar@1.4.0)', [ 'foo@2.2.2' ]],
    ['*:has(* > #bar@1.4.0)', [ 'foo@2.2.2' ]],
    ['*:has(> #bar@1.4.0)', [ 'foo@2.2.2' ]],
    ['.workspace:has(> * > #lorem)', [ 'a@1.0.0' ]],
    ['.workspace:has(* #lorem, ~ #b)', [ 'a@1.0.0' ]],

    // is pseudo-class
    [':is(#a, #b) > *', [ 'bar@2.0.0', 'baz@1.0.0' ]],
    // TODO: ipsum is not empty but it's child is missing
    // so it doesn't return a result here
    [':root > *:is(.prod:not(:empty), .dev > [name=bar]) > *', [
      'dasher@2.0.0'
    ]],
    [':is(*:semver(2.0.0), :semver(=2.0.0-beta.45))',  [
      '@npmcli/abbrev@2.0.0-beta.45',
      'bar@2.0.0',
      'dasher@2.0.0',
    ]],

    // type pseudo-class
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
    ]],
    [':type(tag)', [ 'lorem@1.0.0' ]],
    [':type(alias)', [ 'ipsum@npm:sit@1.0.0' ]],
    [':type(range)', [
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'dash-separated-pkg@1.0.0',
      'foo@2.2.2',
      'bar@1.4.0',
    ]],
    [':type(git)', []],

    // path pseudo-class
    [':path(node_modules/*)', [
      'abbrev@1.1.1',
      'bar@2.0.0',
      'baz@1.0.0',
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
      'ipsum@npm:sit@1.0.0',
      'lorem@1.0.0',
    ]],
    [':path(node_modules/bar)', [ 'bar@2.0.0' ]],
    [':path(./node_modules/bar)', [ 'bar@2.0.0' ]],
    [':path(node_modules/foo/node_modules/bar)', [ 'bar@1.4.0' ]],
    [':path(**/bar)', [ 'bar@2.0.0', 'bar@1.4.0' ]],
    [':path(*)', [ 'a@1.0.0', 'b@1.0.0' ]],
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
    ]],

    // semver pseudo-class
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
    ]],
    [':semver(2.0.0)', [
      'bar@2.0.0',
      'dasher@2.0.0',
    ]],
    [':semver(>=2)', [
      'bar@2.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
    ]],
    [':semver(~2.0.x)', [
      'bar@2.0.0',
      'dasher@2.0.0',
    ]],
    [':semver(2 - 3)', [
      'bar@2.0.0',
      'dasher@2.0.0',
      'foo@2.2.2',
    ]],
    [':semver(=1.4.0)', [ 'bar@1.4.0' ]],
    [':semver(1.4.0 || 2.2.2)', [ 'foo@2.2.2', 'bar@1.4.0' ]],

    // attr pseudo-class
    [':attr([name=dasher])', [ 'dasher@2.0.0' ]],
    [':attr(dependencies, [bar="^1.0.0"])', [ 'foo@2.2.2' ]],
    [':attr(dependencies, :attr([bar="^1.0.0"]))', [ 'foo@2.2.2' ]],
    [':attr([keywords=lorem])', [ 'ipsum@npm:sit@1.0.0', 'lorem@1.0.0' ]],
    [':attr(arbitrary, [foo$=oo])', [ 'bar@2.0.0' ]],
    [':attr(arbitrary, [foo*=oo])', [ 'bar@2.0.0' ]],
    [':attr(arbitrary, [foo|=oo])', []],
    [':attr(funding, :attr([type=GitHub]))', [ 'lorem@1.0.0' ]],
    [':attr(arbitrary, foo, :attr(funding, [type=GH]))', [ 'bar@2.0.0' ]],

    // attribute matchers
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
    ]],
    ['[name=a]', [ 'a@1.0.0' ]],
    ['[name=@npmcli/abbrev]', [ '@npmcli/abbrev@2.0.0-beta.45' ]],
    ['[name=a], [name=b]', [ 'a@1.0.0', 'b@1.0.0' ]],
    ['[name=a], *[name=b]', [ 'a@1.0.0', 'b@1.0.0' ]],
    ['[name^=a]', [ 'a@1.0.0', 'abbrev@1.1.1' ]],
    ['[name|=dash]', [ 'dash-separated-pkg@1.0.0' ]],
    ['[name$=oo]', [ 'foo@2.2.2' ]],
    ['[description]', [
      'dash-separated-pkg@1.0.0',
      'dasher@2.0.0',
    ]],
    ['[description~=ever]', [ 'dasher@2.0.0' ]],
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
    ['[arbitrary^=foo]', [ 'foo@2.2.2' ]],
    ['[license=ISC]', [ 'abbrev@1.1.1', 'baz@1.0.0' ]],

    // classes
    ['.workspace', [ 'a@1.0.0', 'b@1.0.0' ]],
    ['.workspace > *', [ 'bar@2.0.0', 'baz@1.0.0' ]],
    ['.workspace ~ *', [
      'abbrev@1.1.1',
      'bar@2.0.0',
      'foo@2.2.2',
      'ipsum@npm:sit@1.0.0'
    ]],
    ['.dev', [ 'foo@2.2.2' ]],
    ['.dev *', [ 'dash-separated-pkg@1.0.0', 'dasher@2.0.0', 'bar@1.4.0' ]],
    ['.peer', [ 'dasher@2.0.0' ]],
    ['.optional', [ 'baz@1.0.0' ]],
    ['.bundled', [ 'abbrev@1.1.1' ]],
    ['.bundled ~ *', [
      'a@1.0.0',
      'b@1.0.0',
      'bar@2.0.0',
      'foo@2.2.2',
      'ipsum@npm:sit@1.0.0',
    ]],

    // id selector
    ['#bar', [ 'bar@2.0.0', 'bar@1.4.0' ]],
    ['#bar@2.0.0', [ 'bar@2.0.0' ]],
    ['#@npmcli/abbrev@2.0.0-beta.45', [ '@npmcli/abbrev@2.0.0-beta.45' ]],
    ['#bar:semver(2.0)', [ 'bar@2.0.0' ]],
    ['#bar:semver(2)', [ 'bar@2.0.0' ]],
    ['#bar:semver(^2.0.0)', [ 'bar@2.0.0' ]],
    ['#bar:semver(~2.0.0)', [ 'bar@2.0.0' ]],
    ['#bar:semver(=2.0.0)', [ 'bar@2.0.0' ]],
    ['#bar:semver(>=2.0.0)', [ 'bar@2.0.0' ]],
    ['#bar:semver(<3.0.0)', [ 'bar@2.0.0', 'bar@1.4.0' ]],
    ['#bar:semver(2 - 3)', [ 'bar@2.0.0' ]],
    ['#bar:semver(2.0.0 - 3.0.0)', [ 'bar@2.0.0' ]],
    ['#bar:semver(*)', [ 'bar@2.0.0', 'bar@1.4.0' ]],
    ['#bar:semver(^2.0.0-beta.0)', [ 'bar@2.0.0' ]],
    ['#bar:semver(>1.5.0 <3.0.0)', [ 'bar@2.0.0' ]],
    ['#bar:semver(2.x)', [ 'bar@2.0.0' ]],
    ['#bar:semver(2.x.x)', [ 'bar@2.0.0' ]],
    ['#bar:semver(1||2)', [ 'bar@2.0.0', 'bar@1.4.0' ]],
    ['#bar:semver(1 || 2)', [ 'bar@2.0.0', 'bar@1.4.0' ]],
    ['#bar:semver(1 || 2.0.0)', [ 'bar@2.0.0', 'bar@1.4.0' ]],
    ['#bar:semver(1.4.0 || 2)', [ 'bar@2.0.0', 'bar@1.4.0' ]],
    ['#ipsum', [ 'ipsum@npm:sit@1.0.0' ]],
    ['#bar > *', [ 'dasher@2.0.0' ]],
    [':root > #bar', [ 'bar@2.0.0' ]],
    [':root > #bar > *', []],
    [':root #bar > *', [ 'dasher@2.0.0' ]],
    [':root #bar:semver(1) > *', [ 'dasher@2.0.0' ]],
    [':root #bar:semver(1) ~ *', [ 'dash-separated-pkg@1.0.0' ]],
    ['#bar:semver(2), #foo', [ 'bar@2.0.0', 'foo@2.2.2' ]],
    ['#a, #bar:semver(2), #foo@2.2.2', [ 'a@1.0.0', 'bar@2.0.0', 'foo@2.2.2' ]],
  ])
})
