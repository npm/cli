# cmark-gfm

cmark-gfm is a Node.js wrapper around [libcmark-gfm](https://github.com/github/cmark-gfm), GitHub's [GFM-enhanced](https://github.github.com/gfm/) fork of [cmark](https://github.com/commonmark/cmark), the reference implementation of [CommonMark](http://commonmark.org/) in C by John MacFarlane.

## Installation

cmark-gfm is distributed via the npm registry, and can be installed with `npm` and similar tools:

```
npm install cmark-gfm
```

## API

**`renderHtml(markdown[, options][, callback])`**

Converts a Markdown string to HTML asynchronously. If you do not provide a `callback`, `renderHtml` will return a `Promise` that will resolve to the resulting HTML. If `options` is omitted, default options will be used.

  * `markdown` - a string of Markdown to convert to HTML
  * `options` - a hash of options (see *Options*, below)
  * `callback` - a Node.js-style callback to call with the resulting HTML once the Markdown has been rendered
    * `error` - any error that occurred
    * `html` - the resulting HTML

Example:

```javascript
const cmark = require('cmark-gfm')

const options = { ... }

// Promise-style
cmark.renderHtml('# Hello there!', options)
  .then(html => console.log(html))
  .catch(error => console.error(error))

// Callback-style
cmark.renderHtml('# Hello there!', options, (error, html) => {
  if (error) {
    console.error(error)
    return
  }

  console.log(html)
})
```

**`html = renderHtmlSync(markdown[, options])`**

Converts a Markdown string to HTML synchronously. If `options` is omitted, default options will be used.

  * `markdown` - a string of Markdown to convert to HTML
  * `options` - a hash of options (see *Options*, below)

Example:

```javascript
const cmark = require('cmark-gfm')

const options = { ... }

try {
  const html = cmark.renderHtmlSync('# Hello there!', options)
  console.log(html)
} catch (error) {
  console.error(error)
}
```

**`createStreamingParser([options])`**

Creates a [stream](https://nodejs.org/api/stream.html) with a writable end that accepts Markdown and a readable end that produces HTML. The parser ingests Markdown and converts it to HTML asynchronously. If `options` is omitted, default options will be used.

  * `options` - a hash of options (see *Options*, below)

Example:

```javascript
const cmark = require('cmark-gfm')
const fs = require('fs')

const options = { ... }

fs.createReadStream('./input.md')
  .pipe(cmark.createStreamingParser(options))
  .pipe(fs.createWriteStream('./output.html'))
```

### Options

cmark-gfm supports a variety of options that it passes to the underlying libcmark-gfm library. You can enable most options by setting its name to the value of `true` in your `options` object; to enable an extension, add its name as a key to an `extensions` object with a value of `true`. For example, to enable the `smart` and `footnotes` options and the `strikethrough` extension:

```javascript
const cmark = require('cmark-gfm')

const options = {
  smart: true,
  footnotes: true,
  extensions: {
    strikethrough: true
  }
}

cmark.renderHtml(markdown, options)
  .then(/* ... */)
```

You can find a summary of all the options in the table below, as well as additional information for some options in the *Features* section later in this document.

| Name | Type | Description
|---|---|---|
| `sourcepos`* | `bool` | Adds a `data-sourcepos` attribute to elements that indicate the range of Markdown that resulted in the element |
| `hardbreaks`* | `bool` | Renders softbreak elements as hard line breaks |
| `nobreaks`* | `bool` | Renders softbreak elements as spaces |
| `validateUtf8` | `bool` | Replaces illegal UTF-8 sequences with `U+FFFD` |
| `smart` | `bool` | Replaces straight quotes with curly ones, and turns `---` into em dashes and `--` into en dashes |
| `githubPreLang`* | `bool` | Uses GitHub style `<pre lang="x">` tags for code blocks |
| `liberalHtmltag` | `bool` | Allows HTML tags to be parsed as HTML even if they are not well formed (e.g. `< div>` instead of just `<div>`) |
| `footnotes`* | `bool` | Enables footnote parsing and rendering |
| `strikethroughDoubleTilde` | `bool` | When enabled, the `strikethrough` extension will only render text as strikethrough if it is surrounded by exactly `~~two tildes~~` |
| `fullInfoString`* | `bool` | Adds additional code block info as an additional attribute on the resulting HTML element |
| `unsafe`* | `bool` | Allows raw HTML and unsafe links (`javascript:`, `vbscript:`, `file:`, and `data:` except for `image/png`, `image/gif`, `image/jpeg`, or `image/webp` mime types). Otherwise, raw HTML is replaced by a placeholder HTML comment, and unsafe links are replaced with empty strings. |
| `extensions`* | `object` | Which extensions to enable |
| *\* more information in the Features and Extensions sections below* |

libcmark-gfm also exposes several Markdown extensions that you can enable by passing their name as keys to the `extensions` option (with a value of `true`). You can find a summary of all the extensions in the table below, as well as additional information in the *Extensions* section later in this document.

| Name | Description |
|---|---|
| `"table"` | Renders tables |
| `"strikethrough"` | Renders text as strikethrough when surrounded by `~tildes~` |
| `"tagfilter"` | Escapes [certain dangerous HTML tags](https://github.github.com/gfm/#disallowed-raw-html-extension-), causing them to have no effect |
| `"autolink"` | Automatically generates links from URLs |
| `"tasklist"` | Renders [GitHub-style task lists](https://help.github.com/articles/about-task-lists/)

## Features

### `sourcepos`

Enabling the `sourcepos` option adds a `data-sourcepos` attribute to block level elements which indicate the row and column positions from the original Markdown source that resulted in that HTML element. For example, given the markdown:

````markdown
# Hello!

Hi there. This is a Markdown file. You probably knew that already.

```javascript
// Here's a bit of JS code

console.log('hello')
```

And a short list:

* One
* Two
* Three
````

Rendering with the `sourcepos` attribute would result in output similar to:

```html
<h1 data-sourcepos="1:1-1:8">Hello!</h1>

<p data-sourcepos="3:1-3:66">Hi there. This is a Markdown file. You probably knew that already.</p>

<pre data-sourcepos="5:1-9:3">
<code class="language-javascript">
// Here's a bit of JS code

console.log('hello')
</code>
</pre>

<p data-sourcepos="11:1-11:17">And a short list:</p>

<ul data-sourcepos="13:1-15:7">
  <li data-sourcepos="13:1-13:5">One</li>
  <li data-sourcepos="14:1-14:5">Two</li>
  <li data-sourcepos="15:1-15:7">Three</li>
</ul>
```

You can see, for example, that the `<pre>` tag that represents the code block was generated from the Markdown text between row 5 column 1 and row 9 column 3 (inclusive and 1-indexed).

### `hardbreaks`

Enabling the `hardbreaks` option renders "softbreak" elements as hard line breaks.

```markdown
abc
def
```

would normally result in

```html
<p>abc\ndef</p>
```

but with `hardbreaks` enabled, it results in

```html
<p>abc<br>\ndef</p>
```

### `nobreaks`

Enabling the `nobreaks` option renders "softbreak" elements as spaces:

```markdown
abc
def
```

would normally result in

```html
<p>abc\ndef</p>
```

but with `nobreaks` enabled, it results in

```html
<p>abc def</p>
```

### `githubPreLang`

Normally, code blocks like the following:

````markdown
```javascript
console.log('hello!')
```
````

would result in HTML like this:

```html
<pre>
<code class="language-javascript">
console.log('hello!')
</code>
</pre>
```

With `githubPreLang` enabled, it would instead result in the following HTML:

```html
<pre lang="javascript">
<code>
console.log('hello!')
</code>
</pre>
```

### `footnotes`

Enabling the `footnotes` option turns on the parsing and rendering of footnotes. Here's a simple example:

````markdown
Here is some text[^1]. Here's a little bit more[^more].

[^1]: You can tell because of all the text
[^more]: Just a little bit
````

And the resulting HTML:

```html
<p>Here is some text<sup class="footnote-ref"><a href="#fn1" id="fnref1">1</a></sup>. Here's a little bit more<sup class="footnote-ref"><a href="#fn2" id="fnref2">2</a></sup>.</p>

<section class="footnotes">
  <ol>
    <li id="fn1">
      <p>You can tell because of all the text <a href="#fnref1" class="footnote-backref">↩</a></p>
    </li>
    <li id="fn2">
      <p>Just a little bit <a href="#fnref2" class="footnote-backref">↩</a></p>
    </li>
  </ol>
</section>
```

### `fullInfoString`

When the `fullInfoString` feature is enabled, extra text after the language tag for a code block (which is normally discarded) is included in a `data-meta` attribute on the resulting HTML element:

````markdown
```javascript here is some more text
console.log('hi')
```
````

```html
<pre>
<code class="language-javascript" data-meta="here is some more text">
console.log('hi')
</code>
</pre>
```

### `unsafe`

By default, `libcmark-gfm` escapes raw HTML and unsafe links:


````markdown
![img](data:image/gif;base64,abccdefgh)

<div>hello!</div>

[link](javascript:alert('omg'))
````

would result in:

```html
<p><img alt="img" src="data:image/gif;base64,abccdefgh"></p>
<!-- raw HTML omitted -->
<p><a href="">link</a></p>
```

Notice that the `div` and the `javascript:alert` link have been sanitized. With the `unsafe` option enabled, the resulting HTML would be:

```html
<p><img alt="img" src="data:image/gif;base64,abccdefgh"></p>
<div>hello!</div>
<p><a href="javascript:alert('omg')">link</a></p>
```

If you use the `unsafe` option, you should be sure to do your own sanitization of the resulting HTML.

## Extensions

### `"table"`

The `table` extension allows the parsing and rendering of tables:

```markdown
|Header|
|------|
|Hello |
```

```html
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
```

See [the table documentation in the GFM docs](https://github.github.com/gfm/#tables-extension-) for more information.

### `"strikethrough"`

The `strikethrough` extension renders text surrounded by `~one~` or `~~two~~` tildes as strikethrough using the `<del>` tag. If the `strikethroughDoubleTilde` option is enabled, text will only be rendered as strikethrough if it is surrounded by exactly `~~two~~` tildes.

### `"tagfilter"`

Certain HTML tags can be particularly troublesome as they change how HTML is interpreted in a way unique to them. The `tagfilter` extension escapes these tags by replacing the leading `<` with `&lt;`. The following markdown:

```markdown
<div>What a weird <xmp> tag</div>
```

would result in this HTML:

```html
<div>What a weird &lt;xmp> tag</div>
```

See [the Disallowed Raw HTML documentation in the GFM docs](https://github.github.com/gfm/#disallowed-raw-html-extension-) for more information and the list of filtered tags.

### `"autolink"`

The `autolink` extension recognizes URLs in text and automatically turns them into links:

```markdown
Visit us at https://github.com!
```

```html
<p>Visit us at <a href="https://github.com">https://github.com</a>!</p>
```

See [the autolinks documentation in the GFM docs](https://github.github.com/gfm/#autolinks-extension-) for more information about how libcmark-gfm scans for links.

### `"tasklist"`

The `tasklist` extension enables the rendering of [GitHub-style task lists](https://help.github.com/articles/about-task-lists/).

```markdown
- [ ] Task 1
- [x] Task 2
```

```html
<ul>
  <li class="task-list-item"><input type="checkbox" disabled="" /> Task 1</li>
  <li class="task-list-item"><input type="checkbox" checked="" disabled="" /> Task 2</li>
</ul>
```

See [the task list documentation in the GFM docs](https://github.github.com/gfm/#task-list-items-extension-) for more information about how libcmark-gfm processes task lists.
