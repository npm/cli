'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _arrayIncludes = require('array-includes');var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

/*
                                                                                                                                                                                                            Notes on TypeScript namespaces aka TSModuleDeclaration:
                                                                                                                                                                                                            
                                                                                                                                                                                                            There are two forms:
                                                                                                                                                                                                            - active namespaces: namespace Foo {} / module Foo {}
                                                                                                                                                                                                            - ambient modules; declare module "eslint-plugin-import" {}
                                                                                                                                                                                                            
                                                                                                                                                                                                            active namespaces:
                                                                                                                                                                                                            - cannot contain a default export
                                                                                                                                                                                                            - cannot contain an export all
                                                                                                                                                                                                            - cannot contain a multi name export (export { a, b })
                                                                                                                                                                                                            - can have active namespaces nested within them
                                                                                                                                                                                                            
                                                                                                                                                                                                            ambient namespaces:
                                                                                                                                                                                                            - can only be defined in .d.ts files
                                                                                                                                                                                                            - cannot be nested within active namespaces
                                                                                                                                                                                                            - have no other restrictions
                                                                                                                                                                                                            */

var rootProgram = 'root';
var tsTypePrefix = 'type:';

/**
                             * Detect function overloads like:
                             * ```ts
                             * export function foo(a: number);
                             * export function foo(a: string);
                             * export function foo(a: number|string) { return a; }
                             * ```
                             * @param {Set<Object>} nodes
                             * @returns {boolean}
                             */
function isTypescriptFunctionOverloads(nodes) {
  var types = new Set(Array.from(nodes, function (node) {return node.parent.type;}));
  return (
    types.has('TSDeclareFunction') && (

    types.size === 1 ||
    types.size === 2 && types.has('FunctionDeclaration')));


}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: (0, _docsUrl2['default'])('export') },

    schema: [] },


  create: function () {function create(context) {
      var namespace = new Map([[rootProgram, new Map()]]);

      function addNamed(name, node, parent, isType) {
        if (!namespace.has(parent)) {
          namespace.set(parent, new Map());
        }
        var named = namespace.get(parent);

        var key = isType ? '' + tsTypePrefix + String(name) : name;
        var nodes = named.get(key);

        if (nodes == null) {
          nodes = new Set();
          named.set(key, nodes);
        }

        nodes.add(node);
      }

      function getParent(node) {
        if (node.parent && node.parent.type === 'TSModuleBlock') {
          return node.parent.parent;
        }

        // just in case somehow a non-ts namespace export declaration isn't directly
        // parented to the root Program node
        return rootProgram;
      }

      return {
        'ExportDefaultDeclaration': function () {function ExportDefaultDeclaration(node) {return addNamed('default', node, getParent(node));}return ExportDefaultDeclaration;}(),

        'ExportSpecifier': function () {function ExportSpecifier(node) {return addNamed(
            node.exported.name,
            node.exported,
            getParent(node.parent));}return ExportSpecifier;}(),


        'ExportNamedDeclaration': function () {function ExportNamedDeclaration(node) {
            if (node.declaration == null) return;

            var parent = getParent(node);
            // support for old TypeScript versions
            var isTypeVariableDecl = node.declaration.kind === 'type';

            if (node.declaration.id != null) {
              if ((0, _arrayIncludes2['default'])([
              'TSTypeAliasDeclaration',
              'TSInterfaceDeclaration'],
              node.declaration.type)) {
                addNamed(node.declaration.id.name, node.declaration.id, parent, true);
              } else {
                addNamed(node.declaration.id.name, node.declaration.id, parent, isTypeVariableDecl);
              }
            }

            if (node.declaration.declarations != null) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
                for (var _iterator = node.declaration.declarations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var declaration = _step.value;
                  (0, _ExportMap.recursivePatternCapture)(declaration.id, function (v) {return (
                      addNamed(v.name, v, parent, isTypeVariableDecl));});
                }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
            }
          }return ExportNamedDeclaration;}(),

        'ExportAllDeclaration': function () {function ExportAllDeclaration(node) {
            if (node.source == null) return; // not sure if this is ever true

            // `export * as X from 'path'` does not conflict
            if (node.exported && node.exported.name) return;

            var remoteExports = _ExportMap2['default'].get(node.source.value, context);
            if (remoteExports == null) return;

            if (remoteExports.errors.length) {
              remoteExports.reportErrors(context, node);
              return;
            }

            var parent = getParent(node);

            var any = false;
            remoteExports.forEach(function (v, name) {
              if (name !== 'default') {
                any = true; // poor man's filter
                addNamed(name, node, parent);
              }
            });

            if (!any) {
              context.report(
              node.source, 'No named exports found in module \'' + String(
              node.source.value) + '\'.');

            }
          }return ExportAllDeclaration;}(),

        'Program:exit': function () {function ProgramExit() {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
              for (var _iterator2 = namespace[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var _ref = _step2.value;var _ref2 = _slicedToArray(_ref, 2);var named = _ref2[1];var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {
                  for (var _iterator3 = named[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var _ref3 = _step3.value;var _ref4 = _slicedToArray(_ref3, 2);var name = _ref4[0];var nodes = _ref4[1];
                    if (nodes.size <= 1) continue;

                    if (isTypescriptFunctionOverloads(nodes)) continue;var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {

                      for (var _iterator4 = nodes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var node = _step4.value;
                        if (name === 'default') {
                          context.report(node, 'Multiple default exports.');
                        } else {
                          context.report(
                          node, 'Multiple exports of name \'' + String(
                          name.replace(tsTypePrefix, '')) + '\'.');

                        }
                      }} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4['return']) {_iterator4['return']();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}
                  }} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3['return']) {_iterator3['return']();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}
              }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
          }return ProgramExit;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9leHBvcnQuanMiXSwibmFtZXMiOlsicm9vdFByb2dyYW0iLCJ0c1R5cGVQcmVmaXgiLCJpc1R5cGVzY3JpcHRGdW5jdGlvbk92ZXJsb2FkcyIsIm5vZGVzIiwidHlwZXMiLCJTZXQiLCJBcnJheSIsImZyb20iLCJub2RlIiwicGFyZW50IiwidHlwZSIsImhhcyIsInNpemUiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJ1cmwiLCJzY2hlbWEiLCJjcmVhdGUiLCJjb250ZXh0IiwibmFtZXNwYWNlIiwiTWFwIiwiYWRkTmFtZWQiLCJuYW1lIiwiaXNUeXBlIiwic2V0IiwibmFtZWQiLCJnZXQiLCJrZXkiLCJhZGQiLCJnZXRQYXJlbnQiLCJleHBvcnRlZCIsImRlY2xhcmF0aW9uIiwiaXNUeXBlVmFyaWFibGVEZWNsIiwia2luZCIsImlkIiwiZGVjbGFyYXRpb25zIiwidiIsInNvdXJjZSIsInJlbW90ZUV4cG9ydHMiLCJFeHBvcnRNYXAiLCJ2YWx1ZSIsImVycm9ycyIsImxlbmd0aCIsInJlcG9ydEVycm9ycyIsImFueSIsImZvckVhY2giLCJyZXBvcnQiLCJyZXBsYWNlIl0sIm1hcHBpbmdzIjoicW9CQUFBLHlDO0FBQ0EscUM7QUFDQSwrQzs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxJQUFNQSxjQUFjLE1BQXBCO0FBQ0EsSUFBTUMsZUFBZSxPQUFyQjs7QUFFQTs7Ozs7Ozs7OztBQVVBLFNBQVNDLDZCQUFULENBQXVDQyxLQUF2QyxFQUE4QztBQUM1QyxNQUFNQyxRQUFRLElBQUlDLEdBQUosQ0FBUUMsTUFBTUMsSUFBTixDQUFXSixLQUFYLEVBQWtCLHdCQUFRSyxLQUFLQyxNQUFMLENBQVlDLElBQXBCLEVBQWxCLENBQVIsQ0FBZDtBQUNBO0FBQ0VOLFVBQU1PLEdBQU4sQ0FBVSxtQkFBVjs7QUFFRVAsVUFBTVEsSUFBTixLQUFlLENBQWY7QUFDQ1IsVUFBTVEsSUFBTixLQUFlLENBQWYsSUFB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LE1BQUwsQ0FBWUcsS0FGbkQ7O0FBSUQ7QUFDRixXQTlCRCwrQkFuQ0s7O0FBbUVMLHFDQUFnQix1QkFBWTtBQUMxQixvQ0FBd0JyQixTQUF4QixtSUFBbUMsaUVBQXJCTSxLQUFxQjtBQUNqQyx3Q0FBNEJBLEtBQTVCLG1JQUFtQyxtRUFBdkJILElBQXVCLGdCQUFqQnJCLEtBQWlCO0FBQ2pDLHdCQUFJQSxNQUFNUyxJQUFOLElBQWMsQ0FBbEIsRUFBcUI7O0FBRXJCLHdCQUFJViw4QkFBOEJDLEtBQTlCLENBQUosRUFBMEMsU0FIVDs7QUFLakMsNENBQW1CQSxLQUFuQixtSUFBMEIsS0FBZkssSUFBZTtBQUN4Qiw0QkFBSWdCLFNBQVMsU0FBYixFQUF3QjtBQUN0Qkosa0NBQVE0QixNQUFSLENBQWV4QyxJQUFmLEVBQXFCLDJCQUFyQjtBQUNELHlCQUZELE1BRU87QUFDTFksa0NBQVE0QixNQUFSO0FBQ0V4Qyw4QkFERjtBQUUrQmdCLCtCQUFLeUIsT0FBTCxDQUFhaEQsWUFBYixFQUEyQixFQUEzQixDQUYvQjs7QUFJRDtBQUNGLHVCQWRnQztBQWVsQyxtQkFoQmdDO0FBaUJsQyxlQWxCeUI7QUFtQjNCLFdBbkJELHNCQW5FSyxFQUFQOztBQXdGRCxLQXRIRCxpQkFUZSxFQUFqQiIsImZpbGUiOiJleHBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXhwb3J0TWFwLCB7IHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlIH0gZnJvbSAnLi4vRXhwb3J0TWFwJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuaW1wb3J0IGluY2x1ZGVzIGZyb20gJ2FycmF5LWluY2x1ZGVzJztcblxuLypcbk5vdGVzIG9uIFR5cGVTY3JpcHQgbmFtZXNwYWNlcyBha2EgVFNNb2R1bGVEZWNsYXJhdGlvbjpcblxuVGhlcmUgYXJlIHR3byBmb3Jtczpcbi0gYWN0aXZlIG5hbWVzcGFjZXM6IG5hbWVzcGFjZSBGb28ge30gLyBtb2R1bGUgRm9vIHt9XG4tIGFtYmllbnQgbW9kdWxlczsgZGVjbGFyZSBtb2R1bGUgXCJlc2xpbnQtcGx1Z2luLWltcG9ydFwiIHt9XG5cbmFjdGl2ZSBuYW1lc3BhY2VzOlxuLSBjYW5ub3QgY29udGFpbiBhIGRlZmF1bHQgZXhwb3J0XG4tIGNhbm5vdCBjb250YWluIGFuIGV4cG9ydCBhbGxcbi0gY2Fubm90IGNvbnRhaW4gYSBtdWx0aSBuYW1lIGV4cG9ydCAoZXhwb3J0IHsgYSwgYiB9KVxuLSBjYW4gaGF2ZSBhY3RpdmUgbmFtZXNwYWNlcyBuZXN0ZWQgd2l0aGluIHRoZW1cblxuYW1iaWVudCBuYW1lc3BhY2VzOlxuLSBjYW4gb25seSBiZSBkZWZpbmVkIGluIC5kLnRzIGZpbGVzXG4tIGNhbm5vdCBiZSBuZXN0ZWQgd2l0aGluIGFjdGl2ZSBuYW1lc3BhY2VzXG4tIGhhdmUgbm8gb3RoZXIgcmVzdHJpY3Rpb25zXG4qL1xuXG5jb25zdCByb290UHJvZ3JhbSA9ICdyb290JztcbmNvbnN0IHRzVHlwZVByZWZpeCA9ICd0eXBlOic7XG5cbi8qKlxuICogRGV0ZWN0IGZ1bmN0aW9uIG92ZXJsb2FkcyBsaWtlOlxuICogYGBgdHNcbiAqIGV4cG9ydCBmdW5jdGlvbiBmb28oYTogbnVtYmVyKTtcbiAqIGV4cG9ydCBmdW5jdGlvbiBmb28oYTogc3RyaW5nKTtcbiAqIGV4cG9ydCBmdW5jdGlvbiBmb28oYTogbnVtYmVyfHN0cmluZykgeyByZXR1cm4gYTsgfVxuICogYGBgXG4gKiBAcGFyYW0ge1NldDxPYmplY3Q+fSBub2Rlc1xuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzVHlwZXNjcmlwdEZ1bmN0aW9uT3ZlcmxvYWRzKG5vZGVzKSB7XG4gIGNvbnN0IHR5cGVzID0gbmV3IFNldChBcnJheS5mcm9tKG5vZGVzLCBub2RlID0+IG5vZGUucGFyZW50LnR5cGUpKTtcbiAgcmV0dXJuIChcbiAgICB0eXBlcy5oYXMoJ1RTRGVjbGFyZUZ1bmN0aW9uJykgJiZcbiAgICAoXG4gICAgICB0eXBlcy5zaXplID09PSAxIHx8XG4gICAgICAodHlwZXMuc2l6ZSA9PT0gMiAmJiB0eXBlcy5oYXMoJ0Z1bmN0aW9uRGVjbGFyYXRpb24nKSlcbiAgICApXG4gICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3Byb2JsZW0nLFxuICAgIGRvY3M6IHtcbiAgICAgIHVybDogZG9jc1VybCgnZXhwb3J0JyksXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICBjb25zdCBuYW1lc3BhY2UgPSBuZXcgTWFwKFtbcm9vdFByb2dyYW0sIG5ldyBNYXAoKV1dKTtcblxuICAgIGZ1bmN0aW9uIGFkZE5hbWVkKG5hbWUsIG5vZGUsIHBhcmVudCwgaXNUeXBlKSB7XG4gICAgICBpZiAoIW5hbWVzcGFjZS5oYXMocGFyZW50KSkge1xuICAgICAgICBuYW1lc3BhY2Uuc2V0KHBhcmVudCwgbmV3IE1hcCgpKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5hbWVkID0gbmFtZXNwYWNlLmdldChwYXJlbnQpO1xuXG4gICAgICBjb25zdCBrZXkgPSBpc1R5cGUgPyBgJHt0c1R5cGVQcmVmaXh9JHtuYW1lfWAgOiBuYW1lO1xuICAgICAgbGV0IG5vZGVzID0gbmFtZWQuZ2V0KGtleSk7XG5cbiAgICAgIGlmIChub2RlcyA9PSBudWxsKSB7XG4gICAgICAgIG5vZGVzID0gbmV3IFNldCgpO1xuICAgICAgICBuYW1lZC5zZXQoa2V5LCBub2Rlcyk7XG4gICAgICB9XG5cbiAgICAgIG5vZGVzLmFkZChub2RlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJlbnQobm9kZSkge1xuICAgICAgaWYgKG5vZGUucGFyZW50ICYmIG5vZGUucGFyZW50LnR5cGUgPT09ICdUU01vZHVsZUJsb2NrJykge1xuICAgICAgICByZXR1cm4gbm9kZS5wYXJlbnQucGFyZW50O1xuICAgICAgfVxuXG4gICAgICAvLyBqdXN0IGluIGNhc2Ugc29tZWhvdyBhIG5vbi10cyBuYW1lc3BhY2UgZXhwb3J0IGRlY2xhcmF0aW9uIGlzbid0IGRpcmVjdGx5XG4gICAgICAvLyBwYXJlbnRlZCB0byB0aGUgcm9vdCBQcm9ncmFtIG5vZGVcbiAgICAgIHJldHVybiByb290UHJvZ3JhbTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgJ0V4cG9ydERlZmF1bHREZWNsYXJhdGlvbic6IChub2RlKSA9PiBhZGROYW1lZCgnZGVmYXVsdCcsIG5vZGUsIGdldFBhcmVudChub2RlKSksXG5cbiAgICAgICdFeHBvcnRTcGVjaWZpZXInOiAobm9kZSkgPT4gYWRkTmFtZWQoXG4gICAgICAgIG5vZGUuZXhwb3J0ZWQubmFtZSxcbiAgICAgICAgbm9kZS5leHBvcnRlZCxcbiAgICAgICAgZ2V0UGFyZW50KG5vZGUucGFyZW50KVxuICAgICAgKSxcblxuICAgICAgJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbiA9PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcGFyZW50ID0gZ2V0UGFyZW50KG5vZGUpO1xuICAgICAgICAvLyBzdXBwb3J0IGZvciBvbGQgVHlwZVNjcmlwdCB2ZXJzaW9uc1xuICAgICAgICBjb25zdCBpc1R5cGVWYXJpYWJsZURlY2wgPSBub2RlLmRlY2xhcmF0aW9uLmtpbmQgPT09ICd0eXBlJztcblxuICAgICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbi5pZCAhPSBudWxsKSB7XG4gICAgICAgICAgaWYgKGluY2x1ZGVzKFtcbiAgICAgICAgICAgICdUU1R5cGVBbGlhc0RlY2xhcmF0aW9uJyxcbiAgICAgICAgICAgICdUU0ludGVyZmFjZURlY2xhcmF0aW9uJyxcbiAgICAgICAgICBdLCBub2RlLmRlY2xhcmF0aW9uLnR5cGUpKSB7XG4gICAgICAgICAgICBhZGROYW1lZChub2RlLmRlY2xhcmF0aW9uLmlkLm5hbWUsIG5vZGUuZGVjbGFyYXRpb24uaWQsIHBhcmVudCwgdHJ1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFkZE5hbWVkKG5vZGUuZGVjbGFyYXRpb24uaWQubmFtZSwgbm9kZS5kZWNsYXJhdGlvbi5pZCwgcGFyZW50LCBpc1R5cGVWYXJpYWJsZURlY2wpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uLmRlY2xhcmF0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBkZWNsYXJhdGlvbiBvZiBub2RlLmRlY2xhcmF0aW9uLmRlY2xhcmF0aW9ucykge1xuICAgICAgICAgICAgcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUoZGVjbGFyYXRpb24uaWQsIHYgPT5cbiAgICAgICAgICAgICAgYWRkTmFtZWQodi5uYW1lLCB2LCBwYXJlbnQsIGlzVHlwZVZhcmlhYmxlRGVjbCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgJ0V4cG9ydEFsbERlY2xhcmF0aW9uJzogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUuc291cmNlID09IG51bGwpIHJldHVybjsgLy8gbm90IHN1cmUgaWYgdGhpcyBpcyBldmVyIHRydWVcblxuICAgICAgICAvLyBgZXhwb3J0ICogYXMgWCBmcm9tICdwYXRoJ2AgZG9lcyBub3QgY29uZmxpY3RcbiAgICAgICAgaWYgKG5vZGUuZXhwb3J0ZWQgJiYgbm9kZS5leHBvcnRlZC5uYW1lKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcmVtb3RlRXhwb3J0cyA9IEV4cG9ydE1hcC5nZXQobm9kZS5zb3VyY2UudmFsdWUsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVtb3RlRXhwb3J0cyA9PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHJlbW90ZUV4cG9ydHMuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgIHJlbW90ZUV4cG9ydHMucmVwb3J0RXJyb3JzKGNvbnRleHQsIG5vZGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IGdldFBhcmVudChub2RlKTtcblxuICAgICAgICBsZXQgYW55ID0gZmFsc2U7XG4gICAgICAgIHJlbW90ZUV4cG9ydHMuZm9yRWFjaCgodiwgbmFtZSkgPT4ge1xuICAgICAgICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgICAgIGFueSA9IHRydWU7IC8vIHBvb3IgbWFuJ3MgZmlsdGVyXG4gICAgICAgICAgICBhZGROYW1lZChuYW1lLCBub2RlLCBwYXJlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFhbnkpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChcbiAgICAgICAgICAgIG5vZGUuc291cmNlLFxuICAgICAgICAgICAgYE5vIG5hbWVkIGV4cG9ydHMgZm91bmQgaW4gbW9kdWxlICcke25vZGUuc291cmNlLnZhbHVlfScuYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgICdQcm9ncmFtOmV4aXQnOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAoY29uc3QgWywgbmFtZWRdIG9mIG5hbWVzcGFjZSkge1xuICAgICAgICAgIGZvciAoY29uc3QgW25hbWUsIG5vZGVzXSBvZiBuYW1lZCkge1xuICAgICAgICAgICAgaWYgKG5vZGVzLnNpemUgPD0gMSkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChpc1R5cGVzY3JpcHRGdW5jdGlvbk92ZXJsb2Fkcyhub2RlcykpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdkZWZhdWx0Jykge1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUsICdNdWx0aXBsZSBkZWZhdWx0IGV4cG9ydHMuJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICAgICAgYE11bHRpcGxlIGV4cG9ydHMgb2YgbmFtZSAnJHtuYW1lLnJlcGxhY2UodHNUeXBlUHJlZml4LCAnJyl9Jy5gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==