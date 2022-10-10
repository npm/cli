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
export const mdxExpressionFromMarkdown = {
  enter: {
    mdxFlowExpression: enterMdxFlowExpression,
    mdxTextExpression: enterMdxTextExpression
  },
  exit: {
    mdxFlowExpression: exitMdxExpression,
    mdxFlowExpressionChunk: exitMdxExpressionData,
    mdxTextExpression: exitMdxExpression,
    mdxTextExpressionChunk: exitMdxExpressionData
  }
}

/** @type {ToMarkdownExtension} */
export const mdxExpressionToMarkdown = {
  handlers: {
    mdxFlowExpression: handleMdxExpression,
    mdxTextExpression: handleMdxExpression
  },
  unsafe: [
    {character: '{', inConstruct: ['phrasing']},
    {atBreak: true, character: '{'}
  ]
}

/** @type {FromMarkdownHandle} */
function enterMdxFlowExpression(token) {
  this.enter({type: 'mdxFlowExpression', value: ''}, token)
  this.buffer()
}

/** @type {FromMarkdownHandle} */
function enterMdxTextExpression(token) {
  this.enter({type: 'mdxTextExpression', value: ''}, token)
  this.buffer()
}

/** @type {FromMarkdownHandle} */
function exitMdxExpression(token) {
  const value = this.resume()
  /** @type {Program|undefined} */
  // @ts-expect-error: estree.
  const estree = token.estree
  const node = /** @type {MDXFlowExpression|MDXTextExpression} */ (
    this.exit(token)
  )
  node.value = value

  if (estree) {
    node.data = {estree}
  }
}

/** @type {FromMarkdownHandle} */
function exitMdxExpressionData(token) {
  this.config.enter.data.call(this, token)
  this.config.exit.data.call(this, token)
}

/**
 * @type {ToMarkdownHandle}
 * @param {MDXFlowExpression|MDXTextExpression} node
 */
function handleMdxExpression(node) {
  const value = node.value || ''
  return '{' + value + '}'
}
