const unindent = s => {
  // get the first \n followed by a bunch of spaces, and pluck off
  // that many spaces from the start of every line.
  const match = s.match(/\n +/)
  return !match ? s.trim() : s.split(match[0]).join('\n').trim()
}

const wrap = (str, { min = 20, max = 80, padding = 5, columns = process.stdout.columns } = {}) => {
  const cols = Math.min(Math.max(min, columns) || max, max) - padding
  return unindent(str)
    .split(/[ \n]+/)
    .reduce((left, right) => {
      const last = left.split('\n').pop()
      const join = last.length && last.length + right.length > cols ? '\n' : ' '
      return left + join + right
    })
}

module.exports = wrap
module.exports.wrap = wrap
module.exports.unindent = unindent
