/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { READ, ReferenceTracker } = require("eslint-utils")

module.exports = {
    meta: {
        docs: {
            description: "disallow the `Object.getPrototypeOf` method.",
            category: "ES5",
            recommended: false,
            url:
                "http://mysticatea.github.io/eslint-plugin-es/rules/no-object-getprototypeof.html",
        },
        fixable: null,
        messages: {
            forbidden: "ES5 '{{name}}' method is forbidden.",
        },
        schema: [],
        type: "problem",
    },
    create(context) {
        return {
            "Program:exit"() {
                const tracker = new ReferenceTracker(context.getScope())
                for (const { node, path } of tracker.iterateGlobalReferences({
                    Object: {
                        getPrototypeOf: { [READ]: true },
                    },
                })) {
                    context.report({
                        node,
                        messageId: "forbidden",
                        data: { name: path.join(".") },
                    })
                }
            },
        }
    },
}
