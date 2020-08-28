const { test } = require('tap')

const requireInject = require('require-inject')

test('should add package to cache', (t) => {
  const tarballs = []
  const cache = requireInject('../../lib/cache.js', {
    '../../lib/npm.js': {
      globalDir: 'path/to/node_modules/',
      prefix: 'foo',
      flatOptions: {
        global: false
      },
      config: {
        get: () => true
      }
    },
    pacote: {
      tarball: {
        stream: (spec) => {
          tarballs.push(spec)
        }
      }
    }
  })

  t.test('using pacote', t => {
    console.log('cache: ', cache)
    cache(['add', 'fizzbuzz@1.0.0'], () => {
      t.similar(tarballs, ['fizzbuzz@1.0.0'])
      t.end()
    })
  })

  t.end()
})
