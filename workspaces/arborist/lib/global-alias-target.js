const npa = require('npm-package-arg')

// Global installs have no root manifest. An npm alias has a different
// registry name in its package.json than the name of its installed folder.
module.exports = (name, packageName) => {
  if (typeof packageName !== 'string' || !packageName || packageName === name) {
    return null
  }

  try {
    return npa.resolve(packageName, '*').name
  } catch {
    return null
  }
}
