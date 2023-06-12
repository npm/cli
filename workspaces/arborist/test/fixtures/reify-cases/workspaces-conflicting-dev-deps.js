// generated from test/fixtures/workspaces-simple
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    ajv: {
      'package.json': JSON.stringify({
        name: 'ajv',
        version: '6.10.2',
      }),
    }
  },
  "a": {
    "package.json": JSON.stringify({
      "name": "a",
      "version": "1.0.0",
      "devDependencies": {
        "ajv": "4.11.2"
      }
    }),
    "node_modules": {
      ajv: {
        'package.json': JSON.stringify({
          name: 'ajv',
          version: '4.11.2',
        }),
      }  
    },
  },
  "package.json": JSON.stringify({
    "name": "workspace-conflicting-dev-deps",
    "devDependencies": {
      "ajv": "6.10.2"
    },
    "workspaces": [
      "a"
    ]
  })
})
  return path
}
