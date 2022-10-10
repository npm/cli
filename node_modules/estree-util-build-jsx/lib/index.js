/**
 * @typedef {import('estree-jsx').Node} Node
 * @typedef {import('estree-jsx').Comment} Comment
 * @typedef {import('estree-jsx').Expression} Expression
 * @typedef {import('estree-jsx').Pattern} Pattern
 * @typedef {import('estree-jsx').ObjectExpression} ObjectExpression
 * @typedef {import('estree-jsx').Property} Property
 * @typedef {import('estree-jsx').ImportSpecifier} ImportSpecifier
 * @typedef {import('estree-jsx').SpreadElement} SpreadElement
 * @typedef {import('estree-jsx').MemberExpression} MemberExpression
 * @typedef {import('estree-jsx').Literal} Literal
 * @typedef {import('estree-jsx').Identifier} Identifier
 * @typedef {import('estree-jsx').JSXElement} JSXElement
 * @typedef {import('estree-jsx').JSXFragment} JSXFragment
 * @typedef {import('estree-jsx').JSXText} JSXText
 * @typedef {import('estree-jsx').JSXExpressionContainer} JSXExpressionContainer
 * @typedef {import('estree-jsx').JSXEmptyExpression} JSXEmptyExpression
 * @typedef {import('estree-jsx').JSXSpreadChild} JSXSpreadChild
 * @typedef {import('estree-jsx').JSXAttribute} JSXAttribute
 * @typedef {import('estree-jsx').JSXSpreadAttribute} JSXSpreadAttribute
 * @typedef {import('estree-jsx').JSXMemberExpression} JSXMemberExpression
 * @typedef {import('estree-jsx').JSXNamespacedName} JSXNamespacedName
 * @typedef {import('estree-jsx').JSXIdentifier} JSXIdentifier
 *
 * @typedef {import('estree-walker').SyncHandler} SyncHandler
 *
 * @typedef Options
 * @property {'automatic'|'classic'} [runtime='classic']
 * @property {string} [importSource='react']
 * @property {string} [pragma='React.createElement']
 * @property {string} [pragmaFrag='React.Fragment']
 * @property {boolean} [development=false]
 * @property {string} [filePath]
 *
 * @typedef Annotations
 * @property {'automatic'|'classic'} [jsxRuntime]
 * @property {string} [jsx]
 * @property {string} [jsxFrag]
 * @property {string} [jsxImportSource]
 */

import {walk} from 'estree-walker'
import {name as isIdentifierName} from 'estree-util-is-identifier-name'

const regex = /@(jsx|jsxFrag|jsxImportSource|jsxRuntime)\s+(\S+)/g

/**
 * @template {Node} T
 * @param {T} tree
 * @param {Options} [options={}]
 * @returns {T}
 */
export function buildJsx(tree, options = {}) {
  let automatic = options.runtime === 'automatic'
  /** @type {Annotations} */
  const annotations = {}
  /** @type {{fragment?: boolean, jsx?: boolean, jsxs?: boolean, jsxDEV?: boolean}} */
  const imports = {}

  walk(tree, {
    // @ts-expect-error: types are wrong.
    enter(/** @type {Node} */ node) {
      if (node.type === 'Program') {
        const comments = node.comments || []
        let index = -1

        while (++index < comments.length) {
          regex.lastIndex = 0

          let match = regex.exec(comments[index].value)

          while (match) {
            // @ts-expect-error: indexable.
            annotations[match[1]] = match[2]
            match = regex.exec(comments[index].value)
          }
        }

        if (annotations.jsxRuntime) {
          if (annotations.jsxRuntime === 'automatic') {
            automatic = true

            if (annotations.jsx) {
              throw new Error('Unexpected `@jsx` pragma w/ automatic runtime')
            }

            if (annotations.jsxFrag) {
              throw new Error(
                'Unexpected `@jsxFrag` pragma w/ automatic runtime'
              )
            }
          } else if (annotations.jsxRuntime === 'classic') {
            automatic = false

            if (annotations.jsxImportSource) {
              throw new Error(
                'Unexpected `@jsxImportSource` w/ classic runtime'
              )
            }
          } else {
            throw new Error(
              'Unexpected `jsxRuntime` `' +
                annotations.jsxRuntime +
                '`, expected `automatic` or `classic`'
            )
          }
        }
      }
    },
    // @ts-expect-error: types are wrong.
    // eslint-disable-next-line complexity
    leave(/** @type {Node} */ node) {
      if (node.type === 'Program') {
        /** @type {Array<ImportSpecifier>} */
        const specifiers = []

        if (imports.fragment) {
          specifiers.push({
            type: 'ImportSpecifier',
            imported: {type: 'Identifier', name: 'Fragment'},
            local: {type: 'Identifier', name: '_Fragment'}
          })
        }

        if (imports.jsx) {
          specifiers.push({
            type: 'ImportSpecifier',
            imported: {type: 'Identifier', name: 'jsx'},
            local: {type: 'Identifier', name: '_jsx'}
          })
        }

        if (imports.jsxs) {
          specifiers.push({
            type: 'ImportSpecifier',
            imported: {type: 'Identifier', name: 'jsxs'},
            local: {type: 'Identifier', name: '_jsxs'}
          })
        }

        if (imports.jsxDEV) {
          specifiers.push({
            type: 'ImportSpecifier',
            imported: {type: 'Identifier', name: 'jsxDEV'},
            local: {type: 'Identifier', name: '_jsxDEV'}
          })
        }

        if (specifiers.length > 0) {
          node.body.unshift({
            type: 'ImportDeclaration',
            specifiers,
            source: {
              type: 'Literal',
              value:
                (annotations.jsxImportSource ||
                  options.importSource ||
                  'react') +
                (options.development ? '/jsx-dev-runtime' : '/jsx-runtime')
            }
          })
        }
      }

      if (node.type !== 'JSXElement' && node.type !== 'JSXFragment') {
        return
      }

      /** @type {Array<Expression>} */
      const children = []
      let index = -1

      // Figure out `children`.
      while (++index < node.children.length) {
        const child = node.children[index]

        if (child.type === 'JSXExpressionContainer') {
          // Ignore empty expressions.
          if (child.expression.type !== 'JSXEmptyExpression') {
            children.push(child.expression)
          }
        } else if (child.type === 'JSXText') {
          const value = child.value
            // Replace tabs w/ spaces.
            .replace(/\t/g, ' ')
            // Use line feeds, drop spaces around them.
            .replace(/ *(\r?\n|\r) */g, '\n')
            // Collapse multiple line feeds.
            .replace(/\n+/g, '\n')
            // Drop final line feeds.
            .replace(/\n+$/, '')
            // Replace line feeds with spaces.
            .replace(/\n/g, ' ')

          // Ignore collapsible text.
          if (value) {
            children.push(create(child, {type: 'Literal', value}))
          }
        } else {
          // @ts-expect-error JSX{Element,Fragment} have already been compiled,
          // and `JSXSpreadChild` is not supported in Babel either, so ignore
          // it.
          children.push(child)
        }
      }

      /** @type {MemberExpression|Literal|Identifier} */
      let name
      /** @type {Array<Property>} */
      let fields = []
      /** @type {Array<Expression>} */
      const objects = []
      /** @type {Array<Expression|SpreadElement>} */
      let parameters = []
      /** @type {Expression|undefined} */
      let key

      // Do the stuff needed for elements.
      if (node.type === 'JSXElement') {
        name = toIdentifier(node.openingElement.name)

        // If the name could be an identifier, but start with a lowercase letter,
        // it’s not a component.
        if (name.type === 'Identifier' && /^[a-z]/.test(name.name)) {
          name = create(name, {type: 'Literal', value: name.name})
        }

        /** @type {boolean|undefined} */
        let spread
        const attributes = node.openingElement.attributes
        let index = -1

        // Place props in the right order, because we might have duplicates
        // in them and what’s spread in.
        while (++index < attributes.length) {
          const attribute = attributes[index]

          if (attribute.type === 'JSXSpreadAttribute') {
            if (fields.length > 0) {
              objects.push({type: 'ObjectExpression', properties: fields})
              fields = []
            }

            objects.push(attribute.argument)
            spread = true
          } else {
            const prop = toProperty(attribute)

            if (
              automatic &&
              prop.key.type === 'Identifier' &&
              prop.key.name === 'key'
            ) {
              if (spread) {
                throw new Error(
                  'Expected `key` to come before any spread expressions'
                )
              }

              // @ts-expect-error I can’t see object patterns being used as
              // attribute values? 🤷‍♂️
              key = prop.value
            } else {
              fields.push(prop)
            }
          }
        }
      }
      // …and fragments.
      else if (automatic) {
        imports.fragment = true
        name = {type: 'Identifier', name: '_Fragment'}
      } else {
        name = toMemberExpression(
          annotations.jsxFrag || options.pragmaFrag || 'React.Fragment'
        )
      }

      if (automatic) {
        if (children.length > 0) {
          fields.push({
            type: 'Property',
            key: {type: 'Identifier', name: 'children'},
            value:
              children.length > 1
                ? {type: 'ArrayExpression', elements: children}
                : children[0],
            kind: 'init',
            method: false,
            shorthand: false,
            computed: false
          })
        }
      } else {
        parameters = children
      }

      if (fields.length > 0) {
        objects.push({type: 'ObjectExpression', properties: fields})
      }

      /** @type {Expression|undefined} */
      let props
      /** @type {MemberExpression|Literal|Identifier} */
      let callee

      if (objects.length > 1) {
        // Don’t mutate the first object, shallow clone instead.
        if (objects[0].type !== 'ObjectExpression') {
          objects.unshift({type: 'ObjectExpression', properties: []})
        }

        props = {
          type: 'CallExpression',
          callee: toMemberExpression('Object.assign'),
          arguments: objects,
          optional: false
        }
      } else if (objects.length > 0) {
        props = objects[0]
      }

      if (automatic) {
        parameters.push(props || {type: 'ObjectExpression', properties: []})

        if (key) {
          parameters.push(key)
        } else if (options.development) {
          parameters.push({type: 'Identifier', name: 'undefined'})
        }

        const isStaticChildren = children.length > 1

        if (options.development) {
          imports.jsxDEV = true
          callee = {
            type: 'Identifier',
            name: '_jsxDEV'
          }
          parameters.push({type: 'Literal', value: isStaticChildren})

          /** @type {ObjectExpression} */
          const source = {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'Property',
                method: false,
                shorthand: false,
                computed: false,
                kind: 'init',
                key: {type: 'Identifier', name: 'fileName'},
                value: {
                  type: 'Literal',
                  value: options.filePath || '<source.js>'
                }
              }
            ]
          }

          if (node.loc) {
            source.properties.push(
              {
                type: 'Property',
                method: false,
                shorthand: false,
                computed: false,
                kind: 'init',
                key: {type: 'Identifier', name: 'lineNumber'},
                value: {type: 'Literal', value: node.loc.start.line}
              },
              {
                type: 'Property',
                method: false,
                shorthand: false,
                computed: false,
                kind: 'init',
                key: {type: 'Identifier', name: 'columnNumber'},
                value: {type: 'Literal', value: node.loc.start.column + 1}
              }
            )
          }

          parameters.push(source, {type: 'ThisExpression'})
        } else if (isStaticChildren) {
          imports.jsxs = true
          callee = {type: 'Identifier', name: '_jsxs'}
        } else {
          imports.jsx = true
          callee = {type: 'Identifier', name: '_jsx'}
        }
      }
      // Classic.
      else {
        // There are props or children.
        if (props || parameters.length > 0) {
          parameters.unshift(props || {type: 'Literal', value: null})
        }

        callee = toMemberExpression(
          annotations.jsx || options.pragma || 'React.createElement'
        )
      }

      parameters.unshift(name)

      this.replace(
        create(node, {
          type: 'CallExpression',
          callee,
          arguments: parameters,
          optional: false
        })
      )
    }
  })

  return tree
}

/**
 * @param {JSXAttribute} node
 * @returns {Property}
 */
function toProperty(node) {
  /** @type {Expression} */
  let value

  if (node.value) {
    if (node.value.type === 'JSXExpressionContainer') {
      // @ts-expect-error `JSXEmptyExpression` is not allowed in props.
      value = node.value.expression
    }
    // Literal or call expression.
    else {
      // @ts-expect-error: JSX{Element,Fragment} are already compiled to
      // `CallExpression`.
      value = node.value
      // @ts-expect-error Remove `raw` so we don’t get character references in
      // strings.
      delete value.raw
    }
  }
  // Boolean prop.
  else {
    value = {type: 'Literal', value: true}
  }

  return create(node, {
    type: 'Property',
    key: toIdentifier(node.name),
    value,
    kind: 'init',
    method: false,
    shorthand: false,
    computed: false
  })
}

/**
 * @param {JSXMemberExpression|JSXNamespacedName|JSXIdentifier} node
 * @returns {MemberExpression|Identifier|Literal}
 */
function toIdentifier(node) {
  /** @type {MemberExpression|Identifier|Literal} */
  let replace

  if (node.type === 'JSXMemberExpression') {
    // `property` is always a `JSXIdentifier`, but it could be something that
    // isn’t an ES identifier name.
    const id = toIdentifier(node.property)
    replace = {
      type: 'MemberExpression',
      object: toIdentifier(node.object),
      property: id,
      computed: id.type === 'Literal',
      optional: false
    }
  } else if (node.type === 'JSXNamespacedName') {
    replace = {
      type: 'Literal',
      value: node.namespace.name + ':' + node.name.name
    }
  }
  // Must be `JSXIdentifier`.
  else {
    replace = isIdentifierName(node.name)
      ? {type: 'Identifier', name: node.name}
      : {type: 'Literal', value: node.name}
  }

  return create(node, replace)
}

/**
 * @param {string} id
 * @returns {Identifier|Literal|MemberExpression}
 */
function toMemberExpression(id) {
  const identifiers = id.split('.')
  let index = -1
  /** @type {Identifier|Literal|MemberExpression|undefined} */
  let result

  while (++index < identifiers.length) {
    /** @type {Identifier|Literal} */
    const prop = isIdentifierName(identifiers[index])
      ? {type: 'Identifier', name: identifiers[index]}
      : {type: 'Literal', value: identifiers[index]}
    result = result
      ? {
          type: 'MemberExpression',
          object: result,
          property: prop,
          computed: Boolean(index && prop.type === 'Literal'),
          optional: false
        }
      : prop
  }

  // @ts-expect-error: always a result.
  return result
}

/**
 * @template {Node} T
 * @param {Node} from
 * @param {T} node
 * @returns {T}
 */
function create(from, node) {
  const fields = ['start', 'end', 'loc', 'range', 'comments']
  let index = -1

  while (++index < fields.length) {
    const field = fields[index]
    if (field in from) {
      // @ts-expect-error: indexable.
      node[field] = from[field]
    }
  }

  return node
}
