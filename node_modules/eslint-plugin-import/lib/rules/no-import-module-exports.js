'use strict';var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _pkgUp = require('pkg-up');var _pkgUp2 = _interopRequireDefault(_pkgUp);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function getEntryPoint(context) {
  var pkgPath = _pkgUp2['default'].sync(context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename());
  try {
    return require.resolve(_path2['default'].dirname(pkgPath));
  } catch (error) {
    // Assume the package has no entrypoint (e.g. CLI packages)
    // in which case require.resolve would throw.
    return null;
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow import statements with module.exports',
      category: 'Best Practices',
      recommended: true },

    fixable: 'code',
    schema: [
    {
      'type': 'object',
      'properties': {
        'exceptions': { 'type': 'array' } },

      'additionalProperties': false }] },



  create: function () {function create(context) {
      var importDeclarations = [];
      var entryPoint = getEntryPoint(context);
      var options = context.options[0] || {};
      var alreadyReported = false;

      function report(node) {
        var fileName = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
        var isEntryPoint = entryPoint === fileName;
        var isIdentifier = node.object.type === 'Identifier';
        var hasKeywords = /^(module|exports)$/.test(node.object.name);
        var isException = options.exceptions &&
        options.exceptions.some(function (glob) {return (0, _minimatch2['default'])(fileName, glob);});

        if (isIdentifier && hasKeywords && !isEntryPoint && !isException) {
          importDeclarations.forEach(function (importDeclaration) {
            context.report({
              node: importDeclaration,
              message: 'Cannot use import declarations in modules that export using ' + 'CommonJS (module.exports = \'foo\' or exports.bar = \'hi\')' });


          });
          alreadyReported = true;
        }
      }

      return {
        ImportDeclaration: function () {function ImportDeclaration(node) {
            importDeclarations.push(node);
          }return ImportDeclaration;}(),
        MemberExpression: function () {function MemberExpression(node) {
            if (!alreadyReported) {
              report(node);
            }
          }return MemberExpression;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1pbXBvcnQtbW9kdWxlLWV4cG9ydHMuanMiXSwibmFtZXMiOlsiZ2V0RW50cnlQb2ludCIsImNvbnRleHQiLCJwa2dQYXRoIiwicGtnVXAiLCJzeW5jIiwiZ2V0UGh5c2ljYWxGaWxlbmFtZSIsImdldEZpbGVuYW1lIiwicmVxdWlyZSIsInJlc29sdmUiLCJwYXRoIiwiZGlybmFtZSIsImVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImRlc2NyaXB0aW9uIiwiY2F0ZWdvcnkiLCJyZWNvbW1lbmRlZCIsImZpeGFibGUiLCJzY2hlbWEiLCJjcmVhdGUiLCJpbXBvcnREZWNsYXJhdGlvbnMiLCJlbnRyeVBvaW50Iiwib3B0aW9ucyIsImFscmVhZHlSZXBvcnRlZCIsInJlcG9ydCIsIm5vZGUiLCJmaWxlTmFtZSIsImlzRW50cnlQb2ludCIsImlzSWRlbnRpZmllciIsIm9iamVjdCIsImhhc0tleXdvcmRzIiwidGVzdCIsIm5hbWUiLCJpc0V4Y2VwdGlvbiIsImV4Y2VwdGlvbnMiLCJzb21lIiwiZ2xvYiIsImZvckVhY2giLCJpbXBvcnREZWNsYXJhdGlvbiIsIm1lc3NhZ2UiLCJJbXBvcnREZWNsYXJhdGlvbiIsInB1c2giLCJNZW1iZXJFeHByZXNzaW9uIl0sIm1hcHBpbmdzIjoiYUFBQSxzQztBQUNBLDRCO0FBQ0EsK0I7O0FBRUEsU0FBU0EsYUFBVCxDQUF1QkMsT0FBdkIsRUFBZ0M7QUFDOUIsTUFBTUMsVUFBVUMsbUJBQU1DLElBQU4sQ0FBV0gsUUFBUUksbUJBQVIsR0FBOEJKLFFBQVFJLG1CQUFSLEVBQTlCLEdBQThESixRQUFRSyxXQUFSLEVBQXpFLENBQWhCO0FBQ0EsTUFBSTtBQUNGLFdBQU9DLFFBQVFDLE9BQVIsQ0FBZ0JDLGtCQUFLQyxPQUFMLENBQWFSLE9BQWIsQ0FBaEIsQ0FBUDtBQUNELEdBRkQsQ0FFRSxPQUFPUyxLQUFQLEVBQWM7QUFDZDtBQUNBO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7QUFDRjs7QUFFREMsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sU0FERjtBQUVKQyxVQUFNO0FBQ0pDLG1CQUFhLGdEQURUO0FBRUpDLGdCQUFVLGdCQUZOO0FBR0pDLG1CQUFhLElBSFQsRUFGRjs7QUFPSkMsYUFBUyxNQVBMO0FBUUpDLFlBQVE7QUFDTjtBQUNFLGNBQVEsUUFEVjtBQUVFLG9CQUFjO0FBQ1osc0JBQWMsRUFBRSxRQUFRLE9BQVYsRUFERixFQUZoQjs7QUFLRSw4QkFBd0IsS0FMMUIsRUFETSxDQVJKLEVBRFM7Ozs7QUFtQmZDLFFBbkJlLCtCQW1CUnJCLE9BbkJRLEVBbUJDO0FBQ2QsVUFBTXNCLHFCQUFxQixFQUEzQjtBQUNBLFVBQU1DLGFBQWF4QixjQUFjQyxPQUFkLENBQW5CO0FBQ0EsVUFBTXdCLFVBQVV4QixRQUFRd0IsT0FBUixDQUFnQixDQUFoQixLQUFzQixFQUF0QztBQUNBLFVBQUlDLGtCQUFrQixLQUF0Qjs7QUFFQSxlQUFTQyxNQUFULENBQWdCQyxJQUFoQixFQUFzQjtBQUNwQixZQUFNQyxXQUFXNUIsUUFBUUksbUJBQVIsR0FBOEJKLFFBQVFJLG1CQUFSLEVBQTlCLEdBQThESixRQUFRSyxXQUFSLEVBQS9FO0FBQ0EsWUFBTXdCLGVBQWVOLGVBQWVLLFFBQXBDO0FBQ0EsWUFBTUUsZUFBZUgsS0FBS0ksTUFBTCxDQUFZakIsSUFBWixLQUFxQixZQUExQztBQUNBLFlBQU1rQixjQUFlLG9CQUFELENBQXVCQyxJQUF2QixDQUE0Qk4sS0FBS0ksTUFBTCxDQUFZRyxJQUF4QyxDQUFwQjtBQUNBLFlBQU1DLGNBQWNYLFFBQVFZLFVBQVI7QUFDbEJaLGdCQUFRWSxVQUFSLENBQW1CQyxJQUFuQixDQUF3Qix3QkFBUSw0QkFBVVQsUUFBVixFQUFvQlUsSUFBcEIsQ0FBUixFQUF4QixDQURGOztBQUdBLFlBQUlSLGdCQUFnQkUsV0FBaEIsSUFBK0IsQ0FBQ0gsWUFBaEMsSUFBZ0QsQ0FBQ00sV0FBckQsRUFBa0U7QUFDaEViLDZCQUFtQmlCLE9BQW5CLENBQTJCLDZCQUFxQjtBQUM5Q3ZDLG9CQUFRMEIsTUFBUixDQUFlO0FBQ2JDLG9CQUFNYSxpQkFETztBQUViQyx1QkFBUyw4SEFGSSxFQUFmOzs7QUFLRCxXQU5EO0FBT0FoQiw0QkFBa0IsSUFBbEI7QUFDRDtBQUNGOztBQUVELGFBQU87QUFDTGlCLHlCQURLLDBDQUNhZixJQURiLEVBQ21CO0FBQ3RCTCwrQkFBbUJxQixJQUFuQixDQUF3QmhCLElBQXhCO0FBQ0QsV0FISTtBQUlMaUIsd0JBSksseUNBSVlqQixJQUpaLEVBSWtCO0FBQ3JCLGdCQUFJLENBQUNGLGVBQUwsRUFBc0I7QUFDcEJDLHFCQUFPQyxJQUFQO0FBQ0Q7QUFDRixXQVJJLDZCQUFQOztBQVVELEtBdkRjLG1CQUFqQiIsImZpbGUiOiJuby1pbXBvcnQtbW9kdWxlLWV4cG9ydHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBwa2dVcCBmcm9tICdwa2ctdXAnO1xuXG5mdW5jdGlvbiBnZXRFbnRyeVBvaW50KGNvbnRleHQpIHtcbiAgY29uc3QgcGtnUGF0aCA9IHBrZ1VwLnN5bmMoY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lID8gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lKCkgOiBjb250ZXh0LmdldEZpbGVuYW1lKCkpO1xuICB0cnkge1xuICAgIHJldHVybiByZXF1aXJlLnJlc29sdmUocGF0aC5kaXJuYW1lKHBrZ1BhdGgpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyBBc3N1bWUgdGhlIHBhY2thZ2UgaGFzIG5vIGVudHJ5cG9pbnQgKGUuZy4gQ0xJIHBhY2thZ2VzKVxuICAgIC8vIGluIHdoaWNoIGNhc2UgcmVxdWlyZS5yZXNvbHZlIHdvdWxkIHRocm93LlxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3Byb2JsZW0nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWxsb3cgaW1wb3J0IHN0YXRlbWVudHMgd2l0aCBtb2R1bGUuZXhwb3J0cycsXG4gICAgICBjYXRlZ29yeTogJ0Jlc3QgUHJhY3RpY2VzJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgIH0sXG4gICAgZml4YWJsZTogJ2NvZGUnLFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICAndHlwZSc6ICdvYmplY3QnLFxuICAgICAgICAncHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnZXhjZXB0aW9ucyc6IHsgJ3R5cGUnOiAnYXJyYXknIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdhZGRpdGlvbmFsUHJvcGVydGllcyc6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IGltcG9ydERlY2xhcmF0aW9ucyA9IFtdO1xuICAgIGNvbnN0IGVudHJ5UG9pbnQgPSBnZXRFbnRyeVBvaW50KGNvbnRleHQpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG4gICAgbGV0IGFscmVhZHlSZXBvcnRlZCA9IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gcmVwb3J0KG5vZGUpIHtcbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lID8gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lKCkgOiBjb250ZXh0LmdldEZpbGVuYW1lKCk7XG4gICAgICBjb25zdCBpc0VudHJ5UG9pbnQgPSBlbnRyeVBvaW50ID09PSBmaWxlTmFtZTtcbiAgICAgIGNvbnN0IGlzSWRlbnRpZmllciA9IG5vZGUub2JqZWN0LnR5cGUgPT09ICdJZGVudGlmaWVyJztcbiAgICAgIGNvbnN0IGhhc0tleXdvcmRzID0gKC9eKG1vZHVsZXxleHBvcnRzKSQvKS50ZXN0KG5vZGUub2JqZWN0Lm5hbWUpO1xuICAgICAgY29uc3QgaXNFeGNlcHRpb24gPSBvcHRpb25zLmV4Y2VwdGlvbnMgJiZcbiAgICAgICAgb3B0aW9ucy5leGNlcHRpb25zLnNvbWUoZ2xvYiA9PiBtaW5pbWF0Y2goZmlsZU5hbWUsIGdsb2IpKTtcblxuICAgICAgaWYgKGlzSWRlbnRpZmllciAmJiBoYXNLZXl3b3JkcyAmJiAhaXNFbnRyeVBvaW50ICYmICFpc0V4Y2VwdGlvbikge1xuICAgICAgICBpbXBvcnREZWNsYXJhdGlvbnMuZm9yRWFjaChpbXBvcnREZWNsYXJhdGlvbiA9PiB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZTogaW1wb3J0RGVjbGFyYXRpb24sXG4gICAgICAgICAgICBtZXNzYWdlOiBgQ2Fubm90IHVzZSBpbXBvcnQgZGVjbGFyYXRpb25zIGluIG1vZHVsZXMgdGhhdCBleHBvcnQgdXNpbmcgYCArXG4gICAgICAgICAgICAgIGBDb21tb25KUyAobW9kdWxlLmV4cG9ydHMgPSAnZm9vJyBvciBleHBvcnRzLmJhciA9ICdoaScpYCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFscmVhZHlSZXBvcnRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgaW1wb3J0RGVjbGFyYXRpb25zLnB1c2gobm9kZSk7XG4gICAgICB9LFxuICAgICAgTWVtYmVyRXhwcmVzc2lvbihub2RlKSB7XG4gICAgICAgIGlmICghYWxyZWFkeVJlcG9ydGVkKSB7XG4gICAgICAgICAgcmVwb3J0KG5vZGUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19