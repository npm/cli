// Borrowed from here:
// https://github.com/colonyamerican/eslint-plugin-cah/issues/3

'use strict'

const getDocsUrl = require('./lib/get-docs-url')

function isDeclared(scope, ref) {
  return scope.variables.some((variable) => {
    if (variable.name !== ref.identifier.name) {
      return false
    }

    // Presumably can't pass this since the implicit `Promise` global
    //  being checked here would always lack `defs`
    // istanbul ignore else
    if (!variable.defs || !variable.defs.length) {
      return false
    }

    // istanbul ignore next
    return true
  })
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: getDocsUrl('no-native'),
    },
    messages: {
      name: '"{{name}}" is not defined.',
    },
  },
  create(context) {
    /**
     * Checks for and reports reassigned constants
     *
     * @param {Scope} scope - an escope Scope object
     * @returns {void}
     * @private
     */
    return {
      'Program:exit'() {
        const scope = context.getScope()

        scope.implicit.left.forEach((ref) => {
          if (ref.identifier.name !== 'Promise') {
            return
          }

          // istanbul ignore else
          if (!isDeclared(scope, ref)) {
            context.report({
              node: ref.identifier,
              messageId: 'name',
              data: { name: ref.identifier.name },
            })
          }
        })
      },
    }
  },
}
