/**
 * @param {Options} options
 * @returs {Extension}
 */
export function mdxjsEsm(options: Options): {
  flow: {
    [x: number]: {
      tokenize: (
        effects: import('micromark-util-types').Effects,
        ok: import('micromark-util-types').State,
        nok: import('micromark-util-types').State
      ) => import('micromark-util-types').State
      concrete: boolean
    }
  }
}
export type Extension = import('micromark-util-types').Extension
export type Tokenizer = import('micromark-util-types').Tokenizer
export type State = import('micromark-util-types').State
export type Acorn = import('micromark-util-events-to-acorn').Acorn
export type AcornOptions = import('micromark-util-events-to-acorn').AcornOptions
export type Options = {
  addResult?: boolean | undefined
  acorn: Acorn
  acornOptions?: import('acorn').Options | undefined
}
