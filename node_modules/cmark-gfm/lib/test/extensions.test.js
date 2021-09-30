const cmark = require('../')

const assert = require('chai').assert
const dedent = require('dedent')

describe('extensions', () => {
  describe('table', () => {
    it('renders tables', () => {
      const markdown = dedent`
      |Header|
      |------|
      |Hello |
      `.trim()

      const html = `
      <table>
        <thead>
          <tr>
            <th>Header</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hello</td>
          </tr>
        </tbody>
      </table>
      `
      const rendered = cmark.renderHtmlSync(markdown, {
        extensions: {
          table: true
        }
      })
      assert.htmlEqual(rendered, html)
    })
  })

  describe('strikethrough', () => {
    it('enables strikethrough', () => {
      const markdown = dedent`
      It's all about ~CoffeeScript~ ES2016
      `.trim()

      const html = `
      <p>It's all about <del>CoffeeScript</del> ES2016</p>
      `
      const rendered = cmark.renderHtmlSync(markdown, {
        extensions: {
          strikethrough: true
        }
      })
      assert.htmlEqual(rendered, html)
    })
  })

  describe('tagfilter', () => {
    it('only allows certain HTML tags to be rendered as raw HTML', () => {
      const markdown = dedent`
      <div>What a weird <xmp> tag</div>
      `.trim()

      const html = `
      <div>What a weird &lt;xmp> tag</div>
      `

      const rendered = cmark.renderHtmlSync(markdown, {
        unsafe: true,
        extensions: {
          tagfilter: true
        }
      })
      assert.htmlEqual(rendered, html)
    })
  })

  describe('autolink', () => {
    it('turns URLs into links', () => {
      const markdown = dedent`
      Visit us at https://github.com!
      `.trim()

      const html = `
      <p>Visit us at <a href="https://github.com">https://github.com</a>!</p>
      `

      const rendered = cmark.renderHtmlSync(markdown, {
        extensions: {
          autolink: true
        }
      })
      assert.htmlEqual(rendered, html)
    })
  })

  describe('tasklist', () => {
    it('renders GitHub-style task lists', () => {
      const markdown = dedent`
      - [ ] Task 1
      - [x] Task 2
      `

      const html = `
      <ul>
        <li><input type="checkbox" disabled="" /> Task 1</li>
        <li><input type="checkbox" checked="" disabled="" /> Task 2</li>
      </ul>
      `

      const rendered = cmark.renderHtmlSync(markdown, {
        extensions: {
          tasklist: true
        }
      })
      assert.htmlEqual(rendered, html)
    })
  })

  it("doesn't crash for bad extensions", () => {
    assert.throws(function() {
      cmark.renderHtml('# Hi', {extensions: ['fake']})
    })
    assert.throws(function() {
      cmark.renderHtml('# Hi', {extensions: 'notanarray'})
    })
    assert.throws(function() {
      cmark.renderHtml('# Hi', {extensions: [{}]})
    })
  })

  it('only enables an extension with a truthy value', () => {
    const rendered = cmark.renderHtmlSync('- [ ] https://google,com', {
      extensions: {
        tasklist: false,
        autolink: true
      }
    })
    assert.notInclude(rendered, 'checkbox')
    assert.include(rendered, 'href')
  })
})
