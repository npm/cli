const { version: abbrev } = require('./node_modules/abbrev/package.json')
require('assert').equal(abbrev, '1.1.0', 'should have same version')
