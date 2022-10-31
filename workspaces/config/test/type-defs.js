const typeDefs = require('../lib/type-defs.js')
const t = require('tap')
const {
  semver: {
    validate: validateSemver,
  },
  path: {
    validate: validatePath,
  },
} = typeDefs
const { resolve } = require('path')

const d = { semver: 'foobar', somePath: true }
t.equal(validateSemver(d, 'semver', 'foobar'), false)
t.equal(validateSemver(d, 'semver', 'v1.2.3'), undefined)
t.equal(d.semver, '1.2.3')
t.equal(validatePath(d, 'somePath', true), false)
t.equal(validatePath(d, 'somePath', false), false)
t.equal(validatePath(d, 'somePath', null), false)
t.equal(validatePath(d, 'somePath', 1234), false)
t.equal(validatePath(d, 'somePath', 'false'), true)
t.equal(d.somePath, resolve('false'))
