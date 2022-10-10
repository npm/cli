/**
 * @typedef {import('estree').BaseNode} EstreeNode
 * @typedef {import('estree').Comment} EstreeComment
 *
 * @typedef State
 * @property {Array<EstreeComment>} comments
 * @property {number} index
 *
 * @typedef Fields
 * @property {boolean} leading
 * @property {boolean} trailing
 */

const own = {}.hasOwnProperty

/**
 * Attach semistandard estree comment nodes to the tree.
 *
 * @param {EstreeNode} tree
 * @param {Array<EstreeComment>} [comments]
 */
export function attachComments(tree, comments) {
  const list = (comments || []).concat().sort(compare)
  if (list.length > 0) walk(tree, {comments: list, index: 0})
  return tree
}

/**
 * Attach semistandard estree comment nodes to the tree.
 *
 * @param {EstreeNode} node
 * @param {State} state
 */
function walk(node, state) {
  // Done, we can quit.
  if (state.index === state.comments.length) {
    return
  }

  /** @type {Array<EstreeNode>} */
  const children = []
  /** @type {Array<EstreeComment>} */
  const comments = []
  /** @type {string} */
  let key

  // Find all children of `node`
  for (key in node) {
    if (own.call(node, key)) {
      /** @type {EstreeNode|Array<EstreeNode>} */
      // @ts-expect-error: indexable.
      const value = node[key]

      // Ignore comments.
      if (value && typeof value === 'object' && key !== 'comments') {
        if (Array.isArray(value)) {
          let index = -1

          while (++index < value.length) {
            if (value[index] && typeof value[index].type === 'string') {
              children.push(value[index])
            }
          }
        } else if (typeof value.type === 'string') {
          children.push(value)
        }
      }
    }
  }

  // Sort the children.
  children.sort(compare)

  // Initial comments.
  comments.push(...slice(state, node, false, {leading: true, trailing: false}))

  let index = -1

  while (++index < children.length) {
    walk(children[index], state)
  }

  // Dangling or trailing comments.
  comments.push(
    ...slice(state, node, true, {
      leading: false,
      trailing: children.length > 0
    })
  )

  if (comments.length > 0) {
    // @ts-expect-error, yes, because they’re nonstandard.
    node.comments = comments
  }
}

/**
 * @param {State} state
 * @param {EstreeNode} node
 * @param {boolean} compareEnd
 * @param {Fields} fields
 */
function slice(state, node, compareEnd, fields) {
  /** @type {Array<EstreeComment>} */
  const result = []

  while (
    state.comments[state.index] &&
    compare(state.comments[state.index], node, compareEnd) < 1
  ) {
    result.push(Object.assign({}, state.comments[state.index++], fields))
  }

  return result
}

/**
 * @param {EstreeNode|EstreeComment} left
 * @param {EstreeNode|EstreeComment} right
 * @param {boolean} [compareEnd]
 * @returns {number}
 */
function compare(left, right, compareEnd) {
  const field = compareEnd ? 'end' : 'start'

  // Offsets.
  if (left.range && right.range) {
    return left.range[0] - right.range[compareEnd ? 1 : 0]
  }

  // Points.
  if (left.loc && left.loc.start && right.loc && right.loc[field]) {
    return (
      left.loc.start.line - right.loc[field].line ||
      left.loc.start.column - right.loc[field].column
    )
  }

  // Just `start` (and `end`) on nodes.
  // Default in most parsers.
  if ('start' in left && field in right) {
    // @ts-expect-error Added by Acorn
    return left.start - right[field]
  }

  return Number.NaN
}
