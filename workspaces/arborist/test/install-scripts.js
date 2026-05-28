const t = require('tap')

const mockGetInstallScripts = (t, isNodeGypResult = () => false) =>
  t.mock('../lib/install-scripts.js', {
    '@npmcli/node-gyp': {
      isNodeGypPackage: async (path) => {
        if (typeof isNodeGypResult === 'function') {
          return isNodeGypResult(path)
        }
        return !!isNodeGypResult
      },
    },
  })

const node = ({
  scripts = {},
  gypfile,
  resolved = 'https://registry.npmjs.org/pkg/-/pkg-1.0.0.tgz',
  path = '/fake',
} = {}) => ({
  resolved,
  path,
  package: { scripts, ...(gypfile !== undefined ? { gypfile } : {}) },
})

t.test('collects preinstall, install, postinstall', async t => {
  const getInstallScripts = mockGetInstallScripts(t)
  t.strictSame(
    await getInstallScripts(node({ scripts: { preinstall: 'pre' } })),
    { preinstall: 'pre' }
  )
  t.strictSame(
    await getInstallScripts(node({ scripts: { install: 'inst' } })),
    { install: 'inst' }
  )
  t.strictSame(
    await getInstallScripts(node({ scripts: { postinstall: 'post' } })),
    { postinstall: 'post' }
  )
  t.strictSame(
    await getInstallScripts(node({ scripts: {} })),
    {}
  )
})

t.test('ignores unrelated scripts', async t => {
  const getInstallScripts = mockGetInstallScripts(t)
  t.strictSame(
    await getInstallScripts(node({ scripts: { test: 'x', build: 'y' } })),
    {}
  )
})

t.test('prepare only counts for non-registry sources', async t => {
  const getInstallScripts = mockGetInstallScripts(t)
  // registry: prepare ignored
  t.strictSame(
    await getInstallScripts(node({
      scripts: { prepare: 'do' },
      resolved: 'https://registry.npmjs.org/x/-/x-1.0.0.tgz',
    })),
    {}
  )
  // git: prepare counts
  t.strictSame(
    await getInstallScripts(node({
      scripts: { prepare: 'do' },
      resolved: 'git+ssh://git@github.com/foo/bar.git#abc',
    })),
    { prepare: 'do' }
  )
  // file: prepare counts
  t.strictSame(
    await getInstallScripts(node({
      scripts: { prepare: 'do' },
      resolved: 'file:../local',
    })),
    { prepare: 'do' }
  )
})

t.test('synthetic node-gyp install detected via binding.gyp', async t => {
  const getInstallScripts = mockGetInstallScripts(t, () => true)
  t.strictSame(
    await getInstallScripts(node()),
    { install: 'node-gyp rebuild' }
  )
})

t.test('synthetic node-gyp suppressed when gypfile: false', async t => {
  const getInstallScripts = mockGetInstallScripts(t, () => true)
  t.strictSame(
    await getInstallScripts(node({ gypfile: false })),
    {}
  )
})

t.test('synthetic node-gyp suppressed when explicit install is present', async t => {
  const getInstallScripts = mockGetInstallScripts(t, () => true)
  t.strictSame(
    await getInstallScripts(node({ scripts: { install: 'real-install' } })),
    { install: 'real-install' }
  )
})

t.test('synthetic node-gyp suppressed when explicit preinstall is present', async t => {
  const getInstallScripts = mockGetInstallScripts(t, () => true)
  t.strictSame(
    await getInstallScripts(node({ scripts: { preinstall: 'real-pre' } })),
    { preinstall: 'real-pre' }
  )
})

t.test('node-gyp detection error is treated as not-gyp', async t => {
  const getInstallScripts = t.mock('../lib/install-scripts.js', {
    '@npmcli/node-gyp': {
      isNodeGypPackage: async () => {
        throw new Error('fs blew up')
      },
    },
  })
  t.strictSame(await getInstallScripts(node()), {})
})

t.test('missing resolved treated as registry (prepare ignored)', async t => {
  const getInstallScripts = mockGetInstallScripts(t)
  // Construct the node directly so the destructuring default in the test
  // helper does not substitute a registry URL for the missing resolved
  // field. Exercises the fallback path in isRegistrySource.
  const missingResolved = {
    path: '/fake',
    package: { scripts: { prepare: 'do' } },
  }
  t.strictSame(await getInstallScripts(missingResolved), {})
})

t.test('prepare counts for non-registry deps even when resolved URL looks registry-like', async t => {
  const getInstallScripts = mockGetInstallScripts(t)
  // A fork hosted at a URL that happens to follow the npm registry tarball
  // shape. Arborist's edge-based check (isRegistryDependency=false) is
  // authoritative — prepare must NOT be skipped just because the URL pattern
  // matches.
  const nonRegistry = {
    resolved: 'https://corp.example.com/mirror/sharp/-/sharp-1.0.0.tgz',
    path: '/fake',
    isRegistryDependency: false,
    package: { scripts: { prepare: 'do' } },
  }
  t.strictSame(await getInstallScripts(nonRegistry), { prepare: 'do' })
})

t.test('prepare is skipped for registry deps regardless of resolved URL shape', async t => {
  const getInstallScripts = mockGetInstallScripts(t)
  const registryNode = {
    resolved: 'https://internal.corp/private-registry/sharp/-/sharp-1.0.0.tgz',
    path: '/fake',
    isRegistryDependency: true,
    package: { scripts: { prepare: 'do' } },
  }
  t.strictSame(await getInstallScripts(registryNode), {})
})

t.test('lockfile-only node with hasInstallScript=true emits a sentinel', async t => {
  // Loaded from a lockfile (e.g. `npm ci` virtualTree, or strict mode's
  // preflight against the idealTree before reify has fetched manifests):
  // the lockfile records `hasInstallScript: true` but does not inline
  // the script bodies. Without a sentinel the preflight would miss this
  // node entirely and let install scripts run.
  const getInstallScripts = mockGetInstallScripts(t)
  const lockfileNode = {
    resolved: 'https://registry.npmjs.org/pkg/-/pkg-1.0.0.tgz',
    path: '/fake',
    isRegistryDependency: true,
    hasInstallScript: true,
    package: { name: 'pkg', version: '1.0.0' },
  }
  t.strictSame(
    await getInstallScripts(lockfileNode),
    { install: '(install scripts present)' }
  )
})

t.test('sentinel is not emitted when scripts are already enumerated', async t => {
  // If `hasInstallScript: true` coexists with a real `scripts` map, we
  // surface the real names, and the sentinel must not overwrite them.
  const getInstallScripts = mockGetInstallScripts(t)
  const node = {
    resolved: 'https://registry.npmjs.org/pkg/-/pkg-1.0.0.tgz',
    path: '/fake',
    isRegistryDependency: true,
    hasInstallScript: true,
    package: { scripts: { postinstall: 'echo hi' } },
  }
  t.strictSame(await getInstallScripts(node), { postinstall: 'echo hi' })
})

t.test('sentinel is not emitted when hasInstallScript is absent', async t => {
  // Defensive: a lockfile entry without `hasInstallScript` (the common
  // case) still returns {} so we don't false-positive every dep.
  const getInstallScripts = mockGetInstallScripts(t)
  const node = {
    resolved: 'https://registry.npmjs.org/pkg/-/pkg-1.0.0.tgz',
    path: '/fake',
    isRegistryDependency: true,
    package: { name: 'pkg', version: '1.0.0' },
  }
  t.strictSame(await getInstallScripts(node), {})
})

t.test('lockfile-only node hydrates real scripts from package.json on disk', async t => {
  // The common lockfile-driven case (`npm ci`, a repeat `npm install`):
  // `node.package.scripts` is empty but the package is unpacked on disk.
  // We must read the installed package.json and surface the real script
  // body instead of the sentinel.
  const getInstallScripts = mockGetInstallScripts(t)
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'pkg',
      version: '1.0.0',
      scripts: { postinstall: 'node -e "console.log(1)"' },
    }),
  })
  const lockfileNode = {
    resolved: 'https://registry.npmjs.org/pkg/-/pkg-1.0.0.tgz',
    path,
    isRegistryDependency: true,
    hasInstallScript: true,
    package: { name: 'pkg', version: '1.0.0' },
  }
  t.strictSame(
    await getInstallScripts(lockfileNode),
    { postinstall: 'node -e "console.log(1)"' }
  )
})

t.test('lockfile-only node hydrates an explicit install script from disk', async t => {
  // A native package such as fsevents that ships a prebuilt binary (no
  // binding.gyp, so synthetic gyp detection finds nothing) but declares an
  // explicit `install: node-gyp rebuild`. The disk read must recover it
  // rather than emitting the sentinel.
  const getInstallScripts = mockGetInstallScripts(t)
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'fsevents',
      version: '2.3.3',
      scripts: { install: 'node-gyp rebuild' },
    }),
  })
  const lockfileNode = {
    resolved: 'https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz',
    path,
    isRegistryDependency: true,
    hasInstallScript: true,
    package: { name: 'fsevents', version: '2.3.3' },
  }
  t.strictSame(
    await getInstallScripts(lockfileNode),
    { install: 'node-gyp rebuild' }
  )
})

t.test('lockfile-only node hydrates a preinstall script from disk', async t => {
  // Cover the disk `preinstall` recovery path.
  const getInstallScripts = mockGetInstallScripts(t)
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'pkg',
      version: '1.0.0',
      scripts: { preinstall: 'node pre.js' },
    }),
  })
  const lockfileNode = {
    resolved: 'https://registry.npmjs.org/pkg/-/pkg-1.0.0.tgz',
    path,
    isRegistryDependency: true,
    hasInstallScript: true,
    package: { name: 'pkg', version: '1.0.0' },
  }
  t.strictSame(
    await getInstallScripts(lockfileNode),
    { preinstall: 'node pre.js' }
  )
})

t.test('lockfile-only non-registry node hydrates prepare from disk', async t => {
  // A git/file dependency installed from a lockfile: `prepare` runs for
  // non-registry sources, so the disk read must recover it.
  const getInstallScripts = mockGetInstallScripts(t)
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'pkg',
      version: '1.0.0',
      scripts: { prepare: 'node build.js' },
    }),
  })
  const lockfileNode = {
    resolved: 'git+ssh://git@github.com/foo/bar.git#abc',
    path,
    isRegistryDependency: false,
    hasInstallScript: true,
    package: { name: 'pkg', version: '1.0.0' },
  }
  t.strictSame(
    await getInstallScripts(lockfileNode),
    { prepare: 'node build.js' }
  )
})

t.test('hydrated prepare is ignored for registry deps', async t => {
  // Hydration reuses the same registry/non-registry boundary as the
  // in-memory path: a registry dep whose on-disk package.json only has a
  // `prepare` script falls through to the sentinel, since `prepare` never
  // runs for registry installs.
  const getInstallScripts = mockGetInstallScripts(t)
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'pkg',
      version: '1.0.0',
      scripts: { prepare: 'build' },
    }),
  })
  const lockfileNode = {
    resolved: 'https://registry.npmjs.org/pkg/-/pkg-1.0.0.tgz',
    path,
    isRegistryDependency: true,
    hasInstallScript: true,
    package: { name: 'pkg', version: '1.0.0' },
  }
  t.strictSame(
    await getInstallScripts(lockfileNode),
    { install: '(install scripts present)' }
  )
})

t.test('falls back to sentinel when on-disk package.json has no install scripts', async t => {
  // The lockfile flagged install scripts but the on-disk package.json has
  // none we recognise (e.g. only lifecycle scripts like `test`). Keep the
  // sentinel so the advisory still surfaces that something was flagged.
  const getInstallScripts = mockGetInstallScripts(t)
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'pkg',
      version: '1.0.0',
      scripts: { test: 'tap' },
    }),
  })
  const lockfileNode = {
    resolved: 'https://registry.npmjs.org/pkg/-/pkg-1.0.0.tgz',
    path,
    isRegistryDependency: true,
    hasInstallScript: true,
    package: { name: 'pkg', version: '1.0.0' },
  }
  t.strictSame(
    await getInstallScripts(lockfileNode),
    { install: '(install scripts present)' }
  )
})

t.test('disk hydration does not mutate node.package', async t => {
  // The enumeration helper is read-only: recovering scripts from disk must
  // not write them back onto the node (unlike Builder#addToBuildSet, which
  // owns the node and hydrates it deliberately).
  const getInstallScripts = mockGetInstallScripts(t)
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'pkg',
      version: '1.0.0',
      scripts: { postinstall: 'echo hi' },
    }),
  })
  const pkg = { name: 'pkg', version: '1.0.0' }
  const lockfileNode = {
    resolved: 'https://registry.npmjs.org/pkg/-/pkg-1.0.0.tgz',
    path,
    isRegistryDependency: true,
    hasInstallScript: true,
    package: pkg,
  }
  await getInstallScripts(lockfileNode)
  t.strictSame(pkg, { name: 'pkg', version: '1.0.0' }, 'node.package untouched')
  t.notOk(pkg.scripts, 'no scripts written back onto node.package')
})
