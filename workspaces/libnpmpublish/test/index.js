const t = require('tap')
const index = require('../index.js')
t.strictSame(index, {
  publish: require('../publish.js'),
  unpublish: require('../unpublish.js'),
})
