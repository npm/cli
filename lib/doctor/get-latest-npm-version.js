const log = require('npmlog')
const pacote = require('pacote')
const npm = require('../npm.js')

const getLatestNpmVersion = async cb => {
  const tracker = log.newItem('getLatestNpmVersion', 1)
  tracker.info('getLatestNpmVersion', 'Getting npm package information')
  let version = null
  let error = null
  try {
    version = (await pacote.manifest('npm@latest')).version
  } catch (er) {
    error = er
  }
  tracker.finish()
  return cb(error, version)
}

module.exports = getLatestNpmVersion
