// fetch all the deps and tarballs in a v2 lockfile
const pacote = require('pacote')
const url = require('url')
const { dirname, resolve } = require('path')
const fs = require('fs/promises')
const Arborist = require('./index.js')

const dir = resolve(__dirname, 'registry-mocks', 'content')
const nm = /^.*node_modules\/(@[^/]+\/[^/]+|[^@/][^/]*)$/

const main = async lock => {
  for (const [loc, meta] of Object.entries(lock.packages)) {
    if (!loc || meta.link || !nm.test(loc)) {
      continue
    }

    const name = meta.name || loc.replace(nm, '$1')

    console.error('FETCHING', name)

    const paku = await pacote.packument(name, { fullMetadata: true })
    const saveTo = resolve(dir, name.replace(/^@/, '') + '.json')
    await fs.mkdir(dirname(saveTo), { recursive: true })
    await fs.writeFile(saveTo, JSON.stringify(paku, 0, 2))

    const corgi = await pacote.packument(name, {})
    const corgiSaveTo = resolve(dir, name.replace(/^@/, '') + '.min.json')
    await fs.writeFile(corgiSaveTo, JSON.stringify(corgi, 0, 2))

    // bundled deps sometimes don't have a resolved value
    if (!meta.resolved) {
      continue
    }
    // eslint-disable-next-line node/no-deprecated-api
    const path = url.parse(meta.resolved).pathname.replace(/^\/@?/, '')
    const tgzFile = resolve(dir, path)
    await pacote.tarball.file(meta.resolved, tgzFile, { Arborist })
  }
  console.log('OK!')
}

main(require(resolve(process.argv[2])))
