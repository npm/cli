/** @return {FromMarkdownExtension} */
export function mdxJsxFromMarkdown(): FromMarkdownExtension
/**
 * @param {ToMarkdownOptions} [options={}]
 *   Configuration (optional).
 * @returns {ToMarkdownExtension}
 */
export function mdxJsxToMarkdown(
  options?: ToMarkdownOptions | undefined
): ToMarkdownExtension
export type Literal = import('mdast').Literal
export type Parent = import('mdast').Parent
export type FromMarkdownExtension = import('mdast-util-from-markdown').Extension
export type FromMarkdownHandle = import('mdast-util-from-markdown').Handle
export type Token = import('mdast-util-from-markdown').Token
export type ToMarkdownExtension = import('mdast-util-to-markdown').Options
export type ToMarkdownHandle = import('mdast-util-to-markdown').Handle
export type ToMarkdownMap = import('mdast-util-to-markdown').Map
export type OnEnterError = import('mdast-util-from-markdown').OnEnterError
export type OnExitError = import('mdast-util-from-markdown').OnExitError
export type Program = import('estree-jsx').Program
export type MdxJsxAttributeValueExpression =
  import('./complex-types.js').MdxJsxAttributeValueExpression
export type MdxJsxAttribute = import('./complex-types.js').MdxJsxAttribute
export type MdxJsxExpressionAttribute =
  import('./complex-types.js').MdxJsxExpressionAttribute
export type MdxJsxFlowElement = import('./complex-types.js').MdxJsxFlowElement
export type MdxJsxTextElement = import('./complex-types.js').MdxJsxTextElement
export type Tag = {
  name: string | null
  attributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[]
  close?: boolean
  selfClosing?: boolean
  start: Token['start']
  end: Token['start']
}
export type ToMarkdownOptions = {
  /**
   * Preferred quote to use around attribute values.
   */
  quote?: '"' | "'" | undefined
  /**
   * Use the other quote if that results in less bytes.
   */
  quoteSmart?: boolean | undefined
  /**
   * Do not use an extra space when closing self-closing elements: `<img/>`
   * instead of `<img />`.
   */
  tightSelfClosing?: boolean | undefined
  /**
   * Specify the line length that the printer will wrap on.
   * This is not a hard maximum width: things will be printed longer and
   * shorter.
   *
   * Note: this option is only used for JSX tags currently, and might be moved
   * to `mdast-util-to-markdown` in the future.
   */
  printWidth?: number | undefined
}
