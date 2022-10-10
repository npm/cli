/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-factory-mdx-expression').Acorn} Acorn
 * @typedef {import('micromark-factory-mdx-expression').AcornOptions} AcornOptions
 */

/**
 * @typedef Options
 * @property {boolean} [addResult=false]
 * @property {Acorn} [acorn]
 * @property {AcornOptions} [acornOptions]
 */

import {codes} from 'micromark-util-symbol/codes.js'
import {jsxText} from './jsx-text.js'
import {jsxFlow} from './jsx-flow.js'

/**
 * @param {Options} [options]
 * @returns {Extension}
 */
export function mdxJsx(options = {}) {
  const acorn = options.acorn
  /** @type {AcornOptions|undefined} */
  let acornOptions

  if (acorn) {
    if (!acorn.parse || !acorn.parseExpressionAt) {
      throw new Error(
        'Expected a proper `acorn` instance passed in as `options.acorn`'
      )
    }

    acornOptions = Object.assign(
      {ecmaVersion: 2020, sourceType: 'module'},
      options.acornOptions,
      {locations: true}
    )
  } else if (options.acornOptions || options.addResult) {
    throw new Error('Expected an `acorn` instance passed in as `options.acorn`')
  }

  return {
    flow: {[codes.lessThan]: jsxFlow(acorn, acornOptions, options.addResult)},
    text: {[codes.lessThan]: jsxText(acorn, acornOptions, options.addResult)}
  }
}
