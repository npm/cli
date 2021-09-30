const React = require('react')
const ms = require('ms')
const {Box, Color} = require('ink')
const importJSX = require('import-jsx')
const Test = importJSX('./test.js')
const chalk = require('chalk')

const s = n => new Array(n + 1).join(' ')

const bannerWords = '  🌈 SUMMARY RESULTS 🌈  '
const banner = '\n' +
  chalk.bgHex('#fff')(s(bannerWords.length)) +
  '\n' +
  chalk.bgHex('#fff')(chalk.hex('#333')(chalk.bold(bannerWords))) +
  '\n' +
  chalk.bgHex('#fff')(s(bannerWords.length)) +
  '\n'

module.exports = ({ results, tests }) => (
  <Box flexDirection="column">
    {banner}
    <Box flexDirection="column">
      {
        tests
          .filter(t => t.results && !t.results.ok ||
              t.options.skip || t.options.todo ||
              t.counts.total !== t.counts.pass)
          .sort((a, b) => a.name.localeCompare(b.name, 'en'))
          .map((test, i) => (<Test test={test} key={''+i} />))
      }
    </Box>
  </Box>
)
