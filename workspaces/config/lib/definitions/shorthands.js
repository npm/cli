
// aliases where they get expanded into a completely different thing
// these are NOT supported in the environment or npmrc files, only
// expanded on the CLI.
// TODO: when we switch off of nopt, use an arg parser that supports
// more reasonable aliasing and short opts right in the definitions set.

module.exports = {
  'enjoy-by': ['--before'],
  d: ['--loglevel', 'info'],
  dd: ['--loglevel', 'verbose'],
  ddd: ['--loglevel', 'silly'],
  quiet: ['--loglevel', 'warn'],
  q: ['--loglevel', 'warn'],
  s: ['--loglevel', 'silent'],
  silent: ['--loglevel', 'silent'],
  verbose: ['--loglevel', 'verbose'],
  desc: ['--description'],
  help: ['--usage'],
  local: ['--no-global'],
  n: ['--no-yes'],
  no: ['--no-yes'],
  porcelain: ['--parseable'],
  readonly: ['--read-only'],
  reg: ['--registry'],
}
