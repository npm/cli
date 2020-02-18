// turn /@foo/bar/baz to node_modules/@foo/bar/node_modules/baz
const legacyLocationToRelpath = loc => {
  const re = /\/(@[^\/]+\/[^\/]+|[^@\/][^\/]*)/g
  let relpath = []
  let name
  while (name = re.exec(loc)) {
    relpath.push('node_modules/' + name[1])
  }
  return relpath.join('/')
}
module.exports = legacyLocationToRelpath
