const React = require('react')
const importJSX = require('import-jsx')
const Base = importJSX('../base')
const Footer = importJSX('./footer.js')
const Log = importJSX('./log.js')
const Summary = importJSX('./summary.js')
const chalk = require('chalk')
const TestPoint = importJSX('./test-point.js')

class Specy extends Base {
  constructor ({tap}) {
    super({tap})
    this.lastThing = null
    this.tap = tap
  }

  // just override these with no-ops
  logRes () {}
  tapResume () {}

  // TODO: Instead of doing this on the root TAP object, save up all the
  // results on each Test object, and then dump them out when the test ends.
  // Test order is not important, but the asserts from one test can't be
  // interleaved with another.
  componentDidMount () {
    const tap = this.tap
    const onAssert = p => res => {
      const c = p.lastChild
      p.lastChild = null
      if (c && res.name === c.name)
        return

      res.level = p.level

      this.lastThing = 'assert'
      this.setState(prevState => ({
        ...prevState,
        log: prevState.log.concat({res}),
      }))
    }
    const onParser = p => {
      if (p.parent)
        p.parent.lastChild = p
      p.on('child', onParser)
      p.on('assert', onAssert(p))
      if (p.level === 0)
        return

      const raw = (this.lastThing === 'assert' ? '\n' : '')
        + new Array(p.level).join('  ') + p.name
      this.lastThing = 'suite'
      this.setState(prevState => ({
        ...prevState,
        log: prevState.log.concat({raw}),
      }))
    }
    onParser(tap.parser)
    tap.resume()
  }

  get Log () {
    return Log
  }
  get Footer () {
    return Footer
  }
  get Summary () {
    return Summary
  }
}

module.exports = Specy
