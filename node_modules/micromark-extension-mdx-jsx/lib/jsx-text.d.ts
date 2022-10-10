/**
 * @param {Acorn|undefined} acorn
 * @param {AcornOptions|undefined} acornOptions
 * @param {boolean|undefined} addResult
 * @returns {Construct}
 */
export function jsxText(
  acorn: Acorn | undefined,
  acornOptions: AcornOptions | undefined,
  addResult: boolean | undefined
): Construct
export type Construct = import('micromark-util-types').Construct
export type Tokenizer = import('micromark-util-types').Tokenizer
export type Acorn = import('micromark-factory-mdx-expression').Acorn
export type AcornOptions =
  import('micromark-factory-mdx-expression').AcornOptions
