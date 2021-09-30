const React = require('react')
const importJSX = require('import-jsx')
const {Static, Box} = require('ink')
const TestPoint = importJSX('./test-point.js')

module.exports = ({log}) => (
  <Static>{
    log.filter(result => !result.test)
      .map((result, i) =>
        result.res ? (<TestPoint key={`${i}`} res={result.res} />)
        : (<Box key={`${i}`}>{result.raw}</Box>))
  }</Static>
)
