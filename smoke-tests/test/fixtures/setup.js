const fs = require('fs')
const { join, resolve, sep, basename } = require('path')
const which = require('which').sync
const http = require('http')
const spawn = require('@npmcli/promise-spawn')

const { SMOKE_PUBLISH_NPM, CI, PATH, TAP_CHILD_ID = '0' } = process.env
const PORT = 12345 + Number(TAP_CHILD_ID)
const log = CI ? console.error : () => {}
const registry = `http://localhost:${PORT}/`
const corgiDoc = 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'

const normalizePath = path => path.replace(/[A-Z]:/, '').replace(/\\/g, '/')

const cwd = resolve(__dirname, '..', '..', '..')
const npmCli = join('bin', 'npm-cli.js')
const execArgv = SMOKE_PUBLISH_NPM ? ['npm'] : [process.execPath, join(cwd, npmCli)]
const npmDir = SMOKE_PUBLISH_NPM ? fs.realpathSync(which('npm')).replace(sep + npmCli, '') : cwd

module.exports = (t) => {
  // setup fixtures
  const path = t.testdir({
    '.npmrc': '',
    cache: {},
    project: {},
    bin: {},
  })
  const localPrefix = resolve(path, 'project')
  const userconfigLocation = resolve(path, '.npmrc')
  const cacheLocation = resolve(path, 'cache')
  const binLocation = resolve(path, 'bin')

  // setup server
  let server = null
  t.before(() => new Promise((resolvePromise) => {
    server = http.createServer((req, res) => {
      res.setHeader('connection', 'close')

      const f = join(__dirname, join('/', req.url.replace(/@/, '').replace(/%2f/i, '/')))

      // a magic package that causes us to return an error that will be logged
      if (basename(f) === 'fail_reflect_user_agent') {
        res.statusCode = 404
        res.setHeader('npm-notice', req.headers['user-agent'])
        return res.end()
      }

      const isCorgi = req.headers.accept.includes('application/vnd.npm.install-v1+json')
      const file = f + (
        isCorgi && fs.existsSync(`${f}.min.json`) ? '.min.json'
        : fs.existsSync(`${f}.json`) ? '.json'
        : fs.existsSync(`${f}/index.json`) ? 'index.json'
        : ''
      )

      try {
        const body = fs.readFileSync(file)
        res.setHeader('content-length', body.length)
        res.setHeader('content-type', /\.min\.json$/.test(file) ? corgiDoc
          : /\.json$/.test(file) ? 'application/json'
          : 'application/octet-stream')
        res.end(body)
      } catch {
        res.statusCode = 500
        res.setHeader('content-type', 'text/plain')
        res.end('bad')
      }
    }).listen(PORT, resolvePromise)
  }))
  t.teardown(() => server.close())

  // update notifier should never be written
  t.afterEach((t) => {
    const updateExists = fs.existsSync(join(cacheLocation, '_update-notifier-last-checked'))
    t.equal(updateExists, false)
  })

  t.cleanSnapshot = s =>
    s
    // sometimes we print normalized paths in snapshots regardless of
    // platform so replace those first
      .split(normalizePath(npmDir))
      .join('{CWD}')
      .split(normalizePath(cwd))
      .join('{CWD}')
      .split(registry)
      .join('https://registry.npmjs.org/')
      .split(normalizePath(process.execPath))
      .join('node')
    // then replace platform style paths
      .split(npmDir)
      .join('{CWD}')
      .split(cwd)
      .join('{CWD}')
      .replace(/\\+/g, '/')
      .replace(/\r\n/g, '\n')
      .replace(/ \(in a browser\)/g, '')
      .replace(/^npm@.* /gm, 'npm ')
      .replace(/^.*debug-[0-9]+.log$/gm, '')

  const exec = async (...args) => {
    const cmd = []
    const opts = [
    `--registry=${registry}`,
    `--cache=${cacheLocation}`,
    `--userconfig=${userconfigLocation}`,
    '--no-audit',
    '--no-update-notifier',
    '--loglevel=silly',
    ]
    for (const arg of args) {
      if (arg.startsWith('--')) {
        opts.push(arg)
      } else {
        cmd.push(arg)
      }
    }

    const hasWorkspaceOpt = opts.some(o => /^--workspaces?($|=)/.test(o))
    // XXX: not sure why outdated fails with no-workspaces but works without it
    if (!hasWorkspaceOpt && cmd[0] !== 'outdated') {
    // This is required so we dont detect any workspace roots above the testdir
      opts.push('--no-workspaces')
    }

    const spawnArgs = [execArgv[0], [...execArgv.slice(1), ...cmd, ...opts]]
    log([spawnArgs[0], ...spawnArgs[1]].join('\n'))

    const res = await spawn(...spawnArgs, {
      cwd: localPrefix,
      env: {
        HOME: path,
        PATH: `${PATH}:${binLocation}`,
        COMSPEC: process.env.COMSPEC,
      },
    })

    log(res.stderr)
    return res.stdout
  }

  const readFile = (f) => fs.readFileSync(resolve(localPrefix, f), 'utf-8')
  const writeFile = (f, d) => fs.writeFileSync(resolve(localPrefix, f), d, 'utf-8')
  const rmDir = () => {
    for (const f of fs.readdirSync(localPrefix)) {
      fs.rmSync(join(localPrefix, f), { recursive: true, force: true })
    }
  }

  return {
    exec,
    readFile,
    writeFile,
    rmDir,
    isSmokePublish: !!SMOKE_PUBLISH_NPM,
  }
}
