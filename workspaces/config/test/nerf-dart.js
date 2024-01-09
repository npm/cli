const t = require('tap')
const nerfDart = require('../lib/nerf-dart.js')

const cases = [
  ['//registry.npmjs.org/', [
    'https://registry.npmjs.org',
    'https://registry.npmjs.org/package-name',
    'https://registry.npmjs.org/package-name?write=true',
    'https://registry.npmjs.org/@scope%2fpackage-name',
    'https://registry.npmjs.org/@scope%2fpackage-name?write=true',
    'https://username:password@registry.npmjs.org/package-name?write=true',
    'https://registry.npmjs.org/#hash',
    'https://registry.npmjs.org/?write=true#hash',
    'https://registry.npmjs.org/package-name?write=true#hash',
    'https://registry.npmjs.org/package-name#hash',
    'https://registry.npmjs.org/@scope%2fpackage-name?write=true#hash',
    'https://registry.npmjs.org/@scope%2fpackage-name#hash',
  ]],
  ['//my-couch:5984/registry/_design/app/rewrite/', [
    'https://my-couch:5984/registry/_design/app/rewrite/',
    'https://my-couch:5984/registry/_design/app/rewrite/package-name',
    'https://my-couch:5984/registry/_design/app/rewrite/package-name?write=true',
    'https://my-couch:5984/registry/_design/app/rewrite/@scope%2fpackage-name',
    'https://my-couch:5984/registry/_design/app/rewrite/@scope%2fpackage-name?write=true',
    'https://username:password@my-couch:5984/registry/_design/app/rewrite/package-name?write=true',
    'https://my-couch:5984/registry/_design/app/rewrite/#hash',
    'https://my-couch:5984/registry/_design/app/rewrite/?write=true#hash',
    'https://my-couch:5984/registry/_design/app/rewrite/package-name?write=true#hash',
    'https://my-couch:5984/registry/_design/app/rewrite/package-name#hash',
    'https://my-couch:5984/registry/_design/app/rewrite/@scope%2fpackage-name?write=true#hash',
    'https://my-couch:5984/registry/_design/app/rewrite/@scope%2fpackage-name#hash',
  ]],
]

for (const [dart, tests] of cases) {
  t.test(dart, t => {
    t.plan(tests.length)
    for (const url of tests) {
      t.equal(nerfDart(url), dart, url)
    }
  })
}

t.throws(() => nerfDart('not a valid url'))
