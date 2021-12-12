// generated from test/fixtures/prune-actual-omit-dev
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    "abbrev": {
      "package.json": JSON.stringify({
        "name": "abbrev",
        "version": "1.1.1"
      })
    },
    "once": {
      "package.json": JSON.stringify({
        "name": "once",
        "version": "1.4.0",
        "dependencies": {
          "wrappy": "1"
        }
      })
    },
    "wrappy": {
      "package.json": JSON.stringify({
        "name": "wrappy",
        "version": "1.0.2"
      })
    }
  },
  "package.json": JSON.stringify({
    "name": "prune-actual",
    "version": "1.0.0",
    "devDependencies": {
      "once": "^1.4.0"
    }
  })
})
  return path
}
