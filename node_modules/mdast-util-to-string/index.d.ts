/**
 * @typedef Options
 * @property {boolean} [includeImageAlt=true]
 */
/**
 * Get the text content of a node.
 * Prefer the node’s plain-text fields, otherwise serialize its children,
 * and if the given value is an array, serialize the nodes in it.
 *
 * @param {unknown} node
 * @param {Options} [options]
 * @returns {string}
 */
export function toString(node: unknown, options?: Options): string
export type Options = {
  includeImageAlt?: boolean
}
