'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _path = require('path');var path = _interopRequireWildcard(_path);
var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj['default'] = obj;return newObj;}}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: (0, _docsUrl2['default'])('named') },

    schema: [
    {
      type: 'object',
      properties: {
        commonjs: {
          type: 'boolean' } },


      additionalProperties: false }] },




  create: function () {function create(context) {
      var options = context.options[0] || {};

      function checkSpecifiers(key, type, node) {
        // ignore local exports and type imports/exports
        if (
        node.source == null ||
        node.importKind === 'type' ||
        node.importKind === 'typeof' ||
        node.exportKind === 'type')
        {
          return;
        }

        if (!node.specifiers.some(function (im) {return im.type === type;})) {
          return; // no named imports/exports
        }

        var imports = _ExportMap2['default'].get(node.source.value, context);
        if (imports == null) {
          return;
        }

        if (imports.errors.length) {
          imports.reportErrors(context, node);
          return;
        }

        node.specifiers.forEach(function (im) {
          if (
          im.type !== type
          // ignore type imports
          || im.importKind === 'type' || im.importKind === 'typeof')
          {
            return;
          }

          var deepLookup = imports.hasDeep(im[key].name);

          if (!deepLookup.found) {
            if (deepLookup.path.length > 1) {
              var deepPath = deepLookup.path.
              map(function (i) {return path.relative(path.dirname(context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename()), i.path);}).
              join(' -> ');

              context.report(im[key], String(im[key].name) + ' not found via ' + String(deepPath));
            } else {
              context.report(im[key], im[key].name + ' not found in \'' + node.source.value + '\'');
            }
          }
        });
      }

      function checkRequire(node) {
        if (
        !options.commonjs ||
        node.type !== 'VariableDeclarator'
        // return if it's not an object destructure or it's an empty object destructure
        || !node.id || node.id.type !== 'ObjectPattern' || node.id.properties.length === 0
        // return if there is no call expression on the right side
        || !node.init || node.init.type !== 'CallExpression')
        {
          return;
        }

        var call = node.init;var _call$arguments = _slicedToArray(
        call.arguments, 1),source = _call$arguments[0];
        var variableImports = node.id.properties;
        var variableExports = _ExportMap2['default'].get(source.value, context);

        if (
        // return if it's not a commonjs require statement
        call.callee.type !== 'Identifier' || call.callee.name !== 'require' || call.arguments.length !== 1
        // return if it's not a string source
        || source.type !== 'Literal' ||
        variableExports == null)
        {
          return;
        }

        if (variableExports.errors.length) {
          variableExports.reportErrors(context, node);
          return;
        }

        variableImports.forEach(function (im) {
          if (im.type !== 'Property' || !im.key || im.key.type !== 'Identifier') {
            return;
          }

          var deepLookup = variableExports.hasDeep(im.key.name);

          if (!deepLookup.found) {
            if (deepLookup.path.length > 1) {
              var deepPath = deepLookup.path.
              map(function (i) {return path.relative(path.dirname(context.getFilename()), i.path);}).
              join(' -> ');

              context.report(im.key, String(im.key.name) + ' not found via ' + String(deepPath));
            } else {
              context.report(im.key, im.key.name + ' not found in \'' + source.value + '\'');
            }
          }
        });
      }

      return {
        ImportDeclaration: checkSpecifiers.bind(null, 'imported', 'ImportSpecifier'),

        ExportNamedDeclaration: checkSpecifiers.bind(null, 'local', 'ExportSpecifier'),

        VariableDeclarator: checkRequire };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uYW1lZC5qcyJdLCJuYW1lcyI6WyJwYXRoIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsInVybCIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJjb21tb25qcyIsImFkZGl0aW9uYWxQcm9wZXJ0aWVzIiwiY3JlYXRlIiwiY29udGV4dCIsIm9wdGlvbnMiLCJjaGVja1NwZWNpZmllcnMiLCJrZXkiLCJub2RlIiwic291cmNlIiwiaW1wb3J0S2luZCIsImV4cG9ydEtpbmQiLCJzcGVjaWZpZXJzIiwic29tZSIsImltIiwiaW1wb3J0cyIsIkV4cG9ydHMiLCJnZXQiLCJ2YWx1ZSIsImVycm9ycyIsImxlbmd0aCIsInJlcG9ydEVycm9ycyIsImZvckVhY2giLCJkZWVwTG9va3VwIiwiaGFzRGVlcCIsIm5hbWUiLCJmb3VuZCIsImRlZXBQYXRoIiwibWFwIiwicmVsYXRpdmUiLCJkaXJuYW1lIiwiZ2V0UGh5c2ljYWxGaWxlbmFtZSIsImdldEZpbGVuYW1lIiwiaSIsImpvaW4iLCJyZXBvcnQiLCJjaGVja1JlcXVpcmUiLCJpZCIsImluaXQiLCJjYWxsIiwiYXJndW1lbnRzIiwidmFyaWFibGVJbXBvcnRzIiwidmFyaWFibGVFeHBvcnRzIiwiY2FsbGVlIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJiaW5kIiwiRXhwb3J0TmFtZWREZWNsYXJhdGlvbiIsIlZhcmlhYmxlRGVjbGFyYXRvciJdLCJtYXBwaW5ncyI6InFvQkFBQSw0QixJQUFZQSxJO0FBQ1oseUM7QUFDQSxxQzs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sU0FERjtBQUVKQyxVQUFNO0FBQ0pDLFdBQUssMEJBQVEsT0FBUixDQURELEVBRkY7O0FBS0pDLFlBQVE7QUFDTjtBQUNFSCxZQUFNLFFBRFI7QUFFRUksa0JBQVk7QUFDVkMsa0JBQVU7QUFDUkwsZ0JBQU0sU0FERSxFQURBLEVBRmQ7OztBQU9FTSw0QkFB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UTRCLFdBQVIsRUFBYixDQUFkLEVBQW1EQyxFQUFFekMsSUFBckQsQ0FBTCxFQURVO0FBRWQwQyxrQkFGYyxDQUVULE1BRlMsQ0FBakI7O0FBSUE5QixzQkFBUStCLE1BQVIsQ0FBZXJCLEdBQUdQLEdBQWxCLFNBQTBCTyxHQUFHUCxHQUFILENBQU9rQixJQUFqQywrQkFBdURFLFFBQXZEO0FBQ0QsYUFORCxNQU1PO0FBQ0x2QixzQkFBUStCLE1BQVIsQ0FBZXJCLEdBQUdQLEdBQWxCLEVBQXVCTyxHQUFHUCxHQUFILENBQU9rQixJQUFQLEdBQWMsa0JBQWQsR0FBbUNoQixPQUFPUyxLQUExQyxHQUFrRCxJQUF6RTtBQUNEO0FBQ0Y7QUFDRixTQWxCRDtBQW1CRDs7QUFFRCxhQUFPO0FBQ0wwQiwyQkFBbUJ0QyxnQkFBZ0J1QyxJQUFoQixDQUFxQixJQUFyQixFQUEyQixVQUEzQixFQUF1QyxpQkFBdkMsQ0FEZDs7QUFHTEMsZ0NBQXdCeEMsZ0JBQWdCdUMsSUFBaEIsQ0FBcUIsSUFBckIsRUFBMkIsT0FBM0IsRUFBb0MsaUJBQXBDLENBSG5COztBQUtMRSw0QkFBb0JYLFlBTGYsRUFBUDs7QUFPRCxLQWpIRCxpQkFuQmUsRUFBakIiLCJmaWxlIjoibmFtZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEV4cG9ydHMgZnJvbSAnLi4vRXhwb3J0TWFwJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdwcm9ibGVtJyxcbiAgICBkb2NzOiB7XG4gICAgICB1cmw6IGRvY3NVcmwoJ25hbWVkJyksXG4gICAgfSxcbiAgICBzY2hlbWE6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBjb21tb25qczoge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrU3BlY2lmaWVycyhrZXksIHR5cGUsIG5vZGUpIHtcbiAgICAgIC8vIGlnbm9yZSBsb2NhbCBleHBvcnRzIGFuZCB0eXBlIGltcG9ydHMvZXhwb3J0c1xuICAgICAgaWYgKFxuICAgICAgICBub2RlLnNvdXJjZSA9PSBudWxsXG4gICAgICAgIHx8IG5vZGUuaW1wb3J0S2luZCA9PT0gJ3R5cGUnXG4gICAgICAgIHx8IG5vZGUuaW1wb3J0S2luZCA9PT0gJ3R5cGVvZidcbiAgICAgICAgfHwgbm9kZS5leHBvcnRLaW5kID09PSAndHlwZSdcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghbm9kZS5zcGVjaWZpZXJzLnNvbWUoKGltKSA9PiBpbS50eXBlID09PSB0eXBlKSkge1xuICAgICAgICByZXR1cm47IC8vIG5vIG5hbWVkIGltcG9ydHMvZXhwb3J0c1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpbXBvcnRzID0gRXhwb3J0cy5nZXQobm9kZS5zb3VyY2UudmFsdWUsIGNvbnRleHQpO1xuICAgICAgaWYgKGltcG9ydHMgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChpbXBvcnRzLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgaW1wb3J0cy5yZXBvcnRFcnJvcnMoY29udGV4dCwgbm9kZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbm9kZS5zcGVjaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKGltKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBpbS50eXBlICE9PSB0eXBlXG4gICAgICAgICAgLy8gaWdub3JlIHR5cGUgaW1wb3J0c1xuICAgICAgICAgIHx8IGltLmltcG9ydEtpbmQgPT09ICd0eXBlJyB8fCBpbS5pbXBvcnRLaW5kID09PSAndHlwZW9mJ1xuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkZWVwTG9va3VwID0gaW1wb3J0cy5oYXNEZWVwKGltW2tleV0ubmFtZSk7XG5cbiAgICAgICAgaWYgKCFkZWVwTG9va3VwLmZvdW5kKSB7XG4gICAgICAgICAgaWYgKGRlZXBMb29rdXAucGF0aC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBjb25zdCBkZWVwUGF0aCA9IGRlZXBMb29rdXAucGF0aFxuICAgICAgICAgICAgICAubWFwKGkgPT4gcGF0aC5yZWxhdGl2ZShwYXRoLmRpcm5hbWUoY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lID8gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lKCkgOiBjb250ZXh0LmdldEZpbGVuYW1lKCkpLCBpLnBhdGgpKVxuICAgICAgICAgICAgICAuam9pbignIC0+ICcpO1xuXG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydChpbVtrZXldLCBgJHtpbVtrZXldLm5hbWV9IG5vdCBmb3VuZCB2aWEgJHtkZWVwUGF0aH1gKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoaW1ba2V5XSwgaW1ba2V5XS5uYW1lICsgJyBub3QgZm91bmQgaW4gXFwnJyArIG5vZGUuc291cmNlLnZhbHVlICsgJ1xcJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tSZXF1aXJlKG5vZGUpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIW9wdGlvbnMuY29tbW9uanNcbiAgICAgICAgfHwgbm9kZS50eXBlICE9PSAnVmFyaWFibGVEZWNsYXJhdG9yJ1xuICAgICAgICAvLyByZXR1cm4gaWYgaXQncyBub3QgYW4gb2JqZWN0IGRlc3RydWN0dXJlIG9yIGl0J3MgYW4gZW1wdHkgb2JqZWN0IGRlc3RydWN0dXJlXG4gICAgICAgIHx8ICFub2RlLmlkIHx8IG5vZGUuaWQudHlwZSAhPT0gJ09iamVjdFBhdHRlcm4nIHx8IG5vZGUuaWQucHJvcGVydGllcy5sZW5ndGggPT09IDBcbiAgICAgICAgLy8gcmV0dXJuIGlmIHRoZXJlIGlzIG5vIGNhbGwgZXhwcmVzc2lvbiBvbiB0aGUgcmlnaHQgc2lkZVxuICAgICAgICB8fCAhbm9kZS5pbml0IHx8IG5vZGUuaW5pdC50eXBlICE9PSAnQ2FsbEV4cHJlc3Npb24nXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjYWxsID0gbm9kZS5pbml0O1xuICAgICAgY29uc3QgW3NvdXJjZV0gPSBjYWxsLmFyZ3VtZW50cztcbiAgICAgIGNvbnN0IHZhcmlhYmxlSW1wb3J0cyA9IG5vZGUuaWQucHJvcGVydGllcztcbiAgICAgIGNvbnN0IHZhcmlhYmxlRXhwb3J0cyA9IEV4cG9ydHMuZ2V0KHNvdXJjZS52YWx1ZSwgY29udGV4dCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgLy8gcmV0dXJuIGlmIGl0J3Mgbm90IGEgY29tbW9uanMgcmVxdWlyZSBzdGF0ZW1lbnRcbiAgICAgICAgY2FsbC5jYWxsZWUudHlwZSAhPT0gJ0lkZW50aWZpZXInIHx8IGNhbGwuY2FsbGVlLm5hbWUgIT09ICdyZXF1aXJlJyB8fCBjYWxsLmFyZ3VtZW50cy5sZW5ndGggIT09IDFcbiAgICAgICAgLy8gcmV0dXJuIGlmIGl0J3Mgbm90IGEgc3RyaW5nIHNvdXJjZVxuICAgICAgICB8fCBzb3VyY2UudHlwZSAhPT0gJ0xpdGVyYWwnXG4gICAgICAgIHx8IHZhcmlhYmxlRXhwb3J0cyA9PSBudWxsXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFyaWFibGVFeHBvcnRzLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgdmFyaWFibGVFeHBvcnRzLnJlcG9ydEVycm9ycyhjb250ZXh0LCBub2RlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXJpYWJsZUltcG9ydHMuZm9yRWFjaChmdW5jdGlvbiAoaW0pIHtcbiAgICAgICAgaWYgKGltLnR5cGUgIT09ICdQcm9wZXJ0eScgfHwgIWltLmtleSB8fCBpbS5rZXkudHlwZSAhPT0gJ0lkZW50aWZpZXInKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVlcExvb2t1cCA9IHZhcmlhYmxlRXhwb3J0cy5oYXNEZWVwKGltLmtleS5uYW1lKTtcblxuICAgICAgICBpZiAoIWRlZXBMb29rdXAuZm91bmQpIHtcbiAgICAgICAgICBpZiAoZGVlcExvb2t1cC5wYXRoLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGRlZXBQYXRoID0gZGVlcExvb2t1cC5wYXRoXG4gICAgICAgICAgICAgIC5tYXAoaSA9PiBwYXRoLnJlbGF0aXZlKHBhdGguZGlybmFtZShjb250ZXh0LmdldEZpbGVuYW1lKCkpLCBpLnBhdGgpKVxuICAgICAgICAgICAgICAuam9pbignIC0+ICcpO1xuXG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydChpbS5rZXksIGAke2ltLmtleS5uYW1lfSBub3QgZm91bmQgdmlhICR7ZGVlcFBhdGh9YCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KGltLmtleSwgaW0ua2V5Lm5hbWUgKyAnIG5vdCBmb3VuZCBpbiBcXCcnICsgc291cmNlLnZhbHVlICsgJ1xcJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uOiBjaGVja1NwZWNpZmllcnMuYmluZChudWxsLCAnaW1wb3J0ZWQnLCAnSW1wb3J0U3BlY2lmaWVyJyksXG5cbiAgICAgIEV4cG9ydE5hbWVkRGVjbGFyYXRpb246IGNoZWNrU3BlY2lmaWVycy5iaW5kKG51bGwsICdsb2NhbCcsICdFeHBvcnRTcGVjaWZpZXInKSxcblxuICAgICAgVmFyaWFibGVEZWNsYXJhdG9yOiBjaGVja1JlcXVpcmUsXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=