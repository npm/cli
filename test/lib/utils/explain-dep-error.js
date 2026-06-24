const t = require('tap')
const { explain, report } = require('../../../lib/utils/explain-dep-error.js')

const cases = require('../../fixtures/dep-error-explanations.js')

// map fixture name -> the error code that would carry that explanation
const codeFor = (name) => name === 'remoteEdge' ? 'EALLOWREMOTE'
  : name === 'strictScripts' ? 'ESTRICTALLOWSCRIPTS'
  : name === 'incompatibleNode' ? 'EBADPLATFORM'
  : 'ETARGET'

t.test('report', async t => {
  const { Chalk } = await import('chalk')
  const color = new Chalk({ level: 3 })
  const noColor = new Chalk({ level: 0 })

  for (const [name, expl] of Object.entries(cases)) {
    t.test(name, t => {
      const er = { code: codeFor(name), explanation: expl }

      const colorReport = report(er, color, noColor)
      t.matchSnapshot(colorReport.explanation, 'report with color')
      t.matchSnapshot(colorReport.file, 'report file (no color)')

      const noColorReport = report(er, noColor, noColor)
      t.matchSnapshot(noColorReport.explanation, 'report with no color')
      t.equal(noColorReport.file, colorReport.file, 'same file written regardless of terminal color')

      t.match(colorReport.file, new RegExp(`# npm ${er.code} error report`),
        'file is headed with the error code')

      t.end()
    })
  }
})

t.test('explain depth', async t => {
  const { Chalk } = await import('chalk')
  const noColor = new Chalk({ level: 0 })

  t.matchSnapshot(explain(cases.transitiveEdge, noColor, 2), 'transitive, depth 2')
  t.matchSnapshot(explain(cases.transitiveEdge, noColor, Infinity), 'transitive, full depth')
  t.matchSnapshot(explain(cases.strictScripts, noColor, Infinity), 'strict scripts array, full depth')
})

t.test('empty explanation', async t => {
  const { Chalk } = await import('chalk')
  const noColor = new Chalk({ level: 0 })
  t.equal(explain(undefined, noColor, 4), '', 'undefined explanation -> empty string')
  t.equal(explain([], noColor, 4), '', 'empty array -> empty string')

  // report() is exported and may be called directly; it must not throw on an
  // absent/empty explanation (error-message.js already guards this path).
  t.same(report({ code: 'ETARGET', explanation: [] }, noColor, noColor),
    { explanation: '', file: '' }, 'empty array -> empty report')
  t.same(report({ code: 'ETARGET' }, noColor, noColor),
    { explanation: '', file: '' }, 'missing explanation -> empty report')
})
