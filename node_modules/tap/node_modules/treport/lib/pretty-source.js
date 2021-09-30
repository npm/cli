const {highlightFileSync} = require('cardinal')
const theme = require('./cardinal-theme.js')
const c = require('chalk')
const { red, bold } = c
const slen = require('string-length')

// lol
const lp = (s,n) => `${
  new Array(n - slen(''+s) + 1).join(' ')
}${s}`

const gray = s =>
  c.supportsColor.level >= 2 ? c.hex('#aaa')(s) : c.gray(s)

const dim = s =>
  c.supportsColor.level >= 2 ? c.hex('#777')(s) : c.dim(s)

module.exports = (diag) => {
  if (!diag || typeof diag.source !== 'string')
    return null

  if (!diag.source || !diag.at || !diag.at.line || !diag.at.file)
    return diag.source

  const source = diag.source

  const at = diag.at
  try {
    const lines = highlightFileSync(at.file, {
      jsx: true,
      theme,
    }).replace(/\n$/, '').split('\n')

    const ctx = 3
    const startLine = Math.max(at.line - ctx, 0)
    const endLine = Math.min(at.line + ctx, lines.length)
    const numLen = endLine.toString().length + 1

    const line = (lines[at.line - 1])
    const caret = at.column && at.column <= slen(line)
      ? [
        `  ${new Array(numLen).join(' ')
          } ` + dim('| ') +
          c.red(`${new Array(at.column).join('-')}${c.bold('^')}`)
      ] : []

    const title = gray('  ' + at.file)
    const before = lines.slice(startLine, at.line - 1)
    const after = lines.slice(at.line, endLine)

    const context = [title].concat(before.map((l, i) =>
      ` ${dim(lp(i + startLine + 1, numLen)+ ' | ')}${l}`))
      .concat(
        red(bold(`>`)) +
        lp(at.line, numLen) +
        dim(' | ') +
        line
      )
      .concat(caret)
      .concat(after.map((l, i) =>
        ` ${dim(lp(i + at.line + 1, numLen) + ' | ')}${l}`))

    const cols = process.stdout.columns || 80
    const lineLength = Math.min(cols - 2,
      Math.max(...(context.map(l => slen(l) + 3))))

    const csplit = context.map(line => {
      const len = Math.max(1, lineLength - slen(line))
      return c.bgHex('#222')(line + new Array(len).join(' '))
    }).join('\n')

    delete diag.at
    return csplit + '\n'
  } catch (er) {
    return source
  }
  // should be impossible, but just in case
  /* istanbul ignore next */
  return source
}
