'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function isNonExportStatement(_ref) {var type = _ref.type;
  return type !== 'ExportDefaultDeclaration' &&
  type !== 'ExportNamedDeclaration' &&
  type !== 'ExportAllDeclaration';
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('exports-last') },

    schema: [] },


  create: function () {function create(context) {
      return {
        Program: function () {function Program(_ref2) {var body = _ref2.body;
            var lastNonExportStatementIndex = body.reduce(function () {function findLastIndex(acc, item, index) {
                if (isNonExportStatement(item)) {
                  return index;
                }
                return acc;
              }return findLastIndex;}(), -1);

            if (lastNonExportStatementIndex !== -1) {
              body.slice(0, lastNonExportStatementIndex).forEach(function () {function checkNonExport(node) {
                  if (!isNonExportStatement(node)) {
                    context.report({
                      node: node,
                      message: 'Export statements should appear at the end of the file' });

                  }
                }return checkNonExport;}());
            }
          }return Program;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9leHBvcnRzLWxhc3QuanMiXSwibmFtZXMiOlsiaXNOb25FeHBvcnRTdGF0ZW1lbnQiLCJ0eXBlIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJkb2NzIiwidXJsIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsIlByb2dyYW0iLCJib2R5IiwibGFzdE5vbkV4cG9ydFN0YXRlbWVudEluZGV4IiwicmVkdWNlIiwiZmluZExhc3RJbmRleCIsImFjYyIsIml0ZW0iLCJpbmRleCIsInNsaWNlIiwiZm9yRWFjaCIsImNoZWNrTm9uRXhwb3J0Iiwibm9kZSIsInJlcG9ydCIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiJhQUFBLHFDOztBQUVBLFNBQVNBLG9CQUFULE9BQXdDLEtBQVJDLElBQVEsUUFBUkEsSUFBUTtBQUN0QyxTQUFPQSxTQUFTLDBCQUFUO0FBQ0xBLFdBQVMsd0JBREo7QUFFTEEsV0FBUyxzQkFGWDtBQUdEOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkgsVUFBTSxZQURGO0FBRUpJLFVBQU07QUFDSkMsV0FBSywwQkFBUSxjQUFSLENBREQsRUFGRjs7QUFLSkMsWUFBUSxFQUxKLEVBRFM7OztBQVNmQyx1QkFBUSxnQkFBVUMsT0FBVixFQUFtQjtBQUN6QixhQUFPO0FBQ0xDLDhCQUFTLHdCQUFvQixLQUFSQyxJQUFRLFNBQVJBLElBQVE7QUFDM0IsZ0JBQU1DLDhCQUE4QkQsS0FBS0UsTUFBTCxjQUFZLFNBQVNDLGFBQVQsQ0FBdUJDLEdBQXZCLEVBQTRCQyxJQUE1QixFQUFrQ0MsS0FBbEMsRUFBeUM7QUFDdkYsb0JBQUlqQixxQkFBcUJnQixJQUFyQixDQUFKLEVBQWdDO0FBQzlCLHlCQUFPQyxLQUFQO0FBQ0Q7QUFDRCx1QkFBT0YsR0FBUDtBQUNELGVBTG1DLE9BQXFCRCxhQUFyQixNQUtqQyxDQUFDLENBTGdDLENBQXBDOztBQU9BLGdCQUFJRixnQ0FBZ0MsQ0FBQyxDQUFyQyxFQUF3QztBQUN0Q0QsbUJBQUtPLEtBQUwsQ0FBVyxDQUFYLEVBQWNOLDJCQUFkLEVBQTJDTyxPQUEzQyxjQUFtRCxTQUFTQyxjQUFULENBQXdCQyxJQUF4QixFQUE4QjtBQUMvRSxzQkFBSSxDQUFDckIscUJBQXFCcUIsSUFBckIsQ0FBTCxFQUFpQztBQUMvQlosNEJBQVFhLE1BQVIsQ0FBZTtBQUNiRCxnQ0FEYTtBQUViRSwrQkFBUyx3REFGSSxFQUFmOztBQUlEO0FBQ0YsaUJBUEQsT0FBNERILGNBQTVEO0FBUUQ7QUFDRixXQWxCRCxrQkFESyxFQUFQOztBQXFCRCxLQXRCRCxpQkFUZSxFQUFqQiIsImZpbGUiOiJleHBvcnRzLWxhc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuZnVuY3Rpb24gaXNOb25FeHBvcnRTdGF0ZW1lbnQoeyB0eXBlIH0pIHtcbiAgcmV0dXJuIHR5cGUgIT09ICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nICYmXG4gICAgdHlwZSAhPT0gJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nICYmXG4gICAgdHlwZSAhPT0gJ0V4cG9ydEFsbERlY2xhcmF0aW9uJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgdXJsOiBkb2NzVXJsKCdleHBvcnRzLWxhc3QnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIHJldHVybiB7XG4gICAgICBQcm9ncmFtOiBmdW5jdGlvbiAoeyBib2R5IH0pIHtcbiAgICAgICAgY29uc3QgbGFzdE5vbkV4cG9ydFN0YXRlbWVudEluZGV4ID0gYm9keS5yZWR1Y2UoZnVuY3Rpb24gZmluZExhc3RJbmRleChhY2MsIGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgaWYgKGlzTm9uRXhwb3J0U3RhdGVtZW50KGl0ZW0pKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIC0xKTtcblxuICAgICAgICBpZiAobGFzdE5vbkV4cG9ydFN0YXRlbWVudEluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIGJvZHkuc2xpY2UoMCwgbGFzdE5vbkV4cG9ydFN0YXRlbWVudEluZGV4KS5mb3JFYWNoKGZ1bmN0aW9uIGNoZWNrTm9uRXhwb3J0KG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghaXNOb25FeHBvcnRTdGF0ZW1lbnQobm9kZSkpIHtcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ0V4cG9ydCBzdGF0ZW1lbnRzIHNob3VsZCBhcHBlYXIgYXQgdGhlIGVuZCBvZiB0aGUgZmlsZScsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19