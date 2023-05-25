const t = require('tap')
const ConfigData = require('../lib/config-data.js')
const { Locations } = require('../lib/definitions/locations.js')

const mockConfig = (t, location, opts) => {
  const config = new ConfigData(location, opts)

  const logs = {}
  const logHandler = (level, _, ...args) => {
    if (!logs[level]) {
      logs[level] = []
    }
    logs[level].push(args.join(' '))
  }

  process.on('log', logHandler)
  t.teardown(() => process.off('log', logHandler))

  return {
    config,
    logs,
  }
}

t.test('invalid', async t => t.throws(() => mockConfig(t, 'sdfsdfsd')))

t.test('loading', async t => {
  const { config, logs } = mockConfig(t, Locations.cli)

  config.load({
    'hash-algorithm': 'notok',
    'unknown-algorithm': 'huh',
    access: 'yes please',
    depth: 5,
  })

  t.strictSame(config.data, { depth: 5 })

  t.strictSame(logs.warn, [
    'invalid item `hash-algorithm` set with `notok`, not allowed to be set on config layer `cli`',
    'unknown item `unknown-algorithm` set with `huh`, not allowed to be set',
    'invalid item `access` set with `yes please`, Must be one of: "restricted", "public"',
  ])

  config.set('access', 'public')
  t.equal(config.data.access, 'public')

  config.set('access', 'notok')
  t.equal(config.data.access, undefined)
  t.strictSame(logs.warn[3],
    'invalid item `access` set with `notok`, Must be one of: "restricted", "public"'
  )

  config.delete('depth')
  t.equal(config.data.depth, undefined)

  config.clear('depth')
  t.strictSame(config.data, {})
})
