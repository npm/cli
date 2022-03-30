/*
 * Mock registry class
 *
 * This should end up as the centralized place where we generate test fixtures
 * for tests against any registry data.
 */
const pacote = require('pacote')
class MockRegistry {
  #tap
  #nock
  #registry
  #authorization

  constructor (opts) {
    if (!opts.registry) {
      throw new Error('mock registry requires a registry value')
    }
    this.#registry = (new URL(opts.registry)).origin
    this.#authorization = opts.authorization
    // Required for this.package
    this.#tap = opts.tap
  }

  get nock () {
    if (!this.#nock) {
      const tnock = require('./tnock.js')
      const reqheaders = {}
      if (this.#authorization) {
        reqheaders.authorization = `Bearer ${this.#authorization}`
      }
      this.#nock = tnock(this.#tap, this.#registry, { reqheaders })
    }
    return this.#nock
  }

  set nock (nock) {
    this.#nock = nock
  }

  async package ({ manifest, times = 1, query, tarballs }) {
    let nock = this.nock
    if (!nock) {
      throw new Error('cannot mock packages without a tap fixture')
    }
    nock = nock.get(`/${manifest.name}`).times(times)
    if (query) {
      nock = nock.query(query)
    }
    nock = nock.reply(200, manifest)
    if (tarballs) {
      for (const version in manifest.versions) {
        const packument = manifest.versions[version]
        const dist = new URL(packument.dist.tarball)
        const tarball = await pacote.tarball(tarballs[version])
        nock.get(dist.pathname).reply(200, tarball)
      }
    }
    this.nock = nock
  }

  // the last packument in the packuments array will be tagged as latest
  manifest ({ name = 'test-package', packuments } = {}) {
    packuments = this.packuments(packuments, name)
    const latest = packuments.slice(-1)[0]
    const manifest = {
      _id: `${name}@${latest.version}`,
      _rev: '00-testdeadbeef',
      name,
      description: 'test package mock manifest',
      dependencies: {},
      versions: {},
      time: {},
      'dist-tags': { latest: latest.version },
      ...latest,
    }

    for (const packument of packuments) {
      manifest.versions[packument.version] = {
        _id: `${name}@${packument.version}`,
        name,
        description: 'test package mock manifest',
        dependencies: {},
        dist: {
          tarball: `${this.#registry}/${name}/-/${name}-${packument.version}.tgz`,
        },
        ...packument,
      }
      manifest.time[packument.version] = new Date()
    }

    return manifest
  }

  packuments (packuments = ['1.0.0'], name) {
    return packuments.map(p => this.packument(p, name))
  }

  // Generate packument from shorthand
  packument (packument, name = 'test-package') {
    if (!packument.version) {
      packument = { version: packument }
    }
    return {
      name,
      version: '1.0.0',
      description: 'mocked test package',
      dependencies: {},
      ...packument,
    }
  }
}

module.exports = MockRegistry
