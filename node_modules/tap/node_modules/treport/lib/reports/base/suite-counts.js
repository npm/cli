const React = require('react')
const {Box, Color} = require('ink')

module.exports = ({ fail, pass, todo, skip, total }) => (
  <Box>
    <Box width={10}>
      <Color bold>Suites:</Color>
    </Box>
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
      {todo + pass + skip + fail} of {total} completed
    </Box>
  </Box>
)
