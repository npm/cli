/**
 * A character code.
 *
 * This is often the same as what `String#charCodeAt()` yields but micromark
 * adds meaning to certain other values.
 *
 * `null` represents the end of the input stream (called eof).
 * Negative integers are used instead of certain sequences of characters (such
 * as line endings and tabs).
 */
export type Code = number | null
/**
 * A chunk is either a character code or a slice of a buffer in the form of a
 * string.
 *
 * Chunks are used because strings are more efficient storage that character
 * codes, but limited in what they can represent.
 */
export type Chunk = Code | string
/**
 * Enumeration of the content types.
 *
 * Technically `document` is also a content type, which includes containers
 * (lists, block quotes) and flow.
 * As `ContentType` is used on tokens to define the type of subcontent but
 * `document` is the highest level of content, so it’s not listed here.
 *
 * Containers in markdown come from the margin and include more constructs
 * on the lines that define them.
 * Take for example a block quote with a paragraph inside it (such as
 * `> asd`).
 *
 * `flow` represents the sections, such as headings, code, and content, which
 * is also parsed per line
 * An example is HTML, which has a certain starting condition (such as
 * `<script>` on its own line), then continues for a while, until an end
 * condition is found (such as `</style>`).
 * If that line with an end condition is never found, that flow goes until
 * the end.
 *
 * `content` is zero or more definitions, and then zero or one paragraph.
 * It’s a weird one, and needed to make certain edge cases around definitions
 * spec compliant.
 * Definitions are unlike other things in markdown, in that they behave like
 * `text` in that they can contain arbitrary line endings, but *have* to end
 * at a line ending.
 * If they end in something else, the whole definition instead is seen as a
 * paragraph.
 *
 * The content in markdown first needs to be parsed up to this level to
 * figure out which things are defined, for the whole document, before
 * continuing on with `text`, as whether a link or image reference forms or
 * not depends on whether it’s defined.
 * This unfortunately prevents a true streaming markdown to HTML compiler.
 *
 * `text` contains phrasing content such as attention (emphasis, strong),
 * media (links, images), and actual text.
 *
 * `string` is a limited `text` like content type which only allows character
 * references and character escapes.
 * It exists in things such as identifiers (media references, definitions),
 * titles, or URLs.
 */
export type ContentType = 'document' | 'flow' | 'content' | 'text' | 'string'
/**
 * A location in the document (`line`/`column`/`offset`) and chunk (`_index`,
 * `_bufferIndex`).
 *
 * `_bufferIndex` is `-1` when `_index` points to a code chunk and it’s a
 * non-negative integer when pointing to a string chunk.
 *
 * The interface for the location in the document comes from unist `Point`:
 * <https://github.com/syntax-tree/unist#point>
 */
export type Point = {
  /**
   *   1-indexed line number
   */
  line: number
  /**
   *   1-indexed column number
   */
  column: number
  /**
   *   0-indexed position in the document
   */
  offset: number
  /**
   *   Position in a list of chunks
   */
  _index: number
  /**
   *   Position in a string chunk (or `-1` when pointing to a numeric chunk)
   */
  _bufferIndex: number
}
/**
 * A token: a span of chunks.
 * Tokens are what the core of micromark produces: the built in HTML compiler
 * or other tools can turn them into different things.
 *
 * Tokens are essentially names attached to a slice of chunks, such as
 * `lineEndingBlank` for certain line endings, or `codeFenced` for a whole
 * fenced code.
 *
 * Sometimes, more info is attached to tokens, such as `_open` and `_close`
 * by `attention` (strong, emphasis) to signal whether the sequence can open
 * or close an attention run.
 *
 * Linked tokens are used because outer constructs are parsed first.
 * Take for example:
 *
 * ```markdown
 * > *a
 * b*.
 * ```
 *
 * 1.  The block quote marker and the space after it is parsed first
 * 2.  The rest of the line is a `chunkFlow` token
 * 3.  The two spaces on the second line are a `linePrefix`
 * 4.  The rest of the line is another `chunkFlow` token
 *
 * The two `chunkFlow` tokens are linked together.
 * The chunks they span are then passed through the flow tokenizer.
 */
export type Token = {
  type: string
  start: Point
  end: Point
  /**
   * The previous token in a list of linked tokens.
   */
  previous?: Token | undefined
  /**
   * The next token in a list of linked tokens
   */
  next?: Token | undefined
  /**
   * Declares a token as having content of a certain type.
   */
  contentType?: ContentType | undefined
  /**
   * Used when dealing with linked tokens.
   * A child tokenizer is needed to tokenize them, which is stored on those
   * tokens.
   */
  _tokenizer?: TokenizeContext | undefined
  /**
   * A marker used to parse attention, depending on the characters before
   * sequences (`**`), the sequence can open, close, both, or none
   */
  _open?: boolean | undefined
  /**
   * A marker used to parse attention, depending on the characters after
   * sequences (`**`), the sequence can open, close, both, or none
   */
  _close?: boolean | undefined
  /**
   * A boolean used internally to figure out if a token is in the first content
   * of a list item construct.
   */
  _isInFirstContentOfListItem?: boolean | undefined
  /**
   * A boolean used internally to figure out if a token is a container token.
   */
  _container?: boolean | undefined
  /**
   * A boolean used internally to figure out if a list is loose or not.
   */
  _loose?: boolean | undefined
  /**
   * A boolean used internally to figure out if a link opening can’t be used
   * (because links in links are incorrect).
   */
  _inactive?: boolean | undefined
  /**
   * A boolean used internally to figure out if a link opening is balanced: it’s
   * not a link opening but has a balanced closing.
   */
  _balanced?: boolean | undefined
}
/**
 * An event is the start or end of a token amongst other events.
 * Tokens can “contain” other tokens, even though they are stored in a flat
 * list, through `enter`ing before them, and `exit`ing after them.
 */
export type Event = ['enter' | 'exit', Token, TokenizeContext]
/**
 * Open a token.
 */
export type Enter = (
  type: string,
  fields?: Record<string, unknown> | undefined
) => Token
/**
 * Close a token.
 */
export type Exit = (type: string) => Token
/**
 * Deal with the character and move to the next.
 */
export type Consume = (code: Code) => void
/**
 * Attempt deals with several values, and tries to parse according to those
 * values.
 * If a value resulted in `ok`, it worked, the tokens that were made are used,
 * and `returnState` is switched to.
 * If the result is `nok`, the attempt failed, so we revert to the original
 * state, and `bogusState` is used.
 */
export type Attempt = (
  construct: Construct | Construct[] | ConstructRecord,
  returnState: State,
  bogusState?: State | undefined
) => (code: Code) => void
/**
 * A context object to transition the state machine.
 */
export type Effects = {
  /**
   *   Start a new token.
   */
  enter: Enter
  /**
   *   End a started token.
   */
  exit: Exit
  /**
   *   Deal with the character and move to the next.
   */
  consume: Consume
  /**
   *   Try to tokenize a construct.
   */
  attempt: Attempt
  /**
   *   Interrupt is used for stuff right after a line of content.
   */
  interrupt: Attempt
  /**
   *   Attempt, then revert.
   */
  check: Attempt
}
/**
 * The main unit in the state machine: a function that gets a character code
 * and has certain effects.
 *
 * A state function should return another function: the next
 * state-as-a-function to go to.
 *
 * But there is one case where they return void: for the eof character code
 * (at the end of a value).
 * The reason being: well, there isn’t any state that makes sense, so void
 * works well.
 * Practically that has also helped: if for some reason it was a mistake, then
 * an exception is throw because there is no next function, meaning it
 * surfaces early.
 */
export type State = (code: Code) => State | void
/**
 * A resolver handles and cleans events coming from `tokenize`.
 */
export type Resolver = (events: Event[], context: TokenizeContext) => Event[]
/**
 * A tokenize function sets up a state machine to handle character codes streaming in.
 */
export type Tokenizer = (
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
) => State
/**
 * Like a tokenizer, but without `ok` or `nok`.
 */
export type Initializer = (this: TokenizeContext, effects: Effects) => State
/**
 * Like a tokenizer, but without `ok` or `nok`, and returning void.
 * This is the final hook when a container must be closed.
 */
export type Exiter = (this: TokenizeContext, effects: Effects) => void
/**
 * Guard whether `code` can come before the construct.
 * In certain cases a construct can hook into many potential start characters.
 * Instead of setting up an attempt to parse that construct for most
 * characters, this is a speedy way to reduce that.
 */
export type Previous = (this: TokenizeContext, code: Code) => boolean
/**
 * An object descibing how to parse a markdown construct.
 */
export type Construct = {
  tokenize: Tokenizer
  /**
   * Guard whether the previous character can come before the construct
   */
  previous?: Previous | undefined
  /**
   * For containers, a continuation construct.
   */
  continuation?: Construct | undefined
  /**
   * For containers, a final hook.
   */
  exit?: Exiter | undefined
  /**
   * Name of the construct, used to toggle constructs off.
   * Named constructs must not be `partial`.
   */
  name?: string | undefined
  /**
   * Whether this construct represents a partial construct.
   * Partial constructs must not have a `name`.
   */
  partial?: boolean | undefined
  /**
   * Resolve the events parsed by `tokenize`.
   *
   * For example, if we’re currently parsing a link title and this construct
   * parses character references, then `resolve` is called with the events
   * ranging from the start to the end of a character reference each time one is
   * found.
   */
  resolve?: Resolver | undefined
  /**
   * Resolve the events from the start of the content (which includes other
   * constructs) to the last one parsed by `tokenize`.
   *
   * For example, if we’re currently parsing a link title and this construct
   * parses character references, then `resolveTo` is called with the events
   * ranging from the start of the link title to the end of a character
   * reference each time one is found.
   */
  resolveTo?: Resolver | undefined
  /**
   * Resolve all events when the content is complete, from the start to the end.
   * Only used if `tokenize` is successful once in the content.
   *
   * For example, if we’re currently parsing a link title and this construct
   * parses character references, then `resolveAll` is called *if* at least one
   * character reference is found, ranging from the start to the end of the link
   * title to the end.
   */
  resolveAll?: Resolver | undefined
  /**
   * Concrete constructs cannot be interrupted by more containers.
   *
   * For example, when parsing the document (containers, such as block quotes
   * and lists) and this construct is parsing fenced code:
   *
   * ````markdown
   * > ```js
   * > - list?
   * ````
   *
   * …then `- list?` cannot form if this fenced code construct is concrete.
   *
   * An example of a construct that is not concrete is a GFM table:
   *
   * ````markdown
   * | a |
   * | - |
   * > | b |
   * ````
   *
   * …`b` is not part of the table.
   */
  concrete?: boolean | undefined
  /**
   * Whether the construct, when in a `ConstructRecord`, precedes over existing
   * constructs for the same character code when merged
   * The default is that new constructs precede over existing ones.
   */
  add?: 'before' | 'after' | undefined
}
/**
 * Like a construct, but `tokenize` does not accept `ok` or `nok`.
 */
export type InitialConstruct = Construct & {
  tokenize: Initializer
}
/**
 * Several constructs, mapped from their initial codes.
 */
export type ConstructRecord = Record<
  string,
  undefined | Construct | Construct[]
>
/**
 * A context object that helps w/ tokenizing markdown constructs.
 */
export type TokenizeContext = {
  /**
   *   The previous code.
   */
  previous: Code
  /**
   *   Current code.
   */
  code: Code
  /**
   * Whether we’re currently interrupting.
   * Take for example:
   *
   * ```markdown
   * a
   * # b
   * ```
   *
   * At 2:1, we’re “interrupting”.
   */
  interrupt?: boolean | undefined
  /**
   * The current construct.
   * Constructs that are not `partial` are set here.
   */
  currentConstruct?: Construct | undefined
  /**
   * Info set when parsing containers.
   * Containers are parsed in separate phases: their first line (`tokenize`),
   * continued lines (`continuation.tokenize`), and finally `exit`.
   * This record can be used to store some information between these hooks.
   */
  containerState?:
    | (Record<string, unknown> & {
        _closeFlow?: boolean | undefined
      })
    | undefined
  /**
   *   Current list of events.
   */
  events: Event[]
  /**
   *   The relevant parsing context.
   */
  parser: ParseContext
  /**
   *   Get the chunks that span a token (or location).
   */
  sliceStream: (token: Pick<Token, 'start' | 'end'>) => Chunk[]
  /**
   *   Get the source text that spans a token (or location).
   */
  sliceSerialize: (
    token: Pick<Token, 'start' | 'end'>,
    expandTabs?: boolean | undefined
  ) => string
  /**
   *   Get the current place.
   */
  now: () => Point
  /**
   *   Define a skip: as containers (block quotes, lists), “nibble” a prefix from
   *   the margins, where a line starts after that prefix is defined here.
   *   When the tokenizers moves after consuming a line ending corresponding to
   *   the line number in the given point, the tokenizer shifts past the prefix
   *   based on the column in the shifted point.
   */
  defineSkip: (value: Point) => void
  /**
   *   Write a slice of chunks.
   *   The eof code (`null`) can be used to signal the end of the stream.
   */
  write: (slice: Chunk[]) => Event[]
  /**
   * Internal boolean shared with `micromark-extension-gfm-task-list-item` to
   * signal whether the tokenizer is tokenizing the first content of a list item
   * construct.
   */
  _gfmTasklistFirstContentOfListItem?: boolean | undefined
  /**
   * Internal boolean shared with `micromark-extension-gfm-table` whose body
   * rows are not affected by normal interruption rules.
   * “Normal” rules are, for example, that an empty list item can’t interrupt:
   *
   * ````markdown
   * a
   * *
   * ````
   *
   * The above is one paragraph.
   * These rules don’t apply to table body rows:
   *
   * ````markdown
   * | a |
   * | - |
   * *
   * ````
   *
   * The above list interrupts the table.
   */
  _gfmTableDynamicInterruptHack?: boolean | undefined
}
/**
 * Encodings supported by the buffer class.
 * This is a copy of the typing from Node, copied to prevent Node globals from
 * being needed.
 * Copied from: <https://github.com/DefinitelyTyped/DefinitelyTyped/blob/a2bc1d8/types/node/globals.d.ts#L174>
 */
export type Encoding =
  | 'ascii'
  | 'utf8'
  | 'utf-8'
  | 'utf16le'
  | 'ucs2'
  | 'ucs-2'
  | 'base64'
  | 'latin1'
  | 'binary'
  | 'hex'
/**
 * Contents of the file.
 * Can either be text, or a `Buffer` like structure.
 * This does not directly use type `Buffer`, because it can also be used in a
 * browser context.
 * Instead this leverages `Uint8Array` which is the base type for `Buffer`,
 * and a native JavaScript construct.
 */
export type Value = string | Uint8Array
export type _ExtensionFields = {
  document: ConstructRecord
  contentInitial: ConstructRecord
  flowInitial: ConstructRecord
  flow: ConstructRecord
  string: ConstructRecord
  text: ConstructRecord
  disable: {
    null?: string[]
  }
  insideSpan: {
    null?: Pick<Construct, 'resolveAll'>[]
  }
  attentionMarkers: {
    null?: Code[]
  }
}
export type _NormalizedExtensionFields = {
  document: Record<string, Construct[]>
  contentInitial: Record<string, Construct[]>
  flowInitial: Record<string, Construct[]>
  flow: Record<string, Construct[]>
  string: Record<string, Construct[]>
  text: Record<string, Construct[]>
  disable: {
    null: string[]
  }
  insideSpan: {
    null: Pick<Construct, 'resolveAll'>[]
  }
  attentionMarkers: {
    null: Code[]
  }
}
/**
 * A syntax extension changes how markdown is tokenized.
 * See: <https://github.com/micromark/micromark#syntaxextension>
 */
export type Extension = Record<string, Record<string, unknown>> &
  Partial<_ExtensionFields>
export type FullNormalizedExtension = Record<
  string,
  Record<string, unknown[]>
> &
  _NormalizedExtensionFields
export type NormalizedExtension = Record<
  string,
  Record<string, unknown[] | undefined>
> &
  Partial<_NormalizedExtensionFields>
/**
 * Set up a tokenizer for a content type.
 */
export type Create = (
  from?: Omit<Point, '_index' | '_bufferIndex'> | undefined
) => TokenizeContext
/**
 * Parse options.
 */
export type ParseOptions = {
  /**
   * Array of syntax extensions
   */
  extensions?: Extension[] | undefined
}
/**
 * A context object that helps w/ parsing markdown.
 */
export type ParseContext = {
  constructs: FullNormalizedExtension
  content: Create
  document: Create
  flow: Create
  string: Create
  text: Create
  /**
   * List of defined identifiers.
   */
  defined: string[]
  /**
   * Map of line numbers to whether they are lazy (as opposed to the line before
   * them).
   * Take for example:
   *
   * ```markdown
   * > a
   * b
   * ```
   *
   * L1 here is not lazy, L2 is.
   */
  lazy: Record<number, boolean>
}
/**
 * HTML compiler context
 */
export type CompileContext = {
  /**
   *   Configuration passed by the user.
   */
  options: CompileOptions
  /**
   *   Set data into the key-value store.
   */
  setData: (key: string, value?: unknown) => void
  /**
   *   Get data from the key-value store.
   */
  getData: <K extends string>(key: K) => CompileData[K]
  /**
   *   Output an extra line ending if the previous value wasn’t EOF/EOL.
   */
  lineEndingIfNeeded: () => void
  /**
   *   Make a value safe for injection in HTML (except w/ `ignoreEncode`).
   */
  encode: (value: string) => string
  /**
   *   Capture some of the output data.
   */
  buffer: () => void
  /**
   *   Stop capturing and access the output data.
   */
  resume: () => string
  /**
   *   Output raw data.
   */
  raw: (value: string) => void
  /**
   *   Output (parts of) HTML tags.
   */
  tag: (value: string) => void
  /**
   *   Get the string value of a token
   */
  sliceSerialize: TokenizeContext['sliceSerialize']
}
/**
 * Serialize micromark events as HTML
 */
export type Compile = (events: Event[]) => string
/**
 * Handle one token
 */
export type Handle = (this: CompileContext, token: Token) => void
/**
 * Handle the whole
 */
export type DocumentHandle = (
  this: Omit<CompileContext, 'sliceSerialize'>
) => void
/**
 * Token types mapping to handles
 */
export type Handles = Record<string, Handle> & {
  null?: DocumentHandle
}
export type NormalizedHtmlExtension = Record<
  string,
  Record<string, unknown>
> & {
  enter: Handles
  exit: Handles
}
/**
 * An HTML extension changes how markdown tokens are serialized.
 */
export type HtmlExtension = Partial<NormalizedHtmlExtension>
export type _CompileDataFields = {
  lastWasTag: boolean
  expectFirstItem: boolean
  slurpOneLineEnding: boolean
  slurpAllLineEndings: boolean
  fencedCodeInside: boolean
  fencesCount: number
  flowCodeSeenData: boolean
  ignoreEncode: boolean
  headingRank: number
  inCodeText: boolean
  characterReferenceType: string
  tightStack: boolean[]
}
export type CompileData = Record<string, unknown> & Partial<_CompileDataFields>
/**
 * Compile options
 */
export type CompileOptions = {
  /**
   * Value to use for line endings not in `doc` (`string`, default: first line
   * ending or `'\n'`).
   *
   * Generally, micromark copies line endings (`'\r'`, `'\n'`, `'\r\n'`) in the
   * markdown document over to the compiled HTML.
   * In some cases, such as `> a`, CommonMark requires that extra line endings
   * are added: `<blockquote>\n<p>a</p>\n</blockquote>`.
   */
  defaultLineEnding?: '\r' | '\n' | '\r\n' | undefined
  /**
   * Whether to allow embedded HTML (`boolean`, default: `false`).
   */
  allowDangerousHtml?: boolean | undefined
  /**
   * Whether to allow potentially dangerous protocols in links and images
   * (`boolean`, default: `false`).
   * URLs relative to the current protocol are always allowed (such as,
   * `image.jpg`).
   * For links, the allowed protocols are `http`, `https`, `irc`, `ircs`,
   * `mailto`, and `xmpp`.
   * For images, the allowed protocols are `http` and `https`.
   */
  allowDangerousProtocol?: boolean | undefined
  /**
   * Array of HTML extensions
   */
  htmlExtensions?: Partial<NormalizedHtmlExtension>[] | undefined
}
export type Options = ParseOptions & CompileOptions
