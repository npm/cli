const t = require('tap')
const { load: loadMockNpm } = require('../fixtures/mock-npm')
const BaseCommand = require('../../lib/base-cmd.js')
const Definition = require('@npmcli/config/lib/definitions/definition.js')

t.test('flags() method with command definitions', async t => {
  const { npm } = await loadMockNpm(t, {
    config: {
      mountain: 'kilimanjaro',
    },
  })

  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command'
    static params = ['mountain']

    static definitions = {
      mountain: new Definition('mountain', {
        type: String,
        default: 'everest',
        description: 'Your favorite mountain',
        usage: '--mountain=<mountain>',
      }),
    }

    async exec () {
      return this.flags()
    }
  }

  const command = new TestCommand(npm)
  const [flags] = await command.exec()

  t.ok(flags, 'flags() returns an object')
  t.equal(flags.mountain, 'kilimanjaro', 'includes config value when set')
})

t.test('flags() method with default values', async t => {
  const { npm } = await loadMockNpm(t)

  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command'
    static params = ['mountain']

    static definitions = {
      mountain: new Definition('mountain', {
        type: String,
        default: 'everest',
        description: 'Your favorite mountain',
        usage: '--mountain=<mountain>',
      }),
    }

    async exec () {
      return this.flags()
    }
  }

  const command = new TestCommand(npm)
  const [flags] = await command.exec()

  t.equal(flags.mountain, 'everest', 'uses default value when not set')
})

t.test('flags() method filters unknown options', async t => {
  const { npm } = await loadMockNpm(t, {
    // npm.config.argv would have both known and unknown flags parsed
    config: {
      mountain: 'denali',
    },
  })

  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command'
    static params = ['mountain']

    static definitions = {
      mountain: new Definition('mountain', {
        type: String,
        default: 'everest',
        description: 'Your favorite mountain',
        usage: '--mountain=<mountain>',
      }),
    }

    async exec () {
      return this.flags()
    }
  }

  const command = new TestCommand(npm)
  const [flags] = await command.exec()

  t.equal(flags.mountain, 'denali', 'includes known flag')
  t.notOk(flags.bug, 'filters out unknown flags')
  t.same(Object.keys(flags), ['mountain'], 'only includes defined keys')
})

t.test('flags() method with no definitions', async t => {
  const { npm } = await loadMockNpm(t)

  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command'

    async exec () {
      return this.flags()
    }
  }

  const command = new TestCommand(npm)
  const [flags] = await command.exec()

  t.same(flags, {}, 'returns empty object when no definitions')
})

t.test('flags() throws error for unknown flags', async t => {
  const { npm } = await loadMockNpm(t)

  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command'
    static params = ['mountain']

    static definitions = {
      mountain: new Definition('mountain', {
        type: String,
        default: 'everest',
        description: 'Your favorite mountain',
        usage: '--mountain=<mountain>',
      }),
    }

    async exec () {
      return this.flags()
    }
  }

  // Manually set config.argv to simulate command-line with unknown flag
  npm.config.argv = ['node', 'npm', 'test-command', '--unknown-flag']

  const command = new TestCommand(npm)
  await t.rejects(
    command.exec(),
    { message: /Unknown flag.*--unknown-flag/ },
    'throws error for unknown flag'
  )
})

t.test('flags() maps alias to main key', async t => {
  const { npm } = await loadMockNpm(t)

  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command'
    static params = ['mountain']

    static definitions = {
      mountain: new Definition('mountain', {
        type: String,
        default: 'everest',
        description: 'Your favorite mountain',
        usage: '--mountain=<mountain>',
        alias: ['peak'],
      }),
    }

    async exec () {
      return this.flags()
    }
  }

  // Use the alias --peak instead of --mountain
  npm.config.argv = ['node', 'npm', 'test-command', '--peak=denali']

  const command = new TestCommand(npm)
  const [flags] = await command.exec()

  t.equal(flags.mountain, 'denali', 'alias value is mapped to main key')
  t.notOk('peak' in flags, 'alias key is not present in flags')
})

t.test('flags() throws error when both main key and alias are provided', async t => {
  const { npm } = await loadMockNpm(t)

  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command'
    static params = ['mountain']

    static definitions = {
      mountain: new Definition('mountain', {
        type: String,
        default: 'everest',
        description: 'Your favorite mountain',
        usage: '--mountain=<mountain>',
        alias: ['peak'],
      }),
    }

    async exec () {
      return this.flags()
    }
  }

  // Provide both --mountain and --peak (its alias)
  npm.config.argv = ['node', 'npm', 'test-command', '--mountain=everest', '--peak=denali']

  const command = new TestCommand(npm)
  await t.rejects(
    command.exec(),
    { message: /Please provide only one of --mountain or --peak/ },
    'throws error when main key and alias are both provided'
  )
})

t.test('getUsage() with no params and no definitions', async t => {
  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command description'
  }

  const usage = TestCommand.describeUsage

  t.ok(usage.includes('Test command description'), 'includes description')
  t.ok(usage.includes('npm test-command'), 'includes usage line')
  t.notOk(usage.includes('Options:'), 'does not include Options section')
})

t.test('getUsage() with both params and definitions', async t => {
  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command description'
    static params = ['mountain', 'river']

    static definitions = {
      mountain: new Definition('mountain', {
        type: String,
        default: 'everest',
        description: 'Your favorite mountain',
        usage: '--mountain=<mountain>',
      }),
      river: new Definition('river', {
        type: String,
        default: 'nile',
        description: 'Your favorite river',
        usage: '--river=<river>',
      }),
    }
  }

  const usage = TestCommand.describeUsage

  t.ok(usage.includes('Test command description'), 'includes description')
  t.ok(usage.includes('Options:'), 'includes Options section')
  t.ok(usage.includes('--mountain'), 'includes mountain flag')
  t.ok(usage.includes('--river'), 'includes river flag')
})

t.test('getUsage() with subcommand without description', async t => {
  class SubCommandWithDesc extends BaseCommand {
    static name = 'with-desc'
    static description = 'Subcommand with description'
  }

  class SubCommandNoDesc extends BaseCommand {
    static name = 'no-desc'
    // No description
  }

  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command description'
    static subcommands = {
      'with-desc': SubCommandWithDesc,
      'no-desc': SubCommandNoDesc,
    }
  }

  const usage = TestCommand.describeUsage

  t.ok(usage.includes('Subcommands:'), 'includes Subcommands section')
  t.ok(usage.includes('with-desc'), 'includes subcommand with description')
  t.ok(usage.includes('Subcommand with description'), 'includes the description text')
  t.ok(usage.includes('no-desc'), 'includes subcommand without description')
})

t.test('getUsage() with definition without description', async t => {
  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command description'
    static params = ['mountain', 'river']

    static definitions = {
      mountain: new Definition('mountain', {
        type: String,
        default: 'everest',
        description: 'Your favorite mountain',
        usage: '--mountain=<mountain>',
      }),
      river: new Definition('river', {
        type: String,
        default: 'nile',
        description: '', // Empty description
        usage: '--river=<river>',
      }),
    }
  }

  const usage = TestCommand.describeUsage

  t.ok(usage.includes('Options:'), 'includes Options section')
  t.ok(usage.includes('--mountain'), 'includes mountain flag in options')
  t.ok(usage.includes('Your favorite mountain'), 'includes mountain description')
  t.ok(usage.includes('[--river=<river>]'), 'includes river in usage line')
  t.notOk(usage.includes('  --river'), 'does not include river flag description section')
})

t.test('flags() handles definition with multiple aliases', async t => {
  const { npm } = await loadMockNpm(t)

  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command'

    static definitions = {
      mountain: new Definition('mountain', {
        type: String,
        default: 'everest',
        description: 'Your favorite mountain',
        usage: '--mountain=<mountain>',
        alias: ['peak', 'summit'], // Multiple aliases
      }),
    }

    async exec () {
      return this.flags()
    }
  }

  // Use the second alias --summit
  npm.config.argv = ['node', 'npm', 'test-command', '--summit=denali']

  const command = new TestCommand(npm)
  const [flags] = await command.exec()

  t.equal(flags.mountain, 'denali', 'second alias value is mapped to main key')
  t.notOk('summit' in flags, 'alias key is not present in flags')
  t.notOk('peak' in flags, 'other alias key is not present in flags')
})

t.test('flags() handles definition with short as array', async t => {
  const { npm } = await loadMockNpm(t)

  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command'

    static definitions = {
      mountain: new Definition('mountain', {
        type: String,
        default: 'everest',
        description: 'Your favorite mountain',
        usage: '--mountain=<mountain>',
        short: ['m', 'M'], // Short as array
      }),
    }

    async exec () {
      return this.flags()
    }
  }

  // Use the short flag -m
  npm.config.argv = ['node', 'npm', 'test-command', '-m', 'denali']

  const command = new TestCommand(npm)
  const [flags] = await command.exec()

  t.equal(flags.mountain, 'denali', 'short flag value is parsed correctly')
})

t.test('flags() returns defaults when argv is empty', async t => {
  const { npm } = await loadMockNpm(t)

  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command'

    static definitions = {
      mountain: new Definition('mountain', {
        type: String,
        default: 'everest',
        description: 'Your favorite mountain',
        usage: '--mountain=<mountain>',
      }),
    }

    async exec () {
      return this.flags()
    }
  }

  // Set argv to empty array
  npm.config.argv = []

  const command = new TestCommand(npm)
  const [flags, remains] = await command.exec()

  t.equal(flags.mountain, 'everest', 'returns default value when argv is empty')
  t.same(remains, [], 'remains is empty array')
})

t.test('flags() throws error for multiple unknown flags with pluralization', async t => {
  const { npm } = await loadMockNpm(t)

  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command'

    static definitions = {
      mountain: new Definition('mountain', {
        type: String,
        default: 'everest',
        description: 'Your favorite mountain',
        usage: '--mountain=<mountain>',
      }),
    }

    async exec () {
      return this.flags()
    }
  }

  // Provide multiple unknown flags
  npm.config.argv = ['node', 'npm', 'test-command', '--unknown-one', '--unknown-two']

  const command = new TestCommand(npm)
  await t.rejects(
    command.exec(),
    { message: /Unknown flags:.*--unknown-one.*--unknown-two/ },
    'throws error with pluralized "flags" for multiple unknown flags'
  )
})

t.test('base exec() method returns undefined', async t => {
  const { npm } = await loadMockNpm(t)

  class TestCommand extends BaseCommand {
    static name = 'test-command'
    static description = 'Test command'
    // Intentionally not overriding exec() to test the base implementation
  }

  const command = new TestCommand(npm)
  const result = await command.exec()

  t.equal(result, undefined, 'base exec() returns undefined')
})
