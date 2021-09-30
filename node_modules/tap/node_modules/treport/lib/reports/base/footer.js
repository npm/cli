const React = require('react')
const ms = require('ms')
const {Box, Color} = require('ink')
const importJSX = require('import-jsx')
const AssertCounts = importJSX('./assert-counts.js')
const SuiteCounts = importJSX('./suite-counts.js')

module.exports = ({suiteCounts, assertCounts, time}) => (
  <Color reset><Box flexDirection="column">
    <SuiteCounts {...suiteCounts} />
    <AssertCounts {...assertCounts} />
    <Box>
      <Box width={10}>
        <Color bold dim>Time:</Color>
      </Box>
      <Box>
        <Color bold dim>{ms(time)}</Color>
      </Box>
    </Box>
  </Box></Color>
)
