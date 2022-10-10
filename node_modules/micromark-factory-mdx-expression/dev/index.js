/**
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-events-to-acorn').Acorn} Acorn
 * @typedef {import('micromark-util-events-to-acorn').AcornOptions} AcornOptions
 */

import {ok as assert} from 'uvu/assert'
import {markdownLineEnding} from 'micromark-util-character'
import {codes} from 'micromark-util-symbol/codes.js'
import {types} from 'micromark-util-symbol/types.js'
import {constants} from 'micromark-util-symbol/constants.js'
import {factorySpace} from 'micromark-factory-space'
import {positionFromEstree} from 'unist-util-position-from-estree'
import {VFileMessage} from 'vfile-message'
import {eventsToAcorn} from 'micromark-util-events-to-acorn'

/**
 * @this {TokenizeContext}
 * @param {Effects} effects
 * @param {State} ok
 * @param {string} type
 * @param {string} markerType
 * @param {string} chunkType
 * @param {Acorn} [acorn]
 * @param {AcornOptions} [acornOptions]
 * @param {boolean} [addResult=false]
 * @param {boolean} [spread=false]
 * @param {boolean} [allowEmpty=false]
 * @param {boolean} [allowLazy=false]
 * @param {number} [startColumn=0]
 * @returns {State}
 */
// eslint-disable-next-line max-params
export function factoryMdxExpression(
  effects,
  ok,
  type,
  markerType,
  chunkType,
  acorn,
  acornOptions,
  addResult,
  spread,
  allowEmpty,
  allowLazy,
  startColumn
) {
  const self = this
  const eventStart = this.events.length + 3 // Add main and marker token
  const tail = this.events[this.events.length - 1]
  const initialPrefix =
    tail && tail[1].type === types.linePrefix
      ? tail[2].sliceSerialize(tail[1], true).length
      : 0
  const prefixExpressionIndent = initialPrefix ? initialPrefix + 1 : 0
  let balance = 1
  /** @type {Point} */
  let startPosition
  /** @type {Error} */
  let lastCrash

  return start

  /** @type {State} */
  function start(code) {
    assert(code === codes.leftCurlyBrace, 'expected `{`')
    effects.enter(type)
    effects.enter(markerType)
    effects.consume(code)
    effects.exit(markerType)
    startPosition = self.now()
    return atBreak
  }

  /** @type {State} */
  function atBreak(code) {
    if (code === codes.eof) {
      throw (
        lastCrash ||
        new VFileMessage(
          'Unexpected end of file in expression, expected a corresponding closing brace for `{`',
          self.now(),
          'micromark-extension-mdx-expression:unexpected-eof'
        )
      )
    }

    if (code === codes.rightCurlyBrace) {
      return atClosingBrace(code)
    }

    if (markdownLineEnding(code)) {
      effects.enter(types.lineEnding)
      effects.consume(code)
      effects.exit(types.lineEnding)
      // `startColumn` is used by the JSX extensions that also wraps this
      // factory.
      // JSX can be indented arbitrarily, but expressions can’t exdent
      // arbitrarily, due to that they might contain template strings
      // (backticked strings).
      // We’ll eat up to where that tag starts (`startColumn`), and a tab size.
      /* c8 ignore next 3 */
      const prefixTagIndent = startColumn
        ? startColumn + constants.tabSize - self.now().column
        : 0
      const indent = Math.max(prefixExpressionIndent, prefixTagIndent)
      return indent
        ? factorySpace(effects, atBreak, types.linePrefix, indent)
        : atBreak
    }

    const now = self.now()

    if (
      now.line !== startPosition.line &&
      !allowLazy &&
      self.parser.lazy[now.line]
    ) {
      throw new VFileMessage(
        'Unexpected end of file in expression, expected a corresponding closing brace for `{`',
        self.now(),
        'micromark-extension-mdx-expression:unexpected-eof'
      )
    }

    effects.enter(chunkType)
    return inside(code)
  }

  /** @type {State} */
  function inside(code) {
    if (
      code === codes.eof ||
      code === codes.rightCurlyBrace ||
      markdownLineEnding(code)
    ) {
      effects.exit(chunkType)
      return atBreak(code)
    }

    if (code === codes.leftCurlyBrace && !acorn) {
      effects.consume(code)
      balance++
      return inside
    }

    effects.consume(code)
    return inside
  }

  /** @type {State} */
  function atClosingBrace(code) {
    balance--

    // Agnostic mode: count balanced braces.
    if (!acorn) {
      if (balance) {
        effects.enter(chunkType)
        effects.consume(code)
        return inside
      }

      effects.enter(markerType)
      effects.consume(code)
      effects.exit(markerType)
      effects.exit(type)
      return ok
    }

    // Gnostic mode: parse w/ acorn.
    const result = eventsToAcorn(self.events.slice(eventStart), {
      acorn,
      acornOptions,
      start: startPosition,
      expression: true,
      allowEmpty,
      prefix: spread ? '({' : '',
      suffix: spread ? '})' : ''
    })
    const estree = result.estree

    // Get the spread value.
    if (spread && estree) {
      // Should always be the case as we wrap in `d={}`
      assert(estree.type === 'Program', 'expected program')
      const head = estree.body[0]
      assert(head, 'expected body')

      // Can occur in some complex attributes.
      /* c8 ignore next 11 */
      if (
        head.type !== 'ExpressionStatement' ||
        head.expression.type !== 'ObjectExpression'
      ) {
        throw new VFileMessage(
          'Unexpected `' +
            head.type +
            '` in code: expected an object spread (`{...spread}`)',
          positionFromEstree(head).start,
          'micromark-extension-mdx-expression:non-spread'
        )
      } else if (head.expression.properties[1]) {
        throw new VFileMessage(
          'Unexpected extra content in spread: only a single spread is supported',
          positionFromEstree(head.expression.properties[1]).start,
          'micromark-extension-mdx-expression:spread-extra'
        )
      } else if (
        head.expression.properties[0] &&
        head.expression.properties[0].type !== 'SpreadElement'
      ) {
        throw new VFileMessage(
          'Unexpected `' +
            head.expression.properties[0].type +
            '` in code: only spread elements are supported',
          positionFromEstree(head.expression.properties[0]).start,
          'micromark-extension-mdx-expression:non-spread'
        )
      }
    }

    if (result.error) {
      lastCrash = new VFileMessage(
        'Could not parse expression with acorn: ' + result.error.message,
        {
          // @ts-expect-error: fine.
          line: result.error.loc.line,
          // @ts-expect-error: fine.
          column: result.error.loc.column + 1,
          // @ts-expect-error: fine.
          offset: result.error.pos
        },
        'micromark-extension-mdx-expression:acorn'
      )

      if (code !== codes.eof && result.swallow) {
        effects.enter(chunkType)
        effects.consume(code)
        return inside
      }

      throw lastCrash
    }

    effects.enter(markerType)
    effects.consume(code)
    effects.exit(markerType)
    Object.assign(effects.exit(type), addResult ? {estree} : undefined)
    return ok
  }
}
