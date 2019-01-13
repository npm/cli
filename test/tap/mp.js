"use strict"
const common  = require("../common-tap.js")
const path = require("path")
const mr = require('npm-registry-mock')
const fs = require('graceful-fs')
const test = require("tap").test
const rimraf = require("rimraf")
const basePath = path.resolve(__dirname, path.basename(__filename, ".js"))
const fixturePath = path.resolve(basePath, "npm-test-files")
const testDirPath = path.resolve(fixturePath, "npm-test-mp")
const Tacks = require("tacks")
const File = Tacks.File
const Dir = Tacks.Dir

const jsFile1 = "require('uninstalledDep1')"
const jsFile2 = "require('dep1'); require('dep2')"
const jsFile3 = "require('dep1'); require('dep3')"
const jsFile4 = "require('underscore')"

let server

test("setup", (t) => {
  cleanup()

  mr({ port: common.port }, (err, s) => {
    t.ifError(err)
    server = s
    t.end()
  })
})

test("mp check simple file", (t) => {
  const fixture = new Tacks(Dir({
    "npm-test-mp": Dir({
      "package.json": File({
        name: "npm-test-mp",
        version: "1.0.0",
        dependencies: {
          dep1: "installedDep1"
        }
      }),
      "file1.js": File(jsFile1)
    })
  }))

  withFixture(t, fixture, (done) => {
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

test("mp c (check) simple file", (t) => {
  const fixture = new Tacks(Dir({
    "npm-test-mp": Dir({
      "package.json": File({
        name: "npm-test-mp",
        version: "1.0.0",
        dependencies: {
          dep1: "installedDep1"
        }
      }),
      "file1.js": File(jsFile1)
    })
  }))

  withFixture(t, fixture, (done) => {
    common.npm(["mp", "c", "./file1.js"], {
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

test("mp check folder", (t) => {
  const fixture = new Tacks(Dir({
    "npm-test-mp": Dir({
      "package.json": File({
        name: "npm-test-mp",
        version: "1.0.0",
        dependencies: {
          dep1: "installedDep1"
        }
      }),
      "file2.js": File(jsFile2),
      "file3.js": File(jsFile3)
    })
  }))

  withFixture(t, fixture, (done) => {
    common.npm(["mp", "check", "."], {
      cwd: testDirPath
    }, function(err, code, stdout, stderr) {
      t.ifErr(err, "mp succeeded")
      t.equal(0, code, "exit 0 on mp")
      // Removes special characters and emojis
      const message = stdout.trim().substr(3)
      t.same(message, "Package(s) to install: dep2,dep3")
      done()
    })
  })
})

test("mp check folder but all installed", (t) => {
  const fixture = new Tacks(Dir({
    "npm-test-mp": Dir({
      "package.json": File({
        name: "npm-test-mp",
        version: "1.0.0",
        dependencies: {
          dep1: "installedDep1",
          dep2: "installedDep2",
          dep3: "installedDep3"
        }
      }),
      "file2.js": File(jsFile2),
      "file3.js": File(jsFile3)
    })
  }))

  withFixture(t, fixture, (done) => {
    common.npm(["mp", "check", "."], {
      cwd: testDirPath
    }, function(err, code, stdout, stderr) {
      t.ifErr(err, "mp succeeded")
      t.equal(0, code, "exit 0 on mp")
      // Removes special characters and emojis
      const message = stdout.trim().substr(2)
      t.same(message, "No package to install")
      done()
    })
  })
})

test("mp install missing deps in file", (t) => {
  let runner

  const fixture = new Tacks(Dir({
    "npm-test-mp": Dir({
      "package.json": File({
        name: "npm-test-mp",
        version: "1.0.0",
        dependencies: {
          dep1: "installedDep1",
        }
      }),
      "file4.js": File(jsFile4)
    })
  }))

  withFixture(t, fixture, (done) => {
    runner = common.npm(["mp", "install", "file4.js"], {
      cwd: testDirPath
    }, (err, code, stdout, stderr) => {
      t.ifErr(err, "mp install succeeded")
      t.equal(code, 0, "exit 0 on mp install")
      const packageJsonPath = path.resolve(testDirPath, "package.json")
      const installedDeps = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")).dependencies
      const expected = ["dep1", "underscore"]

      t.same(Object.keys(installedDeps), expected)
      done()
    })

    let remaining = 3

    runner.stdout.on("data", (chunk) => {
      remaining--

      if (remaining === 2) {
        runner.stdin.write("y")
        runner.stdin.end()
      } else if(remaining === 0) {
        // Removes special characters and emojis
        const message = chunk.toString('utf8').trim().substr(2)
        t.equal(message, "Packages installed !")
      }
    })
  })
})

test("cleanup", (t) => {
  server.close()
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
    t.end()
  }
}