// return the PATH array in a cross-platform way
const { delimiter } = require('path')

const keys = ['PATH', 'Path', 'path']
const key = keys.find(k => process.env[k])
const value = process.env[key] || ''

module.exports = {
  PATH: value.split(delimiter),
  key,
  keys,
  value,
}
