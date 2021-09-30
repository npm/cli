const {stringifyString} = require('yaml/util')

module.exports = {
  identify: value =>
    typeof value === 'symbol' && Symbol.keyFor(value) === undefined,
  tag: '!sym',
  resolve: (doc, cst) => {
    const src = cst.strValue
    const match = src.match(/^Symbol\((.*)\)$/)
    if (!match)
      throw new Error(`Invalid Symbol Expression: ${src}`)
    return Symbol(match[1])
  },
  stringify (item, ctx, onComment, onChompKeep) {
    const value = item.value.toString()
    return stringifyString({ value }, ctx, onComment, onChompKeep)
  }
}
