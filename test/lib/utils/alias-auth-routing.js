const t = require('tap')
const fetch = require('npm-registry-fetch')
const npa = require('npm-package-arg')

// Locks in the contract that alias fetches route through the *target*
// registry's auth, not the default registry's. The contract spans two
// vendored packages — pacote unwraps spec.subSpec before fetching, and
// npm-registry-fetch picks registry + auth from that subSpec's scope — so
// a regression in either dep bump would break alias auth silently. These
// tests call the same public npm-registry-fetch exports pacote uses, with
// the inputs pacote produces for each alias type.

t.test('pickRegistry: jsr: alias routes via subSpec.scope (@jsr)', async t => {
  const { subSpec } = npa('foo@jsr:@scope/name@1.0.0')
  const registry = fetch.pickRegistry(subSpec, {
    '@jsr:registry': 'https://npm.jsr.io/',
    registry: 'https://registry.npmjs.org/',
  })
  t.equal(registry, 'https://npm.jsr.io/')
})

t.test('pickRegistry: github: alias routes via subSpec.scope (@<owner>)', async t => {
  const { subSpec } = npa('foo@github:@owner/name@1.0.0')
  const registry = fetch.pickRegistry(subSpec, {
    '@owner:registry': 'https://npm.pkg.github.com/',
    registry: 'https://registry.npmjs.org/',
  })
  t.equal(registry, 'https://npm.pkg.github.com/')
})

t.test('getAuth: jsr: alias returns the JSR registry token', async t => {
  // pickRegistry + getAuth together are the full pacote → registry-fetch
  // handoff for deciding which credentials accompany an alias fetch.
  const opts = {
    '@jsr:registry': 'https://npm.jsr.io/',
    '//npm.jsr.io/:_authToken': 'jsr-secret',
    registry: 'https://registry.npmjs.org/',
    '//registry.npmjs.org/:_authToken': 'npm-secret',
  }
  const { subSpec } = npa('foo@jsr:@scope/name@1.0.0')
  const registry = fetch.pickRegistry(subSpec, opts)
  const auth = fetch.getAuth(registry, opts)
  t.equal(auth.token, 'jsr-secret',
    'alias auth comes from the JSR token, not the default-registry token')
})

t.test('getAuth: github: alias returns the GitHub Packages token', async t => {
  const opts = {
    '@owner:registry': 'https://npm.pkg.github.com/',
    '//npm.pkg.github.com/:_authToken': 'gh-secret',
    registry: 'https://registry.npmjs.org/',
    '//registry.npmjs.org/:_authToken': 'npm-secret',
  }
  const { subSpec } = npa('foo@github:@owner/name@1.0.0')
  const registry = fetch.pickRegistry(subSpec, opts)
  const auth = fetch.getAuth(registry, opts)
  t.equal(auth.token, 'gh-secret')
})

t.test('pickRegistry: npm: alias with unscoped target falls through to opts.registry', async t => {
  // npm: aliases with an unscoped target have no scope on the subSpec, so
  // registry selection drops through to opts.registry. Fences the generic
  // alias-unwrap path from accidentally diverging for the oldest prefix.
  const { subSpec } = npa('foo@npm:lodash@^4')
  const registry = fetch.pickRegistry(subSpec, {
    registry: 'https://registry.npmjs.org/',
  })
  t.equal(registry, 'https://registry.npmjs.org/')
})
