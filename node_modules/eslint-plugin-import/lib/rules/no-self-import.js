'use strict';




var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function isImportingSelf(context, node, requireName) {
  var filePath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();

  // If the input is from stdin, this test can't fail
  if (filePath !== '<text>' && filePath === (0, _resolve2['default'])(requireName, context)) {
    context.report({
      node: node,
      message: 'Module imports itself.' });

  }
} /**
   * @fileOverview Forbids a module from importing itself
   * @author Gio d'Amelio
   */module.exports = { meta: {
    type: 'problem',
    docs: {
      description: 'Forbid a module from importing itself',
      recommended: true,
      url: (0, _docsUrl2['default'])('no-self-import') },


    schema: [] },

  create: function () {function create(context) {
      return (0, _moduleVisitor2['default'])(function (source, node) {
        isImportingSelf(context, node, source.value);
      }, { commonjs: true });
    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1zZWxmLWltcG9ydC5qcyJdLCJuYW1lcyI6WyJpc0ltcG9ydGluZ1NlbGYiLCJjb250ZXh0Iiwibm9kZSIsInJlcXVpcmVOYW1lIiwiZmlsZVBhdGgiLCJnZXRQaHlzaWNhbEZpbGVuYW1lIiwiZ2V0RmlsZW5hbWUiLCJyZXBvcnQiLCJtZXNzYWdlIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImRlc2NyaXB0aW9uIiwicmVjb21tZW5kZWQiLCJ1cmwiLCJzY2hlbWEiLCJjcmVhdGUiLCJzb3VyY2UiLCJ2YWx1ZSIsImNvbW1vbmpzIl0sIm1hcHBpbmdzIjoiOzs7OztBQUtBLHNEO0FBQ0Esa0U7QUFDQSxxQzs7QUFFQSxTQUFTQSxlQUFULENBQXlCQyxPQUF6QixFQUFrQ0MsSUFBbEMsRUFBd0NDLFdBQXhDLEVBQXFEO0FBQ25ELE1BQU1DLFdBQVdILFFBQVFJLG1CQUFSLEdBQThCSixRQUFRSSxtQkFBUixFQUE5QixHQUE4REosUUFBUUssV0FBUixFQUEvRTs7QUFFQTtBQUNBLE1BQUlGLGFBQWEsUUFBYixJQUF5QkEsYUFBYSwwQkFBUUQsV0FBUixFQUFxQkYsT0FBckIsQ0FBMUMsRUFBeUU7QUFDdkVBLFlBQVFNLE1BQVIsQ0FBZTtBQUNiTCxnQkFEYTtBQUViTSxlQUFTLHdCQUZJLEVBQWY7O0FBSUQ7QUFDRixDLENBbkJEOzs7S0FxQkFDLE9BQU9DLE9BQVAsR0FBaUIsRUFDZkMsTUFBTTtBQUNKQyxVQUFNLFNBREY7QUFFSkMsVUFBTTtBQUNKQyxtQkFBYSx1Q0FEVDtBQUVKQyxtQkFBYSxJQUZUO0FBR0pDLFdBQUssMEJBQVEsZ0JBQVIsQ0FIRCxFQUZGOzs7QUFRSkMsWUFBUSxFQVJKLEVBRFM7O0FBV2ZDLHVCQUFRLGdCQUFVakIsT0FBVixFQUFtQjtBQUN6QixhQUFPLGdDQUFjLFVBQUNrQixNQUFELEVBQVNqQixJQUFULEVBQWtCO0FBQ3JDRix3QkFBZ0JDLE9BQWhCLEVBQXlCQyxJQUF6QixFQUErQmlCLE9BQU9DLEtBQXRDO0FBQ0QsT0FGTSxFQUVKLEVBQUVDLFVBQVUsSUFBWixFQUZJLENBQVA7QUFHRCxLQUpELGlCQVhlLEVBQWpCIiwiZmlsZSI6Im5vLXNlbGYtaW1wb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IEZvcmJpZHMgYSBtb2R1bGUgZnJvbSBpbXBvcnRpbmcgaXRzZWxmXG4gKiBAYXV0aG9yIEdpbyBkJ0FtZWxpb1xuICovXG5cbmltcG9ydCByZXNvbHZlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcmVzb2x2ZSc7XG5pbXBvcnQgbW9kdWxlVmlzaXRvciBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL21vZHVsZVZpc2l0b3InO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbmZ1bmN0aW9uIGlzSW1wb3J0aW5nU2VsZihjb250ZXh0LCBub2RlLCByZXF1aXJlTmFtZSkge1xuICBjb25zdCBmaWxlUGF0aCA9IGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSA/IGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSgpIDogY29udGV4dC5nZXRGaWxlbmFtZSgpO1xuXG4gIC8vIElmIHRoZSBpbnB1dCBpcyBmcm9tIHN0ZGluLCB0aGlzIHRlc3QgY2FuJ3QgZmFpbFxuICBpZiAoZmlsZVBhdGggIT09ICc8dGV4dD4nICYmIGZpbGVQYXRoID09PSByZXNvbHZlKHJlcXVpcmVOYW1lLCBjb250ZXh0KSkge1xuICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgIG5vZGUsXG4gICAgICBtZXNzYWdlOiAnTW9kdWxlIGltcG9ydHMgaXRzZWxmLicsXG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAncHJvYmxlbScsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgYSBtb2R1bGUgZnJvbSBpbXBvcnRpbmcgaXRzZWxmJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby1zZWxmLWltcG9ydCcpLFxuICAgIH0sXG5cbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuICBjcmVhdGU6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgcmV0dXJuIG1vZHVsZVZpc2l0b3IoKHNvdXJjZSwgbm9kZSkgPT4ge1xuICAgICAgaXNJbXBvcnRpbmdTZWxmKGNvbnRleHQsIG5vZGUsIHNvdXJjZS52YWx1ZSk7XG4gICAgfSwgeyBjb21tb25qczogdHJ1ZSB9KTtcbiAgfSxcbn07XG4iXX0=