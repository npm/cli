const customTags = require('./types/index.js')
const yaml = require('yaml')
module.exports = obj => yaml.stringify(obj, { customTags, prettyErrors: true })
