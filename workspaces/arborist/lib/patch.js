// Native dependency patching helpers shared across build-ideal-tree and reify.
// Patches are plain unified diffs (git apply-compatible) and are applied with
// jsdiff using a fuzz factor of 0 so that any context drift fails loudly.
const { applyPatch, parsePatch } = require('diff')
const ssri = require('ssri')
const fs = require('node:fs')
const { promises: fsp } = fs
const { resolve, dirname } = require('node:path')

// Compute the SSRI integrity of a patch file's contents.
// Accepts a string or Buffer and returns a sha512 SSRI string.
const patchIntegrity = data =>
  ssri.fromData(Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8'), {
    algorithms: ['sha512'],
  }).toString()

// Strip a leading git-style "a/" or "b/" prefix from a diff path.
const stripPrefix = file => {
  if (!file || file === '/dev/null') {
    return file
  }
  return file.replace(/^[ab]\//, '')
}

// True when a diff path points at /dev/null, signalling a file add or delete.
const isDevNull = file => !file || file === '/dev/null' || /(^|\/)\.dev\/null$/.test(file)

// Apply a single parsed file patch under cwd.
// Handles modified, added (--- /dev/null) and deleted (+++ /dev/null) files.
const applyFilePatch = async (filePatch, cwd) => {
  const oldFile = stripPrefix(filePatch.oldFileName)
  const newFile = stripPrefix(filePatch.newFileName)
  const isAdd = isDevNull(filePatch.oldFileName)
  const isDelete = isDevNull(filePatch.newFileName)

  if (isDelete) {
    await fsp.rm(resolve(cwd, oldFile), { force: true })
    return
  }

  const target = resolve(cwd, newFile)

  let source = ''
  let mode
  if (!isAdd) {
    source = await fsp.readFile(target, 'utf8')
    mode = (await fsp.stat(target)).mode
  }

  // fuzzFactor 0: any context mismatch returns false and is treated as fatal.
  const patched = applyPatch(source, filePatch, { fuzzFactor: 0 })
  if (patched === false) {
    throw Object.assign(
      new Error(`patch could not be applied to ${newFile}`),
      { code: 'EPATCHFAILED', file: newFile }
    )
  }

  await fsp.mkdir(dirname(target), { recursive: true })
  await fsp.writeFile(target, patched)
  if (mode !== undefined) {
    await fsp.chmod(target, mode)
  }
}

// Apply a unified diff to the package extracted at `cwd`.
// `patch` is the raw diff contents (string or Buffer).
// Throws with code EPATCHFAILED on any hunk or file that cannot be applied.
const applyPatchToDir = async ({ patch, cwd }) => {
  const filePatches = parsePatch(patch.toString('utf8'))
  for (const filePatch of filePatches) {
    // jsdiff emits an empty trailing patch for some inputs; skip those.
    if (!filePatch.hunks.length && isDevNull(filePatch.oldFileName) && isDevNull(filePatch.newFileName)) {
      continue
    }
    await applyFilePatch(filePatch, cwd)
  }
}

module.exports = {
  applyPatchToDir,
  patchIntegrity,
}
