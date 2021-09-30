/**
 * @author Vignesh Anand
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow the use of `process.env`",
            category: "Stylistic Issues",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-process-env.md",
        },
        fixable: null,
        schema: [],
        messages: {
            unexpectedProcessEnv: "Unexpected use of process.env.",
        },
    },

    create(context) {
        return {
            MemberExpression(node) {
                const objectName = node.object.name
                const propertyName = node.property.name

                if (
                    objectName === "process" &&
                    !node.computed &&
                    propertyName &&
                    propertyName === "env"
                ) {
                    context.report({ node, messageId: "unexpectedProcessEnv" })
                }
            },
        }
    },
}
