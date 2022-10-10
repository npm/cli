/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 * @typedef {import('micromark-util-types').State} State
 *
 * @typedef {import('micromark-util-events-to-acorn').Acorn} Acorn
 * @typedef {import('micromark-util-events-to-acorn').AcornOptions} AcornOptions
 */

/**
 * @typedef Options
 * @property {boolean} [addResult=false]
 * @property {Acorn} acorn
 * @property {AcornOptions} [acornOptions]
 */
import {blankLine} from 'micromark-core-commonmark'
import {markdownLineEnding, unicodeWhitespace} from 'micromark-util-character'
import {eventsToAcorn} from 'micromark-util-events-to-acorn'
import {positionFromEstree} from 'unist-util-position-from-estree'
import {VFileMessage} from 'vfile-message'
const nextBlankConstruct = {
  tokenize: tokenizeNextBlank,
  partial: true
}
const allowedAcornTypes = new Set([
  'ExportAllDeclaration',
  'ExportDefaultDeclaration',
  'ExportNamedDeclaration',
  'ImportDeclaration'
])
/**
 * @param {Options} options
 * @returs {Extension}
 */

export function mdxjsEsm(options) {
  const exportImportConstruct = {
    tokenize: tokenizeExportImport,
    concrete: true
  }

  if (!options || !options.acorn || !options.acorn.parse) {
    throw new Error('Expected an `acorn` instance passed in as `options.acorn`')
  }

  const acorn = options.acorn
  const acornOptions = Object.assign(
    {
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    options.acornOptions
  )
  return {
    flow: {
      [101]: exportImportConstruct,
      [105]: exportImportConstruct
    }
  }
  /** @type {Tokenizer} */

  function tokenizeExportImport(effects, ok, nok) {
    const self = this
    /** @type {string[]} */

    const definedModuleSpecifiers = // @ts-expect-error: hush
      self.parser.definedModuleSpecifiers || // @ts-expect-error: hush
      (self.parser.definedModuleSpecifiers = [])
    const eventStart = this.events.length + 1 // Add the main `mdxjsEsm` token

    let index = 0
    /** @type {string} */

    let buffer
    return self.interrupt ? nok : start
    /** @type {State} */

    function start(code) {
      // Do not support indent (the easiest check for containers).
      if (self.now().column > 1) return nok(code)
      buffer = code === 101 ? 'export' : 'import'
      effects.enter('mdxjsEsm')
      effects.enter('mdxjsEsmData')
      return keyword(code)
    }
    /** @type {State} */

    function keyword(code) {
      if (code === buffer.charCodeAt(index++)) {
        effects.consume(code)
        return index === buffer.length ? after : keyword
      }

      return nok(code)
    }
    /** @type {State} */

    function after(code) {
      if (unicodeWhitespace(code)) {
        effects.consume(code)
        return rest
      }

      return nok(code)
    }
    /** @type {State} */

    function rest(code) {
      if (code === null) {
        return atEndOfData(code)
      }

      if (markdownLineEnding(code)) {
        return effects.check(nextBlankConstruct, atEndOfData, atEol)(code)
      }

      effects.consume(code)
      return rest
    }
    /** @type {State} */

    function atEol(code) {
      effects.exit('mdxjsEsmData')
      return lineStart(code)
    }
    /** @type {State} */

    function lineStart(code) {
      if (markdownLineEnding(code)) {
        effects.enter('lineEnding')
        effects.consume(code)
        effects.exit('lineEnding')
        return lineStart
      }

      if (code === null) {
        return atEnd(code)
      }

      effects.enter('mdxjsEsmData')
      return rest(code)
    }
    /** @type {State} */

    function atEndOfData(code) {
      effects.exit('mdxjsEsmData')
      return atEnd(code)
    }
    /** @type {State} */

    function atEnd(code) {
      let index = -1
      const result = eventsToAcorn(self.events.slice(eventStart), {
        acorn,
        acornOptions,
        prefix:
          definedModuleSpecifiers.length > 0
            ? 'var ' + definedModuleSpecifiers.join(',') + '\n'
            : ''
      })

      if (code !== null && result.swallow) {
        return lineStart(code)
      }

      if (result.error) {
        throw new VFileMessage(
          'Could not parse import/exports with acorn: ' + String(result.error),
          {
            // @ts-expect-error: hush
            line: result.error.loc.line,
            // @ts-expect-error: hush
            column: result.error.loc.column + 1,
            // @ts-expect-error: hush
            offset: result.error.pos
          },
          'micromark-extension-mdxjs-esm:acorn'
        )
      }

      // Remove the `VariableDeclaration`
      if (definedModuleSpecifiers.length > 0) {
        result.estree.body.shift()
      }

      while (++index < result.estree.body.length) {
        const node = result.estree.body[index]

        if (!allowedAcornTypes.has(node.type)) {
          throw new VFileMessage(
            'Unexpected `' +
              node.type +
              '` in code: only import/exports are supported',
            positionFromEstree(node),
            'micromark-extension-mdxjs-esm:non-esm'
          )
        } // Otherwise, when we’re not interrupting (hacky, because `interrupt` is
        // used to parse containers and “sniff” if this is ESM), collect all the
        // local values that are imported.

        if (node.type === 'ImportDeclaration' && !self.interrupt) {
          let index = -1

          while (++index < node.specifiers.length) {
            definedModuleSpecifiers.push(node.specifiers[index].local.name)
          }
        }
      }

      Object.assign(
        effects.exit('mdxjsEsm'),
        options.addResult
          ? {
              estree: result.estree
            }
          : undefined
      )
      return ok(code)
    }
  }
}
/** @type {Tokenizer} */

function tokenizeNextBlank(effects, ok, nok) {
  return start
  /** @type {State} */

  function start(code) {
    effects.exit('mdxjsEsmData')
    effects.enter('lineEndingBlank')
    effects.consume(code)
    effects.exit('lineEndingBlank')
    return effects.attempt(blankLine, ok, nok)
  }
}
