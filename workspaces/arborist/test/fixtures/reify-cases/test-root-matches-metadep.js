// generated from test/fixtures/test-root-matches-metadep
module.exports = t => {
  const path = t.testdir({
  "README.md": `When a root node matches a metadep being added to the tree, the
loop-detection link deduplication made in a lot of problems as a result of
the link going to the root node from the /virtual-tree temp tree,
ultimately resulting in the root node being reified in place and deleting
its existing contents (which is very bad!)
`,
  "do-not-delete-this-file": "",
  "package.json": JSON.stringify({
    "name": "test-root-matches-metadep",
    "version": "1.0.1",
    "dependencies": {
      "test-root-matches-metadep-x": "1.0.0",
      "test-root-matches-metadep-y": "1.0.0"
    }
  }),
  "x": {
    "package.json": JSON.stringify({
      "name": "test-root-matches-metadep-x",
      "version": "1.0.0",
      "dependencies": {
        "test-root-matches-metadep": "1.0.0"
      }
    })
  },
  "y": {
    "package.json": JSON.stringify({
      "name": "test-root-matches-metadep-y",
      "version": "1.0.0",
      "dependencies": {
        "test-root-matches-metadep": "1.0.1"
      }
    })
  }
})
  return path
}
