// generated from test/fixtures/malformed-json
module.exports = t => {
  const path = t.testdir({
  "package.json": `{
  "name": "malformed-json",
  "devDependencies": {
    "abbrev": "^1.0.0",
  }
}
`
})
  return path
}
