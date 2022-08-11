// fetch a single package's packument, corgi, and specific tarball
const { resolve } = require('path')
const { writeFileSync } = require('fs')
const pacote = require('pacote')
const npa = require('npm-package-arg')

const dir = resolve(__dirname, 'content')

const main = async (raw) => {
  const spec = npa(raw)

  const packument = await pacote.packument(spec.name, { fullMetadata: true })
  const packumentFile = resolve(dir, spec.name.replace(/^@/, '') + '.json') 
  writeFileSync(packumentFile, JSON.stringify(packument, 0, 2))

  const corgi = await pacote.packument(spec.name, {})
  const corgiFile = resolve(dir, spec.name.replace(/^@/, '') + '.min.json')
  writeFileSync(corgiFile, JSON.stringify(corgi, 0, 2))

  if (spec.type === 'version') {
    const tarballUrl = packument.versions[spec.fetchSpec].dist.tarball
    const path = new URL(tarballUrl).pathname.replace(/^\/@?/, '')
    const tarballFile = resolve(dir, path)
    await pacote.tarball.file(tarballUrl, tarballFile)
  }
}

main(process.argv[2])
