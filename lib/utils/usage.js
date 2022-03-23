const aliases = require('./cmd-list').aliases

module.exports = function usage (cmd, txt) {
  const post = Object.keys(aliases).reduce(function (p, c) {
    var val = aliases[c]
    if (val !== cmd) {
      return p
    }
    return p.concat(c)
  }, [])

  if (post.length > 0) {
    txt += '\n\n'
  }

  if (post.length === 1) {
    txt += 'alias: '
    txt += post.join(', ')
  } else if (post.length > 1) {
    txt += 'aliases: '
    txt += post.join(', ')
  }

  return txt
}
