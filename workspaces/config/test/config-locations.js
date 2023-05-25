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
