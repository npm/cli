const React = require('react')
const ms = require('ms')
const importJSX = require('import-jsx')
const {Box} = require('ink')
const Parser = require('tap-parser')
const chalk = require('chalk')

// Pull in all the tags here so we can re-export them
const AssertCounts = importJSX('./assert-counts.js')
const AssertName = importJSX('./assert-name.js')
const Counts = importJSX('./counts.js')
const Footer = importJSX('./footer.js')
const Log = importJSX('./log.js')
const PassFail = importJSX('./pass-fail.js')
const Result = importJSX('./result.js')
const Runs = importJSX('./runs.js')
const StatusMark = importJSX('./status-mark.js')
const SuiteCounts = importJSX('./suite-counts.js')
const Summary = importJSX('./summary.js')
const TestPoint = importJSX('./test-point.js')
const Test = importJSX('./test.js')

class Base extends React.Component {
  get Summary () {
    return Summary
  }
  get Runs () {
    return Runs
  }
  get Log () {
    return Log
  }
  get Footer () {
    return Footer
  }

  constructor ({ tap }) {
    super()

    this.state = {
      // the stuff in the static section.  most importantly, errors in
      // real time, but also console output, test summaries, etc.
      log: [],

      // all tests, done and queued
      tests: [],

      // currently running
      runs: [],

      // tap.results at the end
      results: null,

      // counts of all relevant test points
      // debounced on this.assertCounts
      assertCounts: {
        total: 0,
        pass: 0,
        fail: 0,
        skip: 0,
        todo: 0,
      },

      // a count of all the test suites run
      suiteCounts: {
        total: 0,
        pass: 0,
        fail: 0,
        skip: 0,
        todo: 0,
      },

      // total elapsed time
      time: 0,

      bailout: null,
    }

    this.start = Date.now()
    this.timer = setInterval(() => this.setState(prevState => ({
      ...prevState,
      time: this.time,
      assertCounts: this.assertCounts,
    })), 200)

    // keep counters on the object itself, to debounce
    this.assertCounts = {
      total: 0,
      pass: 0,
      fail: 0,
      skip: 0,
      todo: 0,
    },
    this.counterBouncer = null

    tap.on('subtestAdd', t => this.addTest(t))
    tap.on('subtestStart', t => this.startTest(t))
    tap.on('subtestEnd', t => this.endTest(t))
    tap.on('end', () => this.endAll(tap))
    tap.once('bailout', message => this.bailout(message))

    // Handle data that might come out of the tap object itself.
    tap.on('extra', this.onRaw(tap, 1))
    tap.parser.on('result', res => {
      if (res.fullname === 'TAP') {
        this.logRes(tap, res)
        this.inc(res.todo ? 'todo'
          : res.skip ? 'skip'
          : res.ok ? 'pass'
          : 'fail'
        )
      }
    })

    // consume the text stream, but ignore it.
    // we get all we need from the child test objects.
    this.tapResume(tap)
  }

  tapResume (tap) {
    tap.resume()
  }

  get time () {
    return Date.now() - this.start
  }

  componentWillUnmount () {
    clearTimeout(this.counterBouncer)
    clearInterval(this.timer)
  }

  bailout (bailout, test = null) {
    this.bailedOut = bailout
    return this.setState(prevState => prevState.bailout ? prevState : ({
      ...prevState,
      runs: test ? prevState.runs.filter(t => t.childId !== test.childId) : [],
      // if we bail out, then we should only show the bailout,
      // or the counts get confusing, because we never receive a testEnd
      // for the other ones.
      tests: prevState.tests.filter(t =>
        test ? t.childId === test.childId :
        t.results && t.results.bailout === bailout),
      bailout,
      assertCounts: this.assertCounts,
      time: this.time,
    }))
  }

  inc (type) {
    this.assertCounts.total++
    this.assertCounts[type]++
    if (this.counterBouncer)
      return
    this.counterBouncer = setTimeout(() => {
      this.counterBouncer = null
      this.setState(prevState => ({
        ...prevState,
        assertCounts: this.assertCounts
      }))
    }, 50)
  }

  addTest (test) {
    this.setState(prevState => ({
      ...prevState,
      tests: prevState.tests.concat(test),
      suiteCounts: {
        ...prevState.suiteCounts,
        total: prevState.suiteCounts.total + 1,
      },
      assertCounts: this.assertCounts,
      time: this.time,
    }))

    test
      .on('preprocess', options => options.stdio = 'pipe')
      .on('process', proc => {
        proc.stderr.setEncoding('utf8')
        proc.stderr.on('data', this.onRaw(test, 2))
      })
      .parser
        .on('extra', this.onRaw(test, 1))
        .on('pass', res => this.inc('pass'))
        .on('todo', res => (this.inc('todo'), this.logRes(test, res)))
        .on('skip', res => (this.inc('skip'), this.logRes(test, res)))
        .on('fail', res => (this.inc('fail'), this.logRes(test, res)))
  }

  onRaw (test, fd) {
    const p = ` ${fd}>`
    return raw => {
      const pref = chalk.bold.dim(test.name + p + ' ')
      raw = raw.replace(/\n$/, '').replace(/^/gm, pref)
      this.setState(prevState => ({
        ...prevState,
        log: prevState.log.concat({raw}),
        assertCounts: this.assertCounts,
      }))
    }
  }

  logRes (test, res) {
    res.testName = test.name
    this.setState(prevState => ({
      ...prevState,
      log: prevState.log.concat({res}),
      assertCounts: this.assertCounts,
      time: this.time,
    }))
  }

  startTest (test) {
    test.startTime = Date.now()
    test.once('bailout', message => this.bailout(message, test))
    this.setState(prevState => prevState.bailout ? prevState : ({
      ...prevState,
      runs: prevState.runs.concat(test),
      assertCounts: this.assertCounts,
    }))
  }

  endTest (test) {
    test.endTime = Date.now()

    // put it in the appropriate bucket.
    // live update assertion handed by tap.parser event
    const ok = test.results && test.results.ok
    const skip = test.options.skip && ok !== false
    const todo = test.options.todo && ok !== false
    const bucket =
      skip ? 'skip'
      : todo ? 'todo'
      : !ok ? 'fail'
      : 'pass'

    this.setState(prevState => prevState.bailout ? prevState : ({
      ...prevState,
      log: prevState.log.concat({test}),
      runs: prevState.runs.filter(t => t.childId !== test.childId),
      suiteCounts: {
        ...prevState.suiteCounts,
        [bucket]: prevState.suiteCounts[bucket] + 1,
      },
      time: this.time,
      assertCounts: this.assertCounts,
    }))
  }

  endAll (tap) {
    clearInterval(this.timer)
    clearInterval(this.counterBouncer)
    this.setState(prevState => ({
      ...prevState,
      results: tap.results,
      assertCounts: this.assertCounts,
      time: tap.time || this.time,
    }))
  }

  render () {
    return (
      <Box flexDirection="column">
        <this.Log log={this.state.log} />
        <this.Runs runs={this.state.runs} />
        {this.state.results ? (
          <this.Summary
            tests={this.state.tests}
            results={this.state.results} />
        ) : ''}
        <this.Footer
          suiteCounts={this.state.suiteCounts}
          assertCounts={this.state.assertCounts}
          time={this.state.time} />
      </Box>
    )
  }
}

Base.AssertCounts = AssertCounts
Base.AssertName = AssertName
Base.Counts = Counts
Base.Footer = Footer
Base.Log = Log
Base.PassFail = PassFail
Base.Result = Result
Base.Runs = Runs
Base.StatusMark = StatusMark
Base.SuiteCounts = SuiteCounts
Base.Summary = Summary
Base.TestPoint = TestPoint
Base.Test = Test

module.exports = Base
