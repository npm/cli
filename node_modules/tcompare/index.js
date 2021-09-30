const Format = require('./lib/format.js')
const Same = require('./lib/same.js')
const Strict = require('./lib/strict.js')
const Has = require('./lib/has.js')
const HasStrict = require('./lib/has-strict.js')
const Match = require('./lib/match.js')

const simple = o => ({
  diff: o.print(),
  match: o.match,
})
const fn = cls => (obj, pattern, options = {}) =>
  simple(new cls(obj, { expect: pattern, ...options }))

module.exports = {
  format: (obj, options = {}) =>
    new Format(obj, options).print(),
  same: fn(Same),
  strict: fn(Strict),
  has: fn(Has),
  hasStrict: fn(HasStrict),
  match: fn(Match),
  Format,
  Same,
  Strict,
  Has,
  HasStrict,
  Match,
}
