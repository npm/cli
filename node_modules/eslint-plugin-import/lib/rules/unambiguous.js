'use strict';




var _unambiguous = require('eslint-module-utils/unambiguous');
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };} /**
                                                                                                                                                                                       * @fileOverview Report modules that could parse incorrectly as scripts.
                                                                                                                                                                                       * @author Ben Mosher
                                                                                                                                                                                       */module.exports = { meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('unambiguous') },

    schema: [] },


  create: function () {function create(context) {
      // ignore non-modules
      if (context.parserOptions.sourceType !== 'module') {
        return {};
      }

      return {
        Program: function () {function Program(ast) {
            if (!(0, _unambiguous.isModule)(ast)) {
              context.report({
                node: ast,
                message: 'This module could be parsed as a valid script.' });

            }
          }return Program;}() };


    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy91bmFtYmlndW91cy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsInR5cGUiLCJkb2NzIiwidXJsIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsInBhcnNlck9wdGlvbnMiLCJzb3VyY2VUeXBlIiwiUHJvZ3JhbSIsImFzdCIsInJlcG9ydCIsIm5vZGUiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUtBO0FBQ0EscUMsaUpBTkE7Ozt5TEFRQUEsT0FBT0MsT0FBUCxHQUFpQixFQUNmQyxNQUFNO0FBQ0pDLFVBQU0sWUFERjtBQUVKQyxVQUFNO0FBQ0pDLFdBQUssMEJBQVEsYUFBUixDQURELEVBRkY7O0FBS0pDLFlBQVEsRUFMSixFQURTOzs7QUFTZkMsdUJBQVEsZ0JBQVVDLE9BQVYsRUFBbUI7QUFDekI7QUFDQSxVQUFJQSxRQUFRQyxhQUFSLENBQXNCQyxVQUF0QixLQUFxQyxRQUF6QyxFQUFtRDtBQUNqRCxlQUFPLEVBQVA7QUFDRDs7QUFFRCxhQUFPO0FBQ0xDLDhCQUFTLGlCQUFVQyxHQUFWLEVBQWU7QUFDdEIsZ0JBQUksQ0FBQywyQkFBU0EsR0FBVCxDQUFMLEVBQW9CO0FBQ2xCSixzQkFBUUssTUFBUixDQUFlO0FBQ2JDLHNCQUFNRixHQURPO0FBRWJHLHlCQUFTLGdEQUZJLEVBQWY7O0FBSUQ7QUFDRixXQVBELGtCQURLLEVBQVA7OztBQVdELEtBakJELGlCQVRlLEVBQWpCIiwiZmlsZSI6InVuYW1iaWd1b3VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IFJlcG9ydCBtb2R1bGVzIHRoYXQgY291bGQgcGFyc2UgaW5jb3JyZWN0bHkgYXMgc2NyaXB0cy5cbiAqIEBhdXRob3IgQmVuIE1vc2hlclxuICovXG5cbmltcG9ydCB7IGlzTW9kdWxlIH0gZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy91bmFtYmlndW91cyc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgdXJsOiBkb2NzVXJsKCd1bmFtYmlndW91cycpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgLy8gaWdub3JlIG5vbi1tb2R1bGVzXG4gICAgaWYgKGNvbnRleHQucGFyc2VyT3B0aW9ucy5zb3VyY2VUeXBlICE9PSAnbW9kdWxlJykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBQcm9ncmFtOiBmdW5jdGlvbiAoYXN0KSB7XG4gICAgICAgIGlmICghaXNNb2R1bGUoYXN0KSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGU6IGFzdCxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdUaGlzIG1vZHVsZSBjb3VsZCBiZSBwYXJzZWQgYXMgYSB2YWxpZCBzY3JpcHQuJyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9O1xuXG4gIH0sXG59O1xuIl19