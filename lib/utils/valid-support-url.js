const URL = require('url').URL

// Is the value of a `support` property of a `package.json` object
// a valid URL for `npm support` to display?
module.exports = function (argument) {
  if (typeof argument !== 'string' || argument.length === 0) {
    return false
  }
  try {
    var parsed = new URL(argument)
  } catch (error) {
    return false
  }
  if (
    parsed.protocol !== 'https:' &&
    parsed.protocol !== 'http:'
  ) return false
  return parsed.host
}
