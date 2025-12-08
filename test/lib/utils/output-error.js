const t = require('tap')

t.test('outputError', t => {
  const output = {
    standard: [],
  }
  const log = {
    verbose: [],
    error: [],
  }

  const mockProcLog = {
    output: {
      standard: (msg) => output.standard.push(msg),
    },
    log: {
      verbose: (...args) => log.verbose.push(args),
      error: (...args) => log.error.push(args),
    },
  }

  const { outputError } = t.mock('../../../lib/utils/output-error.js', {
    'proc-log': mockProcLog,
  })

  outputError({
    standard: ['std'],
    verbose: [['verb', 'ose']],
    error: [['err', 'or']],
    summary: [['sum', 'mary']],
    detail: [['det', 'ail']],
  })

  t.strictSame(output.standard, ['std'])
  t.strictSame(log.verbose, [['verb', 'ose']])
  t.strictSame(log.error, [
    ['err', 'or'],
    ['sum', 'mary'],
    ['det', 'ail'],
  ])
  t.end()
})

t.test('jsonError', t => {
  const { jsonError } = require('../../../lib/utils/output-error.js')

  const npm = {
    loaded: true,
    config: {
      get: (key) => key === 'json',
    },
  }

  const error = {
    code: 'ECODE',
    summary: [['code', 'summary']],
    detail: [['code', 'detail']],
  }

  const res = jsonError(error, npm)
  t.match(res, {
    code: 'ECODE',
    summary: 'summary',
    detail: 'detail',
  })

  t.equal(jsonError(null, npm), undefined, 'returns undefined if no error')
  t.equal(jsonError(error, { ...npm, loaded: false }), undefined, 'returns undefined if not loaded')
  t.equal(jsonError(error, { ...npm, config: { get: () => false } }), undefined, 'returns undefined if not json')

  t.end()
})

t.test('outputError defaults', t => {
  const output = { standard: [] }
  const log = { verbose: [], error: [] }
  const mockProcLog = {
    output: { standard: (msg) => output.standard.push(msg) },
    log: { verbose: (...args) => log.verbose.push(args), error: (...args) => log.error.push(args) },
  }
  const { outputError } = t.mock('../../../lib/utils/output-error.js', { 'proc-log': mockProcLog })

  outputError({})
  t.strictSame(output.standard, [])
  t.strictSame(log.verbose, [])
  t.strictSame(log.error, [])
  t.end()
})

t.test('jsonError missing props', t => {
  const { jsonError } = require('../../../lib/utils/output-error.js')
  const npm = { loaded: true, config: { get: () => true } }
  const error = { code: 'ECODE' }
  const res = jsonError(error, npm)
  t.match(res, { code: 'ECODE', summary: '', detail: '' })
  t.end()
})
