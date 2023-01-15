const { replaceEnv } = require('../lib/set-globals')
const t = require('tap')

const env = {
  foo: 'bar',
  bar: 'baz',
}

t.equal(replaceEnv(env, '\\${foo}'), '${foo}')
t.equal(replaceEnv(env, '\\\\${foo}'), '\\bar')
t.equal(replaceEnv(env, '${baz}'), '${baz}')
t.equal(replaceEnv(env, '\\${baz}'), '${baz}')
t.equal(replaceEnv(env, '\\\\${baz}'), '\\${baz}')
