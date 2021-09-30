'use strict'
const process = require('./process.js')
const path = require('path')
const fs = require('fs')
const diff = require('diff')
const {format, strict} = require('tcompare')
const stack = require('./stack.js')
const settings = require('../settings')

const hasOwn = (obj, key) =>
  Object.prototype.hasOwnProperty.call(obj, key)

const cleanDiag = object => {
  const res = { ...object }
  if (hasOwn(res, 'stack') && !hasOwn(res, 'at'))
    res.at = stack.parseLine(res.stack.split('\n')[0])

  const file = res.at && res.at.file && path.resolve(res.at.file)
  if (!settings.atTap && file && file.includes(__dirname)) {
    // don't print locations in tap itself, that's almost never useful
    delete res.at
  }

  if (file && res.at && res.at.file && res.at.line && !res.source) {
    const content = (() => {
      try {
        return fs.readFileSync(file, 'utf8')
      } catch {
      }
    })()
    if (content) {
      const lines = content.split('\n')
      if (res.at.line <= lines.length) {
        const startLine = Math.max(res.at.line - 2, 0)
        const endLine = Math.min(res.at.line + 2, lines.length)
        const caret = res.at.column &&
          res.at.column <= lines[res.at.line - 1].length
          ? [new Array(res.at.column).join('-') + '^'] : []
        const context = lines.slice(startLine, res.at.line).concat(caret)
          .concat(lines.slice(res.at.line, endLine))
        const csplit = context.join('\n').trimRight()
        if (csplit)
          res.source = csplit + '\n'
      }
    }
  }

  // show a line by line string diff
  // diff the yaml, to make it more humane, especially
  // when strings or buffers are very large or multi-line
  if (res.found && res.wanted && res.found !== res.wanted && !res.diff) {
    const f = res.found
    const w = res.wanted
    if (typeof f === 'string' && typeof w === 'string')
      res.diff = diff.createTwoFilesPatch('expected', 'actual', w + '\n', f + '\n')
        .replace(/^=+\n/, '')
    else if (f && w && typeof f === 'object' && typeof w === 'object') {
      const s = strict(f, w)
      if (!s.match)
        res.diff = s.diff
      else
        res.note = 'object identities differ'
    } else {
      // some mixed stringly bits
      // XXX tcompare needs better string diffs
      const ff = format(f)
      const fw = format(w)
      const fs = (typeof f === 'string' ? f : ff) + '\n'
      const ws = (typeof w === 'string' ? w : fw) + '\n'
      /* istanbul ignore else - impossible without bug in tcompare */
      if (fw !== ff)
        res.diff = diff.createTwoFilesPatch('expected', 'actual', ws, fs)
          .replace(/^=+\n/, '')
      else
        res.note = 'object identities differ'
    }
    if (res.diff === '--- expected\n+++ actual\n')
      delete res.diff
    if (res.diff) {
      delete res.found
      delete res.wanted
    }
  }

  for (const [key, value] of Object.entries(res)) {
    if (key === 'todo' ||
        key === 'time' ||
        /^_?tapChild/.test(key) ||
        key === 'childId' ||
        /^tapStream/.test(key) ||
        /^tapMochaTest/.test(key) ||
        key === 'cb' ||
        key === 'name' ||
        key === 'indent' ||
        key === 'skip' ||
        key === 'bail' ||
        key === 'grep' ||
        key === 'grepInvert' ||
        key === 'only' ||
        key === 'diagnostic' ||
        key === 'buffered' ||
        key === 'parent' ||
        key === 'domainEmitter' ||
        key === 'domainThrew' ||
        key === 'domain' ||
        // only show saveFixture if it's different from the env
        // if env is 1 and value false, or 0 and value=true, print it
        key === 'saveFixture' &&
          value === (process.env.TAP_SAVE_FIXTURE === '1') ||
        key === 'at' && !value ||
        key === 'stack' && !value ||
        key === 'compareOptions' && isEmpty(value))
      delete res[key]
  }

  return res
}

// return true if object is empty, including inherited properties
const isEmpty = obj => {
  if (!obj || typeof obj !== 'object')
    return true

  for (const key in obj) {
    return false
  }

  return true
}

module.exports = cleanDiag
