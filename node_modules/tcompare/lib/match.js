const Format = require('./format.js')
const Has = require('./has.js')
class Match extends Has {
  test () {
    const obj = this.object
    const pattern = this.expect

    /* istanbul ignore next - node version specific */
    if (typeof BigInt === 'function' && pattern === BigInt)
      return typeof obj === 'bigint'

    return (
      super.test() === true ? true

      // failures that would also fail in the super class
      // but if they didn't pass, then should fail here, too
      : pattern == null || obj == null ? false
      : pattern instanceof RegExp && obj instanceof RegExp ? false
      : Buffer.isBuffer(obj) && Buffer.isBuffer(pattern) ? false
      : typeof pattern === 'symbol' ? false

      // ok, Match-specific stuff
      : pattern instanceof RegExp ? pattern.test('' + obj)
      : typeof obj === 'string' && typeof pattern === 'string' && pattern
        ? obj.indexOf(pattern) !== -1
      : obj instanceof Date && typeof pattern === 'string'
        ? obj.getTime() === new Date(pattern).getTime()
      : pattern === Buffer ? Buffer.isBuffer(obj)
      : pattern === Function ? typeof obj === 'function'
      : pattern === Number
        ? typeof obj === 'number' && obj === obj && isFinite(obj)
      : pattern === String ? typeof obj === 'string'
      : pattern === Symbol ? typeof obj === 'symbol'
      : pattern === Boolean ? typeof obj === 'boolean'
      : pattern === Map ? this.isMap()
      : pattern === Set ? this.isSet()
      : pattern === Object ? obj && typeof obj === 'object'
      : pattern === Array ? new Format(obj).isArray()
      : !this.isError() && (pattern instanceof Error) ? false
      : this.isError() && (
        pattern.message &&
          !new Match(obj.message, {expect:pattern.message}).test() ||
        pattern.name &&
          !new Match(obj.name, {expect:pattern.name}).test()) ? false
      // standard deep matching stuff, same as parent, but not simple.
      : this.isSet() && !(pattern instanceof Set) ? false
      : this.isMap() && !(pattern instanceof Map) ? false
      : typeof pattern === 'function' && typeof obj === 'object'
        ? obj instanceof pattern
      : typeof obj !== 'object' || typeof pattern !== 'object' ? false
      : 'COMPLEX'
    )
  }
}

module.exports = Match
