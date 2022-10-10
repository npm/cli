/**
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Resolver} Resolver
 */
/**
 * Call all `resolveAll`s.
 *
 * @param {{resolveAll?: Resolver}[]} constructs
 * @param {Event[]} events
 * @param {TokenizeContext} context
 * @returns {Event[]}
 */
export function resolveAll(
  constructs: {
    resolveAll?: Resolver
  }[],
  events: import('micromark-util-types').Event[],
  context: TokenizeContext
): import('micromark-util-types').Event[]
export type TokenizeContext = import('micromark-util-types').TokenizeContext
export type Event = import('micromark-util-types').Event
export type Resolver = import('micromark-util-types').Resolver
