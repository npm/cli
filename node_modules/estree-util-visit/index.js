/**
 * @typedef {import('estree-jsx').Node} EstreeNode
 * @typedef {import('unist').Node} UnistNode
 * @typedef {EstreeNode|UnistNode} Node
 *
 * @typedef {CONTINUE|SKIP|EXIT} Action
 *   Union of the action types.
 * @typedef {number} Index
 *   Move to the sibling at index next (after node itself is completely
 *   traversed).
 *   Useful if mutating the tree, such as removing the node the visitor is
 *   currently on, or any of its previous siblings.
 *   Results less than 0 or greater than or equal to `children.length` stop
 *   traversing the parent.
 * @typedef {[(Action|null|undefined|void)?, (Index|null|undefined)?]} ActionTuple
 *   List with one or two values, the first an action, the second an index.
 */

/**
 * @callback Visitor
 * @param {Node} node
 *   Found node.
 * @param {string?} key
 *   Field at which `node` lives.
 * @param {number?} index
 *   Position at which `node` lives.
 * @param {Array<Node>} ancestors
 *   Ancestors of node.
 * @returns {null|undefined|Action|Index|ActionTuple|void}
 */

/**
 * @typedef Visitors
 * @property {Visitor} [enter]
 * @property {Visitor} [leave]
 */

import {color} from './color.js'

const own = {}.hasOwnProperty

/**
 * Continue traversing as normal
 */
export const CONTINUE = Symbol('continue')
/**
 * Do not traverse this node’s children
 */
export const SKIP = Symbol('skip')
/**
 * Stop traversing immediately
 */
export const EXIT = Symbol('exit')

/**
 * Visit children of tree which pass a test.
 *
 * @param {Node} tree
 *   Abstract syntax tree to walk.
 * @param {Visitor|Visitors} [visitor]
 *   Function to run for each node.
 */
export function visit(tree, visitor) {
  /** @type {Visitor|undefined} */
  let enter
  /** @type {Visitor|undefined} */
  let leave

  if (typeof visitor === 'function') {
    enter = visitor
  } else if (visitor && typeof visitor === 'object') {
    enter = visitor.enter
    leave = visitor.leave
  }

  build(tree, null, null, [])()

  /**
   * @param {Node} node
   * @param {string?} key
   * @param {number?} index
   * @param {Array<Node>} parents
   */
  function build(node, key, index, parents) {
    if (nodelike(node)) {
      visit.displayName = 'node (' + color(node.type) + ')'
    }

    return visit

    /**
     * @returns {ActionTuple}
     */
    function visit() {
      /** @type {ActionTuple} */
      const result = enter ? toResult(enter(node, key, index, parents)) : []

      if (result[0] === EXIT) {
        return result
      }

      if (result[0] !== SKIP) {
        /** @type {string} */
        let cKey

        for (cKey in node) {
          if (
            own.call(node, cKey) &&
            // @ts-expect-error: indexable.
            node[cKey] &&
            // @ts-expect-error: indexable.
            typeof node[cKey] === 'object' &&
            cKey !== 'data' &&
            cKey !== 'position'
          ) {
            /** @type {unknown} */
            // @ts-expect-error: indexable.
            const value = node[cKey]
            const grandparents = parents.concat(node)

            if (Array.isArray(value)) {
              let cIndex = 0

              // `any`s
              // type-coverage:ignore-next-line Looks like `Array<unknown>`.
              while (cIndex > -1 && cIndex < value.length) {
                /** @type {unknown} */
                // `any`s
                // type-coverage:ignore-next-line Looks like `Array<unknown>`.
                const subvalue = value[cIndex]

                if (nodelike(subvalue)) {
                  const subresult = build(
                    subvalue,
                    cKey,
                    cIndex,
                    grandparents
                  )()
                  if (subresult[0] === EXIT) return subresult
                  cIndex =
                    typeof subresult[1] === 'number' ? subresult[1] : cIndex + 1
                } else {
                  cIndex++
                }
              }
            } else if (nodelike(value)) {
              const subresult = build(value, cKey, null, grandparents)()
              if (subresult[0] === EXIT) return subresult
            }
          }
        }
      }

      return leave ? toResult(leave(node, key, index, parents)) : result
    }
  }
}

/**
 * @param {null|undefined|void|Action|Index|ActionTuple} value
 * @returns {ActionTuple}
 */
function toResult(value) {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE, value]
  }

  return [value]
}

/**
 * @param {unknown} value
 * @returns {value is Node}
 */
function nodelike(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      // @ts-expect-error Looks like a node.
      typeof value.type === 'string' &&
      // @ts-expect-error Looks like a node.
      value.type.length > 0
  )
}
