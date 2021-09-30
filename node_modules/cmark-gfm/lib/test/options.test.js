const cmark = require('../')

const assert = require('chai').assert
const dedent = require('dedent')

describe('options', () => {
  describe('sourcepos', () => {
    it('adds data-sourcepos attributes to block-level elements', () => {
      const markdown = dedent`
      # Hello

      This is a test.

      \`\`\`javascript
      whee
      \`\`\`
      `.trim()

      const html = `
      <h1 data-sourcepos="1:1-1:7">Hello</h1>
      <p data-sourcepos="3:1-3:15">This is a test.</p>
      <pre data-sourcepos="5:1-7:3">
        <code class="language-javascript">whee</code>
      </pre>
      `
      const rendered = cmark.renderHtmlSync(markdown, {
        sourcepos: true
      })
      assert.htmlEqual(rendered, html)
    })
  })

  describe('nobreaks', () => {
    it('renders softbreak elements as spaces', () => {
      const markdown = dedent`
      abc
      def
      `.trim()

      const html = `
      <p>abc def</p>
      `

      const rendered = cmark.renderHtmlSync(markdown, {
        nobreaks: true
      })
      assert.htmlEqual(rendered, html)
    })
  })

  describe('hardbreaks', () => {
    it('renders softbreak elements as hard line breaks', () => {
      const markdown = dedent`
      abc
      def
      `.trim()

      const html = dedent`
      <p>abc<br>\ndef</p>
      `.trim()

      const rendered = cmark.renderHtmlSync(markdown, {
        hardbreaks: true
      })
      assert.htmlEqual(rendered, html)
    })
  })

  describe('validateUtf8', () => {
    xit('replaces illegal UTF-8 sequences', () => {
      // TODO: doesn't fail when option is false
      const markdown = "abc" + '\u0000' + "def"

      const html = "<p>abc" + '\uFFFD' + "def</p>"

      const rendered = cmark.renderHtmlSync(markdown, {
        validateUtf8: false
      })
      console.log(rendered)
      assert.htmlEqual(rendered, html)
    })
  })

  describe('smart', () => {
    it('makes punctuation fancy', () => {
      const markdown = dedent`
      "Good morning," said the man. "Wait -- maybe it's 'afternoon'." --- Someone Famous
      `.trim()

      const html = `
      <p>“Good morning,” said the man. “Wait – maybe it’s ‘afternoon’.” — Someone Famous</p>
      `.trim()

      const rendered = cmark.renderHtmlSync(markdown, {
        smart: true
      })
      assert.htmlEqual(rendered, html)
    })
  })

  describe('githubPreLang', () => {
    it('it adds a language class to the code tag by default', () => {
      const markdown = dedent`
      \`\`\`javascript
      console.log('hi')
      \`\`\`
      `

      const html = `<pre><code class="language-javascript">console.log('hi')</code></pre>`

      const rendered = cmark.renderHtmlSync(markdown)
      assert.htmlEqual(rendered, html)
    })

    it('uses GitHub-style pre tags with lang attributes', () => {
      const markdown = dedent`
      \`\`\`javascript
      console.log('hi')
      \`\`\`
      `

      const html = `<pre lang="javascript"><code>console.log('hi')</code></pre>`

      const rendered = cmark.renderHtmlSync(markdown, {
        githubPreLang: true
      })
      assert.htmlEqual(rendered, html)
    })
  })

  describe('liberalHtmlTag', () => {
    it('requires well-formed tags by default', () => {
      const markdown = `< div>Hello< /div>`

      const html = `<p>&lt; div&gt;Hello&lt; /div&gt;</p>\n`

      const rendered = cmark.renderHtmlSync(markdown, {
        unsafe: true
      })
      assert.equal(rendered, html)
    })

    it('allows for spaces inside HTML tag names', () => {
      const markdown = `< div>Hello< /div>`

      const html = `<p>< div>Hello< /div></p>\n`

      const rendered = cmark.renderHtmlSync(markdown, {
        unsafe: true,
        liberalHtmlTag: true
      })
      assert.equal(rendered, html)
    })
  })

  describe('footnotes', () => {
    it('parses footnotes', () => {
      const markdown = dedent`
      Here is some text[^1].

      [^1]: And the note
      `

      const html = `
      <p>Here is some text<sup class="footnote-ref"><a href="#fn1" id="fnref1">1</a></sup>.</p>
      <section class="footnotes">
        <ol>
          <li id="fn1">
            <p>And the note <a href="#fnref1" class="footnote-backref">↩</a></p>
          </li>
        </ol>
      </section>
      `

      const rendered = cmark.renderHtmlSync(markdown, {
        footnotes: true
      })
      assert.htmlEqual(rendered, html)
    })
  })

  describe('strikethroughDoubleTilde', () => {
    it('parses strikethroughs with any number of tildes by default', () => {
      const markdown1 = `This is some ~text~!`
      const markdown2 = `This is some ~~text~~!`

      const rendered1 = cmark.renderHtmlSync(markdown1, { extensions: { strikethrough: true } })
      const rendered2 = cmark.renderHtmlSync(markdown2, { extensions: { strikethrough: true } })

      assert.htmlEqual(rendered1, '<p>This is some <del>text</del>!</p>')
      assert.htmlEqual(rendered2, '<p>This is some <del>text</del>!</p>')
    })

    it('only parses strikethroughs if surrounded by exactly two tildes', () => {
      const markdown1 = `This is some ~text~!`
      const markdown2 = `This is some ~~text~~!`

      const rendered1 = cmark.renderHtmlSync(markdown1, {
        strikethroughDoubleTilde: true,
        extensions: {
          strikethrough: true
        }
      })
      const rendered2 = cmark.renderHtmlSync(markdown2, {
        strikethroughDoubleTilde: true,
        extensions: {
          strikethrough: true
        }
      })

      assert.htmlEqual(rendered1, '<p>This is some ~text~!</p>')
      assert.htmlEqual(rendered2, '<p>This is some <del>text</del>!</p>')
    })
  })

  describe('tablePreferStyleAttributes', () => {
    it('uses align attributes to align table cells by default', () => {
      const markdown = dedent`
      | abc | defghi |
      :-: | -----------:
      bar | baz
      `

      const html = `
      <table>
        <thead>
          <tr>
            <th align="center">abc</th>
            <th align="right">defghi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td align="center">bar</td>
            <td align="right">baz</td>
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

    it('uses style attributes to align table cells', () => {
      const markdown = dedent`
      | abc | defghi |
      :-: | -----------:
      bar | baz
      `

      const html = `
      <table>
        <thead>
          <tr>
            <th style="text-align: center">abc</th>
            <th style="text-align: right">defghi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center">bar</td>
            <td style="text-align: right">baz</td>
          </tr>
        </tbody>
      </table>
      `

      const rendered = cmark.renderHtmlSync(markdown, {
        tablePreferStyleAttributes: true,
        extensions: {
          table: true
        }
      })
      assert.htmlEqual(rendered, html)
    })
  })

  describe('fullInfoString', () => {
    it('drops the remainder of code block info strings by default', () => {
      const markdown = dedent`
      \`\`\`javascript here is more data
      console.log('hi')
      \`\`\`
      `

      const html = `<pre><code class="language-javascript">console.log('hi')</code></pre>`

      const rendered = cmark.renderHtmlSync(markdown)
      assert.htmlEqual(rendered, html)
    })

    it('includes the remainder of code block info strings in an attribute', () => {
      const markdown = dedent`
      \`\`\`javascript here is more data
      console.log('hi')
      \`\`\`
      `

      const html = `
      <pre>
        <code class="language-javascript"
          data-meta="here is more data">console.log('hi')</code>
      </pre>
      `

      const rendered = cmark.renderHtmlSync(markdown, {
        fullInfoString: true
      })
      assert.htmlEqual(rendered, html)
    })
  })

  describe('unsafe', () => {
    it('is safe by default', () => {
      const markdown = dedent`
      ![img](data:image/gif;base64,abccdefgh)

      <div>hello!</div>

      [link](javascript:alert('omg'))
      `.trim()

      const html = `
      <p><img alt="img" src="data:image/gif;base64,abccdefgh"></p>
      <!-- raw HTML omitted -->
      <p><a href="">link</a></p>
      `

      const rendered = cmark.renderHtmlSync(markdown)
      assert.htmlEqual(rendered, html)
    })

    it('allows HTML and unsafe links', () => {
      const markdown = dedent`
      ![img](data:image/gif;base64,abccdefgh)

      <div>hello!</div>

      [link](javascript:alert('omg'))
      `.trim()

      const html = `
      <p><img alt="img" src="data:image/gif;base64,abccdefgh"></p>
      <div>hello!</div>
      <p><a href="javascript:alert('omg')">link</a></p>
      `

      const rendered = cmark.renderHtmlSync(markdown, {
        unsafe: true
      })
      assert.htmlEqual(rendered, html)
    })
  })
})
