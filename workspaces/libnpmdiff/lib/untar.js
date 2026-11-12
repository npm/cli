const tar = require('tar')
const { Minimatch } = require('minimatch')

const normalizeMatch = str => str
  .replace(/\\+/g, '/')
  .replace(/^\.\/|^\./, '')

// returns a predicate telling whether a tarball path is included by the
// user-provided filters, compiling each glob only once
const buildFilter = (diffFiles) => {
  if (!diffFiles.length) {
    return () => true
  }

  const filters = diffFiles.map(normalizeMatch)
  const matchers = filters.map(pattern =>
    new Minimatch(
      `{package/,}${pattern}`,
      { matchBase: pattern.startsWith('*') }
    ))

  return path => {
    const normalizedPath = normalizeMatch(path)
    return matchers.some(m => m.match(normalizedPath)) ||
      // expands usage of simple path filters, e.g: lib or src/
      filters.some(f =>
        normalizedPath.startsWith(f) ||
        normalizedPath.startsWith(`package/${f}`))
  }
}

// files and refs are mutating params
// isIncluded, item and prefix are read-only options
const untar = ({ files, refs }, { isIncluded, item, prefix }) => {
  tar.list({
    filter: (path, entry) => {
      if (entry.type === 'File' && isIncluded(path)) {
        const key = path.replace(/^[^/]+\/?/, '')
        files.add(key)

        // should skip reading file when using --name-only option
        let content
        try {
          content = entry.concat()
        } catch (e) {
          /* istanbul ignore next */
          throw Object.assign(
            new Error('failed to read files'),
            { code: 'EDIFFUNTAR' }
          )
        }

        refs.set(`${prefix}${key}`, {
          content,
          mode: `100${entry.mode.toString(8)}`,
        })
        return true
      }
    },
  })
    .on('error', /* istanbul ignore next */ e => {
      throw e
    })
    .end(item)
}

const readTarballs = async (tarballs, opts = {}) => {
  const files = new Set()
  const refs = new Map()
  const arr = [].concat(tarballs)

  const isIncluded = buildFilter(opts.diffFiles || [])

  for (const i of arr) {
    untar({
      files,
      refs,
    }, {
      item: i.item,
      prefix: i.prefix,
      isIncluded,
    })
  }

  // await to read all content from included files
  // TODO this feels like it could be one in one pass instead of three (values, map, forEach)
  const allRefs = [...refs.values()]
  const contents = await Promise.all(allRefs.map(async ref => ref.content))

  contents.forEach((content, index) => {
    allRefs[index].content = content.toString('utf8')
  })

  return {
    files,
    refs,
  }
}

module.exports = readTarballs
