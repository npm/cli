import {Literal} from 'mdast'
import {Program} from 'estree-jsx'

export interface MdxjsEsm extends Literal {
  type: 'mdxjsEsm'
  data?: {estree?: Program} & Literal['data']
}

declare module 'mdast' {
  interface BlockContentMap {
    mdxjsEsm: MdxjsEsm
  }
}

declare module 'hast' {
  interface RootContentMap {
    mdxjsEsm: MdxjsEsm
  }
  interface ElementContentMap {
    mdxjsEsm: MdxjsEsm
  }
}
