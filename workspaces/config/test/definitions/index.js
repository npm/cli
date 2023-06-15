const t = require('tap')
const acorn = require('acorn')
const mockGlobals = require('@npmcli/mock-globals')
const { getFlatKey } = require('../../lib/definitions/definition.js')

const flattenKeys = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [getFlatKey(k), v]))

const getDepends = (def, flat = true) => def.depends.map(flat ? getFlatKey : (v) => v).sort()

const getFlatParams = (def, paramIndex = 1) => {
  const allParams = new Set()
  for (const getValue of def._getValueSource()) {
    try {
      acorn.parse(getValue.toString(), { ecmaVersion: '2020' })
        .body[0]
        .expression
        .params[paramIndex]
        ?.properties
        ?.forEach(x => allParams.add(x.key.name))
    } catch (err) {
      if (def.deprecatedKey) {
        allParams.add(def.deprecatedKey)
      } else {
        throw err
      }
    }
  }
  return [...allParams].sort()
}

const mockDefs = (t, globals) => {
  if (globals) {
    mockGlobals(t, globals)
  }
  return t.mock('../../lib/definitions/index.js')
}

t.test('defaults', t => {
  const d = mockDefs(t)

  // just spot check a few of these to show that we got defaults assembled
  t.match(d.defaults, {
    registry: d.definitions.registry.default,
    'init-module': d.definitions['init-module'].default,
  })

  t.end()
})

t.test('get values', t => {
  const d = mockDefs(t)

  const obj = {
    'save-exact': true,
    'save-prefix': 'ignored',
    'save-dev': true,
    '@foobar:registry': 'https://foo.bar.com/',
    '//foo.bar.com:_authToken': 'foobarbazquuxasdf',
    userconfig: '/path/to/.npmrc',
  }

  const saveType = d.derived['save-type']
  const savePrefix = d.definitions['save-prefix']

  t.equal(saveType.getValue(flattenKeys(obj)), 'dev')
  t.equal(savePrefix.getValue(obj['save-prefix'], flattenKeys(obj)), '')

  t.end()
})

t.test('basic', t => {
  let d = mockDefs(t, { process: { execPath: '/path/to/node', 'env.NODE': 'NOOOOOODE' } })

  let execPath = d.internals['exec-path'].default
  let nodeBin = d.derived['node-bin']

  t.equal(nodeBin.getValue({ execPath }), 'NOOOOOODE')

  d = mockDefs(t, { process: { execPath: '/path/to/node', 'env.NODE': undefined } })

  execPath = d.internals['exec-path'].default
  nodeBin = d.derived['node-bin']

  t.equal(nodeBin.getValue({ execPath }), '/path/to/node')

  t.end()
})

t.test('building graph', async t => {
  const d = t.mock('../../lib/definitions/index.js')

  const nonDefinitionKeys = [...d.internalKeys, ...d.derivedKeys]
  t.strictSame(d.definitionKeys, [...new Set(d.definitionKeys)])
  t.strictSame(nonDefinitionKeys, [...new Set(nonDefinitionKeys)])

  for (const k of d.definitionKeys) {
    const def = d.definitions[k]
    t.ok(Array.isArray(def.dependencies))
    t.strictSame(getDepends(def), getFlatParams(def), k)
    // overlapping definitions are ok if definition is renamed to
    // something else for its dependKey
    if (nonDefinitionKeys.includes(k)) {
      t.not(def.key, def.dependKey)
    }
  }

  for (const k of d.internalKeys) {
    const internal = d.internals[k]
    t.ok(Array.isArray(internal.dependencies))
    t.strictSame(getDepends(internal), getFlatParams(internal), k)
    t.notOk(d.definitionKeys.includes(k), k)
  }

  for (const k of d.derivedKeys) {
    const derive = d.derived[k]
    t.ok(Array.isArray(derive.dependencies))
    t.strictSame(getDepends(derive), getFlatParams(derive, 0), k)
    if (d.definitionKeys.includes(k)) {
      const def = d.definitions[k]
      t.ok(
        getDepends(derive, false).includes(def.dependKey),
        `${k} ${def.dependKey}`
      )
    }
  }
})
