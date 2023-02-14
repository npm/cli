if (
  process.env.SMOKE_PUBLISH_NPM &&
  !require('semver').satisfies(process.version, require('../package.json').engines.node)
) {
  // The docs tooling is kept in sync between releases and dependencies that are not compatible
  // with the lower bound of npm@8 engines are used. When we run the SMOKE_PUBLISH_NPM we are
  // testing that npm is able to pack and install itself locally and then run its own smoke tests.
  // Packing will run this script automatically so in the cases where the node version is
  // not compatible, it is ok to bail on this script since the generated docs are not used in
  // the smoke tests.
  console.log(`Skipping docs build due to SMOKE_PUBLISH_NPM and ${process.version}`)
  return
}

const run = require('../lib/build.js')
const { paths } = require('../lib/index')

run(paths)
  .then((res) => console.log(`Wrote ${res.length} files`))
  .catch((err) => {
    process.exitCode = 1
    console.error(err)
  })
