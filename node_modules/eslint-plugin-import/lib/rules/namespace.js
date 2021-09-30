'use strict';var _declaredScope = require('eslint-module-utils/declaredScope');var _declaredScope2 = _interopRequireDefault(_declaredScope);
var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _importDeclaration = require('../importDeclaration');var _importDeclaration2 = _interopRequireDefault(_importDeclaration);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: (0, _docsUrl2['default'])('namespace') },


    schema: [
    {
      type: 'object',
      properties: {
        allowComputed: {
          description: 'If `false`, will report computed (and thus, un-lintable) references to namespace members.',
          type: 'boolean',
          'default': false } },


      additionalProperties: false }] },




  create: function () {function namespaceRule(context) {

      // read options
      var _ref =

      context.options[0] || {},_ref$allowComputed = _ref.allowComputed,allowComputed = _ref$allowComputed === undefined ? false : _ref$allowComputed;

      var namespaces = new Map();

      function makeMessage(last, namepath) {
        return '\'' + String(last.name) + '\' not found in ' + (namepath.length > 1 ? 'deeply ' : '') + 'imported namespace \'' + String(namepath.join('.')) + '\'.';
      }

      return {
        // pick up all imports at body entry time, to properly respect hoisting
        Program: function () {function Program(_ref2) {var body = _ref2.body;
            function processBodyStatement(declaration) {
              if (declaration.type !== 'ImportDeclaration') return;

              if (declaration.specifiers.length === 0) return;

              var imports = _ExportMap2['default'].get(declaration.source.value, context);
              if (imports == null) return null;

              if (imports.errors.length) {
                imports.reportErrors(context, declaration);
                return;
              }var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

                for (var _iterator = declaration.specifiers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var specifier = _step.value;
                  switch (specifier.type) {
                    case 'ImportNamespaceSpecifier':
                      if (!imports.size) {
                        context.report(
                        specifier, 'No exported names found in module \'' + String(
                        declaration.source.value) + '\'.');

                      }
                      namespaces.set(specifier.local.name, imports);
                      break;
                    case 'ImportDefaultSpecifier':
                    case 'ImportSpecifier':{
                        var meta = imports.get(
                        // default to 'default' for default http://i.imgur.com/nj6qAWy.jpg
                        specifier.imported ? specifier.imported.name : 'default');

                        if (!meta || !meta.namespace) {break;}
                        namespaces.set(specifier.local.name, meta.namespace);
                        break;
                      }}

                }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
            }
            body.forEach(processBodyStatement);
          }return Program;}(),

        // same as above, but does not add names to local map
        ExportNamespaceSpecifier: function () {function ExportNamespaceSpecifier(namespace) {
            var declaration = (0, _importDeclaration2['default'])(context);

            var imports = _ExportMap2['default'].get(declaration.source.value, context);
            if (imports == null) return null;

            if (imports.errors.length) {
              imports.reportErrors(context, declaration);
              return;
            }

            if (!imports.size) {
              context.report(
              namespace, 'No exported names found in module \'' + String(
              declaration.source.value) + '\'.');

            }
          }return ExportNamespaceSpecifier;}(),

        // todo: check for possible redefinition

        MemberExpression: function () {function MemberExpression(dereference) {
            if (dereference.object.type !== 'Identifier') return;
            if (!namespaces.has(dereference.object.name)) return;
            if ((0, _declaredScope2['default'])(context, dereference.object.name) !== 'module') return;

            if (dereference.parent.type === 'AssignmentExpression' && dereference.parent.left === dereference) {
              context.report(
              dereference.parent, 'Assignment to member of namespace \'' + String(
              dereference.object.name) + '\'.');

            }

            // go deep
            var namespace = namespaces.get(dereference.object.name);
            var namepath = [dereference.object.name];
            // while property is namespace and parent is member expression, keep validating
            while (namespace instanceof _ExportMap2['default'] && dereference.type === 'MemberExpression') {

              if (dereference.computed) {
                if (!allowComputed) {
                  context.report(
                  dereference.property, 'Unable to validate computed reference to imported namespace \'' + String(
                  dereference.object.name) + '\'.');

                }
                return;
              }

              if (!namespace.has(dereference.property.name)) {
                context.report(
                dereference.property,
                makeMessage(dereference.property, namepath));

                break;
              }

              var exported = namespace.get(dereference.property.name);
              if (exported == null) return;

              // stash and pop
              namepath.push(dereference.property.name);
              namespace = exported.namespace;
              dereference = dereference.parent;
            }

          }return MemberExpression;}(),

        VariableDeclarator: function () {function VariableDeclarator(_ref3) {var id = _ref3.id,init = _ref3.init;
            if (init == null) return;
            if (init.type !== 'Identifier') return;
            if (!namespaces.has(init.name)) return;

            // check for redefinition in intermediate scopes
            if ((0, _declaredScope2['default'])(context, init.name) !== 'module') return;

            // DFS traverse child namespaces
            function testKey(pattern, namespace) {var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [init.name];
              if (!(namespace instanceof _ExportMap2['default'])) return;

              if (pattern.type !== 'ObjectPattern') return;var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {

                for (var _iterator2 = pattern.properties[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var property = _step2.value;
                  if (
                  property.type === 'ExperimentalRestProperty' ||
                  property.type === 'RestElement' ||
                  !property.key)
                  {
                    continue;
                  }

                  if (property.key.type !== 'Identifier') {
                    context.report({
                      node: property,
                      message: 'Only destructure top-level names.' });

                    continue;
                  }

                  if (!namespace.has(property.key.name)) {
                    context.report({
                      node: property,
                      message: makeMessage(property.key, path) });

                    continue;
                  }

                  path.push(property.key.name);
                  var dependencyExportMap = namespace.get(property.key.name);
                  // could be null when ignored or ambiguous
                  if (dependencyExportMap !== null) {
                    testKey(property.value, dependencyExportMap.namespace, path);
                  }
                  path.pop();
                }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
            }

            testKey(id, namespaces.get(init.name));
          }return VariableDeclarator;}(),

        JSXMemberExpression: function () {function JSXMemberExpression(_ref4) {var object = _ref4.object,property = _ref4.property;
            if (!namespaces.has(object.name)) return;
            var namespace = namespaces.get(object.name);
            if (!namespace.has(property.name)) {
              context.report({
                node: property,
                message: makeMessage(property, [object.name]) });

            }
          }return JSXMemberExpression;}() };

    }return namespaceRule;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uYW1lc3BhY2UuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsInVybCIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJhbGxvd0NvbXB1dGVkIiwiZGVzY3JpcHRpb24iLCJhZGRpdGlvbmFsUHJvcGVydGllcyIsImNyZWF0ZSIsIm5hbWVzcGFjZVJ1bGUiLCJjb250ZXh0Iiwib3B0aW9ucyIsIm5hbWVzcGFjZXMiLCJNYXAiLCJtYWtlTWVzc2FnZSIsImxhc3QiLCJuYW1lcGF0aCIsIm5hbWUiLCJsZW5ndGgiLCJqb2luIiwiUHJvZ3JhbSIsImJvZHkiLCJwcm9jZXNzQm9keVN0YXRlbWVudCIsImRlY2xhcmF0aW9uIiwic3BlY2lmaWVycyIsImltcG9ydHMiLCJFeHBvcnRzIiwiZ2V0Iiwic291cmNlIiwidmFsdWUiLCJlcnJvcnMiLCJyZXBvcnRFcnJvcnMiLCJzcGVjaWZpZXIiLCJzaXplIiwicmVwb3J0Iiwic2V0IiwibG9jYWwiLCJpbXBvcnRlZCIsIm5hbWVzcGFjZSIsImZvckVhY2giLCJFeHBvcnROYW1lc3BhY2VTcGVjaWZpZXIiLCJNZW1iZXJFeHByZXNzaW9uIiwiZGVyZWZlcmVuY2UiLCJvYmplY3QiLCJoYXMiLCJwYXJlbnQiLCJsZWZ0IiwiY29tcHV0ZWQiLCJwcm9wZXJ0eSIsImV4cG9ydGVkIiwicHVzaCIsIlZhcmlhYmxlRGVjbGFyYXRvciIsImlkIiwiaW5pdCIsInRlc3RLZXkiLCJwYXR0ZXJuIiwicGF0aCIsImtleSIsIm5vZGUiLCJtZXNzYWdlIiwiZGVwZW5kZW5jeUV4cG9ydE1hcCIsInBvcCIsIkpTWE1lbWJlckV4cHJlc3Npb24iXSwibWFwcGluZ3MiOiJhQUFBLGtFO0FBQ0EseUM7QUFDQSx5RDtBQUNBLHFDOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxTQURGO0FBRUpDLFVBQU07QUFDSkMsV0FBSywwQkFB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Q3hDLGdCQUFJLENBQUNwQyxXQUFXZ0MsR0FBWCxDQUFlRCxPQUFPMUIsSUFBdEIsQ0FBTCxFQUFrQztBQUNsQyxnQkFBTXFCLFlBQVkxQixXQUFXZSxHQUFYLENBQWVnQixPQUFPMUIsSUFBdEIsQ0FBbEI7QUFDQSxnQkFBSSxDQUFDcUIsVUFBVU0sR0FBVixDQUFjSSxTQUFTL0IsSUFBdkIsQ0FBTCxFQUFtQztBQUNqQ1Asc0JBQVF3QixNQUFSLENBQWU7QUFDYndCLHNCQUFNVixRQURPO0FBRWJXLHlCQUFTN0MsWUFBWWtDLFFBQVosRUFBc0IsQ0FBQ0wsT0FBTzFCLElBQVIsQ0FBdEIsQ0FGSSxFQUFmOztBQUlEO0FBQ0YsV0E3S0ksZ0NBQVA7O0FBK0tELEtBNUxELE9BQWlCUixhQUFqQixJQXRCZSxFQUFqQiIsImZpbGUiOiJuYW1lc3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVjbGFyZWRTY29wZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2RlY2xhcmVkU2NvcGUnO1xuaW1wb3J0IEV4cG9ydHMgZnJvbSAnLi4vRXhwb3J0TWFwJztcbmltcG9ydCBpbXBvcnREZWNsYXJhdGlvbiBmcm9tICcuLi9pbXBvcnREZWNsYXJhdGlvbic7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAncHJvYmxlbScsXG4gICAgZG9jczoge1xuICAgICAgdXJsOiBkb2NzVXJsKCduYW1lc3BhY2UnKSxcbiAgICB9LFxuXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgYWxsb3dDb21wdXRlZDoge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBgZmFsc2VgLCB3aWxsIHJlcG9ydCBjb21wdXRlZCAoYW5kIHRodXMsIHVuLWxpbnRhYmxlKSByZWZlcmVuY2VzIHRvIG5hbWVzcGFjZSBtZW1iZXJzLicsXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiBuYW1lc3BhY2VSdWxlKGNvbnRleHQpIHtcblxuICAgIC8vIHJlYWQgb3B0aW9uc1xuICAgIGNvbnN0IHtcbiAgICAgIGFsbG93Q29tcHV0ZWQgPSBmYWxzZSxcbiAgICB9ID0gY29udGV4dC5vcHRpb25zWzBdIHx8IHt9O1xuXG4gICAgY29uc3QgbmFtZXNwYWNlcyA9IG5ldyBNYXAoKTtcblxuICAgIGZ1bmN0aW9uIG1ha2VNZXNzYWdlKGxhc3QsIG5hbWVwYXRoKSB7XG4gICAgICByZXR1cm4gYCcke2xhc3QubmFtZX0nIG5vdCBmb3VuZCBpbiAke25hbWVwYXRoLmxlbmd0aCA+IDEgPyAnZGVlcGx5ICcgOiAnJ31pbXBvcnRlZCBuYW1lc3BhY2UgJyR7bmFtZXBhdGguam9pbignLicpfScuYDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLy8gcGljayB1cCBhbGwgaW1wb3J0cyBhdCBib2R5IGVudHJ5IHRpbWUsIHRvIHByb3Blcmx5IHJlc3BlY3QgaG9pc3RpbmdcbiAgICAgIFByb2dyYW0oeyBib2R5IH0pIHtcbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0JvZHlTdGF0ZW1lbnQoZGVjbGFyYXRpb24pIHtcbiAgICAgICAgICBpZiAoZGVjbGFyYXRpb24udHlwZSAhPT0gJ0ltcG9ydERlY2xhcmF0aW9uJykgcmV0dXJuO1xuXG4gICAgICAgICAgaWYgKGRlY2xhcmF0aW9uLnNwZWNpZmllcnMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gRXhwb3J0cy5nZXQoZGVjbGFyYXRpb24uc291cmNlLnZhbHVlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoaW1wb3J0cyA9PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICAgICAgICAgIGlmIChpbXBvcnRzLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGltcG9ydHMucmVwb3J0RXJyb3JzKGNvbnRleHQsIGRlY2xhcmF0aW9uKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IHNwZWNpZmllciBvZiBkZWNsYXJhdGlvbi5zcGVjaWZpZXJzKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHNwZWNpZmllci50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInOlxuICAgICAgICAgICAgICBpZiAoIWltcG9ydHMuc2l6ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KFxuICAgICAgICAgICAgICAgICAgc3BlY2lmaWVyLFxuICAgICAgICAgICAgICAgICAgYE5vIGV4cG9ydGVkIG5hbWVzIGZvdW5kIGluIG1vZHVsZSAnJHtkZWNsYXJhdGlvbi5zb3VyY2UudmFsdWV9Jy5gLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbmFtZXNwYWNlcy5zZXQoc3BlY2lmaWVyLmxvY2FsLm5hbWUsIGltcG9ydHMpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInOlxuICAgICAgICAgICAgY2FzZSAnSW1wb3J0U3BlY2lmaWVyJzoge1xuICAgICAgICAgICAgICBjb25zdCBtZXRhID0gaW1wb3J0cy5nZXQoXG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byAnZGVmYXVsdCcgZm9yIGRlZmF1bHQgaHR0cDovL2kuaW1ndXIuY29tL25qNnFBV3kuanBnXG4gICAgICAgICAgICAgICAgc3BlY2lmaWVyLmltcG9ydGVkID8gc3BlY2lmaWVyLmltcG9ydGVkLm5hbWUgOiAnZGVmYXVsdCcsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGlmICghbWV0YSB8fCAhbWV0YS5uYW1lc3BhY2UpIHsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgbmFtZXNwYWNlcy5zZXQoc3BlY2lmaWVyLmxvY2FsLm5hbWUsIG1ldGEubmFtZXNwYWNlKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJvZHkuZm9yRWFjaChwcm9jZXNzQm9keVN0YXRlbWVudCk7XG4gICAgICB9LFxuXG4gICAgICAvLyBzYW1lIGFzIGFib3ZlLCBidXQgZG9lcyBub3QgYWRkIG5hbWVzIHRvIGxvY2FsIG1hcFxuICAgICAgRXhwb3J0TmFtZXNwYWNlU3BlY2lmaWVyKG5hbWVzcGFjZSkge1xuICAgICAgICBjb25zdCBkZWNsYXJhdGlvbiA9IGltcG9ydERlY2xhcmF0aW9uKGNvbnRleHQpO1xuXG4gICAgICAgIGNvbnN0IGltcG9ydHMgPSBFeHBvcnRzLmdldChkZWNsYXJhdGlvbi5zb3VyY2UudmFsdWUsIGNvbnRleHQpO1xuICAgICAgICBpZiAoaW1wb3J0cyA9PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBpZiAoaW1wb3J0cy5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgaW1wb3J0cy5yZXBvcnRFcnJvcnMoY29udGV4dCwgZGVjbGFyYXRpb24pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW1wb3J0cy5zaXplKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgICBuYW1lc3BhY2UsXG4gICAgICAgICAgICBgTm8gZXhwb3J0ZWQgbmFtZXMgZm91bmQgaW4gbW9kdWxlICcke2RlY2xhcmF0aW9uLnNvdXJjZS52YWx1ZX0nLmAsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLy8gdG9kbzogY2hlY2sgZm9yIHBvc3NpYmxlIHJlZGVmaW5pdGlvblxuXG4gICAgICBNZW1iZXJFeHByZXNzaW9uKGRlcmVmZXJlbmNlKSB7XG4gICAgICAgIGlmIChkZXJlZmVyZW5jZS5vYmplY3QudHlwZSAhPT0gJ0lkZW50aWZpZXInKSByZXR1cm47XG4gICAgICAgIGlmICghbmFtZXNwYWNlcy5oYXMoZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWUpKSByZXR1cm47XG4gICAgICAgIGlmIChkZWNsYXJlZFNjb3BlKGNvbnRleHQsIGRlcmVmZXJlbmNlLm9iamVjdC5uYW1lKSAhPT0gJ21vZHVsZScpIHJldHVybjtcblxuICAgICAgICBpZiAoZGVyZWZlcmVuY2UucGFyZW50LnR5cGUgPT09ICdBc3NpZ25tZW50RXhwcmVzc2lvbicgJiYgZGVyZWZlcmVuY2UucGFyZW50LmxlZnQgPT09IGRlcmVmZXJlbmNlKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgICBkZXJlZmVyZW5jZS5wYXJlbnQsXG4gICAgICAgICAgICBgQXNzaWdubWVudCB0byBtZW1iZXIgb2YgbmFtZXNwYWNlICcke2RlcmVmZXJlbmNlLm9iamVjdC5uYW1lfScuYCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ28gZGVlcFxuICAgICAgICBsZXQgbmFtZXNwYWNlID0gbmFtZXNwYWNlcy5nZXQoZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWUpO1xuICAgICAgICBjb25zdCBuYW1lcGF0aCA9IFtkZXJlZmVyZW5jZS5vYmplY3QubmFtZV07XG4gICAgICAgIC8vIHdoaWxlIHByb3BlcnR5IGlzIG5hbWVzcGFjZSBhbmQgcGFyZW50IGlzIG1lbWJlciBleHByZXNzaW9uLCBrZWVwIHZhbGlkYXRpbmdcbiAgICAgICAgd2hpbGUgKG5hbWVzcGFjZSBpbnN0YW5jZW9mIEV4cG9ydHMgJiYgZGVyZWZlcmVuY2UudHlwZSA9PT0gJ01lbWJlckV4cHJlc3Npb24nKSB7XG5cbiAgICAgICAgICBpZiAoZGVyZWZlcmVuY2UuY29tcHV0ZWQpIHtcbiAgICAgICAgICAgIGlmICghYWxsb3dDb21wdXRlZCkge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydChcbiAgICAgICAgICAgICAgICBkZXJlZmVyZW5jZS5wcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICBgVW5hYmxlIHRvIHZhbGlkYXRlIGNvbXB1dGVkIHJlZmVyZW5jZSB0byBpbXBvcnRlZCBuYW1lc3BhY2UgJyR7ZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWV9Jy5gLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghbmFtZXNwYWNlLmhhcyhkZXJlZmVyZW5jZS5wcm9wZXJ0eS5uYW1lKSkge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgICAgIGRlcmVmZXJlbmNlLnByb3BlcnR5LFxuICAgICAgICAgICAgICBtYWtlTWVzc2FnZShkZXJlZmVyZW5jZS5wcm9wZXJ0eSwgbmFtZXBhdGgpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGV4cG9ydGVkID0gbmFtZXNwYWNlLmdldChkZXJlZmVyZW5jZS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICBpZiAoZXhwb3J0ZWQgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgICAgLy8gc3Rhc2ggYW5kIHBvcFxuICAgICAgICAgIG5hbWVwYXRoLnB1c2goZGVyZWZlcmVuY2UucHJvcGVydHkubmFtZSk7XG4gICAgICAgICAgbmFtZXNwYWNlID0gZXhwb3J0ZWQubmFtZXNwYWNlO1xuICAgICAgICAgIGRlcmVmZXJlbmNlID0gZGVyZWZlcmVuY2UucGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgIH0sXG5cbiAgICAgIFZhcmlhYmxlRGVjbGFyYXRvcih7IGlkLCBpbml0IH0pIHtcbiAgICAgICAgaWYgKGluaXQgPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBpZiAoaW5pdC50eXBlICE9PSAnSWRlbnRpZmllcicpIHJldHVybjtcbiAgICAgICAgaWYgKCFuYW1lc3BhY2VzLmhhcyhpbml0Lm5hbWUpKSByZXR1cm47XG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIHJlZGVmaW5pdGlvbiBpbiBpbnRlcm1lZGlhdGUgc2NvcGVzXG4gICAgICAgIGlmIChkZWNsYXJlZFNjb3BlKGNvbnRleHQsIGluaXQubmFtZSkgIT09ICdtb2R1bGUnKSByZXR1cm47XG5cbiAgICAgICAgLy8gREZTIHRyYXZlcnNlIGNoaWxkIG5hbWVzcGFjZXNcbiAgICAgICAgZnVuY3Rpb24gdGVzdEtleShwYXR0ZXJuLCBuYW1lc3BhY2UsIHBhdGggPSBbaW5pdC5uYW1lXSkge1xuICAgICAgICAgIGlmICghKG5hbWVzcGFjZSBpbnN0YW5jZW9mIEV4cG9ydHMpKSByZXR1cm47XG5cbiAgICAgICAgICBpZiAocGF0dGVybi50eXBlICE9PSAnT2JqZWN0UGF0dGVybicpIHJldHVybjtcblxuICAgICAgICAgIGZvciAoY29uc3QgcHJvcGVydHkgb2YgcGF0dGVybi5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHByb3BlcnR5LnR5cGUgPT09ICdFeHBlcmltZW50YWxSZXN0UHJvcGVydHknXG4gICAgICAgICAgICAgIHx8IHByb3BlcnR5LnR5cGUgPT09ICdSZXN0RWxlbWVudCdcbiAgICAgICAgICAgICAgfHwgIXByb3BlcnR5LmtleVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocHJvcGVydHkua2V5LnR5cGUgIT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgbm9kZTogcHJvcGVydHksXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ09ubHkgZGVzdHJ1Y3R1cmUgdG9wLWxldmVsIG5hbWVzLicsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFuYW1lc3BhY2UuaGFzKHByb3BlcnR5LmtleS5uYW1lKSkge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgbm9kZTogcHJvcGVydHksXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWFrZU1lc3NhZ2UocHJvcGVydHkua2V5LCBwYXRoKSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXRoLnB1c2gocHJvcGVydHkua2V5Lm5hbWUpO1xuICAgICAgICAgICAgY29uc3QgZGVwZW5kZW5jeUV4cG9ydE1hcCA9IG5hbWVzcGFjZS5nZXQocHJvcGVydHkua2V5Lm5hbWUpO1xuICAgICAgICAgICAgLy8gY291bGQgYmUgbnVsbCB3aGVuIGlnbm9yZWQgb3IgYW1iaWd1b3VzXG4gICAgICAgICAgICBpZiAoZGVwZW5kZW5jeUV4cG9ydE1hcCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICB0ZXN0S2V5KHByb3BlcnR5LnZhbHVlLCBkZXBlbmRlbmN5RXhwb3J0TWFwLm5hbWVzcGFjZSwgcGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXRoLnBvcCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRlc3RLZXkoaWQsIG5hbWVzcGFjZXMuZ2V0KGluaXQubmFtZSkpO1xuICAgICAgfSxcblxuICAgICAgSlNYTWVtYmVyRXhwcmVzc2lvbih7IG9iamVjdCwgcHJvcGVydHkgfSkge1xuICAgICAgICBpZiAoIW5hbWVzcGFjZXMuaGFzKG9iamVjdC5uYW1lKSkgcmV0dXJuO1xuICAgICAgICBjb25zdCBuYW1lc3BhY2UgPSBuYW1lc3BhY2VzLmdldChvYmplY3QubmFtZSk7XG4gICAgICAgIGlmICghbmFtZXNwYWNlLmhhcyhwcm9wZXJ0eS5uYW1lKSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGU6IHByb3BlcnR5LFxuICAgICAgICAgICAgbWVzc2FnZTogbWFrZU1lc3NhZ2UocHJvcGVydHksIFtvYmplY3QubmFtZV0pLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19