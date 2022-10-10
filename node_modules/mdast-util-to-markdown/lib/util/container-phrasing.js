/**
 * @typedef {import('../types.js').Node} Node
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').SafeOptions} SafeOptions
 * @typedef {import('../types.js').Context} Context
 */

import {track} from './track.js'

/**
 * @param {Parent} parent
 * @param {Context} context
 * @param {SafeOptions} safeOptions
 * @returns {string}
 */
export function containerPhrasing(parent, context, safeOptions) {
  const indexStack = context.indexStack
  const children = parent.children || []
  /** @type {Array<string>} */
  const results = []
  let index = -1
  let before = safeOptions.before

  indexStack.push(-1)
  let tracker = track(safeOptions)

  while (++index < children.length) {
    const child = children[index]
    /** @type {string} */
    let after

    indexStack[indexStack.length - 1] = index

    if (index + 1 < children.length) {
      // @ts-expect-error: hush, it’s actually a `zwitch`.
      let handle = context.handle.handlers[children[index + 1].type]
      if (handle && handle.peek) handle = handle.peek
      after = handle
        ? handle(children[index + 1], parent, context, {
            before: '',
            after: '',
            ...tracker.current()
          }).charAt(0)
        : ''
    } else {
      after = safeOptions.after
    }

    // In some cases, html (text) can be found in phrasing right after an eol.
    // When we’d serialize that, in most cases that would be seen as html
    // (flow).
    // As we can’t escape or so to prevent it from happening, we take a somewhat
    // reasonable approach: replace that eol with a space.
    // See: <https://github.com/syntax-tree/mdast-util-to-markdown/issues/15>
    if (
      results.length > 0 &&
      (before === '\r' || before === '\n') &&
      child.type === 'html'
    ) {
      results[results.length - 1] = results[results.length - 1].replace(
        /(\r?\n|\r)$/,
        ' '
      )
      before = ' '

      // To do: does this work to reset tracker?
      tracker = track(safeOptions)
      tracker.move(results.join(''))
    }

    results.push(
      tracker.move(
        context.handle(child, parent, context, {
          ...tracker.current(),
          before,
          after
        })
      )
    )

    before = results[results.length - 1].slice(-1)
  }

  indexStack.pop()

  return results.join('')
}
