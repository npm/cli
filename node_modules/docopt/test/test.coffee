chai = require 'chai'
assert = chai.assert
docopt = require '../docopt.coffee'

describe "test.coffee",  ->

    it "test_pattern_flat", ->
        assert.deepEqual(
            new docopt.Required([new docopt.OneOrMore([new docopt.Argument('N')]), new docopt.Option('-a'), new docopt.Argument('M')]).flat()
            [new docopt.Argument('N'), new docopt.Option('-a'), new docopt.Argument('M')]
        )
        assert.deepEqual(
            new docopt.Required([new docopt.Optional([new docopt.OptionsShortcut([])]), new docopt.Optional([new docopt.Option('-a', null)])]).flat(docopt.OptionsShortcut)
            [new docopt.OptionsShortcut([])]
        )


    it "test_option", ->
        assert.deepEqual new docopt.Option.parse('-h'), new docopt.Option('-h', null)
        assert.deepEqual new docopt.Option.parse('--help'), new docopt.Option(null, '--help')
        assert.deepEqual new docopt.Option.parse('-h --help'), new docopt.Option('-h', '--help')
        assert.deepEqual new docopt.Option.parse('-h, --help'), new docopt.Option('-h', '--help')

        assert.deepEqual new docopt.Option.parse('-h TOPIC'), new docopt.Option('-h', null, 1)
        assert.deepEqual new docopt.Option.parse('--help TOPIC'), new docopt.Option(null, '--help', 1)
        assert.deepEqual new docopt.Option.parse('-h TOPIC --help TOPIC'), new docopt.Option('-h', '--help', 1)
        assert.deepEqual new docopt.Option.parse('-h TOPIC, --help TOPIC'), new docopt.Option('-h', '--help', 1)
        assert.deepEqual new docopt.Option.parse('-h TOPIC, --help=TOPIC'), new docopt.Option('-h', '--help', 1)

        assert.deepEqual new docopt.Option.parse('-h  Description...'), new docopt.Option('-h', null)
        assert.deepEqual new docopt.Option.parse('-h --help  Description...'), new docopt.Option('-h', '--help')
        assert.deepEqual new docopt.Option.parse('-h TOPIC  Description...'), new docopt.Option('-h', null, 1)

        assert.deepEqual new docopt.Option.parse('    -h'), new docopt.Option('-h', null)

        assert.deepEqual(
            new docopt.Option.parse('-h TOPIC  Descripton... [default: 2]')
            new docopt.Option('-h', null, 1, '2')
        )
        assert.deepEqual(
            new docopt.Option.parse('-h TOPIC  Descripton... [default: topic-1]')
            new docopt.Option('-h', null, 1, 'topic-1')
        )
        assert.deepEqual(
            new docopt.Option.parse('--help=TOPIC  ... [default: 3.14]')
            new docopt.Option(null, '--help', 1, '3.14')
        )
        assert.deepEqual(
            new docopt.Option.parse('-h, --help=DIR  ... [default: ./]')
            new docopt.Option('-h', '--help', 1, "./")
        )
        assert.deepEqual(
            new docopt.Option.parse('-h TOPIC  Descripton... [dEfAuLt: 2]')
            new docopt.Option('-h', null, 1, '2')
        )


    it "test_option_name", ->
        assert.deepEqual new docopt.Option('-h', null).name, '-h'
        assert.deepEqual new docopt.Option('-h', '--help').name, '--help'
        assert.deepEqual new docopt.Option(null, '--help').name, '--help'


    it "test_commands", ->
        assert.deepEqual docopt.docopt('Usage: prog add', {argv: 'add', exit: false}), {'add': true}
        assert.deepEqual docopt.docopt('Usage: prog [add]', {argv: '', exit: false}), {'add': false}
        assert.deepEqual docopt.docopt('Usage: prog [add]', {argv: 'add', exit: false}), {'add': true}
        assert.deepEqual docopt.docopt('Usage: prog (add|rm)', {argv: 'add', exit: false}), {'add': true, 'rm': false}
        assert.deepEqual docopt.docopt('Usage: prog (add|rm)', {argv: 'rm', exit: false}), {'add': false, 'rm': true}
        assert.deepEqual docopt.docopt('Usage: prog a b', {argv: 'a b', exit: false}), {'a': true, 'b': true}
        assert.throws(
            () ->
                docopt.docopt('Usage: prog a b', {argv: 'b a', exit: false})
            ,
            docopt.DocoptExit
        )


    it "test_formal_usage", ->
        doc = """
        Usage: prog [-hv] ARG
                   prog N M

        prog is a program."""
        [usage] = docopt.parse_section('usage:', doc)
        assert.deepEqual usage, "Usage: prog [-hv] ARG\n           prog N M"
        assert.deepEqual docopt.formal_usage(usage), "( [-hv] ARG ) | ( N M )"


    it "test_parse_argv", ->
        o = [new docopt.Option('-h'), new docopt.Option('-v', '--verbose'), new docopt.Option('-f', '--file', 1)]
        TS = (s) -> new docopt.Tokens(s, docopt.DocoptExit)
        assert.deepEqual docopt.parse_argv(TS(''), o), []
        assert.deepEqual docopt.parse_argv(TS('-h'), o), [new docopt.Option('-h', null, 0, true)]
        assert.deepEqual(
            docopt.parse_argv(TS('-h --verbose'), o)
            [new docopt.Option('-h', null, 0, true), new docopt.Option('-v', '--verbose', 0, true)]
        )
        assert.deepEqual(
            docopt.parse_argv(TS('-h --file f.txt'), o)
            [new docopt.Option('-h', null, 0, true), new docopt.Option('-f', '--file', 1, 'f.txt')]
        )
        assert.deepEqual(
            docopt.parse_argv(TS('-h --file f.txt arg'), o)
            [new docopt.Option('-h', null, 0, true), new docopt.Option('-f', '--file', 1, 'f.txt'), new docopt.Argument(null, 'arg')]
        )
        assert.deepEqual(
            docopt.parse_argv(TS('-h --file f.txt arg arg2'), o)
            [new docopt.Option('-h', null, 0, true), new docopt.Option('-f', '--file', 1, 'f.txt'), new docopt.Argument(null, 'arg'), new docopt.Argument(null, 'arg2')]
        )
        assert.deepEqual(
            docopt.parse_argv(TS('-h arg -- -v'), o)
            [new docopt.Option('-h', null, 0, true), new docopt.Argument(null, 'arg'), new docopt.Argument(null, '--'), new docopt.Argument(null, '-v')]
        )

    it "test_parse_pattern", ->
        o = [new docopt.Option('-h'), new docopt.Option('-v', '--verbose'), new docopt.Option('-f', '--file', 1)]
        assert.deepEqual(
            docopt.parse_pattern('[ -h ]', o)
            new docopt.Required([new docopt.Optional([new docopt.Option('-h')])])
        )
        assert.deepEqual(
            docopt.parse_pattern('[ ARG ... ]', o)
            new docopt.Required([new docopt.Optional([new docopt.OneOrMore([new docopt.Argument('ARG')])])])
        )
        assert.deepEqual(
            docopt.parse_pattern('[ -h | -v ]', o)
            new docopt.Required([new docopt.Optional([new docopt.Either([new docopt.Option('-h'), new docopt.Option('-v', '--verbose')])])])
        )
        assert.deepEqual(
            docopt.parse_pattern('( -h | -v [ --file <f> ] )', o),
            new docopt.Required([new docopt.Required(new docopt.Either([new docopt.Option('-h'), new docopt.Required([new docopt.Option('-v', '--verbose'), new docopt.Optional([new docopt.Option('-f', '--file', 1, null)])])]))])
        )
        assert.deepEqual(
            docopt.parse_pattern('(-h|-v[--file=<f>]N...)', o),
            new docopt.Required([new docopt.Required([new docopt.Either([new docopt.Option('-h'), new docopt.Required([new docopt.Option('-v', '--verbose'), new docopt.Optional([new docopt.Option('-f', '--file', 1, null)]), new docopt.OneOrMore([new docopt.Argument('N')])])])])])
        )
        assert.deepEqual(
            docopt.parse_pattern('(N [M | (K | L)] | O P)', []),
                   new docopt.Required([new docopt.Required([new docopt.Either([new docopt.Required([new docopt.Argument('N'), new docopt.Optional([new docopt.Either([new docopt.Argument('M'), new docopt.Required([new docopt.Either([new docopt.Argument('K'), new docopt.Argument('L')])])])])]), new docopt.Required([new docopt.Argument('O'), new docopt.Argument('P')])])])])
        )
        assert.deepEqual(
            docopt.parse_pattern('[ -h ] [N]', o),
            new docopt.Required([new docopt.Optional([new docopt.Option('-h')]), new docopt.Optional([new docopt.Argument('N')])])
        )
        assert.deepEqual(
            docopt.parse_pattern('[options]', o),
            new docopt.Required([new docopt.Optional([new docopt.OptionsShortcut()])])
        )
        assert.deepEqual(
            docopt.parse_pattern('[options] A', o),
            new docopt.Required([new docopt.Optional([new docopt.OptionsShortcut()]), new docopt.Argument('A')])
        )
        assert.deepEqual(
            docopt.parse_pattern('-v [options]', o),
            new docopt.Required([new docopt.Option('-v', '--verbose'), new docopt.Optional([new docopt.OptionsShortcut()])])
        )
        assert.deepEqual docopt.parse_pattern('ADD', o), new docopt.Required([new docopt.Argument('ADD')])
        assert.deepEqual docopt.parse_pattern('<add>', o), new docopt.Required([new docopt.Argument('<add>')])
        assert.deepEqual docopt.parse_pattern('add', o), new docopt.Required([new docopt.Command('add')])


    it "test_option_match", ->
        assert.deepEqual new docopt.Option('-a').match([new docopt.Option('-a', null, 0, true)]), [true, [], [new docopt.Option('-a', null, 0, true)]]
        assert.deepEqual new docopt.Option('-a').match([new docopt.Option('-x')]), [false, [new docopt.Option('-x')], []]
        assert.deepEqual new docopt.Option('-a').match([new docopt.Argument('N')]), [false, [new docopt.Argument('N')], []]
        assert.deepEqual(
            new docopt.Option('-a').match([new docopt.Option('-x'), new docopt.Option('-a'), new docopt.Argument('N')]),
            [true, [new docopt.Option('-x'), new docopt.Argument('N')], [new docopt.Option('-a')]]
        )
        assert.deepEqual(
            new docopt.Option('-a').match([new docopt.Option('-a', null, 0, true), new docopt.Option('-a')]),
            [true, [new docopt.Option('-a')], [new docopt.Option('-a', null, 0, true)]]
        )


    it "test_argument_match", ->
        assert.deepEqual new docopt.Argument('N').match([new docopt.Argument(null, 9)]), [true, [], [new docopt.Argument('N', 9)]]
        assert.deepEqual new docopt.Argument('N').match([new docopt.Option('-x')]), [false, [new docopt.Option('-x')], []]
        assert.deepEqual(
            new docopt.Argument('N').match([new docopt.Option('-x'), new docopt.Option('-a'), new docopt.Argument(null, 5)])
            [true, [new docopt.Option('-x'), new docopt.Option('-a')], [new docopt.Argument('N', 5)]]
        )
        assert.deepEqual(
            new docopt.Argument('N').match([new docopt.Argument(null, 9), new docopt.Argument(null, 0)])
            [true, [new docopt.Argument(null, 0)], [new docopt.Argument('N', 9)]]
        )


    it "test_command_match", ->
        assert.deepEqual(
            new docopt.Command('c').match([new docopt.Argument(null, 'c')])
            [true, [], [new docopt.Command('c', true)]]
        )
        assert.deepEqual new docopt.Command('c').match([new docopt.Option('-x')]), [false, [new docopt.Option('-x')], []]
        assert.deepEqual(
            new docopt.Command('c').match([new docopt.Option('-x'), new docopt.Option('-a'), new docopt.Argument(null, 'c')])
            [true, [new docopt.Option('-x'), new docopt.Option('-a')], [new docopt.Command('c', true)]]
        )
        assert.deepEqual(
            new docopt.Either([new docopt.Command('add', false), new docopt.Command('rm', false)]).match([new docopt.Argument(null, 'rm')])
            [true, [], [new docopt.Command('rm', true)]]
        )


    it "test_optional_match", ->
        assert.deepEqual(
            new docopt.Optional([new docopt.Option('-a')]).match([new docopt.Option('-a')])
            [true, [], [new docopt.Option('-a')]]
        )
        assert.deepEqual new docopt.Optional([new docopt.Option('-a')]).match([]), [true, [], []]
        assert.deepEqual(
            new docopt.Optional([new docopt.Option('-a')]).match([new docopt.Option('-x')]),
            [true, [new docopt.Option('-x')], []]
        )
        assert.deepEqual(
            new docopt.Optional([new docopt.Option('-a'), new docopt.Option('-b')]).match([new docopt.Option('-a')]),
            [true, [], [new docopt.Option('-a')]]
        )
        assert.deepEqual(
            new docopt.Optional([new docopt.Option('-a'), new docopt.Option('-b')]).match([new docopt.Option('-b')]),
            [true, [], [new docopt.Option('-b')]]
        )
        assert.deepEqual(
            new docopt.Optional([new docopt.Option('-a'), new docopt.Option('-b')]).match([new docopt.Option('-x')]),
            [true, [new docopt.Option('-x')], []]
        )
        assert.deepEqual(
            new docopt.Optional([new docopt.Argument('N')]).match([new docopt.Argument(null, 9)]),
            [true, [], [new docopt.Argument('N', 9)]]
        )
        assert.deepEqual(
            new docopt.Optional([new docopt.Option('-a'), new docopt.Option('-b')]).match([new docopt.Option('-b'), new docopt.Option('-x'), new docopt.Option('-a')]),
            [true, [new docopt.Option('-x')], [new docopt.Option('-a'), new docopt.Option('-b')]]
        )


    it "test_required_match", ->
        assert.deepEqual(
            new docopt.Required([new docopt.Option('-a')]).match([new docopt.Option('-a')])
            [true, [], [new docopt.Option('-a')]]
        )
        assert.deepEqual new docopt.Required([new docopt.Option('-a')]).match([]), [false, [], []]
        assert.deepEqual(
            new docopt.Required([new docopt.Option('-a')]).match([new docopt.Option('-x')])
            [false, [new docopt.Option('-x')], []]
        )
        assert.deepEqual(
            new docopt.Required([new docopt.Option('-a'), new docopt.Option('-b')]).match([new docopt.Option('-a')])
            [false, [new docopt.Option('-a')], []]
        )


    it "test_either_match", ->
        assert.deepEqual(
            new docopt.Either([new docopt.Option('-a'), new docopt.Option('-b')]).match([new docopt.Option('-a')])
            [true, [], [new docopt.Option('-a')]]
        )
        assert.deepEqual(
            new docopt.Either([new docopt.Option('-a'), new docopt.Option('-b')]).match([new docopt.Option('-a'), new docopt.Option('-b')]),
            [true, [new docopt.Option('-b')], [new docopt.Option('-a')]]
        )
        assert.deepEqual(
            new docopt.Either([new docopt.Option('-a'), new docopt.Option('-b')]).match([new docopt.Option('-x')]),
            [false, [new docopt.Option('-x')], []]
        )
        assert.deepEqual(
            new docopt.Either([new docopt.Option('-a'), new docopt.Option('-b'), new docopt.Option('-c')]).match([new docopt.Option('-x'), new docopt.Option('-b')]),
            [true, [new docopt.Option('-x')], [new docopt.Option('-b')]]
        )
        assert.deepEqual(
            new docopt.Either([new docopt.Argument('M'), new docopt.Required([new docopt.Argument('N'), new docopt.Argument('M')])]).match( [new docopt.Argument(null, 1), new docopt.Argument(null, 2)]),
            [true, [], [new docopt.Argument('N', 1), new docopt.Argument('M', 2)]]
        )


    it "test_one_or_more_match", ->
        assert.deepEqual(
            new docopt.OneOrMore([new docopt.Argument('N')]).match([new docopt.Argument(null, 9)])
            [true, [], [new docopt.Argument('N', 9)]]
        )
        assert.deepEqual new docopt.OneOrMore([new docopt.Argument('N')]).match([]), [false, [], []]
        assert.deepEqual(
            new docopt.OneOrMore([new docopt.Argument('N')]).match([new docopt.Option('-x')]),
            [false, [new docopt.Option('-x')], []]
        )
        assert.deepEqual(
            new docopt.OneOrMore([new docopt.Argument('N')]).match([new docopt.Argument(null, 9), new docopt.Argument(null, 8)]),
            [true, [], [new docopt.Argument('N', 9), new docopt.Argument('N', 8)]]
        )
        assert.deepEqual(
            new docopt.OneOrMore([new docopt.Argument('N')]).match([new docopt.Argument(null, 9), new docopt.Option('-x'), new docopt.Argument(null, 8)]),
            [true, [new docopt.Option('-x')], [new docopt.Argument('N', 9), new docopt.Argument('N', 8)]]
        )
        assert.deepEqual(
            new docopt.OneOrMore([new docopt.Option('-a')]).match([new docopt.Option('-a'), new docopt.Argument(null, 8), new docopt.Option('-a')]),
            [true, [new docopt.Argument(null, 8)], [new docopt.Option('-a'), new docopt.Option('-a')]]
        )
        assert.deepEqual(
            new docopt.OneOrMore([new docopt.Option('-a')]).match([new docopt.Argument(null, 8), new docopt.Option('-x')]),
            [false, [new docopt.Argument(null, 8), new docopt.Option('-x')], []]
        )
        assert.deepEqual(
            new docopt.OneOrMore([new docopt.Required([new docopt.Option('-a'), new docopt.Argument('N')])]).match([new docopt.Option('-a'), new docopt.Argument(null, 1), new docopt.Option('-x'), new docopt.Option('-a'), new docopt.Argument(null, 2)]),
            [true, [new docopt.Option('-x')], [new docopt.Option('-a'), new docopt.Argument('N', 1), new docopt.Option('-a'), new docopt.Argument('N', 2)]]
        )
        assert.deepEqual(
            new docopt.OneOrMore([new docopt.Optional([new docopt.Argument('N')])]).match([new docopt.Argument(null, 9)]),
            [true, [], [new docopt.Argument('N', 9)]]
        )


    it "test_list_argument_match", ->
        assert.deepEqual(
            new docopt.Required([new docopt.Argument('N'), new docopt.Argument('N')]).fix().match([new docopt.Argument(null, '1'), new docopt.Argument(null, '2')])
            [true, [], [new docopt.Argument('N', ['1', '2'])]]
        )
        assert.deepEqual(
            new docopt.OneOrMore([new docopt.Argument('N')]).fix().match([new docopt.Argument(null, '1'), new docopt.Argument(null, '2'), new docopt.Argument(null, '3')])
            [true, [], [new docopt.Argument('N', ['1', '2', '3'])]]
        )
        assert.deepEqual(
            new docopt.Required([new docopt.Argument('N'), new docopt.OneOrMore([new docopt.Argument('N')])]).fix().match([new docopt.Argument(null, '1'), new docopt.Argument(null, '2'), new docopt.Argument(null, '3')])
            [true, [], [new docopt.Argument('N', ['1', '2', '3'])]]
        )
        assert.deepEqual(
            new docopt.Required([new docopt.Argument('N'), new docopt.Required([new docopt.Argument('N')])]).fix().match([new docopt.Argument(null, '1'), new docopt.Argument(null, '2')]),
            [true, [], [new docopt.Argument('N', ['1', '2'])]]
        )


    it "test_basic_pattern_matching", ->
        # ( -a N [ -x Z ] )
        pattern = new docopt.Required([new docopt.Option('-a'), new docopt.Argument('N'), new docopt.Optional([new docopt.Option('-x'), new docopt.Argument('Z')])])
        # -a N
        assert.deepEqual(
            pattern.match([new docopt.Option('-a'), new docopt.Argument(null, 9)]),
            [true, [], [new docopt.Option('-a'), new docopt.Argument('N', 9)]]
        )
        # -a -x N Z
        assert.deepEqual(
            pattern.match([new docopt.Option('-a'), new docopt.Option('-x'), new docopt.Argument(null, 9), new docopt.Argument(null, 5)]),
            [true, [], [new docopt.Option('-a'), new docopt.Argument('N', 9), new docopt.Option('-x'), new docopt.Argument('Z', 5)]]
        )
        # -x N Z  # BZZ!
        assert.deepEqual(
            pattern.match([new docopt.Option('-x'), new docopt.Argument(null, 9), new docopt.Argument(null, 5)]),
            [false, [new docopt.Option('-x'), new docopt.Argument(null, 9), new docopt.Argument(null, 5)], []]
        )


    it "test_pattern_either", ->
        assert.deepEqual docopt.transform(new docopt.Option('-a')), new docopt.Either([new docopt.Required([new docopt.Option('-a')])])
        assert.deepEqual docopt.transform(new docopt.Argument('A')), new docopt.Either([new docopt.Required([new docopt.Argument('A')])])
        assert.deepEqual(
            docopt.transform(new docopt.Required([new docopt.Either([new docopt.Option('-a'), new docopt.Option('-b')]), new docopt.Option('-c')]))
            new docopt.Either([new docopt.Required([new docopt.Option('-a'), new docopt.Option('-c')]), new docopt.Required([new docopt.Option('-b'), new docopt.Option('-c')])])
        )
        assert.deepEqual(
            docopt.transform(new docopt.Optional([new docopt.Option('-a'), new docopt.Either([new docopt.Option('-b'), new docopt.Option('-c')])]))
            new docopt.Either([new docopt.Required([new docopt.Option('-b'), new docopt.Option('-a')]), new docopt.Required([new docopt.Option('-c'), new docopt.Option('-a')])])
        )
        assert.deepEqual(
            docopt.transform(new docopt.Either([new docopt.Option('-x'), new docopt.Either([new docopt.Option('-y'), new docopt.Option('-z')])]))
            new docopt.Either([new docopt.Required([new docopt.Option('-x')]), new docopt.Required([new docopt.Option('-y')]), new docopt.Required([new docopt.Option('-z')])])
        )
        assert.deepEqual(
            docopt.transform(new docopt.OneOrMore([new docopt.Argument('N'), new docopt.Argument('M')]))
            new docopt.Either([new docopt.Required([new docopt.Argument('N'), new docopt.Argument('M'), new docopt.Argument('N'), new docopt.Argument('M')])])
        )


    it "test_pattern_fix_repeating_arguments", ->
        assert.deepEqual new docopt.Option('-a').fix_repeating_arguments(), new docopt.Option('-a')
        assert.deepEqual new docopt.Argument('N', null).fix_repeating_arguments(), new docopt.Argument('N', null)
        assert.deepEqual(
            new docopt.Required([new docopt.Argument('N'), new docopt.Argument('N')]).fix_repeating_arguments()
            new docopt.Required([new docopt.Argument('N', []), new docopt.Argument('N', [])])
        )
        assert.deepEqual(
            new docopt.Either([new docopt.Argument('N'), new docopt.OneOrMore([new docopt.Argument('N')])]).fix()
            new docopt.Either([new docopt.Argument('N', []), new docopt.OneOrMore([new docopt.Argument('N', [])])])
        )


    # it "test_set", ->
    #     assert.deepEqual new docopt.Argument('N'), new docopt.Argument('N')
    #     assert.deepEqual new Set([new docopt.Argument('N'), new docopt.Argument('N')]), new Set([new docopt.Argument('N')])


    it "test_pattern_fix_identities_1", ->
        pattern = new docopt.Required([new docopt.Argument('N'), new docopt.Argument('N')])
        assert.deepEqual pattern.children[0], pattern.children[1]
        assert.notEqual pattern.children[0], pattern.children[1]
        pattern.fix_identities()
        assert.equal pattern.children[0], pattern.children[1]


    it "test_pattern_fix_identities_2", ->
        pattern = new docopt.Required([new docopt.Optional([new docopt.Argument('X'), new docopt.Argument('N')]), new docopt.Argument('N')])
        assert.deepEqual pattern.children[0].children[1], pattern.children[1]
        assert.notEqual pattern.children[0].children[1], pattern.children[1]
        pattern.fix_identities()
        assert.equal pattern.children[0].children[1], pattern.children[1]


    it "test_long_options_error_handling", ->
        assert.throws(
            () ->
                docopt.docopt('Usage: prog', {argv: '--non-existent', exit: false})
            ,
            docopt.DocoptExit
        )
        assert.throws(
            () ->
                docopt.docopt('Usage: prog [--version --verbose]\nOptions: --version\n --verbose', {argv: '--ver', exit: false})
            ,
            docopt.DocoptExit
        )
        assert.throws(
            () ->
                docopt.docopt('Usage: prog --long\nOptions: --long ARG', {argv: '', exit: false})
            ,
            docopt.DocoptLanguageError
        )
        assert.throws(
            () ->
                docopt.docopt('Usage: prog --long ARG\nOptions: --long ARG', {argv: '--long', exit: false})
            ,
            docopt.DocoptExit
        )
        assert.throws(
            () ->
                docopt.docopt('Usage: prog --long=ARG\nOptions: --long', {argv: '', exit: false})
            ,
            docopt.DocoptLanguageError
        )
        assert.throws(
            () ->
                docopt.docopt('Usage: prog --long\nOptions: --long', {argv: '--long=ARG', exit: false})
            ,
            docopt.DocoptExit
        )


    it "test_short_options_error_handling", ->
        assert.throws(
            () ->
                docopt.docopt('Usage: prog -x\nOptions: -x  this\n -x  that', {argv: '', exit: false})
            ,
            docopt.DocoptLanguageError
        )
        assert.throws(
            () ->
                docopt.docopt('Usage: prog', {argv: '-x', exit: false})
            ,
            docopt.DocoptExit
        )
        assert.throws(
            () ->
                docopt.docopt('Usage: prog -o\nOptions: -o ARG', {argv: '', exit: false})
            ,
            docopt.DocoptLanguageError
        )
        assert.throws(
            () ->
                docopt.docopt('Usage: prog -o ARG\nOptions: -o ARG', {argv: '-o', exit: false})
            ,
            docopt.DocoptExit
        )


    it "test_matching_paren", ->
        assert.throws(
            () ->
                docopt.docopt('Usage: prog [a [b]', {argv: '', exit: false})
            ,
            docopt.DocoptLanguageError
        )
        assert.throws(
            () ->
                docopt.docopt('Usage: prog [a [b] ] c )', {argv: '', exit: false})
            ,
            docopt.DocoptLanguageError
        )


    it "test_allow_double_dash", ->
        assert.deepEqual(
            docopt.docopt('usage: prog [-o] [--] <arg>\nkptions: -o', {argv: '-- -o', exit: false}),
            {'-o': false, '<arg>': '-o', '--': true}
        )
        assert.deepEqual(
            docopt.docopt('usage: prog [-o] [--] <arg>\nkptions: -o', {argv: '-o 1', exit: false}),
            {'-o': true, '<arg>': '1', '--': false}
        )
        assert.throws(
            () ->
                docopt.docopt('usage: prog [-o] <arg>\nOptions:-o', {argv: '-- -o', exit: false})
            ,
            docopt.DocoptExit # "--" is not allowed; FIXME?
        )


    it "test_docopt", ->
        doc = '''Usage: prog [-v] A

                 Options: -v  Be verbose.'''
        assert.deepEqual docopt.docopt(doc, {argv: 'arg', exit: false}), {'-v': false, 'A': 'arg'}
        assert.deepEqual docopt.docopt(doc, {argv: '-v arg', exit: false}), {'-v': true, 'A': 'arg'}

        doc = """Usage: prog [-vqr] [FILE]
                  prog INPUT OUTPUT
                  prog --help

        Options:
          -v  print status messages
          -q  report only file names
          -r  show all occurrences of the same error
          --help

        """
        assert.deepEqual(
            docopt.docopt(doc, {argv: '-v file.py', exit: false})
            {'-v': true, '-q': false, '-r': false, '--help': false, 'FILE': 'file.py', 'INPUT': null, 'OUTPUT': null}
        )
        assert.deepEqual(
            docopt.docopt(doc, {argv: '-v', exit: false})
            {'-v': true, '-q': false, '-r': false, '--help': false, 'FILE': null, 'INPUT': null, 'OUTPUT': null}
        )
        assert.throws(
            () ->
                docopt.docopt(doc, {argv: '-v input.py output.py', exit: false})
            ,
            docopt.DocoptExit
        )
        assert.throws(
            () ->
                docopt.docopt(doc, {argv: '--fake', exit: false})
            ,
            docopt.DocoptExit
        )
        assert.throws(
            () ->
                docopt.docopt(doc, {argv: '--hel', exit: false})
            ,
            Error
        )


    it "test_language_errors", ->
        assert.throws(
            () ->
                docopt.docopt('no usage with colon here', {argv: '', exit: false})
            ,
            docopt.DocoptLanguageError
        )
        assert.throws(
            () ->
                docopt.docopt('usage: here \n\n and again usage: here', {argv: '', exit: false})
            ,
            docopt.DocoptLanguageError
        )


    it "test_issue_40", ->
        assert.throws(
            () ->
                docopt.docopt('usage: prog --help-commands | --help', {argv: '--help', exit: false})
            ,
            Error
        )
        assert.deepEqual(
            docopt.docopt('usage: prog --aabb | --aa', {argv: '--aa', exit: false}),
            {'--aabb': false, '--aa': true}
        )


    # it "test_issue34_unicode_strings", ->
    #     try:
    #         assert.deepEqual docopt.docopt(eval("u'usage: prog [-o <a>]'"), ''),
    #                 {'-o': false, '<a>': null}
    #     except SyntaxError:
    #         pass  # Python 3


    it "test_count_multiple_flags", ->
        assert.deepEqual docopt.docopt('usage: prog [-v]', {argv: '-v', exit: false}), {'-v': true}
        assert.deepEqual docopt.docopt('usage: prog [-vv]', {argv: '', exit: false}), {'-v': 0}
        assert.deepEqual docopt.docopt('usage: prog [-vv]', {argv: '-v', exit: false}), {'-v': 1}
        assert.deepEqual docopt.docopt('usage: prog [-vv]', {argv: '-vv', exit: false}), {'-v': 2}
        assert.throws(
            () ->
                docopt.docopt('usage: prog [-vv]', {argv: '-vvv', exit: false})
            ,
            docopt.DocoptExit
        )
        assert.deepEqual docopt.docopt('usage: prog [-v | -vv | -vvv]', {argv: '-vvv', exit: false}), {'-v': 3}
        assert.deepEqual docopt.docopt('usage: prog -v...', {argv: '-vvvvvv', exit: false}), {'-v': 6}
        assert.deepEqual docopt.docopt('usage: prog [--ver --ver]', {argv: '--ver --ver', exit: false}), {'--ver': 2}


    it "test_any_options_parameter", ->
        assert.throws(
            () ->
                docopt.docopt('usage: prog [options]', {argv: '-foo --bar --spam=eggs', exit: false})
            ,
            docopt.DocoptExit
        )
        assert.throws(
            () ->
                docopt.docopt('usage: prog [options]', {argv: '--foo --bar --bar', exit: false})
            ,
            docopt.DocoptExit
        )
        assert.throws(
            () ->
                docopt.docopt('usage: prog [options]', {argv: '--bar --bar --bar -ffff', exit: false})
            ,
            docopt.DocoptExit
        )
        assert.throws(
            () ->
                docopt.docopt('usage: prog [options]', {argv: '--long=arg --long=another', exit: false})
            ,
            docopt.DocoptExit
        )


    it "test_default_value_for_positional_arguments", ->
        doc = """Usage: prog [--data=<data>...]\n
                 Options:\n\t-d --data=<arg>    Input data [default: x]
              """
        a = docopt.docopt(doc, {argv: '', exit: false})
        assert.deepEqual a, {'--data': ['x']}
        doc = """Usage: prog [--data=<data>...]\n
                 Options:\n\t-d --data=<arg>    Input data [default: x y]
              """
        a = docopt.docopt(doc, {argv: '', exit: false})
        assert.deepEqual a, {'--data': ['x', 'y']}
        doc = """Usage: prog [--data=<data>...]\n
                 Options:\n\t-d --data=<arg>    Input data [default: x y]
              """
        a = docopt.docopt(doc, {argv: '--data=this', exit: false})
        assert.deepEqual a, {'--data': ['this']}


    it "test_issue_59", ->
        assert.deepEqual docopt.docopt('usage: prog --long=<a>', {argv: '--long=', exit: false}), {'--long': ''}
        assert.deepEqual docopt.docopt('usage: prog -l <a>\nOptions: -l <a>', {argv: ['-l', ''], exit: false}), {'-l': ''}


    it "test_options_first", ->
        assert.deepEqual(
            docopt.docopt('usage: prog [--opt] [<args>...]', {argv: '--opt this that', exit: false})
            {'--opt': true, '<args>': ['this', 'that']}
        )
        assert.deepEqual(
            docopt.docopt('usage: prog [--opt] [<args>...]', {argv: 'this that --opt', exit: false})
            {'--opt': true, '<args>': ['this', 'that']}
        )
        assert.deepEqual(
            docopt.docopt('usage: prog [--opt] [<args>...]', {argv: 'this that --opt', exit: false, options_first: true})
            {'--opt': false, '<args>': ['this', 'that', '--opt']}
        )


    it "test_issue_68_options_shortcut_does_not_include_options_in_usage_pattern", ->
        args = docopt.docopt('usage: prog [-ab] [options]\nOptions: -x\n -y', {argv: '-ax', exit: false})
        # Need to use `is` (not `==`) since we want to make sure
        # that they are not 1/0, but strictly true/false:
        assert.equal args['-a'], true
        assert.equal args['-b'], false
        assert.equal args['-x'], true
        assert.equal args['-y'], false


    it "test_issue_65_evaluate_argv_when_called_not_when_imported", ->
        process.argv = ['node', 'prog', '-a']
        assert.deepEqual docopt.docopt('usage: prog [-ab]', {exit: false}), {'-a': true, '-b': false}
        process.argv = ['node', 'prog', '-b']
        assert.deepEqual docopt.docopt('usage: prog [-ab]', {exit: false}), {'-a': false, '-b': true}


    it "test_issue_71_double_dash_is_not_a_valid_option_argument", ->
        assert.throws(
            () ->
                docopt.docopt('usage: prog [--log=LEVEL] [--] <args>...', {argv: '--log -- 1 2', exit: false})
            ,
            docopt.DocoptExit
        )
        assert.throws(
            () ->
                docopt.docopt('''usage: prog [-l LEVEL] [--] <args>...
                      Options: -l LEVEL''', {argv: '-l -- 1 2', exit: false})
            ,
            docopt.DocoptExit
        )

    usage = '''usage: this

    usage:hai
    usage: this that

    usage: foo
           bar

    PROGRAM USAGE:
     foo
     bar
    usage:
    \ttoo
    \ttar
    Usage: eggs spam
    BAZZ
    usage: pit stop'''

    it "test_parse_section", ->
        assert.deepEqual docopt.parse_section('usage:', 'foo bar fizz buzz'), []
        assert.deepEqual docopt.parse_section('usage:', 'usage: prog'), ['usage: prog']
        assert.deepEqual docopt.parse_section('usage:', 'usage: -x\n -y'), ['usage: -x\n -y']
        assert.deepEqual docopt.parse_section('usage:', usage), [
            'usage: this',
            'usage:hai',
            'usage: this that',
            'usage: foo\n       bar',
            'PROGRAM USAGE:\n foo\n bar',
            'usage:\n\ttoo\n\ttar',
            'Usage: eggs spam',
            'usage: pit stop',
        ]


    it "test_issue_126_defaults_not_parsed_correctly_when_tabs", ->
        section = 'Options:\n\t--foo=<arg>  [default: bar]'
        assert.deepEqual docopt.parse_defaults(section), [new docopt.Option(null, '--foo', 1, 'bar')]
