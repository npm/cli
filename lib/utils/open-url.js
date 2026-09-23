const { open } = require('@npmcli/promise-spawn')
const { output, input, META } = require('proc-log')
const { URL } = require('node:url')

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

// Print the url and open it in the browser if the environment is interactive
const openUrlPrompt = async (npm, url, title) => {
  const browser = npm.config.get('browser')
  const json = npm.config.get('json')

  assertValidUrl(url)
  outputMsg(json, title, url)

  if (browser === false || !process.stdin.isTTY || !process.stdout.isTTY) {
    return
  }

  await openUrl(npm, url, 'Browser unavailable. Please open the URL manually')
}

// Rearrange arguments and return a function matching the opener signature expected by the npm-profile methods
const createOpener = (npm, title) =>
  (url) => openUrlPrompt(npm, url, title)

module.exports = {
  openUrl,
  openUrlPrompt,
  createOpener,
}
