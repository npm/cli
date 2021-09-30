'use strict';

var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('prefer-default-export') },

    schema: [] },


  create: function () {function create(context) {
      var specifierExportCount = 0;
      var hasDefaultExport = false;
      var hasStarExport = false;
      var hasTypeExport = false;
      var namedExportNode = null;

      function captureDeclaration(identifierOrPattern) {
        if (identifierOrPattern && identifierOrPattern.type === 'ObjectPattern') {
          // recursively capture
          identifierOrPattern.properties.
          forEach(function (property) {
            captureDeclaration(property.value);
          });
        } else if (identifierOrPattern && identifierOrPattern.type === 'ArrayPattern') {
          identifierOrPattern.elements.
          forEach(captureDeclaration);
        } else {
          // assume it's a single standard identifier
          specifierExportCount++;
        }
      }

      return {
        'ExportDefaultSpecifier': function () {function ExportDefaultSpecifier() {
            hasDefaultExport = true;
          }return ExportDefaultSpecifier;}(),

        'ExportSpecifier': function () {function ExportSpecifier(node) {
            if (node.exported.name === 'default') {
              hasDefaultExport = true;
            } else {
              specifierExportCount++;
              namedExportNode = node;
            }
          }return ExportSpecifier;}(),

        'ExportNamedDeclaration': function () {function ExportNamedDeclaration(node) {
            // if there are specifiers, node.declaration should be null
            if (!node.declaration) return;var

            type = node.declaration.type;

            if (
            type === 'TSTypeAliasDeclaration' ||
            type === 'TypeAlias' ||
            type === 'TSInterfaceDeclaration' ||
            type === 'InterfaceDeclaration')
            {
              specifierExportCount++;
              hasTypeExport = true;
              return;
            }

            if (node.declaration.declarations) {
              node.declaration.declarations.forEach(function (declaration) {
                captureDeclaration(declaration.id);
              });
            } else {
              // captures 'export function foo() {}' syntax
              specifierExportCount++;
            }

            namedExportNode = node;
          }return ExportNamedDeclaration;}(),

        'ExportDefaultDeclaration': function () {function ExportDefaultDeclaration() {
            hasDefaultExport = true;
          }return ExportDefaultDeclaration;}(),

        'ExportAllDeclaration': function () {function ExportAllDeclaration() {
            hasStarExport = true;
          }return ExportAllDeclaration;}(),

        'Program:exit': function () {function ProgramExit() {
            if (specifierExportCount === 1 && !hasDefaultExport && !hasStarExport && !hasTypeExport) {
              context.report(namedExportNode, 'Prefer default export.');
            }
          }return ProgramExit;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9wcmVmZXItZGVmYXVsdC1leHBvcnQuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsInVybCIsInNjaGVtYSIsImNyZWF0ZSIsImNvbnRleHQiLCJzcGVjaWZpZXJFeHBvcnRDb3VudCIsImhhc0RlZmF1bHRFeHBvcnQiLCJoYXNTdGFyRXhwb3J0IiwiaGFzVHlwZUV4cG9ydCIsIm5hbWVkRXhwb3J0Tm9kZSIsImNhcHR1cmVEZWNsYXJhdGlvbiIsImlkZW50aWZpZXJPclBhdHRlcm4iLCJwcm9wZXJ0aWVzIiwiZm9yRWFjaCIsInByb3BlcnR5IiwidmFsdWUiLCJlbGVtZW50cyIsIm5vZGUiLCJleHBvcnRlZCIsIm5hbWUiLCJkZWNsYXJhdGlvbiIsImRlY2xhcmF0aW9ucyIsImlkIiwicmVwb3J0Il0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxxQzs7QUFFQUEsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sWUFERjtBQUVKQyxVQUFNO0FBQ0pDLFdBQUssMEJBQVEsdUJBQVIsQ0FERCxFQUZGOztBQUtKQyxZQUFRLEVBTEosRUFEUzs7O0FBU2ZDLHVCQUFRLGdCQUFTQyxPQUFULEVBQWtCO0FBQ3hCLFVBQUlDLHVCQUF1QixDQUEzQjtBQUNBLFVBQUlDLG1CQUFtQixLQUF2QjtBQUNBLFVBQUlDLGdCQUFnQixLQUFwQjtBQUNBLFVBQUlDLGdCQUFnQixLQUFwQjtBQUNBLFVBQUlDLGtCQUFrQixJQUF0Qjs7QUFFQSxlQUFTQyxrQkFBVCxDQUE0QkMsbUJBQTVCLEVBQWlEO0FBQy9DLFlBQUlBLHVCQUF1QkEsb0JBQW9CWixJQUFwQixLQUE2QixlQUF4RCxFQUF5RTtBQUN2RTtBQUNBWSw4QkFBb0JDLFVBQXBCO0FBQ0dDLGlCQURILENBQ1csVUFBU0MsUUFBVCxFQUFtQjtBQUMxQkosK0JBQW1CSSxTQUFTQyxLQUE1QjtBQUNELFdBSEg7QUFJRCxTQU5ELE1BTU8sSUFBSUosdUJBQXVCQSxvQkFBb0JaLElBQXBCLEtBQTZCLGNBQXhELEVBQXdFO0FBQzdFWSw4QkFBb0JLLFFBQXBCO0FBQ0dILGlCQURILENBQ1dILGtCQURYO0FBRUQsU0FITSxNQUdDO0FBQ1I7QUFDRUw7QUFDRDtBQUNGOztBQUVELGFBQU87QUFDTCwrQ0FBMEIsa0NBQVc7QUFDbkNDLCtCQUFtQixJQUFuQjtBQUNELFdBRkQsaUNBREs7O0FBS0wsd0NBQW1CLHlCQUFTVyxJQUFULEVBQWU7QUFDaEMsZ0JBQUlBLEtBQUtDLFFBQUwsQ0FBY0MsSUFBZCxLQUF1QixTQUEzQixFQUFzQztBQUNwQ2IsaUNBQW1CLElBQW5CO0FBQ0QsYUFGRCxNQUVPO0FBQ0xEO0FBQ0FJLGdDQUFrQlEsSUFBbEI7QUFDRDtBQUNGLFdBUEQsMEJBTEs7O0FBY0wsK0NBQTBCLGdDQUFTQSxJQUFULEVBQWU7QUFDdkM7QUFDQSxnQkFBSSxDQUFDQSxLQUFLRyxXQUFWLEVBQXVCLE9BRmdCOztBQUkvQnJCLGdCQUorQixHQUl0QmtCLEtBQUtHLFdBSmlCLENBSS9CckIsSUFKK0I7O0FBTXZDO0FBQ0VBLHFCQUFTLHdCQUFUO0FBQ0FBLHFCQUFTLFdBRFQ7QUFFQUEscUJBQVMsd0JBRlQ7QUFHQUEscUJBQVMsc0JBSlg7QUFLRTtBQUNBTTtBQUNBRyw4QkFBZ0IsSUFBaEI7QUFDQTtBQUNEOztBQUVELGdCQUFJUyxLQUFLRyxXQUFMLENBQWlCQyxZQUFyQixFQUFtQztBQUNqQ0osbUJBQUtHLFdBQUwsQ0FBaUJDLFlBQWpCLENBQThCUixPQUE5QixDQUFzQyxVQUFTTyxXQUFULEVBQXNCO0FBQzFEVixtQ0FBbUJVLFlBQVlFLEVBQS9CO0FBQ0QsZUFGRDtBQUdELGFBSkQsTUFJTztBQUNMO0FBQ0FqQjtBQUNEOztBQUVESSw4QkFBa0JRLElBQWxCO0FBQ0QsV0EzQkQsaUNBZEs7O0FBMkNMLGlEQUE0QixvQ0FBVztBQUNyQ1gsK0JBQW1CLElBQW5CO0FBQ0QsV0FGRCxtQ0EzQ0s7O0FBK0NMLDZDQUF3QixnQ0FBVztBQUNqQ0MsNEJBQWdCLElBQWhCO0FBQ0QsV0FGRCwrQkEvQ0s7O0FBbURMLHFDQUFnQix1QkFBVztBQUN6QixnQkFBSUYseUJBQXlCLENBQXpCLElBQThCLENBQUNDLGdCQUEvQixJQUFtRCxDQUFDQyxhQUFwRCxJQUFxRSxDQUFDQyxhQUExRSxFQUF5RjtBQUN2Rkosc0JBQVFtQixNQUFSLENBQWVkLGVBQWYsRUFBZ0Msd0JBQWhDO0FBQ0Q7QUFDRixXQUpELHNCQW5ESyxFQUFQOztBQXlERCxLQWhGRCxpQkFUZSxFQUFqQiIsImZpbGUiOiJwcmVmZXItZGVmYXVsdC1leHBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICB1cmw6IGRvY3NVcmwoJ3ByZWZlci1kZWZhdWx0LWV4cG9ydCcpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICBsZXQgc3BlY2lmaWVyRXhwb3J0Q291bnQgPSAwO1xuICAgIGxldCBoYXNEZWZhdWx0RXhwb3J0ID0gZmFsc2U7XG4gICAgbGV0IGhhc1N0YXJFeHBvcnQgPSBmYWxzZTtcbiAgICBsZXQgaGFzVHlwZUV4cG9ydCA9IGZhbHNlO1xuICAgIGxldCBuYW1lZEV4cG9ydE5vZGUgPSBudWxsO1xuXG4gICAgZnVuY3Rpb24gY2FwdHVyZURlY2xhcmF0aW9uKGlkZW50aWZpZXJPclBhdHRlcm4pIHtcbiAgICAgIGlmIChpZGVudGlmaWVyT3JQYXR0ZXJuICYmIGlkZW50aWZpZXJPclBhdHRlcm4udHlwZSA9PT0gJ09iamVjdFBhdHRlcm4nKSB7XG4gICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGNhcHR1cmVcbiAgICAgICAgaWRlbnRpZmllck9yUGF0dGVybi5wcm9wZXJ0aWVzXG4gICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgICAgICAgIGNhcHR1cmVEZWNsYXJhdGlvbihwcm9wZXJ0eS52YWx1ZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGlkZW50aWZpZXJPclBhdHRlcm4gJiYgaWRlbnRpZmllck9yUGF0dGVybi50eXBlID09PSAnQXJyYXlQYXR0ZXJuJykge1xuICAgICAgICBpZGVudGlmaWVyT3JQYXR0ZXJuLmVsZW1lbnRzXG4gICAgICAgICAgLmZvckVhY2goY2FwdHVyZURlY2xhcmF0aW9uKTtcbiAgICAgIH0gZWxzZSAge1xuICAgICAgLy8gYXNzdW1lIGl0J3MgYSBzaW5nbGUgc3RhbmRhcmQgaWRlbnRpZmllclxuICAgICAgICBzcGVjaWZpZXJFeHBvcnRDb3VudCsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAnRXhwb3J0RGVmYXVsdFNwZWNpZmllcic6IGZ1bmN0aW9uKCkge1xuICAgICAgICBoYXNEZWZhdWx0RXhwb3J0ID0gdHJ1ZTtcbiAgICAgIH0sXG5cbiAgICAgICdFeHBvcnRTcGVjaWZpZXInOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIGlmIChub2RlLmV4cG9ydGVkLm5hbWUgPT09ICdkZWZhdWx0Jykge1xuICAgICAgICAgIGhhc0RlZmF1bHRFeHBvcnQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwZWNpZmllckV4cG9ydENvdW50Kys7XG4gICAgICAgICAgbmFtZWRFeHBvcnROb2RlID0gbm9kZTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBzcGVjaWZpZXJzLCBub2RlLmRlY2xhcmF0aW9uIHNob3VsZCBiZSBudWxsXG4gICAgICAgIGlmICghbm9kZS5kZWNsYXJhdGlvbikgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHsgdHlwZSB9ID0gbm9kZS5kZWNsYXJhdGlvbjtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgdHlwZSA9PT0gJ1RTVHlwZUFsaWFzRGVjbGFyYXRpb24nIHx8XG4gICAgICAgICAgdHlwZSA9PT0gJ1R5cGVBbGlhcycgfHxcbiAgICAgICAgICB0eXBlID09PSAnVFNJbnRlcmZhY2VEZWNsYXJhdGlvbicgfHxcbiAgICAgICAgICB0eXBlID09PSAnSW50ZXJmYWNlRGVjbGFyYXRpb24nXG4gICAgICAgICkge1xuICAgICAgICAgIHNwZWNpZmllckV4cG9ydENvdW50Kys7XG4gICAgICAgICAgaGFzVHlwZUV4cG9ydCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zKSB7XG4gICAgICAgICAgbm9kZS5kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihkZWNsYXJhdGlvbikge1xuICAgICAgICAgICAgY2FwdHVyZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9uLmlkKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBjYXB0dXJlcyAnZXhwb3J0IGZ1bmN0aW9uIGZvbygpIHt9JyBzeW50YXhcbiAgICAgICAgICBzcGVjaWZpZXJFeHBvcnRDb3VudCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgbmFtZWRFeHBvcnROb2RlID0gbm9kZTtcbiAgICAgIH0sXG5cbiAgICAgICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaGFzRGVmYXVsdEV4cG9ydCA9IHRydWU7XG4gICAgICB9LFxuXG4gICAgICAnRXhwb3J0QWxsRGVjbGFyYXRpb24nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaGFzU3RhckV4cG9ydCA9IHRydWU7XG4gICAgICB9LFxuXG4gICAgICAnUHJvZ3JhbTpleGl0JzogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChzcGVjaWZpZXJFeHBvcnRDb3VudCA9PT0gMSAmJiAhaGFzRGVmYXVsdEV4cG9ydCAmJiAhaGFzU3RhckV4cG9ydCAmJiAhaGFzVHlwZUV4cG9ydCkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5hbWVkRXhwb3J0Tm9kZSwgJ1ByZWZlciBkZWZhdWx0IGV4cG9ydC4nKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==