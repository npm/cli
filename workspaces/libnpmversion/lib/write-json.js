// write the json back, preserving the line breaks and indent
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

  // Write to a temp file and rename into place so a concurrent reader (e.g.
  // another `npm version` process resolving workspaces) never observes a
  // truncated or partially written package.json.
  const tmpPath = `${path}.${randomBytes(6).toString('hex')}.tmp`
  try {
    await writeFile(tmpPath, data)
    await rename(tmpPath, path)
  } catch (err) {
    await unlink(tmpPath).catch(() => {})
    throw err
  }
}
