const { spawn } = require('node:child_process')
const proc = require('node:process')

const spawnCopy = (cmd, args, text) => new Promise((resolve, reject) => {
  const child = spawn(cmd, args, { stdio: ['pipe', 'ignore', 'ignore'] })
  child.on('error', reject)
  child.on('close', (code) => {
    if (code === 0) {
      resolve()
    } else {
      reject(new Error(`${cmd} exited with code ${code}`))
    }
  })
  child.stdin.write(text)
  child.stdin.end()
})

const tryLinuxClipboard = async (text) => {
  const tools = []

  if (proc.env.WAYLAND_DISPLAY) {
    tools.push(['wl-copy', []])
  }

  if (proc.env.DISPLAY) {
    tools.push(['xclip', ['-selection', 'clipboard']])
    tools.push(['xsel', ['--clipboard', '--input']])
  }

  // Fallback: try all known tools regardless of env vars
  if (tools.length === 0) {
    tools.push(['wl-copy', []], ['xclip', ['-selection', 'clipboard']], ['xsel', ['--clipboard', '--input']])
  }

  for (const [cmd, args] of tools) {
    try {
      await spawnCopy(cmd, args, text)
      return
    } catch {
      // try next tool
    }
  }

  throw new Error('No clipboard tool available. Install xclip, xsel, or wl-copy.')
}

const copyToClipboard = (text) => {
  if (proc.platform === 'darwin') {
    return spawnCopy('pbcopy', [], text)
  }

  if (proc.platform === 'win32') {
    return spawnCopy('clip', [], text)
  }

  return tryLinuxClipboard(text)
}

module.exports = { copyToClipboard }
