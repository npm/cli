const React = require('react')
const importJSX = require('import-jsx')
const {Static} = require('ink')
const {Result} = importJSX('../base')

module.exports = ({log}) => (
  <Static>{
    log.filter(result => !result.test)
      .map((result, i) => (<Result {...result} key={`${i}`} /> ))
  }</Static>
)
