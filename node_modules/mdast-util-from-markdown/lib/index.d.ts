/**
 * @param value Markdown to parse (`string` or `Buffer`).
 * @param [encoding] Character encoding to understand `value` as when it’s a `Buffer` (`string`, default: `'utf8'`).
 * @param [options] Configuration
 */
export const fromMarkdown: ((
  value: Value,
  encoding: Encoding,
  options?: Options | undefined
) => Root) &
  ((value: Value, options?: Options | undefined) => Root)
export type Encoding = import('micromark-util-types').Encoding
export type Event = import('micromark-util-types').Event
export type ParseOptions = import('micromark-util-types').ParseOptions
export type Token = import('micromark-util-types').Token
export type TokenizeContext = import('micromark-util-types').TokenizeContext
export type Value = import('micromark-util-types').Value
export type UnistParent = import('unist').Parent
export type Point = import('unist').Point
export type PhrasingContent = import('mdast').PhrasingContent
export type Content = import('mdast').Content
export type Node = Root | Content
export type Parent = Extract<Node, UnistParent>
export type Break = import('mdast').Break
export type Blockquote = import('mdast').Blockquote
export type Code = import('mdast').Code
export type Definition = import('mdast').Definition
export type Emphasis = import('mdast').Emphasis
export type Heading = import('mdast').Heading
export type HTML = import('mdast').HTML
export type Image = import('mdast').Image
export type ImageReference = import('mdast').ImageReference
export type InlineCode = import('mdast').InlineCode
export type Link = import('mdast').Link
export type LinkReference = import('mdast').LinkReference
export type List = import('mdast').List
export type ListItem = import('mdast').ListItem
export type Paragraph = import('mdast').Paragraph
export type Root = import('mdast').Root
export type Strong = import('mdast').Strong
export type Text = import('mdast').Text
export type ThematicBreak = import('mdast').ThematicBreak
export type Fragment = UnistParent & {
  type: 'fragment'
  children: Array<PhrasingContent>
}
export type _CompileDataFields = {
  expectingFirstListItemValue: boolean | undefined
  flowCodeInside: boolean | undefined
  setextHeadingSlurpLineEnding: boolean | undefined
  atHardBreak: boolean | undefined
  referenceType: 'collapsed' | 'full'
  inReference: boolean | undefined
  characterReferenceType:
    | 'characterReferenceMarkerHexadecimal'
    | 'characterReferenceMarkerNumeric'
}
export type CompileData = Record<string, unknown> & Partial<_CompileDataFields>
export type Transform = (tree: Root) => Root | void
export type Handle = (this: CompileContext, token: Token) => void
/**
 * Token types mapping to handles
 */
export type Handles = Record<string, Handle>
export type NormalizedExtension = Record<
  string,
  Record<string, unknown> | Array<unknown>
> & {
  canContainEols: Array<string>
  transforms: Array<Transform>
  enter: Handles
  exit: Handles
}
/**
 * An mdast extension changes how markdown tokens are turned into mdast.
 */
export type Extension = Partial<NormalizedExtension>
export type OnEnterError = (
  this: Omit<CompileContext, 'sliceSerialize'>,
  left: Token | undefined,
  right: Token
) => void
export type OnExitError = (
  this: Omit<CompileContext, 'sliceSerialize'>,
  left: Token,
  right: Token
) => void
/**
 * mdast compiler context
 */
export type CompileContext = {
  stack: Array<Node | Fragment>
  tokenStack: Array<[Token, OnEnterError | undefined]>
  /**
   * Set data into the key-value store.
   */
  setData: (key: string, value?: unknown) => void
  /**
   * Get data from the key-value store.
   */
  getData: <K extends string>(key: K) => CompileData[K]
  /**
   * Capture some of the output data.
   */
  buffer: (this: CompileContext) => void
  /**
   * Stop capturing and access the output data.
   */
  resume: (this: CompileContext) => string
  /**
   * Enter a token.
   */
  enter: <N extends Node>(
    this: CompileContext,
    node: N,
    token: Token,
    onError?: OnEnterError | undefined
  ) => N
  /**
   * Exit a token.
   */
  exit: (
    this: CompileContext,
    token: Token,
    onError?: OnExitError | undefined
  ) => Node
  /**
   * Get the string value of a token.
   */
  sliceSerialize: TokenizeContext['sliceSerialize']
  /**
   * Configuration.
   */
  config: NormalizedExtension
}
export type FromMarkdownOptions = {
  mdastExtensions?: Array<Extension | Array<Extension>>
}
export type Options = ParseOptions & FromMarkdownOptions
