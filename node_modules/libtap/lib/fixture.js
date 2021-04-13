const {writeFileSync, linkSync, statSync, symlinkSync} = require('fs')
const {mkdirRecursiveSync} = require('../settings')
const {resolve, dirname} = require('path')

class Fixture {
  constructor (type, content) {
    this.type = type
    this.content = content
    switch (type) {
      case 'dir':
        if (!content || typeof content !== 'object')
          throw new TypeError('dir fixture must have object content')
        break
      case 'file':
        if (typeof content !== 'string' && !Buffer.isBuffer(content))
          throw new TypeError('file fixture must have string/buffer content')
        break
      case 'link':
      case 'symlink':
        if (typeof content !== 'string')
          throw new TypeError(type + ' fixture must have string target')
        break
      default:
        throw new Error('invalid fixture type: ' + type)
    }
  }

  get [Symbol.toStringTag] () {
    return 'Fixture<' + this.type + '>'
  }

  // have to gather up symlinks for the end
  static make (abs, f, symlinks = null) {
    if (typeof f === 'string' || Buffer.isBuffer(f))
      f = new Fixture('file', f)
    else if (f && typeof f === 'object' && !(f instanceof Fixture))
      f = new Fixture('dir', f)
    else if (!(f instanceof Fixture))
      throw new Error('invalid fixture type: ' + f)

    const isRoot = symlinks === null
    symlinks = symlinks || {}

    switch (f.type) {
      case 'symlink':
        // have to gather up symlinks for the end, because windows
        symlinks[abs] = f.content
        break
      case 'link':
        linkSync(resolve(dirname(abs), f.content), abs)
        break
      case 'dir':
        mkdirRecursiveSync(abs)
        for (const [name, fixture] of Object.entries(f.content))
          Fixture.make(`${abs}/${name}`, fixture, symlinks)
        break
      case 'file':
        writeFileSync(abs, f.content)
        break
    }

    // create all those symlinks we were asked for
    if (isRoot) {
      for (const [abs, target] of Object.entries(symlinks)) {
        symlinkSync(target, abs, isDir(abs, target) ? 'junction' : 'file')
      }
    }
  }
}

// check if a symlink target is a directory
const isDir = (abs, target) => {
  try {
    return statSync(resolve(dirname(abs), target)).isDirectory()
  } catch (er) {
    return false
  }
}

module.exports = Fixture
