const pacote = require('pacote')
const Arborist = require('@npmcli/arborist')
const npa = require('npm-package-arg')
const Nock = require('nock')

class MockRegistry {
  #tap
  #nock
  #registry
  #authorization
  #basic
  #debug
  #strict

  constructor (opts) {
    if (!opts.registry) {
      throw new Error('mock registry requires a registry value')
    }
    this.#registry = new URL(opts.registry)
    this.#authorization = opts.authorization
    this.#basic = opts.basic
    this.#debug = opts.debug
    this.#strict = opts.strict
    // Required for this.package
    this.#tap = opts.tap
    if (this.#tap) {
      this.startNock()
    }
  }

  static tnock (t, host, opts, { debug = false, strict = false } = {}) {
    const noMatch = (req) => {
      if (debug) {
        console.error('NO MATCH', t.name, req.options ? req.options : req.path)
      }
      if (strict) {
        // There are network requests that get caught regardless of error code.
        // Turning on strict mode requires that those requests get explicitly
        // mocked with a 404, 500, etc.
        // XXX: this is opt-in currently because it breaks some existing CLI
        // tests. We should work towards making this the default for all tests.
        t.fail(`Unmatched request: ${JSON.stringify(req, null, 2)}`)
      }
    }

    Nock.emitter.on('no match', noMatch)
    Nock.disableNetConnect()
    const server = Nock(host, opts)

    if (strict) {
      // this requires that mocks not be shared between sub tests but it helps
      // find mistakes quicker instead of waiting for the entire test to end
      t.afterEach((t) => {
        t.strictSame(server.pendingMocks(), [], 'no pending mocks after each')
        t.strictSame(server.activeMocks(), [], 'no active mocks after each')
      })
    }

    t.teardown(() => {
      Nock.enableNetConnect()
      server.done()
      Nock.emitter.off('no match', noMatch)
    })

    return server
  }

  get origin () {
    return this.#registry.origin
  }

  get pathname () {
    if (this.#registry.pathname.endsWith('/')) {
      return this.#registry.pathname.slice(0, -1)
    }
    return this.#registry.pathname
  }

  get nock () {
    return this.#nock
  }

  set nock (nock) {
    this.#nock = nock
  }

  startNock () {
    if (this.nock) {
      return
    }

    if (!this.#tap) {
      throw new Error('cannot mock packages without a tap fixture')
    }

    const reqheaders = {}
    if (this.#authorization) {
      reqheaders.authorization = `Bearer ${this.#authorization}`
    }
    if (this.#basic) {
      reqheaders.authorization = `Basic ${this.#basic}`
    }

    this.nock = MockRegistry.tnock(
      this.#tap,
      this.origin,
      { reqheaders },
      { debug: this.#debug, strict: this.#strict }
    )
  }

  fullPath (uri) {
    return `${this.pathname}${uri}`
  }

  search ({ responseCode = 200, results = [], error }) {
    // the flags, score, and searchScore parts of the response are never used
    // by npm, only package is used
    const response = results.map(p => ({ package: p }))
    this.nock = this.nock.get(this.fullPath(`/-/v1/search`)).query(true)
    if (error) {
      this.nock = this.nock.replyWithError(error)
    } else {
      this.nock = this.nock.reply(responseCode, { objects: response })
    }
    return this.nock
  }

  whoami ({ username, body, responseCode = 200, times = 1 }) {
    if (username) {
      this.nock = this.nock.get(this.fullPath('/-/whoami')).times(times)
        .reply(responseCode, { username })
    } else {
      this.nock = this.nock.get(this.fullPath('/-/whoami')).times(times)
        .reply(responseCode, body)
    }
  }

  setAccess ({ spec, body = {} }) {
    this.nock = this.nock.post(
      this.fullPath(`/-/package/${npa(spec).escapedName}/access`),
      body
    ).reply(200)
  }

  getVisibility ({ spec, visibility, responseCode = 200 }) {
    this.nock = this.nock.get(
      this.fullPath(`/-/package/${npa(spec).escapedName}/visibility`))
      .reply(responseCode, visibility)
  }

  setPermissions ({ spec, team, permissions }) {
    if (team.startsWith('@')) {
      team = team.slice(1)
    }
    const [scope, teamName] = team.split(':')
    this.nock = this.nock.put(
      this.fullPath(`/-/team/${encodeURIComponent(scope)}/${encodeURIComponent(teamName)}/package`),
      { package: spec, permissions }
    ).reply(200)
  }

  removePermissions ({ spec, team }) {
    if (team.startsWith('@')) {
      team = team.slice(1)
    }
    const [scope, teamName] = team.split(':')
    this.nock = this.nock.delete(
      this.fullPath(`/-/team/${encodeURIComponent(scope)}/${encodeURIComponent(teamName)}/package`),
      { package: spec }
    ).reply(200)
  }

  couchuser ({ username, body, responseCode = 200 }) {
    if (body) {
      this.nock = this.nock.get(
        this.fullPath(`/-/user/org.couchdb.user:${encodeURIComponent(username)}`)
      ).reply(responseCode, body)
    } else {
      this.nock = this.nock.get(
        this.fullPath(`/-/user/org.couchdb.user:${encodeURIComponent(username)}`)
      ).reply(responseCode, { _id: `org.couchdb.user:${username}`, email: '', name: username })
    }
  }

  couchadduser ({ username, email, password, token = 'npm_default-test-token' }) {
    this.nock = this.nock.put(this.fullPath(`/-/user/org.couchdb.user:${username}`), body => {
      this.#tap.match(body, {
        _id: `org.couchdb.user:${username}`,
        name: username,
        email, // Sole difference from couchlogin
        password,
        type: 'user',
        roles: [],
      })
      if (!body.date) {
        return false
      }
      return true
    }).reply(201, {
      id: 'org.couchdb.user:undefined',
      rev: '_we_dont_use_revs_any_more',
      token,
    })
  }

  couchlogin ({ username, password, token = 'npm_default-test-token' }) {
    this.nock = this.nock.put(this.fullPath(`/-/user/org.couchdb.user:${username}`), body => {
      this.#tap.match(body, {
        _id: `org.couchdb.user:${username}`,
        name: username,
        password,
        type: 'user',
        roles: [],
      })
      if (!body.date) {
        return false
      }
      return true
    }).reply(201, {
      id: 'org.couchdb.user:undefined',
      rev: '_we_dont_use_revs_any_more',
      token,
    })
  }

  webadduser ({ username, password, token = 'npm_default-test-token' }) {
    const doneUrl = new URL('/npm-cli-test/done', this.origin).href
    const loginUrl = new URL('/npm-cli-test/login', this.origin).href
    this.nock = this.nock
      .post(this.fullPath('/-/v1/login'), body => {
        this.#tap.ok(body.create) // Sole difference from weblogin
        this.#tap.ok(body.hostname)
        return true
      })
      .reply(200, { doneUrl, loginUrl })
      .get('/npm-cli-test/done')
      .reply(200, { token })
  }

  weblogin ({ token = 'npm_default-test-token' }) {
    const doneUrl = new URL('/npm-cli-test/done', this.origin).href
    const loginUrl = new URL('/npm-cli-test/login', this.origin).href
    this.nock = this.nock
      .post(this.fullPath('/-/v1/login'), body => {
        this.#tap.ok(body.hostname)
        return true
      })
      .reply(200, { doneUrl, loginUrl })
      .get('/npm-cli-test/done')
      .reply(200, { token })
  }

  // team can be a team or a username
  getPackages ({ user, team, packages = {}, times = 1, responseCode = 200 }) {
    let uri
    if (user) {
      uri = `/-/user/${user}/package`
    } else {
      if (team.startsWith('@')) {
        team = team.slice(1)
      }
      const [scope, teamName] = team.split(':').map(encodeURIComponent)
      if (teamName) {
        uri = `/-/team/${scope}/${teamName}/package`
      } else {
        uri = `/-/org/${scope}/package`
      }
    }
    this.nock = this.nock.get(this.fullPath(uri)).times(times).reply(responseCode, packages)
  }

  getCollaborators ({ spec, collaborators = {} }) {
    this.nock = this.nock.get(this.fullPath(`/-/package/${npa(spec).escapedName}/collaborators`)
    ).reply(200, collaborators)
  }

  advisory (advisory = {}) {
    const id = advisory.id || parseInt(Math.random() * 1000000)
    return {
      id,
      url: `https://github.com/advisories/GHSA-${id}`,
      title: `Test advisory ${id}`,
      severity: 'high',
      vulnerable_versions: '*',
      cwe: [
        'cwe-0',
      ],
      cvss: {
        score: 0,
      },
      ...advisory,
    }
  }

  star (manifest, users) {
    const spec = npa(manifest.name)
    this.nock = this.nock.put(this.fullPath(`/${spec.escapedName}`), {
      _id: manifest._id,
      _rev: manifest._rev,
      users,
    }).reply(200, { ...manifest, users })
  }

  ping ({ body = {}, responseCode = 200 } = {}) {
    this.nock = this.nock.get(this.fullPath('/-/ping?write=true')).reply(responseCode, body)
  }

  // full unpublish of an entire package
  async unpublish ({ manifest }) {
    let nock = this.nock
    const spec = npa(manifest.name)
    nock = nock.delete(this.fullPath(`/${spec.escapedName}/-rev/${manifest._rev}`)).reply(201)
    return nock
  }

  getPackage (name, { times = 1, code = 200, query, resp = {} }) {
    let nock = this.nock
    nock = nock.get(`/${npa(name).escapedName}`).times(times)
    if (query) {
      nock = nock.query(query)
    }
    if (code === 404) {
      nock = nock.reply(code, { error: 'Not found' })
    } else {
      nock = nock.reply(code, resp)
    }
    this.nock = nock
  }

  async package ({ manifest, times = 1, query, tarballs }) {
    let nock = this.nock
    const spec = npa(manifest.name)
    nock = nock.get(this.fullPath(`/${spec.escapedName}`)).times(times)
    if (query) {
      nock = nock.query(query)
    }
    nock = nock.reply(200, manifest)
    if (tarballs) {
      for (const version in tarballs) {
        const m = manifest.versions[version]
        nock = await this.tarball({ manifest: m, tarball: tarballs[version] })
      }
    }
    this.nock = nock
  }

  async tarball ({ manifest, tarball }) {
    const nock = this.nock
    const dist = new URL(manifest.dist.tarball)
    const tar = await pacote.tarball(tarball, { Arborist })
    nock.get(this.fullPath(dist.pathname)).reply(200, tar)
    return nock
  }

  // either pass in packuments if you need to set specific attributes besides version,
  // or an array of versions
  // the last packument in the packuments or versions array will be tagged latest
  manifest ({ name = 'test-package', users, packuments, versions } = {}) {
    packuments = this.packuments(versions || packuments, name)
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
    if (users) {
      manifest.users = users
    }
    for (const packument of packuments) {
      const unscoped = name.includes('/') ? name.split('/')[1] : name
      manifest.versions[packument.version] = {
        _id: `${name}@${packument.version}`,
        name,
        description: 'test package mock manifest',
        dependencies: {},
        dist: {
          /* eslint-disable-next-line max-len */
          tarball: `${this.origin}${this.fullPath(`/${name}/-/${unscoped}-${packument.version}.tgz`)}`,
        },
        maintainers: [],
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
