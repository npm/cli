const {stringifyString} = require('yaml/util')

module.exports = {
  identify: value => value instanceof RegExp,
  tag: '!re',
  resolve (doc, cst) {
    const match = cst.strValue.match(/^\/([\s\S]+)\/([gimuy]*)$/)
    if (!match)
      throw new Error(`Invalid Regular Expression: ${cst.strValue}`)
    return new RegExp(match[1], match[2])
  },
  stringify (item, ctx, onComment, onChompKeep) {
    const value = item.value.toString()
    return stringifyString({ value }, ctx, onComment, onChompKeep)
  }
}
