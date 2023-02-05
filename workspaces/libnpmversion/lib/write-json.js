// write the json back, preserving the line breaks and indent
const { promisify } = require('util')
const createObjectjWithSortedKeys = require('../../../lib/utils/sort-package.js');
const writeFile = promisify(require('fs').writeFile)
const kIndent = Symbol.for('indent')
const kNewline = Symbol.for('newline')

module.exports = async (path, pkg) => {
  const {
    [kIndent]: indent = 2,
    [kNewline]: newline = '\n',
  } = pkg
  delete pkg._id
  const pkgWithSortedKeys = createObjectjWithSortedKeys(pkg)
  const raw = JSON.stringify(pkgWithSortedKeys, null, indent) + '\n'
  const data = newline === '\n' ? raw : raw.split('\n').join(newline)
  return writeFile(path, data)
}
