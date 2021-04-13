'use strict'

const objToYaml = require('./obj-to-yaml.js')

module.exports = extra => (y => y ? '\n' + y : '')(objToYaml(extra))
