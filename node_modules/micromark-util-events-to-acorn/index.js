/**
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('acorn').Options} AcornOptions
 * @typedef {import('acorn').Comment} Comment
 * @typedef {import('acorn').Token} Token
 * @typedef {import('acorn').Node} AcornNode
 * @typedef {import('estree').Program} Program
 * @typedef {import('estree-util-visit').Node} EstreeNode
 *
 * @typedef {{parse: import('acorn').parse, parseExpressionAt: import('acorn').parseExpressionAt}} Acorn
 * @typedef {Error & {raisedAt: number, pos: number, loc: {line: number, column: number}}} AcornError
 *
 * @typedef Options
 * @property {Acorn} acorn
 * @property {AcornOptions} [acornOptions]
 * @property {Point} [start]
 * @property {string} [prefix='']
 * @property {string} [suffix='']
 * @property {boolean} [expression=false]
 * @property {boolean} [allowEmpty=false]
 */
import {visit} from 'estree-util-visit'
import {VFileMessage} from 'vfile-message'
import {location} from 'vfile-location'
/**
 * Parse a list of micromark events with acorn.
 *
 * @param {Array<Event>} events
 * @param {Options} options
 * @returns {{estree: Program|undefined, error: Error|undefined, swallow: boolean}}
 */
// eslint-disable-next-line complexity

export function eventsToAcorn(events, options) {
  const {prefix = '', suffix = ''} = options
  const acornOptions = Object.assign({}, options.acornOptions)
  /** @type {Array<Comment>} */

  const comments = []
  /** @type {Array<Token>} */

  const tokens = []
  const onComment = acornOptions.onComment
  const onToken = acornOptions.onToken
  const acornConfig = Object.assign({}, acornOptions, {
    onComment: comments,
    onToken: onToken ? tokens : undefined,
    preserveParens: true
  })
  /** @type {Array<string>} */

  const chunks = []
  /** @type {Record<string, Point>} */

  const lines = {}
  let index = -1
  let swallow = false
  /** @type {AcornNode|undefined} */

  let estree
  /** @type {Error|undefined} */

  let exception
  /** @type {number} */

  let startLine // We use `events` to detect everything, however, it could be empty.
  // In that case, we need `options.start` to make sense of positional info.

  if (options.start) {
    startLine = options.start.line
    lines[startLine] = options.start
  }

  while (++index < events.length) {
    const [kind, token, context] = events[index] // Assume only void events (and `enter` followed immediately by an `exit`).

    if (kind === 'exit') {
      chunks.push(context.sliceSerialize(token))
      setPoint(token.start)
      setPoint(token.end)
    }
  }

  const source = chunks.join('')
  const value = prefix + source + suffix
  const isEmptyExpression = options.expression && empty(source)
  const place = location(source)

  if (isEmptyExpression && !options.allowEmpty) {
    throw new VFileMessage(
      'Unexpected empty expression',
      parseOffsetToUnistPoint(0),
      'micromark-extension-mdx-expression:unexpected-empty-expression'
    )
  }

  try {
    estree =
      options.expression && !isEmptyExpression
        ? options.acorn.parseExpressionAt(value, 0, acornConfig)
        : options.acorn.parse(value, acornConfig)
  } catch (error_) {
    const error =
      /** @type {AcornError} */
      error_
    const point = parseOffsetToUnistPoint(error.pos)
    error.message = String(error.message).replace(/ \(\d+:\d+\)$/, '')
    error.pos = point.offset
    error.loc = {
      line: point.line,
      column: point.column - 1
    }
    exception = error
    swallow =
      error.raisedAt >= prefix.length + source.length || // Broken comments are raised at their start, not their end.
      error.message === 'Unterminated comment'
  }

  if (estree && options.expression && !isEmptyExpression) {
    if (empty(value.slice(estree.end, value.length - suffix.length))) {
      estree = {
        type: 'Program',
        start: 0,
        end: prefix.length + source.length,
        // @ts-expect-error: It’s good.
        body: [
          {
            type: 'ExpressionStatement',
            expression: estree,
            start: 0,
            end: prefix.length + source.length
          }
        ],
        sourceType: 'module',
        comments: []
      }
    } else {
      const point = parseOffsetToUnistPoint(estree.end)
      exception = new Error('Unexpected content after expression') // @ts-expect-error: acorn exception.

      exception.pos = point.offset // @ts-expect-error: acorn exception.

      exception.loc = {
        line: point.line,
        column: point.column - 1
      }
      estree = undefined
    }
  }

  if (estree) {
    // @ts-expect-error: acorn *does* allow comments
    estree.comments = comments
    visit(estree, (esnode, field, index, parents) => {
      let context =
        /** @type {AcornNode|Array<AcornNode>} */
        parents[parents.length - 1]
      /** @type {string|number|null} */

      let prop = field // Remove non-standard `ParenthesizedExpression`.

      if (esnode.type === 'ParenthesizedExpression' && context && prop) {
        /* c8 ignore next 5 */
        if (typeof index === 'number') {
          // @ts-expect-error: indexable.
          context = context[prop]
          prop = index
        } // @ts-expect-error: indexable.

        context[prop] = esnode.expression
      }

      fixPosition(esnode)
    }) // Comment positions are fixed by `visit` because they’re in the tree.

    if (Array.isArray(onComment)) {
      onComment.push(...comments)
    } else if (typeof onComment === 'function') {
      for (const comment of comments) {
        onComment(
          comment.type === 'Block',
          comment.value,
          comment.start,
          comment.end,
          comment.loc.start,
          comment.loc.end
        )
      }
    }

    for (const token of tokens) {
      fixPosition(token)

      if (Array.isArray(onToken)) {
        onToken.push(token)
      } else {
        // `tokens` are not added if `onToken` is not defined, so it must be a
        // function.
        onToken(token)
      }
    }
  } // @ts-expect-error: It’s a program now.

  return {
    estree,
    error: exception,
    swallow
  }
  /**
   * Update the position of a node.
   *
   * @param {AcornNode|EstreeNode|Token} nodeOrToken
   * @returns {void}
   */

  function fixPosition(nodeOrToken) {
    const pointStart = parseOffsetToUnistPoint(nodeOrToken.start)
    const pointEnd = parseOffsetToUnistPoint(nodeOrToken.end)
    nodeOrToken.start = pointStart.offset
    nodeOrToken.end = pointEnd.offset
    nodeOrToken.loc = {
      start: {
        line: pointStart.line,
        column: pointStart.column - 1,
        offset: pointStart.offset
      },
      end: {
        line: pointEnd.line,
        column: pointEnd.column - 1,
        offset: pointEnd.offset
      }
    }
    nodeOrToken.range = [nodeOrToken.start, nodeOrToken.end]
  }
  /**
   * Turn an arbitrary offset into the parsed value, into a point in the source
   * value.
   *
   * @param {number} acornOffset
   * @returns {Point}
   */

  function parseOffsetToUnistPoint(acornOffset) {
    let sourceOffset = acornOffset - prefix.length

    if (sourceOffset < 0) {
      sourceOffset = 0
    } else if (sourceOffset > source.length) {
      sourceOffset = source.length
    }

    const pointInSource = place.toPoint(sourceOffset)
    const line = startLine + (pointInSource.line - 1)
    const column = lines[line].column + (pointInSource.column - 1)
    const offset = lines[line].offset + (pointInSource.column - 1)
    return (
      /** @type {Point} */
      {
        line,
        column,
        offset
      }
    )
  }
  /** @param {Point} point */

  function setPoint(point) {
    // Not passed by `micromark-extension-mdxjs-esm`

    /* c8 ignore next 3 */
    if (!startLine || point.line < startLine) {
      startLine = point.line
    }

    if (!(point.line in lines) || lines[point.line].offset > point.offset) {
      lines[point.line] = point
    }
  }
}
/**
 * @param {string} value
 * @returns {boolean}
 */

function empty(value) {
  return /^\s*$/.test(
    value // Multiline comments.
      .replace(/\/\*[\s\S]*?\*\//g, '') // Line comments.
      // EOF instead of EOL is specifically not allowed, because that would
      // mean the closing brace is on the commented-out line
      .replace(/\/\/[^\r\n]*(\r\n|\n|\r)/g, '')
  )
}
