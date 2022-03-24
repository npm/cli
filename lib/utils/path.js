// return the PATH array in a cross-platform way
// TODO this is only used in a single place
const PATH = process.env.PATH || process.env.Path || process.env.path
const { delimiter } = require('path')
module.exports = PATH.split(delimiter)
