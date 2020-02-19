const { promisify } = require('util')
const { resolve, dirname } = require('path')
const fs = require('fs')
const lstat = promisify(fs.lstat)
const throwNonEnoent = er => { if (er.code !== 'ENOENT') throw er }

const cmdShim = require('cmd-shim')
const readCmdShim = require('read-cmd-shim')

const fixBin = require('./fix-bin.js')

const failEEXIST = ({path, to, from}) =>
  Promise.reject(Object.assign(new Error('EEXIST: file already exists'), {
    path: to,
    dest: from,
    code: 'EEXIST',
  }))

const handleReadCmdShimError = ({er, from, to}) =>
  er.code === 'ENOENT' ? null
  : er.code === 'ENOTASHIM' ? failEEXIST({from, to})
  : Promise.reject(er)

const SKIP = Symbol('skip - missing or already installed')
const shimBin = ({path, to, from, absFrom, force}) => {
  const shims = [
    to,
    to + '.cmd',
    to + '.ps1',
  ]
  return Promise.all([
    ...shims,
    absFrom,
  ].map(f => lstat(f).catch(throwNonEnoent))).then((stats) => {
    const [
      stToBase,
      stToCmd,
      stToPs1,
      stFrom,
    ] = stats
    if (!stFrom)
      return SKIP

    if (force)
      return

    return Promise.all(shims.map((s, i) => [s, stats[i]]).map(([s, st]) => {
      if (!st)
        return
      return readCmdShim(s)
        .then(target => {
          target = resolve(dirname(to), target)
          if (target.indexOf(resolve(path)) !== 0)
            return failEEXIST({from, to, path})
        }, er => handleReadCmdShimError({er, from, to}))
    }))
  })
  .then(skip => skip !== SKIP && doShim(absFrom, to))
}

const doShim = (absFrom, to) =>
  cmdShim(absFrom, to).then(() => fixBin(absFrom))

module.exports = shimBin
