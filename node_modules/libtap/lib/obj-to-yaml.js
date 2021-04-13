'use strict'

const yaml = require('tap-yaml')
const cleanYamlObject = require('./clean-yaml-object.js')

module.exports = obj => (clean =>
  (clean && typeof clean === 'object' && Object.keys(clean).length) ?
    '  ---\n' + (yaml.stringify(clean).split('\n').map(
      l => l.trim() ? '  ' + l : l.trim()
    ).join('\n')) + '  ...\n'
    : ''
)(cleanYamlObject(obj))
