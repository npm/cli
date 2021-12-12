const { resolve, basename, dirname } = require('path')
const path = resolve(__dirname, process.argv[2])

const { readFileSync: readFile, writeFileSync: writeFile } = require('fs')
const contents = JSON.parse(readFile(path))

const keep = Object.keys(contents.time).filter(key => !['created', 'updated'].includes(key))

for (const version in contents.versions) {
  if (!keep.includes(version))
    delete contents.versions[version]
}

writeFile(path, JSON.stringify(contents, null, 2))

const minifiedPath = resolve(__dirname, `${basename(process.argv[2], '.json')}.min.json`)
const minifiedContents = JSON.parse(readFile(minifiedPath))

for (const version in minifiedContents.versions) {
  if (!keep.includes(version))
    delete minifiedContents.versions[version]
}

writeFile(minifiedPath, JSON.stringify(minifiedContents, null, 2))
