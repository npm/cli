const t = require('tap')
const { parseSelector, matchSelector } = require('../lib/patched-dependencies.js')

t.test('parseSelector', t => {
  t.strictSame(parseSelector('lodash'), { name: 'lodash', spec: null })
  t.strictSame(parseSelector('lodash@4.17.21'), { name: 'lodash', spec: '4.17.21' })
  t.strictSame(parseSelector('lodash@^4.0.0'), { name: 'lodash', spec: '^4.0.0' })
  t.strictSame(parseSelector('@babel/core@7.23.0'), { name: '@babel/core', spec: '7.23.0' })
  t.strictSame(parseSelector('@babel/core'), { name: '@babel/core', spec: null })
  t.end()
})

const sel = (name, spec) => ({ name, spec, key: spec ? `${name}@${spec}` : name })

t.test('exact wins over range and name-only', t => {
  const selectors = [sel('lodash', '4.17.21'), sel('lodash', '^4.0.0'), sel('lodash', null)]
  t.equal(matchSelector(selectors, { name: 'lodash', version: '4.17.21' }).key, 'lodash@4.17.21')
  t.end()
})

t.test('range wins over name-only', t => {
  const selectors = [sel('lodash', '^4.0.0'), sel('lodash', null)]
  t.equal(matchSelector(selectors, { name: 'lodash', version: '4.5.0' }).key, 'lodash@^4.0.0')
  t.end()
})

t.test('name-only is the fallback', t => {
  const selectors = [sel('lodash', null)]
  t.equal(matchSelector(selectors, { name: 'lodash', version: '3.0.0' }).key, 'lodash')
  t.end()
})

t.test('most specific (subset) range wins regardless of order', t => {
  const wideFirst = [sel('x', '>=1.0.0 <3.0.0'), sel('x', '>=1.5.0 <2.0.0')]
  t.equal(matchSelector(wideFirst, { name: 'x', version: '1.7.0' }).key, 'x@>=1.5.0 <2.0.0')
  const narrowFirst = [sel('x', '>=1.5.0 <2.0.0'), sel('x', '>=1.0.0 <3.0.0')]
  t.equal(matchSelector(narrowFirst, { name: 'x', version: '1.7.0' }).key, 'x@>=1.5.0 <2.0.0')
  t.end()
})

t.test('ambiguous overlapping ranges throw', t => {
  const selectors = [sel('x', '>=1.0.0 <2.0.0'), sel('x', '>=1.5.0 <3.0.0')]
  t.throws(() => matchSelector(selectors, { name: 'x', version: '1.7.0' }), { code: 'EPATCHAMBIGUOUS' })
  t.end()
})

t.test('no match returns null', t => {
  const selectors = [sel('lodash', '4.17.21')]
  t.equal(matchSelector(selectors, { name: 'lodash', version: '5.0.0' }), null)
  t.equal(matchSelector(selectors, { name: 'other', version: '1.0.0' }), null)
  t.end()
})
