const React = require('react')
const {Box, Color} = require('ink')

const glyphColor = ({ ok, skip, todo }) => ({
  [ skip ? 'cyan'
  : todo ? 'magenta'
  : !ok ? 'red'
  : 'green']: true,
})

const glyphText = ({ ok, skip, todo }) =>
  skip ? '~ '
  : todo ? '☐ '
  : !ok ? '✖ '
  : '✓ '

const Glyph = ({ ok, skip, todo }) => (
  <Box width={2}>
    <Color bold {...glyphColor({ok, skip, todo})}>
      {glyphText({ok, skip, todo})}
    </Color>
  </Box>
)

const Reason = ({skip, todo}) =>
  skip && skip !== true ? (
    <Box>
      {' > '}
      <Color {...glyphColor({skip, todo})}>{skip}</Color>
    </Box>
  )
  : todo && todo !== true ? (
    <Box>
      {' > '}
      <Color {...glyphColor({skip, todo})}>{todo}</Color>
    </Box>
  )
  : ''

const AssertName = ({ ok, name, skip, todo }) => (
  <Box>
    <Glyph {...{ok, skip, todo}} />
    {name || '(unnamed assertion)'}
    <Reason {...{skip, todo}} />
  </Box>
)

module.exports = AssertName
