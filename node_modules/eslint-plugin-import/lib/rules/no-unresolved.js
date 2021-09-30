'use strict';




var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _ModuleCache = require('eslint-module-utils/ModuleCache');var _ModuleCache2 = _interopRequireDefault(_ModuleCache);
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };} /**
                                                                                                                                                                                       * @fileOverview Ensures that an imported path exists, given resolution rules.
                                                                                                                                                                                       * @author Ben Mosher
                                                                                                                                                                                       */module.exports = { meta: {
    type: 'problem',
    docs: {
      url: (0, _docsUrl2['default'])('no-unresolved') },


    schema: [
    (0, _moduleVisitor.makeOptionsSchema)({
      caseSensitive: { type: 'boolean', 'default': true } })] },




  create: function () {function create(context) {
      function checkSourceValue(source) {
        var shouldCheckCase = !_resolve.CASE_SENSITIVE_FS && (
        !context.options[0] || context.options[0].caseSensitive !== false);

        var resolvedPath = (0, _resolve2['default'])(source.value, context);

        if (resolvedPath === undefined) {
          context.report(
          source, 'Unable to resolve path to module \'' + String(
          source.value) + '\'.');

        } else if (shouldCheckCase) {
          var cacheSettings = _ModuleCache2['default'].getSettings(context.settings);
          if (!(0, _resolve.fileExistsWithCaseSync)(resolvedPath, cacheSettings)) {
            context.report(
            source, 'Casing of ' + String(
            source.value) + ' does not match the underlying filesystem.');

          }
        }
      }

      return (0, _moduleVisitor2['default'])(checkSourceValue, context.options[0]);
    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby11bnJlc29sdmVkLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJ1cmwiLCJzY2hlbWEiLCJjYXNlU2Vuc2l0aXZlIiwiY3JlYXRlIiwiY29udGV4dCIsImNoZWNrU291cmNlVmFsdWUiLCJzb3VyY2UiLCJzaG91bGRDaGVja0Nhc2UiLCJDQVNFX1NFTlNJVElWRV9GUyIsIm9wdGlvbnMiLCJyZXNvbHZlZFBhdGgiLCJ2YWx1ZSIsInVuZGVmaW5lZCIsInJlcG9ydCIsImNhY2hlU2V0dGluZ3MiLCJNb2R1bGVDYWNoZSIsImdldFNldHRpbmdzIiwic2V0dGluZ3MiXSwibWFwcGluZ3MiOiI7Ozs7O0FBS0Esc0Q7QUFDQSw4RDtBQUNBLGtFO0FBQ0EscUMsaUpBUkE7Ozt5TEFVQUEsT0FBT0MsT0FBUCxHQUFpQixFQUNmQyxNQUFNO0FBQ0pDLFVBQU0sU0FERjtBQUVKQyxVQUFNO0FBQ0pDLFdBQUssMEJBQVEsZUFBUixDQURELEVBRkY7OztBQU1KQyxZQUFRO0FBQ04sMENBQWtCO0FBQ2hCQyxxQkFBZSxFQUFFSixNQUFNLFNBQVIsRUFBbUIsV0FBUyxJQUE1QixFQURDLEVBQWxCLENBRE0sQ0FOSixFQURTOzs7OztBQWNmSyx1QkFBUSxnQkFBVUMsT0FBVixFQUFtQjtBQUN6QixlQUFTQyxnQkFBVCxDQUEwQkMsTUFBMUIsRUFBa0M7QUFDaEMsWUFBTUMsa0JBQWtCLENBQUNDLDBCQUFEO0FBQ2xCLFNBQUNKLFFBQVFLLE9BQVIsQ0FBZ0IsQ0FBaEIsQ0FBRCxJQUF1QkwsUUFBUUssT0FBUixDQUFnQixDQUFoQixFQUFtQlAsYUFBbkIsS0FBcUMsS0FEMUMsQ0FBeEI7O0FBR0EsWUFBTVEsZUFBZSwwQkFBUUosT0FBT0ssS0FBZixFQUFzQlAsT0FBdEIsQ0FBckI7O0FBRUEsWUFBSU0saUJBQWlCRSxTQUFyQixFQUFnQztBQUM5QlIsa0JBQVFTLE1BQVI7QUFDRVAsZ0JBREY7QUFFdUNBLGlCQUFPSyxLQUY5Qzs7QUFJRCxTQUxELE1BS08sSUFBSUosZUFBSixFQUFxQjtBQUMxQixjQUFNTyxnQkFBZ0JDLHlCQUFZQyxXQUFaLENBQXdCWixRQUFRYSxRQUFoQyxDQUF0QjtBQUNBLGNBQUksQ0FBQyxxQ0FBdUJQLFlBQXZCLEVBQXFDSSxhQUFyQyxDQUFMLEVBQTBEO0FBQ3hEVixvQkFBUVMsTUFBUjtBQUNFUCxrQkFERjtBQUVlQSxtQkFBT0ssS0FGdEI7O0FBSUQ7QUFDRjtBQUNGOztBQUVELGFBQU8sZ0NBQWNOLGdCQUFkLEVBQWdDRCxRQUFRSyxPQUFSLENBQWdCLENBQWhCLENBQWhDLENBQVA7QUFDRCxLQXhCRCxpQkFkZSxFQUFqQiIsImZpbGUiOiJuby11bnJlc29sdmVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IEVuc3VyZXMgdGhhdCBhbiBpbXBvcnRlZCBwYXRoIGV4aXN0cywgZ2l2ZW4gcmVzb2x1dGlvbiBydWxlcy5cbiAqIEBhdXRob3IgQmVuIE1vc2hlclxuICovXG5cbmltcG9ydCByZXNvbHZlLCB7IENBU0VfU0VOU0lUSVZFX0ZTLCBmaWxlRXhpc3RzV2l0aENhc2VTeW5jIH0gZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJztcbmltcG9ydCBNb2R1bGVDYWNoZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL01vZHVsZUNhY2hlJztcbmltcG9ydCBtb2R1bGVWaXNpdG9yLCB7IG1ha2VPcHRpb25zU2NoZW1hIH0gZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9tb2R1bGVWaXNpdG9yJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdwcm9ibGVtJyxcbiAgICBkb2NzOiB7XG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLXVucmVzb2x2ZWQnKSxcbiAgICB9LFxuXG4gICAgc2NoZW1hOiBbXG4gICAgICBtYWtlT3B0aW9uc1NjaGVtYSh7XG4gICAgICAgIGNhc2VTZW5zaXRpdmU6IHsgdHlwZTogJ2Jvb2xlYW4nLCBkZWZhdWx0OiB0cnVlIH0sXG4gICAgICB9KSxcbiAgICBdLFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICBmdW5jdGlvbiBjaGVja1NvdXJjZVZhbHVlKHNvdXJjZSkge1xuICAgICAgY29uc3Qgc2hvdWxkQ2hlY2tDYXNlID0gIUNBU0VfU0VOU0lUSVZFX0ZTXG4gICAgICAgICYmICghY29udGV4dC5vcHRpb25zWzBdIHx8IGNvbnRleHQub3B0aW9uc1swXS5jYXNlU2Vuc2l0aXZlICE9PSBmYWxzZSk7XG5cbiAgICAgIGNvbnN0IHJlc29sdmVkUGF0aCA9IHJlc29sdmUoc291cmNlLnZhbHVlLCBjb250ZXh0KTtcblxuICAgICAgaWYgKHJlc29sdmVkUGF0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICBgVW5hYmxlIHRvIHJlc29sdmUgcGF0aCB0byBtb2R1bGUgJyR7c291cmNlLnZhbHVlfScuYFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChzaG91bGRDaGVja0Nhc2UpIHtcbiAgICAgICAgY29uc3QgY2FjaGVTZXR0aW5ncyA9IE1vZHVsZUNhY2hlLmdldFNldHRpbmdzKGNvbnRleHQuc2V0dGluZ3MpO1xuICAgICAgICBpZiAoIWZpbGVFeGlzdHNXaXRoQ2FzZVN5bmMocmVzb2x2ZWRQYXRoLCBjYWNoZVNldHRpbmdzKSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KFxuICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgYENhc2luZyBvZiAke3NvdXJjZS52YWx1ZX0gZG9lcyBub3QgbWF0Y2ggdGhlIHVuZGVybHlpbmcgZmlsZXN5c3RlbS5gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2R1bGVWaXNpdG9yKGNoZWNrU291cmNlVmFsdWUsIGNvbnRleHQub3B0aW9uc1swXSk7XG4gIH0sXG59O1xuIl19