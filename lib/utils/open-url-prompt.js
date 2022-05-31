const readline = require('readline')
const opener = require('opener')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const interactive = process.stdin.isTTY && process.stdout.isTTY

// Prompt to open URL in browser if possible
const promptOpen = async (npm, prompt, url, emitter) => {
  const browser = npm.config.get('browser')

  function printPrompt (title, url) {
    const json = npm.config.get('json')
    const message = json ? JSON.stringify({ title, url }) : `${title}: ${url}`

    npm.output(message)
  }

  printPrompt(npm, prompt, url)

  if (browser === false) {
    return
  }

  const tryOpen = await new Promise(resolve => {
    rl.question('Press ENTER to open in the browser...', () => {
      resolve(true)
    })

    if (emitter && emitter.addListener) {
      emitter.addListener('abort', () => {
        rl.close()

        // clear the prompt line
        npm.output('')

        resolve(false)
      })
    }
  })

  if (!tryOpen) {
    return
  }

  const command = browser === true ? null : browser
  await new Promise((resolve, reject) => {
    opener(url, { command }, err => {
      if (err) {
        return reject(err)
      }

      return resolve()
    })
  })
}

module.exports = promptOpen
