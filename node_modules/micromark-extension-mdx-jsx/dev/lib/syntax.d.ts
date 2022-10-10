/**
 * @param {Options} [options]
 * @returns {Extension}
 */
export function mdxJsx(options?: Options | undefined): Extension
export type Extension = import('micromark-util-types').Extension
export type Acorn = import('micromark-factory-mdx-expression').Acorn
export type AcornOptions =
  import('micromark-factory-mdx-expression').AcornOptions
export type Options = {
  addResult?: boolean | undefined
  acorn?: import('micromark-util-events-to-acorn').Acorn | undefined
  acornOptions?: import('acorn').Options | undefined
}
