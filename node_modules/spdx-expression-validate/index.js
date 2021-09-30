var parse = require('spdx-expression-parse')

var containsRepeatedSpace = /\s{2,}/

module.exports = function spdxExpressionValidate (argument) {
  var fatString = (
    argument.trim() !== argument ||
    containsRepeatedSpace.test(argument)
  )
  if (fatString) {
    return false
  } else {
    try {
      parse(argument)
      return true
    } catch (e) {
      return false
    }
  }
}
