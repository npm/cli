const React = require('react')
const {Box, Color} = require('ink')
const prettyDiff = require('../../pretty-diff.js')
const prettySource = require('../../pretty-source.js')
const yaml = require('tap-yaml')
const importJSX = require('import-jsx')
const AssertName = importJSX('./assert-name.js')

module.exports = ({res}) => {
  const {ok, id, name, testName, skip, todo} = res
  const diag = res.diag || {}
  const diff = prettyDiff(diag && diag.diff)
  if (diff) {
    delete diag.diff
    delete diag.found
    delete diag.wanted
    delete diag.pattern
    delete diag.compare
  }
  const source = prettySource(diag)
  if (source)
    delete diag.source

  // pretty-print errors found in t.error() assertions
  const origin = diag && diag.found && diag.origin
  const originSrc = prettySource(origin)
  if (originSrc) {
    origin.message = diag.found.message
    delete diag.origin
    delete diag.found
    delete origin.source
  }

  delete diag.didNotWant

  const filtered = /^filter: (only|\/.*\/)$/.test(res.skip)

  return filtered ? '' : (
    <Box flexDirection="row">
      <Box width={(res.level || 0) * 2}></Box>
      <Box flexDirection="column">
        <AssertName {...{ok, name, skip, todo}} />
        {ok ? '' :
          (<Box flexDirection="column">
            {' '}
            { source ? (<Box>{source}</Box>) : '' }
            { diff ? (<Box>{ diff + '\n'}</Box>) : '' }
            { diag && Object.keys(diag).length ? (
              <Box marginLeft={2}>{yaml.stringify(diag)}</Box>
            ) : '' }
            { originSrc ? (
              <Box flexDirection="column">
                <Box marginLeft={2}>Error Origin:{'\n'}</Box>
                <Box>{originSrc}</Box>
                <Box marginLeft={2}>{yaml.stringify(origin)}</Box>
              </Box>
            ) : '' }
          </Box>)
        }
      </Box>
    </Box>
  )
}
