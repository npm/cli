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
export function positionFromEstree(
  value?: NodeLike | null | undefined
): Position
export type Position = import('unist').Position
export type RangeLike = [number, number]
export type PointLike = {
  line?: number | null | undefined
  column?: number | null | undefined
}
export type LocLike = {
  start?: PointLike | null | undefined
  end?: PointLike | null | undefined
}
export type NodeLike = {
  loc?: LocLike | null | undefined
  range?: RangeLike | null | undefined
  start?: number | null | undefined
  end?: number | null | undefined
}
