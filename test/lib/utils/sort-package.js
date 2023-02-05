const t = require('tap')
const createObjectjWithSortedKeys = require('../../../lib/utils/sort-package.js')

t.test('package.json has sorted keys on init', async (t) => {
  const unsortedPkg = {
    version: '9.4.1',
    name: 'npm',
    description: 'a package manager for JavaScript',
    workspaces: ['docs', 'smoke-tests', 'mock-registry', 'workspaces/*'],
    keywords: ['install', 'modules', 'package manager', 'package.json'],
    homepage: 'https://docs.npmjs.com/',
    author: 'GitHub Inc.',
    main: './index.js',
    license: 'Artistic-2.0',
  }
  const actual = createObjectjWithSortedKeys(unsortedPkg)

  const expected = {
    author: 'GitHub Inc.',
    description: 'a package manager for JavaScript',
    homepage: 'https://docs.npmjs.com/',
    keywords: ['install', 'modules', 'package manager', 'package.json'],
    license: 'Artistic-2.0',
    main: './index.js',
    name: 'npm',
    version: '9.4.1',
    workspaces: ['docs', 'smoke-tests', 'mock-registry', 'workspaces/*'],
  }
  t.strictSame(
    actual,
    expected,
    'should create package.json with keys in sorted order'
  )
})
