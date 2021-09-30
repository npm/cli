'use strict';




var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('no-amd') },

    schema: [] },


  create: function () {function create(context) {
      return {
        'CallExpression': function () {function CallExpression(node) {
            if (context.getScope().type !== 'module') return;

            if (node.callee.type !== 'Identifier') return;
            if (node.callee.name !== 'require' &&
            node.callee.name !== 'define') return;

            // todo: capture define((require, module, exports) => {}) form?
            if (node.arguments.length !== 2) return;

            var modules = node.arguments[0];
            if (modules.type !== 'ArrayExpression') return;

            // todo: check second arg type? (identifier or callback)

            context.report(node, 'Expected imports instead of AMD ' + String(node.callee.name) + '().');
          }return CallExpression;}() };


    }return create;}() }; /**
                           * @fileoverview Rule to prefer imports to AMD
                           * @author Jamund Ferguson
                           */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1hbWQuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsInVybCIsInNjaGVtYSIsImNyZWF0ZSIsImNvbnRleHQiLCJub2RlIiwiZ2V0U2NvcGUiLCJjYWxsZWUiLCJuYW1lIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwibW9kdWxlcyIsInJlcG9ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSxxQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUFBLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKQyxVQUFNLFlBREY7QUFFSkMsVUFBTTtBQUNKQyxXQUFLLDBCQUFRLFFBQVIsQ0FERCxFQUZGOztBQUtKQyxZQUFRLEVBTEosRUFEUzs7O0FBU2ZDLHVCQUFRLGdCQUFVQyxPQUFWLEVBQW1CO0FBQ3pCLGFBQU87QUFDTCx1Q0FBa0Isd0JBQVVDLElBQVYsRUFBZ0I7QUFDaEMsZ0JBQUlELFFBQVFFLFFBQVIsR0FBbUJQLElBQW5CLEtBQTRCLFFBQWhDLEVBQTBDOztBQUUxQyxnQkFBSU0sS0FBS0UsTUFBTCxDQUFZUixJQUFaLEtBQXFCLFlBQXpCLEVBQXVDO0FBQ3ZDLGdCQUFJTSxLQUFLRSxNQUFMLENBQVlDLElBQVosS0FBcUIsU0FBckI7QUFDQUgsaUJBQUtFLE1BQUwsQ0FBWUMsSUFBWixLQUFxQixRQUR6QixFQUNtQzs7QUFFbkM7QUFDQSxnQkFBSUgsS0FBS0ksU0FBTCxDQUFlQyxNQUFmLEtBQTBCLENBQTlCLEVBQWlDOztBQUVqQyxnQkFBTUMsVUFBVU4sS0FBS0ksU0FBTCxDQUFlLENBQWYsQ0FBaEI7QUFDQSxnQkFBSUUsUUFBUVosSUFBUixLQUFpQixpQkFBckIsRUFBd0M7O0FBRXhDOztBQUVBSyxvQkFBUVEsTUFBUixDQUFlUCxJQUFmLDhDQUF3REEsS0FBS0UsTUFBTCxDQUFZQyxJQUFwRTtBQUNELFdBaEJELHlCQURLLEVBQVA7OztBQW9CRCxLQXJCRCxpQkFUZSxFQUFqQixDLENBWEEiLCJmaWxlIjoibm8tYW1kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFJ1bGUgdG8gcHJlZmVyIGltcG9ydHMgdG8gQU1EXG4gKiBAYXV0aG9yIEphbXVuZCBGZXJndXNvblxuICovXG5cbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUnVsZSBEZWZpbml0aW9uXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLWFtZCcpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdDYWxsRXhwcmVzc2lvbic6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGlmIChjb250ZXh0LmdldFNjb3BlKCkudHlwZSAhPT0gJ21vZHVsZScpIHJldHVybjtcblxuICAgICAgICBpZiAobm9kZS5jYWxsZWUudHlwZSAhPT0gJ0lkZW50aWZpZXInKSByZXR1cm47XG4gICAgICAgIGlmIChub2RlLmNhbGxlZS5uYW1lICE9PSAncmVxdWlyZScgJiZcbiAgICAgICAgICAgIG5vZGUuY2FsbGVlLm5hbWUgIT09ICdkZWZpbmUnKSByZXR1cm47XG5cbiAgICAgICAgLy8gdG9kbzogY2FwdHVyZSBkZWZpbmUoKHJlcXVpcmUsIG1vZHVsZSwgZXhwb3J0cykgPT4ge30pIGZvcm0/XG4gICAgICAgIGlmIChub2RlLmFyZ3VtZW50cy5sZW5ndGggIT09IDIpIHJldHVybjtcblxuICAgICAgICBjb25zdCBtb2R1bGVzID0gbm9kZS5hcmd1bWVudHNbMF07XG4gICAgICAgIGlmIChtb2R1bGVzLnR5cGUgIT09ICdBcnJheUV4cHJlc3Npb24nKSByZXR1cm47XG5cbiAgICAgICAgLy8gdG9kbzogY2hlY2sgc2Vjb25kIGFyZyB0eXBlPyAoaWRlbnRpZmllciBvciBjYWxsYmFjaylcblxuICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLCBgRXhwZWN0ZWQgaW1wb3J0cyBpbnN0ZWFkIG9mIEFNRCAke25vZGUuY2FsbGVlLm5hbWV9KCkuYCk7XG4gICAgICB9LFxuICAgIH07XG5cbiAgfSxcbn07XG4iXX0=