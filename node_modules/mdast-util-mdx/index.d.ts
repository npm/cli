/**
 * @return {Array<FromMarkdownExtension>}
 */
export function mdxFromMarkdown(): Array<FromMarkdownExtension>
/**
 * @param {ToMarkdownOptions} [options]
 * @return {ToMarkdownExtension}
 */
export function mdxToMarkdown(
  options?: import('mdast-util-mdx-jsx/lib').ToMarkdownOptions | undefined
): ToMarkdownExtension
export type FromMarkdownExtension = import('mdast-util-from-markdown').Extension
export type ToMarkdownExtension = import('mdast-util-to-markdown').Options
export type MdxFlowExpression =
  import('mdast-util-mdx-expression').MdxFlowExpression
export type MdxTextExpression =
  import('mdast-util-mdx-expression').MdxTextExpression
export type MdxjsEsm = import('mdast-util-mdxjs-esm').MdxjsEsm
export type MdxJsxAttributeValueExpression =
  import('mdast-util-mdx-jsx').MdxJsxAttributeValueExpression
export type MdxJsxAttribute = import('mdast-util-mdx-jsx').MdxJsxAttribute
export type MdxJsxExpressionAttribute =
  import('mdast-util-mdx-jsx').MdxJsxExpressionAttribute
export type MdxJsxFlowElement = import('mdast-util-mdx-jsx').MdxJsxFlowElement
export type MdxJsxTextElement = import('mdast-util-mdx-jsx').MdxJsxTextElement
export type ToMarkdownOptions = import('mdast-util-mdx-jsx').ToMarkdownOptions
