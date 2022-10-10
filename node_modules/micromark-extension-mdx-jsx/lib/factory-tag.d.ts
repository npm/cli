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
export function factoryTag(
  effects: Effects,
  ok: State,
  nok: State,
  acorn: Acorn | undefined,
  acornOptions: AcornOptions | undefined,
  addResult: boolean | undefined,
  allowLazy: boolean | undefined,
  tagType: string,
  tagMarkerType: string,
  tagClosingMarkerType: string,
  tagSelfClosingMarker: string,
  tagNameType: string,
  tagNamePrimaryType: string,
  tagNameMemberMarkerType: string,
  tagNameMemberType: string,
  tagNamePrefixMarkerType: string,
  tagNameLocalType: string,
  tagExpressionAttributeType: string,
  tagExpressionAttributeMarkerType: string,
  tagExpressionAttributeValueType: string,
  tagAttributeType: string,
  tagAttributeNameType: string,
  tagAttributeNamePrimaryType: string,
  tagAttributeNamePrefixMarkerType: string,
  tagAttributeNameLocalType: string,
  tagAttributeInitializerMarkerType: string,
  tagAttributeValueLiteralType: string,
  tagAttributeValueLiteralMarkerType: string,
  tagAttributeValueLiteralValueType: string,
  tagAttributeValueExpressionType: string,
  tagAttributeValueExpressionMarkerType: string,
  tagAttributeValueExpressionValueType: string
): (
  code: import('micromark-util-types').Code
) => void | import('micromark-util-types').State
export type TokenizeContext = import('micromark-util-types').TokenizeContext
export type Tokenizer = import('micromark-util-types').Tokenizer
export type Effects = import('micromark-util-types').Effects
export type State = import('micromark-util-types').State
export type Code = import('micromark-util-types').Code
export type Point = import('micromark-util-types').Point
export type Acorn = import('micromark-factory-mdx-expression').Acorn
export type AcornOptions =
  import('micromark-factory-mdx-expression').AcornOptions
