const t = require('tap')
const retirePath = require('../lib/retire-path.js')
const normalizePath = path => path.replace(/^\w:/, '').replace(/\\/g, '/')
t.equal(normalizePath(retirePath('/path/to/some/thing')), '/path/to/some/.thing-4GeEMv8c')
