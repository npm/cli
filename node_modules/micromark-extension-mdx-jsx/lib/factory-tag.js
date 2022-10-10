/**
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-factory-mdx-expression').Acorn} Acorn
 * @typedef {import('micromark-factory-mdx-expression').AcornOptions} AcornOptions
 */
import {start as idStart, cont as idCont} from 'estree-util-is-identifier-name'
import {factoryMdxExpression} from 'micromark-factory-mdx-expression'
import {factorySpace} from 'micromark-factory-space'
import {
  markdownLineEnding,
  markdownLineEndingOrSpace,
  markdownSpace,
  unicodeWhitespace
} from 'micromark-util-character'
import {VFileMessage} from 'vfile-message'
const lazyLineEnd = {
  tokenize: tokenizeLazyLineEnd,
  partial: true
}
/**
 * @this {TokenizeContext}
 * @param {Effects} effects
 * @param {State} ok
 * @param {State} nok
 * @param {Acorn|undefined} acorn
 * @param {AcornOptions|undefined} acornOptions
 * @param {boolean|undefined} addResult
 * @param {boolean|undefined} allowLazy
 * @param {string} tagType
 * @param {string} tagMarkerType
 * @param {string} tagClosingMarkerType
 * @param {string} tagSelfClosingMarker
 * @param {string} tagNameType
 * @param {string} tagNamePrimaryType
 * @param {string} tagNameMemberMarkerType
 * @param {string} tagNameMemberType
 * @param {string} tagNamePrefixMarkerType
 * @param {string} tagNameLocalType
 * @param {string} tagExpressionAttributeType
 * @param {string} tagExpressionAttributeMarkerType
 * @param {string} tagExpressionAttributeValueType
 * @param {string} tagAttributeType
 * @param {string} tagAttributeNameType
 * @param {string} tagAttributeNamePrimaryType
 * @param {string} tagAttributeNamePrefixMarkerType
 * @param {string} tagAttributeNameLocalType
 * @param {string} tagAttributeInitializerMarkerType
 * @param {string} tagAttributeValueLiteralType
 * @param {string} tagAttributeValueLiteralMarkerType
 * @param {string} tagAttributeValueLiteralValueType
 * @param {string} tagAttributeValueExpressionType
 * @param {string} tagAttributeValueExpressionMarkerType
 * @param {string} tagAttributeValueExpressionValueType
 */
// eslint-disable-next-line max-params

export function factoryTag(
  effects,
  ok,
  nok,
  acorn,
  acornOptions,
  addResult,
  allowLazy,
  tagType,
  tagMarkerType,
  tagClosingMarkerType,
  tagSelfClosingMarker,
  tagNameType,
  tagNamePrimaryType,
  tagNameMemberMarkerType,
  tagNameMemberType,
  tagNamePrefixMarkerType,
  tagNameLocalType,
  tagExpressionAttributeType,
  tagExpressionAttributeMarkerType,
  tagExpressionAttributeValueType,
  tagAttributeType,
  tagAttributeNameType,
  tagAttributeNamePrimaryType,
  tagAttributeNamePrefixMarkerType,
  tagAttributeNameLocalType,
  tagAttributeInitializerMarkerType,
  tagAttributeValueLiteralType,
  tagAttributeValueLiteralMarkerType,
  tagAttributeValueLiteralValueType,
  tagAttributeValueExpressionType,
  tagAttributeValueExpressionMarkerType,
  tagAttributeValueExpressionValueType
) {
  const self = this
  /** @type {State} */

  let returnState
  /** @type {NonNullable<Code>|undefined} */

  let marker
  /** @type {Point|undefined} */

  let startPoint
  return start
  /** @type {State} */

  function start(code) {
    startPoint = self.now()
    effects.enter(tagType)
    effects.enter(tagMarkerType)
    effects.consume(code)
    effects.exit(tagMarkerType)
    return afterStart
  }
  /** @type {State} */

  function afterStart(code) {
    // Deviate from JSX, which allows arbitrary whitespace.
    // See: <https://github.com/micromark/micromark-extension-mdx-jsx/issues/7>.
    if (markdownLineEnding(code) || markdownSpace(code)) {
      return nok(code)
    } // Any other ES whitespace does not get this treatment.

    returnState = beforeName
    return optionalEsWhitespace(code)
  } // Right after `<`, before an optional name.

  /** @type {State} */

  function beforeName(code) {
    // Closing tag.
    if (code === 47) {
      effects.enter(tagClosingMarkerType)
      effects.consume(code)
      effects.exit(tagClosingMarkerType)
      returnState = beforeClosingTagName
      return optionalEsWhitespace
    } // Fragment opening tag.

    if (code === 62) {
      return tagEnd(code)
    } // Start of a name.

    if (code !== null && idStart(code)) {
      effects.enter(tagNameType)
      effects.enter(tagNamePrimaryType)
      effects.consume(code)
      return primaryName
    }

    crash(
      code,
      'before name',
      'a character that can start a name, such as a letter, `$`, or `_`' +
        (code === 33
          ? ' (note: to create a comment in MDX, use `{/* text */}`)'
          : '')
    )
  } // At the start of a closing tag, right after `</`.

  /** @type {State} */

  function beforeClosingTagName(code) {
    // Fragment closing tag.
    if (code === 62) {
      return tagEnd(code)
    } // Start of a closing tag name.

    if (code !== null && idStart(code)) {
      effects.enter(tagNameType)
      effects.enter(tagNamePrimaryType)
      effects.consume(code)
      return primaryName
    }

    crash(
      code,
      'before name',
      'a character that can start a name, such as a letter, `$`, or `_`' +
        (code === 42 || code === 47
          ? ' (note: JS comments in JSX tags are not supported in MDX)'
          : '')
    )
  } // Inside the primary name.

  /** @type {State} */

  function primaryName(code) {
    // Continuation of name: remain.
    if (code === 45 || (code !== null && idCont(code))) {
      effects.consume(code)
      return primaryName
    } // End of name.

    if (
      code === 46 ||
      code === 47 ||
      code === 58 ||
      code === 62 ||
      code === 123 ||
      markdownLineEndingOrSpace(code) ||
      unicodeWhitespace(code)
    ) {
      effects.exit(tagNamePrimaryType)
      returnState = afterPrimaryName
      return optionalEsWhitespace(code)
    }

    crash(
      code,
      'in name',
      'a name character such as letters, digits, `$`, or `_`; whitespace before attributes; or the end of the tag' +
        (code === 64
          ? ' (note: to create a link in MDX, use `[text](url)`)'
          : '')
    )
  } // After a name.

  /** @type {State} */

  function afterPrimaryName(code) {
    // Start of a member name.
    if (code === 46) {
      effects.enter(tagNameMemberMarkerType)
      effects.consume(code)
      effects.exit(tagNameMemberMarkerType)
      returnState = beforeMemberName
      return optionalEsWhitespace
    } // Start of a local name.

    if (code === 58) {
      effects.enter(tagNamePrefixMarkerType)
      effects.consume(code)
      effects.exit(tagNamePrefixMarkerType)
      returnState = beforeLocalName
      return optionalEsWhitespace
    } // End of name.

    if (
      code === 47 ||
      code === 62 ||
      code === 123 ||
      (code !== null && idStart(code))
    ) {
      effects.exit(tagNameType)
      return beforeAttribute(code)
    }

    crash(
      code,
      'after name',
      'a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag'
    )
  } // We’ve seen a `.` and are expecting a member name.

  /** @type {State} */

  function beforeMemberName(code) {
    // Start of a member name.
    if (code !== null && idStart(code)) {
      effects.enter(tagNameMemberType)
      effects.consume(code)
      return memberName
    }

    crash(
      code,
      'before member name',
      'a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag'
    )
  } // Inside the member name.

  /** @type {State} */

  function memberName(code) {
    // Continuation of member name: stay in state
    if (code === 45 || (code !== null && idCont(code))) {
      effects.consume(code)
      return memberName
    } // End of member name (note that namespaces and members can’t be combined).

    if (
      code === 46 ||
      code === 47 ||
      code === 62 ||
      code === 123 ||
      markdownLineEndingOrSpace(code) ||
      unicodeWhitespace(code)
    ) {
      effects.exit(tagNameMemberType)
      returnState = afterMemberName
      return optionalEsWhitespace(code)
    }

    crash(
      code,
      'in member name',
      'a name character such as letters, digits, `$`, or `_`; whitespace before attributes; or the end of the tag' +
        (code === 64
          ? ' (note: to create a link in MDX, use `[text](url)`)'
          : '')
    )
  } // After a member name: this is the same as `afterPrimaryName` but we don’t
  // expect colons.

  /** @type {State} */

  function afterMemberName(code) {
    // Start another member name.
    if (code === 46) {
      effects.enter(tagNameMemberMarkerType)
      effects.consume(code)
      effects.exit(tagNameMemberMarkerType)
      returnState = beforeMemberName
      return optionalEsWhitespace
    } // End of name.

    if (
      code === 47 ||
      code === 62 ||
      code === 123 ||
      (code !== null && idStart(code))
    ) {
      effects.exit(tagNameType)
      return beforeAttribute(code)
    }

    crash(
      code,
      'after member name',
      'a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag'
    )
  } // We’ve seen a `:`, and are expecting a local name.

  /** @type {State} */

  function beforeLocalName(code) {
    // Start of a local name.
    if (code !== null && idStart(code)) {
      effects.enter(tagNameLocalType)
      effects.consume(code)
      return localName
    }

    crash(
      code,
      'before local name',
      'a character that can start a name, such as a letter, `$`, or `_`' +
        (code === 43 || (code !== null && code > 46 && code < 58)
          ? /* `/` - `9` */
            ' (note: to create a link in MDX, use `[text](url)`)'
          : '')
    )
  } // Inside the local name.

  /** @type {State} */

  function localName(code) {
    // Continuation of local name: stay in state
    if (code === 45 || (code !== null && idCont(code))) {
      effects.consume(code)
      return localName
    } // End of local name (note that we don’t expect another colon, or a member).

    if (
      code === 47 ||
      code === 62 ||
      code === 123 ||
      markdownLineEndingOrSpace(code) ||
      unicodeWhitespace(code)
    ) {
      effects.exit(tagNameLocalType)
      returnState = afterLocalName
      return optionalEsWhitespace(code)
    }

    crash(
      code,
      'in local name',
      'a name character such as letters, digits, `$`, or `_`; whitespace before attributes; or the end of the tag'
    )
  } // After a local name: this is the same as `afterPrimaryName` but we don’t
  // expect colons or periods.

  /** @type {State} */

  function afterLocalName(code) {
    // End of name.
    if (
      code === 47 ||
      code === 62 ||
      code === 123 ||
      (code !== null && idStart(code))
    ) {
      effects.exit(tagNameType)
      return beforeAttribute(code)
    }

    crash(
      code,
      'after local name',
      'a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag'
    )
  }
  /** @type {State} */

  function beforeAttribute(code) {
    // Mark as self-closing.
    if (code === 47) {
      effects.enter(tagSelfClosingMarker)
      effects.consume(code)
      effects.exit(tagSelfClosingMarker)
      returnState = selfClosing
      return optionalEsWhitespace
    } // End of tag.

    if (code === 62) {
      return tagEnd(code)
    } // Attribute expression.

    if (code === 123) {
      return factoryMdxExpression.call(
        self,
        effects,
        afterAttributeExpression,
        tagExpressionAttributeType,
        tagExpressionAttributeMarkerType,
        tagExpressionAttributeValueType,
        acorn,
        acornOptions,
        addResult,
        true,
        false,
        allowLazy,
        startPoint.column
      )(code)
    } // Start of an attribute name.

    if (code !== null && idStart(code)) {
      effects.enter(tagAttributeType)
      effects.enter(tagAttributeNameType)
      effects.enter(tagAttributeNamePrimaryType)
      effects.consume(code)
      return attributePrimaryName
    }

    crash(
      code,
      'before attribute name',
      'a character that can start an attribute name, such as a letter, `$`, or `_`; whitespace before attributes; or the end of the tag'
    )
  } // At the start of an attribute expression.

  /** @type {State} */

  function afterAttributeExpression(code) {
    returnState = beforeAttribute
    return optionalEsWhitespace(code)
  } // In the attribute name.

  /** @type {State} */

  function attributePrimaryName(code) {
    // Continuation of the attribute name.
    if (code === 45 || (code !== null && idCont(code))) {
      effects.consume(code)
      return attributePrimaryName
    } // End of attribute name or tag.

    if (
      code === 47 ||
      code === 58 ||
      code === 61 ||
      code === 62 ||
      code === 123 ||
      markdownLineEndingOrSpace(code) ||
      unicodeWhitespace(code)
    ) {
      effects.exit(tagAttributeNamePrimaryType)
      returnState = afterAttributePrimaryName
      return optionalEsWhitespace(code)
    }

    crash(
      code,
      'in attribute name',
      'an attribute name character such as letters, digits, `$`, or `_`; `=` to initialize a value; whitespace before attributes; or the end of the tag'
    )
  } // After an attribute name, probably finding an equals.

  /** @type {State} */

  function afterAttributePrimaryName(code) {
    // Start of a local name.
    if (code === 58) {
      effects.enter(tagAttributeNamePrefixMarkerType)
      effects.consume(code)
      effects.exit(tagAttributeNamePrefixMarkerType)
      returnState = beforeAttributeLocalName
      return optionalEsWhitespace
    } // Start of an attribute value.

    if (code === 61) {
      effects.exit(tagAttributeNameType)
      effects.enter(tagAttributeInitializerMarkerType)
      effects.consume(code)
      effects.exit(tagAttributeInitializerMarkerType)
      returnState = beforeAttributeValue
      return optionalEsWhitespace
    } // End of tag / new attribute.

    if (
      code === 47 ||
      code === 62 ||
      code === 123 ||
      markdownLineEndingOrSpace(code) ||
      unicodeWhitespace(code) ||
      (code !== null && idStart(code))
    ) {
      effects.exit(tagAttributeNameType)
      effects.exit(tagAttributeType)
      returnState = beforeAttribute
      return optionalEsWhitespace(code)
    }

    crash(
      code,
      'after attribute name',
      'a character that can start an attribute name, such as a letter, `$`, or `_`; `=` to initialize a value; or the end of the tag'
    )
  } // We’ve seen a `:`, and are expecting a local name.

  /** @type {State} */

  function beforeAttributeLocalName(code) {
    // Start of a local name.
    if (code !== null && idStart(code)) {
      effects.enter(tagAttributeNameLocalType)
      effects.consume(code)
      return attributeLocalName
    }

    crash(
      code,
      'before local attribute name',
      'a character that can start an attribute name, such as a letter, `$`, or `_`; `=` to initialize a value; or the end of the tag'
    )
  } // In the local attribute name.

  /** @type {State} */

  function attributeLocalName(code) {
    // Continuation of the local attribute name.
    if (code === 45 || (code !== null && idCont(code))) {
      effects.consume(code)
      return attributeLocalName
    } // End of tag / attribute name.

    if (
      code === 47 ||
      code === 61 ||
      code === 62 ||
      code === 123 ||
      markdownLineEndingOrSpace(code) ||
      unicodeWhitespace(code)
    ) {
      effects.exit(tagAttributeNameLocalType)
      effects.exit(tagAttributeNameType)
      returnState = afterAttributeLocalName
      return optionalEsWhitespace(code)
    }

    crash(
      code,
      'in local attribute name',
      'an attribute name character such as letters, digits, `$`, or `_`; `=` to initialize a value; whitespace before attributes; or the end of the tag'
    )
  } // After a local attribute name, expecting an equals.

  /** @type {State} */

  function afterAttributeLocalName(code) {
    // Start of an attribute value.
    if (code === 61) {
      effects.enter(tagAttributeInitializerMarkerType)
      effects.consume(code)
      effects.exit(tagAttributeInitializerMarkerType)
      returnState = beforeAttributeValue
      return optionalEsWhitespace
    } // End of tag / new attribute.

    if (
      code === 47 ||
      code === 62 ||
      code === 123 ||
      (code !== null && idStart(code))
    ) {
      effects.exit(tagAttributeType)
      return beforeAttribute(code)
    }

    crash(
      code,
      'after local attribute name',
      'a character that can start an attribute name, such as a letter, `$`, or `_`; `=` to initialize a value; or the end of the tag'
    )
  } // After an attribute value initializer, expecting quotes and such.

  /** @type {State} */

  function beforeAttributeValue(code) {
    // Start of double- or single quoted value.
    if (code === 34 || code === 39) {
      effects.enter(tagAttributeValueLiteralType)
      effects.enter(tagAttributeValueLiteralMarkerType)
      effects.consume(code)
      effects.exit(tagAttributeValueLiteralMarkerType)
      marker = code
      return attributeValueQuotedStart
    } // Start of an assignment expression.

    if (code === 123) {
      return factoryMdxExpression.call(
        self,
        effects,
        afterAttributeValueExpression,
        tagAttributeValueExpressionType,
        tagAttributeValueExpressionMarkerType,
        tagAttributeValueExpressionValueType,
        acorn,
        acornOptions,
        addResult,
        false,
        false,
        allowLazy,
        startPoint.column
      )(code)
    }

    crash(
      code,
      'before attribute value',
      'a character that can start an attribute value, such as `"`, `\'`, or `{`' +
        (code === 60
          ? ' (note: to use an element or fragment as a prop value in MDX, use `{<element />}`)'
          : '')
    )
  }
  /** @type {State} */

  function afterAttributeValueExpression(code) {
    effects.exit(tagAttributeType)
    returnState = beforeAttribute
    return optionalEsWhitespace(code)
  } // At the start of a quoted attribute value.

  /** @type {State} */

  function attributeValueQuotedStart(code) {
    if (code === null) {
      crash(
        code,
        'in attribute value',
        'a corresponding closing quote `' + String.fromCharCode(marker) + '`'
      )
    }

    if (code === marker) {
      effects.enter(tagAttributeValueLiteralMarkerType)
      effects.consume(code)
      effects.exit(tagAttributeValueLiteralMarkerType)
      effects.exit(tagAttributeValueLiteralType)
      effects.exit(tagAttributeType)
      marker = undefined
      returnState = beforeAttribute
      return optionalEsWhitespace
    }

    if (markdownLineEnding(code)) {
      returnState = attributeValueQuotedStart
      return optionalEsWhitespace(code)
    }

    effects.enter(tagAttributeValueLiteralValueType)
    return attributeValueQuoted(code)
  } // In a quoted attribute value.

  /** @type {State} */

  function attributeValueQuoted(code) {
    if (code === null || code === marker || markdownLineEnding(code)) {
      effects.exit(tagAttributeValueLiteralValueType)
      return attributeValueQuotedStart(code)
    } // Continuation.

    effects.consume(code)
    return attributeValueQuoted
  } // Right after the slash on a tag, e.g., `<asd /`.

  /** @type {State} */

  function selfClosing(code) {
    // End of tag.
    if (code === 62) {
      return tagEnd(code)
    }

    crash(
      code,
      'after self-closing slash',
      '`>` to end the tag' +
        (code === 42 || code === 47
          ? ' (note: JS comments in JSX tags are not supported in MDX)'
          : '')
    )
  } // At a `>`.

  /** @type {State} */

  function tagEnd(code) {
    effects.enter(tagMarkerType)
    effects.consume(code)
    effects.exit(tagMarkerType)
    effects.exit(tagType)
    return ok
  } // Optionally start whitespace.

  /** @type {State} */

  function optionalEsWhitespace(code) {
    if (markdownLineEnding(code)) {
      if (allowLazy) {
        effects.enter('lineEnding')
        effects.consume(code)
        effects.exit('lineEnding')
        return factorySpace(effects, optionalEsWhitespace, 'linePrefix', 4)
      }

      return effects.attempt(
        lazyLineEnd,
        factorySpace(effects, optionalEsWhitespace, 'linePrefix', 4),
        crashEol
      )(code)
    }

    if (markdownSpace(code) || unicodeWhitespace(code)) {
      effects.enter('esWhitespace')
      return optionalEsWhitespaceContinue(code)
    }

    return returnState(code)
  } // Continue optional whitespace.

  /** @type {State} */

  function optionalEsWhitespaceContinue(code) {
    if (
      markdownLineEnding(code) ||
      !(markdownSpace(code) || unicodeWhitespace(code))
    ) {
      effects.exit('esWhitespace')
      return optionalEsWhitespace(code)
    }

    effects.consume(code)
    return optionalEsWhitespaceContinue
  }
  /** @type {State} */

  function crashEol() {
    throw new VFileMessage(
      'Unexpected lazy line in container, expected line to be prefixed with `>` when in a block quote, whitespace when in a list, etc',
      self.now(),
      'micromark-extension-mdx-jsx:unexpected-eof'
    )
  } // Crash at a nonconforming character.

  /**
   * @param {Code} code
   * @param {string} at
   * @param {string} expect
   */

  function crash(code, at, expect) {
    throw new VFileMessage(
      'Unexpected ' +
        (code === null
          ? 'end of file'
          : 'character `' +
            (code === 96 ? '` ` `' : String.fromCharCode(code)) +
            '` (' +
            serializeCharCode(code) +
            ')') +
        ' ' +
        at +
        ', expected ' +
        expect,
      self.now(),
      'micromark-extension-mdx-jsx:unexpected-' +
        (code === null ? 'eof' : 'character')
    )
  }
}
/** @type {Tokenizer} */

function tokenizeLazyLineEnd(effects, ok, nok) {
  const self = this
  return start
  /** @type {State} */

  function start(code) {
    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    return lineStart
  }
  /** @type {State} */

  function lineStart(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code)
  }
}
/**
 * @param {NonNullable<Code>} code
 * @returns {string}
 */

function serializeCharCode(code) {
  return 'U+' + code.toString(16).toUpperCase().padStart(4, '0')
}
