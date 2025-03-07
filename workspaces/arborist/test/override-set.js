const t = require('tap')
const OverrideSet = require('../lib/override-set.js')

t.test('constructor', async (t) => {
  t.test('throws when adding a child rule with no name', async (t) => {
    t.throws(() => {
      new OverrideSet({
        overrides: {
          'github:npm/cli': '1.0.0',
        },
      })
    }, 'Override without name: github:npm/cli', 'threw error')
  })

  t.test('loads overrides', async (t) => {
    const overrides = new OverrideSet({
      overrides: {
        'a@1': { '.': '1.0.2' },
        b: { '.': '1.0.0' },
        'c@1.0.1': { '.': '1.0.2' },
      },
    })

    t.ok(overrides.children.has('a@1'), 'created child for a@1')
    t.ok(overrides.children.has('b'), 'created child for b')

    const missingEdgeRule = overrides.getEdgeRule({ name: 'a', spec: '^2.0.0' })
    t.equal(missingEdgeRule, overrides, 'unmatched edge returns root rules')

    const edgeRuleA = overrides.getEdgeRule({ name: 'a', spec: '^1.0.1' })
    t.ok(edgeRuleA, 'found a rule for a matching edge for a@1')
    const edgeRuleB = overrides.getEdgeRule({ name: 'b', spec: '^1.1.0' })
    t.ok(edgeRuleB, 'found a rule for a matching edge for b')
    const edgeRuleC = overrides.getEdgeRule({ name: 'c', spec: '^1.0.0' })
    t.ok(edgeRuleC, 'returned a rule for matching edge for c')

    const missingNodeRule = overrides.getNodeRule({ name: 'c', version: '1.0.0' })
    t.equal(missingNodeRule, overrides, 'getNodeRule returns root for misses')
    const matchRule = overrides.getMatchingRule({ name: 'a', version: '1.0.2' })
    t.equal(matchRule, overrides.children.get('a@1'), 'got a match for a@1')
    const unmatchedRule = overrides.getMatchingRule({ name: 'a', version: '2.0.0' })
    t.equal(unmatchedRule, null, 'got null for unmatched node')

    const keySpecRuleA = overrides.getNodeRule({ name: 'a', version: '1.0.1' })
    t.ok(keySpecRuleA, 'found a rule by keySpec for a@1')
    const keySpecRuleB = overrides.getNodeRule({ name: 'b', version: '1.1.1' })
    t.ok(keySpecRuleB, 'found a rule by keySpec for b')

    const valueRuleA = overrides.getNodeRule({ name: 'a', version: '1.0.2' })
    t.ok(valueRuleA, 'found a rule by value for a@1')
    const valueRuleB = overrides.getNodeRule({ name: 'b', version: '1.0.0' })
    t.ok(valueRuleB, 'found a rule by value for b')

    t.equal(edgeRuleA, keySpecRuleA, 'edge and node rules are identical for a@1')
    t.equal(keySpecRuleA, valueRuleA, 'both node rules are identical for a@1')
    t.equal(edgeRuleB, keySpecRuleB, 'edge and node rules are identical for b')
    t.equal(keySpecRuleB, valueRuleB, 'both node rules are identical for b')
  })

  t.test('loads child overrides as string', async (t) => {
    const overrides = new OverrideSet({
      overrides: {
        'a@1': '1.0.2',
        b: '1.0.0',
        'c@1.0.1': '1.0.2',
      },
    })

    t.ok(overrides.children.has('a@1'), 'created child for a@1')
    t.ok(overrides.children.has('b'), 'created child for b')

    const missingEdgeRule = overrides.getEdgeRule({ name: 'a', spec: '^2.0.0' })
    t.equal(missingEdgeRule, overrides, 'unmatched edge returns root rules')

    const edgeRuleA = overrides.getEdgeRule({ name: 'a', spec: '^1.0.1' })
    t.ok(edgeRuleA, 'found a rule for a matching edge for a@1')
    const edgeRuleB = overrides.getEdgeRule({ name: 'b', spec: '^1.1.0' })
    t.ok(edgeRuleB, 'found a rule for a matching edge for b')
    const edgeRuleC = overrides.getEdgeRule({ name: 'c', spec: '^1.0.0' })
    t.ok(edgeRuleC, 'returned a rule for matching edge for c')

    const missingNodeRule = overrides.getNodeRule({ name: 'c', version: '1.0.0' })
    t.equal(missingNodeRule, overrides, 'getNodeRule returns root for misses')
    const matchRule = overrides.getMatchingRule({ name: 'a', version: '1.0.2' })
    t.equal(matchRule, overrides.children.get('a@1'), 'got a match for a@1')
    const unmatchedRule = overrides.getMatchingRule({ name: 'a', version: '2.0.0' })
    t.equal(unmatchedRule, null, 'got null for unmatched node')

    const keySpecRuleA = overrides.getNodeRule({ name: 'a', version: '1.0.1' })
    t.ok(keySpecRuleA, 'found a rule by keySpec for a@1')
    const keySpecRuleB = overrides.getNodeRule({ name: 'b', version: '1.1.1' })
    t.ok(keySpecRuleB, 'found a rule by keySpec for b')

    const valueRuleA = overrides.getNodeRule({ name: 'a', version: '1.0.2' })
    t.ok(valueRuleA, 'found a rule by value for a@1')
    const valueRuleB = overrides.getNodeRule({ name: 'b', version: '1.0.0' })
    t.ok(valueRuleB, 'found a rule by value for b')

    t.equal(edgeRuleA, keySpecRuleA, 'edge and node rules are identical for a@1')
    t.equal(keySpecRuleA, valueRuleA, 'both node rules are identical for a@1')
    t.equal(edgeRuleB, keySpecRuleB, 'edge and node rules are identical for b')
    t.equal(keySpecRuleB, valueRuleB, 'both node rules are identical for b')
  })

  t.test('child rules take priority', async (t) => {
    const overrides = new OverrideSet({
      overrides: {
        foo: {
          bar: {
            '.': '2.0.0',
            baz: '3.0.0',
          },
          baz: '2.0.0',
        },
        bar: '1.0.0',
        baz: '1.0.0',
      },
    })

    const edgeRule = overrides.getEdgeRule({ name: 'foo', spec: '^1' })
    t.equal(edgeRule.name, 'foo', 'getEdgeRule returned child rule set')
    const ruleset = edgeRule.ruleset
    const fooRule = ruleset.get('foo')
    // these are both empty because the foo rule does not actually override
    // anything directly, it only carries child rules through
    t.equal(fooRule.keySpec, '*', 'keySpec is *')
    t.equal(fooRule.value, '*', 'value is *')
    const barRule = ruleset.get('bar')
    t.equal(barRule.keySpec, '*', 'keySpec is *')
    t.equal(barRule.value, '2.0.0', 'got the correct override for bar')
    const bazRule = ruleset.get('baz')
    t.equal(bazRule.keySpec, '*', 'keySpec is *')
    t.equal(bazRule.value, '2.0.0', 'got the correct override for baz')

    const childRule = edgeRule.getEdgeRule({ name: 'bar', spec: '^1.0.0' })
    const childRuleSet = childRule.ruleset
    const childBazRule = childRuleSet.get('baz')
    t.equal(childBazRule.keySpec, '*', 'keySpec is *')
    t.equal(childBazRule.value, '3.0.0', 'got the correct override for nested baz')
    const childBarRule = childRuleSet.get('bar')
    t.equal(childBarRule.keySpec, '*', 'keySpec is *')
    t.equal(childBarRule.value, '2.0.0', 'got the correct override for nested bar')
    const childFooRule = childRuleSet.get('foo')
    t.equal(childFooRule.keySpec, '*', 'keySpec is *')
    t.equal(childFooRule.value, '*', 'value is *')
  })

  t.test('coerces empty string to *', async (t) => {
    const overrides = new OverrideSet({
      overrides: {
        foo: {
          '.': '',
        },
        bar: {
        },
      },
    })

    const edgeRule = overrides.getEdgeRule({ name: 'foo', spec: '^1' })
    t.equal(edgeRule.value, '*', 'empty string was replaced with *')

    const barEdgeRule = overrides.getEdgeRule({ name: 'bar', spec: '^1' })
    t.equal(barEdgeRule.value, '*', 'when rule is omitted entirely value is *')
  })

  t.test('version specs work', async (t) => {
    const overrides = new OverrideSet({
      overrides: {
        foo: {
          bar: '$bar',
        },
        'baz@^1.0.0': {
          'buzz@^1.0.0': '$buzz',
        },
      },
    })

    const fooEdgeRule = overrides.getEdgeRule({ name: 'foo', spec: '^1.0.0' })
    const barEdgeRule = fooEdgeRule.getEdgeRule({ name: 'bar', spec: '1.0.0' })
    t.equal(barEdgeRule.value, '$bar', 'got a rule back')

    const bazEdgeRule = overrides.getEdgeRule({ name: 'baz', spec: '^1.0.0' })
    const buzzEdgeRule = bazEdgeRule.getEdgeRule({ name: 'buzz', spec: '1.0.0' })
    t.equal(buzzEdgeRule.value, '$buzz', 'got a rule back')
  })

  t.test('directory specs work', async (t) => {
    const overrides = new OverrideSet({
      overrides: {
        foo: {
          bar: '$bar',
        },
        'baz@^1.0.0': {
          'buzz@^1.0.0': '$buzz',
        },
      },
    })

    const fooEdgeRule = overrides.getEdgeRule({ name: 'foo', spec: '^1.0.0' })
    const barEdgeRule = fooEdgeRule.getEdgeRule({ name: 'bar', spec: 'file:../bar' })
    t.equal(barEdgeRule.value, '$bar', 'got a rule back')

    const bazEdgeRule = overrides.getEdgeRule({ name: 'baz', spec: '^1.0.0' })
    const buzzEdgeRule = bazEdgeRule.getEdgeRule({ name: 'buzz', spec: 'file:../buzz' })
    t.equal(buzzEdgeRule.value, '$buzz', 'got a rule back')
  })

  t.test('file specs work', async (t) => {
    const overrides = new OverrideSet({
      overrides: {
        foo: {
          bar: '$bar',
        },
        'baz@^1.0.0': {
          'buzz@^1.0.0': '$buzz',
        },
      },
    })

    const fooEdgeRule = overrides.getEdgeRule({ name: 'foo', spec: '^1.0.0' })
    const barEdgeRule = fooEdgeRule.getEdgeRule({ name: 'bar', spec: 'file:../bar.tgz' })
    t.equal(barEdgeRule.value, '$bar', 'got a rule back')

    const bazEdgeRule = overrides.getEdgeRule({ name: 'baz', spec: '^1.0.0' })
    const buzzEdgeRule = bazEdgeRule.getEdgeRule({ name: 'buzz', spec: 'file:../buzz.tgz' })
    t.equal(buzzEdgeRule.value, '$buzz', 'got a rule back')
  })

  t.test('alias specs work', async (t) => {
    const overrides = new OverrideSet({
      overrides: {
        foo: {
          bar: '$bar',
        },
        'baz@^1.0.0': {
          'buzz@^1.0.0': '$buzz',
        },
      },
    })

    const fooEdgeRule = overrides.getEdgeRule({ name: 'foo', spec: '^1.0.0' })
    const barEdgeRule = fooEdgeRule.getEdgeRule({ name: 'bar', spec: 'npm:bar2@^1.0.0' })
    t.equal(barEdgeRule.value, '$bar', 'got a rule back')

    const bazEdgeRule = overrides.getEdgeRule({ name: 'baz', spec: '^1.0.0' })
    const buzzEdgeRule = bazEdgeRule.getEdgeRule({ name: 'buzz', spec: 'npm:buzz2@^1.0.0' })
    t.equal(buzzEdgeRule.value, '$buzz', 'got a rule back')
  })

  t.test('git specs work', async (t) => {
    const overrides = new OverrideSet({
      overrides: {
        foo: {
          bar: '$bar',
        },
        'baz@^1.0.0': {
          'buzz@^1.0.0': '$buzz',
        },
      },
    })

    const fooEdgeRule = overrides.getEdgeRule({ name: 'foo', spec: '^1.0.0' })
    const barEdgeRule = fooEdgeRule.getEdgeRule({ name: 'bar', spec: 'github:foo/bar' })
    t.equal(barEdgeRule.value, '$bar', 'got a rule back')

    const bazEdgeRule = overrides.getEdgeRule({ name: 'baz', spec: '^1.0.0' })
    const buzzEdgeRule = bazEdgeRule.getEdgeRule({ name: 'buzz', spec: 'github:baz/buzz#semver:^1.0.0' })
    t.equal(buzzEdgeRule.value, '$buzz', 'got a rule back')

    const outOfRangeRule = bazEdgeRule.getEdgeRule({ name: 'buzz', spec: 'github:baz/buzz#semver:^2.0.0' })
    t.equal(outOfRangeRule.name, 'baz', 'no match - returned parent')
  })

  t.test('isequal and findspecificoverrideset tests', async (t) => {
    const overrides1 = new OverrideSet({
      overrides: {
        foo: {
          bar: {
            '.': '2.0.0',
            baz: '3.0.0',
          },
          baz: '2.0.0',
        },
        bar: '1.0.0',
        baz: '1.0.0',
      },
    })
    const overrides2 = new OverrideSet({
      overrides: {
        foo: {
          bar: {
            '.': '2.0.0',
            baz: '3.0.0',
          },
          baz: '2.0.0',
        },
        bar: '1.0.0',
        baz: '1.0.0',
      },
    })
    const overrides3 = new OverrideSet({
      overrides: {
        foo: {
          bar: {
            '.': '2.0.0',
            baz: '3.1.0',
          },
          baz: '2.0.0',
        },
        bar: '1.0.0',
        baz: '1.0.0',
      },
    })
    const overrides4 = new OverrideSet({
      overrides: {
        foo: {
          bar: {
            '.': '2.0.0',
          },
          baz: '2.0.0',
        },
        bar: '1.0.0',
        baz: '1.0.0',
      },
    })
    const overrides5 = new OverrideSet({
      overrides: {
        foo: {
          bar: {
            '.': '2.0.0',
          },
          bat: '2.0.0',
        },
        bar: '1.0.0',
        baz: '1.0.0',
      },
    })
    const overrides6 = new OverrideSet({
      overrides: {
        bar: {
          '.': '2.0.0',
        },
        bat: '2.0.0',
      },
    })
    overrides6.parent = overrides5
    const overrides7 = new OverrideSet({
      overrides: {
        bat: '2.0.0',
      },
    })
    const overrides8 = new OverrideSet({
      overrides: {
        bat: '1.2.0',
      },
    })
    const overrides9 = new OverrideSet({
      overrides: {
        'bat@3.0.0': '1.2.0',
      },
    })

    t.ok(overrides1.isEqual(overrides1), 'override set is equal to itself')
    t.ok(overrides1.isEqual(overrides2), 'two identical override sets are equal')
    t.ok(!overrides1.isEqual(overrides3), 'two different override sets are not equal')
    t.ok(!overrides2.isEqual(overrides3), 'two different override sets are not equal')
    t.ok(!overrides3.isEqual(overrides1), 'two different override sets are not equal')
    t.ok(!overrides3.isEqual(overrides2), 'two different override sets are not equal')
    t.ok(!overrides4.isEqual(overrides1), 'two different override sets are not equal')
    t.ok(!overrides4.isEqual(overrides2), 'two different override sets are not equal')
    t.ok(!overrides4.isEqual(overrides3), 'two different override sets are not equal')
    t.ok(!overrides4.isEqual(overrides5), 'two override sets that differ only by package name are not equal')
    t.ok(!overrides5.isEqual(overrides4), 'two override sets that differ only by package name are not equal')
    t.equal(OverrideSet.findSpecificOverrideSet(overrides5, overrides5), overrides5, 'find more specific override set when the sets are identical')
    t.equal(OverrideSet.findSpecificOverrideSet(overrides5, overrides6), overrides6, "find more specific override set when it's the second")
    t.equal(OverrideSet.findSpecificOverrideSet(overrides6, overrides5), overrides6, "find more specific override set when it's the first")
    t.ok(!OverrideSet.doOverrideSetsConflict(overrides1, overrides2), 'override sets are equal')
    t.ok(!OverrideSet.doOverrideSetsConflict(overrides5, overrides5), 'override sets are the same object')
    t.ok(!OverrideSet.doOverrideSetsConflict(overrides5, overrides6), 'one override set is the specific version of the other')
    t.ok(!OverrideSet.doOverrideSetsConflict(overrides6, overrides5), 'one override set is the specific version of the other')
    t.ok(OverrideSet.doOverrideSetsConflict(overrides5, overrides7), 'no override set is the specific version of the other')
    t.ok(OverrideSet.doOverrideSetsConflict(overrides7, overrides5), 'no override set is the specific version of the other')
    t.ok(!overrides7.isEqual(overrides8), 'two override sets that differ in the version are not equal')
    t.ok(!overrides8.isEqual(overrides9), 'two override sets that differ in the range are not equal')
    t.ok(!overrides7.isEqual(overrides9), 'two override sets that differ in both version and range are not equal')
    t.ok(OverrideSet.doOverrideSetsConflict(overrides7, overrides8), 'override sets are incomparable due to version')
    t.ok(OverrideSet.doOverrideSetsConflict(overrides7, overrides9), 'override sets are incomparable due to version and range')
    t.ok(OverrideSet.doOverrideSetsConflict(overrides8, overrides9), 'override sets are incomparable due to range')
  })
})

t.test('coverage for final line in isEqual (parent != null)', async t => {
  // Both parents have the SAME config -> parent.isEqual(...) will return TRUE
  const parentA = new OverrideSet({ overrides: { foo: '1.0.0' } })
  const parentB = new OverrideSet({ overrides: { foo: '1.0.0' } })

  // Child override sets with the same parent config => should be equal
  const childA = new OverrideSet({
    overrides: { bar: '2.0.0' },
    key: 'bar',
    parent: parentA,
  })
  const childB = new OverrideSet({
    overrides: { bar: '2.0.0' },
    key: 'bar',
    parent: parentB,
  })

  // This specifically covers the code path where parent != null
  // AND parent.isEqual(...) returns true
  t.ok(childA.isEqual(childB), 'two children with equivalent parents are equal')

  // Different parent configs -> parent.isEqual(...) will return FALSE
  const parentC = new OverrideSet({ overrides: { foo: '1.0.0' } })
  const parentD = new OverrideSet({ overrides: { foo: '1.0.1' } })

  const childC = new OverrideSet({
    overrides: { bar: '2.0.0' },
    key: 'bar',
    parent: parentC,
  })
  const childD = new OverrideSet({
    overrides: { bar: '2.0.0' },
    key: 'bar',
    parent: parentD,
  })

  // This specifically covers the code path where parent != null
  // AND parent.isEqual(...) returns false
  t.notOk(childC.isEqual(childD), 'two children with different parents are not equal')

  t.end()
})
