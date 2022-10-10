/**
 * Visit children of tree which pass a test.
 *
 * @param {Node} tree
 *   Abstract syntax tree to walk.
 * @param {Visitor|Visitors} [visitor]
 *   Function to run for each node.
 */
export function visit(
  tree: Node,
  visitor?: Visitor | Visitors | undefined
): void
/**
 * Continue traversing as normal
 */
export const CONTINUE: unique symbol
/**
 * Do not traverse this node’s children
 */
export const SKIP: unique symbol
/**
 * Stop traversing immediately
 */
export const EXIT: unique symbol
export type EstreeNode = import('estree-jsx').Node
export type UnistNode = import('unist').Node
export type Node = EstreeNode | UnistNode
/**
 * Union of the action types.
 */
export type Action = typeof CONTINUE | typeof SKIP | typeof EXIT
/**
 * Move to the sibling at index next (after node itself is completely
 * traversed).
 * Useful if mutating the tree, such as removing the node the visitor is
 * currently on, or any of its previous siblings.
 * Results less than 0 or greater than or equal to `children.length` stop
 * traversing the parent.
 */
export type Index = number
/**
 * List with one or two values, the first an action, the second an index.
 */
export type ActionTuple = [
  (Action | null | undefined | void)?,
  (Index | null | undefined)?
]
export type Visitor = (
  node: Node,
  key: string | null,
  index: number | null,
  ancestors: Array<Node>
) => null | undefined | Action | Index | ActionTuple | void
export type Visitors = {
  enter?: Visitor | undefined
  leave?: Visitor | undefined
}
