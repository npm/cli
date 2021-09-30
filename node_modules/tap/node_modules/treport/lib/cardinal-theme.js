const chalk = require('chalk')
const {
  redBright,
  red,
  green,
  cyan,
  yellow,
  yellowBright,
  greenBright,
  magenta,
} = chalk
const hex = chalk.hex.bind(chalk)
const bgHex = chalk.bgHex.bind(chalk)

// this bit of line noise composes all the functions passed into it
// into a single function that calls them all.  So, it allows things
// like _(dim, magenta, bgBlue)
// Only need this if using multiple chalk functions together.
// const _ = (h, ...t) => x => h ? _(...t)(h(x)) : x

// squash chalk functions into single-arg, they get confused about the
// second argument sometimes
const _ = h => x => h(x)


// Change the below definitions in order to tweak the color theme.
module.exports = {
    'Boolean': {
      'true'   :  undefined
    , 'false'  :  undefined
    , _default :  _(redBright)
    }

  , 'Identifier': {
      'undefined' :  undefined
    , 'self'      :  _(redBright)
    , 'console'   :  _(cyan)
    , 'log'       :  _(cyan)
    , 'warn'      :  _(red)
    , 'error'     :  _(redBright)
    , _default    :  _(hex('#eee'))
    }

  , 'Null': {
      _default: _(hex('#999'))
    }

  , 'Numeric': {
    _default: _(cyan)
    }

  , 'String': {
      _default: function(s, info) {
        var nextToken = info.tokens[info.tokenIndex + 1]

        // show keys of object literals and json in different color
        return (nextToken && nextToken.type === 'Punctuator' && nextToken.value === ':')
          ? green(s)
          : greenBright(s)
      }
    }

  , 'Keyword': {
      'break'       :  undefined

    , 'case'        :  undefined
    , 'catch'       :  _(cyan)
    , 'class'       :  undefined
    , 'const'       :  undefined
    , 'continue'    :  undefined

    , 'debugger'    :  undefined
    , 'default'     :  undefined
    , 'delete'      :  _(red)
    , 'do'          :  undefined

    , 'else'        :  undefined
    , 'enum'        :  undefined
    , 'export'      :  undefined
    , 'extends'     :  undefined

    , 'finally'     :  _(cyan)
    , 'for'         :  undefined
    , 'function'    :  undefined

    , 'if'          :  undefined
    , 'implements'  :  undefined
    , 'import'      :  undefined
    , 'in'          :  undefined
    , 'instanceof'  :  undefined
    , 'let'         :  undefined
    , 'new'         :  _(red)
    , 'package'     :  undefined
    , 'private'     :  undefined
    , 'protected'   :  undefined
    , 'public'      :  undefined
    , 'return'      :  _(red)
    , 'static'      :  undefined
    , 'super'       :  undefined
    , 'switch'      :  undefined

    , 'this'        :  _(redBright)
    , 'throw'       :  undefined
    , 'try'         :  _(cyan)
    , 'typeof'      :  undefined

    , 'var'         :  _(green)
    , 'void'        :  undefined

    , 'while'       :  undefined
    , 'with'        :  undefined
    , 'yield'       :  undefined
    , _default      :  _(cyan)
  }
  , 'Punctuator': {
      ';': undefined
    , '.': _(green)
    , ',': _(green)

    , '{': _(yellow)
    , '}': _(yellow)
    , '(': undefined
    , ')': undefined
    , '[': _(yellow)
    , ']': _(yellow)

    , '<': undefined
    , '>': undefined
    , '+': undefined
    , '-': undefined
    , '*': undefined
    , '%': undefined
    , '&': undefined
    , '|': undefined
    , '^': undefined
    , '!': undefined
    , '~': undefined
    , '?': undefined
    , ':': undefined
    , '=': undefined

    , '<=': undefined
    , '>=': undefined
    , '==': undefined
    , '!=': undefined
    , '++': undefined
    , '--': undefined
    , '<<': undefined
    , '>>': undefined
    , '&&': undefined
    , '||': undefined
    , '+=': undefined
    , '-=': undefined
    , '*=': undefined
    , '%=': undefined
    , '&=': undefined
    , '|=': undefined
    , '^=': undefined
    , '/=': undefined
    , '=>': undefined
    , '**': undefined

    , '===': undefined
    , '!==': undefined
    , '>>>': undefined
    , '<<=': undefined
    , '>>=': undefined
    , '...': undefined
    , '**=': undefined

    , '>>>=': undefined

    , _default: _(yellowBright)
  }

    // line comment
  , Line: {
      _default: _(green)
    }

    /* block comment */
  , Block: {
      _default: _(green)
    }

  // JSX
  , JSXAttribute: {
    _default: _(magenta)
    }
  , JSXClosingElement: {
    _default: _(magenta)
    }
  , JSXElement: {
    _default: _(magenta)
    }
  , JSXEmptyExpression: {
    _default: _(magenta)
    }
  , JSXExpressionContainer: {
    _default: _(magenta)
    }
  , JSXIdentifier: {
    className: _(cyan)
    , _default: _(magenta)
    }
  , JSXMemberExpression: {
    _default: _(magenta)
    }
  , JSXNamespacedName: {
    _default: _(magenta)
    }
  , JSXOpeningElement: {
    _default: _(magenta)
    }
  , JSXSpreadAttribute: {
    _default: _(magenta)
    }
  , JSXText: {
    _default: _(greenBright)
    }

  , _default: _(hex('#ff0000'))
}
