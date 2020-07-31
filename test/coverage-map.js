'use strict'

const coverageMap = (filename) => {
  if (/^test\/lib\//.test(filename)) {
    return filename.replace(/^test\//, '')
  }
  return []
}

module.exports = coverageMap
