/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-factory-mdx-expression').Acorn} Acorn
 * @typedef {import('micromark-factory-mdx-expression').AcornOptions} AcornOptions
 */
import {factorySpace} from 'micromark-factory-space'
import {markdownLineEnding} from 'micromark-util-character'
import {factoryTag} from './factory-tag.js'
/**
 * @param {Acorn|undefined} acorn
 * @param {AcornOptions|undefined} acornOptions
 * @param {boolean|undefined} addResult
 * @returns {Construct}
 */

export function jsxFlow(acorn, acornOptions, addResult) {
  return {
    tokenize: tokenizeJsxFlow,
    concrete: true
  }
  /** @type {Tokenizer} */

  function tokenizeJsxFlow(effects, ok, nok) {
    const self = this
    return start
    /** @type {State} */

    function start(code) {
      return factoryTag.call(
        self,
        effects,
        factorySpace(effects, after, 'whitespace'),
        nok,
        acorn,
        acornOptions,
        addResult,
        false,
        'mdxJsxFlowTag',
        'mdxJsxFlowTagMarker',
        'mdxJsxFlowTagClosingMarker',
        'mdxJsxFlowTagSelfClosingMarker',
        'mdxJsxFlowTagName',
        'mdxJsxFlowTagNamePrimary',
        'mdxJsxFlowTagNameMemberMarker',
        'mdxJsxFlowTagNameMember',
        'mdxJsxFlowTagNamePrefixMarker',
        'mdxJsxFlowTagNameLocal',
        'mdxJsxFlowTagExpressionAttribute',
        'mdxJsxFlowTagExpressionAttributeMarker',
        'mdxJsxFlowTagExpressionAttributeValue',
        'mdxJsxFlowTagAttribute',
        'mdxJsxFlowTagAttributeName',
        'mdxJsxFlowTagAttributeNamePrimary',
        'mdxJsxFlowTagAttributeNamePrefixMarker',
        'mdxJsxFlowTagAttributeNameLocal',
        'mdxJsxFlowTagAttributeInitializerMarker',
        'mdxJsxFlowTagAttributeValueLiteral',
        'mdxJsxFlowTagAttributeValueLiteralMarker',
        'mdxJsxFlowTagAttributeValueLiteralValue',
        'mdxJsxFlowTagAttributeValueExpression',
        'mdxJsxFlowTagAttributeValueExpressionMarker',
        'mdxJsxFlowTagAttributeValueExpressionValue'
      )(code)
    }
    /** @type {State} */

    function after(code) {
      // Another tag.
      return code === 60
        ? start(code)
        : code === null || markdownLineEnding(code)
        ? ok(code)
        : nok(code)
    }
  }
}
