var proc = typeof process === 'object' && process ? process : { env: {} }
var ownOr = require('own-or')
module.exports = function ownOrEnv (object, field, env, bool) {
  var res = ownOr(object, field, proc.env[env])
  if (bool)
    res = !!+(res)
  return res
}
