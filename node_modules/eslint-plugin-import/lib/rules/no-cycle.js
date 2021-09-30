'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @fileOverview Ensures that no imported module imports the linted module.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @author Ben Mosher
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */

var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _importType = require('../core/importType');
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}

// todo: cache cycles / deep relationships for faster repeat evaluation
module.exports = {
  meta: {
    type: 'suggestion',
    docs: { url: (0, _docsUrl2['default'])('no-cycle') },
    schema: [(0, _moduleVisitor.makeOptionsSchema)({
      maxDepth: {
        oneOf: [
        {
          description: 'maximum dependency depth to traverse',
          type: 'integer',
          minimum: 1 },

        {
          'enum': ['∞'],
          type: 'string' }] },



      ignoreExternal: {
        description: 'ignore external modules',
        type: 'boolean',
        'default': false } })] },




  create: function () {function create(context) {
      var myPath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
      if (myPath === '<text>') return {}; // can't cycle-check a non-file

      var options = context.options[0] || {};
      var maxDepth = typeof options.maxDepth === 'number' ? options.maxDepth : Infinity;
      var ignoreModule = function () {function ignoreModule(name) {return options.ignoreExternal && (0, _importType.isExternalModule)(
          name,
          context.settings,
          (0, _resolve2['default'])(name, context),
          context);}return ignoreModule;}();


      function checkSourceValue(sourceNode, importer) {
        if (ignoreModule(sourceNode.value)) {
          return; // ignore external modules
        }

        if (
        importer.type === 'ImportDeclaration' && (
        // import type { Foo } (TS and Flow)
        importer.importKind === 'type' ||
        // import { type Foo } (Flow)
        importer.specifiers.every(function (_ref) {var importKind = _ref.importKind;return importKind === 'type';})))

        {
          return; // ignore type imports
        }

        var imported = _ExportMap2['default'].get(sourceNode.value, context);

        if (imported == null) {
          return; // no-unresolved territory
        }

        if (imported.path === myPath) {
          return; // no-self-import territory
        }

        var untraversed = [{ mget: function () {function mget() {return imported;}return mget;}(), route: [] }];
        var traversed = new Set();
        function detectCycle(_ref2) {var mget = _ref2.mget,route = _ref2.route;
          var m = mget();
          if (m == null) return;
          if (traversed.has(m.path)) return;
          traversed.add(m.path);var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

            for (var _iterator = m.imports[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var _ref3 = _step.value;var _ref4 = _slicedToArray(_ref3, 2);var path = _ref4[0];var _ref4$ = _ref4[1];var getter = _ref4$.getter;var declarations = _ref4$.declarations;
              if (traversed.has(path)) continue;
              var toTraverse = [].concat(_toConsumableArray(declarations)).filter(function (_ref5) {var source = _ref5.source,isOnlyImportingTypes = _ref5.isOnlyImportingTypes;return (
                  !ignoreModule(source.value) &&
                  // Ignore only type imports
                  !isOnlyImportingTypes);});

              /*
                                             Only report as a cycle if there are any import declarations that are considered by
                                             the rule. For example:
                                              a.ts:
                                             import { foo } from './b' // should not be reported as a cycle
                                              b.ts:
                                             import type { Bar } from './a'
                                             */


              if (path === myPath && toTraverse.length > 0) return true;
              if (route.length + 1 < maxDepth) {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
                  for (var _iterator2 = toTraverse[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var _ref6 = _step2.value;var source = _ref6.source;
                    untraversed.push({ mget: getter, route: route.concat(source) });
                  }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
              }
            }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
        }

        while (untraversed.length > 0) {
          var next = untraversed.shift(); // bfs!
          if (detectCycle(next)) {
            var message = next.route.length > 0 ? 'Dependency cycle via ' + String(
            routeString(next.route)) :
            'Dependency cycle detected.';
            context.report(importer, message);
            return;
          }
        }
      }

      return (0, _moduleVisitor2['default'])(checkSourceValue, context.options[0]);
    }return create;}() };


function routeString(route) {
  return route.map(function (s) {return String(s.value) + ':' + String(s.loc.start.line);}).join('=>');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1jeWNsZS5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsInR5cGUiLCJkb2NzIiwidXJsIiwic2NoZW1hIiwibWF4RGVwdGgiLCJvbmVPZiIsImRlc2NyaXB0aW9uIiwibWluaW11bSIsImlnbm9yZUV4dGVybmFsIiwiY3JlYXRlIiwiY29udGV4dCIsIm15UGF0aCIsImdldFBoeXNpY2FsRmlsZW5hbWUiLCJnZXRGaWxlbmFtZSIsIm9wdGlvbnMiLCJJbmZpbml0eSIsImlnbm9yZU1vZHVsZSIsIm5hbWUiLCJzZXR0aW5ncyIsImNoZWNrU291cmNlVmFsdWUiLCJzb3VyY2VOb2RlIiwiaW1wb3J0ZXIiLCJ2YWx1ZSIsImltcG9ydEtpbmQiLCJzcGVjaWZpZXJzIiwiZXZlcnkiLCJpbXBvcnRlZCIsIkV4cG9ydHMiLCJnZXQiLCJwYXRoIiwidW50cmF2ZXJzZWQiLCJtZ2V0Iiwicm91dGUiLCJ0cmF2ZXJzZWQiLCJTZXQiLCJkZXRlY3RDeWNsZSIsIm0iLCJoYXMiLCJhZGQiLCJpbXBvcnRzIiwiZ2V0dGVyIiwiZGVjbGFyYXRpb25zIiwidG9UcmF2ZXJzZSIsImZpbHRlciIsInNvdXJjZSIsImlzT25seUltcG9ydGluZ1R5cGVzIiwibGVuZ3RoIiwicHVzaCIsImNvbmNhdCIsIm5leHQiLCJzaGlmdCIsIm1lc3NhZ2UiLCJyb3V0ZVN0cmluZyIsInJlcG9ydCIsIm1hcCIsInMiLCJsb2MiLCJzdGFydCIsImxpbmUiLCJqb2luIl0sIm1hcHBpbmdzIjoic29CQUFBOzs7OztBQUtBLHNEO0FBQ0EseUM7QUFDQTtBQUNBLGtFO0FBQ0EscUM7O0FBRUE7QUFDQUEsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sWUFERjtBQUVKQyxVQUFNLEVBQUVDLEtBQUssMEJBQVEsVUFBUixDQUFQLEVBRkY7QUFHSkMsWUFBUSxDQUFDLHNDQUFrQjtBQUN6QkMsZ0JBQVU7QUFDUkMsZUFBTztB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OiJuby1jeWNsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlldyBFbnN1cmVzIHRoYXQgbm8gaW1wb3J0ZWQgbW9kdWxlIGltcG9ydHMgdGhlIGxpbnRlZCBtb2R1bGUuXG4gKiBAYXV0aG9yIEJlbiBNb3NoZXJcbiAqL1xuXG5pbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnO1xuaW1wb3J0IEV4cG9ydHMgZnJvbSAnLi4vRXhwb3J0TWFwJztcbmltcG9ydCB7IGlzRXh0ZXJuYWxNb2R1bGUgfSBmcm9tICcuLi9jb3JlL2ltcG9ydFR5cGUnO1xuaW1wb3J0IG1vZHVsZVZpc2l0b3IsIHsgbWFrZU9wdGlvbnNTY2hlbWEgfSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL21vZHVsZVZpc2l0b3InO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbi8vIHRvZG86IGNhY2hlIGN5Y2xlcyAvIGRlZXAgcmVsYXRpb25zaGlwcyBmb3IgZmFzdGVyIHJlcGVhdCBldmFsdWF0aW9uXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7IHVybDogZG9jc1VybCgnbm8tY3ljbGUnKSB9LFxuICAgIHNjaGVtYTogW21ha2VPcHRpb25zU2NoZW1hKHtcbiAgICAgIG1heERlcHRoOiB7XG4gICAgICAgIG9uZU9mOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdtYXhpbXVtIGRlcGVuZGVuY3kgZGVwdGggdG8gdHJhdmVyc2UnLFxuICAgICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgICAgbWluaW11bTogMSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVudW06IFsn4oieJ10sXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIGlnbm9yZUV4dGVybmFsOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiAnaWdub3JlIGV4dGVybmFsIG1vZHVsZXMnLFxuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KV0sXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIGNvbnN0IG15UGF0aCA9IGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSA/IGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSgpIDogY29udGV4dC5nZXRGaWxlbmFtZSgpO1xuICAgIGlmIChteVBhdGggPT09ICc8dGV4dD4nKSByZXR1cm4ge307IC8vIGNhbid0IGN5Y2xlLWNoZWNrIGEgbm9uLWZpbGVcblxuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG4gICAgY29uc3QgbWF4RGVwdGggPSB0eXBlb2Ygb3B0aW9ucy5tYXhEZXB0aCA9PT0gJ251bWJlcicgPyBvcHRpb25zLm1heERlcHRoIDogSW5maW5pdHk7XG4gICAgY29uc3QgaWdub3JlTW9kdWxlID0gKG5hbWUpID0+IG9wdGlvbnMuaWdub3JlRXh0ZXJuYWwgJiYgaXNFeHRlcm5hbE1vZHVsZShcbiAgICAgIG5hbWUsXG4gICAgICBjb250ZXh0LnNldHRpbmdzLFxuICAgICAgcmVzb2x2ZShuYW1lLCBjb250ZXh0KSxcbiAgICAgIGNvbnRleHRcbiAgICApO1xuXG4gICAgZnVuY3Rpb24gY2hlY2tTb3VyY2VWYWx1ZShzb3VyY2VOb2RlLCBpbXBvcnRlcikge1xuICAgICAgaWYgKGlnbm9yZU1vZHVsZShzb3VyY2VOb2RlLnZhbHVlKSkge1xuICAgICAgICByZXR1cm47IC8vIGlnbm9yZSBleHRlcm5hbCBtb2R1bGVzXG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgaW1wb3J0ZXIudHlwZSA9PT0gJ0ltcG9ydERlY2xhcmF0aW9uJyAmJiAoXG4gICAgICAgICAgLy8gaW1wb3J0IHR5cGUgeyBGb28gfSAoVFMgYW5kIEZsb3cpXG4gICAgICAgICAgaW1wb3J0ZXIuaW1wb3J0S2luZCA9PT0gJ3R5cGUnIHx8XG4gICAgICAgICAgLy8gaW1wb3J0IHsgdHlwZSBGb28gfSAoRmxvdylcbiAgICAgICAgICBpbXBvcnRlci5zcGVjaWZpZXJzLmV2ZXJ5KCh7IGltcG9ydEtpbmQgfSkgPT4gaW1wb3J0S2luZCA9PT0gJ3R5cGUnKVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuOyAvLyBpZ25vcmUgdHlwZSBpbXBvcnRzXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGltcG9ydGVkID0gRXhwb3J0cy5nZXQoc291cmNlTm9kZS52YWx1ZSwgY29udGV4dCk7XG5cbiAgICAgIGlmIChpbXBvcnRlZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjsgIC8vIG5vLXVucmVzb2x2ZWQgdGVycml0b3J5XG4gICAgICB9XG5cbiAgICAgIGlmIChpbXBvcnRlZC5wYXRoID09PSBteVBhdGgpIHtcbiAgICAgICAgcmV0dXJuOyAgLy8gbm8tc2VsZi1pbXBvcnQgdGVycml0b3J5XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVudHJhdmVyc2VkID0gW3sgbWdldDogKCkgPT4gaW1wb3J0ZWQsIHJvdXRlOltdIH1dO1xuICAgICAgY29uc3QgdHJhdmVyc2VkID0gbmV3IFNldCgpO1xuICAgICAgZnVuY3Rpb24gZGV0ZWN0Q3ljbGUoeyBtZ2V0LCByb3V0ZSB9KSB7XG4gICAgICAgIGNvbnN0IG0gPSBtZ2V0KCk7XG4gICAgICAgIGlmIChtID09IG51bGwpIHJldHVybjtcbiAgICAgICAgaWYgKHRyYXZlcnNlZC5oYXMobS5wYXRoKSkgcmV0dXJuO1xuICAgICAgICB0cmF2ZXJzZWQuYWRkKG0ucGF0aCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBbcGF0aCwgeyBnZXR0ZXIsIGRlY2xhcmF0aW9ucyB9XSBvZiBtLmltcG9ydHMpIHtcbiAgICAgICAgICBpZiAodHJhdmVyc2VkLmhhcyhwYXRoKSkgY29udGludWU7XG4gICAgICAgICAgY29uc3QgdG9UcmF2ZXJzZSA9IFsuLi5kZWNsYXJhdGlvbnNdLmZpbHRlcigoeyBzb3VyY2UsIGlzT25seUltcG9ydGluZ1R5cGVzIH0pID0+XG4gICAgICAgICAgICAhaWdub3JlTW9kdWxlKHNvdXJjZS52YWx1ZSkgJiZcbiAgICAgICAgICAgIC8vIElnbm9yZSBvbmx5IHR5cGUgaW1wb3J0c1xuICAgICAgICAgICAgIWlzT25seUltcG9ydGluZ1R5cGVzXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvKlxuICAgICAgICAgIE9ubHkgcmVwb3J0IGFzIGEgY3ljbGUgaWYgdGhlcmUgYXJlIGFueSBpbXBvcnQgZGVjbGFyYXRpb25zIHRoYXQgYXJlIGNvbnNpZGVyZWQgYnlcbiAgICAgICAgICB0aGUgcnVsZS4gRm9yIGV4YW1wbGU6XG5cbiAgICAgICAgICBhLnRzOlxuICAgICAgICAgIGltcG9ydCB7IGZvbyB9IGZyb20gJy4vYicgLy8gc2hvdWxkIG5vdCBiZSByZXBvcnRlZCBhcyBhIGN5Y2xlXG5cbiAgICAgICAgICBiLnRzOlxuICAgICAgICAgIGltcG9ydCB0eXBlIHsgQmFyIH0gZnJvbSAnLi9hJ1xuICAgICAgICAgICovXG4gICAgICAgICAgaWYgKHBhdGggPT09IG15UGF0aCAmJiB0b1RyYXZlcnNlLmxlbmd0aCA+IDApIHJldHVybiB0cnVlO1xuICAgICAgICAgIGlmIChyb3V0ZS5sZW5ndGggKyAxIDwgbWF4RGVwdGgpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgeyBzb3VyY2UgfSBvZiB0b1RyYXZlcnNlKSB7XG4gICAgICAgICAgICAgIHVudHJhdmVyc2VkLnB1c2goeyBtZ2V0OiBnZXR0ZXIsIHJvdXRlOiByb3V0ZS5jb25jYXQoc291cmNlKSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHVudHJhdmVyc2VkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgbmV4dCA9IHVudHJhdmVyc2VkLnNoaWZ0KCk7IC8vIGJmcyFcbiAgICAgICAgaWYgKGRldGVjdEN5Y2xlKG5leHQpKSB7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IChuZXh0LnJvdXRlLmxlbmd0aCA+IDBcbiAgICAgICAgICAgID8gYERlcGVuZGVuY3kgY3ljbGUgdmlhICR7cm91dGVTdHJpbmcobmV4dC5yb3V0ZSl9YFxuICAgICAgICAgICAgOiAnRGVwZW5kZW5jeSBjeWNsZSBkZXRlY3RlZC4nKTtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChpbXBvcnRlciwgbWVzc2FnZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZHVsZVZpc2l0b3IoY2hlY2tTb3VyY2VWYWx1ZSwgY29udGV4dC5vcHRpb25zWzBdKTtcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIHJvdXRlU3RyaW5nKHJvdXRlKSB7XG4gIHJldHVybiByb3V0ZS5tYXAocyA9PiBgJHtzLnZhbHVlfToke3MubG9jLnN0YXJ0LmxpbmV9YCkuam9pbignPT4nKTtcbn1cbiJdfQ==