const { join, dirname, basename, extname, sep, posix } = require('path')
const fs = require('fs/promises')
const ignoreWalk = require('ignore-walk')
const yaml = require('yaml')
const parseFrontMatter = require('front-matter')

const checkNav = require('./check-nav.js')
const { DOC_EXT, ...transform } = require('./index.js')

// Helper to check if a directory exists
const dirExists = async (path) => {
  try {
    const stat = await fs.stat(path)
    return stat.isDirectory()
  } catch {
    return false
  }
}

// Helper to read docs from a section directory
const readSectionDocs = async (contentPath, section, orderedUrls) => {
  const sectionPath = join(contentPath, section)
  if (!await dirExists(sectionPath)) {
    return []
  }

  const files = await fs.readdir(sectionPath)
  const docFiles = files.filter(f => f.endsWith(DOC_EXT))

  // If no doc files exist, return empty array
  /* istanbul ignore if - defensive check for empty directories */
  if (docFiles.length === 0) {
    return []
  }

  // Parse each doc file to get title and description from frontmatter
  const docs = await Promise.all(
    docFiles.map(async (file) => {
      const content = await fs.readFile(join(sectionPath, file), 'utf-8')
      const { attributes } = parseFrontMatter(content)
      const name = basename(file, DOC_EXT)

      return {
        title: attributes.title,
        url: `/${section}/${name}`,
        description: attributes.description,
        name,
      }
    })
  )

  // Preserve order from orderedUrls, append any new files at the end sorted alphabetically
  const orderedDocs = []
  const docsByUrl = new Map(docs.map(d => [d.url, d]))

  // First, add docs in the order they appear in orderedUrls
  for (const url of orderedUrls) {
    const doc = docsByUrl.get(url)
    if (doc) {
      orderedDocs.push(doc)
      docsByUrl.delete(url)
    }
  }

  return orderedDocs.map(({ name, ...rest }) => rest)
}

// Generate nav.yml from the filesystem
const generateNav = async (contentPath, navPath) => {
  const docsCommandsPath = join(contentPath, 'commands')

  // Read all command files
  const commandFiles = await dirExists(docsCommandsPath) ? await fs.readdir(docsCommandsPath) : []
  const commandDocs = commandFiles.filter(f => f.endsWith(DOC_EXT))

  // Parse each command file to get title and description
  const allCommands = await Promise.all(
    commandDocs.map(async (file) => {
      const content = await fs.readFile(join(docsCommandsPath, file), 'utf-8')
      const { attributes } = parseFrontMatter(content)
      const name = basename(file, DOC_EXT)
      const title = (attributes.title || name).replace(/^npm-/, 'npm ')

      return {
        title,
        url: `/commands/${name}`,
        description: attributes.description || '',
        name,
      }
    })
  )

  // Sort commands: npm first, then alphabetically, npx last
  const npm = allCommands.find(c => c.name === 'npm')
  const npx = allCommands.find(c => c.name === 'npx')
  const others = allCommands
    .filter(c => c.name !== 'npm' && c.name !== 'npx')
    .sort((a, b) => a.name.localeCompare(b.name))

  // Remove the name field
  const commands = [npm, ...others, npx].filter(Boolean).map(({ name, ...rest }) => rest)

  // Hardcoded order for configuring-npm section (only urls - title/description come from frontmatter)
  const configuringNpmOrder = [
    '/configuring-npm/install',
    '/configuring-npm/folders',
    '/configuring-npm/npmrc',
    '/configuring-npm/package-json',
    '/configuring-npm/package-lock-json',
  ]

  // Hardcoded order for using-npm section (only urls - title/description come from frontmatter)
  const usingNpmOrder = [
    '/using-npm/registry',
    '/using-npm/package-spec',
    '/using-npm/config',
    '/using-npm/logging',
    '/using-npm/scope',
    '/using-npm/scripts',
    '/using-npm/workspaces',
    '/using-npm/orgs',
    '/using-npm/dependency-selectors',
    '/using-npm/developers',
    '/using-npm/removal',
  ]

  // Read actual docs from configuring-npm and using-npm directories
  const configuringNpmDocs = await readSectionDocs(contentPath, 'configuring-npm', configuringNpmOrder)
  const usingNpmDocs = await readSectionDocs(contentPath, 'using-npm', usingNpmOrder)

  // Build the navigation structure - only include sections with content
  const navData = []

  if (commands.length > 0) {
    navData.push({
      title: 'CLI Commands',
      shortName: 'Commands',
      url: '/commands',
      children: commands,
    })
  }

  if (configuringNpmDocs.length > 0) {
    navData.push({
      title: 'Configuring npm',
      shortName: 'Configuring',
      url: '/configuring-npm',
      children: configuringNpmDocs,
    })
  }

  if (usingNpmDocs.length > 0) {
    navData.push({
      title: 'Using npm',
      shortName: 'Using',
      url: '/using-npm',
      children: usingNpmDocs,
    })
  }

  const prefix = `# This is the navigation for the documentation pages; it is not used
# directly within the CLI documentation.  Instead, it will be used
# for the https://docs.npmjs.com/ site.
`
  await fs.writeFile(navPath, `${prefix}\n${yaml.stringify(navData, { indent: 2, indentSeq: false, lineWidth: 0 })}`, 'utf-8')
}

// Auto-generate doc templates for commands without docs
const autoGenerateMissingDocs = async (contentPath, navPath, commandsPath = null) => {
  commandsPath = commandsPath || join(__dirname, '../../lib/commands')
  const docsCommandsPath = join(contentPath, 'commands')

  // Get all commands from commandsPath directory
  let commands
  try {
    const cmdListPath = join(commandsPath, '..', 'utils', 'cmd-list.js')
    const cmdList = require(cmdListPath)
    commands = cmdList.commands
  } catch {
    // Fall back to reading command files from commandsPath
    const cmdFiles = await fs.readdir(commandsPath)
    commands = cmdFiles
      .filter(f => f.endsWith('.js'))
      .map(f => basename(f, '.js'))
  }

  // Get existing doc files
  const existingDocs = await fs.readdir(docsCommandsPath)
  const documentedCommands = existingDocs
    .filter(f => f.startsWith('npm-') && f.endsWith(DOC_EXT))
    .map(f => f.replace('npm-', '').replace(DOC_EXT, ''))

  // Find commands without docs
  const missingDocs = commands.filter(cmd => !documentedCommands.includes(cmd))

  // Generate docs for missing commands
  const newEntries = []
  for (const cmd of missingDocs) {
    const Command = require(join(commandsPath, `${cmd}.js`))
    const description = Command.description || `The ${cmd} command`
    const docPath = join(docsCommandsPath, `npm-${cmd}${DOC_EXT}`)

    const template = `---
title: npm-${cmd}
section: 1
description: ${description}
---

### Synopsis

<!-- AUTOGENERATED USAGE DESCRIPTIONS -->

### Description

${description}

### Configuration

<!-- AUTOGENERATED CONFIG DESCRIPTIONS -->

### See Also

* [npm help config](/commands/npm-config)
`

    await fs.writeFile(docPath, template, 'utf-8')

    // Track new entry for nav update
    newEntries.push({
      title: `npm ${cmd}`,
      url: `/commands/npm-${cmd}`,
      description,
    })
  }

  // Update nav.yml if there are new entries
  if (newEntries.length > 0) {
    const navContent = await fs.readFile(navPath, 'utf-8')
    const navData = yaml.parse(navContent)

    // Find CLI Commands section
    let commandsSection = navData.find(s => s.title === 'CLI Commands')
    if (!commandsSection) {
      // Create CLI Commands section if it doesn't exist
      commandsSection = {
        title: 'CLI Commands',
        shortName: 'Commands',
        url: '/commands',
        children: [],
      }
      navData.unshift(commandsSection)
    }

    if (!commandsSection.children) {
      commandsSection.children = []
    }

    // Add new entries that don't already exist
    for (const entry of newEntries) {
      const exists = commandsSection.children.some(c => c.url === entry.url)
      if (!exists) {
        commandsSection.children.push(entry)
      }
    }

    // Sort children: npm first, then alphabetically, npx last
    const npm = commandsSection.children.find(c => c.title === 'npm')
    const npx = commandsSection.children.find(c => c.title === 'npx')
    const others = commandsSection.children
      .filter(c => c.title !== 'npm' && c.title !== 'npx')
      .sort((a, b) => a.title.localeCompare(b.title))

    commandsSection.children = [npm, ...others, npx].filter(Boolean)

    // Write updated nav
    const prefix = `# This is the navigation for the documentation pages; it is not used
# directly within the CLI documentation.  Instead, it will be used
# for the https://docs.npmjs.com/ site.
`
    await fs.writeFile(navPath, `${prefix}\n${yaml.stringify(navData, { indent: 2, indentSeq: false, lineWidth: 0 })}`, 'utf-8')
  }
}

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

const run = async (opts) => {
  const {
    content, template, nav, man, html, md,
    skipAutoGenerate, skipGenerateNav, commandLoader,
  } = opts
  // Auto-generate docs for commands without documentation
  if (!skipAutoGenerate) {
    await autoGenerateMissingDocs(content, nav)
  }

  // Generate nav.yml from filesystem
  if (!skipGenerateNav) {
    await generateNav(content, nav)
  }

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
      commandLoader,
      data: {
        ...data,
        github_repo: 'npm/cli',
        github_branch: 'latest',
        github_path: 'docs/lib/content',
      },
      frontmatter,
      ...options,
    })

    const transformedSrc = applyTransforms(body, [
      transform.version,
      ...(fullName.startsWith('commands/')
        ? [transform.usage, transform.definitions]
        : []),
      ...(fullName === 'using-npm/config'
        ? [transform.shorthands, transform.config]
        : []),
    ])

    const aliases = [
      fullName === 'configuring-npm/package-json' && 'configuring-npm/npm-json',
      fullName === 'configuring-npm/folders' && 'configuring-npm/npm-global',
    ].filter(Boolean)

    if (data.section) {
      const manSource = applyTransforms(transformedSrc, [
        transform.helpLinks,
        transform.man,
      ])
      // Man page aliases are only the basename since the man pages have no hierarchy
      acc.man.push(...[name, ...aliases.map(a => basename(a))]
        .map((p) => applyTransforms(p, [transform.manPath]))
        .map((manPath) => ({
          path: manPath,
          fullPath: join(man, manPath),
          src: manSource,
        }))
      )
    }

    // html docs are used for npm help on Windows
    const htmlSource = applyTransforms(transformedSrc, [transform.html])
    acc.html.push(...[fullName, ...aliases].map((htmlPath) => ({
      path: `${htmlPath}.html`,
      fullPath: join(html, `${htmlPath}.html`),
      src: htmlSource,
    })))

    // Markdown pages don't get aliases here. These are used to build the website so any redirects
    // for these pages are applied in npm/documentation. Not ideal but there are also many more
    // redirects that we would never apply to man or html docs pages
    const mdSource = applyTransforms(transformedSrc, [transform.md])
    acc.md.push({
      path: childPath,
      fullPath: join(md, childPath),
      src: mdSource,
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
module.exports.generateNav = generateNav
module.exports.autoGenerateMissingDocs = autoGenerateMissingDocs
