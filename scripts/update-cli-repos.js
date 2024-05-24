const { join } = require('node:path')
const { fs, gh, run } = require('./util.js')

const query = `
query {
  search (query: "org:npm topic:npm-cli fork:true archived:false", type: REPOSITORY, first: 100) {
    nodes {
      ... on Repository {
        name
      }
    }
  }
}
`

const main = async () => {
  const result = await gh('api', 'graphql', '-f', `query=${query}`, { stdio: 'pipe' })
  if (result.code !== 0) {
    throw new Error(result.stderr)
  }

  const repoList = JSON.parse(result.stdout)
  const sortedRepoList = repoList.data.search.nodes.map((node) => node.name).sort()

  return fs.writeFile(join(__dirname, 'npm-cli-repos.txt'), sortedRepoList.join('\n'))
}

run(main)
