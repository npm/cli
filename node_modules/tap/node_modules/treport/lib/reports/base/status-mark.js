const React = require('react')
const {Box, Color} = require('ink')

const pending = () => (<Color hex='#000' bgYellow bold>{' RUNS '}</Color>)
const fail = () => (<Color hex='#fff' bgRed bold>{' FAIL '}</Color>)
const skip = () => (<Color bgBlue rgb={[255,255,255]} bold>{' SKIP '}</Color>)
const todo = () => (<Color bold bgRgb={[127,0,127]} rgb={[255,255,255]}>{' TODO '}</Color>)
const pass = () => (<Color bgGreen rgb={[0,0,0]} bold>{' PASS '}</Color>)

module.exports = ({test, res}) =>
  test ? (
    !test.results ? pending()
    : !test.results.ok ? fail()
    : test.options.skip || test.counts.skip > test.counts.todo ? skip()
    : test.options.todo || test.counts.todo ? todo()
    : pass()
  ) : res ? (
    res.skip ? skip()
    : res.todo ? todo()
    : !res.ok ? fail()
    : pass()
  ) : ''
