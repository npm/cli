/**
 * Attach semistandard estree comment nodes to the tree.
 *
 * @param {EstreeNode} tree
 * @param {Array<EstreeComment>} [comments]
 */
export function attachComments(
  tree: EstreeNode,
  comments?: import('estree').Comment[] | undefined
): import('estree').BaseNode
export type EstreeNode = import('estree').BaseNode
export type EstreeComment = import('estree').Comment
export type State = {
  comments: Array<EstreeComment>
  index: number
}
export type Fields = {
  leading: boolean
  trailing: boolean
}
