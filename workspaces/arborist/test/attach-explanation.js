const t = require('tap')
const { attachExplanation } = require('../lib/attach-explanation.js')

t.test('attaches a computed explanation to an error object', t => {
  const err = new Error('boom')
  const ret = attachExplanation(err, () => ({ name: 'x' }))
  t.equal(ret, err, 'returns the same error')
  t.same(err.explanation, { name: 'x' }, 'explanation attached')
  t.end()
})

t.test('does not overwrite an existing explanation', t => {
  const err = Object.assign(new Error('boom'), { explanation: { name: 'kept' } })
  let called = false
  attachExplanation(err, () => {
    called = true
    return { name: 'new' }
  })
  t.notOk(called, 'compute not invoked')
  t.same(err.explanation, { name: 'kept' }, 'original explanation kept')
  t.end()
})

t.test('no-op on a non-object error (string throw)', t => {
  let called = false
  const ret = attachExplanation('just a string', () => {
    called = true
    return {}
  })
  t.equal(ret, 'just a string', 'returns the value unchanged')
  t.notOk(called, 'compute not invoked')
  t.end()
})

t.test('no-op on a nullish error', t => {
  t.equal(attachExplanation(null, () => ({})), null)
  t.equal(attachExplanation(undefined, () => ({})), undefined)
  t.end()
})

t.test('skips attachment when compute returns undefined', t => {
  const err = new Error('boom')
  attachExplanation(err, () => undefined)
  t.notOk('explanation' in err, 'no explanation property added')
  t.end()
})

t.test('best-effort: a throwing compute never masks the original error', t => {
  const err = new Error('boom')
  const ret = attachExplanation(err, () => {
    throw new Error('explain failed')
  })
  t.equal(ret, err, 'returns the original error')
  t.notOk('explanation' in err, 'no explanation attached')
  t.equal(err.message, 'boom', 'original error untouched')
  t.end()
})
