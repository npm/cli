const React = require('react')
const importJSX = require('import-jsx')
const {Box} = require('ink')
const Test = importJSX('./test.js')

module.exports = ({runs}) => (
  <Box flexDirection="column">{
    runs
      .sort((a, b) => a.name.localeCompare(b.name, 'en'))
      .map((test, i) => (<Test key={`${i}`} test={test} />))
  }</Box>
)
