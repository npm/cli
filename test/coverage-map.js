const full = process.env.npm_lifecycle_event === 'check-coverage'
const coverageMap = (filename) => {
  const { basename } = require('path')
  const testbase = basename(filename)
  if (full && testbase === 'load-all.js') {
    const glob = require('glob')
    const { resolve, relative } = require('path')
    const dir = resolve(__dirname, '../lib')
    return glob.sync(`${dir}/**/*.js`)
      .map(f => relative(process.cwd(), f))
  }
  if (testbase === 'load-all-commands.js') {
    const { cmdList } = require('../lib/utils/cmd-list.js')
    return cmdList.map(cmd => `lib/${cmd}.js`).concat('lib/utils/usage.js')
  }
  if (/windows-shims\.js$/.test(filename)) {
    // this one doesn't provide any coverage nyc can track
    return []
  }
  if (/^test\/(lib|bin)\//.test(filename))
    return filename.replace(/^test\//, '')
  return []
}

module.exports = coverageMap
