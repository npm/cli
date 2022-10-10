/**
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
 * @typedef {import('estree-jsx').Program} Program
 * @typedef {import('./complex-types.js').MdxFlowExpression} MdxFlowExpression
 * @typedef {import('./complex-types.js').MdxTextExpression} MdxTextExpression
 */
/**
 * @typedef {MdxFlowExpression} MDXFlowExpression
 * @typedef {MdxTextExpression} MDXTextExpression
 */
/** @type {FromMarkdownExtension} */
export const mdxExpressionFromMarkdown: FromMarkdownExtension
/** @type {ToMarkdownExtension} */
export const mdxExpressionToMarkdown: ToMarkdownExtension
export type FromMarkdownExtension = import('mdast-util-from-markdown').Extension
export type FromMarkdownHandle = import('mdast-util-from-markdown').Handle
export type ToMarkdownExtension = import('mdast-util-to-markdown').Options
export type ToMarkdownHandle = import('mdast-util-to-markdown').Handle
export type Program = import('estree-jsx').Program
export type MdxFlowExpression = import('./complex-types.js').MdxFlowExpression
export type MdxTextExpression = import('./complex-types.js').MdxTextExpression
export type MDXFlowExpression = MdxFlowExpression
export type MDXTextExpression = MdxTextExpression
