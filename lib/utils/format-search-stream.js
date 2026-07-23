const { stripVTControlCharacters: strip } = require('node:util')
const { Minipass } = require('minipass')
const color = require('./color.js')

// This module consumes package data in the following format:
//
// {
//   name: String,
//   description: String,
//   maintainers: [{ username: String, email: String }],
//   keywords: String | [String],
//   version: String,
//   date: Date // can be null,
// }
//
// The returned stream will format this package data into a byte stream of formatted, displayable output.

function filter (data, exclude) {
  const words = [data.name]
    .concat(data.maintainers.map(m => m.username))
    .concat(data.keywords || [])
    .map(f => f?.trim?.())
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (exclude.find(pattern => {
    // Treats both /foo and /foo/ as regex searches
    if (pattern.startsWith('/')) {
      if (pattern.endsWith('/')) {
        pattern = pattern.slice(0, -1)
      }
      return words.match(new RegExp(pattern.slice(1)))
    }
    return words.includes(pattern)
  })) {
    return false
  }

  return true
}

module.exports = (opts) => {
  return opts.json ? new JSONOutputStream(opts) : new TextOutputStream(opts)
}

class JSONOutputStream extends Minipass {
  #didFirst = false
  #exclude

  constructor (opts) {
    super()
    this.#exclude = opts.exclude
  }

  write (obj) {
    if (!filter(obj, this.#exclude)) {
      return
    }
    if (!this.#didFirst) {
      super.write('[\n')
      this.#didFirst = true
    } else {
      super.write('\n,\n')
    }

    return super.write(JSON.stringify(obj))
  }

  end () {
    super.write(this.#didFirst ? ']\n' : '\n[]\n')
    super.end()
  }
}

class TextOutputStream extends Minipass {
  #args
  #exclude
  #parseable

  constructor (opts) {
    super()
    // Consider a search for "cowboys" and "boy".
    // If we highlight "boys" first the "cowboys" string will no longer string match because of the ansi highlighting added to "boys".
    // If we highlight "boy" second then the ansi reset at the end will make the highlighting only on "cowboy" with a normal "s".
    // Neither is perfect but at least the first option doesn't do partial highlighting. So, we sort strings smaller to larger
    this.#args = opts.args
      .map(s => s.toLowerCase())
      .filter(Boolean)
      .sort((a, b) => a.length - b.length)
    this.#exclude = opts.exclude
    this.#parseable = opts.parseable
  }

  write (data) {
    if (!filter(data, this.#exclude)) {
      return
    }
    // Normalize
    const pkg = {
      authors: data.maintainers.map((m) => `${strip(m.username)}`).join(' '),
      publisher: strip(data.publisher?.username || ''),
      date: data.date ? data.date.toISOString().slice(0, 10) : 'prehistoric',
      description: strip(data.description ?? ''),
      keywords: [],
      name: strip(data.name),
      version: data.version,
    }
    if (Array.isArray(data.keywords)) {
      pkg.keywords = data.keywords.map(strip)
    } else if (typeof data.keywords === 'string') {
      pkg.keywords = strip(data.keywords.replace(/[,\s]+/, ' ')).split(' ')
    }

    let output
    if (this.#parseable) {
      output = [pkg.name, pkg.description, pkg.author, pkg.date, pkg.version, pkg.keywords]
        .filter(Boolean)
        .map(col => ('' + col).replace(/\t/g, ' ')).join('\t')
      return super.write(output)
    }

    const keywords = pkg.keywords.map(k => {
      if (this.#args.includes(k)) {
        return color.stdout('cyan', k)
      } else {
        return k
      }
    }).join(' ')

    const description = this.#highlight(pkg.description)
    let name
    if (this.#args.includes(pkg.name)) {
      name = color.stdout('cyan', pkg.name)
    } else {
      name = this.#highlight(pkg.name)
      name = color.stdout('blue', name)
    }

    if (description.length) {
      output = `${name}\n${description}\n`
    } else {
      output = `${name}\n`
    }
    if (pkg.publisher) {
      output += `Version ${color.stdout('blue', pkg.version)} published ${color.stdout('blue', pkg.date)} by ${color.stdout('blue', pkg.publisher)}\n`
    } else {
      output += `Version ${color.stdout('blue', pkg.version)} published ${color.stdout('blue', pkg.date)} by ${color.stdout('yellow', '???')}\n`
    }
    output += `Maintainers: ${pkg.authors}\n`
    if (keywords) {
      output += `Keywords: ${keywords}\n`
    }
    output += `${color.stdout('blue', `https://npm.im/${pkg.name}`)}\n`
    return super.write(output)
  }

  #highlight (input) {
    let output = input
    for (const arg of this.#args) {
      let i = output.toLowerCase().indexOf(arg)
      while (i > -1) {
        const highlit = color.stdout('cyan', output.slice(i, i + arg.length))
        output = [
          output.slice(0, i),
          highlit,
          output.slice(i + arg.length),
        ].join('')
        i = output.toLowerCase().indexOf(arg, i + highlit.length)
      }
    }
    return output
  }
}
