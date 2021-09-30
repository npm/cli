'use strict';




var _staticRequire = require('../core/staticRequire');var _staticRequire2 = _interopRequireDefault(_staticRequire);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);

var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}
var log = (0, _debug2['default'])('eslint-plugin-import:rules:newline-after-import');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
/**
 * @fileoverview Rule to enforce new line after import not followed by another import.
 * @author Radek Benkel
 */function containsNodeOrEqual(outerNode, innerNode) {return outerNode.range[0] <= innerNode.range[0] && outerNode.range[1] >= innerNode.range[1];}

function getScopeBody(scope) {
  if (scope.block.type === 'SwitchStatement') {
    log('SwitchStatement scopes not supported');
    return null;
  }var

  body = scope.block.body;
  if (body && body.type === 'BlockStatement') {
    return body.body;
  }

  return body;
}

function findNodeIndexInScopeBody(body, nodeToFind) {
  return body.findIndex(function (node) {return containsNodeOrEqual(node, nodeToFind);});
}

function getLineDifference(node, nextNode) {
  return nextNode.loc.start.line - node.loc.end.line;
}

function isClassWithDecorator(node) {
  return node.type === 'ClassDeclaration' && node.decorators && node.decorators.length;
}

function isExportDefaultClass(node) {
  return node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'ClassDeclaration';
}

function isExportNameClass(node) {

  return node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'ClassDeclaration';
}

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      url: (0, _docsUrl2['default'])('newline-after-import') },

    fixable: 'whitespace',
    schema: [
    {
      'type': 'object',
      'properties': {
        'count': {
          'type': 'integer',
          'minimum': 1 } },


      'additionalProperties': false }] },



  create: function () {function create(context) {
      var level = 0;
      var requireCalls = [];

      function checkForNewLine(node, nextNode, type) {
        if (isExportDefaultClass(nextNode) || isExportNameClass(nextNode)) {
          var classNode = nextNode.declaration;

          if (isClassWithDecorator(classNode)) {
            nextNode = classNode.decorators[0];
          }
        } else if (isClassWithDecorator(nextNode)) {
          nextNode = nextNode.decorators[0];
        }

        var options = context.options[0] || { count: 1 };
        var lineDifference = getLineDifference(node, nextNode);
        var EXPECTED_LINE_DIFFERENCE = options.count + 1;

        if (lineDifference < EXPECTED_LINE_DIFFERENCE) {
          var column = node.loc.start.column;

          if (node.loc.start.line !== node.loc.end.line) {
            column = 0;
          }

          context.report({
            loc: {
              line: node.loc.end.line,
              column: column },

            message: 'Expected ' + String(options.count) + ' empty line' + (options.count > 1 ? 's' : '') + ' after ' + String(
            type) + ' statement not followed by another ' + String(type) + '.',
            fix: function () {function fix(fixer) {return fixer.insertTextAfter(
                node,
                '\n'.repeat(EXPECTED_LINE_DIFFERENCE - lineDifference));}return fix;}() });


        }
      }

      function incrementLevel() {
        level++;
      }
      function decrementLevel() {
        level--;
      }

      function checkImport(node) {var
        parent = node.parent;
        var nodePosition = parent.body.indexOf(node);
        var nextNode = parent.body[nodePosition + 1];

        // skip "export import"s
        if (node.type === 'TSImportEqualsDeclaration' && node.isExport) {
          return;
        }

        if (nextNode && nextNode.type !== 'ImportDeclaration' && (nextNode.type !== 'TSImportEqualsDeclaration' || nextNode.isExport)) {
          checkForNewLine(node, nextNode, 'import');
        }
      }

      return {
        ImportDeclaration: checkImport,
        TSImportEqualsDeclaration: checkImport,
        CallExpression: function () {function CallExpression(node) {
            if ((0, _staticRequire2['default'])(node) && level === 0) {
              requireCalls.push(node);
            }
          }return CallExpression;}(),
        'Program:exit': function () {function ProgramExit() {
            log('exit processing for', context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename());
            var scopeBody = getScopeBody(context.getScope());
            log('got scope:', scopeBody);

            requireCalls.forEach(function (node, index) {
              var nodePosition = findNodeIndexInScopeBody(scopeBody, node);
              log('node position in scope:', nodePosition);

              var statementWithRequireCall = scopeBody[nodePosition];
              var nextStatement = scopeBody[nodePosition + 1];
              var nextRequireCall = requireCalls[index + 1];

              if (nextRequireCall && containsNodeOrEqual(statementWithRequireCall, nextRequireCall)) {
                return;
              }

              if (nextStatement && (
              !nextRequireCall || !containsNodeOrEqual(nextStatement, nextRequireCall))) {

                checkForNewLine(statementWithRequireCall, nextStatement, 'require');
              }
            });
          }return ProgramExit;}(),
        FunctionDeclaration: incrementLevel,
        FunctionExpression: incrementLevel,
        ArrowFunctionExpression: incrementLevel,
        BlockStatement: incrementLevel,
        ObjectExpression: incrementLevel,
        Decorator: incrementLevel,
        'FunctionDeclaration:exit': decrementLevel,
        'FunctionExpression:exit': decrementLevel,
        'ArrowFunctionExpression:exit': decrementLevel,
        'BlockStatement:exit': decrementLevel,
        'ObjectExpression:exit': decrementLevel,
        'Decorator:exit': decrementLevel };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uZXdsaW5lLWFmdGVyLWltcG9ydC5qcyJdLCJuYW1lcyI6WyJsb2ciLCJjb250YWluc05vZGVPckVxdWFsIiwib3V0ZXJOb2RlIiwiaW5uZXJOb2RlIiwicmFuZ2UiLCJnZXRTY29wZUJvZHkiLCJzY29wZSIsImJsb2NrIiwidHlwZSIsImJvZHkiLCJmaW5kTm9kZUluZGV4SW5TY29wZUJvZHkiLCJub2RlVG9GaW5kIiwiZmluZEluZGV4Iiwibm9kZSIsImdldExpbmVEaWZmZXJlbmNlIiwibmV4dE5vZGUiLCJsb2MiLCJzdGFydCIsImxpbmUiLCJlbmQiLCJpc0NsYXNzV2l0aERlY29yYXRvciIsImRlY29yYXRvcnMiLCJsZW5ndGgiLCJpc0V4cG9ydERlZmF1bHRDbGFzcyIsImRlY2xhcmF0aW9uIiwiaXNFeHBvcnROYW1lQ2xhc3MiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJ1cmwiLCJmaXhhYmxlIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsImxldmVsIiwicmVxdWlyZUNhbGxzIiwiY2hlY2tGb3JOZXdMaW5lIiwiY2xhc3NOb2RlIiwib3B0aW9ucyIsImNvdW50IiwibGluZURpZmZlcmVuY2UiLCJFWFBFQ1RFRF9MSU5FX0RJRkZFUkVOQ0UiLCJjb2x1bW4iLCJyZXBvcnQiLCJtZXNzYWdlIiwiZml4IiwiZml4ZXIiLCJpbnNlcnRUZXh0QWZ0ZXIiLCJyZXBlYXQiLCJpbmNyZW1lbnRMZXZlbCIsImRlY3JlbWVudExldmVsIiwiY2hlY2tJbXBvcnQiLCJwYXJlbnQiLCJub2RlUG9zaXRpb24iLCJpbmRleE9mIiwiaXNFeHBvcnQiLCJJbXBvcnREZWNsYXJhdGlvbiIsIlRTSW1wb3J0RXF1YWxzRGVjbGFyYXRpb24iLCJDYWxsRXhwcmVzc2lvbiIsInB1c2giLCJnZXRQaHlzaWNhbEZpbGVuYW1lIiwiZ2V0RmlsZW5hbWUiLCJzY29wZUJvZHkiLCJnZXRTY29wZSIsImZvckVhY2giLCJpbmRleCIsInN0YXRlbWVudFdpdGhSZXF1aXJlQ2FsbCIsIm5leHRTdGF0ZW1lbnQiLCJuZXh0UmVxdWlyZUNhbGwiLCJGdW5jdGlvbkRlY2xhcmF0aW9uIiwiRnVuY3Rpb25FeHByZXNzaW9uIiwiQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24iLCJCbG9ja1N0YXRlbWVudCIsIk9iamVjdEV4cHJlc3Npb24iLCJEZWNvcmF0b3IiXSwibWFwcGluZ3MiOiI7Ozs7O0FBS0Esc0Q7QUFDQSxxQzs7QUFFQSw4QjtBQUNBLElBQU1BLE1BQU0sd0JBQU0saURBQU4sQ0FBWjs7QUFFQTtBQUNBO0FBQ0E7QUFiQTs7O0dBZUEsU0FBU0MsbUJBQVQsQ0FBNkJDLFNBQTdCLEVBQXdDQyxTQUF4QyxFQUFtRCxDQUNqRCxPQUFPRCxVQUFVRSxLQUFWLENBQWdCLENBQWhCLEtBQXNCRCxVQUFVQyxLQUFWLENBQWdCLENBQWhCLENBQXRCLElBQTRDRixVQUFVRSxLQUFWLENBQWdCLENBQWhCLEtBQXNCRCxVQUFVQyxLQUFWLENBQWdCLENBQWhCLENBQXpFLENBQ0Q7O0FBRUQsU0FBU0MsWUFBVCxDQUFzQkMsS0FBdEIsRUFBNkI7QUFDM0IsTUFBSUEsTUFBTUMsS0FBTixDQUFZQyxJQUFaLEtBQXFCLGlCQUF6QixFQUE0QztBQUMxQ1IsUUFBSSxzQ0FBSjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBSjBCOztBQU1uQlMsTUFObUIsR0FNVkgsTUFBTUMsS0FOSSxDQU1uQkUsSUFObUI7QUFPM0IsTUFBSUEsUUFBUUEsS0FBS0QsSUFBTCxLQUFjLGdCQUExQixFQUE0QztBQUMxQyxXQUFPQyxLQUFLQSxJQUFaO0FBQ0Q7O0FBRUQsU0FBT0EsSUFBUDtBQUNEOztBQUVELFNBQVNDLHdCQUFULENBQWtDRCxJQUFsQyxFQUF3Q0UsVUFBeEMsRUFBb0Q7QUFDbEQsU0FBT0YsS0FBS0csU0FBTCxDQUFlLFVBQUNDLElBQUQsVUFBVVosb0JBQW9CWSxJQUFwQixFQUEwQkYsVUFBMUIsQ0FBVixFQUFmLENBQVA7QUFDRDs7QUFFRCxTQUFTRyxpQkFBVCxDQUEyQkQsSUFBM0IsRUFBaUNFLFFBQWpDLEVBQTJDO0FBQ3pDLFNBQU9BLFNBQVNDLEdBQVQsQ0FBYUMsS0FBYixDQUFtQkMsSUFBbkIsR0FBMEJMLEtBQUtHLEdBQUwsQ0FBU0csR0FBVCxDQUFhRCxJQUE5QztBQUNEOztBQUVELFNBQVNFLG9CQUFULENBQThCUCxJQUE5QixFQUFvQztBQUNsQyxTQUFPQSxLQUFLTCxJQUFMLEtBQWMsa0JBQWQsSUFBb0NLLEtBQUtRLFVBQXpDLElBQXVEUixLQUFLUSxVQUFMLENBQWdCQyxNQUE5RTtBQUNEOztBQUVELFNBQVNDLG9CQUFULENBQThCVixJQUE5QixFQUFvQztBQUNsQyxTQUFPQSxLQUFLTCxJQUFMLEtBQWMsMEJBQWQsSUFBNENLLEtBQUtXLFdBQUwsQ0FBaUJoQixJQUFqQixLQUEwQixrQkFBN0U7QUFDRDs7QUFFRCxTQUFTaUIsaUJBQVQsQ0FBMkJaLElBQTNCLEVBQWlDOztBQUUvQixTQUFPQSxLQUFLTCxJQUFMLEtBQWMsd0JBQWQsSUFBMENLLEtBQUtXLFdBQS9DLElBQThEWCxLQUFLVyxXQUFMLENBQWlCaEIsSUFBakIsS0FBMEIsa0JBQS9GO0FBQ0Q7O0FBRURrQixPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSnBCLFVBQU0sUUFERjtBQUVKcUIsVUFBTTtBQUNKQyxXQUFLLDBCQUFRLHNCQUFSLENBREQsRUFGRjs7QUFLSkMsYUFBUyxZQUxMO0FBTUpDLFlBQVE7QUFDTjtBQUNFLGNBQVEsUUFEVjtBQUVFLG9CQUFjO0FBQ1osaUJBQVM7QUFDUCxrQkFBUSxTQUREO0FBRVAscUJBQVcsQ0FGSixFQURHLEVBRmhCOzs7QUFRRSw4QkFBd0IsS0FSMUIsRUFETSxDQU5KLEVBRFM7Ozs7QUFvQmZDLHVCQUFRLGdCQUFVQyxPQUFWLEVBQW1CO0FBQ3pCLFVBQUlDLFFBQVEsQ0FBWjtBQUNBLFVBQU1DLGVBQWUsRUFBckI7O0FBRUEsZUFBU0MsZUFBVCxDQUF5QnhCLElBQXpCLEVBQStCRSxRQUEvQixFQUF5Q1AsSUFBekMsRUFBK0M7QUFDN0MsWUFBSWUscUJBQXFCUixRQUFyQixLQUFrQ1Usa0JBQWtCVixRQUFsQixDQUF0QyxFQUFtRTtBQUNqRSxjQUFNdUIsWUFBWXZCLFNBQVNTLFdBQTNCOztBQUVBLGNBQUlKLHFCQUFxQmtCLFNBQXJCLENBQUosRUFBcUM7QUFDbkN2Qix1QkFBV3VCLFVBQVVqQixVQUFWLENBQXFCLENBQXJCLENBQVg7QUFDRDtBQUNGLFNBTkQsTUFNTyxJQUFJRCxxQkFBcUJMLFFBQXJCLENBQUosRUFBb0M7QUFDekNBLHFCQUFXQSxTQUFTTSxVQUFULENBQW9CLENBQXBCLENBQVg7QUFDRDs7QUFFRCxZQUFNa0IsVUFBVUwsUUFBUUssT0FBUixDQUFnQixDQUFoQixLQUFzQixFQUFFQyxPQUFPLENBQVQsRUFBdEM7QUFDQSxZQUFNQyxpQkFBaUIzQixrQkFBa0JELElBQWxCLEVBQXdCRSxRQUF4QixDQUF2QjtBQUNBLFlBQU0yQiwyQkFBMkJILFFBQVFDLEtBQVIsR0FBZ0IsQ0FBakQ7O0FBRUEsWUFBSUMsaUJBQWlCQyx3QkFBckIsRUFBK0M7QUFDN0MsY0FBSUMsU0FBUzlCLEtBQUtHLEdBQUwsQ0FBU0MsS0FBVCxDQUFlMEIsTUFBNUI7O0FBRUEsY0FBSTlCLEtBQUtHLEdBQUwsQ0FBU0MsS0FBVCxDQUFlQyxJQUFmLEtBQXdCTCxLQUFLRyxHQUFMLENBQVNHLEdBQVQsQ0FBYUQsSUFBekMsRUFBK0M7QUFDN0N5QixxQkFBUyxDQUFUO0FBQ0Q7O0FBRURULGtCQUFRVSxNQUFSLENBQWU7QUFDYjVCLGlCQUFLO0FBQ0hFLG9CQUFNTCxLQUFLRyxHQUFMLENBQVNHLEdBQVQsQ0FBYUQsSUFEaEI7QUFFSHlCLDRCQUZHLEVBRFE7O0FBS2JFLDBDQUFxQk4sUUFBUUMsS0FBN0IscUJBQWdERCxRQUFRQyxLQUFSLEdBQWdCLENBQWhCLEdBQW9CLEdBQXBCLEdBQTBCLEVBQTFFO0FBQ0ZoQyxnQkFERSxtREFDd0NBLElBRHhDLE9BTGE7QUFPYnNDLDhCQUFLLDRCQUFTQyxNQUFNQyxlQUFOO0FBQ1puQyxvQkFEWTtBQUVaLHFCQUFLb0MsTUFBTCxDQUFZUCwyQkFBMkJELGNBQXZDLENBRlksQ0FBVCxFQUFMLGNBUGEsRUFBZjs7O0FBWUQ7QUFDRjs7QUFFRCxlQUFTUyxjQUFULEdBQTBCO0FBQ3hCZjtBQUNEO0FBQ0QsZUFBU2dCLGNBQVQsR0FBMEI7QUFDeEJoQjtBQUNEOztBQUVELGVBQVNpQixXQUFULENBQXFCdkMsSUFBckIsRUFBMkI7QUFDakJ3QyxjQURpQixHQUNOeEMsSUFETSxDQUNqQndDLE1BRGlCO0FBRXpCLFlBQU1DLGVBQWVELE9BQU81QyxJQUFQLENBQVk4QyxPQUFaLENBQW9CMUMsSUFBcEIsQ0FBckI7QUFDQSxZQUFNRSxXQUFXc0MsT0FBTzVDLElBQVAsQ0FBWTZDLGVBQWUsQ0FBM0IsQ0FBakI7O0FBRUE7QUFDQSxZQUFJekMsS0FBS0wsSUFBTCxLQUFjLDJCQUFkLElBQTZDSyxLQUFLMkMsUUFBdEQsRUFBZ0U7QUFDOUQ7QUFDRDs7QUFFRCxZQUFJekMsWUFBWUEsU0FBU1AsSUFBVCxLQUFrQixtQkFBOUIsS0FBc0RPLFNBQVNQLElBQVQsS0FBa0IsMkJBQWxCLElBQWlETyxTQUFTeUMsUUFBaEgsQ0FBSixFQUErSDtBQUM3SG5CLDBCQUFnQnhCLElBQWhCLEVBQXNCRSxRQUF0QixFQUFnQyxRQUFoQztBQUNEO0FBQ0Y7O0FBRUQsYUFBTztBQUNMMEMsMkJBQW1CTCxXQURkO0FBRUxNLG1DQUEyQk4sV0FGdEI7QUFHTE8scUNBQWdCLHdCQUFTOUMsSUFBVCxFQUFlO0FBQzdCLGdCQUFJLGdDQUFnQkEsSUFBaEIsS0FBeUJzQixVQUFVLENBQXZDLEVBQTBDO0FBQ3hDQywyQkFBYXdCLElBQWIsQ0FBa0IvQyxJQUFsQjtBQUNEO0FBQ0YsV0FKRCx5QkFISztBQVFMLHFDQUFnQix1QkFBWTtBQUMxQmIsZ0JBQUkscUJBQUosRUFBMkJrQyxRQUFRMkIsbUJBQVIsR0FBOEIzQixRQUFRMkIsbUJBQVIsRUFBOUIsR0FBOEQzQixRQUFRNEIsV0FBUixFQUF6RjtBQUNBLGdCQUFNQyxZQUFZMUQsYUFBYTZCLFFBQVE4QixRQUFSLEVBQWIsQ0FBbEI7QUFDQWhFLGdCQUFJLFlBQUosRUFBa0IrRCxTQUFsQjs7QUFFQTNCLHlCQUFhNkIsT0FBYixDQUFxQixVQUFVcEQsSUFBVixFQUFnQnFELEtBQWhCLEVBQXVCO0FBQzFDLGtCQUFNWixlQUFlNUMseUJBQXlCcUQsU0FBekIsRUFBb0NsRCxJQUFwQyxDQUFyQjtBQUNBYixrQkFBSSx5QkFBSixFQUErQnNELFlBQS9COztBQUVBLGtCQUFNYSwyQkFBMkJKLFVBQVVULFlBQVYsQ0FBakM7QUFDQSxrQkFBTWMsZ0JBQWdCTCxVQUFVVCxlQUFlLENBQXpCLENBQXRCO0FBQ0Esa0JBQU1lLGtCQUFrQmpDLGFBQWE4QixRQUFRLENBQXJCLENBQXhCOztBQUVBLGtCQUFJRyxtQkFBbUJwRSxvQkFBb0JrRSx3QkFBcEIsRUFBOENFLGVBQTlDLENBQXZCLEVBQXVGO0FBQ3JGO0FBQ0Q7O0FBRUQsa0JBQUlEO0FBQ0EsZUFBQ0MsZUFBRCxJQUFvQixDQUFDcEUsb0JBQW9CbUUsYUFBcEIsRUFBbUNDLGVBQW5DLENBRHJCLENBQUosRUFDK0U7O0FBRTdFaEMsZ0NBQWdCOEIsd0JBQWhCLEVBQTBDQyxhQUExQyxFQUF5RCxTQUF6RDtBQUNEO0FBQ0YsYUFqQkQ7QUFrQkQsV0F2QkQsc0JBUks7QUFnQ0xFLDZCQUFxQnBCLGNBaENoQjtBQWlDTHFCLDRCQUFvQnJCLGNBakNmO0FBa0NMc0IsaUNBQXlCdEIsY0FsQ3BCO0FBbUNMdUIsd0JBQWdCdkIsY0FuQ1g7QUFvQ0x3QiwwQkFBa0J4QixjQXBDYjtBQXFDTHlCLG1CQUFXekIsY0FyQ047QUFzQ0wsb0NBQTRCQyxjQXRDdkI7QUF1Q0wsbUNBQTJCQSxjQXZDdEI7QUF3Q0wsd0NBQWdDQSxjQXhDM0I7QUF5Q0wsK0JBQXVCQSxjQXpDbEI7QUEwQ0wsaUNBQXlCQSxjQTFDcEI7QUEyQ0wsMEJBQWtCQSxjQTNDYixFQUFQOztBQTZDRCxLQTVHRCxpQkFwQmUsRUFBakIiLCJmaWxlIjoibmV3bGluZS1hZnRlci1pbXBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUnVsZSB0byBlbmZvcmNlIG5ldyBsaW5lIGFmdGVyIGltcG9ydCBub3QgZm9sbG93ZWQgYnkgYW5vdGhlciBpbXBvcnQuXG4gKiBAYXV0aG9yIFJhZGVrIEJlbmtlbFxuICovXG5cbmltcG9ydCBpc1N0YXRpY1JlcXVpcmUgZnJvbSAnLi4vY29yZS9zdGF0aWNSZXF1aXJlJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuY29uc3QgbG9nID0gZGVidWcoJ2VzbGludC1wbHVnaW4taW1wb3J0OnJ1bGVzOm5ld2xpbmUtYWZ0ZXItaW1wb3J0Jyk7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSdWxlIERlZmluaXRpb25cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGNvbnRhaW5zTm9kZU9yRXF1YWwob3V0ZXJOb2RlLCBpbm5lck5vZGUpIHtcbiAgcmV0dXJuIG91dGVyTm9kZS5yYW5nZVswXSA8PSBpbm5lck5vZGUucmFuZ2VbMF0gJiYgb3V0ZXJOb2RlLnJhbmdlWzFdID49IGlubmVyTm9kZS5yYW5nZVsxXTtcbn1cblxuZnVuY3Rpb24gZ2V0U2NvcGVCb2R5KHNjb3BlKSB7XG4gIGlmIChzY29wZS5ibG9jay50eXBlID09PSAnU3dpdGNoU3RhdGVtZW50Jykge1xuICAgIGxvZygnU3dpdGNoU3RhdGVtZW50IHNjb3BlcyBub3Qgc3VwcG9ydGVkJyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB7IGJvZHkgfSA9IHNjb3BlLmJsb2NrO1xuICBpZiAoYm9keSAmJiBib2R5LnR5cGUgPT09ICdCbG9ja1N0YXRlbWVudCcpIHtcbiAgICByZXR1cm4gYm9keS5ib2R5O1xuICB9XG5cbiAgcmV0dXJuIGJvZHk7XG59XG5cbmZ1bmN0aW9uIGZpbmROb2RlSW5kZXhJblNjb3BlQm9keShib2R5LCBub2RlVG9GaW5kKSB7XG4gIHJldHVybiBib2R5LmZpbmRJbmRleCgobm9kZSkgPT4gY29udGFpbnNOb2RlT3JFcXVhbChub2RlLCBub2RlVG9GaW5kKSk7XG59XG5cbmZ1bmN0aW9uIGdldExpbmVEaWZmZXJlbmNlKG5vZGUsIG5leHROb2RlKSB7XG4gIHJldHVybiBuZXh0Tm9kZS5sb2Muc3RhcnQubGluZSAtIG5vZGUubG9jLmVuZC5saW5lO1xufVxuXG5mdW5jdGlvbiBpc0NsYXNzV2l0aERlY29yYXRvcihub2RlKSB7XG4gIHJldHVybiBub2RlLnR5cGUgPT09ICdDbGFzc0RlY2xhcmF0aW9uJyAmJiBub2RlLmRlY29yYXRvcnMgJiYgbm9kZS5kZWNvcmF0b3JzLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gaXNFeHBvcnREZWZhdWx0Q2xhc3Mobm9kZSkge1xuICByZXR1cm4gbm9kZS50eXBlID09PSAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJyAmJiBub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdDbGFzc0RlY2xhcmF0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNFeHBvcnROYW1lQ2xhc3Mobm9kZSkge1xuXG4gIHJldHVybiBub2RlLnR5cGUgPT09ICdFeHBvcnROYW1lZERlY2xhcmF0aW9uJyAmJiBub2RlLmRlY2xhcmF0aW9uICYmIG5vZGUuZGVjbGFyYXRpb24udHlwZSA9PT0gJ0NsYXNzRGVjbGFyYXRpb24nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdsYXlvdXQnLFxuICAgIGRvY3M6IHtcbiAgICAgIHVybDogZG9jc1VybCgnbmV3bGluZS1hZnRlci1pbXBvcnQnKSxcbiAgICB9LFxuICAgIGZpeGFibGU6ICd3aGl0ZXNwYWNlJyxcbiAgICBzY2hlbWE6IFtcbiAgICAgIHtcbiAgICAgICAgJ3R5cGUnOiAnb2JqZWN0JyxcbiAgICAgICAgJ3Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ2NvdW50Jzoge1xuICAgICAgICAgICAgJ3R5cGUnOiAnaW50ZWdlcicsXG4gICAgICAgICAgICAnbWluaW11bSc6IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJzogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIGNyZWF0ZTogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICBsZXQgbGV2ZWwgPSAwO1xuICAgIGNvbnN0IHJlcXVpcmVDYWxscyA9IFtdO1xuXG4gICAgZnVuY3Rpb24gY2hlY2tGb3JOZXdMaW5lKG5vZGUsIG5leHROb2RlLCB0eXBlKSB7XG4gICAgICBpZiAoaXNFeHBvcnREZWZhdWx0Q2xhc3MobmV4dE5vZGUpIHx8IGlzRXhwb3J0TmFtZUNsYXNzKG5leHROb2RlKSkge1xuICAgICAgICBjb25zdCBjbGFzc05vZGUgPSBuZXh0Tm9kZS5kZWNsYXJhdGlvbjtcblxuICAgICAgICBpZiAoaXNDbGFzc1dpdGhEZWNvcmF0b3IoY2xhc3NOb2RlKSkge1xuICAgICAgICAgIG5leHROb2RlID0gY2xhc3NOb2RlLmRlY29yYXRvcnNbMF07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNDbGFzc1dpdGhEZWNvcmF0b3IobmV4dE5vZGUpKSB7XG4gICAgICAgIG5leHROb2RlID0gbmV4dE5vZGUuZGVjb3JhdG9yc1swXTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb3B0aW9ucyA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7IGNvdW50OiAxIH07XG4gICAgICBjb25zdCBsaW5lRGlmZmVyZW5jZSA9IGdldExpbmVEaWZmZXJlbmNlKG5vZGUsIG5leHROb2RlKTtcbiAgICAgIGNvbnN0IEVYUEVDVEVEX0xJTkVfRElGRkVSRU5DRSA9IG9wdGlvbnMuY291bnQgKyAxO1xuXG4gICAgICBpZiAobGluZURpZmZlcmVuY2UgPCBFWFBFQ1RFRF9MSU5FX0RJRkZFUkVOQ0UpIHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IG5vZGUubG9jLnN0YXJ0LmNvbHVtbjtcblxuICAgICAgICBpZiAobm9kZS5sb2Muc3RhcnQubGluZSAhPT0gbm9kZS5sb2MuZW5kLmxpbmUpIHtcbiAgICAgICAgICBjb2x1bW4gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgIGxvYzoge1xuICAgICAgICAgICAgbGluZTogbm9kZS5sb2MuZW5kLmxpbmUsXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtZXNzYWdlOiBgRXhwZWN0ZWQgJHtvcHRpb25zLmNvdW50fSBlbXB0eSBsaW5lJHtvcHRpb25zLmNvdW50ID4gMSA/ICdzJyA6ICcnfSBcXFxuYWZ0ZXIgJHt0eXBlfSBzdGF0ZW1lbnQgbm90IGZvbGxvd2VkIGJ5IGFub3RoZXIgJHt0eXBlfS5gLFxuICAgICAgICAgIGZpeDogZml4ZXIgPT4gZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICdcXG4nLnJlcGVhdChFWFBFQ1RFRF9MSU5FX0RJRkZFUkVOQ0UgLSBsaW5lRGlmZmVyZW5jZSlcbiAgICAgICAgICApLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbmNyZW1lbnRMZXZlbCgpIHtcbiAgICAgIGxldmVsKys7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRlY3JlbWVudExldmVsKCkge1xuICAgICAgbGV2ZWwtLTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja0ltcG9ydChub2RlKSB7XG4gICAgICBjb25zdCB7IHBhcmVudCB9ID0gbm9kZTtcbiAgICAgIGNvbnN0IG5vZGVQb3NpdGlvbiA9IHBhcmVudC5ib2R5LmluZGV4T2Yobm9kZSk7XG4gICAgICBjb25zdCBuZXh0Tm9kZSA9IHBhcmVudC5ib2R5W25vZGVQb3NpdGlvbiArIDFdO1xuXG4gICAgICAvLyBza2lwIFwiZXhwb3J0IGltcG9ydFwic1xuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ1RTSW1wb3J0RXF1YWxzRGVjbGFyYXRpb24nICYmIG5vZGUuaXNFeHBvcnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV4dE5vZGUgJiYgbmV4dE5vZGUudHlwZSAhPT0gJ0ltcG9ydERlY2xhcmF0aW9uJyAmJiAobmV4dE5vZGUudHlwZSAhPT0gJ1RTSW1wb3J0RXF1YWxzRGVjbGFyYXRpb24nIHx8IG5leHROb2RlLmlzRXhwb3J0KSkge1xuICAgICAgICBjaGVja0Zvck5ld0xpbmUobm9kZSwgbmV4dE5vZGUsICdpbXBvcnQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgSW1wb3J0RGVjbGFyYXRpb246IGNoZWNrSW1wb3J0LFxuICAgICAgVFNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbjogY2hlY2tJbXBvcnQsXG4gICAgICBDYWxsRXhwcmVzc2lvbjogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICBpZiAoaXNTdGF0aWNSZXF1aXJlKG5vZGUpICYmIGxldmVsID09PSAwKSB7XG4gICAgICAgICAgcmVxdWlyZUNhbGxzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnUHJvZ3JhbTpleGl0JzogZnVuY3Rpb24gKCkge1xuICAgICAgICBsb2coJ2V4aXQgcHJvY2Vzc2luZyBmb3InLCBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUgPyBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUoKSA6IGNvbnRleHQuZ2V0RmlsZW5hbWUoKSk7XG4gICAgICAgIGNvbnN0IHNjb3BlQm9keSA9IGdldFNjb3BlQm9keShjb250ZXh0LmdldFNjb3BlKCkpO1xuICAgICAgICBsb2coJ2dvdCBzY29wZTonLCBzY29wZUJvZHkpO1xuXG4gICAgICAgIHJlcXVpcmVDYWxscy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlLCBpbmRleCkge1xuICAgICAgICAgIGNvbnN0IG5vZGVQb3NpdGlvbiA9IGZpbmROb2RlSW5kZXhJblNjb3BlQm9keShzY29wZUJvZHksIG5vZGUpO1xuICAgICAgICAgIGxvZygnbm9kZSBwb3NpdGlvbiBpbiBzY29wZTonLCBub2RlUG9zaXRpb24pO1xuXG4gICAgICAgICAgY29uc3Qgc3RhdGVtZW50V2l0aFJlcXVpcmVDYWxsID0gc2NvcGVCb2R5W25vZGVQb3NpdGlvbl07XG4gICAgICAgICAgY29uc3QgbmV4dFN0YXRlbWVudCA9IHNjb3BlQm9keVtub2RlUG9zaXRpb24gKyAxXTtcbiAgICAgICAgICBjb25zdCBuZXh0UmVxdWlyZUNhbGwgPSByZXF1aXJlQ2FsbHNbaW5kZXggKyAxXTtcblxuICAgICAgICAgIGlmIChuZXh0UmVxdWlyZUNhbGwgJiYgY29udGFpbnNOb2RlT3JFcXVhbChzdGF0ZW1lbnRXaXRoUmVxdWlyZUNhbGwsIG5leHRSZXF1aXJlQ2FsbCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobmV4dFN0YXRlbWVudCAmJlxuICAgICAgICAgICAgICghbmV4dFJlcXVpcmVDYWxsIHx8ICFjb250YWluc05vZGVPckVxdWFsKG5leHRTdGF0ZW1lbnQsIG5leHRSZXF1aXJlQ2FsbCkpKSB7XG5cbiAgICAgICAgICAgIGNoZWNrRm9yTmV3TGluZShzdGF0ZW1lbnRXaXRoUmVxdWlyZUNhbGwsIG5leHRTdGF0ZW1lbnQsICdyZXF1aXJlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBGdW5jdGlvbkRlY2xhcmF0aW9uOiBpbmNyZW1lbnRMZXZlbCxcbiAgICAgIEZ1bmN0aW9uRXhwcmVzc2lvbjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBCbG9ja1N0YXRlbWVudDogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBPYmplY3RFeHByZXNzaW9uOiBpbmNyZW1lbnRMZXZlbCxcbiAgICAgIERlY29yYXRvcjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICAnRnVuY3Rpb25EZWNsYXJhdGlvbjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgICAnRnVuY3Rpb25FeHByZXNzaW9uOmV4aXQnOiBkZWNyZW1lbnRMZXZlbCxcbiAgICAgICdBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgICAnQmxvY2tTdGF0ZW1lbnQ6ZXhpdCc6IGRlY3JlbWVudExldmVsLFxuICAgICAgJ09iamVjdEV4cHJlc3Npb246ZXhpdCc6IGRlY3JlbWVudExldmVsLFxuICAgICAgJ0RlY29yYXRvcjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=