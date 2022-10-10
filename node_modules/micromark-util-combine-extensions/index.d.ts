/**
 * Combine several syntax extensions into one.
 *
 * @param {Extension[]} extensions List of syntax extensions.
 * @returns {NormalizedExtension} A single combined extension.
 */
export function combineExtensions(extensions: Extension[]): NormalizedExtension
/**
 * Combine several HTML extensions into one.
 *
 * @param {HtmlExtension[]} htmlExtensions List of HTML extensions.
 * @returns {HtmlExtension} A single combined extension.
 */
export function combineHtmlExtensions(
  htmlExtensions: HtmlExtension[]
): HtmlExtension
export type NormalizedExtension =
  import('micromark-util-types').NormalizedExtension
export type Extension = import('micromark-util-types').Extension
export type Construct = import('micromark-util-types').Construct
export type HtmlExtension = import('micromark-util-types').HtmlExtension
