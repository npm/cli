'use strict';




var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var EXPORT_MESSAGE = 'Expected "export" or "export default"'; /**
                                                               * @fileoverview Rule to prefer ES6 to CJS
                                                               * @author Jamund Ferguson
                                                               */var IMPORT_MESSAGE = 'Expected "import" instead of "require()"';function normalizeLegacyOptions(options) {
  if (options.indexOf('allow-primitive-modules') >= 0) {
    return { allowPrimitiveModules: true };
  }
  return options[0] || {};
}

function allowPrimitive(node, options) {
  if (!options.allowPrimitiveModules) return false;
  if (node.parent.type !== 'AssignmentExpression') return false;
  return node.parent.right.type !== 'ObjectExpression';
}

function allowRequire(node, options) {
  return options.allowRequire;
}

function allowConditionalRequire(node, options) {
  return options.allowConditionalRequire !== false;
}

function validateScope(scope) {
  return scope.variableScope.type === 'module';
}

// https://github.com/estree/estree/blob/HEAD/es5.md
function isConditional(node) {
  if (
  node.type === 'IfStatement' ||
  node.type === 'TryStatement' ||
  node.type === 'LogicalExpression' ||
  node.type === 'ConditionalExpression')
  return true;
  if (node.parent) return isConditional(node.parent);
  return false;
}

function isLiteralString(node) {
  return node.type === 'Literal' && typeof node.value === 'string' ||
  node.type === 'TemplateLiteral' && node.expressions.length === 0;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var schemaString = { 'enum': ['allow-primitive-modules'] };
var schemaObject = {
  type: 'object',
  properties: {
    allowPrimitiveModules: { 'type': 'boolean' },
    allowRequire: { 'type': 'boolean' },
    allowConditionalRequire: { 'type': 'boolean' } },

  additionalProperties: false };


module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('no-commonjs') },


    schema: {
      anyOf: [
      {
        type: 'array',
        items: [schemaString],
        additionalItems: false },

      {
        type: 'array',
        items: [schemaObject],
        additionalItems: false }] } },





  create: function () {function create(context) {
      var options = normalizeLegacyOptions(context.options);

      return {

        'MemberExpression': function () {function MemberExpression(node) {

            // module.exports
            if (node.object.name === 'module' && node.property.name === 'exports') {
              if (allowPrimitive(node, options)) return;
              context.report({ node: node, message: EXPORT_MESSAGE });
            }

            // exports.
            if (node.object.name === 'exports') {
              var isInScope = context.getScope().
              variables.
              some(function (variable) {return variable.name === 'exports';});
              if (!isInScope) {
                context.report({ node: node, message: EXPORT_MESSAGE });
              }
            }

          }return MemberExpression;}(),
        'CallExpression': function () {function CallExpression(call) {
            if (!validateScope(context.getScope())) return;

            if (call.callee.type !== 'Identifier') return;
            if (call.callee.name !== 'require') return;

            if (call.arguments.length !== 1) return;
            if (!isLiteralString(call.arguments[0])) return;

            if (allowRequire(call, options)) return;

            if (allowConditionalRequire(call, options) && isConditional(call.parent)) return;

            // keeping it simple: all 1-string-arg `require` calls are reported
            context.report({
              node: call.callee,
              message: IMPORT_MESSAGE });

          }return CallExpression;}() };


    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1jb21tb25qcy5qcyJdLCJuYW1lcyI6WyJFWFBPUlRfTUVTU0FHRSIsIklNUE9SVF9NRVNTQUdFIiwibm9ybWFsaXplTGVnYWN5T3B0aW9ucyIsIm9wdGlvbnMiLCJpbmRleE9mIiwiYWxsb3dQcmltaXRpdmVNb2R1bGVzIiwiYWxsb3dQcmltaXRpdmUiLCJub2RlIiwicGFyZW50IiwidHlwZSIsInJpZ2h0IiwiYWxsb3dSZXF1aXJlIiwiYWxsb3dDb25kaXRpb25hbFJlcXVpcmUiLCJ2YWxpZGF0ZVNjb3BlIiwic2NvcGUiLCJ2YXJpYWJsZVNjb3BlIiwiaXNDb25kaXRpb25hbCIsImlzTGl0ZXJhbFN0cmluZyIsInZhbHVlIiwiZXhwcmVzc2lvbnMiLCJsZW5ndGgiLCJzY2hlbWFTdHJpbmciLCJzY2hlbWFPYmplY3QiLCJwcm9wZXJ0aWVzIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJ1cmwiLCJzY2hlbWEiLCJhbnlPZiIsIml0ZW1zIiwiYWRkaXRpb25hbEl0ZW1zIiwiY3JlYXRlIiwiY29udGV4dCIsIm9iamVjdCIsIm5hbWUiLCJwcm9wZXJ0eSIsInJlcG9ydCIsIm1lc3NhZ2UiLCJpc0luU2NvcGUiLCJnZXRTY29wZSIsInZhcmlhYmxlcyIsInNvbWUiLCJ2YXJpYWJsZSIsImNhbGwiLCJjYWxsZWUiLCJhcmd1bWVudHMiXSwibWFwcGluZ3MiOiI7Ozs7O0FBS0EscUM7O0FBRUEsSUFBTUEsaUJBQWlCLHVDQUF2QixDLENBUEE7OztpRUFRQSxJQUFNQyxpQkFBaUIsMENBQXZCLENBRUEsU0FBU0Msc0JBQVQsQ0FBZ0NDLE9BQWhDLEVBQXlDO0FBQ3ZDLE1BQUlBLFFBQVFDLE9BQVIsQ0FBZ0IseUJBQWhCLEtBQThDLENBQWxELEVBQXFEO0FBQ25ELFdBQU8sRUFBRUMsdUJBQXVCLElBQXpCLEVBQVA7QUFDRDtBQUNELFNBQU9GLFFBQVEsQ0FBUixLQUFj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QGZpbGVvdmVydmlldyBSdWxlIHRvIHByZWZlciBFUzYgdG8gQ0pTXG4gKiBAYXV0aG9yIEphbXVuZCBGZXJndXNvblxuICovXG5cbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5jb25zdCBFWFBPUlRfTUVTU0FHRSA9ICdFeHBlY3RlZCBcImV4cG9ydFwiIG9yIFwiZXhwb3J0IGRlZmF1bHRcIic7XG5jb25zdCBJTVBPUlRfTUVTU0FHRSA9ICdFeHBlY3RlZCBcImltcG9ydFwiIGluc3RlYWQgb2YgXCJyZXF1aXJlKClcIic7XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUxlZ2FjeU9wdGlvbnMob3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5pbmRleE9mKCdhbGxvdy1wcmltaXRpdmUtbW9kdWxlcycpID49IDApIHtcbiAgICByZXR1cm4geyBhbGxvd1ByaW1pdGl2ZU1vZHVsZXM6IHRydWUgfTtcbiAgfVxuICByZXR1cm4gb3B0aW9uc1swXSB8fCB7fTtcbn1cblxuZnVuY3Rpb24gYWxsb3dQcmltaXRpdmUobm9kZSwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMuYWxsb3dQcmltaXRpdmVNb2R1bGVzKSByZXR1cm4gZmFsc2U7XG4gIGlmIChub2RlLnBhcmVudC50eXBlICE9PSAnQXNzaWdubWVudEV4cHJlc3Npb24nKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiAobm9kZS5wYXJlbnQucmlnaHQudHlwZSAhPT0gJ09iamVjdEV4cHJlc3Npb24nKTtcbn1cblxuZnVuY3Rpb24gYWxsb3dSZXF1aXJlKG5vZGUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wdGlvbnMuYWxsb3dSZXF1aXJlO1xufVxuXG5mdW5jdGlvbiBhbGxvd0NvbmRpdGlvbmFsUmVxdWlyZShub2RlLCBvcHRpb25zKSB7XG4gIHJldHVybiBvcHRpb25zLmFsbG93Q29uZGl0aW9uYWxSZXF1aXJlICE9PSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVTY29wZShzY29wZSkge1xuICByZXR1cm4gc2NvcGUudmFyaWFibGVTY29wZS50eXBlID09PSAnbW9kdWxlJztcbn1cblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2VzdHJlZS9lc3RyZWUvYmxvYi9IRUFEL2VzNS5tZFxuZnVuY3Rpb24gaXNDb25kaXRpb25hbChub2RlKSB7XG4gIGlmIChcbiAgICBub2RlLnR5cGUgPT09ICdJZlN0YXRlbWVudCdcbiAgICB8fCBub2RlLnR5cGUgPT09ICdUcnlTdGF0ZW1lbnQnXG4gICAgfHwgbm9kZS50eXBlID09PSAnTG9naWNhbEV4cHJlc3Npb24nXG4gICAgfHwgbm9kZS50eXBlID09PSAnQ29uZGl0aW9uYWxFeHByZXNzaW9uJ1xuICApIHJldHVybiB0cnVlO1xuICBpZiAobm9kZS5wYXJlbnQpIHJldHVybiBpc0NvbmRpdGlvbmFsKG5vZGUucGFyZW50KTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc0xpdGVyYWxTdHJpbmcobm9kZSkge1xuICByZXR1cm4gKG5vZGUudHlwZSA9PT0gJ0xpdGVyYWwnICYmIHR5cGVvZiBub2RlLnZhbHVlID09PSAnc3RyaW5nJykgfHxcbiAgICAobm9kZS50eXBlID09PSAnVGVtcGxhdGVMaXRlcmFsJyAmJiBub2RlLmV4cHJlc3Npb25zLmxlbmd0aCA9PT0gMCk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSdWxlIERlZmluaXRpb25cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IHNjaGVtYVN0cmluZyA9IHsgZW51bTogWydhbGxvdy1wcmltaXRpdmUtbW9kdWxlcyddIH07XG5jb25zdCBzY2hlbWFPYmplY3QgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgYWxsb3dQcmltaXRpdmVNb2R1bGVzOiB7ICd0eXBlJzogJ2Jvb2xlYW4nIH0sXG4gICAgYWxsb3dSZXF1aXJlOiB7ICd0eXBlJzogJ2Jvb2xlYW4nIH0sXG4gICAgYWxsb3dDb25kaXRpb25hbFJlcXVpcmU6IHsgJ3R5cGUnOiAnYm9vbGVhbicgfSxcbiAgfSxcbiAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgdXJsOiBkb2NzVXJsKCduby1jb21tb25qcycpLFxuICAgIH0sXG5cbiAgICBzY2hlbWE6IHtcbiAgICAgIGFueU9mOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGl0ZW1zOiBbc2NoZW1hU3RyaW5nXSxcbiAgICAgICAgICBhZGRpdGlvbmFsSXRlbXM6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBpdGVtczogW3NjaGVtYU9iamVjdF0sXG4gICAgICAgICAgYWRkaXRpb25hbEl0ZW1zOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IG5vcm1hbGl6ZUxlZ2FjeU9wdGlvbnMoY29udGV4dC5vcHRpb25zKTtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICdNZW1iZXJFeHByZXNzaW9uJzogZnVuY3Rpb24gKG5vZGUpIHtcblxuICAgICAgICAvLyBtb2R1bGUuZXhwb3J0c1xuICAgICAgICBpZiAobm9kZS5vYmplY3QubmFtZSA9PT0gJ21vZHVsZScgJiYgbm9kZS5wcm9wZXJ0eS5uYW1lID09PSAnZXhwb3J0cycpIHtcbiAgICAgICAgICBpZiAoYWxsb3dQcmltaXRpdmUobm9kZSwgb3B0aW9ucykpIHJldHVybjtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7IG5vZGUsIG1lc3NhZ2U6IEVYUE9SVF9NRVNTQUdFIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZXhwb3J0cy5cbiAgICAgICAgaWYgKG5vZGUub2JqZWN0Lm5hbWUgPT09ICdleHBvcnRzJykge1xuICAgICAgICAgIGNvbnN0IGlzSW5TY29wZSA9IGNvbnRleHQuZ2V0U2NvcGUoKVxuICAgICAgICAgICAgLnZhcmlhYmxlc1xuICAgICAgICAgICAgLnNvbWUodmFyaWFibGUgPT4gdmFyaWFibGUubmFtZSA9PT0gJ2V4cG9ydHMnKTtcbiAgICAgICAgICBpZiAoISBpc0luU2NvcGUpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHsgbm9kZSwgbWVzc2FnZTogRVhQT1JUX01FU1NBR0UgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIH0sXG4gICAgICAnQ2FsbEV4cHJlc3Npb24nOiBmdW5jdGlvbiAoY2FsbCkge1xuICAgICAgICBpZiAoIXZhbGlkYXRlU2NvcGUoY29udGV4dC5nZXRTY29wZSgpKSkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChjYWxsLmNhbGxlZS50eXBlICE9PSAnSWRlbnRpZmllcicpIHJldHVybjtcbiAgICAgICAgaWYgKGNhbGwuY2FsbGVlLm5hbWUgIT09ICdyZXF1aXJlJykgcmV0dXJuO1xuXG4gICAgICAgIGlmIChjYWxsLmFyZ3VtZW50cy5sZW5ndGggIT09IDEpIHJldHVybjtcbiAgICAgICAgaWYgKCFpc0xpdGVyYWxTdHJpbmcoY2FsbC5hcmd1bWVudHNbMF0pKSByZXR1cm47XG5cbiAgICAgICAgaWYgKGFsbG93UmVxdWlyZShjYWxsLCBvcHRpb25zKSkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChhbGxvd0NvbmRpdGlvbmFsUmVxdWlyZShjYWxsLCBvcHRpb25zKSAmJiBpc0NvbmRpdGlvbmFsKGNhbGwucGFyZW50KSkgcmV0dXJuO1xuXG4gICAgICAgIC8vIGtlZXBpbmcgaXQgc2ltcGxlOiBhbGwgMS1zdHJpbmctYXJnIGByZXF1aXJlYCBjYWxscyBhcmUgcmVwb3J0ZWRcbiAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgIG5vZGU6IGNhbGwuY2FsbGVlLFxuICAgICAgICAgIG1lc3NhZ2U6IElNUE9SVF9NRVNTQUdFLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfTtcblxuICB9LFxufTtcbiJdfQ==