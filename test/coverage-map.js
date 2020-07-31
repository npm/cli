'use strict'

const coverageMap = (filename) => {
  if (/^test\/(lib|bin)\//.test(filename)) {
    return filename.replace(/^test\//, '')
  }
  return []
}

module.exports = coverageMap
