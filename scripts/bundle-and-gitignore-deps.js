const Arborist = require('@npmcli/arborist')
const { resolve } = require('path')
const ignore = resolve(__dirname, '../node_modules/.gitignore')
const { writeFileSync } = require('fs')
const pj = resolve(__dirname, '../package.json')
const pkg = require(pj)
const bundle = []
const arb = new Arborist({ path: resolve(__dirname, '..') })
const shouldIgnore = []

arb.loadVirtual().then(tree => {
  for (const node of tree.children.values()) {
    const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)
    const nonProdWorkspace =
      node.isWorkspace && !(has(tree.package.dependencies, node.name))
    if (node.dev || nonProdWorkspace) {
      console.error('ignore', node.name)
      shouldIgnore.push(node.name)
    } else if (tree.edgesOut.has(node.name)) {
      console.error('BUNDLE', node.name)
      bundle.push(node.name)
    }
  }
  pkg.bundleDependencies = bundle.sort((a, b) => a.localeCompare(b, 'en'))

  const ignores = shouldIgnore.sort((a, b) => a.localeCompare(b, 'en'))
    .map(i => `/${i}`)
    .join('\n')
  const ignoreData = `# Automatically generated to ignore dev deps
/.package-lock.json
package-lock.json
CHANGELOG*
changelog*
README*
readme*
__pycache__
.editorconfig
.idea/
.npmignore
.eslintrc*
.travis*
.github
.jscsrc
.nycrc
.istanbul*
.eslintignore
.jshintrc*
.prettierrc*
.jscs.json
.dir-locals*
.coveralls*
.babelrc*
.nyc_output
.gitkeep

${ignores}
`
  writeFileSync(ignore, ignoreData)
  writeFileSync(pj, JSON.stringify(pkg, 0, 2) + '\n')
})
