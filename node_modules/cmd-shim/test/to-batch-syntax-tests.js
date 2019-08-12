var test = require('tap').test
var toBatchSyntax = require('../lib/to-batch-syntax')

test('replace $ expressions with % pair', function (t) {
    var assertReplacement = function(string, expected) {
        t.equal(toBatchSyntax.replaceDollarWithPercentPair(string), expected)
    }
    assertReplacement("$A", "%A%")
    assertReplacement("$A:$B", "%A%:%B%")
    assertReplacement("$A bla", "%A% bla")
    assertReplacement("${A}bla", "%A%bla")
    assertReplacement("$A $bla bla", "%A% %bla% bla")
    assertReplacement("${A}bla ${bla}bla", "%A%bla %bla%bla")
    assertReplacement("./lib:$NODE_PATH", "./lib:%NODE_PATH%")
    t.end()
})

test('convert variable declaration to set command', function(t) {
    t.equal(toBatchSyntax.convertToSetCommand("A",".lib:$A "), "@SET A=.lib:%A%\r\n")
    t.equal(toBatchSyntax.convertToSetCommand("", ""), "")
    t.equal(toBatchSyntax.convertToSetCommand(" ", ""), "")
    t.equal(toBatchSyntax.convertToSetCommand(" ", " "), "")
    t.equal(toBatchSyntax.convertToSetCommand(" ou", " ou "), "@SET ou=ou\r\n")
    t.end()
})
