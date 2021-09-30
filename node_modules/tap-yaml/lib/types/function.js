const {stringifyString} = require('yaml/util')

module.exports = {
  identify: value => typeof value === 'function',
  tag: '!function',
  resolve: (doc, cst) => {
    const src = cst.strValue.split('\n')
    const name = JSON.parse(src.shift())
    const code = src.join('\n')
    const f = function () {}
    Object.defineProperty(f, 'name', { value: name, enumerable: false })
    f.toString = () => code
    return f
  },
  options: { defaultType: 'BLOCK_LITERAL', lineWidth: 76 },
  stringify ({ comment, type, value }, ctx, onComment, onChompKeep) {
    value = JSON.stringify(value.name) + '\n' + value.toString()
    // better to just always put functions on a new line.
    type = type || module.exports.options.defaultType
    return stringifyString({ comment, type, value }, ctx, onComment, onChompKeep)
  },
  default: false,
}
