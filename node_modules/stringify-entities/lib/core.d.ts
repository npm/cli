/**
 * @typedef CoreOptions
 * @property {Array<string>} [subset=[]]
 *   Whether to only escape the given subset of characters.
 * @property {boolean} [escapeOnly=false]
 *   Whether to only escape possibly dangerous characters.
 *   Those characters are `"`, `&`, `'`, `<`, `>`, and `` ` ``.
 *
 * @typedef FormatOptions
 * @property {(code: number, next: number, options: CoreWithFormatOptions) => string} format
 *   Format strategy.
 *
 * @typedef {CoreOptions & FormatOptions & import('./util/format-smart.js').FormatSmartOptions} CoreWithFormatOptions
 */
/**
 * Encode certain characters in `value`.
 *
 * @param {string} value
 * @param {CoreWithFormatOptions} options
 * @returns {string}
 */
export function core(value: string, options: CoreWithFormatOptions): string
export type CoreOptions = {
  /**
   * Whether to only escape the given subset of characters.
   */
  subset?: string[] | undefined
  /**
   * Whether to only escape possibly dangerous characters.
   * Those characters are `"`, `&`, `'`, `<`, `>`, and `` ` ``.
   */
  escapeOnly?: boolean | undefined
}
export type FormatOptions = {
  /**
   *  Format strategy.
   */
  format: (code: number, next: number, options: CoreWithFormatOptions) => string
}
export type CoreWithFormatOptions = CoreOptions &
  FormatOptions &
  import('./util/format-smart.js').FormatSmartOptions
