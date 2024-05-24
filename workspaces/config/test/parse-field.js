const parseField = require('../lib/parse-field.js')
const t = require('tap')
const { resolve } = require('node:path')

const defs = require('../lib/definitions/definitions.js')
const types = Object.entries(defs).map(([k, v]) => [k, v.type])

t.strictSame(parseField({ a: 1 }, 'a'), { a: 1 })

const opts = {
  platform: 'posix',
  types: Object.fromEntries(types),
  home: '/home/user',
  env: { foo: 'bar' },
}

t.equal(parseField('', 'global', opts), true, 'boolean flag')
t.equal(parseField('true', 'global', opts), true, 'boolean flag "true"')
t.equal(parseField('false', 'global', opts), false, 'boolean flag "false"')
t.equal(parseField('null', 'access', opts), null, '"null" is null')
t.equal(parseField('undefined', 'access', opts), undefined, '"undefined" is undefined')
t.equal(parseField('blerg', 'access', opts), 'blerg', '"blerg" just is a string')
t.equal(parseField('blerg', 'message', opts), 'blerg', '"blerg" just is a string')
t.strictSame(parseField([], 'global', opts), [], 'array passed to non-list type')
t.strictSame(parseField([' dev '], 'omit', opts), ['dev'], 'array to list type')
t.strictSame(parseField('dev\n\noptional', 'omit', opts), ['dev', 'optional'],
  'double-LF delimited list, like we support in env vals')
t.equal(parseField('~/foo', 'userconfig', opts), resolve('/home/user/foo'),
  'path supports ~/')
t.equal(parseField('~\\foo', 'userconfig', { ...opts, platform: 'win32' }),
  resolve('/home/user/foo'), 'path supports ~\\ on windows')
t.equal(parseField('foo', 'userconfig', opts), resolve('foo'),
  'path gets resolved')

t.equal(parseField('1234', 'maxsockets', opts), 1234, 'number is parsed')

t.equal(parseField('0888', 'umask', opts), '0888',
  'invalid umask is not parsed (will warn later)')
t.equal(parseField('0777', 'umask', opts), 0o777, 'valid umask is parsed')
t.equal(parseField('777', 'umask', opts), 777, 'valid umask is parsed')

t.same(parseField('2020', 'before', opts), new Date('2020'), 'date is parsed')
