import type {Literal} from 'mdast'
import type {Program} from 'estree-jsx'

/* eslint-disable @typescript-eslint/consistent-type-definitions */
export interface MdxFlowExpression extends Literal {
  type: 'mdxFlowExpression'
  data?: {
    estree?: Program
  } & Literal['data']
}

export interface MdxTextExpression extends Literal {
  type: 'mdxTextExpression'
  data?: {
    estree?: Program
  } & Literal['data']
}

declare module 'mdast' {
  interface StaticPhrasingContentMap {
    mdxTextExpression: MdxTextExpression
  }

  interface BlockContentMap {
    mdxFlowExpression: MdxFlowExpression
  }
}

declare module 'hast' {
  interface RootContentMap {
    mdxTextExpression: MdxTextExpression
    mdxFlowExpression: MdxFlowExpression
  }

  interface ElementContentMap {
    mdxTextExpression: MdxTextExpression
    mdxFlowExpression: MdxFlowExpression
  }
}
/* eslint-enable @typescript-eslint/consistent-type-definitions */
