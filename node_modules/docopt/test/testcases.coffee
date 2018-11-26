assert = require 'assert'
path = require 'path'
fs = require 'fs'
docopt = require '../docopt.coffee'

partition = (text, delimiter) ->
    parts = text.split delimiter
    return [parts[0], delimiter, parts[1..].join(delimiter)]

load_test_cases = () ->
    testcases_path = path.resolve './test/testcases.docopt'
    if fs.existsSync testcases_path
        try
            return fs.readFileSync(testcases_path).toString()
        catch err
            return console.error "Could not read ./test/testcases.docopt file"
    else
        return console.error "./test/testcases.docopt not exists"

parse_test = (raw) ->
    raw = raw.replace(/#.*/gm, '').trim()
    if (raw.indexOf '"""') is 0
        raw = raw[3..]

    tests = []
    for fixture in raw.split('r"""')
        name = ''
        [doc, _, body] = partition fixture, '"""'
        cases = []
        for mycase in body.split('$')[1..]
            [argv, _, expect] = partition mycase.trim(), '\n'
            expect = JSON.parse(expect)
            [prog, _, argv] = partition argv.trim(), ' '
            cases.push([prog, argv, expect])
        tests.push [name, doc, cases]
    return tests

collect = () ->
    index = 1
    collected = []
    testcases = load_test_cases()
    for [name, doc, cases] in parse_test testcases
        name = 'testcases.docopt'
        for mycase in cases
            collected.push [[name, index], doc, mycase]
            index++
    return collected


describe 'testcases.coffee', ->
    collected = collect()
    collected.forEach (c) ->
        [test_file, index] = c[0]
        doc = c[1]
        [prog, argv, expected] = c[2]
        it "testcase #{index} `#{[prog, argv].join(' ')}`", ->
            try
                result = docopt.docopt(doc, {name: prog, argv: argv, exit: false})
            catch e
                if e.constructor is docopt.DocoptExit
                    result = 'user-error'
            finally
                assert.deepEqual result, expected
