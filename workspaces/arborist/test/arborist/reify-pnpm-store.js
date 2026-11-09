const { join } = require('node:path')
const fs = require('node:fs')
const t = require('tap')
const MockRegistry = require('@npmcli/mock-registry')
const Arborist = require('../..')

t.test('reify does not install dev dependencies from a pnpm store', async t => {
  const registryUrl = 'http://registry.npmjs.org'
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { 'is-number': '7.0.0' },
    }),
    node_modules: {
      'is-number': t.fixture('symlink', '.pnpm/is-number@7.0.0/node_modules/is-number'),
      '.pnpm': {
        'is-number@7.0.0': {
          node_modules: {
            'is-number': {
              'package.json': JSON.stringify({
                name: 'is-number',
                version: '7.0.0',
                devDependencies: { once: '1.4.0' },
              }),
            },
          },
        },
      },
    },
  })

  const registry = new MockRegistry({
    strict: true,
    tap: t,
    registry: registryUrl,
  })
  registry.mocks({ dir: join(__dirname, '..', 'fixtures') })

  const arb = new Arborist({
    path,
    cache: join(path, 'cache'),
    audit: false,
    registry: registryUrl,
  })
  await arb.reify({ add: ['abbrev@1.1.1'], ignoreScripts: true })

  t.ok(fs.existsSync(join(path, 'node_modules', 'abbrev')), 'requested package installed')
  t.notOk(fs.existsSync(join(path, 'node_modules', 'once')),
    'transitive pnpm package devDependency was not installed')
})
