const { YAMLMap } = require('yaml/types')
const { parseMap } = require('yaml/util')

const tag = '!error'

class JavaScriptError extends YAMLMap {
  get tag () { return tag }
  set tag (_) {}
  toJSON(_, ctx) {
    const { name, message, ...rest } = super.toJSON(_, ctx, Object)
    const Cls =
      name === 'EvalError' ? EvalError
        : name === 'RangeError' ? RangeError
        : name === 'ReferenceError' ? ReferenceError
        : name === 'SyntaxError' ? SyntaxError
        : name === 'TypeError' ? TypeError
        : name === 'URIError' ? URIError
        : Error
    if (Cls.name !== name)
      rest.name = name
    return Object.assign(new Cls(message), rest)
  }
}

const identify = er => er instanceof Error

// If the user cared to provide a custom inspect, then use
// that as the source of extra properties.
const util = require('util')
const inspect = util.inspect.custom
const createNode = (schema, error, ctx) => {
  const node = new JavaScriptError()
  const ins = typeof error[inspect] === 'function' && error[inspect]()
  for (const [key, value] of Object.entries({
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...(ins && typeof ins === 'object' ? ins : error),
  })) {
    if (key === 'domain' ||
        key === 'domainEmitter' ||
        key === 'domainThrew')
      continue
    const pair = schema.createPair(key, value, ctx)
    node.items.push(pair)
  }
  return node
}

const resolve = (doc, cst) =>
  Object.assign(new JavaScriptError(), parseMap(doc, cst))

module.exports = { tag, identify, createNode, resolve }
