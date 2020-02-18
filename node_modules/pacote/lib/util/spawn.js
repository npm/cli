const { spawn } = require('child_process')
module.exports = (cmd, args, options, ermsg) => new Promise((res, rej) => {
  if (!ermsg)
    ermsg = `failed '${[cmd].concat(args).join(' ')}'`
  const proc = spawn(cmd, args, options)
  const stdout = []
  const stderr = []
  proc.on('error',
    /* istanbul ignore next: node 8 just throws from spawn() */
    er => withStdio(rej, er, stdout, stderr))
  if (proc.stdout) {
    proc.stdout.on('data', c => stdout.push(c))
    proc.stdout.on('error', er => withStdio(rej, er, stdout, stderr))
  }
  if (proc.stderr) {
    proc.stderr.on('data', c => stderr.push(c))
    proc.stderr.on('error', er => withStdio(rej, er, stdout, stderr))
  }
  proc.on('close', (code, signal) => {
    if (code || signal)
      return withStdio(rej, Object.assign(new Error(ermsg), {
        cmd,
        args,
        code,
        signal,
      }), stdout, stderr)
    withStdio(res, { cmd, args }, stdout, stderr)
  })
})

const withStdio = (resrej, obj, stdout, stderr) => {
  return resrej(Object.assign(obj, {
    stdout: Buffer.concat(stdout).toString('utf8'),
    stderr: Buffer.concat(stderr).toString('utf8'),
  }))
}
