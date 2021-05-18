const fs = require('fs')
const { promisify } = require('util')
const execAsync = promisify(require('child_process').exec)
const { resolve } = require('path')
const t = require('tap')

const normalizePath = path => path.replace(/[A-Z]:/, '').replace(/\\/g, '/')
const cwd = normalizePath(process.cwd())
t.cleanSnapshot = s => s.split(cwd).join('{CWD}')
  .split(registry).join('https://registry.npmjs.org/')
  .split(normalizePath(process.execPath)).join('node')
  .split(process.cwd()).join('{CWD}')
  .replace(/\\+/g, '/')
  .replace(/\r\n/g, '\n')
  .replace(/\ \(in a browser\)/g, '')
  .replace(/^npm@.*\ /mg, 'npm ')

// setup server
const { start, stop, registry } = require('./server.js')
t.before(start)
t.teardown(stop)

// setup fixtures
const path = t.testdir({
  '.npmrc': '',
  cache: {},
  project: {},
  bin: {},
})
const localPrefix = resolve(path, 'project')
const userconfigLocation = resolve(path, '.npmrc')
const npmLocation = resolve(__dirname, '..')
const cacheLocation = resolve(path, 'cache')
const binLocation = resolve(path, 'bin')
const env = {
  HOME: path,
  PATH: `${process.env.PATH}:${binLocation}`,
}
const npmOpts = `--registry=${registry} --cache="${cacheLocation}" --userconfig="${userconfigLocation}" --no-audit --no-update-notifier --loglevel=silly`
const npmBin = `"${process.execPath}" "${npmLocation}" ${npmOpts}`
const exec = async cmd => {
  const res = await execAsync(cmd, { cwd: localPrefix, env })
  if (res.stderr)
    console.error(res.stderr)
  return String(res.stdout)
}
const readFile = filename =>
  String(fs.readFileSync(resolve(localPrefix, filename)))

t.test('npm init', async t => {
  const cmd = `${npmBin} init -y`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes, 'should have successful npm init result')
  const pkg = JSON.parse(fs.readFileSync(resolve(localPrefix, 'package.json')))
  t.equal(pkg.name, 'project', 'should have expected generated name')
  t.equal(pkg.version, '1.0.0', 'should have expected generated version')
})

t.test('npm (no args)', async t => {
  const cmd = `"${process.execPath}" "${npmLocation}" --no-audit --no-update-notifier`
  const cmdRes = await execAsync(cmd, { cwd: localPrefix, env })
    .catch(err => {
      t.equal(err.code, 1, 'should exit with error code')
      return err
    })

  t.equal(cmdRes.stderr, '', 'should have no stderr output')
  t.matchSnapshot(String(cmdRes.stdout),
    'should have expected no args output')
})

t.test('npm install prodDep@version', async t => {
  const cmd = `${npmBin} install abbrev@1.0.4`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes.replace(/in.*s/, ''),
    'should have expected install reify output')
  t.matchSnapshot(
    readFile('package.json'),
    'should have expected package.json result'
  )
  t.matchSnapshot(
    readFile('package-lock.json'),
    'should have expected lockfile result'
  )
})

t.test('npm install dev dep', async t => {
  const cmd = `${npmBin} install -D promise-all-reject-late`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes.replace(/in.*s/, ''),
    'should have expected dev dep added reify output')
  t.matchSnapshot(
    readFile('package.json'),
    'should have expected dev dep added package.json result'
  )
  t.matchSnapshot(
    readFile('package-lock.json'),
    'should have expected dev dep added lockfile result'
  )
})

t.test('npm ls', async t => {
  const cmd = `${npmBin} ls`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes,
    'should have expected ls output')
})

t.test('npm fund', async t => {
  const cmd = `${npmBin} fund`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes,
    'should have expected fund output')
})

t.test('npm explain', async t => {
  const cmd = `${npmBin} explain abbrev`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes,
    'should have expected explain output')
})

t.test('npm diff', async t => {
  const cmd = `${npmBin} diff --diff=abbrev@1.0.4 --diff=abbrev@1.1.1`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes,
    'should have expected diff output')
})

t.test('npm outdated', async t => {
  const cmd = `${npmBin} outdated`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes,
    'should have expected outdated output')
})

t.test('npm set-script', async t => {
  const cmd = `${npmBin} set-script "hello" "echo Hello"`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes,
    'should have expected set-script output')
  t.matchSnapshot(
    readFile('package.json'),
    'should have expected script added package.json result'
  )
})

t.test('npm run-script', async t => {
  const cmd = `${npmBin} run hello`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes,
    'should have expected run-script output')
})

t.test('npm prefix', async t => {
  const cmd = `${npmBin} prefix`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes,
    'should have expected prefix output')
})

t.test('npm view', async t => {
  const cmd = `${npmBin} view abbrev@1.0.4`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes,
    'should have expected view output')
})

t.test('npm update dep', async t => {
  const cmd = `${npmBin} update abbrev`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes.replace(/in.*s/, ''),
    'should have expected update reify output')
  t.matchSnapshot(
    readFile('package.json'),
    'should have expected update package.json result'
  )
  t.matchSnapshot(
    readFile('package-lock.json'),
    'should have expected update lockfile result'
  )
})

t.test('npm uninstall', async t => {
  const cmd = `${npmBin} uninstall promise-all-reject-late`
  const cmdRes = await exec(cmd)

  t.matchSnapshot(cmdRes.replace(/in.*s/, ''),
    'should have expected uninstall reify output')
  t.matchSnapshot(
    readFile('package.json'),
    'should have expected uninstall package.json result'
  )
  t.matchSnapshot(
    readFile('package-lock.json'),
    'should have expected uninstall lockfile result'
  )
})
