print = -> console.log [].join.call arguments, ' '

enumerate = (array) ->
    i = 0
    ([i++, item] for item in array)

any = (array) ->
    return true in array

zip = (args...) ->
    lengthArray = (arr.length for arr in args)
    length = Math.min(lengthArray...)
    for i in [0...length]
        arr[i] for arr in args

String::partition = (separator) ->
    self = this
    if self.indexOf(separator) >= 0
        parts = self.split(separator)
        return [parts[0], separator, parts.slice(1).join(separator)]
    else
        return [String(self), '', '']

String::startsWith = (searchString, position) ->
    position = position || 0
    return this.lastIndexOf(searchString, position) == position

String::endsWith = (searchString, position) ->
    subjectString = this.toString()
    if (position == undefined || position > subjectString.length)
        position = subjectString.length
    position -= searchString.length
    lastIndex = subjectString.indexOf(searchString, position)
    return lastIndex != -1 && lastIndex == position

String::_split = ->
    this.trim().split(/\s+/).filter (i) -> i != ''

String::isUpper = ->
    /^[A-Z]+$/g.exec(this)

Number.isInteger = Number.isInteger || (value) ->
    return typeof value == "number" &&
           isFinite(value) &&
           Math.floor(value) == value

class DocoptLanguageError extends Error
    constructor: (@message) ->
        super @message

class DocoptExit extends Error
    constructor: (@message) ->
        super @message

class Pattern extends Object

    fix: ->
        @fix_identities()
        @fix_repeating_arguments()
        @

    fix_identities: (uniq=null) ->
        """Make pattern-tree tips point to same object if they are equal."""

        if not @hasOwnProperty 'children' then return @
        if uniq is null
            [uniq, flat] = [{}, @flat()]
            uniq[k] = k for k in flat

        for [i, c] in enumerate(@children)
            if not c.hasOwnProperty 'children'
                console.assert(uniq.hasOwnProperty(c))
                @children[i] = uniq[c]
            else
                c.fix_identities uniq
        @

    fix_repeating_arguments: ->
        """Fix elements that should accumulate/increment values."""

        either = (child.children for child in transform(@).children)
        for mycase in either
            counts = {}
            for c in mycase
                counts[c] = (if counts[c] then counts[c] else 0) + 1
            for e in (child for child in mycase when counts[child] > 1)
                if e.constructor is Argument or e.constructor is Option and e.argcount
                    if e.value is null
                        e.value = []
                    else if e.value.constructor isnt Array
                        e.value = e.value._split()
                if e.constructor is Command or e.constructor is Option and e.argcount == 0
                    e.value = 0
        @


transform = (pattern) ->
    """Expand pattern into an (almost) equivalent one, but with single Either.

    Example: ((-a | -b) (-c | -d)) => (-a -c | -a -d | -b -c | -b -d)
    Quirks: [-a] => (-a), (-a...) => (-a -a)

    """
    result = []
    groups = [[pattern]]
    while groups.length
        children = groups.shift()
        parents = [Required, Optional, OptionsShortcut, Either, OneOrMore]
        if (any((t in (children.map (c) -> c.constructor)) for t in parents))
            child = (c for c in children when c.constructor in parents)[0]
            index = children.indexOf(child)
            if index >= 0
                children.splice(index, 1)
            if child.constructor is Either
                for c in child.children
                    groups.push([c].concat children)
            else if child.constructor is OneOrMore
                groups.push((child.children.concat(child.children)).concat children)
            else
                groups.push(child.children.concat children)
        else
            result.push(children)

    return new Either(new Required e for e in result)


class LeafPattern extends Pattern
    """Leaf/terminal node of a pattern tree."""

    constructor: (@name, @value=null) ->

    toString: -> "#{@.constructor.name}(#{@name}, #{@value})"

    flat: (types=[]) ->
        types = if types instanceof Array then types else [types]
        if not types.length or @.constructor in types
            return [@]
        else return []

    match: (left, collected=null) ->
        collected = [] if collected is null
        [pos, match] = @.singleMatch left
        if match is null
            return [false, left, collected]
        left_ = left.slice(0, pos).concat(left.slice(pos + 1))
        same_name = (a for a in collected when a.name == @.name)
        if Number.isInteger(@value) or @value instanceof Array
            if Number.isInteger(@value)
                increment = 1
            else
                increment = if typeof match.value == 'string' then [match.value] else match.value
            if not same_name.length
                match.value = increment
                return [true, left_, collected.concat(match)]
            if Number.isInteger(@value)
                same_name[0].value += increment
            else
                same_name[0].value = [].concat(same_name[0].value, increment)
            return [true, left_, collected]
        return [true, left_, collected.concat(match)]


class BranchPattern extends Pattern
    """Branch/inner node of a pattern tree."""

    constructor: (children) ->
        @children = if children instanceof Array then children else [children]

    toString: -> "#{@.constructor.name}(#{(a for a in @children).join(', ')})"

    flat: (types=[]) ->
        types = if types instanceof Array then types else [types]
        if @.constructor in types then return [@]
        return (child.flat(types) for child in @children when child instanceof Pattern).reduce(((pv, cv) -> return [].concat pv, cv), [])


class Argument extends LeafPattern

    singleMatch: (left) ->
        for [n, pattern] in enumerate(left)
            if pattern.constructor is Argument
                return [n, new Argument(@name, pattern.value)]
        return [null, null]

    @parse: (source) ->
        name = /(<\S*?>)/ig.exec(source)[1]
        value = /\[default:\s+(.*)\]/ig.exec(source)
        return new Argument(name, if value then value[1] else null)


class Command extends Argument

    constructor: (@name, @value=false) ->

    singleMatch: (left) ->
        for [n, pattern] in enumerate(left)
            if pattern.constructor is Argument
                if pattern.value == @name
                    return [n, new Command(@name, true)]
                else
                    break
        return [null, null]

class Option extends LeafPattern

    constructor: (@short=null, @long=null, @argcount=0, value=false) ->
        console.assert(@argcount in [0,1])
        @value = if value is false and @argcount > 0 then null else value
        @name = @long or @short

    toString: -> "Option(#{@short}, #{@long}, #{@argcount}, #{@value})"

    @parse: (option_description) ->
        [short, long, argcount, value] = [null, null, 0, false]
        [options, _, description] = option_description.trim().partition('  ')
        options = options.replace /,|=/g, ' '
        for s in options._split()  # split on spaces
            if s.startsWith('--')
                long = s
            else if s.startsWith('-')
                short = s
            else
                argcount = 1
        if argcount > 0
            matched = /\[default:\s+(.*)\]/ig.exec(description)
            value = if matched then matched[1] else null
        new Option short, long, argcount, value

    singleMatch: (left) ->
        for [n, pattern] in enumerate(left)
            if @name == pattern.name
                return [n, pattern]
        return [null, null]


class Required extends BranchPattern

    match: (left, collected=null) ->
        collected = [] if collected is null
        l = left #copy(left)
        c = collected #copy(collected)
        for p in @children
            [matched, l, c] = p.match(l, c)
            if not matched
                return [false, left, collected]
        [true, l, c]


class Optional extends BranchPattern

    match: (left, collected=null) ->
        collected = [] if collected is null
        #left = copy(left)
        for p in @children
            [m, left, collected] = p.match(left, collected)
        [true, left, collected]


class OptionsShortcut extends Optional
    """Marker/placeholder for [options] shortcut."""


class OneOrMore extends BranchPattern

    match: (left, collected=null) ->
        console.assert(@children.length == 1)
        collected = [] if collected is null
        l = left #copy(left)
        c = collected #copy(collected)
        l_ = []
        matched = true
        times = 0
        while matched
            # could it be that something didn't match but changed l or c?
            [matched, l, c] = @children[0].match(l, c)
            times += if matched then 1 else 0
            if l_.join(', ') == l.join(', ') then break
            l_ = l #copy(l)
        if times >= 1 then return [true, l, c]
        [false, left, collected]


class Either extends BranchPattern

    match: (left, collected=null) ->
        collected = [] if collected is null
        outcomes = []
        for p in @children
            outcome = p.match(left, collected)
            if outcome[0] then outcomes.push(outcome)
        if outcomes.length > 0
            outcomes.sort((a,b) ->
                if a[1].length > b[1].length
                    1
                else if a[1].length < b[1].length
                    -1
                else
                    0)
            return outcomes[0]
        [false, left, collected]


# same as Tokens in python
class Tokens extends Array

    constructor: (source, @error=DocoptExit) ->
        stream = if source.constructor is String then source._split() else source
        @push.apply @, stream

    move: -> if @.length then [].shift.apply(@) else null

    current: -> if @.length then @[0] else null

    @from_pattern: (source) ->
        source = source.replace(/([\[\]\(\)\|]|\.\.\.)/g, ' $1 ')
        source = (s for s in source.split(/\s+|(\S*<.*?>)/) when s)
        return new Tokens source, DocoptLanguageError


parse_section = (name, source) ->
    matches = source.match new RegExp('^([^\n]*' + name + '[^\n]*\n?(?:[ \t].*?(?:\n|$))*)', 'igm')
    if matches
        return (s.trim() for s in matches)
    return []


parse_shorts = (tokens, options) ->
    """shorts ::= '-' ( chars )* [ [ ' ' ] chars ] ;"""
    token = tokens.move()
    console.assert token.startsWith('-') and not token.startsWith('--')
    left = token.replace(/^-+/g, '')
    parsed = []
    while left != ''
        [short, left] = ['-' + left[0], left[1..]]
        similar = (o for o in options when o.short == short)
        if similar.length > 1
            throw new tokens.error("#{short} is specified ambiguously #{similar.length} times")
        else if similar.length < 1
            o = new Option(short, null, 0)
            options.push(o)
            if tokens.error is DocoptExit
                o = new Option(short, null, 0, true)
        else  # why copying is necessary here?
            o = new Option(short, similar[0].long, similar[0].argcount, similar[0].value)
            value = null
            if o.argcount != 0
                if left == ''
                    if tokens.current() in [null, '--']
                        throw new tokens.error("#{short} requires argument")
                    value = tokens.move()
                else
                    value = left
                    left = ''
            if tokens.error is DocoptExit
                o.value = if value isnt null then value else true
        parsed.push(o)
    return parsed


parse_long = (tokens, options) ->
    """long ::= '--' chars [ ( ' ' | '=' ) chars ] ;"""
    [long, eq, value] = tokens.move().partition('=')
    console.assert long.startsWith('--')
    value = null if (eq == value and value == '')
    similar = (o for o in options when o.long == long)
    if tokens.error is DocoptExit and similar.length == 0  # if no exact match
        similar = (o for o in options when o.long and o.long.startsWith(long))
    if similar.length > 1  # might be simply specified ambiguously 2+ times?
        longs = (o.long for o in similar).join(', ')
        throw new tokens.error("#{long} is not a unique prefix: #{longs}?")
    else if similar.length < 1
        argcount = if (eq == '=') then 1 else 0
        o = new Option(null, long, argcount)
        options.push(o)
        if tokens.error is DocoptExit
            o = new Option(null, long, argcount, if argcount > 0 then value else true)
    else
        o = new Option(similar[0].short, similar[0].long, similar[0].argcount, similar[0].value)
        if o.argcount == 0
            if value isnt null
                throw new tokens.error("#{o.long} must not have an argument")
        else
            if value is null
                if tokens.current() in [null, '--']
                    throw new tokens.error("#{o.long} requires argument")
                value = tokens.move()
        if tokens.error is DocoptExit
            o.value = if value isnt null then value else true
    return [o]


parse_pattern = (source, options) ->
    tokens = Tokens.from_pattern source
    result = parse_expr tokens, options
    if tokens.current() isnt null
        throw new tokens.error 'unexpected ending: ' + (tokens.join ' ')
    new Required result


parse_expr = (tokens, options) ->
    """expr ::= seq ( '|' seq )* ;"""
    seq = parse_seq tokens, options

    if tokens.current() != '|'
        return seq

    result = if seq.length > 1 then [new Required seq] else seq
    while tokens.current() is '|'
        tokens.move()
        seq = parse_seq tokens, options
        result = result.concat(if seq.length > 1 then [new Required seq] else seq)

    return if result.length > 1 then [new Either result] else result


parse_seq = (tokens, options) ->
    """seq ::= ( atom [ '...' ] )* ;"""

    result = []
    while tokens.current() not in [null, ']', ')', '|']
        atom = parse_atom tokens, options
        if tokens.current() is '...'
            atom = [new OneOrMore atom]
            tokens.move()
        result = result.concat atom
    return result


parse_atom = (tokens, options) ->
    """atom ::= '(' expr ')' | '[' expr ']' | 'options'
             | long | shorts | argument | command ;
    """

    token = tokens.current()
    result = []
    if token in '(['
        tokens.move()
        [matching, patternType] = {'(': [')', Required], '[': [']', Optional]}[token]
        result = new patternType parse_expr(tokens, options)
        if tokens.move() != matching
            throw new tokens.error "Unmatched '"+token+"'"
        return [result]
    else if token is 'options'
        tokens.move()
        return [new OptionsShortcut]
    else if token.startsWith('--') and token != '--'
        return parse_long tokens, options
    else if token.startsWith('-') and token not in ['-', '--']
        return parse_shorts(tokens, options)
    else if token.startsWith('<') and token.endsWith('>') or token.isUpper()
        return [new Argument(tokens.move())]
    else
        [new Command tokens.move()]


parse_argv = (tokens, options, options_first=false) ->
    """Parse command-line argument vector.
    If options_first:
        argv ::= [ long | shorts ]* [ argument ]* [ '--' [ argument ]* ] ;
    else:
        argv ::= [ long | shorts | argument ]* [ '--' [ argument ]* ] ;
    """
    parsed = []
    while tokens.current() isnt null
        if tokens.current() == '--'
            return parsed.concat(new Argument(null, v) for v in tokens)
        else if tokens.current().startsWith('--')
            parsed = parsed.concat(parse_long(tokens, options))
        else if tokens.current().startsWith('-') and tokens.current() != '-'
            parsed = parsed.concat(parse_shorts(tokens, options))
        else if options_first
            return parsed.concat(new Argument(null, v) for v in tokens)
        else
            parsed.push(new Argument(null, tokens.move()))
    return parsed

parse_defaults = (doc) ->
    defaults = []
    for s in parse_section('options:', doc)
        # FIXME corner case "bla: options: --foo"
        [_, _, s] = s.partition(':')  # get rid of "options:"
        split = ('\n' + s).split(new RegExp('\\n[ \\t]*(-\\S+?)')).slice(1)
        odd  = (v for v in split by 2)
        even = (v for v in split[1..] by 2)
        split = (s1 + s2 for [s1, s2] in zip(odd, even))
        options = (Option.parse(s) for s in split when s.startsWith('-'))
        defaults.push.apply(defaults, options)
    return defaults

formal_usage = (section) ->
    [_, _, section] = section.partition ':' # drop "usage:"
    pu = section._split()
    return '( ' + ((if s == pu[0] then ') | (' else s) for s in pu[1..]).join(' ') + ' )'

extras = (help, version, options, doc) ->
    if help and any((o.name in ['--help', '-h']) and o.value for o in options)
        return doc.replace /^\s*|\s*$/, ''
    if version and any((o.name == '--version') and o.value for o in options)
        return version
    return ""

class Dict extends Object

    constructor: (pairs) ->
        @[key] = value for [key, value] in pairs

    toObject: () ->
        dict = {}
        dict[name] = @[name] for name in Object.keys(@).sort()
        return dict

docopt = (doc, kwargs={}) ->
    allowedargs = ['argv', 'name', 'help', 'version', 'options_first', 'exit']
    throw new Error "unrecognized argument to docopt: " for arg of kwargs \
        when arg not in allowedargs

    argv    = if kwargs.argv is undefined \
              then process.argv[2..] else kwargs.argv
    name    = if kwargs.name is undefined \
              then null else kwargs.name
    help    = if kwargs.help is undefined \
              then true else kwargs.help
    version = if kwargs.version is undefined \
              then null else kwargs.version
    options_first = if kwargs.options_first is undefined \
              then false else kwargs.options_first
    exit = if kwargs.exit is undefined \
              then true else kwargs.exit

    try
        usage_sections = parse_section 'usage:', doc
        if usage_sections.length == 0
            throw new DocoptLanguageError '"usage:" (case-insensitive) not found.'
        if usage_sections.length > 1
            throw new DocoptLanguageError 'More than one "usage:" (case-insensitive).'
        DocoptExit.usage = usage_sections[0]

        options = parse_defaults doc
        pattern = parse_pattern formal_usage(DocoptExit.usage), options

        argv = parse_argv new Tokens(argv), options, options_first
        pattern_options = pattern.flat(Option)
        for options_shortcut in pattern.flat(OptionsShortcut)
            doc_options = parse_defaults(doc)
            pattern_options_strings = (i.toString() for i in pattern_options)
            options_shortcut.children = doc_options.filter((item) -> return item.toString() not in pattern_options_strings)

        output = extras help, version, argv, doc
        if output
            if exit
                print output
                process.exit()
            else
                throw new Error output
        [matched, left, collected] = pattern.fix().match argv
        if matched and left.length is 0  # better message if left?
            return new Dict([a.name, a.value] for a in ([].concat pattern.flat(), collected)).toObject()
        throw new DocoptExit DocoptExit.usage
    catch e
        if (!exit)
            throw e
        else
            print e.message if e.message
            process.exit(1)

module.exports =
    docopt       : docopt
    DocoptLanguageError : DocoptLanguageError
    DocoptExit   : DocoptExit
    Option       : Option
    Argument     : Argument
    Command      : Command
    Required     : Required
    OptionsShortcut : OptionsShortcut
    Either       : Either
    Optional     : Optional
    Pattern      : Pattern
    OneOrMore    : OneOrMore
    Tokens  : Tokens
    Dict         : Dict
    transform    : transform
    formal_usage : formal_usage
    parse_section : parse_section
    parse_defaults: parse_defaults
    parse_pattern: parse_pattern
    parse_long   : parse_long
    parse_shorts : parse_shorts
    parse_argv   : parse_argv
