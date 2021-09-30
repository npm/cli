'use strict';var _path = require('path');var _path2 = _interopRequireDefault(_path);

var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var containsPath = function containsPath(filepath, target) {
  var relative = _path2['default'].relative(target, filepath);
  return relative === '' || !relative.startsWith('..');
};

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: (0, _docsUrl2['default'])('no-restricted-paths') },


    schema: [
    {
      type: 'object',
      properties: {
        zones: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              target: { type: 'string' },
              from: { type: 'string' },
              except: {
                type: 'array',
                items: {
                  type: 'string' },

                uniqueItems: true },

              message: { type: 'string' } },

            additionalProperties: false } },


        basePath: { type: 'string' } },

      additionalProperties: false }] },




  create: function () {function noRestrictedPaths(context) {
      var options = context.options[0] || {};
      var restrictedPaths = options.zones || [];
      var basePath = options.basePath || process.cwd();
      var currentFilename = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
      var matchingZones = restrictedPaths.filter(function (zone) {
        var targetPath = _path2['default'].resolve(basePath, zone.target);

        return containsPath(currentFilename, targetPath);
      });

      function isValidExceptionPath(absoluteFromPath, absoluteExceptionPath) {
        var relativeExceptionPath = _path2['default'].relative(absoluteFromPath, absoluteExceptionPath);

        return (0, _importType2['default'])(relativeExceptionPath, context) !== 'parent';
      }

      function reportInvalidExceptionPath(node) {
        context.report({
          node: node,
          message: 'Restricted path exceptions must be descendants of the configured `from` path for that zone.' });

      }

      var zoneExceptions = matchingZones.map(function (zone) {
        var exceptionPaths = zone.except || [];
        var absoluteFrom = _path2['default'].resolve(basePath, zone.from);
        var absoluteExceptionPaths = exceptionPaths.map(function (exceptionPath) {return _path2['default'].resolve(absoluteFrom, exceptionPath);});
        var hasValidExceptionPaths = absoluteExceptionPaths.
        every(function (absoluteExceptionPath) {return isValidExceptionPath(absoluteFrom, absoluteExceptionPath);});

        return {
          absoluteExceptionPaths: absoluteExceptionPaths,
          hasValidExceptionPaths: hasValidExceptionPaths };

      });

      function checkForRestrictedImportPath(importPath, node) {
        var absoluteImportPath = (0, _resolve2['default'])(importPath, context);

        if (!absoluteImportPath) {
          return;
        }

        matchingZones.forEach(function (zone, index) {
          var absoluteFrom = _path2['default'].resolve(basePath, zone.from);

          if (!containsPath(absoluteImportPath, absoluteFrom)) {
            return;
          }var _zoneExceptions$index =

          zoneExceptions[index],hasValidExceptionPaths = _zoneExceptions$index.hasValidExceptionPaths,absoluteExceptionPaths = _zoneExceptions$index.absoluteExceptionPaths;

          if (!hasValidExceptionPaths) {
            reportInvalidExceptionPath(node);
            return;
          }

          var pathIsExcepted = absoluteExceptionPaths.
          some(function (absoluteExceptionPath) {return containsPath(absoluteImportPath, absoluteExceptionPath);});

          if (pathIsExcepted) {
            return;
          }

          context.report({
            node: node,
            message: 'Unexpected path "{{importPath}}" imported in restricted zone.' + (zone.message ? ' ' + String(zone.message) : ''),
            data: { importPath: importPath } });

        });
      }

      return (0, _moduleVisitor2['default'])(function (source) {
        checkForRestrictedImportPath(source.value, source);
      }, { commonjs: true });
    }return noRestrictedPaths;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1yZXN0cmljdGVkLXBhdGhzLmpzIl0sIm5hbWVzIjpbImNvbnRhaW5zUGF0aCIsImZpbGVwYXRoIiwidGFyZ2V0IiwicmVsYXRpdmUiLCJwYXRoIiwic3RhcnRzV2l0aCIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJ1cmwiLCJzY2hlbWEiLCJwcm9wZXJ0aWVzIiwiem9uZXMiLCJtaW5JdGVtcyIsIml0ZW1zIiwiZnJvbSIsImV4Y2VwdCIsInVuaXF1ZUl0ZW1zIiwibWVzc2FnZSIsImFkZGl0aW9uYWxQcm9wZXJ0aWVzIiwiYmFzZVBhdGgiLCJjcmVhdGUiLCJub1Jlc3RyaWN0ZWRQYXRocyIsImNvbnRleHQiLCJvcHRpb25zIiwicmVzdHJpY3RlZFBhdGhzIiwicHJvY2VzcyIsImN3ZCIsImN1cnJlbnRGaWxlbmFtZSIsImdldFBoeXNpY2FsRmlsZW5hbWUiLCJnZXRGaWxlbmFtZSIsIm1hdGNoaW5nWm9uZXMiLCJmaWx0ZXIiLCJ6b25lIiwidGFyZ2V0UGF0aCIsInJlc29sdmUiLCJpc1ZhbGlkRXhjZXB0aW9uUGF0aCIsImFic29sdXRlRnJvbVBhdGgiLCJhYnNvbHV0ZUV4Y2VwdGlvblBhdGgiLCJyZWxhdGl2ZUV4Y2VwdGlvblBhdGgiLCJyZXBvcnRJbnZhbGlkRXhjZXB0aW9uUGF0aCIsIm5vZGUiLCJyZXBvcnQiLCJ6b25lRXhjZXB0aW9ucyIsIm1hcCIsImV4Y2VwdGlvblBhdGhzIiwiYWJzb2x1dGVGcm9tIiwiYWJzb2x1dGVFeGNlcHRpb25QYXRocyIsImV4Y2VwdGlvblBhdGgiLCJoYXNWYWxpZEV4Y2VwdGlvblBhdGhzIiwiZXZlcnkiLCJjaGVja0ZvclJlc3RyaWN0ZWRJbXBvcnRQYXRoIiwiaW1wb3J0UGF0aCIsImFic29sdXRlSW1wb3J0UGF0aCIsImZvckVhY2giLCJpbmRleCIsInBhdGhJc0V4Y2VwdGVkIiwic29tZSIsImRhdGEiLCJzb3VyY2UiLCJ2YWx1ZSIsImNv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TyxFQUFmOztBQUtELFNBMUJEO0FBMkJEOztBQUVELGFBQU8sZ0NBQWMsVUFBQ08sTUFBRCxFQUFZO0FBQy9CUixxQ0FBNkJRLE9BQU9DLEtBQXBDLEVBQTJDRCxNQUEzQztBQUNELE9BRk0sRUFFSixFQUFFRSxVQUFVLElBQVosRUFGSSxDQUFQO0FBR0QsS0E1RUQsT0FBaUJ2QyxpQkFBakIsSUF0Q2UsRUFBakIiLCJmaWxlIjoibm8tcmVzdHJpY3RlZC1wYXRocy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnO1xuaW1wb3J0IG1vZHVsZVZpc2l0b3IgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9tb2R1bGVWaXNpdG9yJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuaW1wb3J0IGltcG9ydFR5cGUgZnJvbSAnLi4vY29yZS9pbXBvcnRUeXBlJztcblxuY29uc3QgY29udGFpbnNQYXRoID0gKGZpbGVwYXRoLCB0YXJnZXQpID0+IHtcbiAgY29uc3QgcmVsYXRpdmUgPSBwYXRoLnJlbGF0aXZlKHRhcmdldCwgZmlsZXBhdGgpO1xuICByZXR1cm4gcmVsYXRpdmUgPT09ICcnIHx8ICFyZWxhdGl2ZS5zdGFydHNXaXRoKCcuLicpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAncHJvYmxlbScsXG4gICAgZG9jczoge1xuICAgICAgdXJsOiBkb2NzVXJsKCduby1yZXN0cmljdGVkLXBhdGhzJyksXG4gICAgfSxcblxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHpvbmVzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgbWluSXRlbXM6IDEsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHRhcmdldDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgIGZyb206IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgICBleGNlcHQ6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB1bmlxdWVJdGVtczogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJhc2VQYXRoOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIG5vUmVzdHJpY3RlZFBhdGhzKGNvbnRleHQpIHtcbiAgICBjb25zdCBvcHRpb25zID0gY29udGV4dC5vcHRpb25zWzBdIHx8IHt9O1xuICAgIGNvbnN0IHJlc3RyaWN0ZWRQYXRocyA9IG9wdGlvbnMuem9uZXMgfHwgW107XG4gICAgY29uc3QgYmFzZVBhdGggPSBvcHRpb25zLmJhc2VQYXRoIHx8IHByb2Nlc3MuY3dkKCk7XG4gICAgY29uc3QgY3VycmVudEZpbGVuYW1lID0gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lID8gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lKCkgOiBjb250ZXh0LmdldEZpbGVuYW1lKCk7XG4gICAgY29uc3QgbWF0Y2hpbmdab25lcyA9IHJlc3RyaWN0ZWRQYXRocy5maWx0ZXIoKHpvbmUpID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldFBhdGggPSBwYXRoLnJlc29sdmUoYmFzZVBhdGgsIHpvbmUudGFyZ2V0KTtcblxuICAgICAgcmV0dXJuIGNvbnRhaW5zUGF0aChjdXJyZW50RmlsZW5hbWUsIHRhcmdldFBhdGgpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gaXNWYWxpZEV4Y2VwdGlvblBhdGgoYWJzb2x1dGVGcm9tUGF0aCwgYWJzb2x1dGVFeGNlcHRpb25QYXRoKSB7XG4gICAgICBjb25zdCByZWxhdGl2ZUV4Y2VwdGlvblBhdGggPSBwYXRoLnJlbGF0aXZlKGFic29sdXRlRnJvbVBhdGgsIGFic29sdXRlRXhjZXB0aW9uUGF0aCk7XG5cbiAgICAgIHJldHVybiBpbXBvcnRUeXBlKHJlbGF0aXZlRXhjZXB0aW9uUGF0aCwgY29udGV4dCkgIT09ICdwYXJlbnQnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcG9ydEludmFsaWRFeGNlcHRpb25QYXRoKG5vZGUpIHtcbiAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgbm9kZSxcbiAgICAgICAgbWVzc2FnZTogJ1Jlc3RyaWN0ZWQgcGF0aCBleGNlcHRpb25zIG11c3QgYmUgZGVzY2VuZGFudHMgb2YgdGhlIGNvbmZpZ3VyZWQgYGZyb21gIHBhdGggZm9yIHRoYXQgem9uZS4nLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgem9uZUV4Y2VwdGlvbnMgPSBtYXRjaGluZ1pvbmVzLm1hcCgoem9uZSkgPT4ge1xuICAgICAgY29uc3QgZXhjZXB0aW9uUGF0aHMgPSB6b25lLmV4Y2VwdCB8fCBbXTtcbiAgICAgIGNvbnN0IGFic29sdXRlRnJvbSA9IHBhdGgucmVzb2x2ZShiYXNlUGF0aCwgem9uZS5mcm9tKTtcbiAgICAgIGNvbnN0IGFic29sdXRlRXhjZXB0aW9uUGF0aHMgPSBleGNlcHRpb25QYXRocy5tYXAoKGV4Y2VwdGlvblBhdGgpID0+IHBhdGgucmVzb2x2ZShhYnNvbHV0ZUZyb20sIGV4Y2VwdGlvblBhdGgpKTtcbiAgICAgIGNvbnN0IGhhc1ZhbGlkRXhjZXB0aW9uUGF0aHMgPSBhYnNvbHV0ZUV4Y2VwdGlvblBhdGhzXG4gICAgICAgIC5ldmVyeSgoYWJzb2x1dGVFeGNlcHRpb25QYXRoKSA9PiBpc1ZhbGlkRXhjZXB0aW9uUGF0aChhYnNvbHV0ZUZyb20sIGFic29sdXRlRXhjZXB0aW9uUGF0aCkpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBhYnNvbHV0ZUV4Y2VwdGlvblBhdGhzLFxuICAgICAgICBoYXNWYWxpZEV4Y2VwdGlvblBhdGhzLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrRm9yUmVzdHJpY3RlZEltcG9ydFBhdGgoaW1wb3J0UGF0aCwgbm9kZSkge1xuICAgICAgY29uc3QgYWJzb2x1dGVJbXBvcnRQYXRoID0gcmVzb2x2ZShpbXBvcnRQYXRoLCBjb250ZXh0KTtcblxuICAgICAgaWYgKCFhYnNvbHV0ZUltcG9ydFBhdGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBtYXRjaGluZ1pvbmVzLmZvckVhY2goKHpvbmUsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGFic29sdXRlRnJvbSA9IHBhdGgucmVzb2x2ZShiYXNlUGF0aCwgem9uZS5mcm9tKTtcblxuICAgICAgICBpZiAoIWNvbnRhaW5zUGF0aChhYnNvbHV0ZUltcG9ydFBhdGgsIGFic29sdXRlRnJvbSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IGhhc1ZhbGlkRXhjZXB0aW9uUGF0aHMsIGFic29sdXRlRXhjZXB0aW9uUGF0aHMgfSA9IHpvbmVFeGNlcHRpb25zW2luZGV4XTtcblxuICAgICAgICBpZiAoIWhhc1ZhbGlkRXhjZXB0aW9uUGF0aHMpIHtcbiAgICAgICAgICByZXBvcnRJbnZhbGlkRXhjZXB0aW9uUGF0aChub2RlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXRoSXNFeGNlcHRlZCA9IGFic29sdXRlRXhjZXB0aW9uUGF0aHNcbiAgICAgICAgICAuc29tZSgoYWJzb2x1dGVFeGNlcHRpb25QYXRoKSA9PiBjb250YWluc1BhdGgoYWJzb2x1dGVJbXBvcnRQYXRoLCBhYnNvbHV0ZUV4Y2VwdGlvblBhdGgpKTtcblxuICAgICAgICBpZiAocGF0aElzRXhjZXB0ZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiBgVW5leHBlY3RlZCBwYXRoIFwie3tpbXBvcnRQYXRofX1cIiBpbXBvcnRlZCBpbiByZXN0cmljdGVkIHpvbmUuJHt6b25lLm1lc3NhZ2UgPyBgICR7em9uZS5tZXNzYWdlfWAgOiAnJ31gLFxuICAgICAgICAgIGRhdGE6IHsgaW1wb3J0UGF0aCB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBtb2R1bGVWaXNpdG9yKChzb3VyY2UpID0+IHtcbiAgICAgIGNoZWNrRm9yUmVzdHJpY3RlZEltcG9ydFBhdGgoc291cmNlLnZhbHVlLCBzb3VyY2UpO1xuICAgIH0sIHsgY29tbW9uanM6IHRydWUgfSk7XG4gIH0sXG59O1xuIl19