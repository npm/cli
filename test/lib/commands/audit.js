const fs = require('node:fs')
const zlib = require('node:zlib')
const path = require('node:path')
const t = require('tap')

const { default: tufmock } = require('@tufjs/repo-mock')
const { load: loadMockNpm } = require('../../fixtures/mock-npm')
const MockRegistry = require('@npmcli/mock-registry')

const gunzip = zlib.gunzipSync
const gzip = zlib.gzipSync

t.cleanSnapshot = str => str.replace(/package(s)? in [0-9]+[a-z]+/g, 'package$1 in xxx')

const tree = {
  'package.json': JSON.stringify({
    name: 'test-dep',
    version: '1.0.0',
    dependencies: {
      'test-dep-a': '*',
    },
  }),
  'package-lock.json': JSON.stringify({
    name: 'test-dep',
    version: '1.0.0',
    lockfileVersion: 2,
    requires: true,
    packages: {
      '': {
        xname: 'scratch',
        version: '1.0.0',
        dependencies: {
          'test-dep-a': '*',
        },
        devDependencies: {},
      },
      'node_modules/test-dep-a': {
        name: 'test-dep-a',
        version: '1.0.0',
      },
    },
    dependencies: {
      'test-dep-a': {
        version: '1.0.0',
      },
    },
  }),
  'test-dep-a-vuln': {
    'package.json': JSON.stringify({
      name: 'test-dep-a',
      version: '1.0.0',
    }),
    'vulnerable.txt': 'vulnerable test-dep-a',
  },
  'test-dep-a-fixed': {
    'package.json': JSON.stringify({
      name: 'test-dep-a',
      version: '1.0.1',
    }),
    'fixed.txt': 'fixed test-dep-a',
  },
}

t.test('normal audit', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    prefixDir: tree,
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })

  const manifest = registry.manifest({
    name: 'test-dep-a',
    packuments: [{ version: '1.0.0' }, { version: '1.0.1' }],
  })
  await registry.package({ manifest })
  const advisory = registry.advisory({
    id: 100,
    vulnerable_versions: '<1.0.1',
  })
  const bulkBody = gzip(JSON.stringify({ 'test-dep-a': ['1.0.0'] }))
  registry.nock.post('/-/npm/v1/security/advisories/bulk', bulkBody)
    .reply(200, {
      'test-dep-a': [advisory],
    })

  await npm.exec('audit', [])
  t.ok(process.exitCode, 'would have exited uncleanly')
  t.matchSnapshot(joinedOutput())
})

t.test('json audit', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    prefixDir: tree,
    config: {
      json: true,
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })

  const manifest = registry.manifest({
    name: 'test-dep-a',
    packuments: [{ version: '1.0.0' }, { version: '1.0.1' }],
  })
  await registry.package({ manifest })
  const advisory = registry.advisory({ id: 100 })
  const bulkBody = gzip(JSON.stringify({ 'test-dep-a': ['1.0.0'] }))
  registry.nock.post('/-/npm/v1/security/advisories/bulk', bulkBody)
    .reply(200, {
      'test-dep-a': [advisory],
    })

  await npm.exec('audit', [])
  t.ok(process.exitCode, 'would have exited uncleanly')
  t.matchSnapshot(joinedOutput())
})

t.test('audit fix - bulk endpoint', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    prefixDir: tree,
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
  })
  const manifest = registry.manifest({
    name: 'test-dep-a',
    packuments: [{ version: '1.0.0' }, { version: '1.0.1' }],
  })
  await registry.package({
    manifest,
    tarballs: {
      '1.0.1': path.join(npm.prefix, 'test-dep-a-fixed'),
    },
    times: 2,
  })
  const advisory = registry.advisory({ id: 100, vulnerable_versions: '1.0.0' })
  registry.nock.post('/-/npm/v1/security/advisories/bulk', body => {
    const unzipped = JSON.parse(gunzip(Buffer.from(body, 'hex')))
    return t.same(unzipped, { 'test-dep-a': ['1.0.0'] })
  })
    .reply(200, { // first audit
      'test-dep-a': [advisory],
    })
    .post('/-/npm/v1/security/advisories/bulk', body => {
      const unzipped = JSON.parse(gunzip(Buffer.from(body, 'hex')))
      return t.same(unzipped, { 'test-dep-a': ['1.0.1'] })
    })
    .reply(200, { // after fix
      'test-dep-a': [],
    })
  await npm.exec('audit', ['fix'])
  t.matchSnapshot(joinedOutput())
  const pkg = fs.readFileSync(path.join(npm.prefix, 'package-lock.json'), 'utf8')
  t.matchSnapshot(pkg, 'lockfile has test-dep-a@1.0.1')
  t.ok(
    fs.existsSync(path.join(npm.prefix, 'node_modules', 'test-dep-a', 'fixed.txt')),
    'has test-dep-a@1.0.1 on disk'
  )
})

t.test('audit fix no package lock', async t => {
  const { npm } = await loadMockNpm(t, {
    config: {
      'package-lock': false,
    },
  })
  await t.rejects(
    npm.exec('audit', ['fix']),
    { code: 'EUSAGE' }
  )
})

t.test('completion', async t => {
  const { audit } = await loadMockNpm(t, { command: 'audit' })
  t.test('fix', async t => {
    await t.resolveMatch(
      audit.completion({ conf: { argv: { remain: ['npm', 'audit'] } } }),
      ['fix'],
      'completes to fix'
    )
  })

  t.test('subcommand fix', async t => {
    await t.resolveMatch(
      audit.completion({ conf: { argv: { remain: ['npm', 'audit', 'fix'] } } }),
      [],
      'resolves to ?'
    )
  })

  t.test('subcommand not recognized', async t => {
    await t.rejects(audit.completion({ conf: { argv: { remain: ['npm', 'audit', 'repare'] } } }), {
      message: 'repare not recognized',
    })
  })
})

t.test('audit signatures', async t => {
  const VALID_REGISTRY_KEYS = {
    keys: [{
      expires: null,
      keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
      keytype: 'ecdsa-sha2-nistp256',
      scheme: 'ecdsa-sha2-nistp256',
      key: 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1Olb3zMAFFxXKHiIkQO5cJ3Yhl5i6UPp+' +
           'IhuteBJbuHcA5UogKo0EWtlWwW6KSaKoTNEYL7JlCQiVnkhBktUgg==',
    }],
  }

  const TUF_VALID_REGISTRY_KEYS = {
    keys: [{
      keyId: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
      keyUsage: 'npm:signatures',
      publicKey: {
        rawBytes: 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1Olb3zMAFFxXKHiIkQO5cJ3Yhl5i6UPp+' +
           'IhuteBJbuHcA5UogKo0EWtlWwW6KSaKoTNEYL7JlCQiVnkhBktUgg==',
        keyDetails: 'PKIX_ECDSA_P256_SHA_256',
        validFor: {
          start: '1999-01-01T00:00:00.000Z',
        },
      },
    }],
  }

  const TUF_MISMATCHING_REGISTRY_KEYS = {
    keys: [{
      keyId: 'SHA256:2l3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
      keyUsage: 'npm:signatures',
      publicKey: {
        rawBytes: 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1Olb3zMAFFxXKHiIkQO5cJ3Yhl5i6UPp+' +
           'IhuteBJbuHcA5UogKo0EWtlWwW6KSaKoTNEYL7JlCQiVnkhBktUgg==',
        keyDetails: 'PKIX_ECDSA_P256_SHA_256',
        validFor: {
          start: '1999-01-01T00:00:00.000Z',
        },
      },
    }],
  }

  const TUF_EXPIRED_REGISTRY_KEYS = {
    keys: [{
      keyId: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
      keyUsage: 'npm:signatures',
      publicKey: {
        rawBytes: 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1Olb3zMAFFxXKHiIkQO5cJ3Yhl5i6UPp+' +
           'IhuteBJbuHcA5UogKo0EWtlWwW6KSaKoTNEYL7JlCQiVnkhBktUgg==',
        keyDetails: 'PKIX_ECDSA_P256_SHA_256',
        validFor: {
          start: '1999-01-01T00:00:00.000Z',
          end: '2021-01-11T15:45:42.144Z',
        },
      },
    }],
  }

  const TUF_VALID_KEYS_TARGET = {
    name: 'registry.npmjs.org/keys.json',
    content: JSON.stringify(TUF_VALID_REGISTRY_KEYS),
  }

  const TUF_MISMATCHING_KEYS_TARGET = {
    name: 'registry.npmjs.org/keys.json',
    content: JSON.stringify(TUF_MISMATCHING_REGISTRY_KEYS),
  }

  const TUF_EXPIRED_KEYS_TARGET = {
    name: 'registry.npmjs.org/keys.json',
    content: JSON.stringify(TUF_EXPIRED_REGISTRY_KEYS),
  }

  const TUF_TARGET_NOT_FOUND = []

  const installWithValidSigs = {
    'package.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      dependencies: {
        'kms-demo': '1.0.0',
      },
    }),
    node_modules: {
      'kms-demo': {
        'package.json': JSON.stringify({
          name: 'kms-demo',
          version: '1.0.0',
        }),
      },
    },
    'package-lock.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          name: 'scratch',
          version: '1.0.0',
          dependencies: {
            'kms-demo': '^1.0.0',
          },
        },
        'node_modules/kms-demo': {
          version: '1.0.0',
        },
      },
      dependencies: {
        'kms-demo': {
          version: '1.0.0',
        },
      },
    }),
  }

  const installWithValidAttestations = {
    'package.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      dependencies: {
        sigstore: '1.0.0',
      },
    }),
    node_modules: {
      sigstore: {
        'package.json': JSON.stringify({
          name: 'sigstore',
          version: '1.0.0',
        }),
      },
    },
    'package-lock.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          name: 'test-dep',
          version: '1.0.0',
          dependencies: {
            sigstore: '^1.0.0',
          },
        },
        'node_modules/sigstore': {
          version: '1.0.0',
        },
      },
      dependencies: {
        sigstore: {
          version: '1.0.0',
        },
      },
    }),
  }

  const installWithMultipleValidAttestations = {
    'package.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      dependencies: {
        sigstore: '1.0.0',
        'tuf-js': '1.0.0',
      },
    }),
    node_modules: {
      sigstore: {
        'package.json': JSON.stringify({
          name: 'sigstore',
          version: '1.0.0',
        }),
      },
      'tuf-js': {
        'package.json': JSON.stringify({
          name: 'tuf-js',
          version: '1.0.0',
        }),
      },
    },
    'package-lock.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          name: 'test-dep',
          version: '1.0.0',
          dependencies: {
            sigstore: '^1.0.0',
            'tuf-js': '^1.0.0',
          },
        },
        'node_modules/sigstore': {
          version: '1.0.0',
        },
        'node_modules/tuf-js': {
          version: '1.0.0',
        },
      },
      dependencies: {
        sigstore: {
          version: '1.0.0',
        },
        'tuf-js': {
          version: '1.0.0',
        },
      },
    }),
  }

  const installWithAlias = {
    'package.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      dependencies: {
        get: 'npm:node-fetch@^1.0.0',
      },
    }),
    node_modules: {
      get: {
        'package.json': JSON.stringify({
          name: 'node-fetch',
          version: '1.7.1',
        }),
      },
    },
    'package-lock.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          name: 'test-dep',
          version: '1.0.0',
          dependencies: {
            get: 'npm:node-fetch@^1.0.0',
          },
        },
        'node_modules/demo': {
          name: 'node-fetch',
          version: '1.7.1',
        },
      },
      dependencies: {
        get: {
          version: 'npm:node-fetch@1.7.1',
        },
      },
    }),
  }

  const noInstall = {
    'package.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      dependencies: {
        'kms-demo': '1.0.0',
      },
    }),
    'package-lock.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          name: 'scratch',
          version: '1.0.0',
          dependencies: {
            'kms-demo': '^1.0.0',
          },
        },
        'node_modules/kms-demo': {
          version: '1.0.0',
        },
      },
      dependencies: {
        'kms-demo': {
          version: '1.0.0',
        },
      },
    }),
  }

  const workspaceInstall = {
    'package.json': JSON.stringify({
      name: 'workspaces-project',
      version: '1.0.0',
      workspaces: ['packages/*'],
      dependencies: {
        'kms-demo': '^1.0.0',
      },
    }),
    node_modules: {
      a: t.fixture('symlink', '../packages/a'),
      b: t.fixture('symlink', '../packages/b'),
      c: t.fixture('symlink', '../packages/c'),
      'kms-demo': {
        'package.json': JSON.stringify({
          name: 'kms-demo',
          version: '1.0.0',
        }),
      },
      async: {
        'package.json': JSON.stringify({
          name: 'async',
          version: '2.5.0',
        }),
      },
      'light-cycle': {
        'package.json': JSON.stringify({
          name: 'light-cycle',
          version: '1.4.2',
        }),
      },
    },
    packages: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.0',
          dependencies: {
            b: '^1.0.0',
            async: '^2.0.0',
          },
        }),
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.0.0',
          dependencies: {
            'light-cycle': '^1.0.0',
          },
        }),
      },
      c: {
        'package.json': JSON.stringify({
          name: 'c',
          version: '1.0.0',
        }),
      },
    },
  }

  const installWithMultipleDeps = {
    'package.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      dependencies: {
        'kms-demo': '^1.0.0',
      },
      devDependencies: {
        async: '~1.1.0',
      },
    }),
    node_modules: {
      'kms-demo': {
        'package.json': JSON.stringify({
          name: 'kms-demo',
          version: '1.0.0',
        }),
      },
      async: {
        'package.json': JSON.stringify({
          name: 'async',
          version: '1.1.1',
          dependencies: {
            'kms-demo': '^1.0.0',
          },
        }),
      },
    },
    'package-lock.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          name: 'scratch',
          version: '1.0.0',
          dependencies: {
            'kms-demo': '^1.0.0',
          },
          devDependencies: {
            async: '~1.0.0',
          },
        },
        'node_modules/kms-demo': {
          version: '1.0.0',
        },
        'node_modules/async': {
          version: '1.1.1',
        },
      },
      dependencies: {
        'kms-demo': {
          version: '1.0.0',
        },
        async: {
          version: '1.1.1',
          dependencies: {
            'kms-demo': '^1.0.0',
          },
        },
      },
    }),
  }

  const installWithPeerDeps = {
    'package.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      peerDependencies: {
        'kms-demo': '^1.0.0',
      },
    }),
    node_modules: {
      'kms-demo': {
        'package.json': JSON.stringify({
          name: 'kms-demo',
          version: '1.0.0',
        }),
      },
    },
    'package-lock.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          name: 'scratch',
          version: '1.0.0',
          peerDependencies: {
            'kms-demo': '^1.0.0',
          },
        },
        'node_modules/kms-demo': {
          version: '1.0.0',
        },
      },
      dependencies: {
        'kms-demo': {
          version: '1.0.0',
        },
      },
    }),
  }

  const installWithOptionalDeps = {
    'package.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      dependencies: {
        'kms-demo': '^1.0.0',
      },
      optionalDependencies: {
        lorem: '^1.0.0',
      },
    }, null, 2),
    node_modules: {
      'kms-demo': {
        'package.json': JSON.stringify({
          name: 'kms-demo',
          version: '1.0.0',
        }),
      },
    },
    'package-lock.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          name: 'scratch',
          version: '1.0.0',
          dependencies: {
            'kms-demo': '^1.0.0',
          },
          optionalDependencies: {
            lorem: '^1.0.0',
          },
        },
        'node_modules/kms-demo': {
          version: '1.0.0',
        },
      },
      dependencies: {
        'kms-demo': {
          version: '1.0.0',
        },
      },
    }),
  }

  const installWithMultipleRegistries = {
    'package.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      dependencies: {
        '@npmcli/arborist': '^1.0.0',
        'kms-demo': '^1.0.0',
      },
    }),
    node_modules: {
      '@npmcli/arborist': {
        'package.json': JSON.stringify({
          name: '@npmcli/arborist',
          version: '1.0.14',
        }),
      },
      'kms-demo': {
        'package.json': JSON.stringify({
          name: 'kms-demo',
          version: '1.0.0',
        }),
      },
    },
    'package-lock.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          name: 'test-dep',
          version: '1.0.0',
          dependencies: {
            '@npmcli/arborist': '^1.0.0',
            'kms-demo': '^1.0.0',
          },
        },
        'node_modules/@npmcli/arborist': {
          version: '1.0.14',
        },
        'node_modules/kms-demo': {
          version: '1.0.0',
        },
      },
      dependencies: {
        '@npmcli/arborist': {
          version: '1.0.14',
        },
        'kms-demo': {
          version: '1.0.0',
        },
      },
    }),
  }

  const installWithThirdPartyRegistry = {
    'package.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      dependencies: {
        '@npmcli/arborist': '^1.0.0',
      },
    }),
    node_modules: {
      '@npmcli/arborist': {
        'package.json': JSON.stringify({
          name: '@npmcli/arborist',
          version: '1.0.14',
        }),
      },
    },
    'package-lock.json': JSON.stringify({
      name: 'test-dep',
      version: '1.0.0',
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          name: 'test-dep',
          version: '1.0.0',
          dependencies: {
            '@npmcli/arborist': '^1.0.0',
          },
        },
        'node_modules/@npmcli/arborist': {
          version: '1.0.14',
        },
      },
      dependencies: {
        '@npmcli/arborist': {
          version: '1.0.14',
        },
      },
    }),
  }

  async function manifestWithValidSigs ({ registry }) {
    const manifest = registry.manifest({
      name: 'kms-demo',
      packuments: [{
        version: '1.0.0',
        dist: {
          tarball: 'https://registry.npmjs.org/kms-demo/-/kms-demo-1.0.0.tgz',
          integrity: 'sha512-QqZ7VJ/8xPkS9s2IWB7Shj3qTJdcRyeXKbPQnsZjsPEwvutGv0EGeVchPca' +
                     'uoiDFJlGbZMFq5GDCurAGNSghJQ==',
          signatures: [
            {
              keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
              sig: 'MEUCIDrLNspFeU5NZ6d55ycVBZIMXnPJi/XnI1Y2dlJvK8P1AiEAnXjn1IOMUd+U7YfPH' +
                   '+FNjwfLq+jCwfH8uaxocq+mpPk=',
            },
          ],
        },
      }],
    })
    await registry.package({ manifest })
  }

  async function manifestWithValidAttestations ({ registry }) {
    const manifest = registry.manifest({
      name: 'sigstore',
      packuments: [{
        version: '1.0.0',
        dist: {
          integrity: 'sha512-e+qfbn/zf1+rCza/BhIA//Awmf0v1pa5HQS8Xk8iXrn9bgytytVLqYD0P7NSqZ6IELTgq+tcDvLPkQjNHyWLNg==',
          tarball: 'https://registry.npmjs.org/sigstore/-/sigstore-1.0.0.tgz',
          attestations: { url: 'https://registry.npmjs.org/-/npm/v1/attestations/sigstore@1.0.0', provenance: { predicateType: 'https://slsa.dev/provenance/v0.2' } },
          signatures: [{ keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA', sig: 'MEQCIBlpcHT68iWOpx8pJr3WUzD1EqQ7tb0CmY36ebbceR6IAiAVGRaxrFoyh0/5B7H1o4VFhfsHw9F8G+AxOZQq87q+lg==' }],
        },
      }],
    })
    await registry.package({ manifest })
  }

  async function manifestWithMultipleValidAttestations ({ registry }) {
    const manifest = registry.manifest({
      name: 'tuf-js',
      packuments: [{
        version: '1.0.0',
        dist: {
          integrity: 'sha512-1dxsQwESDzACJjTdYHQ4wJ1f/of7jALWKfJEHSBWUQB/5UTJUx9SW6GHXp4mZ1KvdBRJCpGjssoPFGi4hvw8/A==',
          tarball: 'https://registry.npmjs.org/tuf-js/-/tuf-js-1.0.0.tgz',
          attestations: { url: 'https://registry.npmjs.org/-/npm/v1/attestations/tuf-js@1.0.0', provenance: { predicateType: 'https://slsa.dev/provenance/v0.2' } },
          signatures: [{ keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA', sig: 'MEYCIQDgGQeY2QLkLuoO9YxOqFZ+a6zYuaZpXhc77kUfdCUXDQIhAJp/vV+9Xg1bfM5YlTvKIH9agUEOu5T76+tQaHY2vZyO' }],
        },
      }],
    })
    await registry.package({ manifest })
  }

  async function manifestWithInvalidSigs ({ registry, name = 'kms-demo', version = '1.0.0' }) {
    const manifest = registry.manifest({
      name,
      packuments: [{
        version,
        dist: {
          tarball: `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`,
          integrity: 'sha512-QqZ7VJ/8xPkS9s2IWB7Shj3qTJdcRyeXKbPQnsZjsPEwvutGv0EGeVchPca' +
                     'uoiDFJlGbZMFq5GDCurAGNSghJQ==',
          signatures: [
            {
              keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
              sig: 'bogus',
            },
          ],
        },
      }],
    })
    await registry.package({ manifest })
  }

  async function manifestWithoutSigs ({ registry, name = 'kms-demo', version = '1.0.0' }) {
    const manifest = registry.manifest({
      name,
      packuments: [{
        version,
      }],
    })
    await registry.package({ manifest })
  }

  function mockTUF ({ target, npm }) {
    const opts = {
      baseURL: 'https://tuf-repo-cdn.sigstore.dev',
      metadataPathPrefix: '',
      cachePath: path.join(npm.cache, '_tuf', 'tuf-repo-cdn.sigstore.dev'),
    }
    return tufmock(target, opts)
  }

  t.test('with valid signatures', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidSigs,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidSigs({ registry })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /audited 1 package/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('with valid signatures using alias', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithAlias,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    const manifest = registry.manifest({
      name: 'node-fetch',
      packuments: [{
        version: '1.7.1',
        dist: {
          tarball: 'https://registry.npmjs.org/node-fetch/-/node-fetch-1.7.1.tgz',
          integrity: 'sha512-j8XsFGCLw79vWXkZtMSmmLaOk9z5SQ9bV/tkbZVCqvgwzrjAGq6' +
                     '6igobLofHtF63NvMTp2WjytpsNTGKa+XRIQ==',
          signatures: [
            {
              keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
              sig: 'MEYCIQDEn2XrrMXlRm+wh2tOIUyb0Km3ZujfT+6Mf61OXGK9zQIhANnPauUwx3' +
                   'N9RcQYQakDpOmLvYzNkySh7fmzmvyhk21j',
            },
          ],
        },
      }],
    })
    await registry.package({ manifest })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /audited 1 package/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('with key fallback to legacy API', async t => {
    const { logs, npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidSigs,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidSigs({ registry })
    mockTUF({ npm, target: TUF_TARGET_NOT_FOUND })
    registry.nock.get('/-/npm/v1/keys').reply(200, VALID_REGISTRY_KEYS)

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /audited 1 package/)
    t.match(logs.warn, ['Fetching verification keys using TUF failed.  Fetching directly from https://registry.npmjs.org/.'])
    t.matchSnapshot(joinedOutput())
  })

  t.test('with multiple valid signatures and one invalid', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: {
        'package.json': JSON.stringify({
          name: 'test-dep',
          version: '1.0.0',
          dependencies: {
            'kms-demo': '^1.0.0',
            'node-fetch': '^1.6.0',
          },
          devDependencies: {
            async: '~2.1.0',
          },
        }),
        node_modules: {
          'kms-demo': {
            'package.json': JSON.stringify({
              name: 'kms-demo',
              version: '1.0.0',
            }),
          },
          async: {
            'package.json': JSON.stringify({
              name: 'async',
              version: '2.5.0',
            }),
          },
          'node-fetch': {
            'package.json': JSON.stringify({
              name: 'node-fetch',
              version: '1.6.0',
            }),
          },
        },
        'package-lock.json': JSON.stringify({
          name: 'test-dep',
          version: '1.0.0',
          lockfileVersion: 2,
          requires: true,
          packages: {
            '': {
              name: 'test-dep',
              version: '1.0.0',
              dependencies: {
                'kms-demo': '^1.0.0',
                'node-fetch': '^1.6.0',
              },
              devDependencies: {
                async: '~2.1.0',
              },
            },
            'node_modules/kms-demo': {
              version: '1.0.0',
            },
            'node_modules/async': {
              version: '2.5.0',
            },
            'node_modules/node-fetch': {
              version: '1.6.0',
            },
          },
          dependencies: {
            'kms-demo': {
              version: '1.0.0',
            },
            'node-fetch': {
              version: '1.6.0',
            },
            async: {
              version: '2.5.0',
            },
          },
        }),
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidSigs({ registry })
    const asyncManifest = registry.manifest({
      name: 'async',
      packuments: [{
        version: '2.5.0',
        dist: {
          tarball: 'https://registry.npmjs.org/async/-/async-2.5.0.tgz',
          integrity: 'sha512-e+lJAJeNWuPCNyxZKOBdaJGyLGHugXVQtrAwtuAe2vhxTYxFT'
                     + 'KE73p8JuTmdH0qdQZtDvI4dhJwjZc5zsfIsYw==',
          signatures: [
            {
              keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
              sig: 'MEUCIQCM8cX2U3IVZKKhzQx1w5AlNSDUI+fVf4857K1qT0NTNgIgdT4qwEl' +
                   '/kg2vU1uIWUI0bGikRvVHCHlRs1rgjPMpRFA=',
            },
          ],
        },
      }],
    })
    await registry.package({ manifest: asyncManifest })
    await manifestWithInvalidSigs({ registry, name: 'node-fetch', version: '1.6.0' })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.match(joinedOutput(), /audited 3 packages/)
    t.match(joinedOutput(), /2 packages have verified registry signatures/)
    t.match(joinedOutput(), /1 package has an invalid registry signature/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('with bundled and peer deps and no signatures', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithPeerDeps,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidSigs({ registry })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /audited 1 package/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('with invalid signatures', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidSigs,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithInvalidSigs({ registry })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.match(joinedOutput(), /invalid registry signature/)
    t.match(joinedOutput(), /kms-demo@1.0.0/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('with valid and missing signatures', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithMultipleDeps,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidSigs({ registry })
    await manifestWithoutSigs({ registry, name: 'async', version: '1.1.1' })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.match(joinedOutput(), /audited 2 packages/)
    t.match(joinedOutput(), /verified registry signature/)
    t.match(joinedOutput(), /missing registry signature/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('with both invalid and missing signatures', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithMultipleDeps,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithInvalidSigs({ registry })
    await manifestWithoutSigs({ registry, name: 'async', version: '1.1.1' })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.match(joinedOutput(), /audited 2 packages/)
    t.match(joinedOutput(), /invalid/)
    t.match(joinedOutput(), /missing/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('with multiple invalid signatures', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithMultipleDeps,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithInvalidSigs({ registry, name: 'kms-demo', version: '1.0.0' })
    await manifestWithInvalidSigs({ registry, name: 'async', version: '1.1.1' })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.matchSnapshot(joinedOutput())
  })

  t.test('with multiple missing signatures', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithMultipleDeps,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithoutSigs({ registry, name: 'kms-demo', version: '1.0.0' })
    await manifestWithoutSigs({ registry, name: 'async', version: '1.1.1' })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.matchSnapshot(joinedOutput())
  })

  t.test('with signatures but no public keys', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: installWithValidSigs,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidSigs({ registry })
    mockTUF({ npm, target: TUF_TARGET_NOT_FOUND })
    registry.nock.get('/-/npm/v1/keys').reply(404)

    await t.rejects(
      npm.exec('audit', ['signatures']),
      /no corresponding public key can be found/,
      'should throw with error'
    )
  })

  t.test('with signatures but the public keys are expired', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: installWithValidSigs,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidSigs({ registry })
    mockTUF({ npm, target: TUF_EXPIRED_KEYS_TARGET })

    await t.rejects(
      npm.exec('audit', ['signatures']),
      /the corresponding public key has expired/,
      'should throw with error'
    )
  })

  t.test('with signatures but the public keyid does not match', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: installWithValidSigs,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidSigs({ registry })
    mockTUF({ npm, target: TUF_MISMATCHING_KEYS_TARGET })

    await t.rejects(
      npm.exec('audit', ['signatures']),
      /no corresponding public key can be found/,
      'should throw with error'
    )
  })

  t.test('with keys but missing signature', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidSigs,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithoutSigs({ registry })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.match(
      joinedOutput(),
      /registry is providing signing keys/
    )
    t.matchSnapshot(joinedOutput())
  })

  t.test('output details about missing signatures', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidSigs,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithoutSigs({ registry })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.match(
      joinedOutput(),
      /kms-demo/
    )
    t.matchSnapshot(joinedOutput())
  })

  t.test('json output with valid signatures', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidSigs,
      config: {
        json: true,
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidSigs({ registry })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), JSON.stringify({ invalid: [], missing: [] }, null, 2))
    t.matchSnapshot(joinedOutput())
  })

  t.test('json output with invalid signatures', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidSigs,
      config: {
        json: true,
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithInvalidSigs({ registry })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.matchSnapshot(joinedOutput())
  })

  t.test('json output with invalid and missing signatures', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithMultipleDeps,
      config: {
        json: true,
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithInvalidSigs({ registry })
    await manifestWithoutSigs({ registry, name: 'async', version: '1.1.1' })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.matchSnapshot(joinedOutput())
  })

  t.test('omit dev dependencies with missing signature', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithMultipleDeps,
      config: {
        omit: ['dev'],
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidSigs({ registry })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /audited 1 package/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('third-party registry without keys (E404) does not verify', async t => {
    const registryUrl = 'https://verdaccio-clone2.org'
    const { npm } = await loadMockNpm(t, {
      prefixDir: installWithThirdPartyRegistry,
      config: {
        scope: '@npmcli',
        registry: registryUrl,
      },
    })
    const registry = new MockRegistry({ tap: t, registry: registryUrl })
    const manifest = registry.manifest({
      name: '@npmcli/arborist',
      packuments: [{
        version: '1.0.14',
        dist: {
          tarball: 'https://registry.npmjs.org/@npmcli/arborist/-/@npmcli/arborist-1.0.14.tgz',
          integrity: 'sha512-caa8hv5rW9VpQKk6tyNRvSaVDySVjo9GkI7Wj/wcsFyxPm3tYrE' +
                      'sFyTjSnJH8HCIfEGVQNjqqKXaXLFVp7UBag==',
        },
      }],
    })
    await registry.package({ manifest })
    mockTUF({ npm, target: TUF_TARGET_NOT_FOUND })
    registry.nock.get('/-/npm/v1/keys').reply(404)

    await t.rejects(
      npm.exec('audit', ['signatures']),
      /found no dependencies to audit that were installed from a supported registry/
    )
  })

  t.test('third-party registry without keys (E400) does not verify', async t => {
    const registryUrl = 'https://verdaccio-clone2.org'
    const { npm } = await loadMockNpm(t, {
      prefixDir: installWithThirdPartyRegistry,
      config: {
        scope: '@npmcli',
        registry: registryUrl,
      },
    })
    const registry = new MockRegistry({ tap: t, registry: registryUrl })
    const manifest = registry.manifest({
      name: '@npmcli/arborist',
      packuments: [{
        version: '1.0.14',
        dist: {
          tarball: 'https://registry.npmjs.org/@npmcli/arborist/-/@npmcli/arborist-1.0.14.tgz',
          integrity: 'sha512-caa8hv5rW9VpQKk6tyNRvSaVDySVjo9GkI7Wj/wcsFyxPm3tYrE' +
              'sFyTjSnJH8HCIfEGVQNjqqKXaXLFVp7UBag==',
        },
      }],
    })
    await registry.package({ manifest })
    mockTUF({ npm, target: TUF_TARGET_NOT_FOUND })
    registry.nock.get('/-/npm/v1/keys').reply(400)

    await t.rejects(
      npm.exec('audit', ['signatures']),
      /found no dependencies to audit that were installed from a supported registry/
    )
  })

  t.test('third-party registry with keys and signatures', async t => {
    const registryUrl = 'https://verdaccio-clone.org'
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithThirdPartyRegistry,
      config: {
        scope: '@npmcli',
        registry: registryUrl,
      },
    })
    const registry = new MockRegistry({ tap: t, registry: registryUrl })

    const manifest = registry.manifest({
      name: '@npmcli/arborist',
      packuments: [{
        version: '1.0.14',
        dist: {
          tarball: 'https://registry.npmjs.org/@npmcli/arborist/-/@npmcli/arborist-1.0.14.tgz',
          integrity: 'sha512-caa8hv5rW9VpQKk6tyNRvSaVDySVjo9GkI7Wj/wcsFyxPm3tYrE' +
                     'sFyTjSnJH8HCIfEGVQNjqqKXaXLFVp7UBag==',
          signatures: [
            {
              keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
              sig: 'MEUCIAvNpR3G0j7WOPUuVMhE0ZdM8PnDNcsoeFD8Iwz9YWIMAiEAn8cicDC2' +
                   'Sf9MFQydqTv6S5XYsAh9Af1sig1nApNI11M=',
            },
          ],
        },
      }],
    })
    await registry.package({ manifest })
    mockTUF({ npm,
      target: {
        name: 'verdaccio-clone.org/keys.json',
        content: JSON.stringify(TUF_VALID_REGISTRY_KEYS),
      } })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /audited 1 package/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('third-party registry with invalid signatures errors', async t => {
    const registryUrl = 'https://verdaccio-clone.org'
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithThirdPartyRegistry,
      config: {
        scope: '@npmcli',
        registry: registryUrl,
      },
    })
    const registry = new MockRegistry({ tap: t, registry: registryUrl })

    const manifest = registry.manifest({
      name: '@npmcli/arborist',
      packuments: [{
        version: '1.0.14',
        dist: {
          tarball: 'https://registry.npmjs.org/@npmcli/arborist/-/@npmcli/arborist-1.0.14.tgz',
          integrity: 'sha512-caa8hv5rW9VpQKk6tyNRvSaVDySVjo9GkI7Wj/wcsFyxPm3tYrE' +
                     'sFyTjSnJH8HCIfEGVQNjqqKXaXLFVp7UBag==',
          signatures: [
            {
              keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
              sig: 'bogus',
            },
          ],
        },
      }],
    })
    await registry.package({ manifest })
    mockTUF({ npm,
      target: {
        name: 'verdaccio-clone.org/keys.json',
        content: JSON.stringify(TUF_VALID_REGISTRY_KEYS),
      } })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.match(joinedOutput(), /https:\/\/verdaccio-clone.org/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('third-party registry with keys and missing signatures errors', async t => {
    const registryUrl = 'https://verdaccio-clone.org'
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithThirdPartyRegistry,
      config: {
        scope: '@npmcli',
        registry: registryUrl,
      },
    })
    const registry = new MockRegistry({ tap: t, registry: registryUrl })

    const manifest = registry.manifest({
      name: '@npmcli/arborist',
      packuments: [{
        version: '1.0.14',
        dist: {
          tarball: 'https://registry.npmjs.org/@npmcli/arborist/-/@npmcli/arborist-1.0.14.tgz',
          integrity: 'sha512-caa8hv5rW9VpQKk6tyNRvSaVDySVjo9GkI7Wj/wcsFyxPm3tYrE' +
                     'sFyTjSnJH8HCIfEGVQNjqqKXaXLFVp7UBag==',
        },
      }],
    })
    await registry.package({ manifest })
    mockTUF({ npm,
      target: {
        name: 'verdaccio-clone.org/keys.json',
        content: JSON.stringify(TUF_VALID_REGISTRY_KEYS),
      } })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.match(joinedOutput(), /1 package has a missing registry signature/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('third-party registry with sub-path', async t => {
    const registryUrl = 'https://verdaccio-clone.org/npm'
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithThirdPartyRegistry,
      config: {
        scope: '@npmcli',
        registry: registryUrl,
      },
    })
    const registry = new MockRegistry({ tap: t, registry: registryUrl })

    const manifest = registry.manifest({
      name: '@npmcli/arborist',
      packuments: [{
        version: '1.0.14',
        dist: {
          tarball: 'https://registry.npmjs.org/@npmcli/arborist/-/@npmcli/arborist-1.0.14.tgz',
          integrity: 'sha512-caa8hv5rW9VpQKk6tyNRvSaVDySVjo9GkI7Wj/wcsFyxPm3tYrE' +
                     'sFyTjSnJH8HCIfEGVQNjqqKXaXLFVp7UBag==',
          signatures: [
            {
              keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
              sig: 'MEUCIAvNpR3G0j7WOPUuVMhE0ZdM8PnDNcsoeFD8Iwz9YWIMAiEAn8cicDC2' +
                   'Sf9MFQydqTv6S5XYsAh9Af1sig1nApNI11M=',
            },
          ],
        },
      }],
    })
    await registry.package({ manifest })

    mockTUF({ npm,
      target: {
        name: 'verdaccio-clone.org/npm/keys.json',
        content: JSON.stringify(TUF_VALID_REGISTRY_KEYS),
      } })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /audited 1 package/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('third-party registry with sub-path (trailing slash)', async t => {
    const registryUrl = 'https://verdaccio-clone.org/npm/'
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithThirdPartyRegistry,
      config: {
        scope: '@npmcli',
        registry: registryUrl,
      },
    })
    const registry = new MockRegistry({ tap: t, registry: registryUrl })

    const manifest = registry.manifest({
      name: '@npmcli/arborist',
      packuments: [{
        version: '1.0.14',
        dist: {
          tarball: 'https://registry.npmjs.org/@npmcli/arborist/-/@npmcli/arborist-1.0.14.tgz',
          integrity: 'sha512-caa8hv5rW9VpQKk6tyNRvSaVDySVjo9GkI7Wj/wcsFyxPm3tYrE' +
                     'sFyTjSnJH8HCIfEGVQNjqqKXaXLFVp7UBag==',
          signatures: [
            {
              keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
              sig: 'MEUCIAvNpR3G0j7WOPUuVMhE0ZdM8PnDNcsoeFD8Iwz9YWIMAiEAn8cicDC2' +
                   'Sf9MFQydqTv6S5XYsAh9Af1sig1nApNI11M=',
            },
          ],
        },
      }],
    })
    await registry.package({ manifest })

    mockTUF({ npm,
      target: {
        name: 'verdaccio-clone.org/npm/keys.json',
        content: JSON.stringify(TUF_VALID_REGISTRY_KEYS),
      } })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /audited 1 package/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('multiple registries with keys and signatures', async t => {
    const registryUrl = 'https://verdaccio-clone.org'
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: {
        ...installWithMultipleRegistries,
        '.npmrc': `@npmcli:registry=${registryUrl}\n`,
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    const thirdPartyRegistry = new MockRegistry({
      tap: t,
      registry: registryUrl,
    })
    await manifestWithValidSigs({ registry })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    const manifest = thirdPartyRegistry.manifest({
      name: '@npmcli/arborist',
      packuments: [{
        version: '1.0.14',
        dist: {
          tarball: 'https://registry.npmjs.org/@npmcli/arborist/-/@npmcli/arborist-1.0.14.tgz',
          integrity: 'sha512-caa8hv5rW9VpQKk6tyNRvSaVDySVjo9GkI7Wj/wcsFyxPm3tYrE' +
                     'sFyTjSnJH8HCIfEGVQNjqqKXaXLFVp7UBag==',
          signatures: [
            {
              keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
              sig: 'MEUCIAvNpR3G0j7WOPUuVMhE0ZdM8PnDNcsoeFD8Iwz9YWIMAiEAn8cicDC2' +
                   'Sf9MFQydqTv6S5XYsAh9Af1sig1nApNI11M=',
            },
          ],
        },
      }],
    })
    await thirdPartyRegistry.package({ manifest })
    thirdPartyRegistry.nock.get('/-/npm/v1/keys')
      .reply(200, {
        keys: [{
          expires: null,
          keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
          keytype: 'ecdsa-sha2-nistp256',
          scheme: 'ecdsa-sha2-nistp256',
          key: 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1Olb3zMAFFxXKHiIkQO5cJ3Yhl5i6UPp+' +
               'IhuteBJbuHcA5UogKo0EWtlWwW6KSaKoTNEYL7JlCQiVnkhBktUgg==',
        }],
      })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /audited 2 packages/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('errors with an empty install', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: {
        'package.json': JSON.stringify({
          name: 'test-dep',
          version: '1.0.0',
        }),
      },
    })

    await t.rejects(
      npm.exec('audit', ['signatures']),
      /found no installed dependencies to audit/
    )
  })

  t.test('errors when TUF errors', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: installWithMultipleDeps,
      mocks: {
        '@sigstore/tuf': {
          initTUF: async () => ({
            getTarget: async () => {
              throw new Error('error refreshing TUF metadata')
            },
          }),
        },
      },
    })

    await t.rejects(
      npm.exec('audit', ['signatures']),
      /error refreshing TUF metadata/
    )
  })

  t.test('errors when the keys endpoint errors', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: installWithMultipleDeps,
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    mockTUF({ npm, target: TUF_TARGET_NOT_FOUND })
    registry.nock.get('/-/npm/v1/keys')
      .reply(500, { error: 'keys broke' })

    await t.rejects(
      npm.exec('audit', ['signatures']),
      /keys broke/
    )
  })

  t.test('ignores optional dependencies', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithOptionalDeps,
    })

    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidSigs({ registry })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /audited 1 package/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('errors when no installed dependencies', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: noInstall,
    })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await t.rejects(
      npm.exec('audit', ['signatures']),
      /found no dependencies to audit that were installed from a supported registry/
    )
  })

  t.test('should skip missing non-prod deps', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: {
        'package.json': JSON.stringify({
          name: 'delta',
          version: '1.0.0',
          devDependencies: {
            chai: '^1.0.0',
          },
        }, null, 2),
        node_modules: {},
      },
    })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await t.rejects(
      npm.exec('audit', ['signatures']),
      /found no dependencies to audit that were installed from a supported registry/
    )
  })

  t.test('should skip invalid pkg ranges', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: {
        'package.json': JSON.stringify({
          name: 'delta',
          version: '1.0.0',
          dependencies: {
            cat: '>=^2',
          },
        }, null, 2),
        node_modules: {
          cat: {
            'package.json': JSON.stringify({
              name: 'cat',
              version: '1.0.0',
            }, null, 2),
          },
        },
      },
    })
    mockTUF({ npm, target: TUF_TARGET_NOT_FOUND })

    await t.rejects(
      npm.exec('audit', ['signatures']),
      /found no dependencies to audit that were installed from a supported registry/
    )
  })

  t.test('should skip git specs', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: {
        'package.json': JSON.stringify({
          name: 'delta',
          version: '1.0.0',
          dependencies: {
            cat: 'github:username/foo',
          },
        }, null, 2),
        node_modules: {
          cat: {
            'package.json': JSON.stringify({
              name: 'cat',
              version: '1.0.0',
            }, null, 2),
          },
        },
      },
    })

    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await t.rejects(
      npm.exec('audit', ['signatures']),
      /found no dependencies to audit that were installed from a supported registry/
    )
  })

  t.test('errors for global packages', async t => {
    const { npm } = await loadMockNpm(t, {
      config: { global: true },
    })

    await t.rejects(
      npm.exec('audit', ['signatures']),
      /`npm audit signatures` does not support global packages/,
      { code: 'ECIGLOBAL' }
    )
  })

  t.test('with invalid signatures and color output enabled', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidSigs,
      config: { color: 'always' },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithInvalidSigs({ registry })
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.match(
      joinedOutput(),
      // eslint-disable-next-line no-control-regex
      /\u001b\[91minvalid\u001b\[39m registry signature/
    )
    t.matchSnapshot(joinedOutput())
  })

  t.test('with valid attestations', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidAttestations,
      mocks: {
        pacote: t.mock('pacote', {
          sigstore: { verify: async () => true },
        }),
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidAttestations({ registry })
    const fixture = fs.readFileSync(
      path.resolve(__dirname, '../../fixtures/sigstore/valid-sigstore-attestations.json'),
      'utf8'
    )
    registry.nock.get('/-/npm/v1/attestations/sigstore@1.0.0').reply(200, fixture)
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /1 package has a verified attestation/)
    t.match(joinedOutput(), /use --json --include-attestations to view attestation details/)
    t.matchSnapshot(joinedOutput())
  })

  t.test('with valid attestations and --include-attestations (human-readable)', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidAttestations,
      config: {
        'include-attestations': true,
      },
      mocks: {
        pacote: t.mock('pacote', {
          sigstore: { verify: async () => true },
        }),
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidAttestations({ registry })
    const fixture = fs.readFileSync(
      path.resolve(__dirname, '../../fixtures/sigstore/valid-sigstore-attestations.json'),
      'utf8'
    )
    registry.nock.get('/-/npm/v1/attestations/sigstore@1.0.0').reply(200, fixture)
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /1 package has a verified attestation/)
    t.notMatch(joinedOutput(), /use --json --include-attestations to view attestation details/)
  })

  t.test('with valid attestations --json --include-attestations', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidAttestations,
      config: {
        json: true,
        'include-attestations': true,
      },
      mocks: {
        pacote: t.mock('pacote', {
          sigstore: { verify: async () => true },
        }),
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidAttestations({ registry })
    const fixture = fs.readFileSync(
      path.resolve(__dirname, '../../fixtures/sigstore/valid-sigstore-attestations.json'),
      'utf8'
    )
    registry.nock.get('/-/npm/v1/attestations/sigstore@1.0.0').reply(200, fixture)
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    const jsonOutput = JSON.parse(joinedOutput())
    t.ok(jsonOutput.verified, 'should include verified array')
    t.equal(jsonOutput.verified.length, 1, 'should have one verified package')
    t.equal(jsonOutput.verified[0].name, 'sigstore', 'should have correct package name')
    t.equal(jsonOutput.verified[0].version, '1.0.0', 'should have correct version')
    t.ok(jsonOutput.verified[0].attestations, 'should include attestations')
  })

  t.test('with valid attestations --json without --include-attestations', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidAttestations,
      config: {
        json: true,
      },
      mocks: {
        pacote: t.mock('pacote', {
          sigstore: { verify: async () => true },
        }),
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidAttestations({ registry })
    const fixture = fs.readFileSync(
      path.resolve(__dirname, '../../fixtures/sigstore/valid-sigstore-attestations.json'),
      'utf8'
    )
    registry.nock.get('/-/npm/v1/attestations/sigstore@1.0.0').reply(200, fixture)
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    const jsonOutput = JSON.parse(joinedOutput())
    t.notOk(jsonOutput.verified, 'should not include verified array')
  })

  t.test('with keyless attestations and no registry keys', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidAttestations,
      mocks: {
        pacote: t.mock('pacote', {
          sigstore: { verify: async () => true },
        }),
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    const manifest = registry.manifest({
      name: 'sigstore',
      packuments: [{
        version: '1.0.0',
        dist: {
          integrity: 'sha512-e+qfbn/zf1+rCza/BhIA//Awmf0v1pa5HQS8Xk8iXrn9bgytytVLqYD' +
                     '0P7NSqZ6IELTgq+tcDvLPkQjNHyWLNg==',
          tarball: 'https://registry.npmjs.org/sigstore/-/sigstore-1.0.0.tgz',
          attestations: {
            url: 'https://registry.npmjs.org/-/npm/v1/attestations/sigstore@1.0.0',
            provenance: { predicateType: 'https://slsa.dev/provenance/v0.2' },
          },
        },
      }],
    })
    await registry.package({ manifest })
    const fixture = fs.readFileSync(
      path.resolve(__dirname, '../../fixtures/sigstore/keyless-sigstore-attestations.json'),
      'utf8'
    )
    registry.nock.get('/-/npm/v1/attestations/sigstore@1.0.0').reply(200, JSON.parse(fixture))
    // TUF returns no keys and the keys endpoint returns 404
    mockTUF({ npm, target: TUF_TARGET_NOT_FOUND })
    registry.nock.get('/-/npm/v1/keys').reply(404)

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /1 package has a verified attestation/)
  })

  t.test('with multiple valid attestations', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithMultipleValidAttestations,
      mocks: {
        pacote: t.mock('pacote', {
          sigstore: { verify: async () => true },
        }),
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidAttestations({ registry })
    await manifestWithMultipleValidAttestations({ registry })
    const fixture1 = fs.readFileSync(
      path.join(__dirname, '../../fixtures/sigstore/valid-sigstore-attestations.json'),
      'utf8'
    )
    const fixture2 = fs.readFileSync(
      path.join(__dirname, '../../fixtures/sigstore/valid-tuf-js-attestations.json'),
      'utf8'
    )
    registry.nock.get('/-/npm/v1/attestations/sigstore@1.0.0').reply(200, fixture1)
    registry.nock.get('/-/npm/v1/attestations/tuf-js@1.0.0').reply(200, fixture2)
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.notOk(process.exitCode, 'should exit successfully')
    t.match(joinedOutput(), /2 packages have verified attestations/)
  })

  t.test('with invalid attestations', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidAttestations,
      mocks: {
        pacote: t.mock('pacote', {
          sigstore: {
            verify: async () => {
              throw new Error(`artifact signature verification failed`)
            },
          },
        }),
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidAttestations({ registry })
    const fixture = fs.readFileSync(
      path.join(__dirname, '../../fixtures/sigstore/valid-sigstore-attestations.json'),
      'utf8'
    )
    registry.nock.get('/-/npm/v1/attestations/sigstore@1.0.0').reply(200, fixture)
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.match(
      joinedOutput(),
      '1 package has an invalid attestation'
    )
    t.matchSnapshot(joinedOutput())
  })

  t.test('json output with invalid attestations', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithValidAttestations,
      config: {
        json: true,
      },
      mocks: {
        pacote: t.mock('pacote', {
          sigstore: {
            verify: async () => {
              throw new Error(`artifact signature verification failed`)
            },
          },
        }),
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidAttestations({ registry })
    const fixture = fs.readFileSync(
      path.join(__dirname, '../../fixtures/sigstore/valid-sigstore-attestations.json'),
      'utf8'
    )
    registry.nock.get('/-/npm/v1/attestations/sigstore@1.0.0').reply(200, fixture)
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.match(joinedOutput(), 'artifact signature verification failed')
    t.matchSnapshot(joinedOutput())
  })

  t.test('with multiple invalid attestations', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: installWithMultipleValidAttestations,
      mocks: {
        pacote: t.mock('pacote', {
          sigstore: {
            verify: async () => {
              throw new Error(`artifact signature verification failed`)
            },
          },
        }),
      },
    })
    const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
    await manifestWithValidAttestations({ registry })
    await manifestWithMultipleValidAttestations({ registry })
    const fixture1 = fs.readFileSync(
      path.join(__dirname, '../../fixtures/sigstore/valid-sigstore-attestations.json'),
      'utf8'
    )
    const fixture2 = fs.readFileSync(
      path.join(__dirname, '../../fixtures/sigstore/valid-tuf-js-attestations.json'),
      'utf8'
    )
    registry.nock.get('/-/npm/v1/attestations/sigstore@1.0.0').reply(200, fixture1)
    registry.nock.get('/-/npm/v1/attestations/tuf-js@1.0.0').reply(200, fixture2)
    mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

    await npm.exec('audit', ['signatures'])

    t.equal(process.exitCode, 1, 'should exit with error')
    t.match(
      joinedOutput(),
      '2 packages have invalid attestations'
    )
    t.matchSnapshot(joinedOutput())
  })

  t.test('workspaces', async t => {
    t.test('verifies registry deps and ignores local workspace deps', async t => {
      const { npm, joinedOutput } = await loadMockNpm(t, {
        prefixDir: workspaceInstall,
      })
      const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
      await manifestWithValidSigs({ registry })
      const asyncManifest = registry.manifest({
        name: 'async',
        packuments: [{
          version: '2.5.0',
          dist: {
            tarball: 'https://registry.npmjs.org/async/-/async-2.5.0.tgz',
            integrity: 'sha512-e+lJAJeNWuPCNyxZKOBdaJGyLGHugXVQtrAwtuAe2vhxTYxFT'
                       + 'KE73p8JuTmdH0qdQZtDvI4dhJwjZc5zsfIsYw==',
            signatures: [
              {
                keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
                sig: 'MEUCIQCM8cX2U3IVZKKhzQx1w5AlNSDUI+fVf4857K1qT0NTNgIgdT4qwEl' +
                     '/kg2vU1uIWUI0bGikRvVHCHlRs1rgjPMpRFA=',
              },
            ],
          },
        }],
      })
      const lightCycleManifest = registry.manifest({
        name: 'light-cycle',
        packuments: [{
          version: '1.4.2',
          dist: {
            tarball: 'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.2.tgz',
            integrity: 'sha512-badZ3KMUaGwQfVcHjXTXSecYSXxT6f99bT+kVzBqmO10U1UNlE' +
                       'thJ1XAok97E4gfDRTA2JJ3r0IeMPtKf0EJMw==',
            signatures: [
              {
                keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
                sig: 'MEUCIQDXjoxQz4MzPqaIuy2RJmBlcFp0UD3h9EhKZxxEz9IYZAIgLO0znG5' +
                     'aGciTAg4u8fE0/UXBU4gU7JcvTZGxW2BmKGw=',
              },
            ],
          },
        }],
      })
      await registry.package({ manifest: asyncManifest })
      await registry.package({ manifest: lightCycleManifest })
      mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

      await npm.exec('audit', ['signatures'])

      t.notOk(process.exitCode, 'should exit successfully')
      t.match(joinedOutput(), /audited 3 packages/)
      t.matchSnapshot(joinedOutput())
    })

    t.test('verifies registry deps when filtering by workspace name', async t => {
      const { npm, joinedOutput } = await loadMockNpm(t, {
        prefixDir: workspaceInstall,
        config: { workspace: './packages/a' },
      })
      const registry = new MockRegistry({ tap: t, registry: npm.config.get('registry') })
      const asyncManifest = registry.manifest({
        name: 'async',
        packuments: [{
          version: '2.5.0',
          dist: {
            tarball: 'https://registry.npmjs.org/async/-/async-2.5.0.tgz',
            integrity: 'sha512-e+lJAJeNWuPCNyxZKOBdaJGyLGHugXVQtrAwtuAe2vhxTYxFT'
                       + 'KE73p8JuTmdH0qdQZtDvI4dhJwjZc5zsfIsYw==',
            signatures: [
              {
                keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
                sig: 'MEUCIQCM8cX2U3IVZKKhzQx1w5AlNSDUI+fVf4857K1qT0NTNgIgdT4qwEl' +
                     '/kg2vU1uIWUI0bGikRvVHCHlRs1rgjPMpRFA=',
              },
            ],
          },
        }],
      })
      const lightCycleManifest = registry.manifest({
        name: 'light-cycle',
        packuments: [{
          version: '1.4.2',
          dist: {
            tarball: 'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.2.tgz',
            integrity: 'sha512-badZ3KMUaGwQfVcHjXTXSecYSXxT6f99bT+kVzBqmO10U1UNlE' +
                       'thJ1XAok97E4gfDRTA2JJ3r0IeMPtKf0EJMw==',
            signatures: [
              {
                keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
                sig: 'MEUCIQDXjoxQz4MzPqaIuy2RJmBlcFp0UD3h9EhKZxxEz9IYZAIgLO0znG5' +
                     'aGciTAg4u8fE0/UXBU4gU7JcvTZGxW2BmKGw=',
              },
            ],
          },
        }],
      })
      await registry.package({ manifest: asyncManifest })
      await registry.package({ manifest: lightCycleManifest })
      mockTUF({ npm, target: TUF_VALID_KEYS_TARGET })

      await npm.exec('audit', ['signatures'])

      t.notOk(process.exitCode, 'should exit successfully')
      t.match(joinedOutput(), /audited 2 packages/)
      t.matchSnapshot(joinedOutput())
    })

    // TODO: This should verify kms-demo, but doesn't because arborist filters
    // workspace deps even if they're also root deps
    t.test('verifies registry dep if workspaces is disabled', async t => {
      const { npm } = await loadMockNpm(t, {
        prefixDir: workspaceInstall,
        config: { workspaces: false },
      })

      await t.rejects(
        npm.exec('audit', ['signatures']),
        /found no installed dependencies to audit/
      )
    })
  })
})

t.test('audit min-release-age', async t => {
  // Tree fixture with a single registry dep we can mock.
  const cooldownTree = {
    'package.json': JSON.stringify({
      name: 'cooldown-test',
      version: '1.0.0',
      dependencies: {
        'old-dep': '1.0.0',
      },
    }),
    'package-lock.json': JSON.stringify({
      name: 'cooldown-test',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': {
          name: 'cooldown-test',
          version: '1.0.0',
          dependencies: {
            'old-dep': '1.0.0',
          },
        },
        'node_modules/old-dep': {
          version: '1.0.0',
          resolved: 'https://registry.npmjs.org/old-dep/-/old-dep-1.0.0.tgz',
          integrity: 'sha512-AAA',
        },
      },
    }),
  }

  const setupRegistry = (npm, t, { time, includeVersion = true } = {}) => {
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })
    const manifest = registry.manifest({
      name: 'old-dep',
      packuments: [{ version: '1.0.0' }],
    })
    if (!includeVersion) {
      delete manifest.versions['1.0.0']
    }
    if (time === null) {
      delete manifest.time
    } else if (time !== undefined) {
      manifest.time = { '1.0.0': time }
    }
    registry.nock.get('/old-dep').reply(200, manifest)
    return registry
  }

  t.test('errors when neither --min-release-age nor --before is set', async t => {
    const { npm } = await loadMockNpm(t, { prefixDir: cooldownTree })
    await t.rejects(
      npm.exec('audit', ['min-release-age']),
      {
        code: 'EUSAGE',
        message: /requires .*--min-release-age.* or .*--before/,
      }
    )
  })

  t.test('errors when cutoff is in the future', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: cooldownTree,
      config: { before: '2999-01-01' },
    })
    await t.rejects(
      npm.exec('audit', ['min-release-age']),
      {
        code: 'EUSAGE',
        message: /cutoff is in the future/,
      }
    )
  })

  t.test('errors when no lockfile is present', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: {
        'package.json': JSON.stringify({ name: 't', version: '1.0.0' }),
      },
      config: { 'min-release-age': 1 },
    })
    await t.rejects(
      npm.exec('audit', ['min-release-age']),
      /requires an existing package-lock\.json/
    )
  })

  t.test('passes when locked package is older than the cutoff', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: cooldownTree,
      config: { 'min-release-age': 1 },
    })
    setupRegistry(npm, t, { time: '2010-01-01T00:00:00.000Z' })
    await npm.exec('audit', ['min-release-age'])
    t.notOk(process.exitCode, 'exits cleanly')
    t.match(joinedOutput(), /audited 1 package/)
    t.match(joinedOutput(), /verified as published on or before the cutoff/)
  })

  t.test('fails when locked package is newer than the cutoff', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: cooldownTree,
      config: { 'min-release-age': 7 },
    })
    // Published "now" — should be inside the 7-day cooldown window.
    setupRegistry(npm, t, { time: new Date().toISOString() })
    await npm.exec('audit', ['min-release-age'])
    t.equal(process.exitCode, 1, 'exits with code 1')
    t.match(joinedOutput(), /1 package has a publish time newer than the cutoff/)
    t.match(joinedOutput(), /old-dep@1\.0\.0/)
  })

  t.test('json output reports violations', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: cooldownTree,
      config: { 'min-release-age': 7, json: true },
    })
    const publishedAt = new Date().toISOString()
    setupRegistry(npm, t, { time: publishedAt })
    await npm.exec('audit', ['min-release-age'])
    t.equal(process.exitCode, 1, 'exits with code 1')
    const result = JSON.parse(joinedOutput())
    t.equal(result.audited, 1)
    t.equal(result.verified, 0)
    t.equal(result.violations.length, 1)
    t.equal(result.violations[0].name, 'old-dep')
    t.equal(result.violations[0].version, '1.0.0')
    t.equal(result.violations[0].publishedAt, publishedAt)
    t.same(result.unverifiable, [])
  })

  t.test('reports missing time data as unverifiable', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: cooldownTree,
      config: { 'min-release-age': 1, json: true },
    })
    setupRegistry(npm, t, { time: null })
    await npm.exec('audit', ['min-release-age'])
    t.equal(process.exitCode, 1, 'exits with code 1 on unverifiable')
    const result = JSON.parse(joinedOutput())
    t.equal(result.violations.length, 0)
    t.equal(result.unverifiable.length, 1)
    t.equal(result.unverifiable[0].code, 'EMISSINGTIME')
  })

  t.test('reports unpublished version as unverifiable', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: cooldownTree,
      config: { 'min-release-age': 1, json: true },
    })
    setupRegistry(npm, t, { includeVersion: false, time: null })
    await npm.exec('audit', ['min-release-age'])
    t.equal(process.exitCode, 1)
    const result = JSON.parse(joinedOutput())
    t.equal(result.unverifiable.length, 1)
    t.equal(result.unverifiable[0].code, 'EUNPUBLISHED')
  })

  t.test('skips non-registry sources', async t => {
    // package.json declares old-dep as a git dep, lockfile resolves it as such.
    // No registry mock needed; if we incorrectly tried to fetch, nock would throw an unmocked-request error.
    const gitTree = {
      'package.json': JSON.stringify({
        name: 'cooldown-test',
        version: '1.0.0',
        dependencies: {
          'old-dep': 'git+https://example.com/old-dep.git',
        },
      }),
      'package-lock.json': JSON.stringify({
        name: 'cooldown-test',
        version: '1.0.0',
        lockfileVersion: 3,
        requires: true,
        packages: {
          '': {
            name: 'cooldown-test',
            version: '1.0.0',
            dependencies: {
              'old-dep': 'git+https://example.com/old-dep.git',
            },
          },
          'node_modules/old-dep': {
            version: '1.0.0',
            resolved: 'git+https://example.com/old-dep.git#abc123',
          },
        },
      }),
    }
    const { npm } = await loadMockNpm(t, {
      prefixDir: gitTree,
      config: { 'min-release-age': 1 },
    })
    await t.rejects(
      npm.exec('audit', ['min-release-age']),
      /found no registry dependencies in lockfile to audit/
    )
  })

  t.test('--before accepts an explicit date', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: cooldownTree,
      config: { before: '2015-01-01' },
    })
    // Published in 2010, before our 2015 cutoff → passes.
    setupRegistry(npm, t, { time: '2010-01-01T00:00:00.000Z' })
    await npm.exec('audit', ['min-release-age'])
    t.notOk(process.exitCode, 'exits cleanly')
    t.match(joinedOutput(), /verified as published on or before the cutoff/)
  })
})

// Integration tests using real captured packuments from the public registry.
// Fixtures live in test/fixtures/packuments/<name>.json and are full packuments (`fullMetadata: true`) including the registry's real `time` data.
// We use absolute `--before` dates so these tests stay deterministic over time.
t.test('audit min-release-age - real packument fixtures', async t => {
  const realPackuments = {
    abbrev: require('../../fixtures/packuments/abbrev.json'),
    once: require('../../fixtures/packuments/once.json'),
    inherits: require('../../fixtures/packuments/inherits.json'),
  }

  // Sanity: confirm fixtures match the publish times we assert on.
  // If npm republishes (which they shouldn't for these versions) we want a clear failure here, not in the assertions below.
  t.equal(realPackuments.abbrev.time['4.0.0'], '2025-10-20T18:51:05.929Z',
    'fixture: abbrev@4.0.0 publish time')
  t.equal(realPackuments.abbrev.time['1.1.1'], '2017-09-28T02:47:13.220Z',
    'fixture: abbrev@1.1.1 publish time')
  t.equal(realPackuments.once.time['1.4.0'], '2016-09-06T21:11:09.367Z',
    'fixture: once@1.4.0 publish time')
  t.equal(realPackuments.inherits.time['2.0.4'], '2019-06-19T20:18:52.465Z',
    'fixture: inherits@2.0.4 publish time')

  const lockfileFor = (deps) => {
    const packages = {
      '': {
        name: 'real-pku-test',
        version: '1.0.0',
        dependencies: deps,
      },
    }
    for (const [name, version] of Object.entries(deps)) {
      packages[`node_modules/${name}`] = {
        version,
        resolved: `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`,
        integrity: 'sha512-AAAAA',
      }
    }
    return {
      'package.json': JSON.stringify({
        name: 'real-pku-test',
        version: '1.0.0',
        dependencies: deps,
      }),
      'package-lock.json': JSON.stringify({
        name: 'real-pku-test',
        version: '1.0.0',
        lockfileVersion: 3,
        requires: true,
        packages,
      }),
    }
  }

  const mockRealRegistry = (npm, t, names) => {
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })
    for (const name of names) {
      registry.nock.get(`/${name}`).reply(200, realPackuments[name])
    }
    return registry
  }

  t.test('all locked packages predate the cutoff: clean exit', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: lockfileFor({ once: '1.4.0', inherits: '2.0.4' }),
      config: { before: '2025-01-01' },
    })
    mockRealRegistry(npm, t, ['once', 'inherits'])
    await npm.exec('audit', ['min-release-age'])
    t.notOk(process.exitCode, 'exits cleanly')
    t.match(joinedOutput(), /audited 2 packages against cutoff 2025-01-01/)
    t.match(joinedOutput(), /all 2 packages were verified/)
  })

  t.test('locked package post-dates the cutoff: violation', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: lockfileFor({ abbrev: '4.0.0' }),
      config: { before: '2025-01-01' },
    })
    mockRealRegistry(npm, t, ['abbrev'])
    await npm.exec('audit', ['min-release-age'])
    t.equal(process.exitCode, 1, 'exits with code 1')
    t.match(joinedOutput(), /1 package has a publish time newer than the cutoff/)
    t.match(joinedOutput(), /abbrev@4\.0\.0 \(published 2025-10-20T18:51:05\.929Z/)
  })

  t.test('mixed tree: ancient pass, fresh violate', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: lockfileFor({ abbrev: '4.0.0', once: '1.4.0' }),
      config: { before: '2020-01-01', json: true },
    })
    mockRealRegistry(npm, t, ['abbrev', 'once'])
    await npm.exec('audit', ['min-release-age'])
    t.equal(process.exitCode, 1, 'exits with code 1')
    const result = JSON.parse(joinedOutput())
    t.equal(result.cutoff, '2020-01-01T00:00:00.000Z')
    t.equal(result.audited, 2)
    t.equal(result.verified, 1)
    t.equal(result.violations.length, 1)
    t.equal(result.violations[0].name, 'abbrev')
    t.equal(result.violations[0].version, '4.0.0')
    t.equal(result.violations[0].publishedAt, '2025-10-20T18:51:05.929Z',
      'publishedAt comes straight from the real packument time')
    t.equal(result.unverifiable.length, 0)
  })

  t.test('cutoff exactly matches the publish time: passes (<= semantics)', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: lockfileFor({ abbrev: '1.1.1' }),
      // Cutoff is the exact publish time of abbrev@1.1.1.
      // The check is inclusive: published on or before the cutoff is fine.
      config: { before: '2017-09-28T02:47:13.220Z' },
    })
    mockRealRegistry(npm, t, ['abbrev'])
    await npm.exec('audit', ['min-release-age'])
    t.notOk(process.exitCode, 'exits cleanly')
    t.match(joinedOutput(), /all 1 package was verified/)
  })

  t.test('cutoff one ms before publish time: violation', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: lockfileFor({ abbrev: '1.1.1' }),
      // 1ms before publish.
      config: { before: '2017-09-28T02:47:13.219Z' },
    })
    mockRealRegistry(npm, t, ['abbrev'])
    await npm.exec('audit', ['min-release-age'])
    t.equal(process.exitCode, 1, 'exits with code 1')
  })

  t.test('locked version not in real packument: unverifiable', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      // 99.99.99 doesn't exist in the real abbrev packument.
      prefixDir: lockfileFor({ abbrev: '99.99.99' }),
      config: { before: '2025-01-01', json: true },
    })
    mockRealRegistry(npm, t, ['abbrev'])
    await npm.exec('audit', ['min-release-age'])
    t.equal(process.exitCode, 1, 'exits non-zero on unverifiable')
    const result = JSON.parse(joinedOutput())
    t.equal(result.unverifiable.length, 1)
    t.equal(result.unverifiable[0].name, 'abbrev')
    t.equal(result.unverifiable[0].version, '99.99.99')
    t.equal(result.unverifiable[0].code, 'EUNPUBLISHED')
  })

  t.test('multiple violations: all are reported in human and JSON output', async t => {
    // Cutoff is older than every version of every fixture, so all three packages violate.
    // Verifies that the report is not truncated to one entry and that ordering is stable (alphabetical by name).
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: lockfileFor({
        abbrev: '4.0.0',
        inherits: '2.0.4',
        once: '1.4.0',
      }),
      config: { before: '2010-01-01' },
    })
    mockRealRegistry(npm, t, ['abbrev', 'inherits', 'once'])

    await npm.exec('audit', ['min-release-age'])
    t.equal(process.exitCode, 1, 'exits with code 1')
    const out = joinedOutput()

    t.match(out, /3 packages have a publish time newer than the cutoff/,
      'header counts all 3 violations')
    t.match(out, /abbrev@4\.0\.0 \(published 2025-10-20T18:51:05\.929Z/,
      'lists abbrev with real publish time')
    t.match(out, /inherits@2\.0\.4 \(published 2019-06-19T20:18:52\.465Z/,
      'lists inherits with real publish time')
    t.match(out, /once@1\.4\.0 \(published 2016-09-06T21:11:09\.367Z/,
      'lists once with real publish time')

    // Ordering: alphabetical by name (sortByNameVersion).
    const idxAbbrev = out.indexOf('abbrev@4.0.0')
    const idxInherits = out.indexOf('inherits@2.0.4')
    const idxOnce = out.indexOf('once@1.4.0')
    t.ok(idxAbbrev < idxInherits && idxInherits < idxOnce,
      'violations are sorted alphabetically by package name')
  })

  t.test('multiple violations in JSON output', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: lockfileFor({
        abbrev: '4.0.0',
        inherits: '2.0.4',
        once: '1.4.0',
      }),
      config: { before: '2010-01-01', json: true },
    })
    mockRealRegistry(npm, t, ['abbrev', 'inherits', 'once'])

    await npm.exec('audit', ['min-release-age'])
    t.equal(process.exitCode, 1, 'exits with code 1')
    const result = JSON.parse(joinedOutput())
    t.equal(result.audited, 3)
    t.equal(result.verified, 0)
    t.equal(result.violations.length, 3, 'all 3 violations present in JSON')
    t.same(
      result.violations.map(v => `${v.name}@${v.version}`),
      ['abbrev@4.0.0', 'inherits@2.0.4', 'once@1.4.0'],
      'JSON violations are sorted alphabetically'
    )
    // Each entry has the real publish time straight from the packument.
    t.equal(result.violations[0].publishedAt, '2025-10-20T18:51:05.929Z')
    t.equal(result.violations[1].publishedAt, '2019-06-19T20:18:52.465Z')
    t.equal(result.violations[2].publishedAt, '2016-09-06T21:11:09.367Z')
  })
})

t.test('audit min-release-age - --allow-unverifiable escape hatch', async t => {
  const realPackuments = {
    abbrev: require('../../fixtures/packuments/abbrev.json'),
    once: require('../../fixtures/packuments/once.json'),
  }

  const lockfileFor = (deps) => {
    const packages = {
      '': { name: 'allow-test', version: '1.0.0', dependencies: deps },
    }
    for (const [name, version] of Object.entries(deps)) {
      packages[`node_modules/${name}`] = {
        version,
        resolved: `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`,
        integrity: 'sha512-AAAAA',
      }
    }
    return {
      'package.json': JSON.stringify({
        name: 'allow-test',
        version: '1.0.0',
        dependencies: deps,
      }),
      'package-lock.json': JSON.stringify({
        name: 'allow-test',
        version: '1.0.0',
        lockfileVersion: 3,
        requires: true,
        packages,
      }),
    }
  }

  const mockRealRegistry = (npm, t, names) => {
    const registry = new MockRegistry({
      tap: t,
      registry: npm.config.get('registry'),
    })
    for (const name of names) {
      registry.nock.get(`/${name}`).reply(200, realPackuments[name])
    }
    return registry
  }

  t.test('only-unverifiable + --allow-unverifiable: exits 0 but still reports', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      // 99.99.99 doesn't exist in the abbrev packument → unverifiable.
      prefixDir: lockfileFor({ abbrev: '99.99.99' }),
      config: { before: '2025-01-01', 'allow-unverifiable': true, json: true },
    })
    mockRealRegistry(npm, t, ['abbrev'])
    await npm.exec('audit', ['min-release-age'])
    t.notOk(process.exitCode, 'exits cleanly when only failures are unverifiable')
    const result = JSON.parse(joinedOutput())
    t.equal(result.allowUnverifiable, true, 'flag reflected in JSON output')
    t.equal(result.unverifiable.length, 1, 'unverifiable still listed')
    t.equal(result.violations.length, 0)
  })

  t.test('violations present + --allow-unverifiable: still exits 1', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      // abbrev@4.0.0 is a real violation; once@99.99.99 is unverifiable.
      prefixDir: lockfileFor({ abbrev: '4.0.0', once: '99.99.99' }),
      config: { before: '2025-01-01', 'allow-unverifiable': true, json: true },
    })
    mockRealRegistry(npm, t, ['abbrev', 'once'])
    await npm.exec('audit', ['min-release-age'])
    t.equal(process.exitCode, 1, 'violations still cause non-zero exit')
    const result = JSON.parse(joinedOutput())
    t.equal(result.violations.length, 1)
    t.equal(result.violations[0].name, 'abbrev')
    t.equal(result.unverifiable.length, 1)
    t.equal(result.unverifiable[0].name, 'once')
  })

  t.test('without --allow-unverifiable: unverifiable causes exit 1 (default)', async t => {
    const { npm } = await loadMockNpm(t, {
      prefixDir: lockfileFor({ abbrev: '99.99.99' }),
      config: { before: '2025-01-01' },
    })
    mockRealRegistry(npm, t, ['abbrev'])
    await npm.exec('audit', ['min-release-age'])
    t.equal(process.exitCode, 1, 'default behavior unchanged')
  })

  t.test('human output mentions --allow-unverifiable when it is in effect', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: lockfileFor({ abbrev: '99.99.99' }),
      config: { before: '2025-01-01', 'allow-unverifiable': true },
    })
    mockRealRegistry(npm, t, ['abbrev'])
    await npm.exec('audit', ['min-release-age'])
    t.notOk(process.exitCode, 'exits cleanly')
    t.match(
      joinedOutput(),
      /allowed by --allow-unverifiable/,
      'human output explains why the build wasn\'t failed'
    )
  })

  t.test('--allow-unverifiable is a no-op when nothing is unverifiable', async t => {
    const { npm, joinedOutput } = await loadMockNpm(t, {
      prefixDir: lockfileFor({ once: '1.4.0' }),
      config: { before: '2025-01-01', 'allow-unverifiable': true },
    })
    mockRealRegistry(npm, t, ['once'])
    await npm.exec('audit', ['min-release-age'])
    t.notOk(process.exitCode, 'exits cleanly')
    t.match(joinedOutput(), /all 1 package was verified/)
  })
})
