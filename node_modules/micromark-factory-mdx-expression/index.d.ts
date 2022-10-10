/**
 * @this {TokenizeContext}
 * @param {Effects} effects
 * @param {State} ok
 * @param {string} type
 * @param {string} markerType
 * @param {string} chunkType
 * @param {Acorn} [acorn]
 * @param {AcornOptions} [acornOptions]
 * @param {boolean} [addResult=false]
 * @param {boolean} [spread=false]
 * @param {boolean} [allowEmpty=false]
 * @param {boolean} [allowLazy=false]
 * @param {number} [startColumn=0]
 * @returns {State}
 */
export function factoryMdxExpression(
  effects: Effects,
  ok: State,
  type: string,
  markerType: string,
  chunkType: string,
  acorn?: import('micromark-util-events-to-acorn').Acorn | undefined,
  acornOptions?: import('acorn').Options | undefined,
  addResult?: boolean | undefined,
  spread?: boolean | undefined,
  allowEmpty?: boolean | undefined,
  allowLazy?: boolean | undefined,
  startColumn?: number | undefined
): State
export type Point = import('micromark-util-types').Point
export type TokenizeContext = import('micromark-util-types').TokenizeContext
export type Effects = import('micromark-util-types').Effects
export type State = import('micromark-util-types').State
export type Acorn = import('micromark-util-events-to-acorn').Acorn
export type AcornOptions = import('micromark-util-events-to-acorn').AcornOptions
