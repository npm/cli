/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-extension-mdx-expression').Options} Options
 */

import {Parser} from 'acorn'
// @ts-expect-error: untyped
import acornJsx from 'acorn-jsx'
import {combineExtensions} from 'micromark-util-combine-extensions'
import {mdxExpression} from 'micromark-extension-mdx-expression'
import {mdxJsx} from 'micromark-extension-mdx-jsx'
import {mdxMd} from 'micromark-extension-mdx-md'
import {mdxjsEsm} from 'micromark-extension-mdxjs-esm'

/**
 * @param {Options} [options]
 * @returns {Extension}
 */
export function mdxjs(options) {
  const settings = Object.assign(
    {
      acorn: Parser.extend(acornJsx()),
      acornOptions: {ecmaVersion: 2020, sourceType: 'module'},
      addResult: true
    },
    options
  )

  return combineExtensions([
    mdxjsEsm(settings),
    mdxExpression(settings),
    mdxJsx(settings),
    mdxMd
  ])
}
