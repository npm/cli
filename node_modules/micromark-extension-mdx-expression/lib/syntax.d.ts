/**
 * @param {Options} options
 * @returns {Extension}
 */
export function mdxExpression(options?: Options): Extension
export type Extension = import('micromark-util-types').Extension
export type Tokenizer = import('micromark-util-types').Tokenizer
export type State = import('micromark-util-types').State
export type Acorn = import('micromark-util-events-to-acorn').Acorn
export type AcornOptions = import('micromark-util-events-to-acorn').AcornOptions
export type Options = {
  addResult?: boolean | undefined
  acorn?: import('micromark-util-events-to-acorn').Acorn | undefined
  acornOptions?: import('acorn').Options | undefined
  spread?: boolean | undefined
  allowEmpty?: boolean | undefined
}
