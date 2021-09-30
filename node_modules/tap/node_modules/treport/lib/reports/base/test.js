const React = require('react')
const {Box, Color} = require('ink')
const util = require('util')
const counts = require('./counts.js')
const chalk = require('chalk')
const yaml = require('tap-yaml')
const ms = require('ms')

const importJSX = require('import-jsx')
const AssertName = importJSX('./assert-name.js')
const StatusMark = importJSX('./status-mark.js')

const showYaml = test =>
  test.results && !test.results.ok && !test.lists.fail.length &&
  (test.options.exitCode || test.options.signal)

const lists = test => (
  <Box flexDirection="column" marginBottom={
    showYaml(test) ||
    test.lists.fail.length ||
    test.lists.todo.length ||
    test.lists.skip.length ? 1 : 0 }>
    { test.lists.fail.length ? (
      <Box flexDirection="column">
        { test.lists.fail.map((res, i) => (
          <AssertName {...res} key={''+i} />
        ))}
      </Box>
    ) : ''}
    { test.lists.todo.length ? (
      <Box flexDirection="column">
        { test.lists.todo.map((res, i) => (
          <AssertName {...res} key={''+i} />
        ))}
      </Box>
    ) : ''}
    { test.lists.skip.length ? (
      <Box flexDirection="column">
        { test.lists.skip.map((res, i) => (
          <AssertName {...res} key={''+i} />
        ))}
      </Box>
    ) : ''}
    { // cases where no tests fail, but the test fails
      // eg, exiting with non-zero code, being killed, etc.
      showYaml(test) ? (
      <Box>{'  ' + yaml.stringify({
        command: test.options.command,
        args: test.options.args,
        exitCode: test.options.exitCode,
        signal: test.options.signal,
      }).replace(/\n/g, '\n  ').trimRight()}</Box>) : '' }
    {printBail(test.results)}
  </Box>
)

const skipOrTodoReason = test =>
  test.options.skip && test.options.skip !== true
  ? ` > ${chalk.cyan(test.options.skip)}`
  : test.options.todo && test.options.todo !== true
  ? ` > ${chalk.magenta(test.options.todo)}`
  : ''

const printBail = results =>
  !results || !results.bailout ? ''
  : <Box marginTop={1}>{chalk.bold.red('BAILOUT ') + results.bailout}</Box>

const printLists = test =>
  test.results && (
    test.results.bailout ||
    !test.results.ok ||
    test.counts.pass !== test.counts.total
  )

const time = (time, start, end) =>
  !start ? (<Color dim>{' ...'}</Color>)
  : (<Color hex="#aaa" bold>{
    ms(time || (end || Date.now()) - start)}</Color>)

module.exports = ({test}) => (
  <Box flexDirection="column">
    <Box>
      <StatusMark test={test} />
      {' ' + test.name + skipOrTodoReason(test)}
      {counts(test.counts)}
      {time(test.time, test.startTime, test.endTime)}
    </Box>
    { printLists(test) ? lists(test) : '' }
  </Box>
)
