const React = require('react')
const {Box, Color} = require('ink')
const importJSX = require('import-jsx')
const StatusMark = importJSX('./status-mark.js')


module.exports = ({ok, name, skip, todo}) => (
  !name ? ''
  : (<Box><StatusMark res={{ok, name, skip, todo}} />{' ' + name}</Box>)
)
