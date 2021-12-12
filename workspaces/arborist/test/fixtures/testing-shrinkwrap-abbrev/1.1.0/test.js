const { version } = require('./package.json')
const { version: abbrev } = require('./node_modules/abbrev/package.json')
require('assert').equal(version, abbrev, 'should have same version')
