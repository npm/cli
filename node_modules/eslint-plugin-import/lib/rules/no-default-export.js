'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('no-default-export') },

    schema: [] },


  create: function () {function create(context) {
      // ignore non-modules
      if (context.parserOptions.sourceType !== 'module') {
        return {};
      }

      var preferNamed = 'Prefer named exports.';
      var noAliasDefault = function () {function noAliasDefault(_ref) {var local = _ref.local;return (
            'Do not alias `' + String(local.name) + '` as `default`. Just export ' + ('`' + String(
            local.name) + '` itself instead.'));}return noAliasDefault;}();

      return {
        ExportDefaultDeclaration: function () {function ExportDefaultDeclaration(node) {
            context.report({ node: node, message: preferNamed });
          }return ExportDefaultDeclaration;}(),

        ExportNamedDeclaration: function () {function ExportNamedDeclaration(node) {
            node.specifiers.forEach(function (specifier) {
              if (specifier.type === 'ExportDefaultSpecifier' &&
              specifier.exported.name === 'default') {
                context.report({ node: node, message: preferNamed });
              } else if (specifier.type === 'ExportSpecifier' &&
              specifier.exported.name === 'default') {
                context.report({ node: node, message: noAliasDefault(specifier) });
              }
            });
          }return ExportNamedDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1kZWZhdWx0LWV4cG9ydC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsInR5cGUiLCJkb2NzIiwidXJsIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsInBhcnNlck9wdGlvbnMiLCJzb3VyY2VUeXBlIiwicHJlZmVyTmFtZWQiLCJub0FsaWFzRGVmYXVsdCIsImxvY2FsIiwibmFtZSIsIkV4cG9ydERlZmF1bHREZWNsYXJhdGlvbiIsIm5vZGUiLCJyZXBvcnQiLCJtZXNzYWdlIiwiRXhwb3J0TmFtZWREZWNsYXJhdGlvbiIsInNwZWNpZmllcnMiLCJmb3JFYWNoIiwic3BlY2lmaWVyIiwiZXhwb3J0ZWQiXSwibWFwcGluZ3MiOiJhQUFBLHFDOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxZQURGO0FBRUpDLFVBQU07QUFDSkMsV0FBSywwQkFBUSxtQkFBUixDQURELEVBRkY7O0FBS0pDLFlBQVEsRUFMSixFQURTOzs7QUFTZkMsUUFUZSwrQkFTUkMsT0FUUSxFQVNDO0FBQ2Q7QUFDQSxVQUFJQSxRQUFRQyxhQUFSLENBQXNCQyxVQUF0QixLQUFxQyxRQUF6QyxFQUFtRDtBQUNqRCxlQUFPLEVBQVA7QUFDRDs7QUFFRCxVQUFNQyxjQUFjLHVCQUFwQjtBQUNBLFVBQU1DLDhCQUFpQixTQUFqQkEsY0FBaUIsWUFBR0MsS0FBSCxRQUFHQSxLQUFIO0FBQ3JCLHNDQUFrQkEsTUFBTUMsSUFBeEI7QUFDS0Qsa0JBQU1DLElBRFgsd0JBRHFCLEdBQWpCLHlCQUFOOztBQUlBLGFBQU87QUFDTEMsZ0NBREssaURBQ29CQyxJQURwQixFQUMwQjtBQUM3QlIsb0JBQVFTLE1BQVIsQ0FBZSxFQUFFRCxVQUFGLEVBQVFFLFNBQVNQLFdBQWpCLEVBQWY7QUFDRCxXQUhJOztBQUtMUSw4QkFMSywrQ0FLa0JILElBTGxCLEVBS3dCO0FBQzNCQSxpQkFBS0ksVUFBTCxDQUFnQkMsT0FBaEIsQ0FBd0IscUJBQWE7QUFDbkMsa0JBQUlDLFVBQVVuQixJQUFWLEtBQW1CLHdCQUFuQjtBQUNBbUIsd0JBQVVDLFFBQVYsQ0FBbUJULElBQW5CLEtBQTRCLFNBRGhDLEVBQzJDO0FBQ3pDTix3QkFBUVMsTUFBUixDQUFlLEVBQUVELFVBQUYsRUFBUUUsU0FBU1AsV0FBakIsRUFBZjtBQUNELGVBSEQsTUFHTyxJQUFJVyxVQUFVbkIsSUFBVixLQUFtQixpQkFBbkI7QUFDUG1CLHdCQUFVQyxRQUFWLENBQW1CVCxJQUFuQixLQUE0QixTQUR6QixFQUNvQztBQUN6Q04sd0JBQVFTLE1BQVIsQ0FBZSxFQUFFRCxVQUFGLEVBQVFFLFNBQVNOLGVBQWVVLFNBQWYsQ0FBakIsRUFBZjtBQUNEO0FBQ0YsYUFSRDtBQVNELFdBZkksbUNBQVA7O0FBaUJELEtBckNjLG1CQUFqQiIsImZpbGUiOiJuby1kZWZhdWx0LWV4cG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLWRlZmF1bHQtZXhwb3J0JyksXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgLy8gaWdub3JlIG5vbi1tb2R1bGVzXG4gICAgaWYgKGNvbnRleHQucGFyc2VyT3B0aW9ucy5zb3VyY2VUeXBlICE9PSAnbW9kdWxlJykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHByZWZlck5hbWVkID0gJ1ByZWZlciBuYW1lZCBleHBvcnRzLic7XG4gICAgY29uc3Qgbm9BbGlhc0RlZmF1bHQgPSAoeyBsb2NhbCB9KSA9PlxuICAgICAgYERvIG5vdCBhbGlhcyBcXGAke2xvY2FsLm5hbWV9XFxgIGFzIFxcYGRlZmF1bHRcXGAuIEp1c3QgZXhwb3J0IGAgK1xuICAgICAgYFxcYCR7bG9jYWwubmFtZX1cXGAgaXRzZWxmIGluc3RlYWQuYDtcblxuICAgIHJldHVybiB7XG4gICAgICBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBjb250ZXh0LnJlcG9ydCh7IG5vZGUsIG1lc3NhZ2U6IHByZWZlck5hbWVkIH0pO1xuICAgICAgfSxcblxuICAgICAgRXhwb3J0TmFtZWREZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIG5vZGUuc3BlY2lmaWVycy5mb3JFYWNoKHNwZWNpZmllciA9PiB7XG4gICAgICAgICAgaWYgKHNwZWNpZmllci50eXBlID09PSAnRXhwb3J0RGVmYXVsdFNwZWNpZmllcicgJiZcbiAgICAgICAgICAgICAgc3BlY2lmaWVyLmV4cG9ydGVkLm5hbWUgPT09ICdkZWZhdWx0Jykge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoeyBub2RlLCBtZXNzYWdlOiBwcmVmZXJOYW1lZCB9KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNwZWNpZmllci50eXBlID09PSAnRXhwb3J0U3BlY2lmaWVyJyAmJlxuICAgICAgICAgICAgICBzcGVjaWZpZXIuZXhwb3J0ZWQubmFtZSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7IG5vZGUsIG1lc3NhZ2U6IG5vQWxpYXNEZWZhdWx0KHNwZWNpZmllcikgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=