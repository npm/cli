'use strict'

class ErrInvalidAuth extends Error {
  constructor (problems) {
    const msgs = problems.map((problem) => {
      if (problem.action === 'delete') {
        return `\`${problem.key}\` is not allowed in ${problem.where} config`
      } else if (problem.action === 'rename') {
        return `\`${problem.from}\` must be renamed to \`${problem.to}\` in ${problem.where} config`
      }
    }).join(', ')
    super(
      `Invalid auth configuration found: ${msgs}\n` +
      'Please run `npm config fix` to repair your configuration.'
    )
    this.code = 'ERR_INVALID_AUTH'
    this.problems = problems
  }
}

module.exports = {
  ErrInvalidAuth,
}
