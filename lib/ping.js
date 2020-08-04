const fetch = require('npm-registry-fetch')
const log = require('npmlog')
const npm = require('./npm.js')
const output = require('./utils/output.js')
const usageUtil = require('./utils/usage.js')

const usage = usageUtil('ping', 'npm ping\nping registry')
const completion = require('./utils/completion/none.js')

const cmd = (args, cb) => ping(args).then(() => cb()).catch(cb)

const ping = async args => {
  const opts = npm.flatOptions
  const registry = opts.registry
  log.notice('PING', registry)
  const start = Date.now()
  const res = await fetch('/-/ping?write=true', opts)
  const details = await res.json().catch(() => ({}))
  const time = Date.now() - start
  log.notice('PONG', `${time / 1000}ms`)
  if (opts.json) {
    output(JSON.stringify({
      registry,
      time,
      details
    }, null, 2))
  } else if (Object.keys(details).length) {
    log.notice('PONG', `${JSON.stringify(details, null, 2)}`)
  }
}

module.exports = Object.assign(cmd, { completion, usage })
