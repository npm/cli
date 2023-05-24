const t = require('tap')
const typeDescription = require('../lib/type-description.js')
const defs = require('../lib/definitions/definitions.js')

const descriptions = {}

for (const [name, { type }] of Object.entries(defs)) {
  const desc = typeDescription(type)
  if (name === 'local-address') {
    t.strictSame(desc.sort(), type.filter(t => t !== undefined).sort())
  } else {
    descriptions[name] = desc
  }
}

t.matchSnapshot(descriptions)

class Unknown {}
t.strictSame(typeDescription(Unknown), [Unknown], 'unknown class returns itself')
