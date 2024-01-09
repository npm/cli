const loadActual = require('../../../lib/load-actual.js')
loadActual(__dirname).then(tree => {
  console.log(require('util').inspect(tree, { depth: Infinity }))
})
