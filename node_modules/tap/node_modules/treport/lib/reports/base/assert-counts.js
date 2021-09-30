const React = require('react')
const {Box, Color} = require('ink')

module.exports = ({fail, pass, todo, skip}) => (
  <Box>
    <Box width={10}>
      <Color bold>Asserts:</Color>
    </Box>
    { !fail && !pass && !todo && !skip ? '0 ' : '' }
    { fail ? (
      <Box>
        <Color red>{fail} failed</Color>
        <Box>{', '}</Box>
      </Box>
    ) : ''}
    { pass ? (
      <Box>
        <Color green>{pass} passed</Color>
        <Box>{', '}</Box>
      </Box>
    ) : ''}
    { todo ? (
      <Box>
        <Color magenta>{todo} todo</Color>
        <Box>{', '}</Box>
      </Box>
    ) : ''}
    { skip ? (
      <Box>
        <Color cyan>{skip} skip</Color>
        <Box>{', '}</Box>
      </Box>
    ) : ''}
    <Box>
      of {pass + fail + todo + skip}
    </Box>
  </Box>
)
