const t = require('tap')

let prefix
const _flatOptions = {
  json: false,
  global: false,
  get prefix () {
    return prefix
  },
}

const readLocalPackageName = t.mock('../../../lib/utils/read-local-package.js', {
  '../../../lib/npm.js': {
    flatOptions: _flatOptions,
  },
})

t.test('read local package.json', async (t) => {
  prefix = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-local-package',
      version: '1.0.0',
    }),
  })
  const packageName = await readLocalPackageName()
  t.equal(
    packageName,
    'my-local-package',
    'should retrieve current package name'
  )
})

t.test('read local scoped-package.json', async (t) => {
  prefix = t.testdir({
    'package.json': JSON.stringify({
      name: '@my-scope/my-local-package',
      version: '1.0.0',
    }),
  })
  const packageName = await readLocalPackageName()
  t.equal(
    packageName,
    '@my-scope/my-local-package',
    'should retrieve scoped package name'
  )
})

t.test('read using --global', async (t) => {
  prefix = t.testdir({})
  _flatOptions.global = true
  const packageName = await readLocalPackageName()
  t.equal(
    packageName,
    undefined,
    'should not retrieve a package name'
  )
  _flatOptions.global = false
})
