// generated from test/fixtures/root-bundler
module.exports = t => {
  const path = t.testdir({
  "child": {
    "package.json": JSON.stringify({
      "name": "child",
      "version": "1.2.3"
    })
  },
  "child-1.2.3.tgz": Buffer.from("H4sIAAAAAAAAEytITM5OTE/VL4DQelnF+XkMVAYGBgZmJiYK2MTBwBQoZ2xqZmBoaGZmAGQDGaYmpkCa2g7BBkqLSxKLgE6h1ByIVxTg9BAB1VwKCkp5ibmpSlYKSskZmTkpSjogobLUouLM/DyQqKGekZ6xElct10C7dRSMglEwCkYB9QAA1wGLiwAIAAA=", 'base64'),
  "package-lock.json": JSON.stringify({
    "name": "root",
    "version": "1.2.3",
    "lockfileVersion": 1,
    "requires": true,
    "dependencies": {
      "child": {
        "version": "file:child-1.2.3.tgz",
        "integrity": "sha512-541DhKMZIYG6zQp9d5yFTw62pwGLKVnWK4zT9uBpQ/n2mZlzFbjgP68ifK5Qbi6bHfWiGSWoZITV3mwhRkSoTQ=="
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "root",
    "version": "1.2.3",
    "dependencies": {
      "child": "file:child-1.2.3.tgz"
    },
    "bundleDependencies": [
      "child"
    ]
  })
})
  return path
}
