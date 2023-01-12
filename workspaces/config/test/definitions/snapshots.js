const t = require('tap')
const ConfigItems = require('../../lib/definitions')
const mockGlobals = require('@npmcli/mock-globals')

t.cleanSnapshot = (s) => s
  .replace(ConfigItems.values['npm-version'], '{NPM-VERSION}')
  .replace(ConfigItems.typeDefs.IpAddress.values.join(', '), '{...LOCAL-IPS}')

t.test('definitions', async t => {
  mockGlobals(t, {
    'process.platform': 'not-windows',
    'process.env': {
      SHELL: 'default-shell',
      EDITOR: 'default-editor',
      LC_ALL: 'UTF-8',
    },
  })

  const entries = Object.entries(ConfigItems.definitions)

  t.equal(entries.length, ConfigItems.definitionKeys.length)
  t.equal(entries.length, Object.entries(ConfigItems.types).length)
  t.equal(entries.length, Object.entries(ConfigItems.defaults).length)

  for (const [key, item] of entries) {
    t.test(key, async t => {
      t.matchSnapshot([
        item.describe(),
        `USAGE: ${item.describeUsage()}`,
        `INVALID: ${item.mustBe()}`,
        `DEFAULT: ${item.default}`,
        `TYPES: ${item.type.map(type => String(type))}`,
        `DERIVED: ${item.derived.map(d => ConfigItems.derived[d].flatKey)}`,
      ].join(`\n${'-'.repeat(40)}\n`))
    })
  }
})

t.test('values', async t => {
  const entries = Object.entries(ConfigItems.values)
  t.equal(entries.length, ConfigItems.valueKeys.length)
  for (const [key, item] of entries) {
    t.test(key, async t => {
      t.matchSnapshot(item)
    })
  }
})

t.test('derived', async t => {
  const entries = Object.entries(ConfigItems.derived)
  t.equal(entries.length, ConfigItems.derivedKeys.length)
  for (const [key, item] of entries) {
    t.test(key, async t => {
      t.matchSnapshot(item.sources)
    })
  }
})
