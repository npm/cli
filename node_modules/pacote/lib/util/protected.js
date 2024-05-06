const readPackageJson = Symbol.for('package.Fetcher._readPackageJson')
const prepareDir = Symbol('_prepareDir')
const tarballFromResolved = Symbol.for('pacote.Fetcher._tarballFromResolved')
const cacheFetches = Symbol.for('pacote.Fetcher._cacheFetches')

module.exports = {
  readPackageJson,
  prepareDir,
  tarballFromResolved,
  cacheFetches,
}
