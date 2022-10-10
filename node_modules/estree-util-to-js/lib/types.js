/**
 * @typedef {import('estree-jsx').Node} Node
 * @typedef {import('estree-jsx').Program} Program
 * @typedef {Omit<import('astring').State, 'write'> & {write: ((code: string, node?: Node) => void)}} State
 * @typedef {Node['type']} NodeType
 * @typedef {{[K in NodeType]: Handler}} Generator
 * @typedef {Partial<Generator>} Handlers
 *
 * @callback Handler
 * @param {Generator} this
 * @param {any} node
 * @param {State} state
 * @returns {void}
 */

export {}
