// write the json back, preserving the line breaks and indent
//
// writes are done atomically (write to a temp file, then rename over the
// target) so that a concurrent reader never observes a truncated or
// partially written package.json, e.g. when `npm version` is parallelized
// across workspaces.
const { writeFile, rename, unlink } = require('node:fs/promises')
const { randomBytes } = require('node:crypto')
const kIndent = Symbol.for('indent')
const kNewline = Symbol.for('newline')

module.exports = async (path, pkg) => {
  const {
    [kIndent]: indent = 2,
    [kNewline]: newline = '\n',
  } = pkg
  delete pkg._id
  const raw = JSON.stringify(pkg, null, indent) + '\n'
  const data = newline === '\n' ? raw : raw.split('\n').join(newline)
  const tmp = `${path}.${randomBytes(6).toString('hex')}.tmp`
  try {
    await writeFile(tmp, data)
    await rename(tmp, path)
  } catch (err) {
    try {
      await unlink(tmp)
    } catch {
      // ignore, tmp may never have been created
    }
    throw err
  }
}
