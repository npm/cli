const jsdom = require('jsdom')
const { version } = require('../../package.json')

function transformHTML (
  src,
  { path, template, data, unified, remarkParse, remarkGfm, remarkRehype, rehypeStringify }
) {
  const content = unified()
    .use(remarkParse)
    .use(remarkGfm, {
      singleTilde: false,
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(src)
    .toString()

  // Inject this data into the template, using a mustache-like
  // replacement scheme.
  const html = template.replace(/{{\s*([\w.]+)\s*}}/g, (token, key) => {
    switch (key) {
      case 'content':
        return `<div id="_content">${content}</div>`
      case 'url_path':
        return encodeURI(path)

      case 'toc':
        return '<div id="_table_of_contents"></div>'

      case 'title':
      case 'section':
      case 'description':
        return data[key]

      case 'config.github_repo':
      case 'config.github_branch':
      case 'config.github_path':
        return data[key.replace(/^config\./, '')]

      case 'version':
        return version

      default:
        throw new Error(`warning: unknown token '${token}' in ${path}`)
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
        const childDepth = path.split('/').length - 1
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
  const tocEl = document.getElementById('_table_of_contents')
  if (tocEl) {
    const toc = generateTableOfContents(document)
    if (toc) {
      tocEl.appendChild(toc)
    }
  }

  return dom.serialize()
}

function generateTableOfContents (document) {
  const headers = walkHeaders(document.getElementById('_content'))

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

    hierarchy[hierarchy.length - 1].appendChild(element)
  }

  return hierarchy[0]
}

function walkHeaders (element, headers = []) {
  for (const child of element.childNodes) {
    if (headerLevel(child)) {
      headers.push(child)
    }

    walkHeaders(child, headers)
  }
  return headers
}

function headerLevel (node) {
  const level = node.tagName ? node.tagName.match(/^[Hh]([123456])$/) : null
  return level ? level[1] : 0
}

module.exports = transformHTML
