'use strict'

const libSearch = require('libnpmsearch')

const packageSuggestions = async (name, npm) => {
  // If we don't have a package name, we can't suggest anything
  if (!name || name === '-') {
    return []
  }

  // Strip version if present (e.g. pkg@1.0.0 -> pkg)
  const pkgName = name.replace(/(?!^)@.*$/, '')

  try {
    const results = await libSearch(pkgName, {
      ...npm.flatOptions,
      limit: 5,
      timeout: 3000, // 3 seconds timeout
    })

    return results
      .map(r => r.name)
      .filter(n => n !== pkgName) // Don't suggest the same name
  } catch (err) {
    // If search fails for any reason (e.g. network), just return no suggestions
    // instead of failing the error handling itself.
    return []
  }
}

module.exports = packageSuggestions
