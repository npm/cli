const {stringifyString} = require('yaml/util')

module.exports = {
  identify: value =>
    typeof value === 'symbol' && Symbol.keyFor(value) !== undefined,
  tag: '!sym/for',
  resolve: (doc, cst) => {
    const src = cst.strValue
    const match = src.match(/^Symbol.for\((.*)\)$/)
    if (!match)
      throw new Error(`Invalid Symbol Expression: ${src}`)
    return Symbol.for(match[1])
  },
  stringify(item, ctx, onComment, onChompKeep) {
    const src = `Symbol.for(${Symbol.keyFor(item.value)})`
    return stringifyString({ value: src }, ctx, onComment, onChompKeep)
  }
}
