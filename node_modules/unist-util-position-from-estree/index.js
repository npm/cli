/**
 * @typedef {import('unist').Position} Position
 *
 * @typedef {[number, number]} RangeLike
 *
 * @typedef PointLike
 * @property {number|null|undefined} [line]
 * @property {number|null|undefined} [column]
 *
 * @typedef LocLike
 * @property {PointLike|null|undefined} [start]
 * @property {PointLike|null|undefined} [end]
 *
 * @typedef NodeLike
 * @property {LocLike|null|undefined} [loc]
 * @property {RangeLike|null|undefined} [range]
 * @property {number|null|undefined} [start]
 * @property {number|null|undefined} [end]
 */

/**
 * Given an estree `node`, returns a unist `position`.
 * @param {NodeLike|null} [value]
 * @returns {Position}
 */
export function positionFromEstree(value) {
  /** @type {NodeLike} */
  const node = value || {}
  /** @type {LocLike} */
  const loc = node.loc || {}
  /** @type {RangeLike} */
  const range = node.range || [0, 0]
  const startOffset = range[0] || node.start
  const endOffset = range[1] || node.end

  return {
    start: {
      // @ts-expect-error: return no point / no position next major.
      line:
        loc.start && typeof loc.start.line === 'number' && loc.start.line > -1
          ? loc.start.line
          : undefined,
      // @ts-expect-error: return no point / no position next major.
      column:
        loc.start &&
        typeof loc.start.column === 'number' &&
        loc.start.column > -1
          ? loc.start.column + 1
          : undefined,
      offset:
        typeof startOffset === 'number' && startOffset > -1
          ? startOffset
          : undefined
    },
    end: {
      // @ts-expect-error: return no point / no position next major.
      line:
        loc.end && typeof loc.end.line === 'number' && loc.end.line > -1
          ? loc.end.line
          : undefined,
      // @ts-expect-error: return no point / no position next major.
      column:
        loc.end && typeof loc.end.column === 'number' && loc.end.column > -1
          ? loc.end.column + 1
          : undefined,
      offset:
        typeof endOffset === 'number' && endOffset > -1 ? endOffset : undefined
    }
  }
}
