const { join, dirname, basename, extname, sep, posix } = require('path')
const fs = require('fs/promises')
const ignoreWalk = require('ignore-walk')
const yaml = require('yaml')
const parseFrontMatter = require('front-matter')

const checkNav = require('./check-nav.js')
const { DOC_EXT, ...transform } = require('./index.js')

// Generate nav.yml from the filesystem
const generateNav = async (contentPath, navPath) => {
  const docsCommandsPath = join(contentPath, 'commands')

  // Read all command files
  const commandFiles = await fs.readdir(docsCommandsPath)
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

  // Separate npm, npx, and other commands
  const npm = allCommands.find(cmd => cmd.name === 'npm')
  const npx = allCommands.find(cmd => cmd.name === 'npx')
  const otherCommands = allCommands
    .filter(cmd => cmd.name !== 'npm' && cmd.name !== 'npx')
    .sort((a, b) => a.name.localeCompare(b.name))

  // Remove the name field and arrange: npm, ...commands, npx
  const commands = [npm, ...otherCommands, npx].filter(Boolean).map(({ name, ...rest }) => rest)

  // Build the navigation structure
  const navData = [
    {
      title: 'CLI Commands',
      shortName: 'Commands',
      url: '/commands',
      children: commands,
    },
    {
      title: 'Configuring npm',
      shortName: 'Configuring',
      url: '/configuring-npm',
      children: [
        {
          title: 'Install',
          url: '/configuring-npm/install',
          description: 'Download and install node and npm',
        },
        {
          title: 'Folders',
          url: '/configuring-npm/folders',
          description: 'Folder structures used by npm',
        },
        {
          title: '.npmrc',
          url: '/configuring-npm/npmrc',
          description: 'The npm config files',
        },
        {
          title: 'npm-shrinkwrap.json',
          url: '/configuring-npm/npm-shrinkwrap-json',
          description: 'A publishable lockfile',
        },
        {
          title: 'package.json',
          url: '/configuring-npm/package-json',
          description: "Specifics of npm's package.json handling",
        },
        {
          title: 'package-lock.json',
          url: '/configuring-npm/package-lock-json',
          description: 'A manifestation of the manifest',
        },
      ],
    },
    {
      title: 'Using npm',
      shortName: 'Using',
      url: '/using-npm',
      children: [
        {
          title: 'Registry',
          url: '/using-npm/registry',
          description: 'The JavaScript Package Registry',
        },
        {
          title: 'Package spec',
          url: '/using-npm/package-spec',
          description: 'Package name specifier',
        },
        {
          title: 'Config',
          url: '/using-npm/config',
          description: 'About npm configuration',
        },
        {
          title: 'Logging',
          url: '/using-npm/logging',
          description: 'Why, What & How we Log',
        },
        {
          title: 'Scope',
          url: '/using-npm/scope',
          description: 'Scoped packages',
        },
        {
          title: 'Scripts',
          url: '/using-npm/scripts',
          description: 'How npm handles the "scripts" field',
        },
        {
          title: 'Workspaces',
          url: '/using-npm/workspaces',
          description: 'Working with workspaces',
        },
        {
          title: 'Organizations',
          url: '/using-npm/orgs',
          description: 'Working with teams & organizations',
        },
        {
          title: 'Dependency Selectors',
          url: '/using-npm/dependency-selectors',
          description: 'Dependency Selector Syntax & Querying',
        },
        {
          title: 'Developers',
          url: '/using-npm/developers',
          description: 'Developer guide',
        },
        {
          title: 'Removal',
          url: '/using-npm/removal',
          description: 'Cleaning the slate',
        },
      ],
    },
  ]

  const prefix = `
# This is the navigation for the documentation pages; it is not used
# directly within the CLI documentation.  Instead, it will be used
# for the https://docs.npmjs.com/ site.
`
  await fs.writeFile(navPath, `${prefix}\n\n${yaml.stringify(navData)}`, 'utf-8')
}

// Auto-generate doc templates for commands without docs
const autoGenerateMissingDocs = async (contentPath, navPath, commandsPath = null) => {
  commandsPath = commandsPath || join(__dirname, '../../lib/commands')
  const docsCommandsPath = join(contentPath, 'commands')

  // Get all commands from cmd-list
  const { commands } = require('../../lib/utils/cmd-list.js')

  // Get existing doc files
  const existingDocs = await fs.readdir(docsCommandsPath)
  const documentedCommands = existingDocs
    .filter(f => f.startsWith('npm-') && f.endsWith(DOC_EXT))
    .map(f => f.replace('npm-', '').replace(DOC_EXT, ''))

  // Find commands without docs
  const missingDocs = commands.filter(cmd => !documentedCommands.includes(cmd))

  // Generate docs for missing commands
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

const run = async ({ content, template, nav, man, html, md, skipAutoGenerate }) => {
  // Auto-generate docs for commands without documentation
  if (!skipAutoGenerate) {
    await autoGenerateMissingDocs(content, nav)
  }

  // Generate nav.yml from filesystem
  await generateNav(content, nav)

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
        github_path: 'docs/lib/content',
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
