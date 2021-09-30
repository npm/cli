'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _toArray(arr) {return Array.isArray(arr) ? arr : Array.from(arr);}

function checkImports(imported, context) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = imported.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var _ref = _step.value;var _ref2 = _slicedToArray(_ref, 2);var _module = _ref2[0];var nodes = _ref2[1];
      if (nodes.length > 1) {
        var message = '\'' + String(_module) + '\' imported multiple times.';var _nodes = _toArray(
        nodes),first = _nodes[0],rest = _nodes.slice(1);
        var sourceCode = context.getSourceCode();
        var fix = getFix(first, rest, sourceCode);

        context.report({
          node: first.source,
          message: message,
          fix: fix // Attach the autofix (if any) to the first import.
        });var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {

          for (var _iterator2 = rest[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var node = _step2.value;
            context.report({
              node: node.source,
              message: message });

          }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
      }
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
}

function getFix(first, rest, sourceCode) {
  // Sorry ESLint <= 3 users, no autofix for you. Autofixing duplicate imports
  // requires multiple `fixer.whatever()` calls in the `fix`: We both need to
  // update the first one, and remove the rest. Support for multiple
  // `fixer.whatever()` in a single `fix` was added in ESLint 4.1.
  // `sourceCode.getCommentsBefore` was added in 4.0, so that's an easy thing to
  // check for.
  if (typeof sourceCode.getCommentsBefore !== 'function') {
    return undefined;
  }

  // Adjusting the first import might make it multiline, which could break
  // `eslint-disable-next-line` comments and similar, so bail if the first
  // import has comments. Also, if the first import is `import * as ns from
  // './foo'` there's nothing we can do.
  if (hasProblematicComments(first, sourceCode) || hasNamespace(first)) {
    return undefined;
  }

  var defaultImportNames = new Set(
  [first].concat(_toConsumableArray(rest)).map(getDefaultImportName).filter(Boolean));


  // Bail if there are multiple different default import names – it's up to the
  // user to choose which one to keep.
  if (defaultImportNames.size > 1) {
    return undefined;
  }

  // Leave it to the user to handle comments. Also skip `import * as ns from
  // './foo'` imports, since they cannot be merged into another import.
  var restWithoutComments = rest.filter(function (node) {return !(
    hasProblematicComments(node, sourceCode) ||
    hasNamespace(node));});


  var specifiers = restWithoutComments.
  map(function (node) {
    var tokens = sourceCode.getTokens(node);
    var openBrace = tokens.find(function (token) {return isPunctuator(token, '{');});
    var closeBrace = tokens.find(function (token) {return isPunctuator(token, '}');});

    if (openBrace == null || closeBrace == null) {
      return undefined;
    }

    return {
      importNode: node,
      text: sourceCode.text.slice(openBrace.range[1], closeBrace.range[0]),
      hasTrailingComma: isPunctuator(sourceCode.getTokenBefore(closeBrace), ','),
      isEmpty: !hasSpecifiers(node) };

  }).
  filter(Boolean);

  var unnecessaryImports = restWithoutComments.filter(function (node) {return (
      !hasSpecifiers(node) &&
      !hasNamespace(node) &&
      !specifiers.some(function (specifier) {return specifier.importNode === node;}));});


  var shouldAddDefault = getDefaultImportName(first) == null && defaultImportNames.size === 1;
  var shouldAddSpecifiers = specifiers.length > 0;
  var shouldRemoveUnnecessary = unnecessaryImports.length > 0;

  if (!(shouldAddDefault || shouldAddSpecifiers || shouldRemoveUnnecessary)) {
    return undefined;
  }

  return function (fixer) {
    var tokens = sourceCode.getTokens(first);
    var openBrace = tokens.find(function (token) {return isPunctuator(token, '{');});
    var closeBrace = tokens.find(function (token) {return isPunctuator(token, '}');});
    var firstToken = sourceCode.getFirstToken(first);var _defaultImportNames = _slicedToArray(
    defaultImportNames, 1),defaultImportName = _defaultImportNames[0];

    var firstHasTrailingComma =
    closeBrace != null &&
    isPunctuator(sourceCode.getTokenBefore(closeBrace), ',');
    var firstIsEmpty = !hasSpecifiers(first);var _specifiers$reduce =

    specifiers.reduce(
    function (_ref3, specifier) {var _ref4 = _slicedToArray(_ref3, 2),result = _ref4[0],needsComma = _ref4[1];
      return [
      needsComma && !specifier.isEmpty ? String(
      result) + ',' + String(specifier.text) : '' + String(
      result) + String(specifier.text),
      specifier.isEmpty ? needsComma : true];

    },
    ['', !firstHasTrailingComma && !firstIsEmpty]),_specifiers$reduce2 = _slicedToArray(_specifiers$reduce, 1),specifiersText = _specifiers$reduce2[0];


    var fixes = [];

    if (shouldAddDefault && openBrace == null && shouldAddSpecifiers) {
      // `import './foo'` → `import def, {...} from './foo'`
      fixes.push(
      fixer.insertTextAfter(firstToken, ' ' + String(defaultImportName) + ', {' + String(specifiersText) + '} from'));

    } else if (shouldAddDefault && openBrace == null && !shouldAddSpecifiers) {
      // `import './foo'` → `import def from './foo'`
      fixes.push(fixer.insertTextAfter(firstToken, ' ' + String(defaultImportName) + ' from'));
    } else if (shouldAddDefault && openBrace != null && closeBrace != null) {
      // `import {...} from './foo'` → `import def, {...} from './foo'`
      fixes.push(fixer.insertTextAfter(firstToken, ' ' + String(defaultImportName) + ','));
      if (shouldAddSpecifiers) {
        // `import def, {...} from './foo'` → `import def, {..., ...} from './foo'`
        fixes.push(fixer.insertTextBefore(closeBrace, specifiersText));
      }
    } else if (!shouldAddDefault && openBrace == null && shouldAddSpecifiers) {
      if (first.specifiers.length === 0) {
        // `import './foo'` → `import {...} from './foo'`
        fixes.push(fixer.insertTextAfter(firstToken, ' {' + String(specifiersText) + '} from'));
      } else {
        // `import def from './foo'` → `import def, {...} from './foo'`
        fixes.push(fixer.insertTextAfter(first.specifiers[0], ', {' + String(specifiersText) + '}'));
      }
    } else if (!shouldAddDefault && openBrace != null && closeBrace != null) {
      // `import {...} './foo'` → `import {..., ...} from './foo'`
      fixes.push(fixer.insertTextBefore(closeBrace, specifiersText));
    }

    // Remove imports whose specifiers have been moved into the first import.
    var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {for (var _iterator3 = specifiers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var specifier = _step3.value;
        var importNode = specifier.importNode;
        fixes.push(fixer.remove(importNode));

        var charAfterImportRange = [importNode.range[1], importNode.range[1] + 1];
        var charAfterImport = sourceCode.text.substring(charAfterImportRange[0], charAfterImportRange[1]);
        if (charAfterImport === '\n') {
          fixes.push(fixer.removeRange(charAfterImportRange));
        }
      }

      // Remove imports whose default import has been moved to the first import,
      // and side-effect-only imports that are unnecessary due to the first
      // import.
    } catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3['return']) {_iterator3['return']();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {for (var _iterator4 = unnecessaryImports[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var node = _step4.value;
        fixes.push(fixer.remove(node));

        var charAfterImportRange = [node.range[1], node.range[1] + 1];
        var charAfterImport = sourceCode.text.substring(charAfterImportRange[0], charAfterImportRange[1]);
        if (charAfterImport === '\n') {
          fixes.push(fixer.removeRange(charAfterImportRange));
        }
      }} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4['return']) {_iterator4['return']();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}

    return fixes;
  };
}

function isPunctuator(node, value) {
  return node.type === 'Punctuator' && node.value === value;
}

// Get the name of the default import of `node`, if any.
function getDefaultImportName(node) {
  var defaultSpecifier = node.specifiers.
  find(function (specifier) {return specifier.type === 'ImportDefaultSpecifier';});
  return defaultSpecifier != null ? defaultSpecifier.local.name : undefined;
}

// Checks whether `node` has a namespace import.
function hasNamespace(node) {
  var specifiers = node.specifiers.
  filter(function (specifier) {return specifier.type === 'ImportNamespaceSpecifier';});
  return specifiers.length > 0;
}

// Checks whether `node` has any non-default specifiers.
function hasSpecifiers(node) {
  var specifiers = node.specifiers.
  filter(function (specifier) {return specifier.type === 'ImportSpecifier';});
  return specifiers.length > 0;
}

// It's not obvious what the user wants to do with comments associated with
// duplicate imports, so skip imports with comments when autofixing.
function hasProblematicComments(node, sourceCode) {
  return (
    hasCommentBefore(node, sourceCode) ||
    hasCommentAfter(node, sourceCode) ||
    hasCommentInsideNonSpecifiers(node, sourceCode));

}

// Checks whether `node` has a comment (that ends) on the previous line or on
// the same line as `node` (starts).
function hasCommentBefore(node, sourceCode) {
  return sourceCode.getCommentsBefore(node).
  some(function (comment) {return comment.loc.end.line >= node.loc.start.line - 1;});
}

// Checks whether `node` has a comment (that starts) on the same line as `node`
// (ends).
function hasCommentAfter(node, sourceCode) {
  return sourceCode.getCommentsAfter(node).
  some(function (comment) {return comment.loc.start.line === node.loc.end.line;});
}

// Checks whether `node` has any comments _inside,_ except inside the `{...}`
// part (if any).
function hasCommentInsideNonSpecifiers(node, sourceCode) {
  var tokens = sourceCode.getTokens(node);
  var openBraceIndex = tokens.findIndex(function (token) {return isPunctuator(token, '{');});
  var closeBraceIndex = tokens.findIndex(function (token) {return isPunctuator(token, '}');});
  // Slice away the first token, since we're no looking for comments _before_
  // `node` (only inside). If there's a `{...}` part, look for comments before
  // the `{`, but not before the `}` (hence the `+1`s).
  var someTokens = openBraceIndex >= 0 && closeBraceIndex >= 0 ?
  tokens.slice(1, openBraceIndex + 1).concat(tokens.slice(closeBraceIndex + 1)) :
  tokens.slice(1);
  return someTokens.some(function (token) {return sourceCode.getCommentsBefore(token).length > 0;});
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: (0, _docsUrl2['default'])('no-duplicates') },

    fixable: 'code',
    schema: [
    {
      type: 'object',
      properties: {
        considerQueryString: {
          type: 'boolean' } },


      additionalProperties: false }] },




  create: function () {function create(context) {
      // Prepare the resolver from options.
      var considerQueryStringOption = context.options[0] &&
      context.options[0]['considerQueryString'];
      var defaultResolver = function () {function defaultResolver(sourcePath) {return (0, _resolve2['default'])(sourcePath, context) || sourcePath;}return defaultResolver;}();
      var resolver = considerQueryStringOption ? function (sourcePath) {
        var parts = sourcePath.match(/^([^?]*)\?(.*)$/);
        if (!parts) {
          return defaultResolver(sourcePath);
        }
        return defaultResolver(parts[1]) + '?' + parts[2];
      } : defaultResolver;

      var imported = new Map();
      var nsImported = new Map();
      var defaultTypesImported = new Map();
      var namedTypesImported = new Map();

      function getImportMap(n) {
        if (n.importKind === 'type') {
          return n.specifiers.length > 0 && n.specifiers[0].type === 'ImportDefaultSpecifier' ? defaultTypesImported : namedTypesImported;
        }

        return hasNamespace(n) ? nsImported : imported;
      }

      return {
        ImportDeclaration: function () {function ImportDeclaration(n) {
            // resolved path will cover aliased duplicates
            var resolvedPath = resolver(n.source.value);
            var importMap = getImportMap(n);

            if (importMap.has(resolvedPath)) {
              importMap.get(resolvedPath).push(n);
            } else {
              importMap.set(resolvedPath, [n]);
            }
          }return ImportDeclaration;}(),

        'Program:exit': function () {function ProgramExit() {
            checkImports(imported, context);
            checkImports(nsImported, context);
            checkImports(defaultTypesImported, context);
            checkImports(namedTypesImported, context);
          }return ProgramExit;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1kdXBsaWNhdGVzLmpzIl0sIm5hbWVzIjpbImNoZWNrSW1wb3J0cyIsImltcG9ydGVkIiwiY29udGV4dCIsImVudHJpZXMiLCJtb2R1bGUiLCJub2RlcyIsImxlbmd0aCIsIm1lc3NhZ2UiLCJmaXJzdCIsInJlc3QiLCJzb3VyY2VDb2RlIiwiZ2V0U291cmNlQ29kZSIsImZpeCIsImdldEZpeCIsInJlcG9ydCIsIm5vZGUiLCJzb3VyY2UiLCJnZXRDb21tZW50c0JlZm9yZSIsInVuZGVmaW5lZCIsImhhc1Byb2JsZW1hdGljQ29tbWVudHMiLCJoYXNOYW1lc3BhY2UiLCJkZWZhdWx0SW1wb3J0TmFtZXMiLCJTZXQiLCJtYXAiLCJnZXREZWZhdWx0SW1wb3J0TmFtZSIsImZpbHRlciIsIkJvb2xlYW4iLCJzaXplIiwicmVzdFdpdGhvdXRDb21tZW50cyIsInNwZWNpZmllcnMiLCJ0b2tlbnMiLCJnZXRUb2tlbnMiLCJvcGVuQnJhY2UiLCJmaW5kIiwiaXNQdW5jdHVhdG9yIiwidG9rZW4iLCJjbG9zZUJyYWNlIiwiaW1wb3J0Tm9kZSIsInRleHQiLCJzbGljZSIsInJhbmdlIiwiaGFzVHJhaWxpbmdDb21tYSIsImdldFRva2VuQmVmb3JlIiwiaXNFbXB0eSIsImhhc1NwZWNpZmllcnMiLCJ1bm5lY2Vzc2FyeUltcG9ydHMiLCJzb21lIiwic3BlY2lmaWVyIiwic2hvdWxkQWRkRGVmYXVsdCIsInNob3VsZEFkZFNwZWNpZmllcnMiLCJzaG91bGRSZW1vdmVVbm5lY2Vzc2FyeSIsImZpcnN0VG9rZW4iLCJnZXRGaXJzdFRva2VuIiwiZGVmYXVsdEltcG9ydE5hbWUiLCJmaXJzdEhhc1RyYWlsaW5nQ29tbWEiLCJmaXJzdElzRW1wdHkiLCJyZWR1Y2UiLCJyZXN1bHQiLCJuZWVkc0NvbW1hIiwic3BlY2lmaWVyc1RleHQiLCJmaXhlcyIsInB1c2giLCJmaXhlciIsImluc2VydFRleHRBZnRlciIsImluc2VydFRleHRCZWZvcmUiLCJyZW1vdmUiLCJjaGFyQWZ0ZXJJbXBvcnRSYW5nZSIsImNoYXJBZnRlckltcG9ydCIsInN1YnN0cmluZyIsInJlbW92ZVJhbmdlIiwidmFsdWUiLCJ0eXBlIiwiZGVmYXVsdFNwZWNpZmllciIsImxvY2FsIiwibmFtZSIsImhhc0NvbW1lbnRCZWZvcmUiLCJoYXNDb21tZW50QWZ0ZXIiLCJoYXNDb21tZW50SW5zaWRlTm9uU3BlY2lmaWVycyIsImNvbW1lbnQiLCJsb2MiLCJlbmQiLCJsaW5lIiwic3RhcnQiLCJnZXRDb21tZW50c0FmdGVyIiwib3BlbkJyYWNlSW5kZXgiLCJmaW5kSW5kZXgiLCJjbG9zZUJyYWNlSW5kZXgiLCJzb21lVG9rZW5zIiwiY29uY2F0IiwiZXhwb3J0cyIsIm1ldGEiLCJkb2NzIiwidXJsIiwiZml4YWJsZSIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJjb25zaWRlclF1ZXJ5U3RyaW5nIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJjcmVhdGUiLCJjb25zaWRlclF1ZXJ5U3RyaW5nT3B0aW9uIiwib3B0aW9ucyIsImRlZmF1bHRSZXNvbHZlciIsInNvdXJjZVBhdGgiLCJyZXNvbHZlciIsInBhcnRzIiwibWF0Y2giLCJNYXAiLCJuc0ltcG9ydGVkIiwiZGVmYXVsdFR5cGVzSW1wb3J0ZWQiLCJuYW1lZFR5cGVzSW1wb3J0ZWQiLCJnZXRJbXBvcnRNYXAiLCJuIiwiaW1wb3J0S2luZCIsIkltcG9ydERlY2xhcmF0aW9uIiwicmVzb2x2ZWRQYXRoIiwiaW1wb3J0TWFwIiwiaGFzIiwiZ2V0Iiwic2V0Il0sIm1hcHBpbmdzIjoicW9CQUFBLHNEO0FBQ0EscUM7O0FBRUEsU0FBU0EsWUFBVCxDQUFzQkMsUUFBdEIsRUFBZ0NDLE9BQWhDLEVBQXlDO0FBQ3ZDLHlCQUE4QkQsU0FBU0UsT0FBVCxFQUE5Qiw4SEFBa0QsZ0VBQXRDQyxPQUFzQyxnQkFBOUJDLEtBQThCO0FBQ2hELFVBQUlBLE1BQU1DLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUNwQixZQUFNQyx3QkFBY0gsT0FB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QUFhQyxRQUFiLEVBQXVCQyxPQUF2QjtBQUNBRix5QkFBYTJHLFVBQWIsRUFBeUJ6RyxPQUF6QjtBQUNBRix5QkFBYTRHLG9CQUFiLEVBQW1DMUcsT0FBbkM7QUFDQUYseUJBQWE2RyxrQkFBYixFQUFpQzNHLE9BQWpDO0FBQ0QsV0FsQkksd0JBQVA7O0FBb0JELEtBOUNELGlCQXBCZSxFQUFqQiIsImZpbGUiOiJuby1kdXBsaWNhdGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlc29sdmUgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5mdW5jdGlvbiBjaGVja0ltcG9ydHMoaW1wb3J0ZWQsIGNvbnRleHQpIHtcbiAgZm9yIChjb25zdCBbbW9kdWxlLCBub2Rlc10gb2YgaW1wb3J0ZWQuZW50cmllcygpKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgJyR7bW9kdWxlfScgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMuYDtcbiAgICAgIGNvbnN0IFtmaXJzdCwgLi4ucmVzdF0gPSBub2RlcztcbiAgICAgIGNvbnN0IHNvdXJjZUNvZGUgPSBjb250ZXh0LmdldFNvdXJjZUNvZGUoKTtcbiAgICAgIGNvbnN0IGZpeCA9IGdldEZpeChmaXJzdCwgcmVzdCwgc291cmNlQ29kZSk7XG5cbiAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgbm9kZTogZmlyc3Quc291cmNlLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBmaXgsIC8vIEF0dGFjaCB0aGUgYXV0b2ZpeCAoaWYgYW55KSB0byB0aGUgZmlyc3QgaW1wb3J0LlxuICAgICAgfSk7XG5cbiAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiByZXN0KSB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlOiBub2RlLnNvdXJjZSxcbiAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Rml4KGZpcnN0LCByZXN0LCBzb3VyY2VDb2RlKSB7XG4gIC8vIFNvcnJ5IEVTTGludCA8PSAzIHVzZXJzLCBubyBhdXRvZml4IGZvciB5b3UuIEF1dG9maXhpbmcgZHVwbGljYXRlIGltcG9ydHNcbiAgLy8gcmVxdWlyZXMgbXVsdGlwbGUgYGZpeGVyLndoYXRldmVyKClgIGNhbGxzIGluIHRoZSBgZml4YDogV2UgYm90aCBuZWVkIHRvXG4gIC8vIHVwZGF0ZSB0aGUgZmlyc3Qgb25lLCBhbmQgcmVtb3ZlIHRoZSByZXN0LiBTdXBwb3J0IGZvciBtdWx0aXBsZVxuICAvLyBgZml4ZXIud2hhdGV2ZXIoKWAgaW4gYSBzaW5nbGUgYGZpeGAgd2FzIGFkZGVkIGluIEVTTGludCA0LjEuXG4gIC8vIGBzb3VyY2VDb2RlLmdldENvbW1lbnRzQmVmb3JlYCB3YXMgYWRkZWQgaW4gNC4wLCBzbyB0aGF0J3MgYW4gZWFzeSB0aGluZyB0b1xuICAvLyBjaGVjayBmb3IuXG4gIGlmICh0eXBlb2Ygc291cmNlQ29kZS5nZXRDb21tZW50c0JlZm9yZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBBZGp1c3RpbmcgdGhlIGZpcnN0IGltcG9ydCBtaWdodCBtYWtlIGl0IG11bHRpbGluZSwgd2hpY2ggY291bGQgYnJlYWtcbiAgLy8gYGVzbGludC1kaXNhYmxlLW5leHQtbGluZWAgY29tbWVudHMgYW5kIHNpbWlsYXIsIHNvIGJhaWwgaWYgdGhlIGZpcnN0XG4gIC8vIGltcG9ydCBoYXMgY29tbWVudHMuIEFsc28sIGlmIHRoZSBmaXJzdCBpbXBvcnQgaXMgYGltcG9ydCAqIGFzIG5zIGZyb21cbiAgLy8gJy4vZm9vJ2AgdGhlcmUncyBub3RoaW5nIHdlIGNhbiBkby5cbiAgaWYgKGhhc1Byb2JsZW1hdGljQ29tbWVudHMoZmlyc3QsIHNvdXJjZUNvZGUpIHx8IGhhc05hbWVzcGFjZShmaXJzdCkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgZGVmYXVsdEltcG9ydE5hbWVzID0gbmV3IFNldChcbiAgICBbZmlyc3QsIC4uLnJlc3RdLm1hcChnZXREZWZhdWx0SW1wb3J0TmFtZSkuZmlsdGVyKEJvb2xlYW4pXG4gICk7XG5cbiAgLy8gQmFpbCBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgZGlmZmVyZW50IGRlZmF1bHQgaW1wb3J0IG5hbWVzIOKAkyBpdCdzIHVwIHRvIHRoZVxuICAvLyB1c2VyIHRvIGNob29zZSB3aGljaCBvbmUgdG8ga2VlcC5cbiAgaWYgKGRlZmF1bHRJbXBvcnROYW1lcy5zaXplID4gMSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBMZWF2ZSBpdCB0byB0aGUgdXNlciB0byBoYW5kbGUgY29tbWVudHMuIEFsc28gc2tpcCBgaW1wb3J0ICogYXMgbnMgZnJvbVxuICAvLyAnLi9mb28nYCBpbXBvcnRzLCBzaW5jZSB0aGV5IGNhbm5vdCBiZSBtZXJnZWQgaW50byBhbm90aGVyIGltcG9ydC5cbiAgY29uc3QgcmVzdFdpdGhvdXRDb21tZW50cyA9IHJlc3QuZmlsdGVyKG5vZGUgPT4gIShcbiAgICBoYXNQcm9ibGVtYXRpY0NvbW1lbnRzKG5vZGUsIHNvdXJjZUNvZGUpIHx8XG4gICAgaGFzTmFtZXNwYWNlKG5vZGUpXG4gICkpO1xuXG4gIGNvbnN0IHNwZWNpZmllcnMgPSByZXN0V2l0aG91dENvbW1lbnRzXG4gICAgLm1hcChub2RlID0+IHtcbiAgICAgIGNvbnN0IHRva2VucyA9IHNvdXJjZUNvZGUuZ2V0VG9rZW5zKG5vZGUpO1xuICAgICAgY29uc3Qgb3BlbkJyYWNlID0gdG9rZW5zLmZpbmQodG9rZW4gPT4gaXNQdW5jdHVhdG9yKHRva2VuLCAneycpKTtcbiAgICAgIGNvbnN0IGNsb3NlQnJhY2UgPSB0b2tlbnMuZmluZCh0b2tlbiA9PiBpc1B1bmN0dWF0b3IodG9rZW4sICd9JykpO1xuXG4gICAgICBpZiAob3BlbkJyYWNlID09IG51bGwgfHwgY2xvc2VCcmFjZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGltcG9ydE5vZGU6IG5vZGUsXG4gICAgICAgIHRleHQ6IHNvdXJjZUNvZGUudGV4dC5zbGljZShvcGVuQnJhY2UucmFuZ2VbMV0sIGNsb3NlQnJhY2UucmFuZ2VbMF0pLFxuICAgICAgICBoYXNUcmFpbGluZ0NvbW1hOiBpc1B1bmN0dWF0b3Ioc291cmNlQ29kZS5nZXRUb2tlbkJlZm9yZShjbG9zZUJyYWNlKSwgJywnKSxcbiAgICAgICAgaXNFbXB0eTogIWhhc1NwZWNpZmllcnMobm9kZSksXG4gICAgICB9O1xuICAgIH0pXG4gICAgLmZpbHRlcihCb29sZWFuKTtcblxuICBjb25zdCB1bm5lY2Vzc2FyeUltcG9ydHMgPSByZXN0V2l0aG91dENvbW1lbnRzLmZpbHRlcihub2RlID0+XG4gICAgIWhhc1NwZWNpZmllcnMobm9kZSkgJiZcbiAgICAhaGFzTmFtZXNwYWNlKG5vZGUpICYmXG4gICAgIXNwZWNpZmllcnMuc29tZShzcGVjaWZpZXIgPT4gc3BlY2lmaWVyLmltcG9ydE5vZGUgPT09IG5vZGUpXG4gICk7XG5cbiAgY29uc3Qgc2hvdWxkQWRkRGVmYXVsdCA9IGdldERlZmF1bHRJbXBvcnROYW1lKGZpcnN0KSA9PSBudWxsICYmIGRlZmF1bHRJbXBvcnROYW1lcy5zaXplID09PSAxO1xuICBjb25zdCBzaG91bGRBZGRTcGVjaWZpZXJzID0gc3BlY2lmaWVycy5sZW5ndGggPiAwO1xuICBjb25zdCBzaG91bGRSZW1vdmVVbm5lY2Vzc2FyeSA9IHVubmVjZXNzYXJ5SW1wb3J0cy5sZW5ndGggPiAwO1xuXG4gIGlmICghKHNob3VsZEFkZERlZmF1bHQgfHwgc2hvdWxkQWRkU3BlY2lmaWVycyB8fCBzaG91bGRSZW1vdmVVbm5lY2Vzc2FyeSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIGZpeGVyID0+IHtcbiAgICBjb25zdCB0b2tlbnMgPSBzb3VyY2VDb2RlLmdldFRva2VucyhmaXJzdCk7XG4gICAgY29uc3Qgb3BlbkJyYWNlID0gdG9rZW5zLmZpbmQodG9rZW4gPT4gaXNQdW5jdHVhdG9yKHRva2VuLCAneycpKTtcbiAgICBjb25zdCBjbG9zZUJyYWNlID0gdG9rZW5zLmZpbmQodG9rZW4gPT4gaXNQdW5jdHVhdG9yKHRva2VuLCAnfScpKTtcbiAgICBjb25zdCBmaXJzdFRva2VuID0gc291cmNlQ29kZS5nZXRGaXJzdFRva2VuKGZpcnN0KTtcbiAgICBjb25zdCBbZGVmYXVsdEltcG9ydE5hbWVdID0gZGVmYXVsdEltcG9ydE5hbWVzO1xuXG4gICAgY29uc3QgZmlyc3RIYXNUcmFpbGluZ0NvbW1hID1cbiAgICAgIGNsb3NlQnJhY2UgIT0gbnVsbCAmJlxuICAgICAgaXNQdW5jdHVhdG9yKHNvdXJjZUNvZGUuZ2V0VG9rZW5CZWZvcmUoY2xvc2VCcmFjZSksICcsJyk7XG4gICAgY29uc3QgZmlyc3RJc0VtcHR5ID0gIWhhc1NwZWNpZmllcnMoZmlyc3QpO1xuXG4gICAgY29uc3QgW3NwZWNpZmllcnNUZXh0XSA9IHNwZWNpZmllcnMucmVkdWNlKFxuICAgICAgKFtyZXN1bHQsIG5lZWRzQ29tbWFdLCBzcGVjaWZpZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBuZWVkc0NvbW1hICYmICFzcGVjaWZpZXIuaXNFbXB0eVxuICAgICAgICAgICAgPyBgJHtyZXN1bHR9LCR7c3BlY2lmaWVyLnRleHR9YFxuICAgICAgICAgICAgOiBgJHtyZXN1bHR9JHtzcGVjaWZpZXIudGV4dH1gLFxuICAgICAgICAgIHNwZWNpZmllci5pc0VtcHR5ID8gbmVlZHNDb21tYSA6IHRydWUsXG4gICAgICAgIF07XG4gICAgICB9LFxuICAgICAgWycnLCAhZmlyc3RIYXNUcmFpbGluZ0NvbW1hICYmICFmaXJzdElzRW1wdHldXG4gICAgKTtcblxuICAgIGNvbnN0IGZpeGVzID0gW107XG5cbiAgICBpZiAoc2hvdWxkQWRkRGVmYXVsdCAmJiBvcGVuQnJhY2UgPT0gbnVsbCAmJiBzaG91bGRBZGRTcGVjaWZpZXJzKSB7XG4gICAgICAvLyBgaW1wb3J0ICcuL2ZvbydgIOKGkiBgaW1wb3J0IGRlZiwgey4uLn0gZnJvbSAnLi9mb28nYFxuICAgICAgZml4ZXMucHVzaChcbiAgICAgICAgZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKGZpcnN0VG9rZW4sIGAgJHtkZWZhdWx0SW1wb3J0TmFtZX0sIHske3NwZWNpZmllcnNUZXh0fX0gZnJvbWApXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoc2hvdWxkQWRkRGVmYXVsdCAmJiBvcGVuQnJhY2UgPT0gbnVsbCAmJiAhc2hvdWxkQWRkU3BlY2lmaWVycykge1xuICAgICAgLy8gYGltcG9ydCAnLi9mb28nYCDihpIgYGltcG9ydCBkZWYgZnJvbSAnLi9mb28nYFxuICAgICAgZml4ZXMucHVzaChmaXhlci5pbnNlcnRUZXh0QWZ0ZXIoZmlyc3RUb2tlbiwgYCAke2RlZmF1bHRJbXBvcnROYW1lfSBmcm9tYCkpO1xuICAgIH0gZWxzZSBpZiAoc2hvdWxkQWRkRGVmYXVsdCAmJiBvcGVuQnJhY2UgIT0gbnVsbCAmJiBjbG9zZUJyYWNlICE9IG51bGwpIHtcbiAgICAgIC8vIGBpbXBvcnQgey4uLn0gZnJvbSAnLi9mb28nYCDihpIgYGltcG9ydCBkZWYsIHsuLi59IGZyb20gJy4vZm9vJ2BcbiAgICAgIGZpeGVzLnB1c2goZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKGZpcnN0VG9rZW4sIGAgJHtkZWZhdWx0SW1wb3J0TmFtZX0sYCkpO1xuICAgICAgaWYgKHNob3VsZEFkZFNwZWNpZmllcnMpIHtcbiAgICAgICAgLy8gYGltcG9ydCBkZWYsIHsuLi59IGZyb20gJy4vZm9vJ2Ag4oaSIGBpbXBvcnQgZGVmLCB7Li4uLCAuLi59IGZyb20gJy4vZm9vJ2BcbiAgICAgICAgZml4ZXMucHVzaChmaXhlci5pbnNlcnRUZXh0QmVmb3JlKGNsb3NlQnJhY2UsIHNwZWNpZmllcnNUZXh0KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghc2hvdWxkQWRkRGVmYXVsdCAmJiBvcGVuQnJhY2UgPT0gbnVsbCAmJiBzaG91bGRBZGRTcGVjaWZpZXJzKSB7XG4gICAgICBpZiAoZmlyc3Quc3BlY2lmaWVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgLy8gYGltcG9ydCAnLi9mb28nYCDihpIgYGltcG9ydCB7Li4ufSBmcm9tICcuL2ZvbydgXG4gICAgICAgIGZpeGVzLnB1c2goZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKGZpcnN0VG9rZW4sIGAgeyR7c3BlY2lmaWVyc1RleHR9fSBmcm9tYCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gYGltcG9ydCBkZWYgZnJvbSAnLi9mb28nYCDihpIgYGltcG9ydCBkZWYsIHsuLi59IGZyb20gJy4vZm9vJ2BcbiAgICAgICAgZml4ZXMucHVzaChmaXhlci5pbnNlcnRUZXh0QWZ0ZXIoZmlyc3Quc3BlY2lmaWVyc1swXSwgYCwgeyR7c3BlY2lmaWVyc1RleHR9fWApKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFzaG91bGRBZGREZWZhdWx0ICYmIG9wZW5CcmFjZSAhPSBudWxsICYmIGNsb3NlQnJhY2UgIT0gbnVsbCkge1xuICAgICAgLy8gYGltcG9ydCB7Li4ufSAnLi9mb28nYCDihpIgYGltcG9ydCB7Li4uLCAuLi59IGZyb20gJy4vZm9vJ2BcbiAgICAgIGZpeGVzLnB1c2goZml4ZXIuaW5zZXJ0VGV4dEJlZm9yZShjbG9zZUJyYWNlLCBzcGVjaWZpZXJzVGV4dCkpO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBpbXBvcnRzIHdob3NlIHNwZWNpZmllcnMgaGF2ZSBiZWVuIG1vdmVkIGludG8gdGhlIGZpcnN0IGltcG9ydC5cbiAgICBmb3IgKGNvbnN0IHNwZWNpZmllciBvZiBzcGVjaWZpZXJzKSB7XG4gICAgICBjb25zdCBpbXBvcnROb2RlID0gc3BlY2lmaWVyLmltcG9ydE5vZGU7XG4gICAgICBmaXhlcy5wdXNoKGZpeGVyLnJlbW92ZShpbXBvcnROb2RlKSk7XG5cbiAgICAgIGNvbnN0IGNoYXJBZnRlckltcG9ydFJhbmdlID0gW2ltcG9ydE5vZGUucmFuZ2VbMV0sIGltcG9ydE5vZGUucmFuZ2VbMV0gKyAxXTtcbiAgICAgIGNvbnN0IGNoYXJBZnRlckltcG9ydCA9IHNvdXJjZUNvZGUudGV4dC5zdWJzdHJpbmcoY2hhckFmdGVySW1wb3J0UmFuZ2VbMF0sIGNoYXJBZnRlckltcG9ydFJhbmdlWzFdKTtcbiAgICAgIGlmIChjaGFyQWZ0ZXJJbXBvcnQgPT09ICdcXG4nKSB7XG4gICAgICAgIGZpeGVzLnB1c2goZml4ZXIucmVtb3ZlUmFuZ2UoY2hhckFmdGVySW1wb3J0UmFuZ2UpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgaW1wb3J0cyB3aG9zZSBkZWZhdWx0IGltcG9ydCBoYXMgYmVlbiBtb3ZlZCB0byB0aGUgZmlyc3QgaW1wb3J0LFxuICAgIC8vIGFuZCBzaWRlLWVmZmVjdC1vbmx5IGltcG9ydHMgdGhhdCBhcmUgdW5uZWNlc3NhcnkgZHVlIHRvIHRoZSBmaXJzdFxuICAgIC8vIGltcG9ydC5cbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdW5uZWNlc3NhcnlJbXBvcnRzKSB7XG4gICAgICBmaXhlcy5wdXNoKGZpeGVyLnJlbW92ZShub2RlKSk7XG5cbiAgICAgIGNvbnN0IGNoYXJBZnRlckltcG9ydFJhbmdlID0gW25vZGUucmFuZ2VbMV0sIG5vZGUucmFuZ2VbMV0gKyAxXTtcbiAgICAgIGNvbnN0IGNoYXJBZnRlckltcG9ydCA9IHNvdXJjZUNvZGUudGV4dC5zdWJzdHJpbmcoY2hhckFmdGVySW1wb3J0UmFuZ2VbMF0sIGNoYXJBZnRlckltcG9ydFJhbmdlWzFdKTtcbiAgICAgIGlmIChjaGFyQWZ0ZXJJbXBvcnQgPT09ICdcXG4nKSB7XG4gICAgICAgIGZpeGVzLnB1c2goZml4ZXIucmVtb3ZlUmFuZ2UoY2hhckFmdGVySW1wb3J0UmFuZ2UpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZml4ZXM7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzUHVuY3R1YXRvcihub2RlLCB2YWx1ZSkge1xuICByZXR1cm4gbm9kZS50eXBlID09PSAnUHVuY3R1YXRvcicgJiYgbm9kZS52YWx1ZSA9PT0gdmFsdWU7XG59XG5cbi8vIEdldCB0aGUgbmFtZSBvZiB0aGUgZGVmYXVsdCBpbXBvcnQgb2YgYG5vZGVgLCBpZiBhbnkuXG5mdW5jdGlvbiBnZXREZWZhdWx0SW1wb3J0TmFtZShub2RlKSB7XG4gIGNvbnN0IGRlZmF1bHRTcGVjaWZpZXIgPSBub2RlLnNwZWNpZmllcnNcbiAgICAuZmluZChzcGVjaWZpZXIgPT4gc3BlY2lmaWVyLnR5cGUgPT09ICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJyk7XG4gIHJldHVybiBkZWZhdWx0U3BlY2lmaWVyICE9IG51bGwgPyBkZWZhdWx0U3BlY2lmaWVyLmxvY2FsLm5hbWUgOiB1bmRlZmluZWQ7XG59XG5cbi8vIENoZWNrcyB3aGV0aGVyIGBub2RlYCBoYXMgYSBuYW1lc3BhY2UgaW1wb3J0LlxuZnVuY3Rpb24gaGFzTmFtZXNwYWNlKG5vZGUpIHtcbiAgY29uc3Qgc3BlY2lmaWVycyA9IG5vZGUuc3BlY2lmaWVyc1xuICAgIC5maWx0ZXIoc3BlY2lmaWVyID0+IHNwZWNpZmllci50eXBlID09PSAnSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyJyk7XG4gIHJldHVybiBzcGVjaWZpZXJzLmxlbmd0aCA+IDA7XG59XG5cbi8vIENoZWNrcyB3aGV0aGVyIGBub2RlYCBoYXMgYW55IG5vbi1kZWZhdWx0IHNwZWNpZmllcnMuXG5mdW5jdGlvbiBoYXNTcGVjaWZpZXJzKG5vZGUpIHtcbiAgY29uc3Qgc3BlY2lmaWVycyA9IG5vZGUuc3BlY2lmaWVyc1xuICAgIC5maWx0ZXIoc3BlY2lmaWVyID0+IHNwZWNpZmllci50eXBlID09PSAnSW1wb3J0U3BlY2lmaWVyJyk7XG4gIHJldHVybiBzcGVjaWZpZXJzLmxlbmd0aCA+IDA7XG59XG5cbi8vIEl0J3Mgbm90IG9idmlvdXMgd2hhdCB0aGUgdXNlciB3YW50cyB0byBkbyB3aXRoIGNvbW1lbnRzIGFzc29jaWF0ZWQgd2l0aFxuLy8gZHVwbGljYXRlIGltcG9ydHMsIHNvIHNraXAgaW1wb3J0cyB3aXRoIGNvbW1lbnRzIHdoZW4gYXV0b2ZpeGluZy5cbmZ1bmN0aW9uIGhhc1Byb2JsZW1hdGljQ29tbWVudHMobm9kZSwgc291cmNlQ29kZSkge1xuICByZXR1cm4gKFxuICAgIGhhc0NvbW1lbnRCZWZvcmUobm9kZSwgc291cmNlQ29kZSkgfHxcbiAgICBoYXNDb21tZW50QWZ0ZXIobm9kZSwgc291cmNlQ29kZSkgfHxcbiAgICBoYXNDb21tZW50SW5zaWRlTm9uU3BlY2lmaWVycyhub2RlLCBzb3VyY2VDb2RlKVxuICApO1xufVxuXG4vLyBDaGVja3Mgd2hldGhlciBgbm9kZWAgaGFzIGEgY29tbWVudCAodGhhdCBlbmRzKSBvbiB0aGUgcHJldmlvdXMgbGluZSBvciBvblxuLy8gdGhlIHNhbWUgbGluZSBhcyBgbm9kZWAgKHN0YXJ0cykuXG5mdW5jdGlvbiBoYXNDb21tZW50QmVmb3JlKG5vZGUsIHNvdXJjZUNvZGUpIHtcbiAgcmV0dXJuIHNvdXJjZUNvZGUuZ2V0Q29tbWVudHNCZWZvcmUobm9kZSlcbiAgICAuc29tZShjb21tZW50ID0+IGNvbW1lbnQubG9jLmVuZC5saW5lID49IG5vZGUubG9jLnN0YXJ0LmxpbmUgLSAxKTtcbn1cblxuLy8gQ2hlY2tzIHdoZXRoZXIgYG5vZGVgIGhhcyBhIGNvbW1lbnQgKHRoYXQgc3RhcnRzKSBvbiB0aGUgc2FtZSBsaW5lIGFzIGBub2RlYFxuLy8gKGVuZHMpLlxuZnVuY3Rpb24gaGFzQ29tbWVudEFmdGVyKG5vZGUsIHNvdXJjZUNvZGUpIHtcbiAgcmV0dXJuIHNvdXJjZUNvZGUuZ2V0Q29tbWVudHNBZnRlcihub2RlKVxuICAgIC5zb21lKGNvbW1lbnQgPT4gY29tbWVudC5sb2Muc3RhcnQubGluZSA9PT0gbm9kZS5sb2MuZW5kLmxpbmUpO1xufVxuXG4vLyBDaGVja3Mgd2hldGhlciBgbm9kZWAgaGFzIGFueSBjb21tZW50cyBfaW5zaWRlLF8gZXhjZXB0IGluc2lkZSB0aGUgYHsuLi59YFxuLy8gcGFydCAoaWYgYW55KS5cbmZ1bmN0aW9uIGhhc0NvbW1lbnRJbnNpZGVOb25TcGVjaWZpZXJzKG5vZGUsIHNvdXJjZUNvZGUpIHtcbiAgY29uc3QgdG9rZW5zID0gc291cmNlQ29kZS5nZXRUb2tlbnMobm9kZSk7XG4gIGNvbnN0IG9wZW5CcmFjZUluZGV4ID0gdG9rZW5zLmZpbmRJbmRleCh0b2tlbiA9PiBpc1B1bmN0dWF0b3IodG9rZW4sICd7JykpO1xuICBjb25zdCBjbG9zZUJyYWNlSW5kZXggPSB0b2tlbnMuZmluZEluZGV4KHRva2VuID0+IGlzUHVuY3R1YXRvcih0b2tlbiwgJ30nKSk7XG4gIC8vIFNsaWNlIGF3YXkgdGhlIGZpcnN0IHRva2VuLCBzaW5jZSB3ZSdyZSBubyBsb29raW5nIGZvciBjb21tZW50cyBfYmVmb3JlX1xuICAvLyBgbm9kZWAgKG9ubHkgaW5zaWRlKS4gSWYgdGhlcmUncyBhIGB7Li4ufWAgcGFydCwgbG9vayBmb3IgY29tbWVudHMgYmVmb3JlXG4gIC8vIHRoZSBge2AsIGJ1dCBub3QgYmVmb3JlIHRoZSBgfWAgKGhlbmNlIHRoZSBgKzFgcykuXG4gIGNvbnN0IHNvbWVUb2tlbnMgPSBvcGVuQnJhY2VJbmRleCA+PSAwICYmIGNsb3NlQnJhY2VJbmRleCA+PSAwXG4gICAgPyB0b2tlbnMuc2xpY2UoMSwgb3BlbkJyYWNlSW5kZXggKyAxKS5jb25jYXQodG9rZW5zLnNsaWNlKGNsb3NlQnJhY2VJbmRleCArIDEpKVxuICAgIDogdG9rZW5zLnNsaWNlKDEpO1xuICByZXR1cm4gc29tZVRva2Vucy5zb21lKHRva2VuID0+IHNvdXJjZUNvZGUuZ2V0Q29tbWVudHNCZWZvcmUodG9rZW4pLmxlbmd0aCA+IDApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdwcm9ibGVtJyxcbiAgICBkb2NzOiB7XG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLWR1cGxpY2F0ZXMnKSxcbiAgICB9LFxuICAgIGZpeGFibGU6ICdjb2RlJyxcbiAgICBzY2hlbWE6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBjb25zaWRlclF1ZXJ5U3RyaW5nOiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICAvLyBQcmVwYXJlIHRoZSByZXNvbHZlciBmcm9tIG9wdGlvbnMuXG4gICAgY29uc3QgY29uc2lkZXJRdWVyeVN0cmluZ09wdGlvbiA9IGNvbnRleHQub3B0aW9uc1swXSAmJlxuICAgICAgY29udGV4dC5vcHRpb25zWzBdWydjb25zaWRlclF1ZXJ5U3RyaW5nJ107XG4gICAgY29uc3QgZGVmYXVsdFJlc29sdmVyID0gc291cmNlUGF0aCA9PiByZXNvbHZlKHNvdXJjZVBhdGgsIGNvbnRleHQpIHx8IHNvdXJjZVBhdGg7XG4gICAgY29uc3QgcmVzb2x2ZXIgPSBjb25zaWRlclF1ZXJ5U3RyaW5nT3B0aW9uID8gKHNvdXJjZVBhdGggPT4ge1xuICAgICAgY29uc3QgcGFydHMgPSBzb3VyY2VQYXRoLm1hdGNoKC9eKFteP10qKVxcPyguKikkLyk7XG4gICAgICBpZiAoIXBhcnRzKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0UmVzb2x2ZXIoc291cmNlUGF0aCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmYXVsdFJlc29sdmVyKHBhcnRzWzFdKSArICc/JyArIHBhcnRzWzJdO1xuICAgIH0pIDogZGVmYXVsdFJlc29sdmVyO1xuXG4gICAgY29uc3QgaW1wb3J0ZWQgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgbnNJbXBvcnRlZCA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBkZWZhdWx0VHlwZXNJbXBvcnRlZCA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBuYW1lZFR5cGVzSW1wb3J0ZWQgPSBuZXcgTWFwKCk7XG5cbiAgICBmdW5jdGlvbiBnZXRJbXBvcnRNYXAobikge1xuICAgICAgaWYgKG4uaW1wb3J0S2luZCA9PT0gJ3R5cGUnKSB7XG4gICAgICAgIHJldHVybiBuLnNwZWNpZmllcnMubGVuZ3RoID4gMCAmJiBuLnNwZWNpZmllcnNbMF0udHlwZSA9PT0gJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInID8gZGVmYXVsdFR5cGVzSW1wb3J0ZWQgOiBuYW1lZFR5cGVzSW1wb3J0ZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoYXNOYW1lc3BhY2UobikgPyBuc0ltcG9ydGVkIDogaW1wb3J0ZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uKG4pIHtcbiAgICAgICAgLy8gcmVzb2x2ZWQgcGF0aCB3aWxsIGNvdmVyIGFsaWFzZWQgZHVwbGljYXRlc1xuICAgICAgICBjb25zdCByZXNvbHZlZFBhdGggPSByZXNvbHZlcihuLnNvdXJjZS52YWx1ZSk7XG4gICAgICAgIGNvbnN0IGltcG9ydE1hcCA9IGdldEltcG9ydE1hcChuKTtcblxuICAgICAgICBpZiAoaW1wb3J0TWFwLmhhcyhyZXNvbHZlZFBhdGgpKSB7XG4gICAgICAgICAgaW1wb3J0TWFwLmdldChyZXNvbHZlZFBhdGgpLnB1c2gobik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW1wb3J0TWFwLnNldChyZXNvbHZlZFBhdGgsIFtuXSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgICdQcm9ncmFtOmV4aXQnKCkge1xuICAgICAgICBjaGVja0ltcG9ydHMoaW1wb3J0ZWQsIGNvbnRleHQpO1xuICAgICAgICBjaGVja0ltcG9ydHMobnNJbXBvcnRlZCwgY29udGV4dCk7XG4gICAgICAgIGNoZWNrSW1wb3J0cyhkZWZhdWx0VHlwZXNJbXBvcnRlZCwgY29udGV4dCk7XG4gICAgICAgIGNoZWNrSW1wb3J0cyhuYW1lZFR5cGVzSW1wb3J0ZWQsIGNvbnRleHQpO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==