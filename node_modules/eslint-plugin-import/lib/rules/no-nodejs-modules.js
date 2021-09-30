'use strict';var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function reportIfMissing(context, node, allowed, name) {
  if (allowed.indexOf(name) === -1 && (0, _importType2['default'])(name, context) === 'builtin') {
    context.report(node, 'Do not import Node.js builtin module "' + name + '"');
  }
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('no-nodejs-modules') },

    schema: [
    {
      type: 'object',
      properties: {
        allow: {
          type: 'array',
          uniqueItems: true,
          items: {
            type: 'string' } } },



      additionalProperties: false }] },




  create: function () {function create(context) {
      var options = context.options[0] || {};
      var allowed = options.allow || [];

      return (0, _moduleVisitor2['default'])(function (source, node) {
        reportIfMissing(context, node, allowed, source.value);
      }, { commonjs: true });
    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1ub2RlanMtbW9kdWxlcy5qcyJdLCJuYW1lcyI6WyJyZXBvcnRJZk1pc3NpbmciLCJjb250ZXh0Iiwibm9kZSIsImFsbG93ZWQiLCJuYW1lIiwiaW5kZXhPZiIsInJlcG9ydCIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJ1cmwiLCJzY2hlbWEiLCJwcm9wZXJ0aWVzIiwiYWxsb3ciLCJ1bmlxdWVJdGVtcyIsIml0ZW1zIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJjcmVhdGUiLCJvcHRpb25zIiwic291cmNlIiwidmFsdWUiLCJjb21tb25qcyJdLCJtYXBwaW5ncyI6ImFBQUEsZ0Q7QUFDQSxrRTtBQUNBLHFDOztBQUVBLFNBQVNBLGVBQVQsQ0FBeUJDLE9BQXpCLEVBQWtDQyxJQUFsQyxFQUF3Q0MsT0FBeEMsRUFBaURDLElBQWpELEVBQXVEO0FBQ3JELE1BQUlELFFBQVFFLE9BQVIsQ0FBZ0JELElBQWhCLE1BQTBCLENBQUMsQ0FBM0IsSUFBZ0MsNkJBQVdBLElBQVgsRUFBaUJILE9BQWpCLE1BQThCLFNBQWxFLEVBQTZFO0FBQzNFQSxZQUFRSyxNQUFSLENBQWVKLElBQWYsRUFBcUIsMkNBQTJDRSxJQUEzQyxHQUFrRCxHQUF2RTtBQUNEO0FBQ0Y7O0FBRURHLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKQyxVQUFNLFlBREY7QUFFSkMsVUFBTTtBQUNKQyxXQUFLLDBCQUFRLG1CQUFSLENBREQsRUFGRjs7QUFLSkMsWUFBUTtBQUNOO0FBQ0VILFlBQU0sUUFEUjtBQUVFSSxrQkFBWTtBQUNWQyxlQUFPO0FBQ0xMLGdCQUFNLE9BREQ7QUFFTE0sdUJBQWEsSUFGUjtBQUdMQyxpQkFBTztBQUNMUCxrQkFBTSxRQURELEVBSEYsRUFERyxFQUZkOzs7O0FBV0VRLDRCQUFzQixLQVh4QixFQURNLENBTEosRUFEUzs7Ozs7QUF1QmZDLHVCQUFRLGdCQUFVbEIsT0FBVixFQUFtQjtBQUN6QixVQUFNbUIsVUFBVW5CLFFBQVFtQixPQUFSLENBQWdCLENBQWhCLEtBQXNCLEVBQXRDO0FBQ0EsVUFBTWpCLFVBQVVpQixRQUFRTCxLQUFSLElBQWlCLEVBQWpDOztBQUVBLGFBQU8sZ0NBQWMsVUFBQ00sTUFBRCxFQUFTbkIsSUFBVCxFQUFrQjtBQUNyQ0Ysd0JBQWdCQyxPQUFoQixFQUF5QkMsSUFBekIsRUFBK0JDLE9BQS9CLEVBQXdDa0IsT0FBT0MsS0FBL0M7QUFDRCxPQUZNLEVBRUosRUFBRUMsVUFBVSxJQUFaLEVBRkksQ0FBUDtBQUdELEtBUEQsaUJBdkJlLEVBQWpCIiwiZmlsZSI6Im5vLW5vZGVqcy1tb2R1bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGltcG9ydFR5cGUgZnJvbSAnLi4vY29yZS9pbXBvcnRUeXBlJztcbmltcG9ydCBtb2R1bGVWaXNpdG9yIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvbW9kdWxlVmlzaXRvcic7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuZnVuY3Rpb24gcmVwb3J0SWZNaXNzaW5nKGNvbnRleHQsIG5vZGUsIGFsbG93ZWQsIG5hbWUpIHtcbiAgaWYgKGFsbG93ZWQuaW5kZXhPZihuYW1lKSA9PT0gLTEgJiYgaW1wb3J0VHlwZShuYW1lLCBjb250ZXh0KSA9PT0gJ2J1aWx0aW4nKSB7XG4gICAgY29udGV4dC5yZXBvcnQobm9kZSwgJ0RvIG5vdCBpbXBvcnQgTm9kZS5qcyBidWlsdGluIG1vZHVsZSBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgdXJsOiBkb2NzVXJsKCduby1ub2RlanMtbW9kdWxlcycpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICB1bmlxdWVJdGVtczogdHJ1ZSxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG4gICAgY29uc3QgYWxsb3dlZCA9IG9wdGlvbnMuYWxsb3cgfHwgW107XG5cbiAgICByZXR1cm4gbW9kdWxlVmlzaXRvcigoc291cmNlLCBub2RlKSA9PiB7XG4gICAgICByZXBvcnRJZk1pc3NpbmcoY29udGV4dCwgbm9kZSwgYWxsb3dlZCwgc291cmNlLnZhbHVlKTtcbiAgICB9LCB7IGNvbW1vbmpzOiB0cnVlIH0pO1xuICB9LFxufTtcbiJdfQ==