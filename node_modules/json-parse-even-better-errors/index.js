'use strict'

const parseError = (e, txt, context) => {
  if (!txt) {
    return {
      message: e.message + ' while parsing empty string',
      position: 0,
    }
  }
  const badToken = e.message.match(/^Unexpected token.*position\s+(\d+)/i)
  const errIdx = badToken ? +badToken[1]
    : e.message.match(/^Unexpected end of JSON.*/i) ? txt.length - 1
    : null

  if (errIdx !== null && errIdx !== undefined) {
    const start = errIdx <= context ? 0
      : errIdx - context

    const end = errIdx + context >= txt.length ? txt.length
      : errIdx + context

    const slice = (start === 0 ? '' : '...') +
      txt.slice(start, end) +
      (end === txt.length ? '' : '...')

    const near = txt === slice ? '' : 'near '

    return {
      message: e.message + ` while parsing ${near}'${slice}'`,
      position: errIdx,
    }
  } else {
    return {
      message: e.message + ` while parsing '${txt.slice(0, context * 2)}'`,
      position: 0,
    }
  }
}

class JSONParseError extends SyntaxError {
  constructor (er, txt, context, caller) {
    context = context || 20
    const metadata = parseError(er, txt, context)
    super(metadata.message)
    Object.assign(this, metadata)
    this.code = 'EJSONPARSE'
    this.systemError = er
    Error.captureStackTrace(this, caller || this.constructor)
  }
  get name () { return this.constructor.name }
  set name (n) {}
  get [Symbol.toStringTag] () { return this.constructor.name }
}

const parseJson = (txt, reviver, context) => {
  context = context || 20
  try {
    return JSON.parse(txt, reviver)
  } catch (e) {
    if (typeof txt !== 'string') {
      const isEmptyArray = Array.isArray(txt) && txt.length === 0
      throw Object.assign(new TypeError(
        `Cannot parse ${isEmptyArray ? 'an empty array' : String(txt)}`
      ), {
        code: 'EJSONPARSE',
        systemError: e,
      })
    }

    throw new JSONParseError(e, txt, context, parseJson)
  }
}

module.exports = parseJson
parseJson.JSONParseError = JSONParseError
