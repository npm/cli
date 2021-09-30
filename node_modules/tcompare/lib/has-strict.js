const Has = require('./has.js')
const Strict = require('./strict.js')
class HasStrict extends Has {
  test () {
    const a = this.object
    const b = this.expect
    // constructor match is relevant to Strict, but HasStrict should
    // not do that, it's inconvenient, since it means you can't do
    // hasStrict(new URL('https://x.com/y'), { pathname: '/y' })
    // So, for objects, we just call Same.  Everything else, call Strict.
    if (a && b && typeof a === 'object' && typeof b === 'object' &&
        Array.isArray(a) === Array.isArray(b))
      return super.test()
    else
      return Strict.prototype.test.call(this)
  }
}
module.exports = HasStrict
