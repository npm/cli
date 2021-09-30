'use strict';var _declaredScope = require('eslint-module-utils/declaredScope');var _declaredScope2 = _interopRequireDefault(_declaredScope);
var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function message(deprecation) {
  return 'Deprecated' + (deprecation.description ? ': ' + deprecation.description : '.');
}

function getDeprecation(metadata) {
  if (!metadata || !metadata.doc) return;

  return metadata.doc.tags.find(function (t) {return t.title === 'deprecated';});
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('no-deprecated') },

    schema: [] },


  create: function () {function create(context) {
      var deprecated = new Map();
      var namespaces = new Map();

      function checkSpecifiers(node) {
        if (node.type !== 'ImportDeclaration') return;
        if (node.source == null) return; // local export, ignore

        var imports = _ExportMap2['default'].get(node.source.value, context);
        if (imports == null) return;

        var moduleDeprecation = imports.doc && imports.doc.tags.find(function (t) {return t.title === 'deprecated';});
        if (moduleDeprecation) {
          context.report({ node: node, message: message(moduleDeprecation) });
        }

        if (imports.errors.length) {
          imports.reportErrors(context, node);
          return;
        }

        node.specifiers.forEach(function (im) {
          var imported = void 0;var local = void 0;
          switch (im.type) {


            case 'ImportNamespaceSpecifier':{
                if (!imports.size) return;
                namespaces.set(im.local.name, imports);
                return;
              }

            case 'ImportDefaultSpecifier':
              imported = 'default';
              local = im.local.name;
              break;

            case 'ImportSpecifier':
              imported = im.imported.name;
              local = im.local.name;
              break;

            default:return; // can't handle this one
          }

          // unknown thing can't be deprecated
          var exported = imports.get(imported);
          if (exported == null) return;

          // capture import of deep namespace
          if (exported.namespace) namespaces.set(local, exported.namespace);

          var deprecation = getDeprecation(imports.get(imported));
          if (!deprecation) return;

          context.report({ node: im, message: message(deprecation) });

          deprecated.set(local, deprecation);

        });
      }

      return {
        'Program': function () {function Program(_ref) {var body = _ref.body;return body.forEach(checkSpecifiers);}return Program;}(),

        'Identifier': function () {function Identifier(node) {
            if (node.parent.type === 'MemberExpression' && node.parent.property === node) {
              return; // handled by MemberExpression
            }

            // ignore specifier identifiers
            if (node.parent.type.slice(0, 6) === 'Import') return;

            if (!deprecated.has(node.name)) return;

            if ((0, _declaredScope2['default'])(context, node.name) !== 'module') return;
            context.report({
              node: node,
              message: message(deprecated.get(node.name)) });

          }return Identifier;}(),

        'MemberExpression': function () {function MemberExpression(dereference) {
            if (dereference.object.type !== 'Identifier') return;
            if (!namespaces.has(dereference.object.name)) return;

            if ((0, _declaredScope2['default'])(context, dereference.object.name) !== 'module') return;

            // go deep
            var namespace = namespaces.get(dereference.object.name);
            var namepath = [dereference.object.name];
            // while property is namespace and parent is member expression, keep validating
            while (namespace instanceof _ExportMap2['default'] &&
            dereference.type === 'MemberExpression') {

              // ignore computed parts for now
              if (dereference.computed) return;

              var metadata = namespace.get(dereference.property.name);

              if (!metadata) break;
              var deprecation = getDeprecation(metadata);

              if (deprecation) {
                context.report({ node: dereference.property, message: message(deprecation) });
              }

              // stash and pop
              namepath.push(dereference.property.name);
              namespace = metadata.namespace;
              dereference = dereference.parent;
            }
          }return MemberExpression;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1kZXByZWNhdGVkLmpzIl0sIm5hbWVzIjpbIm1lc3NhZ2UiLCJkZXByZWNhdGlvbiIsImRlc2NyaXB0aW9uIiwiZ2V0RGVwcmVjYXRpb24iLCJtZXRhZGF0YSIsImRvYyIsInRhZ3MiLCJmaW5kIiwidCIsInRpdGxlIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsInVybCIsInNjaGVtYSIsImNyZWF0ZSIsImNvbnRleHQiLCJkZXByZWNhdGVkIiwiTWFwIiwibmFtZXNwYWNlcyIsImNoZWNrU3BlY2lmaWVycyIsIm5vZGUiLCJzb3VyY2UiLCJpbXBvcnRzIiwiRXhwb3J0cyIsImdldCIsInZhbHVlIiwibW9kdWxlRGVwcmVjYXRpb24iLCJyZXBvcnQiLCJlcnJvcnMiLCJsZW5ndGgiLCJyZXBvcnRFcnJvcnMiLCJzcGVjaWZpZXJzIiwiZm9yRWFjaCIsImltIiwiaW1wb3J0ZWQiLCJsb2NhbCIsInNpemUiLCJzZXQiLCJuYW1lIiwiZXhwb3J0ZWQiLCJuYW1lc3BhY2UiLCJib2R5IiwicGFyZW50IiwicHJvcGVydHkiLCJzbGljZSIsImhhcyIsImRlcmVmZXJlbmNlIiwib2JqZWN0IiwibmFtZXBhdGgiLCJjb21wdXRlZCIsInB1c2giXSwibWFwcGluZ3MiOiJhQUFBLGtFO0FBQ0EseUM7QUFDQSxxQzs7QUFFQSxTQUFTQSxPQUFULENBQWlCQyxXQUFqQixFQUE4QjtBQUM1QixTQUFPLGdCQUFnQkEsWUFBWUMsV0FBWixHQUEwQixPQUFPRCxZQUFZQyxXQUE3QyxHQUEyRCxHQUEzRSxDQUFQO0FBQ0Q7O0FBRUQsU0FBU0MsY0FBVCxDQUF3QkMsUUFBeEIsRUFBa0M7QUFDaEMsTUFBSSxDQUFDQSxRQUFELElBQWEsQ0FBQ0EsU0FBU0MsR0FBM0IsRUFBZ0M7O0FBRWhDLFNBQU9ELFNBQVNDLEdBQVQsQ0FBYUMsSUFBYixDQUFrQkMsSUFBbEIsQ0FBdUIscUJBQUtDLEVBQUVDLEtBQUYsS0FBWSxZ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aEQsV0FBV3VDLFVBQVVoQixHQUFWLENBQWNzQixZQUFZSCxRQUFaLENBQXFCTCxJQUFuQyxDQUFqQjs7QUFFQSxrQkFBSSxDQUFDckMsUUFBTCxFQUFlO0FBQ2Ysa0JBQU1ILGNBQWNFLGVBQWVDLFFBQWYsQ0FBcEI7O0FBRUEsa0JBQUlILFdBQUosRUFBaUI7QUFDZmlCLHdCQUFRWSxNQUFSLENBQWUsRUFBRVAsTUFBTTBCLFlBQVlILFFBQXBCLEVBQThCOUMsU0FBU0EsUUFBUUMsV0FBUixDQUF2QyxFQUFmO0FBQ0Q7O0FBRUQ7QUFDQWtELHVCQUFTRSxJQUFULENBQWNKLFlBQVlILFFBQVosQ0FBcUJMLElBQW5DO0FBQ0FFLDBCQUFZdkMsU0FBU3VDLFNBQXJCO0FBQ0FNLDRCQUFjQSxZQUFZSixNQUExQjtBQUNEO0FBQ0YsV0E5QkQsMkJBcEJLLEVBQVA7O0FBb0RELEtBbEhELGlCQVRlLEVBQWpCIiwiZmlsZSI6Im5vLWRlcHJlY2F0ZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVjbGFyZWRTY29wZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2RlY2xhcmVkU2NvcGUnO1xuaW1wb3J0IEV4cG9ydHMgZnJvbSAnLi4vRXhwb3J0TWFwJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5mdW5jdGlvbiBtZXNzYWdlKGRlcHJlY2F0aW9uKSB7XG4gIHJldHVybiAnRGVwcmVjYXRlZCcgKyAoZGVwcmVjYXRpb24uZGVzY3JpcHRpb24gPyAnOiAnICsgZGVwcmVjYXRpb24uZGVzY3JpcHRpb24gOiAnLicpO1xufVxuXG5mdW5jdGlvbiBnZXREZXByZWNhdGlvbihtZXRhZGF0YSkge1xuICBpZiAoIW1ldGFkYXRhIHx8ICFtZXRhZGF0YS5kb2MpIHJldHVybjtcblxuICByZXR1cm4gbWV0YWRhdGEuZG9jLnRhZ3MuZmluZCh0ID0+IHQudGl0bGUgPT09ICdkZXByZWNhdGVkJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIHVybDogZG9jc1VybCgnbm8tZGVwcmVjYXRlZCcpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgY29uc3QgZGVwcmVjYXRlZCA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBuYW1lc3BhY2VzID0gbmV3IE1hcCgpO1xuXG4gICAgZnVuY3Rpb24gY2hlY2tTcGVjaWZpZXJzKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLnR5cGUgIT09ICdJbXBvcnREZWNsYXJhdGlvbicpIHJldHVybjtcbiAgICAgIGlmIChub2RlLnNvdXJjZSA9PSBudWxsKSByZXR1cm47IC8vIGxvY2FsIGV4cG9ydCwgaWdub3JlXG5cbiAgICAgIGNvbnN0IGltcG9ydHMgPSBFeHBvcnRzLmdldChub2RlLnNvdXJjZS52YWx1ZSwgY29udGV4dCk7XG4gICAgICBpZiAoaW1wb3J0cyA9PSBudWxsKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IG1vZHVsZURlcHJlY2F0aW9uID0gaW1wb3J0cy5kb2MgJiYgaW1wb3J0cy5kb2MudGFncy5maW5kKHQgPT4gdC50aXRsZSA9PT0gJ2RlcHJlY2F0ZWQnKTtcbiAgICAgIGlmIChtb2R1bGVEZXByZWNhdGlvbikge1xuICAgICAgICBjb250ZXh0LnJlcG9ydCh7IG5vZGUsIG1lc3NhZ2U6IG1lc3NhZ2UobW9kdWxlRGVwcmVjYXRpb24pIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW1wb3J0cy5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIGltcG9ydHMucmVwb3J0RXJyb3JzKGNvbnRleHQsIG5vZGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG5vZGUuc3BlY2lmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChpbSkge1xuICAgICAgICBsZXQgaW1wb3J0ZWQ7IGxldCBsb2NhbDtcbiAgICAgICAgc3dpdGNoIChpbS50eXBlKSB7XG5cblxuICAgICAgICBjYXNlICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInOntcbiAgICAgICAgICBpZiAoIWltcG9ydHMuc2l6ZSkgcmV0dXJuO1xuICAgICAgICAgIG5hbWVzcGFjZXMuc2V0KGltLmxvY2FsLm5hbWUsIGltcG9ydHMpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInOlxuICAgICAgICAgIGltcG9ydGVkID0gJ2RlZmF1bHQnO1xuICAgICAgICAgIGxvY2FsID0gaW0ubG9jYWwubmFtZTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdJbXBvcnRTcGVjaWZpZXInOlxuICAgICAgICAgIGltcG9ydGVkID0gaW0uaW1wb3J0ZWQubmFtZTtcbiAgICAgICAgICBsb2NhbCA9IGltLmxvY2FsLm5hbWU7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDogcmV0dXJuOyAvLyBjYW4ndCBoYW5kbGUgdGhpcyBvbmVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVua25vd24gdGhpbmcgY2FuJ3QgYmUgZGVwcmVjYXRlZFxuICAgICAgICBjb25zdCBleHBvcnRlZCA9IGltcG9ydHMuZ2V0KGltcG9ydGVkKTtcbiAgICAgICAgaWYgKGV4cG9ydGVkID09IG51bGwpIHJldHVybjtcblxuICAgICAgICAvLyBjYXB0dXJlIGltcG9ydCBvZiBkZWVwIG5hbWVzcGFjZVxuICAgICAgICBpZiAoZXhwb3J0ZWQubmFtZXNwYWNlKSBuYW1lc3BhY2VzLnNldChsb2NhbCwgZXhwb3J0ZWQubmFtZXNwYWNlKTtcblxuICAgICAgICBjb25zdCBkZXByZWNhdGlvbiA9IGdldERlcHJlY2F0aW9uKGltcG9ydHMuZ2V0KGltcG9ydGVkKSk7XG4gICAgICAgIGlmICghZGVwcmVjYXRpb24pIHJldHVybjtcblxuICAgICAgICBjb250ZXh0LnJlcG9ydCh7IG5vZGU6IGltLCBtZXNzYWdlOiBtZXNzYWdlKGRlcHJlY2F0aW9uKSB9KTtcblxuICAgICAgICBkZXByZWNhdGVkLnNldChsb2NhbCwgZGVwcmVjYXRpb24pO1xuXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgJ1Byb2dyYW0nOiAoeyBib2R5IH0pID0+IGJvZHkuZm9yRWFjaChjaGVja1NwZWNpZmllcnMpLFxuXG4gICAgICAnSWRlbnRpZmllcic6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGlmIChub2RlLnBhcmVudC50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicgJiYgbm9kZS5wYXJlbnQucHJvcGVydHkgPT09IG5vZGUpIHtcbiAgICAgICAgICByZXR1cm47IC8vIGhhbmRsZWQgYnkgTWVtYmVyRXhwcmVzc2lvblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWdub3JlIHNwZWNpZmllciBpZGVudGlmaWVyc1xuICAgICAgICBpZiAobm9kZS5wYXJlbnQudHlwZS5zbGljZSgwLCA2KSA9PT0gJ0ltcG9ydCcpIHJldHVybjtcblxuICAgICAgICBpZiAoIWRlcHJlY2F0ZWQuaGFzKG5vZGUubmFtZSkpIHJldHVybjtcblxuICAgICAgICBpZiAoZGVjbGFyZWRTY29wZShjb250ZXh0LCBub2RlLm5hbWUpICE9PSAnbW9kdWxlJykgcmV0dXJuO1xuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlKGRlcHJlY2F0ZWQuZ2V0KG5vZGUubmFtZSkpLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgICdNZW1iZXJFeHByZXNzaW9uJzogZnVuY3Rpb24gKGRlcmVmZXJlbmNlKSB7XG4gICAgICAgIGlmIChkZXJlZmVyZW5jZS5vYmplY3QudHlwZSAhPT0gJ0lkZW50aWZpZXInKSByZXR1cm47XG4gICAgICAgIGlmICghbmFtZXNwYWNlcy5oYXMoZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWUpKSByZXR1cm47XG5cbiAgICAgICAgaWYgKGRlY2xhcmVkU2NvcGUoY29udGV4dCwgZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWUpICE9PSAnbW9kdWxlJykgcmV0dXJuO1xuXG4gICAgICAgIC8vIGdvIGRlZXBcbiAgICAgICAgbGV0IG5hbWVzcGFjZSA9IG5hbWVzcGFjZXMuZ2V0KGRlcmVmZXJlbmNlLm9iamVjdC5uYW1lKTtcbiAgICAgICAgY29uc3QgbmFtZXBhdGggPSBbZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWVdO1xuICAgICAgICAvLyB3aGlsZSBwcm9wZXJ0eSBpcyBuYW1lc3BhY2UgYW5kIHBhcmVudCBpcyBtZW1iZXIgZXhwcmVzc2lvbiwga2VlcCB2YWxpZGF0aW5nXG4gICAgICAgIHdoaWxlIChuYW1lc3BhY2UgaW5zdGFuY2VvZiBFeHBvcnRzICYmXG4gICAgICAgICAgICAgICBkZXJlZmVyZW5jZS50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicpIHtcblxuICAgICAgICAgIC8vIGlnbm9yZSBjb21wdXRlZCBwYXJ0cyBmb3Igbm93XG4gICAgICAgICAgaWYgKGRlcmVmZXJlbmNlLmNvbXB1dGVkKSByZXR1cm47XG5cbiAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IG5hbWVzcGFjZS5nZXQoZGVyZWZlcmVuY2UucHJvcGVydHkubmFtZSk7XG5cbiAgICAgICAgICBpZiAoIW1ldGFkYXRhKSBicmVhaztcbiAgICAgICAgICBjb25zdCBkZXByZWNhdGlvbiA9IGdldERlcHJlY2F0aW9uKG1ldGFkYXRhKTtcblxuICAgICAgICAgIGlmIChkZXByZWNhdGlvbikge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoeyBub2RlOiBkZXJlZmVyZW5jZS5wcm9wZXJ0eSwgbWVzc2FnZTogbWVzc2FnZShkZXByZWNhdGlvbikgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gc3Rhc2ggYW5kIHBvcFxuICAgICAgICAgIG5hbWVwYXRoLnB1c2goZGVyZWZlcmVuY2UucHJvcGVydHkubmFtZSk7XG4gICAgICAgICAgbmFtZXNwYWNlID0gbWV0YWRhdGEubmFtZXNwYWNlO1xuICAgICAgICAgIGRlcmVmZXJlbmNlID0gZGVyZWZlcmVuY2UucGFyZW50O1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19