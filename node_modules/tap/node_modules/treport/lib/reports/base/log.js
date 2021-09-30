const React = require('react')
const importJSX = require('import-jsx')
const {Static} = require('ink')
const Result = importJSX('./result.js')

module.exports = ({log}) => (
  <Static>{
    log.map((result, i) => (<Result {...result} key={`${i}`} /> ))
  }</Static>
)
