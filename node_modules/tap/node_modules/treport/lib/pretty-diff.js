const slen = require('string-length')
const c = require('chalk')

const green = s =>
  c.supportsColor.level >= 2 ? c.ansi256(22).bgAnsi256(193)(s) : c.green(s)

const red = s =>
  c.supportsColor.level >= 2 ? c.ansi256(52).bgAnsi256(218)(s) : c.red(s)

const ctx = s => {
  const f = s.match(/^(\@\@.*?\@\@)( .*)$/)
  return f ? frag(f[1]) + ctxExtra(f[2])
    : frag(s)
}

const frag = s =>
  c.supportsColor.level >= 2 ? c.bold.bgHex('#fff').ansi256(165)(s)
    : c.bold.magenta(s)

const ctxExtra = s =>
  c.supportsColor.level >= 2 ? c.bgHex('#fff').ansi256(68).bold(s)
    : c.reset.bold.dim(s)

const white = s =>
  c.supportsColor.level >= 2 ? c.bgHex('#fff').hex('#111')(s) : c.reset(s)

const repeat = (n, c) => new Array(Math.max(n + 1, 0)).join(c)

module.exports = patch => {
  if (!patch)
    return null

  const columns = process.stdout.columns || 80
  let width = 0
  const maxLen = Math.max(columns - 5, 0)
  return patch.trimRight().split('\n').filter((line, index) => {
    if (slen(line) > width)
      width = Math.min(maxLen, slen(line))
    return !(
      line.match(/^\=+$/) ||
      line === '\\ No newline at end of file'
    )
  }).map(line =>
    slen(line) <= width
    ? line + repeat(width - slen(line) + 1, ' ')
    : line
  ).map(line =>
    line.charAt(0) === '+' ? green(line)
    : line.charAt(0) === '-' ? red(line)
    : line.charAt(0) === '@' ? ctx(line)
    : white(line)
  ).map(l => `  ${l}`).join('\n').trimRight()
}
