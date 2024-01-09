const npa = require('npm-package-arg')
const lock = require('./package-lock.json')
const results = {}
for (const [name, entry] of Object.entries(lock.dependencies)) {
  results[name] = {
    version: entry.version,
    from: entry.from,
    resolved: entry.resolved,
    parsed: {
      version: npa.resolve(name, entry.version),
      from: entry.from ? npa.resolve(name, entry.from) : null
    }
  }
}

console.log(require('tcompare').format(results))
