// the same as read-package-json-fast, but stash the
// indent and newline on known symbols for later retrieval.
const {normalize} = require('read-package-json-fast')
const jsonParse = require('json-parse-even-better-errors')
const {promisify} = require('util')
const readFile = promisify(require('fs').readFile)
const kIndent = Symbol.for('indent')
const kNewline = Symbol.for('newline')

module.exports = async path => readFile(path, 'utf8').then(data => {
  // just take the first line-break and indent, if any are present
  const m = data.match(/(\r?\n)(\s*)"/)
  const newline = m ? m[1] : '\n'
  const indent = m ? m[2] : ''
  const pkg = normalize(jsonParse(data))
  pkg[kIndent] = indent
  pkg[kNewline] = newline
  return pkg
})
