/**
 * Checks if the given character code can start an identifier.
 *
 * @param {number} code
 */
export function start(code: number): boolean
/**
 * Checks if the given character code can continue an identifier.
 *
 * @param {number} code
 */
export function cont(code: number): boolean
/**
 * Checks if the given string is a valid identifier name.
 *
 * @param {string} name
 */
export function name(name: string): boolean
