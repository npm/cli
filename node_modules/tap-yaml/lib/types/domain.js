const { YAMLMap } = require('yaml/types')
const { parseMap } = require('yaml/util')

const tag = '!domain'

class YAMLDomain extends YAMLMap {
  get tag () { return tag }
  set tag (_) {}
  toJSON(_, ctx) {
    return require('domain').create()
  }
}

const resolve = (doc, cst) =>
  Object.assign(new YAMLDomain(), parseMap(doc, cst))

const createNode = (schema, error, ctx) => new YAMLDomain()

module.exports = {
  identify: value => value && typeof value === 'object' &&
      value.constructor &&
      value.constructor.name === 'Domain'
    ? value instanceof (require('domain').Domain)
    : false,
  tag,
  resolve,
  createNode,
}
