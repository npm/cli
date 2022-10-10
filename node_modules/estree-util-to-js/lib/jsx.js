/**
 * @typedef {import('estree-jsx').JSXAttribute} JSXAttribute
 * @typedef {import('estree-jsx').JSXClosingElement} JSXClosingElement
 * @typedef {import('estree-jsx').JSXClosingFragment} JSXClosingFragment
 * @typedef {import('estree-jsx').JSXElement} JSXElement
 * @typedef {import('estree-jsx').JSXEmptyExpression} JSXEmptyExpression
 * @typedef {import('estree-jsx').JSXExpressionContainer} JSXExpressionContainer
 * @typedef {import('estree-jsx').JSXFragment} JSXFragment
 * @typedef {import('estree-jsx').JSXIdentifier} JSXIdentifier
 * @typedef {import('estree-jsx').JSXMemberExpression} JSXMemberExpression
 * @typedef {import('estree-jsx').JSXNamespacedName} JSXNamespacedName
 * @typedef {import('estree-jsx').JSXOpeningElement} JSXOpeningElement
 * @typedef {import('estree-jsx').JSXOpeningFragment} JSXOpeningFragment
 * @typedef {import('estree-jsx').JSXSpreadAttribute} JSXSpreadAttribute
 * @typedef {import('estree-jsx').JSXText} JSXText
 * @typedef {import('./types.js').Handler} Handler
 */

export const jsx = {
  JSXAttribute,
  JSXClosingElement,
  JSXClosingFragment,
  JSXElement,
  JSXEmptyExpression,
  JSXExpressionContainer,
  JSXFragment,
  JSXIdentifier,
  JSXMemberExpression,
  JSXNamespacedName,
  JSXOpeningElement,
  JSXOpeningFragment,
  JSXSpreadAttribute,
  JSXText
}

/**
 * `attr`
 * `attr="something"`
 * `attr={1}`
 *
 * @type {Handler}
 * @param {JSXAttribute} node
 */
function JSXAttribute(node, state) {
  this[node.name.type](node.name, state)

  if (node.value !== undefined && node.value !== null) {
    state.write('=')

    // Encode double quotes in attribute values.
    if (node.value.type === 'Literal') {
      state.write(
        '"' + encodeJsx(String(node.value.value)).replace(/"/g, '&quot;') + '"',
        node
      )
    } else {
      this[node.value.type](node.value, state)
    }
  }
}

/**
 * `</div>`
 *
 * @type {Handler}
 * @param {JSXClosingElement} node
 */
function JSXClosingElement(node, state) {
  state.write('</')
  this[node.name.type](node.name, state)
  state.write('>')
}

/**
 * `</>`
 *
 * @type {Handler}
 * @param {JSXClosingFragment} node
 */
function JSXClosingFragment(node, state) {
  state.write('</>', node)
}

/**
 * `<div />`
 * `<div></div>`
 *
 * @type {Handler}
 * @param {JSXElement} node
 */
function JSXElement(node, state) {
  let index = -1

  this[node.openingElement.type](node.openingElement, state)

  if (node.children) {
    while (++index < node.children.length) {
      const child = node.children[index]

      // Supported in types but not by Acorn.
      /* c8 ignore next 3 */
      if (child.type === 'JSXSpreadChild') {
        throw new Error('JSX spread children are not supported')
      }

      this[child.type](child, state)
    }
  }

  if (node.closingElement) {
    this[node.closingElement.type](node.closingElement, state)
  }
}

/**
 * `{}` (always in a `JSXExpressionContainer`, which does the curlies)
 *
 * @type {Handler}
 */
function JSXEmptyExpression() {}

/**
 * `{expression}`
 *
 * @type {Handler}
 * @param {JSXExpressionContainer} node
 */
function JSXExpressionContainer(node, state) {
  state.write('{')
  this[node.expression.type](node.expression, state)
  state.write('}')
}

/**
 * `<></>`
 *
 * @type {Handler}
 * @param {JSXFragment} node
 */
function JSXFragment(node, state) {
  let index = -1

  this[node.openingFragment.type](node.openingFragment, state)

  if (node.children) {
    while (++index < node.children.length) {
      const child = node.children[index]

      // Supported in types but not by Acorn.
      /* c8 ignore next 3 */
      if (child.type === 'JSXSpreadChild') {
        throw new Error('JSX spread children are not supported')
      }

      this[child.type](child, state)
    }
  }

  this[node.closingFragment.type](node.closingFragment, state)
}

/**
 * `div`
 *
 * @type {Handler}
 * @param {JSXIdentifier} node
 */
function JSXIdentifier(node, state) {
  state.write(node.name, node)
}

/**
 * `member.expression`
 *
 * @type {Handler}
 * @param {JSXMemberExpression} node
 */
function JSXMemberExpression(node, state) {
  this[node.object.type](node.object, state)
  state.write('.')
  this[node.property.type](node.property, state)
}

/**
 * `ns:name`
 *
 * @type {Handler}
 * @param {JSXNamespacedName} node
 */
function JSXNamespacedName(node, state) {
  this[node.namespace.type](node.namespace, state)
  state.write(':')
  this[node.name.type](node.name, state)
}

/**
 * `<div>`
 *
 * @type {Handler}
 * @param {JSXOpeningElement} node
 */
function JSXOpeningElement(node, state) {
  let index = -1

  state.write('<')
  this[node.name.type](node.name, state)

  if (node.attributes) {
    while (++index < node.attributes.length) {
      state.write(' ')
      this[node.attributes[index].type](node.attributes[index], state)
    }
  }

  state.write(node.selfClosing ? ' />' : '>')
}

/**
 * `<>`
 *
 * @type {Handler}
 * @param {JSXOpeningFragment} node
 */
function JSXOpeningFragment(node, state) {
  state.write('<>', node)
}

/**
 * `{...argument}`
 *
 * @type {Handler}
 * @param {JSXSpreadAttribute} node
 */
function JSXSpreadAttribute(node, state) {
  state.write('{')
  // eslint-disable-next-line new-cap
  this.SpreadElement(node, state)
  state.write('}')
}

/**
 * `!`
 *
 * @type {Handler}
 * @param {JSXText} node
 */
function JSXText(node, state) {
  state.write(
    encodeJsx(node.value).replace(/[<>{}]/g, ($0) =>
      $0 === '<'
        ? '&lt;'
        : $0 === '>'
        ? '&gt;'
        : $0 === '{'
        ? '&#123;'
        : '&#125;'
    ),
    node
  )
}

/**
 * Make sure that character references don’t pop up.
 * For example, the text `&copy;` should stay that way, and not turn into `©`.
 * We could encode all `&` (easy but verbose) or look for actual valid
 * references (complex but cleanest output).
 * Looking for the 2nd character gives us a middle ground.
 * The `#` is for (decimal and hexadecimal) numeric references, the letters
 * are for the named references.
 *
 * @param {string} value
 * @returns {string}
 */
function encodeJsx(value) {
  return value.replace(/&(?=[#a-z])/gi, '&amp;')
}
