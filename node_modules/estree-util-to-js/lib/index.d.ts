/**
 * Estree (and esast) utility to serialize estrees as JavaScript.
 *
 * @param value
 *   Estree (esast).
 * @param options
 *   Configuration (optional).
 * @returns
 *   An object with two fields:
 *   *   `value` (`string`) — serialized JavaScript
 *   *   `map` (`Object?`) — source map as (parsed) JSON, if
 *       `SourceMapGenerator` is passed
 */
export const toJs: ((
  value: Program,
  options: OptionsWithSourceMapGenerator
) => ResultWithSourceMapGenerator) &
  ((
    value: Program,
    options?: OptionsWithoutSourceMapGenerator
  ) => ResultWithoutSourceMapGenerator)
export type Program = import('estree-jsx').Program
export type SourceMapGenerator = typeof import('source-map').SourceMapGenerator
export type Handlers = import('./types.js').Handlers
export type BaseFields = {
  /**
   * Object mapping node types to functions handling the corresponding nodes.
   */
  handlers?: Partial<import('./types.js').Generator> | undefined
}
export type SourceMapFieldsWithoutSourceMapGenerator = {
  /**
   * Generate a source map by passing a `SourceMapGenerator` from `source-map`
   * in.
   */
  SourceMapGenerator?: undefined
  /**
   * Path to input file.
   */
  filePath?: undefined
}
export type SourceMapFieldsWithSourceMapGenerator = {
  /**
   * Generate a source map by passing a `SourceMapGenerator` from `source-map`
   * in.
   */
  SourceMapGenerator: SourceMapGenerator
  /**
   * Path to input file.
   */
  filePath?: string | undefined
}
export type OptionsWithoutSourceMapGenerator = BaseFields &
  SourceMapFieldsWithoutSourceMapGenerator
export type OptionsWithSourceMapGenerator = BaseFields &
  SourceMapFieldsWithSourceMapGenerator
/**
 * Configuration (optional).
 */
export type Options =
  | OptionsWithoutSourceMapGenerator
  | OptionsWithSourceMapGenerator
/**
 * Raw source map, see:
 * <https://github.com/mozilla/source-map/blob/58819f0/source-map.d.ts#L15-L23>.
 */
export type Map = {
  version: number
  sources: Array<string>
  names: Array<string>
  sourceRoot?: string | undefined
  sourcesContent?: Array<string> | undefined
  mappings: string
  file: string
}
export type BaseResultFields = {
  /**
   * Serialized JavaScript.
   */
  value: string
}
export type ResultFieldsWithoutSourceMapGenerator = {
  /**
   * Source map as (parsed) JSON, if `SourceMapGenerator` is passed.
   */
  map: undefined
}
export type ResultFieldsWithSourceMapGenerator = {
  /**
   * Source map as (parsed) JSON, if `SourceMapGenerator` is passed.
   */
  map: Map
}
export type ResultFieldsRegardlessOfSourceMapGenerator = {
  /**
   * Source map as (parsed) JSON, if `SourceMapGenerator` is passed.
   */
  map: Map | undefined
}
export type ResultWithoutSourceMapGenerator = BaseResultFields &
  ResultFieldsWithoutSourceMapGenerator
export type ResultWithSourceMapGenerator = BaseResultFields &
  ResultFieldsWithSourceMapGenerator
export type ResultRegardlessOfSourceMapGenerator = BaseResultFields &
  ResultFieldsRegardlessOfSourceMapGenerator
export type Result = ResultRegardlessOfSourceMapGenerator
