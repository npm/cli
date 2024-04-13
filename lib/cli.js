const validateEngines = require('./es6/validate-engines.js')
const cliEntry = require('node:path').resolve(__dirname, 'cli-entry.js')

module.exports = (process) => validateEngines(process, () => require(cliEntry))
