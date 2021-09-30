const React = require('react')
const {Box, Color} = require('ink')
const importJSX = require('import-jsx')
const Test = importJSX('../base/test.js')

module.exports = ({ results, tests }) => (
  <Box flexDirection="column">
    {
      tests
        .filter(t => t.results && !t.results.ok ||
            t.options.skip || t.options.todo ||
            t.counts.total !== t.counts.pass)
        .sort((a, b) => a.name.localeCompare(b.name, 'en'))
        .map((test, i) => (<Test test={test} key={''+i} />))
    }
  </Box>
)
