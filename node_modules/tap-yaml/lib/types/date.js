const {stringifyString} = require('yaml/util')

module.exports = {
  tag: '!date',
  identify: value => value instanceof Date,
  resolve (doc, cst) {
    const src = cst.strValue
    const match = src.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)$/)
    if (!match)
      throw new Error(`Invalid date string: ${src}`)
    return new Date(src)
  },
  stringify (item, ctx, onComment, onChompKeep) {
    const value = item.value.toISOString()
    return stringifyString({ value }, ctx, onComment, onChompKeep)
  }
}
