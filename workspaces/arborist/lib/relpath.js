const { relative } = require('node:path')

const relpath = (from, to) => {
  // On Windows, handle case-insensitive path comparison for the entire path
  if (process.platform === 'win32') {
    const normalizedFrom = from.toLowerCase()
    const normalizedTo = to.toLowerCase()
    const result = relative(normalizedFrom, normalizedTo)
    return result.replace(/\\/g, '/')
  }
  
  return relative(from, to).replace(/\\/g, '/')
}

module.exports = relpath
