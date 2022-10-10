/**
 * @typedef {import('estree-jsx').Program} Program
 * @typedef {typeof import('source-map').SourceMapGenerator} SourceMapGenerator
 * @typedef {import('./types.js').Handlers} Handlers
 *
 * @typedef BaseFields
 * @property {Handlers} [handlers]
 *   Object mapping node types to functions handling the corresponding nodes.
 *
 * @typedef SourceMapFieldsWithoutSourceMapGenerator
 * @property {undefined} [SourceMapGenerator]
 *   Generate a source map by passing a `SourceMapGenerator` from `source-map`
 *   in.
 * @property {undefined} [filePath]
 *   Path to input file.
 *
 * @typedef SourceMapFieldsWithSourceMapGenerator
 * @property {SourceMapGenerator} SourceMapGenerator
 *   Generate a source map by passing a `SourceMapGenerator` from `source-map`
 *   in.
 * @property {string} [filePath]
 *   Path to input file.
 *
 * @typedef {BaseFields & SourceMapFieldsWithoutSourceMapGenerator} OptionsWithoutSourceMapGenerator
 * @typedef {BaseFields & SourceMapFieldsWithSourceMapGenerator} OptionsWithSourceMapGenerator
 *
 * @typedef {OptionsWithoutSourceMapGenerator|OptionsWithSourceMapGenerator} Options
 *   Configuration (optional).
 *
 * @typedef Map
 *   Raw source map, see:
 *   <https://github.com/mozilla/source-map/blob/58819f0/source-map.d.ts#L15-L23>.
 * @property {number} version
 * @property {Array<string>} sources
 * @property {Array<string>} names
 * @property {string|undefined} [sourceRoot]
 * @property {Array<string>|undefined} [sourcesContent]
 * @property {string} mappings
 * @property {string} file
 *
 * @typedef BaseResultFields
 * @property {string} value
 *   Serialized JavaScript.
 *
 * @typedef ResultFieldsWithoutSourceMapGenerator
 * @property {undefined} map
 *   Source map as (parsed) JSON, if `SourceMapGenerator` is passed.
 *
 * @typedef ResultFieldsWithSourceMapGenerator
 * @property {Map} map
 *   Source map as (parsed) JSON, if `SourceMapGenerator` is passed.
 *
 * @typedef ResultFieldsRegardlessOfSourceMapGenerator
 * @property {Map|undefined} map
 *   Source map as (parsed) JSON, if `SourceMapGenerator` is passed.
 *
 * @typedef {BaseResultFields & ResultFieldsWithoutSourceMapGenerator} ResultWithoutSourceMapGenerator
 * @typedef {BaseResultFields & ResultFieldsWithSourceMapGenerator} ResultWithSourceMapGenerator
 * @typedef {BaseResultFields & ResultFieldsRegardlessOfSourceMapGenerator} ResultRegardlessOfSourceMapGenerator
 *
 * @typedef {ResultRegardlessOfSourceMapGenerator} Result
 */

import {GENERATOR, generate} from 'astring'

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
export const toJs =
  /**
   * @type {(
   *   ((value: Program, options: OptionsWithSourceMapGenerator) => ResultWithSourceMapGenerator) &
   *   ((value: Program, options?: OptionsWithoutSourceMapGenerator) => ResultWithoutSourceMapGenerator)
   * )}
   */
  (
    /**
     * @param {Program} tree
     * @param {Options} [options={}]
     * @returns {Result}
     */
    function (tree, options = {}) {
      const {SourceMapGenerator, filePath, handlers} = options
      const sourceMap = SourceMapGenerator
        ? new SourceMapGenerator({file: filePath || '<unknown>.js'})
        : undefined

      const value = generate(tree, {
        comments: true,
        generator: {...GENERATOR, ...handlers},
        sourceMap
      })
      const map = sourceMap ? sourceMap.toJSON() : undefined

      return {value, map}
    }
  )
