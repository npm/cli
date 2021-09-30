/**
 * @author Matt DuVall<http://mattduvall.com/>
 * See LICENSE file in root directory for full license.
 */
"use strict"

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow synchronous methods",
            category: "Stylistic Issues",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-sync.md",
        },
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    allowAtRootLevel: {
                        type: "boolean",
                        default: false,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            noSync: "Unexpected sync method: '{{propertyName}}'.",
        },
    },

    create(context) {
        const selector =
            context.options[0] && context.options[0].allowAtRootLevel
                ? ":function MemberExpression[property.name=/.*Sync$/]"
                : "MemberExpression[property.name=/.*Sync$/]"

        return {
            [selector](node) {
                context.report({
                    node,
                    messageId: "noSync",
                    data: {
                        propertyName: node.property.name,
                    },
                })
            },
        }
    },
}
