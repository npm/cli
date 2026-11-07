const { join } = require('node:path')
const { fs, gh, run } = require('./util.js')

const searchQuery = 'org:npm topic:npm-cli fork:true archived:false'

const fetchRepoNames = async () => {
  const repoNames = new Set()
  let page = 1

  while (true) {
    const result = await gh(
      'api',
      `search/repositories?q=${encodeURIComponent(searchQuery)}&per_page=100&page=${page}`,
      { stdio: 'pipe' }
    )

    if (result.code !== 0) {
      throw new Error(result.stderr)
    }

    const repoList = JSON.parse(result.stdout)
    const pageNames = Array.isArray(repoList.items) ? repoList.items.map((repo) => repo.name) : []

    if (pageNames.length === 0) {
      break
    }

    for (const name of pageNames) {
      if (name) {
        repoNames.add(name)
      }
    }

    if (pageNames.length < 100) {
      break
    }

    page++
  }

  return [...repoNames].sort()
}

const main = async () => {
  const repoNames = await fetchRepoNames()
  return fs.writeFile(join(__dirname, 'npm-cli-repos.txt'), repoNames.join('\n'))
}

run(main)
