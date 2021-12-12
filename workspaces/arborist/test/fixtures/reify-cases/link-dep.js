// generated from test/fixtures/link-dep
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    "linked-dep": t.fixture('symlink', "../target")
  },
  "package-lock.json": JSON.stringify({
    "name": "@isaacs/testing-link-dep",
    "version": "1.0.0",
    "lockfileVersion": 1,
    "requires": true,
    "dependencies": {
      "linked-dep": {
        "version": "file:target"
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "@isaacs/testing-link-dep",
    "version": "2.0.0",
    "dependencies": {
      "linked-dep": "file:target"
    }
  }),
  "target": {
    "package.json": JSON.stringify({
      "name": "linked-dep",
      "version": "1.2.3"
    })
  }
})
  return path
}
