/* global Boolean:off, Array:off, String:off, Number:off, Date:off */
// Dont allow globals that are used by nopt. If these are needed in this
// file they will need to explicitly disabled per line

const t = require('tap')
const Definition = require('../../lib/definitions/definition.js')
const { Types } = require('../../lib/type-defs.js')

t.test('basic definition', async t => {
  const def = new Definition('key', {
    default: 'some default value',
    type: [Types.Number, Types.String],
    description: 'just a test thingie',
  })
  t.matchSnapshot(def.describe(), 'human-readable description')

  const deprecated = new Definition('deprecated', {
    deprecated: 'do not use this',
    default: 1234,
    description: '  it should not be used\n  ever\n\n  not even once.\n\n',
    type: Types.Number,
    defaultDescription: 'A number bigger than 1',
  })
  t.matchSnapshot(deprecated.describe(), 'description of deprecated thing')

  const exclusive = new Definition('exclusive', {
    default: 1234,
    type: Types.Number,
    description: 'a number',
    exclusive: ['x'],
  })
  t.matchSnapshot(exclusive.describe(), 'description of deprecated thing')

  const nullOrUmask = new Definition('key', {
    default: null,
    type: [null, Types.Umask],
    description: 'asdf',
  })
  t.match(nullOrUmask.describe(), 'null or Octal numeric string in range 0000..0777 (0..511)')

  const nullDateOrBool = new Definition('key', {
    default: 7,
    type: [null, Types.Date, Types.Boolean],
    description: 'asdf',
  })
  t.match(nullDateOrBool.describe(), 'null, Date, or Boolean')

  const manyPaths = new Definition('key', {
    default: ['asdf'],
    type: [Types.Path, Types.Array],
    description: 'asdf',
  })
  t.match(manyPaths.describe(), 'Path (can be set multiple times)')

  const pathOrUrl = new Definition('key', {
    default: ['https://example.com'],
    type: [Types.Path, Types.URL],
    description: 'asdf',
  })
  t.match(pathOrUrl.describe(), 'Path or URL')

  const multi12 = new Definition('key', {
    default: [],
    type: [1, 2, Types.Array],
    description: 'asdf',
  })
  t.match(multi12.describe(), '1 or 2 (can be set multiple times)')

  const multi123 = new Definition('key', {
    default: [],
    type: [1, 2, 3, Types.Array],
    description: 'asdf',
  })
  t.match(multi123.describe(), '1, 2, or 3 (can be set multiple times)')

  const multi123Semver = new Definition('key', {
    default: [],
    type: [1, 2, 3, Types.Array, Types.SemVer],
    description: 'asdf',
  })
  t.match(multi123Semver.describe(), '1, 2, 3, or SemVer string (can be set multiple times)')

  const hasUsage = new Definition('key', {
    default: 'test default',
    type: Types.String,
    description: 'test description',
    usage: 'test usage',
  })
  t.equal(hasUsage.describeUsage(), 'test usage')

  const hasShort = new Definition('key', {
    default: 'test default',
    short: 't',
    type: Types.String,
    description: 'test description',
  })
  t.equal(hasShort.describeUsage(), '-t|--key <key>')

  const multiHasShort = new Definition('key', {
    default: 'test default',
    short: 't',
    type: [null, Types.String],
    description: 'test description',
  })
  t.equal(multiHasShort.describeUsage(), '-t|--key <key>')

  const hardCodedTypes = new Definition('key', {
    default: 'test default',
    type: ['string1', 'string2'],
    description: 'test description',
  })
  t.equal(hardCodedTypes.describeUsage(), '--key <string1|string2>')

  const hardCodedOptionalTypes = new Definition('key', {
    default: 'test default',
    type: [null, 'string1', 'string2'],
    description: 'test description',
  })
  t.equal(hardCodedOptionalTypes.describeUsage(), '--key <string1|string2>')

  const hasHint = new Definition('key', {
    default: 'test default',
    type: Types.String,
    description: 'test description',
    hint: 'testparam',
  })
  t.equal(hasHint.describeUsage(), '--key <testparam>')

  const optionalBool = new Definition('key', {
    default: null,
    type: [null, Types.Boolean],
    description: 'asdf',
  })
  t.equal(optionalBool.describeUsage(), '--key')

  const noExported = new Definition('methane', {
    envExport: false,
    type: Types.String,
    typeDescription: 'Greenhouse Gas',
    default: 'CH4',
    description: `
      This is bad for the environment, for our children, do not put it there.
    `,
  })
  t.equal(noExported.envExport, false, 'envExport flag is false')
  t.equal(noExported.describe(), `#### \`methane\`

* Default: "CH4"
* Type: Greenhouse Gas

This is bad for the environment, for our children, do not put it there.

This value is not exported to the environment for child processes.`)
})

t.test('missing fields', async t => {
  t.throws(() => new Definition('lacks-type', {
    description: 'no type',
    default: 1234,
  }), { message: 'config `lacks-type` lacks required key: `type`' })
  t.throws(() => new Definition(null, {
    description: 'falsey key',
    default: 1234,
    type: Types.Number,
  }), { message: 'config lacks key: null' })
  t.throws(() => new Definition('extra-field', {
    type: Types.String,
    default: 'extra',
    extra: 'more than is wanted',
    description: 'this is not ok',
  }), { message: 'config defines unknown field extra: extra-field' })
})

t.test('long description', async t => {
  const { stdout: { columns } } = process
  t.teardown(() => process.stdout.columns = columns)

  const long = new Definition('walden', {
    description: `
      WHEN I WROTE the following pages, or rather the bulk of them, I lived
      alone, in the woods, a mile from any neighbor, in a house which I had
      built myself, on the shore of Walden Pond, in Concord, Massachusetts, and
      earned my living by the labor of my hands only. I lived there two years
      and two months. At present I am a sojourner in civilized life again.

      I should not obtrude my affairs so much on the notice of my readers if
      very particular inquiries had not been made by my townsmen concerning my
      mode of life, which some would call impertinent, though they do not
      appear to me at all impertinent, but, considering the circumstances, very
      natural and pertinent.

      \`\`\`
      this.is('a', {
        code: 'sample',
      })

      with (multiple) {
        blocks()
      }
      \`\`\`
    `,
    default: true,
    type: Types.Boolean,
  })
  process.stdout.columns = 40
  t.matchSnapshot(long.describe(), 'cols=40')

  process.stdout.columns = 9000
  t.matchSnapshot(long.describe(), 'cols=9000')

  process.stdout.columns = 0
  t.matchSnapshot(long.describe(), 'cols=0')

  process.stdout.columns = -1
  t.matchSnapshot(long.describe(), 'cols=-1')

  process.stdout.columns = NaN
  t.matchSnapshot(long.describe(), 'cols=NaN')
})
