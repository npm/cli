const { join, dirname, basename, extname, sep, posix } = require('path')
const fs = require('fs/promises')
const ignoreWalk = require('ignore-walk')
const yaml = require('yaml')
const parseFrontMatter = require('front-matter')

const checkNav = require('./check-nav.js')
const { DOC_EXT, ...transform } = require('./index.js')

const mkDirs = async (paths) => {
  const uniqDirs = [...new Set(paths.map((p) => dirname(p)))]
  return Promise.all(uniqDirs.map((d) => fs.mkdir(d, { recursive: true })))
}

const rmAll = (...dirs) => Promise.all(dirs.map((d) => fs.rm(d, { recursive: true, force: true })))
const readDocs = (path) => ignoreWalk({ path }).then(ps => ps.filter(p => extname(p) === DOC_EXT))
const readMd = (path) => fs.readFile(path, 'utf-8').then(parseFrontMatter)
const readHtml = (path) => fs.readFile(path, 'utf-8')
const readYaml = (path) => fs.readFile(path, 'utf-8').then(yaml.parse)
const makeTransforms = (...args) => (src, trs) => trs.reduce((acc, tr) => tr(acc, ...args), src)

const pAll = async (obj) => {
  const entries = Object.entries(obj)
  const results = await Promise.all(entries.map(e => e[1]))
  return results.reduce((acc, res, index) => {
    acc[entries[index][0]] = res
    return acc
  }, {})
}

const run = async ({ content, template, nav, man, html, md }) => {
  await rmAll(man, html, md)
  const [contentPaths, navFile, options] = await Promise.all([
    readDocs(content),
    readYaml(nav),
    pAll({
      template: readHtml(template),
      // these deps are esm only so we have to import them once we
      // are inside our main async function
      unified: import('unified').then(r => r.unified),
      remarkParse: import('remark-parse').then(r => r.default),
      remarkGfm: import('remark-gfm').then(r => r.default),
      remarkRehype: import('remark-rehype').then(r => r.default),
      rehypeStringify: import('rehype-stringify').then(r => r.default),
      remarkMan: import('remark-man').then(r => r.default),
    }),
  ])

  const sources = await Promise.all(contentPaths.map(async (childPath) => {
    const name = basename(childPath, DOC_EXT)
    const fullPath = join(content, childPath)
    const fullName = join(dirname(childPath), name).split(sep).join(posix.sep)

    const { body, attributes: data, frontmatter } = await readMd(fullPath)

    return {
      body,
      data,
      frontmatter,
      name,
      fullName,
      childPath,
    }
  }))

  const entriesByType = sources.reduce((acc, {
    body,
    data,
    frontmatter,
    name,
    childPath,
    fullName,
  }) => {
    const applyTransforms = makeTransforms({
      path: childPath,
      data: {
        ...data,
        github_repo: 'npm/cli',
        github_branch: 'latest',
        github_path: 'docs/content',
      },
      frontmatter,
      ...options,
    })

    const transformedSrc = applyTransforms(body, [
      transform.version,
      ...(fullName.startsWith('commands/')
        ? [transform.usage, transform.params]
        : []),
      ...(fullName === 'using-npm/config'
        ? [transform.shorthands, transform.config]
        : []),
    ])

    if (data.section) {
      const manSrc = applyTransforms(transformedSrc, [
        transform.helpLinks,
        transform.man,
      ])
      const manPaths = [
        name,
        fullName === 'configuring-npm/package-json' && 'npm-json',
        fullName === 'configuring-npm/folders' && 'npm-global',
      ].filter(Boolean).map(p => applyTransforms(p, [transform.manPath]))

      acc.man.push(...manPaths.map((manPath) => ({
        path: manPath,
        fullPath: join(man, manPath),
        src: manSrc,
      })))
    }

    acc.html.push({
      path: `${fullName}.html`,
      fullPath: join(html, `${fullName}.html`),
      src: applyTransforms(transformedSrc, [transform.html]),
    })

    acc.md.push({
      path: childPath,
      fullPath: join(md, childPath),
      src: applyTransforms(transformedSrc, [transform.md]),
    })
    return acc
  }, { man: [], html: [], md: [] })

  const docEntries = Object.values(entriesByType).flat()
  await mkDirs(docEntries.map(({ fullPath }) => fullPath))
  await Promise.all(docEntries.map(({ fullPath, src }) => fs.writeFile(fullPath, src, 'utf-8')))

  checkNav(navFile, entriesByType.md.map(({ path }) => path), DOC_EXT)

  return docEntries
}

module.exports = run
