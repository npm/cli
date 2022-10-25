const { join } = require('path')
const { promisify } = require('util')
const glob = promisify(require('glob'))
const log = require('proc-log')
const { npm, run } = require('./util')

const main = async (pkgNames) => {
  for (const name of pkgNames) {
    const { path } = await npm.query(`#${name}`).then(r => r[0])
    const binding = await glob(join(path, '**', 'binding.node'))
    log.info(name, binding)
    if (!binding.length) {
      await npm('rebuild', name)
    } else {
      log.info(`skipping ${name}, already built`)
    }
  }
}

run(({ argv }) => main(argv.remain))
