const t = require('tap')
const typeDescription = require('../lib/type-description.js')
const types = require('./fixtures/types.js')
const descriptions = {}
for (const [name, type] of Object.entries(types)) {
  const desc = typeDescription(type)
  if (name === 'local-address') {
    t.strictSame(desc.sort(), type.filter(t => t !== undefined).sort())
  } else {
    descriptions[name] = desc
  }
}

t.matchSnapshot(descriptions)
