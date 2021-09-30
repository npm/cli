/**
 * @author Christian Schulz
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const check = require("../util/check-restricted")
const visit = require("../util/visit-require")

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow specified modules when loaded by `require`",
            category: "Stylistic Issues",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-restricted-require.md",
        },
        fixable: null,
        schema: [
            {
                type: "array",
                items: {
                    anyOf: [
                        { type: "string" },
                        {
                            type: "object",
                            properties: {
                                name: {
                                    anyOf: [
                                        { type: "string" },
                                        {
                                            type: "array",
                                            items: { type: "string" },
                                            additionalItems: false,
                                        },
                                    ],
                                },
                                message: { type: "string" },
                            },
                            additionalProperties: false,
                            required: ["name"],
                        },
                    ],
                },
                additionalItems: false,
            },
        ],
        messages: {
            restricted:
                // eslint-disable-next-line @mysticatea/eslint-plugin/report-message-format
                "'{{name}}' module is restricted from being used.{{customMessage}}",
        },
    },

    create(context) {
        const opts = { includeCore: true }
        return visit(context, opts, targets => check(context, targets))
    },
}
