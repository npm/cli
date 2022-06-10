'use strict'

const { resolve } = require('path')
const { parser, arrayDelimiter } = require('@npmcli/query')
const localeCompare = require('@isaacs/string-locale-compare')('en')
const npa = require('npm-package-arg')
const minimatch = require('minimatch')
const semver = require('semver')

// handle results for parsed query asts, results are stored in a map that
// has a key that points to each ast selector node and stores the resulting
// array of arborist nodes as its value, that is essential to how we handle
// multiple query selectors, e.g: `#a, #b, #c` <- 3 diff ast selector nodes
class Results {
  #results = null
  #currentAstSelector = null

  constructor (rootAstNode) {
    this.#results = new Map()
    this.#currentAstSelector = rootAstNode.nodes[0]
  }

  set currentAstSelector (value) {
    this.#currentAstSelector = value
  }

  get currentResult () {
    return this.#results.get(this.#currentAstSelector)
  }

  set currentResult (value) {
    this.#results.set(this.#currentAstSelector, value)
  }

  // when collecting results to a root astNode, we traverse the list of
  // child selector nodes and collect all of their resulting arborist nodes
  // into a single/flat Set of items, this ensures we also deduplicate items
  collect(rootAstNode) {
    const acc = new Set()
    for (const n of rootAstNode.nodes) {
      for (const node of this.#results.get(n)) {
        acc.add(node)
      }
    }
    return acc
  }
}

const parentCache = new Map()
const retrieveNodesFromParsedAst = async ({
  initialItems,
  inventory,
  rootAstNode,
  targetNode
}) => {
  if (!rootAstNode.nodes) {
    return new Set()
  }

  const ArboristNode = targetNode.constructor

  let results = new Results(rootAstNode)
  let currentAstNode = rootAstNode
  let prevAstNode = null
  let pendingCombinator = null

  results.currentResult = initialItems

  // maps containing the logic to parse each of the supported css selectors
  const attributeOperatorsMap = new Map(Object.entries({
    '' ({ attribute, value, pkg }) { return Boolean(pkg[attribute]) },
    '=' ({ attribute, value, pkg }) { return String(pkg[attribute] || '') === value },
    '~=' ({ attribute, value, pkg }) {
      return (String(pkg[attribute] || '').match(/\w+/g) || []).includes(value)
    },
    '*=' ({ attribute, value, pkg }) {
      return String(pkg[attribute] || '').indexOf(value) > -1
    },
    '|=' ({ attribute, value, pkg }) {
      return String(pkg[attribute] || '').split('-')[0] === value
    },
    '^=' ({ attribute, value, pkg }) {
      return String(pkg[attribute] || '').startsWith(value)
    },
    '$=' ({ attribute, value, pkg }) {
      return String(pkg[attribute] || '').endsWith(value)
    },
  }))
  const classesMap = new Map(Object.entries({
    '.prod' (prevResults) {
      return Promise.resolve(prevResults.filter(node =>
        [...node.edgesIn].some(edge => edge.prod)))
    },
    '.dev' (prevResults) {
      return Promise.resolve(prevResults.filter(node =>
        [...node.edgesIn].some(edge => edge.dev)))
    },
    '.optional' (prevResults) {
      return Promise.resolve(prevResults.filter(node =>
        [...node.edgesIn].some(edge => edge.optional)))
    },
    '.peer' (prevResults) {
      return Promise.resolve(prevResults.filter(node =>
        [...node.edgesIn].some(edge => edge.peer)))
    },
    '.workspace' (prevResults) {
      return Promise.resolve(
        prevResults.filter(node => node.isWorkspace))
    },
    '.bundled' (prevResults) {
      return Promise.resolve(
        prevResults.filter(node => node.inBundle))
    },
  }))

  const hasParent = (node, compareNodes) => {
    if (parentCache.has(node) && parentCache.get(node).has(compareNodes)) {
      return Promise.resolve(true)
    }
    const parentFound = compareNodes.some(compareNode => {
      // follows logical parent for link anscestors
      return (node.isTop && node.resolveParent) === compareNode ||
      // follows edges-in to check if they match a possible parent
      [...node.edgesIn].some(edge =>
        edge && edge.from === compareNode)
    })

    if (parentFound) {
      if (!parentCache.has(node)) {
        parentCache.set(node, new Set())
      }
      parentCache.get(node).add(compareNodes)
    }

    return Promise.resolve(parentFound)
  }

  // checks if a given node is a descendant of any
  // of the nodes provided in the compare nodes array
  const hasAscendant = async (node, compareNodes) => {
    const hasP = await hasParent(node, compareNodes)
    if (hasP) {
      return true
    }

    const lookupEdgesIn = async (node) => {
      const edgesIn = [...node.edgesIn]
      const p = await Promise.all(
        edgesIn.map(edge =>
          edge && edge.from && hasAscendant(edge.from, compareNodes))
      )
      return edgesIn.some((edge, index) => p[index])
    }
    const ancestorFound = (node.isTop && node.resolveParent)
      ? await hasAscendant(node.resolveParent, compareNodes)
      : await lookupEdgesIn(node)

    return ancestorFound
  }

  const combinatorsMap = new Map(Object.entries({
    async '>' (prevResults, nextResults) {
      const p = await Promise.all(
        nextResults.map(i => hasParent(i, prevResults))
      )
      return nextResults.filter((nextItem, index) => p[index])
    },
    async ' ' (prevResults, nextResults) {
      const p = await Promise.all(
        nextResults.map(i => hasAscendant(i, prevResults))
      )
      return nextResults.filter((nextItem, index) => p[index])
    },
    async '~' (prevResults, nextResults) {
      const p = await Promise.all(nextResults.map(nextItem => {
        const seenNodes = new Set()
        const possibleParentNodes =
          prevResults
            .flatMap(node => {
              seenNodes.add(node)
              return [...node.edgesIn]
            })
            .map(edge => edge.from)
            .filter(Boolean)

        return !seenNodes.has(nextItem) &&
          hasParent(nextItem, [...possibleParentNodes])
      }))
      return nextResults.filter((nextItem, index) => p[index])
    },
  }))
  const pseudoMap = new Map(Object.entries({
    async ':attr' () {
      const initialItems = getInitialItems()
      const { lookupProperties, attributeMatcher } = currentAstNode

      const match = (attributeMatcher, obj) => {
        // in case the current object is an array
        // then we try to match every item in the array
        if (Array.isArray(obj[attributeMatcher.attribute])) {
          return obj[attributeMatcher.attribute].find((i, index) =>
            attributeOperatorsMap.get(attributeMatcher.operator)({
              attribute: index,
              value: attributeMatcher.value,
              pkg: obj[attributeMatcher.attribute],
            })
          )
        }

        return attributeOperatorsMap.get(attributeMatcher.operator)({
          attribute: attributeMatcher.attribute,
          value: attributeMatcher.value,
          pkg: obj,
        })
      }

      return initialItems.filter(node => {
        let objs = [node.package]
        for (const prop of lookupProperties) {
          // if an isArray symbol is found that means we'll need to iterate
          // over the previous found array to basically make sure we traverse
          // all its indexes testing for possible objects that may eventually
          // hold more keys specified in a selector
          if (prop === arrayDelimiter) {
            const newObjs = []
            for (const obj of objs) {
              if (Array.isArray(obj)) {
                obj.forEach((i, index) => {
                  newObjs.push(obj[index])
                })
              } else {
                newObjs.push(obj)
              }
            }
            objs = newObjs
            continue
          } else {
            // otherwise just maps all currently found objs
            // to the next prop from the lookup properties list,
            // filters out any empty key lookup
            objs = objs.map(obj => obj[prop]).filter(Boolean)
          }

          // in case there's no property found in the lookup
          // just filters that item out
          const noAttr = objs.every(obj => !obj)
          if (noAttr) {
            return false
          }
        }

        // if any of the potential object matches
        // that item should be in the final result
        return objs.some(obj => match(attributeMatcher, obj))
      })
    },
    async ':empty' () {
      return getInitialItems().filter(node => node.edgesOut.size === 0)
    },
    async ':extraneous' () {
      return getInitialItems().filter(node => node.extraneous)
    },
    async ':has' () {
      const initialItems = getInitialItems()
      const hasResults = new Map()
      for (const item of initialItems) {
        const res = await retrieveNodesFromParsedAst({
          initialItems: [item],
          inventory,
          rootAstNode: currentAstNode.nestedNode,
          targetNode: item,
        })
        hasResults.set(item, res)
      }
      return initialItems.filter(node => hasResults.get(node).size > 0)
    },
    async ':invalid' () {
      return getInitialItems().filter(node =>
        [...node.edgesIn].some(edge => edge.invalid))
    },
    async ':is' () {
      const initialItems = getInitialItems()
      const res = await retrieveNodesFromParsedAst({
        initialItems,
        inventory,
        rootAstNode: currentAstNode.nestedNode,
        targetNode: currentAstNode,
      })
      return [...res]
    },
    async ':link' () {
      return getInitialItems().filter(node => node.isLink || (node.isTop && !node.isRoot))
    },
    async ':missing' () {
      return inventory.reduce((res, node) => {
        for (const edge of node.edgesOut.values()) {
          if (edge.missing) {
            const pkg = { name: edge.name, version: edge.spec }
            res.push(new ArboristNode({ pkg }))
          }
        }
        return res
      }, [])
    },
    async ':not' () {
      const initialItems = getInitialItems()
      const res = await retrieveNodesFromParsedAst({
        initialItems,
        inventory: initialItems,
        rootAstNode: currentAstNode.nestedNode,
        targetNode: currentAstNode,
      })
      const internalSelector = new Set(res)
      return initialItems.filter(node =>
        !internalSelector.has(node))
    },
    async ':path' () {
      return getInitialItems().filter(node =>
        currentAstNode.pathValue
          ? minimatch(
            node.realpath,
            resolve(node.root.realpath, currentAstNode.pathValue)
          )
          : true
      )
    },
    async ':private' () {
      return getInitialItems().filter(node => node.package.private)
    },
    async ':root' () {
      return getInitialItems().filter(node => node === targetNode.root)
    },
    async ':scope' () {
      return getInitialItems().filter(node => node === targetNode)
    },
    async ':semver' () {
      return currentAstNode.semverValue
        ? getInitialItems().filter(node =>
          semver.satisfies(node.version, currentAstNode.semverValue))
        : getInitialItems()
    },
    async ':type' () {
      return currentAstNode.typeValue
        ? getInitialItems()
          .flatMap(node => [...node.edgesIn])
          .filter(edge => npa(`${edge.name}@${edge.spec}`).type === currentAstNode.typeValue)
          .map(edge => edge.to)
          .filter(Boolean)
        : getInitialItems()
    },
  }))

  // retrieves the initial items to which start the filtering / matching
  // for most of the different types of recognized ast nodes, e.g: class,
  // id, *, etc in different contexts we need to start with the current list
  // of filtered results, for example a query for `.workspace` actually
  // means the same as `*.workspace` so we want to start with the full
  // inventory if that's the first ast node we're reading but if it appears
  // in the middle of a query it should respect the previous filtered 
  // results, combinators are a special case in which we always want to
  // have the complete inventory list in order to use the left-hand side
  // ast node as a filter combined with the element on its right-hand side
  const getInitialItems = () => {
    const firstParsed = currentAstNode.parent.nodes[0] === currentAstNode &&
      currentAstNode.parent.parent.type === 'root'

    return firstParsed
      ? initialItems
      : currentAstNode.prev().type === 'combinator'
        ? inventory
        : results.currentResult
  }

  // combinators need information about previously filtered items along
  // with info of the items parsed / retrieved from the selector right
  // past the combinator, for this reason combinators are stored and
  // only ran as the last part of each selector logic
  const processPendingCombinator = async (prevResults, nextResults) => {
    if (pendingCombinator) {
      const res = await pendingCombinator(prevResults, nextResults)
      pendingCombinator = null
      return res
    }
    return nextResults
  }

  // below are the functions containing the logic to
  // parse each of the recognized css selectors types
  const attribute = async () => {
    const {
      qualifiedAttribute: attribute,
      operator = '',
      value,
    } = currentAstNode
    const prevResults = results.currentResult
    const nextResults = getInitialItems().filter(node => {
      // in case the current obj to check is an array, traverse
      // all its items and try to match attributes instead
      if (Array.isArray(node.package[attribute])) {
        return node.package[attribute].find((i, index) =>
          attributeOperatorsMap.get(operator)({
            attribute: index,
            value,
            pkg: node.package[attribute],
          })
        )
      }

      return attributeOperatorsMap.get(operator)({
        attribute,
        value,
        pkg: node.package,
      })})
    results.currentResult =
      await processPendingCombinator(prevResults, nextResults)
  }
  const classType = async () => {
    const classFn = classesMap.get(String(currentAstNode))
    if (!classFn) {
      throw Object.assign(
        new Error(`\`${String(currentAstNode)}\` is not a supported class.`),
        { code: 'EQUERYNOCLASS' }
      )
    }
    const prevResults = results.currentResult
    const nextResults = await classFn(getInitialItems())
    results.currentResult =
      await processPendingCombinator(prevResults, nextResults)
  }
  const combinator = async () => {
    pendingCombinator = combinatorsMap.get(String(currentAstNode))
  }
  const id = async () => {
    const spec = npa(currentAstNode.value)
    const prevResults = results.currentResult
    const nextResults = getInitialItems().filter(node =>
      (node.name === spec.name || node.package.name === spec.name) &&
      (semver.satisfies(node.version, spec.fetchSpec) || !spec.rawSpec))
    results.currentResult =
      await processPendingCombinator(prevResults, nextResults)
  }
  const pseudo = async () => {
    const pseudoFn = pseudoMap.get(currentAstNode.value)
    if (!pseudoFn) {
      throw Object.assign(
        new Error(`\`${currentAstNode.value
        }\` is not a supported pseudo-class.`),
        { code: 'EQUERYNOPSEUDOCLASS' }
      )
    }
    const prevResults = results.currentResult
    const nextResults = await pseudoFn()
    results.currentResult =
      await processPendingCombinator(prevResults, nextResults)
  }
  const selector = async () => {
    results.currentAstSelector = currentAstNode
    // starts a new array in which resulting items
    // can be stored for each given ast selector
    if (!results.currentResult) {
      results.currentResult = []
    }
  }
  const universal = async () => {
    const prevResults = results.currentResult
    const nextResults = getInitialItems()
    results.currentResult =
      await processPendingCombinator(prevResults, nextResults)
  }

  // maps each of the recognized css selectors
  // to a function that parses it
  const retrieveByType = new Map(Object.entries({
    attribute,
    'class': classType,
    combinator,
    id,
    pseudo,
    selector,
    universal,
  }))

  // walks through the parsed css query and update the
  // current result after parsing / executing each ast node
  const astNodeQueue = new Set()
  rootAstNode.walk((nextAstNode) => {
    astNodeQueue.add(nextAstNode)
  })

  for (const nextAstNode of astNodeQueue) {
    prevAstNode = currentAstNode
    currentAstNode = nextAstNode

    const updateResult =
      retrieveByType.get(currentAstNode.type)
    await updateResult()
  }

  return results.collect(rootAstNode)
}

const querySelectorAll = async (targetNode, query) => {
  const rootAstNode = parser(query)

  // results is going to be a Map in which its values are the
  // resulting items returned for each parsed css ast selector
  const inventory = [...targetNode.root.inventory.values()]
  const res = await retrieveNodesFromParsedAst({
    initialItems: inventory,
    inventory,
    rootAstNode,
    targetNode
  })

  // returns nodes ordered by realpath
  return [...res].sort((a, b) => localeCompare(a.realpath, b.realpath))
}

module.exports = querySelectorAll
