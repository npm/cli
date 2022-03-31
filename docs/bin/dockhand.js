const path = require('path')
const fs = require('fs')
const yaml = require('yaml')
const cmark = require('cmark-gfm')
const mdx = require('@mdx-js/mdx')
const mkdirp = require('mkdirp')
const jsdom = require('jsdom')
const { version: VERSION } = require('../lib/npm.js')

function ensureNavigationComplete (navPaths, fsPaths) {
  const unmatchedNav = {}
  const unmatchedFs = {}

  for (const navPath of navPaths) {
    unmatchedNav[navPath] = true
  }

  for (let fsPath of fsPaths) {
    fsPath = path.sep + fsPath.replace(/\.md$/, '')
    fsPath = fsPath.split(path.sep).join(path.posix.sep)

    if (unmatchedNav[fsPath]) {
      delete unmatchedNav[fsPath]
    } else {
      unmatchedFs[fsPath] = true
    }
  }

  const toKeys = (v) => Object.keys(v).sort().map((p) => p.split(path.posix.sep).join(path.sep))
  const missingNav = toKeys(unmatchedNav)
  const missingFs = toKeys(unmatchedFs)

  if (missingNav.length > 0 || missingFs.length > 0) {
    let message = 'Error: documentation navigation (nav.yml) does not match filesystem.\n'

    if (missingNav.length > 0) {
      message += '\nThe following path(s) exist on disk but are not present in nav.yml:\n\n'

      for (const n of missingNav) {
        message += `  ${n}\n`
      }
    }

    if (missingNav.length > 0 && missingFs.length > 0) {
      message += '\nThe following path(s) exist in nav.yml but are not present on disk:\n\n'

      for (const m of missingFs) {
        message += `  ${m}\n`
      }
    }

    message += '\nUpdate nav.yml to ensure that all files are listed in the appropriate place.'

    return message
  }
}

function getNavigationPaths (entries) {
  const paths = []

  for (const entry of entries) {
    if (entry.children) {
      paths.push(...getNavigationPaths(entry.children))
    } else {
      paths.push(entry.url)
    }
  }

  return paths
}

async function renderFilesystemPaths ({ input, output, ...opts }, dirRelative = null) {
  const paths = []

  const dirPath = dirRelative ? path.join(input, dirRelative) : input
  const children = fs.readdirSync(dirPath)

  for (const childFilename of children) {
    const childRelative = dirRelative ? path.join(dirRelative, childFilename) : childFilename
    const childPath = path.join(input, childRelative)

    if (fs.lstatSync(childPath).isDirectory()) {
      paths.push(...(await renderFilesystemPaths({ input, output, ...opts }, childRelative)))
    } else {
      await renderFile(input, output, childRelative, opts)
      paths.push(childRelative)
    }
  }

  return paths
}

async function renderFile (root, outputRoot, childPath, { template, config }) {
  const inputPath = path.join(root, childPath)

  if (!inputPath.match(/\.md$/)) {
    console.error(`warning: unknown file type ${inputPath}, ignored`)
    return
  }

  const outputPath = path.join(outputRoot, childPath.replace(/\.md$/, '.html'))

  let md = fs.readFileSync(inputPath).toString()
  let frontmatter = {}

  // Take the leading frontmatter out of the markdown
  md = md.replace(/^---\n([\s\S]+)\n---\n/, (header, fm) => {
    frontmatter = yaml.parse(fm, 'utf8')
    return ''
  })

  // Replace any tokens in the source
  md = md.replace(/@VERSION@/, VERSION)

  // Render the markdown into an HTML snippet using a GFM renderer.
  const content = cmark.renderHtmlSync(md, {
    smart: false,
    githubPreLang: true,
    strikethroughDoubleTilde: true,
    unsafe: false,
    extensions: {
      table: true,
      strikethrough: true,
      tagfilter: true,
      autolink: true,
    },
  })

  // Test that mdx can parse this markdown file.  We don't actually
  // use the output, it's just to ensure that the upstream docs
  // site (docs.npmjs.com) can parse it when this file gets there.
  try {
    await mdx(md, { skipExport: true })
  } catch (error) {
    throw new MarkdownError(childPath, error)
  }

  // Inject this data into the template, using a mustache-like
  // replacement scheme.
  const html = template.replace(/{{\s*([\w.]+)\s*}}/g, (token, key) => {
    switch (key) {
      case 'content':
        return `<div id="_content">${content}</div>`
      case 'path':
        return childPath
      case 'url_path':
        return encodeURI(childPath)

      case 'toc':
        return '<div id="_table_of_contents"></div>'

      case 'title':
      case 'section':
      case 'description':
        return frontmatter[key]

      case 'config.github_repo':
      case 'config.github_branch':
      case 'config.github_path':
        return config[key.replace(/^config\./, '')]

      default:
        console.error(`warning: unknown token '${token}' in ${inputPath}`)
        return ''
    }
  })

  const dom = new jsdom.JSDOM(html)
  const document = dom.window.document

  // Rewrite relative URLs in links and image sources to be relative to
  // this file; this is for supporting `file://` links.  HTML pages need
  // suffix appended.
  const links = [
    { tag: 'a', attr: 'href', suffix: '.html' },
    { tag: 'img', attr: 'src' },
  ]

  for (const linktype of links) {
    for (const tag of document.querySelectorAll(linktype.tag)) {
      let url = tag.getAttribute(linktype.attr)

      if (url.startsWith('/')) {
        const childDepth = childPath.split('/').length - 1
        const prefix = childDepth > 0 ? '../'.repeat(childDepth) : './'

        url = url.replace(/^\//, prefix)

        if (linktype.suffix) {
          url += linktype.suffix
        }

        tag.setAttribute(linktype.attr, url)
      }
    }
  }

  // Give headers a unique id so that they can be linked within the doc
  const headerIds = []
  for (const header of document.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
    if (header.getAttribute('id')) {
      headerIds.push(header.getAttribute('id'))
      continue
    }

    const headerText = header.textContent
      .replace(/[A-Z]/g, x => x.toLowerCase())
      .replace(/ /g, '-')
      .replace(/[^a-z0-9-]/g, '')
    let headerId = headerText
    let headerIncrement = 1

    while (document.getElementById(headerId) !== null) {
      headerId = headerText + ++headerIncrement
    }

    headerIds.push(headerId)
    header.setAttribute('id', headerId)
  }

  // Walk the dom and build a table of contents
  const toc = document.getElementById('_table_of_contents')

  if (toc) {
    toc.appendChild(generateTableOfContents(document))
  }

  // Write the final output
  const output = dom.serialize()

  mkdirp.sync(path.dirname(outputPath))
  fs.writeFileSync(outputPath, output)
}

function generateTableOfContents (document) {
  const headers = []
  walkHeaders(document.getElementById('_content'), headers)

  // The nesting depth of headers are not necessarily the header level.
  // (eg, h1 > h3 > h5 is a depth of three even though there's an h5.)
  const hierarchy = []
  for (const header of headers) {
    const level = headerLevel(header)

    while (hierarchy.length && hierarchy[hierarchy.length - 1].headerLevel > level) {
      hierarchy.pop()
    }

    if (!hierarchy.length || hierarchy[hierarchy.length - 1].headerLevel < level) {
      const newList = document.createElement('ul')
      newList.headerLevel = level

      if (hierarchy.length) {
        hierarchy[hierarchy.length - 1].appendChild(newList)
      }

      hierarchy.push(newList)
    }

    const element = document.createElement('li')

    const link = document.createElement('a')
    link.setAttribute('href', `#${header.getAttribute('id')}`)
    link.innerHTML = header.innerHTML
    element.appendChild(link)

    const list = hierarchy[hierarchy.length - 1]
    list.appendChild(element)
  }

  return hierarchy[0]
}

function walkHeaders (element, headers) {
  for (const child of element.childNodes) {
    if (headerLevel(child)) {
      headers.push(child)
    }

    walkHeaders(child, headers)
  }
}

function headerLevel (node) {
  const level = node.tagName ? node.tagName.match(/^[Hh]([123456])$/) : null
  return level ? level[1] : 0
}

class MarkdownError extends Error {
  constructor (file, inner) {
    super(`failed to parse ${file}`)
    this.file = file
    this.inner = inner
  }
}

const run = async function (rootDir) {
  const dir = (...p) => path.join(rootDir, '..', ...p)

  const config = require(dir('lib', 'config.json'))
  const template = fs.readFileSync(dir('lib', 'template.html'), 'utf-8')
  const nav = yaml.parse(fs.readFileSync(dir('nav.yml'), 'utf-8'))

  const navPaths = getNavigationPaths(nav)
  const fsPaths = await renderFilesystemPaths({
    input: dir('content'),
    output: dir('output'),
    config,
    template,
  })

  const navErrors = ensureNavigationComplete(navPaths, fsPaths)
  if (navErrors) {
    console.error(navErrors)
    throw new Error('Nav Errors')
  }
}

run(__dirname).catch((err) => {
  process.exitCode = 1
  console.error(err)
})
