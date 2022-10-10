/**
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 * @typedef {import('mdast-util-mdx-expression').MdxFlowExpression} MdxFlowExpression
 * @typedef {import('mdast-util-mdx-expression').MdxTextExpression} MdxTextExpression
 * @typedef {import('mdast-util-mdxjs-esm').MdxjsEsm} MdxjsEsm
 * @typedef {import('mdast-util-mdx-jsx').MdxJsxAttributeValueExpression} MdxJsxAttributeValueExpression
 * @typedef {import('mdast-util-mdx-jsx').MdxJsxAttribute} MdxJsxAttribute
 * @typedef {import('mdast-util-mdx-jsx').MdxJsxExpressionAttribute} MdxJsxExpressionAttribute
 * @typedef {import('mdast-util-mdx-jsx').MdxJsxFlowElement} MdxJsxFlowElement
 * @typedef {import('mdast-util-mdx-jsx').MdxJsxTextElement} MdxJsxTextElement
 *
 * @typedef {import('mdast-util-mdx-jsx').ToMarkdownOptions} ToMarkdownOptions
 */

import {
  mdxExpressionFromMarkdown,
  mdxExpressionToMarkdown
} from 'mdast-util-mdx-expression'
import {mdxJsxFromMarkdown, mdxJsxToMarkdown} from 'mdast-util-mdx-jsx'
import {mdxjsEsmFromMarkdown, mdxjsEsmToMarkdown} from 'mdast-util-mdxjs-esm'

/**
 * @return {Array<FromMarkdownExtension>}
 */
export function mdxFromMarkdown() {
  return [mdxExpressionFromMarkdown, mdxJsxFromMarkdown(), mdxjsEsmFromMarkdown]
}

/**
 * @param {ToMarkdownOptions} [options]
 * @return {ToMarkdownExtension}
 */
export function mdxToMarkdown(options) {
  return {
    extensions: [
      mdxExpressionToMarkdown,
      mdxJsxToMarkdown(options),
      mdxjsEsmToMarkdown
    ]
  }
}
