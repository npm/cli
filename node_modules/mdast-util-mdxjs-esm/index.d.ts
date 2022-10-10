/**
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
 * @typedef {import('estree-jsx').Program} Program
 * @typedef {import('./complex-types.js').MdxjsEsm} MdxjsEsm
 *
 * @typedef {MdxjsEsm} MDXJSEsm - Deprecated name, prefer `MdxjsEsm`
 */
/** @type {FromMarkdownExtension} */
export const mdxjsEsmFromMarkdown: FromMarkdownExtension
/** @type {ToMarkdownExtension} */
export const mdxjsEsmToMarkdown: ToMarkdownExtension
export type FromMarkdownExtension = import('mdast-util-from-markdown').Extension
export type FromMarkdownHandle = import('mdast-util-from-markdown').Handle
export type ToMarkdownExtension = import('mdast-util-to-markdown').Options
export type ToMarkdownHandle = import('mdast-util-to-markdown').Handle
export type Program = import('estree-jsx').Program
export type MdxjsEsm = import('./complex-types.js').MdxjsEsm
/**
 * - Deprecated name, prefer `MdxjsEsm`
 */
export type MDXJSEsm = MdxjsEsm
