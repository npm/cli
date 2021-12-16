const t = require('tap')
const readJson = require('../lib/read-json.js')

const kIndent = Symbol.for('indent')
const kNewline = Symbol.for('newline')

t.test('do not strip or mutate anything', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'foo',
      _someField: 'someValue',
      bin: '../../../../../../etc/passwd',
    }, null, 2),
    'crlf-tabs.json': JSON.stringify({
      name: 'curly leaflets tabula rasa',
      version: '9',
    }, null, '\t').replace(/\n/g, '\r\n'),
    'space-tabs.json': JSON.stringify({
      name: 'spacetabular',
      version: '9000.0.1',
    }, null, '  \t \t'),
  })
  const basic = await readJson(path + '/package.json')
  t.matchSnapshot(basic, 'package.json')
  t.equal(basic[kIndent], '  ')
  t.equal(basic[kNewline], '\n')

  const crlfTabs = await readJson(path + '/crlf-tabs.json')
  t.matchSnapshot(crlfTabs, 'crlf-tabs.json')
  t.equal(crlfTabs[kIndent], '\t')
  t.equal(crlfTabs[kNewline], '\r\n')

  const spaceTabs = await readJson(path + '/space-tabs.json')
  t.matchSnapshot(spaceTabs, 'space-tabs.json')
  t.equal(spaceTabs[kIndent], '  \t \t')
  t.equal(spaceTabs[kNewline], '\n')
})
