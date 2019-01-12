'use strict'
const common  = require("../common-tap.js")
const path = require("path")
const test = require("tap").test
const rimraf = require("rimraf")
const basePath = path.resolve(__dirname, path.basename(__filename, ".js"))
const fixturePath = path.resolve(basePath, "npm-test-files")
const testDirPath = path.resolve(fixturePath, "npm-test-mp")
const Tacks = require('tacks')
const File = Tacks.File
const Dir = Tacks.Dir

const jsFile1 = "require('uninstalledDep1')"

test("setup", function (t) {
  cleanup()
  t.end()
})

test("mp check simple file", function(t) {
  const fixture = new Tacks(
    Dir({
      "npm-test-mp": Dir({
        "package.json": File({
          name: "npm-test-mp",
          version: "1.0.0",
          dependencies: {
            "dep1": "installedDep1"
          }
        }),
        "file1.js": File(jsFile1)
      })
    })
  )

  withFixture(t, fixture, function(done) {
    common.npm(["mp", "check", "./file1.js"], {
      cwd: testDirPath
    }, function(err, code, stdout, stderr) {
      t.ifErr(err, "mp succeeded")
      t.equal(0, code, "exit 0 on mp")
      // Removes special characters and emojis
      const message = stdout.trim().substr(3)
      t.same(message, "Package(s) to install: uninstalledDep1")
      done()
    })
  })
})

test("cleanup", function (t) {
  cleanup()
  t.end()
})

function cleanup () {
  rimraf.sync(basePath)
}

function withFixture (t, fixture, tester) {
  fixture.create(fixturePath)

  tester(removeAndDone)

  function removeAndDone (err) {
    if (err) throw err
    fixture.remove(fixturePath)
    rimraf.sync(basePath)
    t.done()
  }
}