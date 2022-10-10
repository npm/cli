/**
 * Parse a list of micromark events with acorn.
 *
 * @param {Array<Event>} events
 * @param {Options} options
 * @returns {{estree: Program|undefined, error: Error|undefined, swallow: boolean}}
 */
export function eventsToAcorn(
  events: Array<import('micromark-util-types').Event>,
  options: Options
): {
  estree: Program | undefined
  error: Error | undefined
  swallow: boolean
}
export type Event = import('micromark-util-types').Event
export type Point = import('micromark-util-types').Point
export type AcornOptions = import('acorn').Options
export type Comment = import('acorn').Comment
export type Token = import('acorn').Token
export type AcornNode = import('acorn').Node
export type Program = import('estree').Program
export type EstreeNode = import('estree-util-visit').Node
export type Acorn = {
  parse: typeof import('acorn').parse
  parseExpressionAt: typeof import('acorn').parseExpressionAt
}
export type AcornError = Error & {
  raisedAt: number
  pos: number
  loc: {
    line: number
    column: number
  }
}
export type Options = {
  acorn: Acorn
  acornOptions?: import('acorn').Options | undefined
  start?: import('micromark-util-types').Point | undefined
  prefix?: string | undefined
  suffix?: string | undefined
  expression?: boolean | undefined
  allowEmpty?: boolean | undefined
}
