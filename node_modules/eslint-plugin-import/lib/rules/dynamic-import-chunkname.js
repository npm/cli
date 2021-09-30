'use strict';var _vm = require('vm');var _vm2 = _interopRequireDefault(_vm);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('dynamic-import-chunkname') },

    schema: [{
      type: 'object',
      properties: {
        importFunctions: {
          type: 'array',
          uniqueItems: true,
          items: {
            type: 'string' } },


        webpackChunknameFormat: {
          type: 'string' } } }] },





  create: function () {function create(context) {
      var config = context.options[0];var _ref =
      config || {},_ref$importFunctions = _ref.importFunctions,importFunctions = _ref$importFunctions === undefined ? [] : _ref$importFunctions;var _ref2 =
      config || {},_ref2$webpackChunknam = _ref2.webpackChunknameFormat,webpackChunknameFormat = _ref2$webpackChunknam === undefined ? '[0-9a-zA-Z-_/.]+' : _ref2$webpackChunknam;

      var paddedCommentRegex = /^ (\S[\s\S]+\S) $/;
      var commentStyleRegex = /^( \w+: (["'][^"']*["']|\d+|false|true),?)+ $/;
      var chunkSubstrFormat = ' webpackChunkName: ["\']' + String(webpackChunknameFormat) + '["\'],? ';
      var chunkSubstrRegex = new RegExp(chunkSubstrFormat);

      function run(node, arg) {
        var sourceCode = context.getSourceCode();
        var leadingComments = sourceCode.getCommentsBefore ?
        sourceCode.getCommentsBefore(arg) // This method is available in ESLint >= 4.
        : sourceCode.getComments(arg).leading; // This method is deprecated in ESLint 7.

        if (!leadingComments || leadingComments.length === 0) {
          context.report({
            node: node,
            message: 'dynamic imports require a leading comment with the webpack chunkname' });

          return;
        }

        var isChunknamePresent = false;var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

          for (var _iterator = leadingComments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var comment = _step.value;
            if (comment.type !== 'Block') {
              context.report({
                node: node,
                message: 'dynamic imports require a /* foo */ style comment, not a // foo comment' });

              return;
            }

            if (!paddedCommentRegex.test(comment.value)) {
              context.report({
                node: node,
                message: 'dynamic imports require a block comment padded with spaces - /* foo */' });

              return;
            }

            try {
              // just like webpack itself does
              _vm2['default'].runInNewContext('(function() {return {' + String(comment.value) + '}})()');
            }
            catch (error) {
              context.report({
                node: node,
                message: 'dynamic imports require a "webpack" comment with valid syntax' });

              return;
            }

            if (!commentStyleRegex.test(comment.value)) {
              context.report({
                node: node,
                message: 'dynamic imports require a leading comment in the form /*' +
                chunkSubstrFormat + '*/' });

              return;
            }

            if (chunkSubstrRegex.test(comment.value)) {
              isChunknamePresent = true;
            }
          }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}

        if (!isChunknamePresent) {
          context.report({
            node: node,
            message: 'dynamic imports require a leading comment in the form /*' +
            chunkSubstrFormat + '*/' });

        }
      }

      return {
        ImportExpression: function () {function ImportExpression(node) {
            run(node, node.source);
          }return ImportExpression;}(),

        CallExpression: function () {function CallExpression(node) {
            if (node.callee.type !== 'Import' && importFunctions.indexOf(node.callee.name) < 0) {
              return;
            }

            run(node, node.arguments[0]);
          }return CallExpression;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9keW5hbWljLWltcG9ydC1jaHVua25hbWUuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsInVybCIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJpbXBvcnRGdW5jdGlvbnMiLCJ1bmlxdWVJdGVtcyIsIml0ZW1zIiwid2VicGFja0NodW5rbmFtZUZvcm1hdCIsImNyZWF0ZSIsImNvbnRleHQiLCJjb25maWciLCJvcHRpb25zIiwicGFkZGVkQ29tbWVudFJlZ2V4IiwiY29tbWVudFN0eWxlUmVnZXgiLCJjaHVua1N1YnN0ckZvcm1hdCIsImNodW5rU3Vic3RyUmVnZXgiLCJSZWdFeHAiLCJydW4iLCJub2RlIiwiYXJnIiwic291cmNlQ29kZSIsImdldFNvdXJjZUNvZGUiLCJsZWFkaW5nQ29tbWVudHMiLCJnZXRDb21tZW50c0JlZm9yZSIsImdldENvbW1lbnRzIiwibGVhZGluZyIsImxlbmd0aCIsInJlcG9ydCIsIm1lc3NhZ2UiLCJpc0NodW5rbmFtZVByZXNlbnQiLCJjb21tZW50IiwidGVzdCIsInZhbHVlIiwidm0iLCJydW5Jbk5ld0NvbnRleHQiLCJlcnJvciIsIkltcG9ydEV4cHJlc3Npb24iLCJzb3VyY2UiLCJDYWxsRXhwcmVzc2lvbiIsImNhbGxlZSIsImluZGV4T2YiLCJuYW1lIiwiYXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiYUFBQSx3QjtBQUNBLHFDOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxZQURGO0FBRUpDLFVBQU07QUFDSkMsV0FBSywwQkFBUSwwQkFBUixDQURELEVBRkY7O0FBS0pDLFlBQVEsQ0FBQztBQUNQSCxZQUFNLFFBREM7QUFFUEksa0JBQVk7QUFDVkMseUJBQWlCO0FBQ2ZMLGdCQUFNLE9BRFM7QUFFZk0sdUJBQWEsSUFGRTtBQUdmQyxpQkFBTztBQUNMUCxrQkFBTSxRQURELEVBSFEsRUFEUDs7O0FBUVZR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Q0Q7O0FBRUR4QixnQkFBSUMsSUFBSixFQUFVQSxLQUFLd0IsU0FBTCxDQUFlLENBQWYsQ0FBVjtBQUNELFdBWEksMkJBQVA7O0FBYUQsS0EzRkQsaUJBdkJlLEVBQWpCIiwiZmlsZSI6ImR5bmFtaWMtaW1wb3J0LWNodW5rbmFtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB2bSBmcm9tICd2bSc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgdXJsOiBkb2NzVXJsKCdkeW5hbWljLWltcG9ydC1jaHVua25hbWUnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW3tcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBpbXBvcnRGdW5jdGlvbnM6IHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIHVuaXF1ZUl0ZW1zOiB0cnVlLFxuICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB3ZWJwYWNrQ2h1bmtuYW1lRm9ybWF0OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH1dLFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICBjb25zdCBjb25maWcgPSBjb250ZXh0Lm9wdGlvbnNbMF07XG4gICAgY29uc3QgeyBpbXBvcnRGdW5jdGlvbnMgPSBbXSB9ID0gY29uZmlnIHx8IHt9O1xuICAgIGNvbnN0IHsgd2VicGFja0NodW5rbmFtZUZvcm1hdCA9ICdbMC05YS16QS1aLV8vLl0rJyB9ID0gY29uZmlnIHx8IHt9O1xuXG4gICAgY29uc3QgcGFkZGVkQ29tbWVudFJlZ2V4ID0gL14gKFxcU1tcXHNcXFNdK1xcUykgJC87XG4gICAgY29uc3QgY29tbWVudFN0eWxlUmVnZXggPSAvXiggXFx3KzogKFtcIiddW15cIiddKltcIiddfFxcZCt8ZmFsc2V8dHJ1ZSksPykrICQvO1xuICAgIGNvbnN0IGNodW5rU3Vic3RyRm9ybWF0ID0gYCB3ZWJwYWNrQ2h1bmtOYW1lOiBbXCInXSR7d2VicGFja0NodW5rbmFtZUZvcm1hdH1bXCInXSw/IGA7XG4gICAgY29uc3QgY2h1bmtTdWJzdHJSZWdleCA9IG5ldyBSZWdFeHAoY2h1bmtTdWJzdHJGb3JtYXQpO1xuXG4gICAgZnVuY3Rpb24gcnVuKG5vZGUsIGFyZykge1xuICAgICAgY29uc3Qgc291cmNlQ29kZSA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpO1xuICAgICAgY29uc3QgbGVhZGluZ0NvbW1lbnRzID0gc291cmNlQ29kZS5nZXRDb21tZW50c0JlZm9yZVxuICAgICAgICA/IHNvdXJjZUNvZGUuZ2V0Q29tbWVudHNCZWZvcmUoYXJnKSAvLyBUaGlzIG1ldGhvZCBpcyBhdmFpbGFibGUgaW4gRVNMaW50ID49IDQuXG4gICAgICAgIDogc291cmNlQ29kZS5nZXRDb21tZW50cyhhcmcpLmxlYWRpbmc7IC8vIFRoaXMgbWV0aG9kIGlzIGRlcHJlY2F0ZWQgaW4gRVNMaW50IDcuXG5cbiAgICAgIGlmICghbGVhZGluZ0NvbW1lbnRzIHx8IGxlYWRpbmdDb21tZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgbWVzc2FnZTogJ2R5bmFtaWMgaW1wb3J0cyByZXF1aXJlIGEgbGVhZGluZyBjb21tZW50IHdpdGggdGhlIHdlYnBhY2sgY2h1bmtuYW1lJyxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGlzQ2h1bmtuYW1lUHJlc2VudCA9IGZhbHNlO1xuXG4gICAgICBmb3IgKGNvbnN0IGNvbW1lbnQgb2YgbGVhZGluZ0NvbW1lbnRzKSB7XG4gICAgICAgIGlmIChjb21tZW50LnR5cGUgIT09ICdCbG9jaycpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZTogJ2R5bmFtaWMgaW1wb3J0cyByZXF1aXJlIGEgLyogZm9vICovIHN0eWxlIGNvbW1lbnQsIG5vdCBhIC8vIGZvbyBjb21tZW50JyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXBhZGRlZENvbW1lbnRSZWdleC50ZXN0KGNvbW1lbnQudmFsdWUpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBkeW5hbWljIGltcG9ydHMgcmVxdWlyZSBhIGJsb2NrIGNvbW1lbnQgcGFkZGVkIHdpdGggc3BhY2VzIC0gLyogZm9vICovYCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIGp1c3QgbGlrZSB3ZWJwYWNrIGl0c2VsZiBkb2VzXG4gICAgICAgICAgdm0ucnVuSW5OZXdDb250ZXh0KGAoZnVuY3Rpb24oKSB7cmV0dXJuIHske2NvbW1lbnQudmFsdWV9fX0pKClgKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZTogYGR5bmFtaWMgaW1wb3J0cyByZXF1aXJlIGEgXCJ3ZWJwYWNrXCIgY29tbWVudCB3aXRoIHZhbGlkIHN5bnRheGAsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb21tZW50U3R5bGVSZWdleC50ZXN0KGNvbW1lbnQudmFsdWUpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgICAgIGBkeW5hbWljIGltcG9ydHMgcmVxdWlyZSBhIGxlYWRpbmcgY29tbWVudCBpbiB0aGUgZm9ybSAvKiR7Y2h1bmtTdWJzdHJGb3JtYXR9Ki9gLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaHVua1N1YnN0clJlZ2V4LnRlc3QoY29tbWVudC52YWx1ZSkpIHtcbiAgICAgICAgICBpc0NodW5rbmFtZVByZXNlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNDaHVua25hbWVQcmVzZW50KSB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgICBgZHluYW1pYyBpbXBvcnRzIHJlcXVpcmUgYSBsZWFkaW5nIGNvbW1lbnQgaW4gdGhlIGZvcm0gLyoke2NodW5rU3Vic3RyRm9ybWF0fSovYCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICBydW4obm9kZSwgbm9kZS5zb3VyY2UpO1xuICAgICAgfSxcblxuICAgICAgQ2FsbEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICBpZiAobm9kZS5jYWxsZWUudHlwZSAhPT0gJ0ltcG9ydCcgJiYgaW1wb3J0RnVuY3Rpb25zLmluZGV4T2Yobm9kZS5jYWxsZWUubmFtZSkgPCAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcnVuKG5vZGUsIG5vZGUuYXJndW1lbnRzWzBdKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=