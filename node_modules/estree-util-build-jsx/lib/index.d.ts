/**
 * @template {Node} T
 * @param {T} tree
 * @param {Options} [options={}]
 * @returns {T}
 */
export function buildJsx<T extends import('estree').Node>(
  tree: T,
  options?: Options | undefined
): T
export type Node = import('estree-jsx').Node
export type Comment = import('estree-jsx').Comment
export type Expression = import('estree-jsx').Expression
export type Pattern = import('estree-jsx').Pattern
export type ObjectExpression = import('estree-jsx').ObjectExpression
export type Property = import('estree-jsx').Property
export type ImportSpecifier = import('estree-jsx').ImportSpecifier
export type SpreadElement = import('estree-jsx').SpreadElement
export type MemberExpression = import('estree-jsx').MemberExpression
export type Literal = import('estree-jsx').Literal
export type Identifier = import('estree-jsx').Identifier
export type JSXElement = import('estree-jsx').JSXElement
export type JSXFragment = import('estree-jsx').JSXFragment
export type JSXText = import('estree-jsx').JSXText
export type JSXExpressionContainer = import('estree-jsx').JSXExpressionContainer
export type JSXEmptyExpression = import('estree-jsx').JSXEmptyExpression
export type JSXSpreadChild = import('estree-jsx').JSXSpreadChild
export type JSXAttribute = import('estree-jsx').JSXAttribute
export type JSXSpreadAttribute = import('estree-jsx').JSXSpreadAttribute
export type JSXMemberExpression = import('estree-jsx').JSXMemberExpression
export type JSXNamespacedName = import('estree-jsx').JSXNamespacedName
export type JSXIdentifier = import('estree-jsx').JSXIdentifier
export type SyncHandler = import('estree-walker').SyncHandler
export type Options = {
  runtime?: 'automatic' | 'classic' | undefined
  importSource?: string | undefined
  pragma?: string | undefined
  pragmaFrag?: string | undefined
  development?: boolean | undefined
  filePath?: string | undefined
}
export type Annotations = {
  jsxRuntime?: 'automatic' | 'classic' | undefined
  jsx?: string | undefined
  jsxFrag?: string | undefined
  jsxImportSource?: string | undefined
}
