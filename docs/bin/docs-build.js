const fs = require('fs').promises
const marked = require('marked-man')
const { version: VERSION } = require('../lib/npm.js')

function frontmatter (_, p1) {
  const fm = {}

  p1.split(/\r?\n/).forEach((kv) => {
    const result = kv.match(/^([^\s:]+):\s*(.*)/)
    if (result) {
      fm[result[1]] = result[2]
    }
  })

  return `# ${fm.title}(${fm.section}) - ${fm.description}`
}

function replacer (_, p1) {
  return 'npm help ' + p1.replace(/npm /, '')
}

const run = async (src, dest = src) => {
  const data = await fs.readFile(src, 'utf8')

  const result = data.replace(/@VERSION@/g, VERSION)
    .replace(/^<!--.*-->$/gm, '')
    .replace(/^---\n([\s\S]+\n)---/, frontmatter)
    .replace(/\[([^\]]+)\]\(\/commands\/([^)]+)\)/g, replacer)
    .replace(/\[([^\]]+)\]\(\/configuring-npm\/([^)]+)\)/g, replacer)
    .replace(/\[([^\]]+)\]\(\/using-npm\/([^)]+)\)/g, replacer)
    .trim()

  await fs.writeFile(dest, marked(result), 'utf8')
}

run(...process.argv.slice(2)).catch((err) => {
  process.exitCode = 1
  console.error(err)
})
