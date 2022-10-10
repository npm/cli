/**
 * @typedef {import('mdast').Literal} Literal
 * @typedef {import('mdast').Parent} Parent
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
 * @typedef {import('mdast-util-from-markdown').Token} Token
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
 * @typedef {import('mdast-util-to-markdown').Map} ToMarkdownMap
 * @typedef {import('mdast-util-from-markdown').OnEnterError} OnEnterError
 * @typedef {import('mdast-util-from-markdown').OnExitError} OnExitError
 * @typedef {import('estree-jsx').Program} Program
 * @typedef {import('./complex-types.js').MdxJsxAttributeValueExpression} MdxJsxAttributeValueExpression
 * @typedef {import('./complex-types.js').MdxJsxAttribute} MdxJsxAttribute
 * @typedef {import('./complex-types.js').MdxJsxExpressionAttribute} MdxJsxExpressionAttribute
 * @typedef {import('./complex-types.js').MdxJsxFlowElement} MdxJsxFlowElement
 * @typedef {import('./complex-types.js').MdxJsxTextElement} MdxJsxTextElement
 * @typedef {{name: string|null, attributes: (MdxJsxAttribute|MdxJsxExpressionAttribute)[], close?: boolean, selfClosing?: boolean, start: Token['start'], end: Token['start']}} Tag
 *
 * @typedef ToMarkdownOptions
 * @property {'"'|"'"} [quote='"']
 *   Preferred quote to use around attribute values.
 * @property {boolean} [quoteSmart=false]
 *   Use the other quote if that results in less bytes.
 * @property {boolean} [tightSelfClosing=false]
 *   Do not use an extra space when closing self-closing elements: `<img/>`
 *   instead of `<img />`.
 * @property {number} [printWidth=Infinity]
 *   Specify the line length that the printer will wrap on.
 *   This is not a hard maximum width: things will be printed longer and
 *   shorter.
 *
 *   Note: this option is only used for JSX tags currently, and might be moved
 *   to `mdast-util-to-markdown` in the future.
 */

import {ccount} from 'ccount'
import {parseEntities} from 'parse-entities'
import {stringifyPosition} from 'unist-util-stringify-position'
import {VFileMessage} from 'vfile-message'
import {stringifyEntitiesLight} from 'stringify-entities'
import {containerFlow} from 'mdast-util-to-markdown/lib/util/container-flow.js'
import {containerPhrasing} from 'mdast-util-to-markdown/lib/util/container-phrasing.js'
import {indentLines} from 'mdast-util-to-markdown/lib/util/indent-lines.js'
import {track} from 'mdast-util-to-markdown/lib/util/track.js'

/** @return {FromMarkdownExtension} */
export function mdxJsxFromMarkdown() {
  return {
    canContainEols: ['mdxJsxTextElement'],
    enter: {
      mdxJsxFlowTag: enterMdxJsxTag,
      mdxJsxFlowTagClosingMarker: enterMdxJsxTagClosingMarker,
      mdxJsxFlowTagAttribute: enterMdxJsxTagAttribute,
      mdxJsxFlowTagExpressionAttribute: enterMdxJsxTagExpressionAttribute,
      mdxJsxFlowTagAttributeValueLiteral: buffer,
      mdxJsxFlowTagAttributeValueExpression: buffer,
      mdxJsxFlowTagSelfClosingMarker: enterMdxJsxTagSelfClosingMarker,

      mdxJsxTextTag: enterMdxJsxTag,
      mdxJsxTextTagClosingMarker: enterMdxJsxTagClosingMarker,
      mdxJsxTextTagAttribute: enterMdxJsxTagAttribute,
      mdxJsxTextTagExpressionAttribute: enterMdxJsxTagExpressionAttribute,
      mdxJsxTextTagAttributeValueLiteral: buffer,
      mdxJsxTextTagAttributeValueExpression: buffer,
      mdxJsxTextTagSelfClosingMarker: enterMdxJsxTagSelfClosingMarker
    },
    exit: {
      mdxJsxFlowTagClosingMarker: exitMdxJsxTagClosingMarker,
      mdxJsxFlowTagNamePrimary: exitMdxJsxTagNamePrimary,
      mdxJsxFlowTagNameMember: exitMdxJsxTagNameMember,
      mdxJsxFlowTagNameLocal: exitMdxJsxTagNameLocal,
      mdxJsxFlowTagExpressionAttribute: exitMdxJsxTagExpressionAttribute,
      mdxJsxFlowTagExpressionAttributeValue: data,
      mdxJsxFlowTagAttributeNamePrimary: exitMdxJsxTagAttributeNamePrimary,
      mdxJsxFlowTagAttributeNameLocal: exitMdxJsxTagAttributeNameLocal,
      mdxJsxFlowTagAttributeValueLiteral: exitMdxJsxTagAttributeValueLiteral,
      mdxJsxFlowTagAttributeValueLiteralValue: data,
      mdxJsxFlowTagAttributeValueExpression:
        exitMdxJsxTagAttributeValueExpression,
      mdxJsxFlowTagAttributeValueExpressionValue: data,
      mdxJsxFlowTagSelfClosingMarker: exitMdxJsxTagSelfClosingMarker,
      mdxJsxFlowTag: exitMdxJsxTag,

      mdxJsxTextTagClosingMarker: exitMdxJsxTagClosingMarker,
      mdxJsxTextTagNamePrimary: exitMdxJsxTagNamePrimary,
      mdxJsxTextTagNameMember: exitMdxJsxTagNameMember,
      mdxJsxTextTagNameLocal: exitMdxJsxTagNameLocal,
      mdxJsxTextTagExpressionAttribute: exitMdxJsxTagExpressionAttribute,
      mdxJsxTextTagExpressionAttributeValue: data,
      mdxJsxTextTagAttributeNamePrimary: exitMdxJsxTagAttributeNamePrimary,
      mdxJsxTextTagAttributeNameLocal: exitMdxJsxTagAttributeNameLocal,
      mdxJsxTextTagAttributeValueLiteral: exitMdxJsxTagAttributeValueLiteral,
      mdxJsxTextTagAttributeValueLiteralValue: data,
      mdxJsxTextTagAttributeValueExpression:
        exitMdxJsxTagAttributeValueExpression,
      mdxJsxTextTagAttributeValueExpressionValue: data,
      mdxJsxTextTagSelfClosingMarker: exitMdxJsxTagSelfClosingMarker,
      mdxJsxTextTag: exitMdxJsxTag
    }
  }

  /** @type {FromMarkdownHandle} */
  function buffer() {
    this.buffer()
  }

  /** @type {FromMarkdownHandle} */
  function data(token) {
    this.config.enter.data.call(this, token)
    this.config.exit.data.call(this, token)
  }

  /** @type {FromMarkdownHandle} */
  function enterMdxJsxTag(token) {
    /** @type {Tag} */
    const tag = {name: null, attributes: [], start: token.start, end: token.end}
    if (!this.getData('mdxJsxTagStack')) this.setData('mdxJsxTagStack', [])
    this.setData('mdxJsxTag', tag)
    this.buffer()
  }

  /** @type {FromMarkdownHandle} */
  function enterMdxJsxTagClosingMarker(token) {
    const stack = /** @type {Tag[]} */ (this.getData('mdxJsxTagStack'))

    if (stack.length === 0) {
      throw new VFileMessage(
        'Unexpected closing slash `/` in tag, expected an open tag first',
        {start: token.start, end: token.end},
        'mdast-util-mdx-jsx:unexpected-closing-slash'
      )
    }
  }

  /** @type {FromMarkdownHandle} */
  function enterMdxJsxTagAnyAttribute(token) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))

    if (tag.close) {
      throw new VFileMessage(
        'Unexpected attribute in closing tag, expected the end of the tag',
        {start: token.start, end: token.end},
        'mdast-util-mdx-jsx:unexpected-attribute'
      )
    }
  }

  /** @type {FromMarkdownHandle} */
  function enterMdxJsxTagSelfClosingMarker(token) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))

    if (tag.close) {
      throw new VFileMessage(
        'Unexpected self-closing slash `/` in closing tag, expected the end of the tag',
        {start: token.start, end: token.end},
        'mdast-util-mdx-jsx:unexpected-self-closing-slash'
      )
    }
  }

  /** @type {FromMarkdownHandle} */
  function exitMdxJsxTagClosingMarker() {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    tag.close = true
  }

  /** @type {FromMarkdownHandle} */
  function exitMdxJsxTagNamePrimary(token) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    tag.name = this.sliceSerialize(token)
  }

  /** @type {FromMarkdownHandle} */
  function exitMdxJsxTagNameMember(token) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    tag.name += '.' + this.sliceSerialize(token)
  }

  /** @type {FromMarkdownHandle} */
  function exitMdxJsxTagNameLocal(token) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    tag.name += ':' + this.sliceSerialize(token)
  }

  /** @type {FromMarkdownHandle} */
  function enterMdxJsxTagAttribute(token) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    enterMdxJsxTagAnyAttribute.call(this, token)
    tag.attributes.push({type: 'mdxJsxAttribute', name: '', value: null})
  }

  /** @type {FromMarkdownHandle} */
  function enterMdxJsxTagExpressionAttribute(token) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    enterMdxJsxTagAnyAttribute.call(this, token)
    tag.attributes.push({type: 'mdxJsxExpressionAttribute', value: ''})
    this.buffer()
  }

  /** @type {FromMarkdownHandle} */
  function exitMdxJsxTagExpressionAttribute(token) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    const tail = /** @type {MdxJsxExpressionAttribute} */ (
      tag.attributes[tag.attributes.length - 1]
    )
    /** @type {Program|undefined} */
    // @ts-expect-error: custom.
    const estree = token.estree

    tail.value = this.resume()

    if (estree) {
      tail.data = {estree}
    }
  }

  /** @type {FromMarkdownHandle} */
  function exitMdxJsxTagAttributeNamePrimary(token) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    const node = /** @type {MdxJsxAttribute} */ (
      tag.attributes[tag.attributes.length - 1]
    )
    node.name = this.sliceSerialize(token)
  }

  /** @type {FromMarkdownHandle} */
  function exitMdxJsxTagAttributeNameLocal(token) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    const node = /** @type {MdxJsxAttribute} */ (
      tag.attributes[tag.attributes.length - 1]
    )
    node.name += ':' + this.sliceSerialize(token)
  }

  /** @type {FromMarkdownHandle} */
  function exitMdxJsxTagAttributeValueLiteral() {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    tag.attributes[tag.attributes.length - 1].value = parseEntities(
      this.resume(),
      {nonTerminated: false}
    )
  }

  /** @type {FromMarkdownHandle} */
  function exitMdxJsxTagAttributeValueExpression(token) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    const tail = /** @type {MdxJsxAttribute} */ (
      tag.attributes[tag.attributes.length - 1]
    )
    /** @type {MdxJsxAttributeValueExpression} */
    const node = {type: 'mdxJsxAttributeValueExpression', value: this.resume()}
    /** @type {Program|undefined} */
    // @ts-expect-error: custom.
    const estree = token.estree

    if (estree) {
      node.data = {estree}
    }

    tail.value = node
  }

  /** @type {FromMarkdownHandle} */
  function exitMdxJsxTagSelfClosingMarker() {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))

    tag.selfClosing = true
  }

  /** @type {FromMarkdownHandle} */
  function exitMdxJsxTag(token) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    const stack = /** @type {Tag[]} */ (this.getData('mdxJsxTagStack'))
    const tail = stack[stack.length - 1]

    if (tag.close && tail.name !== tag.name) {
      throw new VFileMessage(
        'Unexpected closing tag `' +
          serializeAbbreviatedTag(tag) +
          '`, expected corresponding closing tag for `' +
          serializeAbbreviatedTag(tail) +
          '` (' +
          stringifyPosition(tail) +
          ')',
        {start: token.start, end: token.end},
        'mdast-util-mdx-jsx:end-tag-mismatch'
      )
    }

    // End of a tag, so drop the buffer.
    this.resume()

    if (tag.close) {
      stack.pop()
    } else {
      this.enter(
        {
          type:
            token.type === 'mdxJsxTextTag'
              ? 'mdxJsxTextElement'
              : 'mdxJsxFlowElement',
          name: tag.name,
          attributes: tag.attributes,
          children: []
        },
        token,
        onErrorRightIsTag
      )
    }

    if (tag.selfClosing || tag.close) {
      this.exit(token, onErrorLeftIsTag)
    } else {
      stack.push(tag)
    }
  }

  /** @type {OnEnterError} */
  function onErrorRightIsTag(closing, open) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    const place = closing ? ' before the end of `' + closing.type + '`' : ''
    const position = closing
      ? {start: closing.start, end: closing.end}
      : undefined

    throw new VFileMessage(
      'Expected a closing tag for `' +
        serializeAbbreviatedTag(tag) +
        '` (' +
        stringifyPosition({start: open.start, end: open.end}) +
        ')' +
        place,
      position,
      'mdast-util-mdx-jsx:end-tag-mismatch'
    )
  }

  /** @type {OnExitError} */
  function onErrorLeftIsTag(a, b) {
    const tag = /** @type {Tag} */ (this.getData('mdxJsxTag'))
    throw new VFileMessage(
      'Expected the closing tag `' +
        serializeAbbreviatedTag(tag) +
        '` either after the end of `' +
        b.type +
        '` (' +
        stringifyPosition(b.end) +
        ') or another opening tag after the start of `' +
        b.type +
        '` (' +
        stringifyPosition(b.start) +
        ')',
      {start: a.start, end: a.end},
      'mdast-util-mdx-jsx:end-tag-mismatch'
    )
  }

  /**
   * Serialize a tag, excluding attributes.
   * `self-closing` is not supported, because we don’t need it yet.
   *
   * @param {Tag} tag
   * @returns {string}
   */
  function serializeAbbreviatedTag(tag) {
    return '<' + (tag.close ? '/' : '') + (tag.name || '') + '>'
  }
}

/**
 * @param {ToMarkdownOptions} [options={}]
 *   Configuration (optional).
 * @returns {ToMarkdownExtension}
 */
export function mdxJsxToMarkdown(options = {}) {
  const {
    quote = '"',
    quoteSmart,
    tightSelfClosing,
    printWidth = Number.POSITIVE_INFINITY
  } = options
  const alternative = quote === '"' ? "'" : '"'

  if (quote !== '"' && quote !== "'") {
    throw new Error(
      'Cannot serialize attribute values with `' +
        quote +
        '` for `options.quote`, expected `"`, or `\'`'
    )
  }

  mdxElement.peek = peekElement

  return {
    handlers: {
      mdxJsxFlowElement: mdxElement,
      mdxJsxTextElement: mdxElement
    },
    unsafe: [
      {character: '<', inConstruct: ['phrasing']},
      {atBreak: true, character: '<'}
    ],
    fences: true,
    resourceLink: true
  }

  /**
   * @type {ToMarkdownHandle}
   * @param {MdxJsxFlowElement|MdxJsxTextElement} node
   */
  // eslint-disable-next-line complexity
  function mdxElement(node, _, context, safeOptions) {
    const tracker = track(safeOptions)
    const selfClosing =
      node.name && (!node.children || node.children.length === 0)
    const exit = context.enter(node.type)
    let index = -1
    /** @type {Array<string>} */
    const serializedAttributes = []
    let value = tracker.move('<' + (node.name || ''))

    // None.
    if (node.attributes && node.attributes.length > 0) {
      if (!node.name) {
        throw new Error('Cannot serialize fragment w/ attributes')
      }

      while (++index < node.attributes.length) {
        const attribute = node.attributes[index]
        /** @type {string} */
        let result

        if (attribute.type === 'mdxJsxExpressionAttribute') {
          result = '{' + (attribute.value || '') + '}'
        } else {
          if (!attribute.name) {
            throw new Error('Cannot serialize attribute w/o name')
          }

          const value = attribute.value
          const left = attribute.name
          /** @type {string} */
          let right = ''

          if (value === undefined || value === null) {
            // Empty.
          } else if (typeof value === 'object') {
            right = '{' + (value.value || '') + '}'
          } else {
            // If the alternative is less common than `quote`, switch.
            const appliedQuote =
              quoteSmart && ccount(value, quote) > ccount(value, alternative)
                ? alternative
                : quote
            right =
              appliedQuote +
              stringifyEntitiesLight(value, {subset: [appliedQuote]}) +
              appliedQuote
          }

          result = left + (right ? '=' : '') + right
        }

        serializedAttributes.push(result)
      }
    }

    let attributesOnTheirOwnLine = false
    const attributesOnOneLine = serializedAttributes.join(' ')

    if (
      // Block:
      node.type === 'mdxJsxFlowElement' &&
      // Including a line ending (expressions).
      (/\r?\n|\r/.test(attributesOnOneLine) ||
        // Current position (including `<tag`).
        tracker.current().now.column +
          // -1 because columns, +1 for ` ` before attributes.
          // Attributes joined by spaces.
          attributesOnOneLine.length +
          // ` />`.
          (selfClosing ? (tightSelfClosing ? 2 : 3) : 1) >
          printWidth)
    ) {
      attributesOnTheirOwnLine = true
    }

    if (attributesOnTheirOwnLine) {
      value += tracker.move(
        '\n' + indentLines(serializedAttributes.join('\n'), map)
      )
    } else if (attributesOnOneLine) {
      value += tracker.move(' ' + attributesOnOneLine)
    }

    if (attributesOnTheirOwnLine) {
      value += tracker.move('\n')
    }

    if (selfClosing) {
      value += tracker.move(
        (tightSelfClosing || attributesOnTheirOwnLine ? '' : ' ') + '/'
      )
    }

    value += tracker.move('>')

    if (node.children && node.children.length > 0) {
      if (node.type === 'mdxJsxFlowElement') {
        tracker.shift(2)
        value += tracker.move('\n')
        value += tracker.move(
          indentLines(containerFlow(node, context, tracker.current()), map)
        )
        value += tracker.move('\n')
      } else {
        value += tracker.move(
          containerPhrasing(node, context, {
            ...tracker.current(),
            before: '<',
            after: '>'
          })
        )
      }
    }

    if (!selfClosing) {
      value += tracker.move('</' + (node.name || '') + '>')
    }

    exit()
    return value
  }

  /** @type {ToMarkdownMap} */
  function map(line, _, blank) {
    return (blank ? '' : '  ') + line
  }

  /**
   * @type {ToMarkdownHandle}
   */
  function peekElement() {
    return '<'
  }
}
