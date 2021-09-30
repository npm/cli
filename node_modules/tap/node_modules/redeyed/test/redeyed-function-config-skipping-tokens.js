'use strict'

var test = require('tape')
var redeyed = require('..')

test('given i skip 2 more tokens after each semicolon', function(t) {
  var calls = 0
  var opts = {
    Punctuator: {
      ';':  function identity(s, info) {
              // tell it to skip past second to last token that is 2 ahead of the current one
              calls++
              var skipToken = info.tokens[info.tokenIndex + 2]
              return skipToken ? { replacement: s, skipPastToken: skipToken } : s
            }
      }
    }

  ;[  { code: ';;;',  expectedCalls: 1 }
  ,  { code: ';;;;',  expectedCalls: 2 }
  ,  { code: '; ; ; ;',  expectedCalls: 2 }
  ,  { code: ';;; ;;; ;;; ;',  expectedCalls: 4 }
  ,  { code: ';;; ;;; ;;; ;;; ;',  expectedCalls: 5 }
  ,  { code: ';;; ;;; ;;; ;;; ;;;',  expectedCalls: 5 }
  ,  { code: ';;; ;;; ;;; ;;; ;;; ;',  expectedCalls: 6 }
  ].forEach(function(x) {
      calls = 0
      redeyed(x.code, opts)
      t.equals(calls, x.expectedCalls, 'calls ' + x.expectedCalls + ' times for ' + x.code)
    })
  t.end()
})

test('replace log', function(t) {
  var opts = {
    Identifier: {
      console: function replaceLog(s, info) {
        var code        =  info.code
        var idx         =  info.tokenIndex
        var tokens      =  info.tokens
        var kind        =  tokens[idx + 2].value
        var firstArgTkn =  tokens[idx + 4]
        var argIdx      =  idx + 3
        var open
        var tkn

        open = 1
        while (open) {
          tkn = tokens[++argIdx]

          if (tkn.value === '(') open++
          if (tkn.value === ')') open--
        }

        var argsIncludingClosingParen =  code.slice(firstArgTkn.range[0], tkn.range[1])
        var result                    =  'log.' + kind + '("main-logger", ' + argsIncludingClosingParen

        return { replacement: result, skipPastToken: tkn }
      }
    }
  }

  var origCode = [
       'console.info("info ", 1);'
     , 'console.warn("warn ", 3);'
     , 'console.error("error ", new Error("oh my!"));'
    ].join('\n')

  var expectedCode = [
      'log.info("main-logger", "info ", 1));'
    , 'log.warn("main-logger", "warn ", 3));'
    , 'log.error("main-logger", "error ", new Error("oh my!")));'
    ].join('\n')
  var code = redeyed(origCode, opts).code

  t.equals(code, expectedCode, 'transforms all log statements')
  t.end()
})
