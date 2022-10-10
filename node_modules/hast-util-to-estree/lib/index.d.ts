/**
 * @param {Node|MdxJsxAttributeValueExpression|MdxJsxAttribute|MdxJsxExpressionAttribute|MdxJsxFlowElement|MdxJsxTextElement|MdxFlowExpression|MdxTextExpression} tree
 * @param {Options} options
 * @returns {EstreeProgram}
 */
export function toEstree(
  tree:
    | Node
    | MdxJsxAttributeValueExpression
    | MdxJsxAttribute
    | MdxJsxExpressionAttribute
    | MdxJsxFlowElement
    | MdxJsxTextElement
    | MdxFlowExpression
    | MdxTextExpression,
  options?: Options
): EstreeProgram
export type Root = import('hast').Root
export type Element = import('hast').Element
export type Text = import('hast').Text
export type Comment = import('hast').Comment
export type Content = import('hast').Content
export type Node = Root | Content
export type Parent = Extract<Node, import('unist').Parent>
export type EstreeNode = import('estree').Node
export type EstreeProgram = import('estree').Program
export type EstreeComment = import('estree').Comment
export type EstreeDirective = import('estree').Directive
export type EstreeStatement = import('estree').Statement
export type EstreeModuleDeclaration = import('estree').ModuleDeclaration
export type EstreeExpression = import('estree').Expression
export type EstreeProperty = import('estree').Property
export type EstreeJsxExpressionContainer =
  import('estree-jsx').JSXExpressionContainer
export type EstreeJsxElement = import('estree-jsx').JSXElement
export type EstreeJsxOpeningElement = import('estree-jsx').JSXOpeningElement
export type EstreeJsxFragment = import('estree-jsx').JSXFragment
export type EstreeJsxAttribute = import('estree-jsx').JSXAttribute
export type EstreeJsxSpreadAttribute = import('estree-jsx').JSXSpreadAttribute
export type JSXIdentifier = import('estree-jsx').JSXIdentifier
export type JSXMemberExpression = import('estree-jsx').JSXMemberExpression
export type EstreeJsxElementName = EstreeJsxOpeningElement['name']
export type EstreeJsxAttributeName = EstreeJsxAttribute['name']
export type EstreeJsxChild = EstreeJsxElement['children'][number]
export type MdxJsxAttributeValueExpression =
  import('mdast-util-mdx-jsx').MdxJsxAttributeValueExpression
export type MdxJsxAttribute = import('mdast-util-mdx-jsx').MdxJsxAttribute
export type MdxJsxExpressionAttribute =
  import('mdast-util-mdx-jsx').MdxJsxExpressionAttribute
export type MdxJsxFlowElement = import('mdast-util-mdx-jsx').MdxJsxFlowElement
export type MdxJsxTextElement = import('mdast-util-mdx-jsx').MdxJsxTextElement
export type MdxFlowExpression =
  import('mdast-util-mdx-expression').MdxFlowExpression
export type MdxTextExpression =
  import('mdast-util-mdx-expression').MdxTextExpression
export type MdxjsEsm = import('mdast-util-mdxjs-esm').MdxjsEsm
export type Space = 'html' | 'svg'
export type Handle = (node: any, context: Context) => EstreeJsxChild | null
export type Options = {
  space?: Space | undefined
  handlers?: Record<string, Handle> | undefined
}
export type Context = {
  schema: typeof html
  comments: Array<EstreeComment>
  esm: Array<EstreeDirective | EstreeStatement | EstreeModuleDeclaration>
  handle: Handle
}
import {html} from 'property-information'
