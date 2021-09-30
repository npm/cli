/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { Range, lt, major } = require("semver") //eslint-disable-line no-unused-vars
const { ReferenceTracker } = require("eslint-utils")
const getConfiguredNodeVersion = require("./get-configured-node-version")
const getSemverRange = require("./get-semver-range")

/**
 * @typedef {Object} SupportInfo
 * @property {string | null} supported The stably supported version. If `null` is present, it hasn't been supported yet.
 * @property {string[]} [backported] The backported versions.
 * @property {string} [experimental] The added version as experimental.
 */

/**
 * Parses the options.
 * @param {RuleContext} context The rule context.
 * @returns {{version:Range,ignores:Set<string>}} Parsed value.
 */
function parseOptions(context) {
    const raw = context.options[0] || {}
    const filePath = context.getFilename()
    const version = getConfiguredNodeVersion(raw.version, filePath)
    const ignores = new Set(raw.ignores || [])

    return Object.freeze({ version, ignores })
}

/**
 * Check if it has been supported.
 * @param {SupportInfo} info The support info.
 * @param {Range} configured The configured version range.
 */
function isSupported({ backported, supported }, configured) {
    if (
        backported &&
        backported.length >= 2 &&
        !backported.every((v, i) => i === 0 || lt(backported[i - 1], v))
    ) {
        throw new Error("Invalid BackportConfiguration")
    }

    if (supported == null) {
        return false
    }
    if (backported == null || backported.length === 0) {
        return !configured.intersects(getSemverRange(`<${supported}`))
    }

    return !configured.intersects(
        getSemverRange(
            [...backported, supported]
                .map((v, i) => (i === 0 ? `<${v}` : `>=${major(v)}.0.0 <${v}`))
                .join(" || ")
        )
    )
}

/**
 * Get the formatted text of a given supported version.
 * @param {SupportInfo} info The support info.
 */
function supportedVersionToString({ backported, supported }) {
    if (supported == null) {
        return "(none yet)"
    }
    if (backported == null || backported.length === 0) {
        return supported
    }
    return `${supported} (backported: ^${backported.join(", ^")})`
}

/**
 * Verify the code to report unsupported APIs.
 * @param {RuleContext} context The rule context.
 * @param {{modules:object,globals:object}} trackMap The map for APIs to report.
 * @returns {void}
 */
module.exports = function checkUnsupportedBuiltins(context, trackMap) {
    const options = parseOptions(context)
    const tracker = new ReferenceTracker(context.getScope(), { mode: "legacy" })
    const references = [
        ...tracker.iterateCjsReferences(trackMap.modules || {}),
        ...tracker.iterateEsmReferences(trackMap.modules || {}),
        ...tracker.iterateGlobalReferences(trackMap.globals || {}),
    ]

    for (const { node, path, info } of references) {
        const name = path.join(".")
        const supported = isSupported(info, options.version)

        if (!supported && !options.ignores.has(name)) {
            context.report({
                node,
                messageId: "unsupported",
                data: {
                    name,
                    supported: supportedVersionToString(info),
                    version: options.version.raw,
                },
            })
        }
    }
}
