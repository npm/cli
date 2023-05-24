const t = require('tap')
const ConfigLocations = require('../lib/config-locations.js')

t.test('basic', async t => {
  const l = new ConfigLocations()

  const data = Object.fromEntries(Object.entries({ ...l.data })
    .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([k, v]) => [k, v && typeof v === 'object' && !Array.isArray(v) ? { ...v } : v]))

  t.matchSnapshot(data, 'initial data')

  t.equal(l.get('registry'), data.registry)
  t.equal(l.get('user-agent'), data.userAgent)

  l.set('workspaces', true)
  const userAgent = l.get('user-agent')
  t.not(userAgent, data.userAgent)
  t.equal(userAgent, l.data.userAgent)
})

t.skip('remapped keys', async t => {


  t.test('retry options', t => {
    const obj = {}
    // <config>: flat.retry[<option>]
    const mapping = {
      'fetch-retries': 'retries',
      'fetch-retry-factor': 'factor',
      'fetch-retry-maxtimeout': 'maxTimeout',
      'fetch-retry-mintimeout': 'minTimeout',
    }
    for (const [config, option] of Object.entries(mapping)) {
      const msg = `${config} -> retry.${option}`
      const flat = {}
      obj[config] = 99
      mockDefs()[config].flatten(config, obj, flat)
      t.strictSame(flat, { retry: { [option]: 99 } }, msg)
      delete obj[config]
    }
    t.end()
  })
  
  t.test('search options', t => {
    const vals = {
      description: 'test description',
      exclude: 'test search exclude',
      limit: 99,
      staleneess: 99,
  
    }
    const obj = {}
    // <config>: flat.search[<option>]
    const mapping = {
      description: 'description',
      searchexclude: 'exclude',
      searchlimit: 'limit',
      searchstaleness: 'staleness',
    }
  
    for (const [config, option] of Object.entries(mapping)) {
      const msg = `${config} -> search.${option}`
      const flat = {}
      obj[config] = vals[option]
      mockDefs()[config].flatten(config, obj, flat)
      t.strictSame(flat, { search: { limit: 20, [option]: vals[option] } }, msg)
      delete obj[config]
    }
  
    const flat = {}
    obj.searchopts = 'a=b&b=c'
    mockDefs().searchopts.flatten('searchopts', obj, flat)
    t.strictSame(flat, {
      search: {
        limit: 20,
        opts: Object.assign(Object.create(null), {
          a: 'b',
          b: 'c',
        }),
      },
    }, 'searchopts -> querystring.parse() -> search.opts')
    delete obj.searchopts
  
    t.end()
  })
  
  t.test('noProxy - array', t => {
    const obj = { noproxy: ['1.2.3.4,2.3.4.5', '3.4.5.6'] }
    const flat = {}
    mockDefs().noproxy.flatten('noproxy', obj, flat)
    t.strictSame(flat, { noProxy: '1.2.3.4,2.3.4.5,3.4.5.6' })
    t.end()
  })
  
  t.test('noProxy - string', t => {
    const obj = { noproxy: '1.2.3.4,2.3.4.5,3.4.5.6' }
    const flat = {}
    mockDefs().noproxy.flatten('noproxy', obj, flat)
    t.strictSame(flat, { noProxy: '1.2.3.4,2.3.4.5,3.4.5.6' })
    t.end()
  })
  
  t.test('maxSockets', t => {
    const obj = { maxsockets: 123 }
    const flat = {}
    mockDefs().maxsockets.flatten('maxsockets', obj, flat)
    t.strictSame(flat, { maxSockets: 123 })
    t.end()
  })
  
  t.test('scope', t => {
    const obj = { scope: 'asdf' }
    const flat = {}
    mockDefs().scope.flatten('scope', obj, flat)
    t.strictSame(flat, { scope: '@asdf', projectScope: '@asdf' }, 'prepend @ if needed')
  
    obj.scope = '@asdf'
    mockDefs().scope.flatten('scope', obj, flat)
    t.strictSame(flat, { scope: '@asdf', projectScope: '@asdf' }, 'leave untouched if has @')
  
    t.end()
  })
  
  t.test('strictSSL', t => {
    const obj = { 'strict-ssl': false }
    const flat = {}
    mockDefs()['strict-ssl'].flatten('strict-ssl', obj, flat)
    t.strictSame(flat, { strictSSL: false })
    obj['strict-ssl'] = true
    mockDefs()['strict-ssl'].flatten('strict-ssl', obj, flat)
    t.strictSame(flat, { strictSSL: true })
    t.end()
  })

  t.test('defaultTag', t => {
    const obj = { tag: 'next' }
    const flat = {}
    mockDefs().tag.flatten('tag', obj, flat)
    t.strictSame(flat, { defaultTag: 'next' })
    t.end()
  })
  
  
  t.test('timeout', t => {
    const obj = { 'fetch-timeout': 123 }
    const flat = {}
    mockDefs()['fetch-timeout'].flatten('fetch-timeout', obj, flat)
    t.strictSame(flat, { timeout: 123 })
    t.end()
  })

  t.test('scriptShell', t => {
    const obj = { 'script-shell': null }
    const flat = {}
    mockDefs()['script-shell'].flatten('script-shell', obj, flat)
    t.ok(Object.prototype.hasOwnProperty.call(flat, 'scriptShell'),
      'should set it to undefined explicitly')
    t.strictSame(flat, { scriptShell: undefined }, 'no other fields')
  
    obj['script-shell'] = 'asdf'
    mockDefs()['script-shell'].flatten('script-shell', obj, flat)
    t.strictSame(flat, { scriptShell: 'asdf' }, 'sets if not falsey')
  
    t.end()
  })

})