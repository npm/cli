// generated from test/fixtures/tarball-dependencies
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "dependencies": {
      "@isaacs/testing-file-transitive-a": "file:testing-file-transitive-a/isaacs-testing-file-transitive-a-1.0.0.tgz"
    }
  }),
  "testing-file-transitive-a": {
    "c": {
      "isaacs-testing-file-transitive-c-1.0.0.tgz": Buffer.from("H4sIAAAAAAAAE+3PvQrDIBAH8Mw+hTjX5CSJQ6e+yiE22A8TPJOl9N2rBDplKQ2Ugr/lfxyn3E1orjjYZlqzvtDoq50BgO46vtXPlAJetb1OhdaQ5lLRtzrl3otsmSliSKt8+896C3/nn3gwzoXHuxVHLk6OEA010VJ0fpBnd7MyBvTkolusNOKQxxcbyI0+v1A11CDYk/36jqIoiuIzLyENS+YACAAA", 'base64'),
      "package.json": JSON.stringify({
        "name": "@isaacs/testing-file-transitive-c",
        "version": "1.0.0"
      })
    },
    "isaacs-testing-file-transitive-a-1.0.0.tgz": Buffer.from("H4sIAAAAAAAAEytITM5OTE/VT9YvgLD0sorz8xioCgwMDMxMTBSwiYOAoaGBAoOxqRmQYWZmAFQHZJibAcUMqOsM7KC0uCSxCOgUSs2B+EUBTg8RUM2loKCUl5ibqmSloOSQWZyYmFysX5JaXJKZl66blpmTqltSlJhXnFmSWZaqm6ykA1JellpUnJmfB9JhqGegZ6DEVcs10P4YBeQBaK6nYe4nmP9NzA0x8r+p6Wj+pwsgKf8n4sj/YNGU1ILUvJTUvOTM1GKgFMhgBcJGJoFMAQla6enhVqQPMUUXpwJdsEP0StKrwI4hwuJkhMXAyo+A+clI5gONrx0+BV4BvP4nPghItYNA/jcyxaj/zQ2NRvM/XYB8NweEIfz2/F6uwwoC7B/O2LVaXH+i0um8fN8pRbMb/MI2k5d+ubuaxSpVk3dK0/6n9TLL7/hmrLO4kRa1ed+FF6vnMja8s9p39fwUprite/1ar014FnRxu9XTe905MzWTPFbX/D5fxV3/fH6FwbnW47tF3fX8+gR4TS8GldRNSC/fbMT25cmi6DUmjyYcF5c+0Wu3P8D0isKNyX9/9S3S6HpkrK/I6/2MgWNgw2gUjIJRMAqGIwAA1bKAQAAQAAA=", 'base64'),
    "package.json": JSON.stringify({
      "name": "@isaacs/testing-file-transitive-a",
      "version": "1.0.0",
      "dependencies": {
        "@isaacs/testing-file-transitive-b": "file:../testing-file-transitive-b/isaacs-testing-file-transitive-b-1.0.0.tgz",
        "@isaacs/testing-file-transitive-c": "file:./c/isaacs-testing-file-transitive-c-1.0.0.tgz"
      }
    })
  },
  "testing-file-transitive-b": {
    "isaacs-testing-file-transitive-b-1.0.0.tgz": Buffer.from("H4sIAAAAAAAAE+3PvQrDIBAH8Mw+hThXc5LEoVNf5RpssB8meDZL6btXCXTKUhooBX/L/zhOuZuwv+Bg62lJdabRVxsDANO2fK2faQ28ajqTCmMgzaWia0zKrRdZc6eIIa3y7T/LLfydf+LBOBceb1bsuTg4Quypjpai84M8uauVMaAnF91s5VHs8vhsA7nR5xdagQLBnuzXdxRFURSfeQFIxQHtAAgAAA==", 'base64'),
    "package.json": JSON.stringify({
      "name": "@isaacs/testing-file-transitive-b",
      "version": "1.0.0"
    })
  }
})
  return path
}
