const typeDefs = require('../lib/type-defs.js')
const t = require('tap')
const {
  semver: {
    validate: validateSemver,
  },
  path: {
    validate: validatePath,
  },
  BooleanOrString: {
    validate: validateBooleanOrString,
  },
} = typeDefs
const { resolve } = require('path')

const d = { semver: 'foobar', somePath: true, boolOrString: 'true' }
t.equal(validateSemver(d, 'semver', 'foobar'), false)
t.equal(validateSemver(d, 'semver', 'v1.2.3'), undefined)
t.equal(d.semver, '1.2.3')
t.equal(validatePath(d, 'somePath', true), false)
t.equal(validatePath(d, 'somePath', false), false)
t.equal(validatePath(d, 'somePath', null), false)
t.equal(validatePath(d, 'somePath', 1234), false)
t.equal(validatePath(d, 'somePath', 'false'), true)
t.equal(d.somePath, resolve('false'))

t.equal(validateBooleanOrString(d, 'boolOrString', 'true'), undefined)
t.equal(validateBooleanOrString(d, 'boolOrString', 'false'), undefined)
t.equal(validateBooleanOrString(d, 'boolOrString', true), undefined)
t.equal(validateBooleanOrString(d, 'boolOrString', false), undefined)
t.equal(validateBooleanOrString(d, 'boolOrString', 'foobar'), undefined)
t.equal(validateBooleanOrString(d, 'boolOrString', ''), undefined)
t.equal(validateBooleanOrString(d, 'boolOrString', null), false)
