'use strict';




var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _has = require('has');var _has2 = _interopRequireDefault(_has);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };} /**
                                                                                                                                                                    * @fileoverview Rule to disallow anonymous default exports.
                                                                                                                                                                    * @author Duncan Beevers
                                                                                                                                                                    */var defs = { ArrayExpression: {
    option: 'allowArray',
    description: 'If `false`, will report default export of an array',
    message: 'Assign array to a variable before exporting as module default' },

  ArrowFunctionExpression: {
    option: 'allowArrowFunction',
    description: 'If `false`, will report default export of an arrow function',
    message: 'Assign arrow function to a variable before exporting as module default' },

  CallExpression: {
    option: 'allowCallExpression',
    description: 'If `false`, will report default export of a function call',
    message: 'Assign call result to a variable before exporting as module default',
    'default': true },

  ClassDeclaration: {
    option: 'allowAnonymousClass',
    description: 'If `false`, will report default export of an anonymous class',
    message: 'Unexpected default export of anonymous class',
    forbid: function () {function forbid(node) {return !node.declaration.id;}return forbid;}() },

  FunctionDeclaration: {
    option: 'allowAnonymousFunction',
    description: 'If `false`, will report default export of an anonymous function',
    message: 'Unexpected default export of anonymous function',
    forbid: function () {function forbid(node) {return !node.declaration.id;}return forbid;}() },

  Literal: {
    option: 'allowLiteral',
    description: 'If `false`, will report default export of a literal',
    message: 'Assign literal to a variable before exporting as module default' },

  ObjectExpression: {
    option: 'allowObject',
    description: 'If `false`, will report default export of an object expression',
    message: 'Assign object to a variable before exporting as module default' },

  TemplateLiteral: {
    option: 'allowLiteral',
    description: 'If `false`, will report default export of a literal',
    message: 'Assign literal to a variable before exporting as module default' } };



var schemaProperties = Object.keys(defs).
map(function (key) {return defs[key];}).
reduce(function (acc, def) {
  acc[def.option] = {
    description: def.description,
    type: 'boolean' };


  return acc;
}, {});

var defaults = Object.keys(defs).
map(function (key) {return defs[key];}).
reduce(function (acc, def) {
  acc[def.option] = (0, _has2['default'])(def, 'default') ? def['default'] : false;
  return acc;
}, {});

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('no-anonymous-default-export') },


    schema: [
    {
      type: 'object',
      properties: schemaProperties,
      'additionalProperties': false }] },




  create: function () {function create(context) {
      var options = Object.assign({}, defaults, context.options[0]);

      return {
        'ExportDefaultDeclaration': function () {function ExportDefaultDeclaration(node) {
            var def = defs[node.declaration.type];

            // Recognized node type and allowed by configuration,
            //   and has no forbid check, or forbid check return value is truthy
            if (def && !options[def.option] && (!def.forbid || def.forbid(node))) {
              context.report({ node: node, message: def.message });
            }
          }return ExportDefaultDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1hbm9ueW1vdXMtZGVmYXVsdC1leHBvcnQuanMiXSwibmFtZXMiOlsiZGVmcyIsIkFycmF5RXhwcmVzc2lvbiIsIm9wdGlvbiIsImRlc2NyaXB0aW9uIiwibWVzc2FnZSIsIkFycm93RnVuY3Rpb25FeHByZXNzaW9uIiwiQ2FsbEV4cHJlc3Npb24iLCJDbGFzc0RlY2xhcmF0aW9uIiwiZm9yYmlkIiwibm9kZSIsImRlY2xhcmF0aW9uIiwiaWQiLCJGdW5jdGlvbkRlY2xhcmF0aW9uIiwiTGl0ZXJhbCIsIk9iamVjdEV4cHJlc3Npb24iLCJUZW1wbGF0ZUxpdGVyYWwiLCJzY2hlbWFQcm9wZXJ0aWVzIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsImtleSIsInJlZHVjZSIsImFjYyIsImRlZiIsInR5cGUiLCJkZWZhdWx0cyIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsInVybCIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJjcmVhdGUiLCJjb250ZXh0Iiwib3B0aW9ucyIsImFzc2lnbiIsInJlcG9ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSxxQztBQUNBLDBCLHlJQU5BOzs7c0tBUUEsSUFBTUEsT0FBTyxFQUNYQyxpQkFBaUI7QUFDZkMsWUFBUSxZQURPO0FBRWZDLGlCQUFhLG9EQUZFO0FBR2ZDLGFBQVMsK0RBSE0sRUFETjs7QUFNWEMsMkJBQXlCO0FBQ3ZCSCxZQUFRLG9CQURlO0FBRXZCQyxpQkFBYSw2REFGVTtBQUd2QkMsYUFBUyx3RUFIYyxFQU5kOztBQVdYRSxrQkFBZ0I7QUFDZEosWUFBUSxxQkFETTtBQUVkQyxpQkFBYSwyREFGQztBQUdkQyxhQUFTLHFFQUhLO0FBSWQsZUFBUyxJQUpLLEVBWEw7O0FBaUJYRyxvQkFBa0I7QUFDaEJMLFlBQVEscUJBRFE7QUFFaEJDLGlCQUFhLDhEQUZHO0FBR2hCQyxhQUFTLDhDQUhPO0FBSWhCSSx5QkFBUSxnQkFBQ0MsSUFBRCxVQUFVLENBQUNBLEtBQUtDLFdBQUwsQ0FBaUJDLEVBQTVCLEVBQVIsaUJBSmdCLEVBakJQOztBQXVCWEMsdUJBQXFCO0FBQ25CVixZQUFRLHdCQURXO0FBRW5CQyxpQkFBYSxpRUFGTTtBQUduQkMsYUFBUyxpREFIVTtBQUluQkkseUJBQVEsZ0JBQUNDLElBQUQsVUFBVSxDQUFDQSxLQUFLQyxXQUFMLENBQWlCQyxFQUE1QixFQUFSLGlCQUptQixFQXZCVjs7QUE2QlhFLFdBQVM7QUFDUFgsWUFBUSxjQUREO0FBRVBDLGlCQUFhLHFEQUZOO0FBR1BDLGFBQVMsaUVBSEYsRUE3QkU7O0FBa0NYVSxvQkFBa0I7QUFDaEJaLFlBQVEsYUFEUTtBQUVoQkMsaUJBQWEsZ0VBRkc7QUFHaEJDLGFBQVMsZ0VBSE8sRUFsQ1A7O0FBdUNYVyxtQkFBaUI7QUFDZmIsWUFBUSxjQURPO0FBRWZDLGlCQUFhLHFEQUZFO0FBR2ZDLGFBQVMsaUVBSE0sRUF2Q04sRUFBYjs7OztBQThDQSxJQUFNWSxtQkFBbUJDLE9BQU9DLElBQVAsQ0FBWWxCLElBQVo7QUFDdEJtQixHQURzQixDQUNsQixVQUFDQyxHQUFELFVBQVNwQixLQUFLb0IsR0FBTCxDQUFULEVBRGtCO0FBRXRCQyxNQUZzQixDQUVmLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ3BCRCxNQUFJQyxJQUFJckIsTUFBUixJQUFrQjtBQUNoQkMsaUJBQWFvQixJQUFJcEIsV0FERDtBQUVoQnFCLFVBQU0sU0FGVSxFQUFsQjs7O0FBS0EsU0FBT0YsR0FBUDtBQUNELENBVHNCLEVBU3BCLEVBVG9CLENBQXpCOztBQVdBLElBQU1HLFdBQVdSLE9BQU9DLElBQVAsQ0FBWWxCLElBQVo7QUFDZG1CLEdBRGMsQ0FDVixVQUFDQyxHQUFELFVBQVNwQixLQUFLb0IsR0FBTCxDQUFULEVBRFU7QUFFZEMsTUFGYyxDQUVQLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ3BCRCxNQUFJQyxJQUFJckIsTUFBUixJQUFrQixzQkFBSXFCLEdBQUosRUFBUyxTQUFULElBQXNCQSxjQUF0QixHQUFvQyxLQUF0RDtBQUNBLFNBQU9ELEdBQVA7QUFDRCxDQUxjLEVBS1osRUFMWSxDQUFqQjs7QUFPQUksT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pKLFVBQU0sWUFERjtBQUVKSyxVQUFNO0FBQ0pDLFdBQUssMEJBQVEsNkJBQVIsQ0FERCxFQUZGOzs7QUFNSkMsWUFBUTtBQUNOO0FBQ0VQLFlBQU0sUUFEUjtBQUVFUSxrQkFBWWhCLGdCQUZkO0FBR0UsOEJBQXdCLEtBSDFCLEVBRE0sQ0FOSixFQURTOzs7OztBQWdCZmlCLHVCQUFRLGdCQUFVQyxPQUFWLEVBQW1CO0FBQ3pCLFVBQU1DLFVBQVVsQixPQUFPbUIsTUFBUCxDQUFjLEVBQWQsRUFBa0JYLFFBQWxCLEVBQTRCUyxRQUFRQyxPQUFSLENBQWdCLENBQWhCLENBQTVCLENBQWhCOztBQUVBLGFBQU87QUFDTCxpREFBNEIsa0NBQUMxQixJQUFELEVBQVU7QUFDcEMsZ0JBQU1jLE1BQU12QixLQUFLUyxLQUFLQyxXQUFMLENBQWlCYyxJQUF0QixDQUFaOztBQUVBO0FBQ0E7QUFDQSxnQkFBSUQsT0FBTyxDQUFDWSxRQUFRWixJQUFJckIsTUFBWixDQUFSLEtBQWdDLENBQUNxQixJQUFJZixNQUFMLElBQWVlLElBQUlmLE1BQUosQ0FBV0MsSUFBWCxDQUEvQyxDQUFKLEVBQXNFO0FBQ3BFeUIsc0JBQVFHLE1BQVIsQ0FBZSxFQUFFNUIsVUFBRixFQUFRTCxTQUFTbUIsSUFBSW5CLE9BQXJCLEVBQWY7QUFDRDtBQUNGLFdBUkQsbUNBREssRUFBUDs7QUFXRCxLQWRELGlCQWhCZSxFQUFqQiIsImZpbGUiOiJuby1hbm9ueW1vdXMtZGVmYXVsdC1leHBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUnVsZSB0byBkaXNhbGxvdyBhbm9ueW1vdXMgZGVmYXVsdCBleHBvcnRzLlxuICogQGF1dGhvciBEdW5jYW4gQmVldmVyc1xuICovXG5cbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuaW1wb3J0IGhhcyBmcm9tICdoYXMnO1xuXG5jb25zdCBkZWZzID0ge1xuICBBcnJheUV4cHJlc3Npb246IHtcbiAgICBvcHRpb246ICdhbGxvd0FycmF5JyxcbiAgICBkZXNjcmlwdGlvbjogJ0lmIGBmYWxzZWAsIHdpbGwgcmVwb3J0IGRlZmF1bHQgZXhwb3J0IG9mIGFuIGFycmF5JyxcbiAgICBtZXNzYWdlOiAnQXNzaWduIGFycmF5IHRvIGEgdmFyaWFibGUgYmVmb3JlIGV4cG9ydGluZyBhcyBtb2R1bGUgZGVmYXVsdCcsXG4gIH0sXG4gIEFycm93RnVuY3Rpb25FeHByZXNzaW9uOiB7XG4gICAgb3B0aW9uOiAnYWxsb3dBcnJvd0Z1bmN0aW9uJyxcbiAgICBkZXNjcmlwdGlvbjogJ0lmIGBmYWxzZWAsIHdpbGwgcmVwb3J0IGRlZmF1bHQgZXhwb3J0IG9mIGFuIGFycm93IGZ1bmN0aW9uJyxcbiAgICBtZXNzYWdlOiAnQXNzaWduIGFycm93IGZ1bmN0aW9uIHRvIGEgdmFyaWFibGUgYmVmb3JlIGV4cG9ydGluZyBhcyBtb2R1bGUgZGVmYXVsdCcsXG4gIH0sXG4gIENhbGxFeHByZXNzaW9uOiB7XG4gICAgb3B0aW9uOiAnYWxsb3dDYWxsRXhwcmVzc2lvbicsXG4gICAgZGVzY3JpcHRpb246ICdJZiBgZmFsc2VgLCB3aWxsIHJlcG9ydCBkZWZhdWx0IGV4cG9ydCBvZiBhIGZ1bmN0aW9uIGNhbGwnLFxuICAgIG1lc3NhZ2U6ICdBc3NpZ24gY2FsbCByZXN1bHQgdG8gYSB2YXJpYWJsZSBiZWZvcmUgZXhwb3J0aW5nIGFzIG1vZHVsZSBkZWZhdWx0JyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICB9LFxuICBDbGFzc0RlY2xhcmF0aW9uOiB7XG4gICAgb3B0aW9uOiAnYWxsb3dBbm9ueW1vdXNDbGFzcycsXG4gICAgZGVzY3JpcHRpb246ICdJZiBgZmFsc2VgLCB3aWxsIHJlcG9ydCBkZWZhdWx0IGV4cG9ydCBvZiBhbiBhbm9ueW1vdXMgY2xhc3MnLFxuICAgIG1lc3NhZ2U6ICdVbmV4cGVjdGVkIGRlZmF1bHQgZXhwb3J0IG9mIGFub255bW91cyBjbGFzcycsXG4gICAgZm9yYmlkOiAobm9kZSkgPT4gIW5vZGUuZGVjbGFyYXRpb24uaWQsXG4gIH0sXG4gIEZ1bmN0aW9uRGVjbGFyYXRpb246IHtcbiAgICBvcHRpb246ICdhbGxvd0Fub255bW91c0Z1bmN0aW9uJyxcbiAgICBkZXNjcmlwdGlvbjogJ0lmIGBmYWxzZWAsIHdpbGwgcmVwb3J0IGRlZmF1bHQgZXhwb3J0IG9mIGFuIGFub255bW91cyBmdW5jdGlvbicsXG4gICAgbWVzc2FnZTogJ1VuZXhwZWN0ZWQgZGVmYXVsdCBleHBvcnQgb2YgYW5vbnltb3VzIGZ1bmN0aW9uJyxcbiAgICBmb3JiaWQ6IChub2RlKSA9PiAhbm9kZS5kZWNsYXJhdGlvbi5pZCxcbiAgfSxcbiAgTGl0ZXJhbDoge1xuICAgIG9wdGlvbjogJ2FsbG93TGl0ZXJhbCcsXG4gICAgZGVzY3JpcHRpb246ICdJZiBgZmFsc2VgLCB3aWxsIHJlcG9ydCBkZWZhdWx0IGV4cG9ydCBvZiBhIGxpdGVyYWwnLFxuICAgIG1lc3NhZ2U6ICdBc3NpZ24gbGl0ZXJhbCB0byBhIHZhcmlhYmxlIGJlZm9yZSBleHBvcnRpbmcgYXMgbW9kdWxlIGRlZmF1bHQnLFxuICB9LFxuICBPYmplY3RFeHByZXNzaW9uOiB7XG4gICAgb3B0aW9uOiAnYWxsb3dPYmplY3QnLFxuICAgIGRlc2NyaXB0aW9uOiAnSWYgYGZhbHNlYCwgd2lsbCByZXBvcnQgZGVmYXVsdCBleHBvcnQgb2YgYW4gb2JqZWN0IGV4cHJlc3Npb24nLFxuICAgIG1lc3NhZ2U6ICdBc3NpZ24gb2JqZWN0IHRvIGEgdmFyaWFibGUgYmVmb3JlIGV4cG9ydGluZyBhcyBtb2R1bGUgZGVmYXVsdCcsXG4gIH0sXG4gIFRlbXBsYXRlTGl0ZXJhbDoge1xuICAgIG9wdGlvbjogJ2FsbG93TGl0ZXJhbCcsXG4gICAgZGVzY3JpcHRpb246ICdJZiBgZmFsc2VgLCB3aWxsIHJlcG9ydCBkZWZhdWx0IGV4cG9ydCBvZiBhIGxpdGVyYWwnLFxuICAgIG1lc3NhZ2U6ICdBc3NpZ24gbGl0ZXJhbCB0byBhIHZhcmlhYmxlIGJlZm9yZSBleHBvcnRpbmcgYXMgbW9kdWxlIGRlZmF1bHQnLFxuICB9LFxufTtcblxuY29uc3Qgc2NoZW1hUHJvcGVydGllcyA9IE9iamVjdC5rZXlzKGRlZnMpXG4gIC5tYXAoKGtleSkgPT4gZGVmc1trZXldKVxuICAucmVkdWNlKChhY2MsIGRlZikgPT4ge1xuICAgIGFjY1tkZWYub3B0aW9uXSA9IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBkZWYuZGVzY3JpcHRpb24sXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgfTtcblxuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcblxuY29uc3QgZGVmYXVsdHMgPSBPYmplY3Qua2V5cyhkZWZzKVxuICAubWFwKChrZXkpID0+IGRlZnNba2V5XSlcbiAgLnJlZHVjZSgoYWNjLCBkZWYpID0+IHtcbiAgICBhY2NbZGVmLm9wdGlvbl0gPSBoYXMoZGVmLCAnZGVmYXVsdCcpID8gZGVmLmRlZmF1bHQgOiBmYWxzZTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIHVybDogZG9jc1VybCgnbm8tYW5vbnltb3VzLWRlZmF1bHQtZXhwb3J0JyksXG4gICAgfSxcblxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczogc2NoZW1hUHJvcGVydGllcyxcbiAgICAgICAgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJzogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgY29udGV4dC5vcHRpb25zWzBdKTtcblxuICAgIHJldHVybiB7XG4gICAgICAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJzogKG5vZGUpID0+IHtcbiAgICAgICAgY29uc3QgZGVmID0gZGVmc1tub2RlLmRlY2xhcmF0aW9uLnR5cGVdO1xuXG4gICAgICAgIC8vIFJlY29nbml6ZWQgbm9kZSB0eXBlIGFuZCBhbGxvd2VkIGJ5IGNvbmZpZ3VyYXRpb24sXG4gICAgICAgIC8vICAgYW5kIGhhcyBubyBmb3JiaWQgY2hlY2ssIG9yIGZvcmJpZCBjaGVjayByZXR1cm4gdmFsdWUgaXMgdHJ1dGh5XG4gICAgICAgIGlmIChkZWYgJiYgIW9wdGlvbnNbZGVmLm9wdGlvbl0gJiYgKCFkZWYuZm9yYmlkIHx8IGRlZi5mb3JiaWQobm9kZSkpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoeyBub2RlLCBtZXNzYWdlOiBkZWYubWVzc2FnZSB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==