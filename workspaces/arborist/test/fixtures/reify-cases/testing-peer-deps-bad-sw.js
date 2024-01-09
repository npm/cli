// generated from test/fixtures/testing-peer-deps-bad-sw
module.exports = t => {
  const path = t.testdir({
  "package-lock.json": `this isn't a shrinkwrap file

it isn't even json

what is it even doing here?
`,
  "package.json": JSON.stringify({
    "name": "@isaacs/testing-peer-deps",
    "version": "2.0.0",
    "description": "depends on b1, which has a peer dep on c1, and d, which has a regular dep on a2, which has a peer dep on b2 which has a peer dep on c2",
    "dependencies": {
      "@isaacs/testing-peer-deps-b": "1",
      "@isaacs/testing-peer-deps-d": "2"
    }
  })
})
  return path
}
