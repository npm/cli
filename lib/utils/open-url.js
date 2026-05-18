const { open } = require('@npmcli/promise-spawn')
const { output, input, META } = require('proc-log')
const { URL } = require('node:url')
const readline = require('node:readline')
const { copyToClipboard } = require('./clipboard.js')

const assertValidUrl = (url) => {
  try {
    if (!/^https?:$/.test(new URL(url).protocol)) {
      throw new Error()
    }
  } catch {
    throw new Error('Invalid URL: ' + url)
  }
}

const outputMsg = (json, title, url) => {
  if (json) {
    output.buffer({ title, url })
  } else {
    // These urls are sometimes specifically login urls so we have to turn off redaction to standard output
    output.standard(`${title}:\n${url}`, { [META]: true, redact: false })
  }
}

// attempt to open URL in web-browser, print address otherwise:
const openUrl = async (npm, url, title, isFile) => {
  url = encodeURI(url)
  const browser = npm.config.get('browser')
  const json = npm.config.get('json')

  if (browser === false) {
    outputMsg(json, title, url)
    return
  }

  // We pass this in as true from the help command so we know we don't have to check the protocol
  if (!isFile) {
    assertValidUrl(url)
  }

  try {
    await input.start(() => open(url, {
      command: browser === true ? null : browser,
    }))
  } catch (err) {
    if (err.code !== 127) {
      throw err
    }
    outputMsg(json, title, url)
  }
}

// Prompt to open URL in browser if possible, or copy it to clipboard with 'c'
const openUrlPrompt = async (npm, url, title, prompt, { signal }) => {
  const browser = npm.config.get('browser')
  const json = npm.config.get('json')

  assertValidUrl(url)
  outputMsg(json, title, url)

  if (browser === false || !process.stdin.isTTY || !process.stdout.isTTY) {
    return
  }

  try {
    await input.read(() => new Promise((resolve, reject) => {
      readline.emitKeypressEvents(process.stdin)

      const wasRaw = process.stdin.isRaw
      process.stdin.setRawMode(true)

      process.stdout.write(`${prompt}, or c to copy URL: `)

      const cleanup = () => {
        process.stdin.setRawMode(wasRaw)
        process.stdin.removeListener('keypress', onKeypress)
        if (signal) {
          signal.removeEventListener('abort', onAbort)
        }
        process.stdout.write('\n')
      }

      const onKeypress = (str, key) => {
        if (!key) {
          return
        }

        if (key.ctrl && key.name === 'c') {
          cleanup()
          reject(new Error('canceled'))
        } else if (key.name === 'c') {
          cleanup()
          copyToClipboard(url)
            .then(() => output.standard('Copied URL to clipboard!'))
            .catch(() => output.standard('Unable to copy URL to clipboard'))
            .then(resolve, reject)
        } else if (key.name === 'return' || key.name === 'enter') {
          cleanup()
          openUrl(npm, url, 'Browser unavailable. Please open the URL manually')
            .then(resolve, reject)
        }
      }

      const onAbort = () => {
        cleanup()
        const err = new Error('abort')
        err.name = 'AbortError'
        reject(err)
      }

      process.stdin.on('keypress', onKeypress)
      if (signal) {
        signal.addEventListener('abort', onAbort)
      }
    }))
  } catch (err) {
    if (err.name !== 'AbortError') {
      throw err
    }
  }
}

// Rearrange arguments and return a function that takes the two arguments returned from the npm-profile methods that take an opener
const createOpener = (npm, title, prompt = 'Press ENTER to open in the browser...') =>
  (url, opts) => openUrlPrompt(npm, url, title, prompt, opts)

module.exports = {
  openUrl,
  openUrlPrompt,
  createOpener,
}
