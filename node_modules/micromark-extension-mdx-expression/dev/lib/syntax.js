/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-events-to-acorn').Acorn} Acorn
 * @typedef {import('micromark-util-events-to-acorn').AcornOptions} AcornOptions
 */

/**
 * @typedef Options
 * @property {boolean} [addResult=false]
 * @property {Acorn} [acorn]
 * @property {AcornOptions} [acornOptions]
 * @property {boolean} [spread=false]
 * @property {boolean} [allowEmpty=true]
 */

import {ok as assert} from 'uvu/assert'
import {factoryMdxExpression} from 'micromark-factory-mdx-expression'
import {factorySpace} from 'micromark-factory-space'
import {markdownLineEnding} from 'micromark-util-character'
import {codes} from 'micromark-util-symbol/codes.js'
import {types} from 'micromark-util-symbol/types.js'

/**
 * @param {Options} options
 * @returns {Extension}
 */
export function mdxExpression(options = {}) {
  const addResult = options.addResult
  const acorn = options.acorn
  // Hidden: `micromark-extension-mdx-jsx` supports expressions in tags,
  // and one of them is only “spread” elements.
  // It also has expressions that are not allowed to be empty (`<x y={}/>`).
  // Instead of duplicating code there, this are two small hidden feature here
  // to test that behavior.
  const spread = options.spread
  let allowEmpty = options.allowEmpty
  /** @type {AcornOptions} */
  let acornOptions

  if (allowEmpty === null || allowEmpty === undefined) {
    allowEmpty = true
  }

  if (acorn) {
    if (!acorn.parseExpressionAt) {
      throw new Error(
        'Expected a proper `acorn` instance passed in as `options.acorn`'
      )
    }

    acornOptions = Object.assign(
      {ecmaVersion: 2020, sourceType: 'module'},
      options.acornOptions
    )
  } else if (options.acornOptions || options.addResult) {
    throw new Error('Expected an `acorn` instance passed in as `options.acorn`')
  }

  return {
    flow: {
      [codes.leftCurlyBrace]: {tokenize: tokenizeFlowExpression, concrete: true}
    },
    text: {[codes.leftCurlyBrace]: {tokenize: tokenizeTextExpression}}
  }

  /** @type {Tokenizer} */
  function tokenizeFlowExpression(effects, ok, nok) {
    const self = this

    return start

    /** @type {State} */
    function start(code) {
      assert(code === codes.leftCurlyBrace, 'expected `{`')
      return factoryMdxExpression.call(
        self,
        effects,
        factorySpace(effects, after, types.whitespace),
        'mdxFlowExpression',
        'mdxFlowExpressionMarker',
        'mdxFlowExpressionChunk',
        acorn,
        acornOptions,
        addResult,
        spread,
        allowEmpty
      )(code)
    }

    /** @type {State} */
    function after(code) {
      return code === codes.eof || markdownLineEnding(code)
        ? ok(code)
        : nok(code)
    }
  }

  /** @type {Tokenizer} */
  function tokenizeTextExpression(effects, ok) {
    const self = this

    return start

    /** @type {State} */
    function start(code) {
      assert(code === codes.leftCurlyBrace, 'expected `{`')
      return factoryMdxExpression.call(
        self,
        effects,
        ok,
        'mdxTextExpression',
        'mdxTextExpressionMarker',
        'mdxTextExpressionChunk',
        acorn,
        acornOptions,
        addResult,
        spread,
        allowEmpty,
        true
      )(code)
    }
  }
}
