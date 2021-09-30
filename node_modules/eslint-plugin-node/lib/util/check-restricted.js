/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const { Minimatch } = require("minimatch")

/** @typedef {import("../util/import-target")} ImportTarget */
/**
 * @typedef {Object} DefinitionData
 * @property {string | string[]} name The name to disallow.
 * @property {string} [message] The custom message to show.
 */

/**
 * Check if matched or not.
 * @param {InstanceType<Minimatch>} matcher The matcher.
 * @param {boolean} absolute The flag that the matcher is for absolute paths.
 * @param {ImportTarget} importee The importee information.
 */
function match(matcher, absolute, { filePath, name }) {
    if (absolute) {
        return filePath != null && matcher.match(filePath)
    }
    return matcher.match(name)
}

/** Restriction. */
class Restriction {
    /**
     * Initialize this restriction.
     * @param {DefinitionData} def The definition of a restriction.
     */
    constructor({ name, message }) {
        const names = Array.isArray(name) ? name : [name]
        const matchers = names.map(raw => {
            const negate = raw[0] === "!" && raw[1] !== "("
            const pattern = negate ? raw.slice(1) : raw
            const absolute = path.isAbsolute(pattern)
            const matcher = new Minimatch(pattern, { dot: true })
            return { absolute, matcher, negate }
        })

        this.matchers = matchers
        this.message = message ? ` ${message}` : ""
    }

    /**
     * Check if a given importee is disallowed.
     * @param {ImportTarget} importee The importee to check.
     * @returns {boolean} `true` if the importee is disallowed.
     */
    match(importee) {
        return this.matchers.reduce(
            (ret, { absolute, matcher, negate }) =>
                negate
                    ? ret && !match(matcher, absolute, importee)
                    : ret || match(matcher, absolute, importee),
            false
        )
    }
}

/**
 * Create a restriction.
 * @param {string | DefinitionData} def A definition.
 * @returns {Restriction} Created restriction.
 */
function createRestriction(def) {
    if (typeof def === "string") {
        return new Restriction({ name: def })
    }
    return new Restriction(def)
}

/**
 * Create restrictions.
 * @param {(string | DefinitionData | GlobDefinition)[]} defs Definitions.
 * @returns {(Restriction | GlobRestriction)[]} Created restrictions.
 */
function createRestrictions(defs) {
    return (defs || []).map(createRestriction)
}

/**
 * Checks if given importees are disallowed or not.
 * @param {RuleContext} context - A context to report.
 * @param {ImportTarget[]} targets - A list of target information to check.
 * @returns {void}
 */
module.exports = function checkForRestriction(context, targets) {
    const restrictions = createRestrictions(context.options[0])

    for (const target of targets) {
        const restriction = restrictions.find(r => r.match(target))
        if (restriction) {
            context.report({
                node: target.node,
                messageId: "restricted",
                data: {
                    name: target.name,
                    customMessage: restriction.message,
                },
            })
        }
    }
}
