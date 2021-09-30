const {YAMLMap} = require('yaml/types')
const {parseMap} = require('yaml/util')

const tag = '!nullobject'

class YAMLNullObject extends YAMLMap {
  get tag () { return tag }
  set tag (_) {}
  toJSON(_, ctx) {
    const obj = super.toJSON(_, {...ctx, mapAsMap: false})
    return Object.assign(Object.create(null), obj)
  }
}

const resolve = (doc, cst) =>
  Object.assign(new YAMLNullObject(), parseMap(doc, cst))

const createNode = (schema, obj, ctx) => {
  const nullObjNode = new YAMLNullObject()
  for (const [key, value] of Object.entries(obj)) {
    nullObjNode.items.push(schema.createPair(key, value, ctx))
  }
  return nullObjNode
}

const identify = v => typeof v === 'object' && v && !Object.getPrototypeOf(v)

module.exports = { tag, identify, createNode, resolve }
