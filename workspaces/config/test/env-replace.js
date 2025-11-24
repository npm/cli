const envReplace = require('../lib/env-replace.js')
const t = require('tap')

const env = {
  foo: 'bar',
  bar: 'baz',
}

t.equal(envReplace('${foo}', env), 'bar', 'replaces defined variable')
t.equal(envReplace('${foo?}', env), 'bar', 'replaces defined variable with ? modifier')
t.equal(envReplace('${foo}${bar}', env), 'barbaz', 'replaces multiple defined variables')
t.equal(envReplace('${foo?}${baz?}', env), 'bar', 'replaces mixed defined/undefined variables with ? modifier')
t.equal(envReplace('\\${foo}', env), '${foo}', 'escapes normal variable')
t.equal(envReplace('\\\\${foo}', env), '\\bar', 'double escape allows replacement')
t.equal(envReplace('\\\\\\${foo}', env), '\\${foo}', 'triple escape prevents replacement')
t.equal(envReplace('${baz}', env), '${baz}', 'leaves undefined variable unreplaced')
t.equal(envReplace('\\${baz}', env), '${baz}', 'escapes undefined variable')
t.equal(envReplace('\\\\${baz}', env), '\\${baz}', 'double escape with undefined variable')
t.equal(envReplace('\\${foo?}', env), '${foo?}', 'escapes optional variable')
t.equal(envReplace('\\\\${foo?}', env), '\\bar', 'double escape allows optional replacement')
t.equal(envReplace('${baz?}', env), '', 'replaces undefined variable with empty string when using ? modifier')
t.equal(envReplace('\\${baz?}', env), '${baz?}', 'escapes undefined optional variable')
t.equal(envReplace('\\\\${baz?}', env), '\\', 'double escape with undefined optional variable results in empty replacement')
