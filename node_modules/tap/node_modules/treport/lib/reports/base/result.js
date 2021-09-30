const React = require('react')
const {Box, Color} = require('ink')
const countsList = require('./counts.js')
const importJSX = require('import-jsx')
const TestPoint = importJSX('./test-point.js')
const Test = importJSX('./test.js')

module.exports = ({res, test, raw}) =>
  res ? (<TestPoint res={res} />)
  : test ? (<Test test={test} />)
  : (<Box>{raw}</Box>)
