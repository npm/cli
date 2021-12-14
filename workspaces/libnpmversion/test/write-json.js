const t = require('tap')
const requireInject = require('require-inject')
const fs = require('fs')
const writeJson = requireInject('../lib/write-json.js', {
  fs: {
    ...fs,
    writeFile: (path, data, cb) => cb(null, [path, data]),
  },
})

const kIndent = Symbol.for('indent')
const kNewline = Symbol.for('newline')

t.test('write json with newlines and indent set', async t => {
  t.same(await writeJson('x', {
    [kNewline]: '\r\n',
    [kIndent]: 3,
    a: 1,
    b: [2, 3],
  }), [
    'x',
    '{\r\n' +
    '   "a": 1,\r\n' +
    '   "b": [\r\n' +
    '      2,\r\n' +
    '      3\r\n' +
    '   ]\r\n' +
    '}\r\n',
  ], 'numeric three space indent, CRLF line breaks')

  t.same(await writeJson('x', {
    [kNewline]: 'XYZ\n',
    [kIndent]: '\t',
    a: 1,
    b: [2, 3],
  }), [
    'x',
    '{XYZ\n' +
    '\t"a": 1,XYZ\n' +
    '\t"b": [XYZ\n' +
    '\t\t2,XYZ\n' +
    '\t\t3XYZ\n' +
    '\t]XYZ\n' +
    '}XYZ\n',
  ], 'string tap indent, CRLF line breaks')

  t.same(await writeJson('x', {
    a: 1,
    b: [2, 3],
  }), [
    'x',
    '{\n' +
    '  "a": 1,\n' +
    '  "b": [\n' +
    '    2,\n' +
    '    3\n' +
    '  ]\n' +
    '}\n',
  ], 'default newline and indent')
})
