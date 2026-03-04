const t = require('tap')
const mockNpm = require('../../fixtures/mock-npm.js')

const mixedLicenseFixture = {
  'package.json': JSON.stringify({
    name: 'test-project',
    version: '1.0.0',
    dependencies: {
      'mit-pkg': '*',
      'isc-pkg': '*',
      'apache-pkg': '*',
    },
    devDependencies: {
      'dev-pkg': '*',
    },
  }),
  node_modules: {
    'mit-pkg': {
      'package.json': JSON.stringify({
        name: 'mit-pkg',
        version: '1.0.0',
        license: 'MIT',
        author: 'Test Author <test@example.com>',
        homepage: 'https://example.com/mit-pkg',
        repository: { type: 'git', url: 'https://github.com/test/mit-pkg.git' },
      }),
    },
    'isc-pkg': {
      'package.json': JSON.stringify({
        name: 'isc-pkg',
        version: '2.0.0',
        license: 'ISC',
        author: 'ISC Author',
      }),
    },
    'apache-pkg': {
      'package.json': JSON.stringify({
        name: 'apache-pkg',
        version: '3.0.0',
        license: 'Apache-2.0',
        repository: 'https://github.com/test/apache-pkg',
      }),
    },
    'dev-pkg': {
      'package.json': JSON.stringify({
        name: 'dev-pkg',
        version: '1.0.0',
        license: 'GPL-3.0-only',
      }),
    },
  },
}

const noLicenseFixture = {
  'package.json': JSON.stringify({
    name: 'no-license-project',
    version: '1.0.0',
    dependencies: {
      'no-license': '*',
    },
  }),
  node_modules: {
    'no-license': {
      'package.json': JSON.stringify({
        name: 'no-license',
        version: '1.0.0',
      }),
    },
  },
}

const legacyLicenseFixture = {
  'package.json': JSON.stringify({
    name: 'legacy-project',
    version: '1.0.0',
    dependencies: {
      'legacy-object': '*',
      'legacy-array': '*',
    },
  }),
  node_modules: {
    'legacy-object': {
      'package.json': JSON.stringify({
        name: 'legacy-object',
        version: '1.0.0',
        license: { type: 'MIT', url: 'https://opensource.org/licenses/MIT' },
      }),
    },
    'legacy-array': {
      'package.json': JSON.stringify({
        name: 'legacy-array',
        version: '1.0.0',
        licenses: [
          { type: 'MIT', url: 'https://opensource.org/licenses/MIT' },
          { type: 'Apache-2.0' },
        ],
      }),
    },
  },
}

const emptyFixture = {
  'package.json': JSON.stringify({
    name: 'empty-project',
    version: '1.0.0',
  }),
}

const nestedFixture = {
  'package.json': JSON.stringify({
    name: 'nested-project',
    version: '1.0.0',
    dependencies: {
      parent: '*',
    },
  }),
  node_modules: {
    parent: {
      'package.json': JSON.stringify({
        name: 'parent',
        version: '1.0.0',
        license: 'MIT',
        dependencies: {
          child: '^1.0.0',
        },
      }),
      node_modules: {
        child: {
          'package.json': JSON.stringify({
            name: 'child',
            version: '1.0.0',
            license: 'BSD-3-Clause',
          }),
        },
      },
    },
  },
}

const mockLicenses = async (t, { config, ...opts } = {}) => {
  const mock = await mockNpm(t, {
    ...opts,
    config: {
      all: true,
      ...config,
    },
    command: 'licenses',
  })

  return {
    ...mock,
    result: () => mock.joinedOutput(),
  }
}

t.test('basic table output', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: mixedLicenseFixture,
  })

  await licenses.exec([])
  const out = result()

  t.match(out, /Licenses for \d+ packages/)
  t.match(out, /MIT/)
  t.match(out, /ISC/)
  t.match(out, /Apache-2\.0/)
  t.match(out, /GPL-3\.0-only/)
  t.match(out, /mit-pkg@1\.0\.0/)
  t.match(out, /isc-pkg@2\.0\.0/)
  t.match(out, /apache-pkg@3\.0\.0/)
})

t.test('json output', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: mixedLicenseFixture,
    config: { json: true },
  })

  await licenses.exec([])
  const data = JSON.parse(result())

  t.ok(Array.isArray(data), 'output is an array')
  t.ok(data.length >= 3, 'has at least 3 packages')

  const mit = data.find(p => p.name === 'mit-pkg')
  t.ok(mit, 'has mit-pkg')
  t.equal(mit.license, 'MIT')
  t.equal(mit.version, '1.0.0')
  t.equal(mit.category, 'Permissive')

  const gpl = data.find(p => p.name === 'dev-pkg')
  t.ok(gpl, 'has dev-pkg')
  t.equal(gpl.license, 'GPL-3.0-only')
  t.equal(gpl.category, 'Copyleft')
})

t.test('json output --long', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: mixedLicenseFixture,
    config: { json: true, long: true },
  })

  await licenses.exec([])
  const data = JSON.parse(result())

  const mit = data.find(p => p.name === 'mit-pkg')
  t.ok(mit, 'has mit-pkg')
  t.equal(mit.homepage, 'https://example.com/mit-pkg')
  t.match(mit.repository, /github/)
  t.match(mit.author, /Test Author/)
  t.ok(mit.path, 'includes path in long output')
})

t.test('parseable output', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: mixedLicenseFixture,
    config: { parseable: true },
  })

  await licenses.exec([])
  const out = result()
  const lines = out.trim().split('\n')

  t.ok(lines.length >= 3, 'has at least 3 lines')
  for (const line of lines) {
    const parts = line.split('\t')
    t.ok(parts.length >= 3, 'each line has at least 3 tab-separated fields')
  }
  t.match(out, /mit-pkg@1\.0\.0\tMIT/)
})

t.test('parseable output --long', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: mixedLicenseFixture,
    config: { parseable: true, long: true },
  })

  await licenses.exec([])
  const out = result()
  const lines = out.trim().split('\n')
  const parts = lines[0].split('\t')
  t.ok(parts.length >= 6, 'long parseable has extra fields')
})

t.test('no dependencies', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: emptyFixture,
  })

  await licenses.exec([])
  t.match(result(), /No dependencies found/)
})

t.test('filter by license name', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: mixedLicenseFixture,
    config: { json: true },
  })

  await licenses.exec(['MIT'])
  const data = JSON.parse(result())

  t.ok(data.every(p => p.license === 'MIT'), 'all results are MIT')
  t.ok(data.length > 0, 'has results')
})

t.test('filter by category', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: mixedLicenseFixture,
    config: { json: true },
  })

  await licenses.exec(['Copyleft'])
  const data = JSON.parse(result())

  t.ok(data.every(p => p.category === 'Copyleft'), 'all results are Copyleft')
  t.ok(data.length > 0, 'has results')
})

t.test('filter with no matches warns', async t => {
  const { licenses, logs } = await mockLicenses(t, {
    prefixDir: mixedLicenseFixture,
  })

  await licenses.exec(['NONEXISTENT'])
  t.match(logs.warn, [/No packages found with license: NONEXISTENT/])
})

t.test('missing license shows UNLICENSED', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: noLicenseFixture,
    config: { json: true },
  })

  await licenses.exec([])
  const data = JSON.parse(result())

  const pkg = data.find(p => p.name === 'no-license')
  t.ok(pkg, 'found no-license package')
  t.equal(pkg.license, 'UNLICENSED')
  t.equal(pkg.category, 'Unknown')
})

t.test('legacy license object format', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: legacyLicenseFixture,
    config: { json: true },
  })

  await licenses.exec([])
  const data = JSON.parse(result())

  const obj = data.find(p => p.name === 'legacy-object')
  t.ok(obj, 'found legacy-object')
  t.equal(obj.license, 'MIT')

  const arr = data.find(p => p.name === 'legacy-array')
  t.ok(arr, 'found legacy-array')
  t.equal(arr.license, 'MIT OR Apache-2.0')
})

t.test('nested dependencies', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: nestedFixture,
    config: { json: true },
  })

  await licenses.exec([])
  const data = JSON.parse(result())

  t.ok(data.find(p => p.name === 'parent'), 'has parent')
  t.ok(data.find(p => p.name === 'child'), 'has child')
  t.equal(data.find(p => p.name === 'child').license, 'BSD-3-Clause')
})

t.test('omit dev dependencies', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: mixedLicenseFixture,
    config: { json: true, omit: ['dev'] },
  })

  await licenses.exec([])
  const data = JSON.parse(result())

  t.notOk(data.find(p => p.name === 'dev-pkg'), 'does not include dev-pkg')
  t.ok(data.find(p => p.name === 'mit-pkg'), 'includes mit-pkg')
})

t.test('author as object with email', async t => {
  const fixture = {
    'package.json': JSON.stringify({
      name: 'author-test',
      version: '1.0.0',
      dependencies: { 'obj-author': '*' },
    }),
    node_modules: {
      'obj-author': {
        'package.json': JSON.stringify({
          name: 'obj-author',
          version: '1.0.0',
          license: 'MIT',
          author: { name: 'Jane Doe', email: 'jane@example.com' },
        }),
      },
    },
  }

  const { licenses, result } = await mockLicenses(t, {
    prefixDir: fixture,
    config: { json: true, long: true },
  })

  await licenses.exec([])
  const data = JSON.parse(result())

  const pkg = data.find(p => p.name === 'obj-author')
  t.equal(pkg.author, 'Jane Doe <jane@example.com>')
})

t.test('SPDX expression license is Custom Expression category', async t => {
  const fixture = {
    'package.json': JSON.stringify({
      name: 'spdx-test',
      version: '1.0.0',
      dependencies: { 'dual-license': '*' },
    }),
    node_modules: {
      'dual-license': {
        'package.json': JSON.stringify({
          name: 'dual-license',
          version: '1.0.0',
          license: 'MIT OR Apache-2.0',
        }),
      },
    },
  }

  const { licenses, result } = await mockLicenses(t, {
    prefixDir: fixture,
    config: { json: true },
  })

  await licenses.exec([])
  const data = JSON.parse(result())
  const pkg = data.find(p => p.name === 'dual-license')
  t.equal(pkg.category, 'Custom Expression')
})

t.test('table output with --long shows author', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: mixedLicenseFixture,
    config: { long: true },
  })

  await licenses.exec([])
  const out = result()
  t.match(out, /Test Author/)
  t.match(out, /Author/)
})

t.test('license categories are correct', async t => {
  const { licenses, result } = await mockLicenses(t, {
    prefixDir: mixedLicenseFixture,
    config: { json: true },
  })

  await licenses.exec([])
  const data = JSON.parse(result())

  const mit = data.find(p => p.name === 'mit-pkg')
  t.equal(mit.category, 'Permissive')

  const isc = data.find(p => p.name === 'isc-pkg')
  t.equal(isc.category, 'Permissive')

  const apache = data.find(p => p.name === 'apache-pkg')
  t.equal(apache.category, 'Permissive')

  const gpl = data.find(p => p.name === 'dev-pkg')
  t.equal(gpl.category, 'Copyleft')
})
