const t = require('tap')
const { load: loadMockNpm } = require('../../fixtures/mock-npm')

t.test('prefix', async t => {
  const { joinedOutput, npm } = await loadMockNpm(t)
  await npm.exec('prefix', [])
  t.equal(
    joinedOutput(),
    npm.prefix,
    'outputs npm.prefix'
  )
})

const cases = [
  {
    name: 'CLI --no-global overrides environment location=global',
    argv: ['--no-global'],
    env: { npm_config_location: 'global' },
  },
  {
    name: 'CLI location=project overrides environment global=true',
    argv: ['--location=project'],
    env: { npm_config_global: 'true' },
    location: 'project',
  },
  {
    name: 'environment global=false overrides user location=global',
    env: { npm_config_global: 'false' },
    userConfig: 'location=global',
  },
  {
    name: 'environment location=project overrides user global=true',
    env: { npm_config_location: 'project' },
    userConfig: 'global=true',
    location: 'project',
  },
  {
    name: 'CLI --global overrides environment location=project',
    argv: ['--global'],
    env: { npm_config_location: 'project' },
    global: true,
  },
  {
    name: 'global wins when both options are from the CLI',
    argv: ['--location=global', '--no-global'],
    global: true,
  },
]

for (const {
  name, argv, env = {}, userConfig = '', global = false, location = 'user',
} of cases) {
  t.test(name, async t => {
    const { prefix, globalPrefix, joinedOutput, npm } = await loadMockNpm(t, {
      argv,
      prefixDir: {
        'package.json': '{}',
        '.npmrc': 'tag=project-config',
      },
      homeDir: { '.npmrc': userConfig },
      globals: { process: { env } },
    })

    await npm.exec('prefix')
    const expectedPrefix = global ? globalPrefix : prefix
    t.equal(joinedOutput(), expectedPrefix)
    t.equal(npm.config.prefix, expectedPrefix)
    t.equal(npm.flatOptions.global, global)
    t.equal(npm.flatOptions.location, global ? 'global' : location)
    t.equal(npm.config.get('tag'), global ? 'latest' : 'project-config')
  })
}
