export namespace jsx {
  export {JSXAttribute}
  export {JSXClosingElement}
  export {JSXClosingFragment}
  export {JSXElement}
  export {JSXEmptyExpression}
  export {JSXExpressionContainer}
  export {JSXFragment}
  export {JSXIdentifier}
  export {JSXMemberExpression}
  export {JSXNamespacedName}
  export {JSXOpeningElement}
  export {JSXOpeningFragment}
  export {JSXSpreadAttribute}
  export {JSXText}
}
export type JSXAttribute = import('estree-jsx').JSXAttribute
export type JSXClosingElement = import('estree-jsx').JSXClosingElement
export type JSXClosingFragment = import('estree-jsx').JSXClosingFragment
export type JSXElement = import('estree-jsx').JSXElement
export type JSXEmptyExpression = import('estree-jsx').JSXEmptyExpression
export type JSXExpressionContainer = import('estree-jsx').JSXExpressionContainer
export type JSXFragment = import('estree-jsx').JSXFragment
export type JSXIdentifier = import('estree-jsx').JSXIdentifier
export type JSXMemberExpression = import('estree-jsx').JSXMemberExpression
export type JSXNamespacedName = import('estree-jsx').JSXNamespacedName
export type JSXOpeningElement = import('estree-jsx').JSXOpeningElement
export type JSXOpeningFragment = import('estree-jsx').JSXOpeningFragment
export type JSXSpreadAttribute = import('estree-jsx').JSXSpreadAttribute
export type JSXText = import('estree-jsx').JSXText
export type Handler = import('./types.js').Handler
/**
 * `attr`
 * `attr="something"`
 * `attr={1}`
 *
 * @type {Handler}
 * @param {JSXAttribute} node
 */
declare function JSXAttribute(
  node: JSXAttribute,
  state: import('./types.js').State
): void
/**
 * `</div>`
 *
 * @type {Handler}
 * @param {JSXClosingElement} node
 */
declare function JSXClosingElement(
  node: JSXClosingElement,
  state: import('./types.js').State
): void
/**
 * `</>`
 *
 * @type {Handler}
 * @param {JSXClosingFragment} node
 */
declare function JSXClosingFragment(
  node: JSXClosingFragment,
  state: import('./types.js').State
): void
/**
 * `<div />`
 * `<div></div>`
 *
 * @type {Handler}
 * @param {JSXElement} node
 */
declare function JSXElement(
  node: JSXElement,
  state: import('./types.js').State
): void
/**
 * `{}` (always in a `JSXExpressionContainer`, which does the curlies)
 *
 * @type {Handler}
 */
declare function JSXEmptyExpression(): void
/**
 * `{expression}`
 *
 * @type {Handler}
 * @param {JSXExpressionContainer} node
 */
declare function JSXExpressionContainer(
  node: JSXExpressionContainer,
  state: import('./types.js').State
): void
/**
 * `<></>`
 *
 * @type {Handler}
 * @param {JSXFragment} node
 */
declare function JSXFragment(
  node: JSXFragment,
  state: import('./types.js').State
): void
/**
 * `div`
 *
 * @type {Handler}
 * @param {JSXIdentifier} node
 */
declare function JSXIdentifier(
  node: JSXIdentifier,
  state: import('./types.js').State
): void
/**
 * `member.expression`
 *
 * @type {Handler}
 * @param {JSXMemberExpression} node
 */
declare function JSXMemberExpression(
  node: JSXMemberExpression,
  state: import('./types.js').State
): void
/**
 * `ns:name`
 *
 * @type {Handler}
 * @param {JSXNamespacedName} node
 */
declare function JSXNamespacedName(
  node: JSXNamespacedName,
  state: import('./types.js').State
): void
/**
 * `<div>`
 *
 * @type {Handler}
 * @param {JSXOpeningElement} node
 */
declare function JSXOpeningElement(
  node: JSXOpeningElement,
  state: import('./types.js').State
): void
/**
 * `<>`
 *
 * @type {Handler}
 * @param {JSXOpeningFragment} node
 */
declare function JSXOpeningFragment(
  node: JSXOpeningFragment,
  state: import('./types.js').State
): void
/**
 * `{...argument}`
 *
 * @type {Handler}
 * @param {JSXSpreadAttribute} node
 */
declare function JSXSpreadAttribute(
  node: JSXSpreadAttribute,
  state: import('./types.js').State
): void
/**
 * `!`
 *
 * @type {Handler}
 * @param {JSXText} node
 */
declare function JSXText(node: JSXText, state: import('./types.js').State): void
export {}
