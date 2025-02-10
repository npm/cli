const Arborist = require('../..')
const { resolve, basename } = require('node:path')
const { writeFileSync } = require('node:fs')
const { mkdir, rm } = require('node:fs/promises')

const dir = resolve(__dirname, basename(__filename, '.js'))

const suite = async (suite, { registry, cache }) => {
  // setup two folders, one with a hidden lockfile, one without
  await mkdir(resolve(dir, 'with-hidden-lockfile'), { recursive: true })
  await mkdir(resolve(dir, 'no-hidden-lockfile'), { recursive: true })

  const dependencies = {
    'flow-parser': '0.114.0',
    'flow-remove-types': '2.114.0',
    ink: '2.6.0',
    tap: '14.10.5',
  }

  const promises = []
  {
    const arb = new Arborist({
      registry,
      cache,
      path: resolve(dir, 'with-hidden-lockfile'),
    })
    writeFileSync(resolve(arb.path, 'package.json'), JSON.stringify({
      name: 'benchmark-load-actual-with-hidden-lockfile',
      version: '1.0.0',
      dependencies,
    }))
    promises.push(arb.reify())
  }
  {
    const arb = new Arborist({
      registry,
      cache,
      path: resolve(dir, 'no-hidden-lockfile'),
    })
    writeFileSync(resolve(arb.path, 'package.json'), JSON.stringify({
      name: 'benchmark-load-actual-no-hidden-lockfile',
      version: '1.0.0',
      dependencies,
    }))
    promises.push(await arb.reify().then(() =>
      rm(resolve(arb.path, 'node_modules', '.package-lock.json'), { recursive: true, force: true })))
  }
  await Promise.all(promises)

  suite.add('loadActual with hidden lockfile', {
    defer: true,
    fn: (d) => new Arborist({
      registry,
      cache,
      path: resolve(dir, 'with-hidden-lockfile'),
    }).loadActual().then(() => d.resolve(), er => {
      throw er
    }),
  })

  suite.add('loadActual without hidden lockfile', {
    defer: true,
    fn: (d) => new Arborist({
      registry,
      cache,
      path: resolve(dir, 'no-hidden-lockfile'),
    }).loadActual().then(() => d.resolve(), er => {
      throw er
    }),
  })
}

const teardown = () => {}

module.exports = Object.assign(suite, { teardown })

if (module === require.main) {
  process.argv.push(basename(__filename, '.js'))
  require('../benchmark.js')
}
