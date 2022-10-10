import {Node} from 'unist'
import {Parent, Literal, BlockContent, PhrasingContent} from 'mdast'
import {Program} from 'estree-jsx'

export interface MdxJsxAttributeValueExpression extends Literal {
  type: 'mdxJsxAttributeValueExpression'
  data?: {estree?: Program} & Literal['data']
}

export interface MdxJsxAttribute extends Node {
  type: 'mdxJsxAttribute'
  name: string
  value?: MdxJsxAttributeValueExpression | string | null
}

export interface MdxJsxExpressionAttribute extends Literal {
  type: 'mdxJsxExpressionAttribute'
  data?: {estree?: Program} & Literal['data']
}

interface MdxJsxElementFields {
  name: string | null
  attributes: Array<MdxJsxAttribute | MdxJsxExpressionAttribute>
}

export interface MdxJsxFlowElement extends MdxJsxElementFields, Parent {
  type: 'mdxJsxFlowElement'
  children: BlockContent[]
}

export interface MdxJsxTextElement extends MdxJsxElementFields, Parent {
  type: 'mdxJsxTextElement'
  children: PhrasingContent[]
}

declare module 'mdast' {
  interface StaticPhrasingContentMap {
    mdxJsxTextElement: MdxJsxTextElement
  }

  interface BlockContentMap {
    mdxJsxFlowElement: MdxJsxFlowElement
  }
}

declare module 'hast' {
  interface RootContentMap {
    mdxJsxTextElement: MdxJsxTextElement
    mdxJsxFlowElement: MdxJsxFlowElement
  }

  interface ElementContentMap {
    mdxJsxTextElement: MdxJsxTextElement
    mdxJsxFlowElement: MdxJsxFlowElement
  }
}
