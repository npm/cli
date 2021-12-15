const t = require('tap')
const index = require('../lib/index.js')
t.strictSame(index, {
  publish: require('../lib/publish.js'),
  unpublish: require('../lib/unpublish.js'),
})
