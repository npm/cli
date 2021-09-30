'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function getImportValue(node) {
  return node.type === 'ImportDeclaration' ?
  node.source.value :
  node.moduleReference.expression.value;
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('first') },

    fixable: 'code',
    schema: [
    {
      type: 'string',
      'enum': ['absolute-first', 'disable-absolute-first'] }] },




  create: function () {function create(context) {
      function isPossibleDirective(node) {
        return node.type === 'ExpressionStatement' &&
        node.expression.type === 'Literal' &&
        typeof node.expression.value === 'string';
      }

      return {
        'Program': function () {function Program(n) {
            var body = n.body;
            var absoluteFirst = context.options[0] === 'absolute-first';
            var message = 'Import in body of module; reorder to top.';
            var sourceCode = context.getSourceCode();
            var originSourceCode = sourceCode.getText();
            var nonImportCount = 0;
            var anyExpressions = false;
            var anyRelative = false;
            var lastLegalImp = null;
            var errorInfos = [];
            var shouldSort = true;
            var lastSortNodesIndex = 0;
            body.forEach(function (node, index) {
              if (!anyExpressions && isPossibleDirective(node)) {
                return;
              }

              anyExpressions = true;

              if (node.type === 'ImportDeclaration' || node.type === 'TSImportEqualsDeclaration') {
                if (absoluteFirst) {
                  if (/^\./.test(getImportValue(node))) {
                    anyRelative = true;
                  } else if (anyRelative) {
                    context.report({
                      node: node.type === 'ImportDeclaration' ? node.source : node.moduleReference,
                      message: 'Absolute imports should come before relative imports.' });

                  }
                }
                if (nonImportCount > 0) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
                    for (var _iterator = context.getDeclaredVariables(node)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var variable = _step.value;
                      if (!shouldSort) break;
                      var references = variable.references;
                      if (references.length) {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
                          for (var _iterator2 = references[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var reference = _step2.value;
                            if (reference.identifier.range[0] < node.range[1]) {
                              shouldSort = false;
                              break;
                            }
                          }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
                      }
                    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
                  shouldSort && (lastSortNodesIndex = errorInfos.length);
                  errorInfos.push({
                    node: node,
                    range: [body[index - 1].range[1], node.range[1]] });

                } else {
                  lastLegalImp = node;
                }
              } else {
                nonImportCount++;
              }
            });
            if (!errorInfos.length) return;
            errorInfos.forEach(function (errorInfo, index) {
              var node = errorInfo.node;
              var infos = {
                node: node,
                message: message };

              if (index < lastSortNodesIndex) {
                infos.fix = function (fixer) {
                  return fixer.insertTextAfter(node, '');
                };
              } else if (index === lastSortNodesIndex) {
                var sortNodes = errorInfos.slice(0, lastSortNodesIndex + 1);
                infos.fix = function (fixer) {
                  var removeFixers = sortNodes.map(function (_errorInfo) {
                    return fixer.removeRange(_errorInfo.range);
                  });
                  var range = [0, removeFixers[removeFixers.length - 1].range[1]];
                  var insertSourceCode = sortNodes.map(function (_errorInfo) {
                    var nodeSourceCode = String.prototype.slice.apply(
                    originSourceCode, _errorInfo.range);

                    if (/\S/.test(nodeSourceCode[0])) {
                      return '\n' + nodeSourceCode;
                    }
                    return nodeSourceCode;
                  }).join('');
                  var insertFixer = null;
                  var replaceSourceCode = '';
                  if (!lastLegalImp) {
                    insertSourceCode =
                    insertSourceCode.trim() + insertSourceCode.match(/^(\s+)/)[0];
                  }
                  insertFixer = lastLegalImp ?
                  fixer.insertTextAfter(lastLegalImp, insertSourceCode) :
                  fixer.insertTextBefore(body[0], insertSourceCode);
                  var fixers = [insertFixer].concat(removeFixers);
                  fixers.forEach(function (computedFixer, i) {
                    replaceSourceCode += originSourceCode.slice(
                    fixers[i - 1] ? fixers[i - 1].range[1] : 0, computedFixer.range[0]) +
                    computedFixer.text;
                  });
                  return fixer.replaceTextRange(range, replaceSourceCode);
                };
              }
              context.report(infos);
            });
          }return Program;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9maXJzdC5qcyJdLCJuYW1lcyI6WyJnZXRJbXBvcnRWYWx1ZSIsIm5vZGUiLCJ0eXBlIiwic291cmNlIiwidmFsdWUiLCJtb2R1bGVSZWZlcmVuY2UiLCJleHByZXNzaW9uIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJkb2NzIiwidXJsIiwiZml4YWJsZSIsInNjaGVtYSIsImNyZWF0ZSIsImNvbnRleHQiLCJpc1Bvc3NpYmxlRGlyZWN0aXZlIiwibiIsImJvZHkiLCJhYnNvbHV0ZUZpcnN0Iiwib3B0aW9ucyIsIm1lc3NhZ2UiLCJzb3VyY2VDb2RlIiwiZ2V0U291cmNlQ29kZSIsIm9yaWdpblNvdXJjZUNvZGUiLCJnZXRUZXh0Iiwibm9uSW1wb3J0Q291bnQiLCJhbnlFeHByZXNzaW9ucyIsImFueVJlbGF0aXZlIiwibGFzdExlZ2FsSW1wIiwiZXJyb3JJbmZvcyIsInNob3VsZFNvcnQiLCJsYXN0U29ydE5vZGVzSW5kZXgiLCJmb3JFYWNoIiwiaW5kZXgiLCJ0ZXN0IiwicmVwb3J0IiwiZ2V0RGVjbGFyZWRWYXJpYWJsZXMiLCJ2YXJpYWJsZSIsInJlZmVyZW5jZXMiLCJsZW5ndGgiLCJyZWZlcmVuY2UiLCJpZGVudGlmaWVyIiwicmFuZ2UiLCJwdXNoIiwiZXJyb3JJbmZvIiwiaW5mb3MiLCJmaXgiLCJmaXhlciIsImluc2VydFRleHRBZnRlciIsInNvcnROb2RlcyIsInNsaWNlIiwicmVtb3ZlRml4ZXJzIiwibWFwIiwiX2Vycm9ySW5mbyIsInJlbW92ZVJhbmdlIiwiaW5zZXJ0U291cmNlQ29kZSIsIm5vZGVTb3VyY2VDb2RlIiwiU3RyaW5nIiwicHJvdG90eXBlIiwiYXBwbHkiLCJqb2luIiwiaW5zZXJ0Rml4ZXIiLCJyZXBsYWNlU291cmNlQ29kZSIsInRyaW0iLCJtYXRjaCIsImluc2VydFRleHRCZWZvcmUiLCJmaXhlcnMiLCJjb25jYXQiLCJjb21wdXRlZEZpeGVyIiwiaSIsInRleHQiLCJyZXBsYWNlVGV4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S0FBZCxDQUFvQixDQUFwQixDQUR4QjtBQUVsQjBCLGtDQUFjRSxJQUZsQjtBQUdELG1CQUpEO0FBS0EseUJBQU92QixNQUFNd0IsZ0JBQU4sQ0FBdUI3QixLQUF2QixFQUE4Qm9CLGlCQUE5QixDQUFQO0FBQ0QsaUJBOUJEO0FBK0JEO0FBQ0RoRCxzQkFBUXFCLE1BQVIsQ0FBZVUsS0FBZjtBQUNELGFBN0NEO0FBOENELFdBdkdELGtCQURLLEVBQVA7O0FBMEdELEtBakhELGlCQWZlLEVBQWpCIiwiZmlsZSI6ImZpcnN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbmZ1bmN0aW9uIGdldEltcG9ydFZhbHVlKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ0ltcG9ydERlY2xhcmF0aW9uJ1xuICAgID8gbm9kZS5zb3VyY2UudmFsdWVcbiAgICA6IG5vZGUubW9kdWxlUmVmZXJlbmNlLmV4cHJlc3Npb24udmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIHVybDogZG9jc1VybCgnZmlyc3QnKSxcbiAgICB9LFxuICAgIGZpeGFibGU6ICdjb2RlJyxcbiAgICBzY2hlbWE6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGVudW06IFsnYWJzb2x1dGUtZmlyc3QnLCAnZGlzYWJsZS1hYnNvbHV0ZS1maXJzdCddLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICBmdW5jdGlvbiBpc1Bvc3NpYmxlRGlyZWN0aXZlIChub2RlKSB7XG4gICAgICByZXR1cm4gbm9kZS50eXBlID09PSAnRXhwcmVzc2lvblN0YXRlbWVudCcgJiZcbiAgICAgICAgbm9kZS5leHByZXNzaW9uLnR5cGUgPT09ICdMaXRlcmFsJyAmJlxuICAgICAgICB0eXBlb2Ygbm9kZS5leHByZXNzaW9uLnZhbHVlID09PSAnc3RyaW5nJztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgJ1Byb2dyYW0nOiBmdW5jdGlvbiAobikge1xuICAgICAgICBjb25zdCBib2R5ID0gbi5ib2R5O1xuICAgICAgICBjb25zdCBhYnNvbHV0ZUZpcnN0ID0gY29udGV4dC5vcHRpb25zWzBdID09PSAnYWJzb2x1dGUtZmlyc3QnO1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gJ0ltcG9ydCBpbiBib2R5IG9mIG1vZHVsZTsgcmVvcmRlciB0byB0b3AuJztcbiAgICAgICAgY29uc3Qgc291cmNlQ29kZSA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpO1xuICAgICAgICBjb25zdCBvcmlnaW5Tb3VyY2VDb2RlID0gc291cmNlQ29kZS5nZXRUZXh0KCk7XG4gICAgICAgIGxldCBub25JbXBvcnRDb3VudCA9IDA7XG4gICAgICAgIGxldCBhbnlFeHByZXNzaW9ucyA9IGZhbHNlO1xuICAgICAgICBsZXQgYW55UmVsYXRpdmUgPSBmYWxzZTtcbiAgICAgICAgbGV0IGxhc3RMZWdhbEltcCA9IG51bGw7XG4gICAgICAgIGNvbnN0IGVycm9ySW5mb3MgPSBbXTtcbiAgICAgICAgbGV0IHNob3VsZFNvcnQgPSB0cnVlO1xuICAgICAgICBsZXQgbGFzdFNvcnROb2Rlc0luZGV4ID0gMDtcbiAgICAgICAgYm9keS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlLCBpbmRleCkge1xuICAgICAgICAgIGlmICghYW55RXhwcmVzc2lvbnMgJiYgaXNQb3NzaWJsZURpcmVjdGl2ZShub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFueUV4cHJlc3Npb25zID0gdHJ1ZTtcblxuICAgICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdJbXBvcnREZWNsYXJhdGlvbicgfHwgbm9kZS50eXBlID09PSAnVFNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbicpIHtcbiAgICAgICAgICAgIGlmIChhYnNvbHV0ZUZpcnN0KSB7XG4gICAgICAgICAgICAgIGlmICgvXlxcLi8udGVzdChnZXRJbXBvcnRWYWx1ZShub2RlKSkpIHtcbiAgICAgICAgICAgICAgICBhbnlSZWxhdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW55UmVsYXRpdmUpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgICBub2RlOiBub2RlLnR5cGUgPT09ICdJbXBvcnREZWNsYXJhdGlvbicgPyBub2RlLnNvdXJjZSA6IG5vZGUubW9kdWxlUmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0Fic29sdXRlIGltcG9ydHMgc2hvdWxkIGNvbWUgYmVmb3JlIHJlbGF0aXZlIGltcG9ydHMuJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vbkltcG9ydENvdW50ID4gMCkge1xuICAgICAgICAgICAgICBmb3IgKGNvbnN0IHZhcmlhYmxlIG9mIGNvbnRleHQuZ2V0RGVjbGFyZWRWYXJpYWJsZXMobm9kZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNob3VsZFNvcnQpIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSB2YXJpYWJsZS5yZWZlcmVuY2VzO1xuICAgICAgICAgICAgICAgIGlmIChyZWZlcmVuY2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCByZWZlcmVuY2Ugb2YgcmVmZXJlbmNlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVmZXJlbmNlLmlkZW50aWZpZXIucmFuZ2VbMF0gPCBub2RlLnJhbmdlWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgc2hvdWxkU29ydCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNob3VsZFNvcnQgJiYgKGxhc3RTb3J0Tm9kZXNJbmRleCA9IGVycm9ySW5mb3MubGVuZ3RoKTtcbiAgICAgICAgICAgICAgZXJyb3JJbmZvcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICAgIHJhbmdlOiBbYm9keVtpbmRleCAtIDFdLnJhbmdlWzFdLCBub2RlLnJhbmdlWzFdXSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBsYXN0TGVnYWxJbXAgPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub25JbXBvcnRDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghZXJyb3JJbmZvcy5sZW5ndGgpIHJldHVybjtcbiAgICAgICAgZXJyb3JJbmZvcy5mb3JFYWNoKGZ1bmN0aW9uIChlcnJvckluZm8sIGluZGV4KSB7XG4gICAgICAgICAgY29uc3Qgbm9kZSA9IGVycm9ySW5mby5ub2RlO1xuICAgICAgICAgIGNvbnN0IGluZm9zID0ge1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoaW5kZXggPCBsYXN0U29ydE5vZGVzSW5kZXgpIHtcbiAgICAgICAgICAgIGluZm9zLmZpeCA9IGZ1bmN0aW9uIChmaXhlcikge1xuICAgICAgICAgICAgICByZXR1cm4gZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKG5vZGUsICcnKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gbGFzdFNvcnROb2Rlc0luZGV4KSB7XG4gICAgICAgICAgICBjb25zdCBzb3J0Tm9kZXMgPSBlcnJvckluZm9zLnNsaWNlKDAsIGxhc3RTb3J0Tm9kZXNJbmRleCArIDEpO1xuICAgICAgICAgICAgaW5mb3MuZml4ID0gZnVuY3Rpb24gKGZpeGVyKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlbW92ZUZpeGVycyA9IHNvcnROb2Rlcy5tYXAoZnVuY3Rpb24gKF9lcnJvckluZm8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZml4ZXIucmVtb3ZlUmFuZ2UoX2Vycm9ySW5mby5yYW5nZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBjb25zdCByYW5nZSA9IFswLCByZW1vdmVGaXhlcnNbcmVtb3ZlRml4ZXJzLmxlbmd0aCAtIDFdLnJhbmdlWzFdXTtcbiAgICAgICAgICAgICAgbGV0IGluc2VydFNvdXJjZUNvZGUgPSBzb3J0Tm9kZXMubWFwKGZ1bmN0aW9uIChfZXJyb3JJbmZvKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZVNvdXJjZUNvZGUgPSBTdHJpbmcucHJvdG90eXBlLnNsaWNlLmFwcGx5KFxuICAgICAgICAgICAgICAgICAgb3JpZ2luU291cmNlQ29kZSwgX2Vycm9ySW5mby5yYW5nZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKC9cXFMvLnRlc3Qobm9kZVNvdXJjZUNvZGVbMF0pKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJ1xcbicgKyBub2RlU291cmNlQ29kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGVTb3VyY2VDb2RlO1xuICAgICAgICAgICAgICB9KS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgbGV0IGluc2VydEZpeGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgbGV0IHJlcGxhY2VTb3VyY2VDb2RlID0gJyc7XG4gICAgICAgICAgICAgIGlmICghbGFzdExlZ2FsSW1wKSB7XG4gICAgICAgICAgICAgICAgaW5zZXJ0U291cmNlQ29kZSA9XG4gICAgICAgICAgICAgICAgICAgIGluc2VydFNvdXJjZUNvZGUudHJpbSgpICsgaW5zZXJ0U291cmNlQ29kZS5tYXRjaCgvXihcXHMrKS8pWzBdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGluc2VydEZpeGVyID0gbGFzdExlZ2FsSW1wID9cbiAgICAgICAgICAgICAgICBmaXhlci5pbnNlcnRUZXh0QWZ0ZXIobGFzdExlZ2FsSW1wLCBpbnNlcnRTb3VyY2VDb2RlKSA6XG4gICAgICAgICAgICAgICAgZml4ZXIuaW5zZXJ0VGV4dEJlZm9yZShib2R5WzBdLCBpbnNlcnRTb3VyY2VDb2RlKTtcbiAgICAgICAgICAgICAgY29uc3QgZml4ZXJzID0gW2luc2VydEZpeGVyXS5jb25jYXQocmVtb3ZlRml4ZXJzKTtcbiAgICAgICAgICAgICAgZml4ZXJzLmZvckVhY2goZnVuY3Rpb24gKGNvbXB1dGVkRml4ZXIsIGkpIHtcbiAgICAgICAgICAgICAgICByZXBsYWNlU291cmNlQ29kZSArPSAob3JpZ2luU291cmNlQ29kZS5zbGljZShcbiAgICAgICAgICAgICAgICAgIGZpeGVyc1tpIC0gMV0gPyBmaXhlcnNbaSAtIDFdLnJhbmdlWzFdIDogMCwgY29tcHV0ZWRGaXhlci5yYW5nZVswXVxuICAgICAgICAgICAgICAgICkgKyBjb21wdXRlZEZpeGVyLnRleHQpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpeGVyLnJlcGxhY2VUZXh0UmFuZ2UocmFuZ2UsIHJlcGxhY2VTb3VyY2VDb2RlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRleHQucmVwb3J0KGluZm9zKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19