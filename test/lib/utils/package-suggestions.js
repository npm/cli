'use strict'

const t = require('tap')
const tmock = require('../../fixtures/tmock')

t.test('package-suggestions', async t => {
  const suggestions = tmock(t, '{LIB}/utils/package-suggestions.js', {
    libnpmsearch: async (query) => {
      if (query === 'pg-hstor') {
        return [{ name: 'pg-hstore' }, { name: 'pg' }]
      }
      if (query === 'fail') {
        throw new Error('search failed')
      }
      return []
    },
  })

  t.test('basic suggestions', async t => {
    const res = await suggestions('pg-hstor', { flatOptions: {} })
    t.strictSame(res, ['pg-hstore', 'pg'])
  })

  t.test('no name', async t => {
    const res = await suggestions('', { flatOptions: {} })
    t.strictSame(res, [])
  })

  t.test('dash name', async t => {
    const res = await suggestions('-', { flatOptions: {} })
    t.strictSame(res, [])
  })

  t.test('search failure', async t => {
    const res = await suggestions('fail', { flatOptions: {} })
    t.strictSame(res, [])
  })

  t.test('same name filter', async t => {
    const suggestionsSame = tmock(t, '{LIB}/utils/package-suggestions.js', {
      libnpmsearch: async () => [{ name: 'exact' }, { name: 'other' }],
    })
    const res = await suggestionsSame('exact', { flatOptions: {} })
    t.strictSame(res, ['other'])
  })

  t.test('strips version from name', async t => {
    const res = await suggestions('pg-hstor@1.2.3', { flatOptions: {} })
    t.strictSame(res, ['pg-hstore', 'pg'])
  })
})
