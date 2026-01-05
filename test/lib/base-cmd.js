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
  const flags = await command.exec()

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
  const flags = await command.exec()

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
  const flags = await command.exec()

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
  const flags = await command.exec()

  t.same(flags, {}, 'returns empty object when no definitions')
})
