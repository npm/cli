const { join } = require('node:path')
const { CWD, run, git, fs, EOL } = require('./util.js')

const main = async () => {
  const allAuthors = await git('log', '--use-mailmap', '--reverse', '--format=%aN <%aE>', {
    lines: true,
    quiet: true,
  })

  const authors = new Set()
  for (const author of allAuthors) {
    if (
      !author.includes('[bot]') &&
      !author.startsWith('npm team') &&
      !author.startsWith('npm CLI robot')
    ) {
      authors.add(author)
    }
  }

  return fs.writeFile(join(CWD, 'AUTHORS'), [
    `# Authors sorted by whether or not they're me`,
    ...authors,
  ].join(EOL))
}

run(main)
