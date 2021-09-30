/**
 * @author Nicholas C. Zakas
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const { READ, ReferenceTracker, getStringIfConstant } = require("eslint-utils")

/**
 * Get the first char of the specified template element.
 * @param {TemplateLiteral} node The `TemplateLiteral` node to get.
 * @param {number} i The number of template elements to get first char.
 * @param {Set<Node>} sepNodes The nodes of `path.sep`.
 * @param {import("escope").Scope} globalScope The global scope object.
 * @param {string[]} outNextChars The array to collect chars.
 * @returns {void}
 */
function collectFirstCharsOfTemplateElement(
    node,
    i,
    sepNodes,
    globalScope,
    outNextChars
) {
    const element = node.quasis[i].value.cooked

    if (element == null) {
        return
    }
    if (element !== "") {
        outNextChars.push(element[0])
        return
    }
    if (node.expressions.length > i) {
        collectFirstChars(
            node.expressions[i],
            sepNodes,
            globalScope,
            outNextChars
        )
    }
}

/**
 * Get the first char of a given node.
 * @param {TemplateLiteral} node The `TemplateLiteral` node to get.
 * @param {Set<Node>} sepNodes The nodes of `path.sep`.
 * @param {import("escope").Scope} globalScope The global scope object.
 * @param {string[]} outNextChars The array to collect chars.
 * @returns {void}
 */
function collectFirstChars(node, sepNodes, globalScope, outNextChars) {
    switch (node.type) {
        case "AssignmentExpression":
            collectFirstChars(node.right, sepNodes, globalScope, outNextChars)
            break
        case "BinaryExpression":
            collectFirstChars(node.left, sepNodes, globalScope, outNextChars)
            break
        case "ConditionalExpression":
            collectFirstChars(
                node.consequent,
                sepNodes,
                globalScope,
                outNextChars
            )
            collectFirstChars(
                node.alternate,
                sepNodes,
                globalScope,
                outNextChars
            )
            break
        case "LogicalExpression":
            collectFirstChars(node.left, sepNodes, globalScope, outNextChars)
            collectFirstChars(node.right, sepNodes, globalScope, outNextChars)
            break
        case "SequenceExpression":
            collectFirstChars(
                node.expressions[node.expressions.length - 1],
                sepNodes,
                globalScope,
                outNextChars
            )
            break
        case "TemplateLiteral":
            collectFirstCharsOfTemplateElement(
                node,
                0,
                sepNodes,
                globalScope,
                outNextChars
            )
            break

        case "Identifier":
        case "MemberExpression":
            if (sepNodes.has(node)) {
                outNextChars.push(path.sep)
                break
            }
        // fallthrough
        default: {
            const str = getStringIfConstant(node, globalScope)
            if (str) {
                outNextChars.push(str[0])
            }
        }
    }
}

/**
 * Check if a char is a path separator or not.
 * @param {string} c The char to check.
 * @returns {boolean} `true` if the char is a path separator.
 */
function isPathSeparator(c) {
    return c === "/" || c === path.sep
}

/**
 * Check if the given Identifier node is followed by string concatenation with a
 * path separator.
 * @param {Identifier} node The `__dirname` or `__filename` node to check.
 * @param {Set<Node>} sepNodes The nodes of `path.sep`.
 * @param {import("escope").Scope} globalScope The global scope object.
 * @returns {boolean} `true` if the given Identifier node is followed by string
 * concatenation with a path separator.
 */
function isConcat(node, sepNodes, globalScope) {
    const parent = node.parent
    const nextChars = []

    if (
        parent.type === "BinaryExpression" &&
        parent.operator === "+" &&
        parent.left === node
    ) {
        collectFirstChars(
            parent.right,
            sepNodes,
            globalScope,
            /* out */ nextChars
        )
    } else if (parent.type === "TemplateLiteral") {
        collectFirstCharsOfTemplateElement(
            parent,
            parent.expressions.indexOf(node) + 1,
            sepNodes,
            globalScope,
            /* out */ nextChars
        )
    }

    return nextChars.some(isPathSeparator)
}

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description:
                "disallow string concatenation with `__dirname` and `__filename`",
            category: "Possible Errors",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-path-concat.md",
        },
        fixable: null,
        schema: [],
        messages: {
            usePathFunctions:
                "Use path.join() or path.resolve() instead of string concatenation.",
        },
    },

    create(context) {
        return {
            "Program:exit"() {
                const globalScope = context.getScope()
                const tracker = new ReferenceTracker(globalScope)
                const sepNodes = new Set()

                // Collect `paht.sep` references
                for (const { node } of tracker.iterateCjsReferences({
                    path: { sep: { [READ]: true } },
                })) {
                    sepNodes.add(node)
                }
                for (const { node } of tracker.iterateEsmReferences({
                    path: { sep: { [READ]: true } },
                })) {
                    sepNodes.add(node)
                }

                // Verify `__dirname` and `__filename`
                for (const { node } of tracker.iterateGlobalReferences({
                    __dirname: { [READ]: true },
                    __filename: { [READ]: true },
                })) {
                    if (isConcat(node, sepNodes, globalScope)) {
                        context.report({
                            node: node.parent,
                            messageId: "usePathFunctions",
                        })
                    }
                }
            },
        }
    },
}
