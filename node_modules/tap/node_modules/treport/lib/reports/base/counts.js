const c = require('chalk')
module.exports = ({pass, fail, todo, skip, total}) =>
  c.white(
  (fail ? c.red(' '+fail+' failed') : '') +
  (todo ? c.magenta(' '+todo+' todo') : '') +
  (skip ? c.cyan(' '+skip+' skip') : '') +
  (skip || todo || fail ? ' of' : '') +
  (total ? c.bold(' '+total) : '') +
  (total && pass === total ? c.green(' OK ') : ' ')
  )
