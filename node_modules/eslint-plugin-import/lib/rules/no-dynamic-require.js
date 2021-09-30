'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function isRequire(node) {
  return node &&
  node.callee &&
  node.callee.type === 'Identifier' &&
  node.callee.name === 'require' &&
  node.arguments.length >= 1;
}

function isDynamicImport(node) {
  return node &&
  node.callee &&
  node.callee.type === 'Import';
}

function isStaticValue(arg) {
  return arg.type === 'Literal' ||
  arg.type === 'TemplateLiteral' && arg.expressions.length === 0;
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('no-dynamic-require') },

    schema: [
    {
      type: 'object',
      properties: {
        esmodule: {
          type: 'boolean' } },


      additionalProperties: false }] },




  create: function () {function create(context) {
      var options = context.options[0] || {};

      return {
        CallExpression: function () {function CallExpression(node) {
            if (!node.arguments[0] || isStaticValue(node.arguments[0])) {
              return;
            }
            if (isRequire(node)) {
              return context.report({
                node: node,
                message: 'Calls to require() should use string literals' });

            }
            if (options.esmodule && isDynamicImport(node)) {
              return context.report({
                node: node,
                message: 'Calls to import() should use string literals' });

            }
          }return CallExpression;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1keW5hbWljLXJlcXVpcmUuanMiXSwibmFtZXMiOlsiaXNSZXF1aXJlIiwibm9kZSIsImNhbGxlZSIsInR5cGUiLCJuYW1lIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiaXNEeW5hbWljSW1wb3J0IiwiaXNTdGF0aWNWYWx1ZSIsImFyZyIsImV4cHJlc3Npb25zIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJkb2NzIiwidXJsIiwic2NoZW1hIiwicHJvcGVydGllcyIsImVzbW9kdWxlIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJjcmVhdGUiLCJjb250ZXh0Iiwib3B0aW9ucyIsIkNhbGxFeHByZXNzaW9uIiwicmVwb3J0IiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6ImFBQUEscUM7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsSUFBbkIsRUFBeUI7QUFDdkIsU0FBT0E7QUFDTEEsT0FBS0MsTUFEQTtBQUVMRCxPQUFLQyxNQUFMLENBQVlDLElBQVosS0FBcUIsWUFGaEI7QUFHTEYsT0FBS0MsTUFBTCxDQUFZRSxJQUFaLEtBQXFCLFNBSGhCO0FBSUxILE9BQUtJLFNBQUwsQ0FBZUMsTUFBZixJQUF5QixDQUozQjtBQUtEOztBQUVELFNBQVNDLGVBQVQsQ0FBeUJOLElBQXpCLEVBQStCO0FBQzdCLFNBQU9BO0FBQ0xBLE9BQUtDLE1BREE7QUFFTEQsT0FBS0MsTUFBTCxDQUFZQyxJQUFaLEtBQXFCLFFBRnZCO0FBR0Q7O0FBRUQsU0FBU0ssYUFBVCxDQUF1QkMsR0FBdkIsRUFBNEI7QUFDMUIsU0FBT0EsSUFBSU4sSUFBSixLQUFhLFNBQWI7QUFDSk0sTUFBSU4sSUFBSixLQUFhLGlCQUFiLElBQWtDTSxJQUFJQyxXQUFKLENBQWdCSixNQUFoQixLQUEyQixDQURoRTtBQUVEOztBQUVESyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSlYsVUFBTSxZQURGO0FBRUpXLFVBQU07QUFDSkMsV0FBSywwQkFBUSxvQkFBUixDQURELEVBRkY7O0FBS0pDLFlBQVE7QUFDTjtBQUNFYixZQUFNLFFBRFI7QUFFRWMsa0JBQVk7QUFDVkMsa0JBQVU7QUFDUmYsZ0JBQU0sU0FERSxFQURBLEVBRmQ7OztBQU9FZ0IsNEJBQXNCLEtBUHhCLEVBRE0sQ0FMSixFQURTOzs7OztBQW1CZkMsdUJBQVEsZ0JBQVVDLE9BQVYsRUFBbUI7QUFDekIsVUFBTUMsVUFBVUQsUUFBUUMsT0FBUixDQUFnQixDQUFoQixLQUFzQixFQUF0Qzs7QUFFQSxhQUFPO0FBQ0xDLHNCQURLLHVDQUNVdEIsSUFEVixFQUNnQjtBQUNuQixnQkFBSSxDQUFDQSxLQUFLSSxTQUFMLENBQWUsQ0FBZixDQUFELElBQXNCRyxjQUFjUCxLQUFLSSxTQUFMLENBQWUsQ0FBZixDQUFkLENBQTFCLEVBQTREO0FBQzFEO0FBQ0Q7QUFDRCxnQkFBSUwsVUFBVUMsSUFBVixDQUFKLEVBQXFCO0FBQ25CLHFCQUFPb0IsUUFBUUcsTUFBUixDQUFlO0FBQ3BCdkIsMEJBRG9CO0FBRXBCd0IseUJBQVMsK0NBRlcsRUFBZixDQUFQOztBQUlEO0FBQ0QsZ0JBQUlILFFBQVFKLFFBQVIsSUFBb0JYLGdCQUFnQk4sSUFBaEIsQ0FBeEIsRUFBK0M7QUFDN0MscUJBQU9vQixRQUFRRyxNQUFSLENBQWU7QUFDcEJ2QiwwQkFEb0I7QUFFcEJ3Qix5QkFBUyw4Q0FGVyxFQUFmLENBQVA7O0FBSUQ7QUFDRixXQWpCSSwyQkFBUDs7QUFtQkQsS0F0QkQsaUJBbkJlLEVBQWpCIiwiZmlsZSI6Im5vLWR5bmFtaWMtcmVxdWlyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5mdW5jdGlvbiBpc1JlcXVpcmUobm9kZSkge1xuICByZXR1cm4gbm9kZSAmJlxuICAgIG5vZGUuY2FsbGVlICYmXG4gICAgbm9kZS5jYWxsZWUudHlwZSA9PT0gJ0lkZW50aWZpZXInICYmXG4gICAgbm9kZS5jYWxsZWUubmFtZSA9PT0gJ3JlcXVpcmUnICYmXG4gICAgbm9kZS5hcmd1bWVudHMubGVuZ3RoID49IDE7XG59XG5cbmZ1bmN0aW9uIGlzRHluYW1pY0ltcG9ydChub2RlKSB7XG4gIHJldHVybiBub2RlICYmXG4gICAgbm9kZS5jYWxsZWUgJiZcbiAgICBub2RlLmNhbGxlZS50eXBlID09PSAnSW1wb3J0Jztcbn1cblxuZnVuY3Rpb24gaXNTdGF0aWNWYWx1ZShhcmcpIHtcbiAgcmV0dXJuIGFyZy50eXBlID09PSAnTGl0ZXJhbCcgfHxcbiAgICAoYXJnLnR5cGUgPT09ICdUZW1wbGF0ZUxpdGVyYWwnICYmIGFyZy5leHByZXNzaW9ucy5sZW5ndGggPT09IDApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLWR5bmFtaWMtcmVxdWlyZScpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgZXNtb2R1bGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG5cbiAgICByZXR1cm4ge1xuICAgICAgQ2FsbEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICBpZiAoIW5vZGUuYXJndW1lbnRzWzBdIHx8IGlzU3RhdGljVmFsdWUobm9kZS5hcmd1bWVudHNbMF0pKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1JlcXVpcmUobm9kZSkpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdDYWxscyB0byByZXF1aXJlKCkgc2hvdWxkIHVzZSBzdHJpbmcgbGl0ZXJhbHMnLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmVzbW9kdWxlICYmIGlzRHluYW1pY0ltcG9ydChub2RlKSkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0NhbGxzIHRvIGltcG9ydCgpIHNob3VsZCB1c2Ugc3RyaW5nIGxpdGVyYWxzJyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==