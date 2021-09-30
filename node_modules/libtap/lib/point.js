'use strict'
const diags = require('./diags.js')

class TestPoint {
  constructor (ok, message, extra) {
    if (typeof ok !== 'boolean')
      throw new TypeError('ok must be boolean')

    if (typeof message !== 'string')
      throw new TypeError('message must be a string')

    extra = extra || {}

    this.ok = ok ? 'ok ' : 'not ok '
    this.message = tpMessage(message.trim(), extra)
  }
}

const tpMessage = (message, extra) => {
  if (message)
    message = ' - ' + message

  // replace \r\n with one space, \t with 2, separately
  message = message.replace(/[\n\r]/g, ' ').replace(/\t/g, '  ')

  if (extra.skip) {
    message += ' # SKIP'
    if (typeof extra.skip === 'string')
      message += ' ' + extra.skip
  } else if (extra.todo) {
    message += ' # TODO'
    if (typeof extra.todo === 'string')
      message += ' ' + extra.todo
  } else if (extra.time)
    message += ' # time=' + extra.time + 'ms'

  const diagYaml = extra.diagnostic ? diags(extra) : ''
  message += diagYaml

  if (extra.tapChildBuffer || extra.tapChildBuffer === '') {
    if (!diagYaml)
      message += ' '
    message += '{\n' + extra.tapChildBuffer.trimRight() + '\n}\n'
  }

  message += '\n'

  return message
}

module.exports = TestPoint
