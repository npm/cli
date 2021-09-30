'use strict';




var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} /**
                                                                                                                                                                                                                                                                                                                                                                                 * @fileoverview Rule to disallow namespace import
                                                                                                                                                                                                                                                                                                                                                                                 * @author Radek Benkel
                                                                                                                                                                                                                                                                                                                                                                                 */ //------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('no-namespace') },

    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        ignore: {
          type: 'array',
          items: {
            type: 'string' },

          uniqueItems: true } } }] },





  create: function () {function create(context) {
      var firstOption = context.options[0] || {};
      var ignoreGlobs = firstOption.ignore;

      return {
        ImportNamespaceSpecifier: function () {function ImportNamespaceSpecifier(node) {
            if (ignoreGlobs && ignoreGlobs.find(function (glob) {return (0, _minimatch2['default'])(node.parent.source.value, glob, { matchBase: true });})) {
              return;
            }

            var scopeVariables = context.getScope().variables;
            var namespaceVariable = scopeVariables.find(function (variable) {return variable.defs[0].node === node;});
            var namespaceReferences = namespaceVariable.references;
            var namespaceIdentifiers = namespaceReferences.map(function (reference) {return reference.identifier;});
            var canFix = namespaceIdentifiers.length > 0 && !usesNamespaceAsObject(namespaceIdentifiers);

            context.report({
              node: node,
              message: 'Unexpected namespace import.',
              fix: canFix && function (fixer) {
                var scopeManager = context.getSourceCode().scopeManager;
                var fixes = [];

                // Pass 1: Collect variable names that are already in scope for each reference we want
                // to transform, so that we can be sure that we choose non-conflicting import names
                var importNameConflicts = {};
                namespaceIdentifiers.forEach(function (identifier) {
                  var parent = identifier.parent;
                  if (parent && parent.type === 'MemberExpression') {
                    var importName = getMemberPropertyName(parent);
                    var localConflicts = getVariableNamesInScope(scopeManager, parent);
                    if (!importNameConflicts[importName]) {
                      importNameConflicts[importName] = localConflicts;
                    } else {
                      localConflicts.forEach(function (c) {return importNameConflicts[importName].add(c);});
                    }
                  }
                });

                // Choose new names for each import
                var importNames = Object.keys(importNameConflicts);
                var importLocalNames = generateLocalNames(
                importNames,
                importNameConflicts,
                namespaceVariable.name);


                // Replace the ImportNamespaceSpecifier with a list of ImportSpecifiers
                var namedImportSpecifiers = importNames.map(function (importName) {return (
                    importName === importLocalNames[importName] ?
                    importName : String(
                    importName) + ' as ' + String(importLocalNames[importName]));});

                fixes.push(fixer.replaceText(node, '{ ' + String(namedImportSpecifiers.join(', ')) + ' }'));

                // Pass 2: Replace references to the namespace with references to the named imports
                namespaceIdentifiers.forEach(function (identifier) {
                  var parent = identifier.parent;
                  if (parent && parent.type === 'MemberExpression') {
                    var importName = getMemberPropertyName(parent);
                    fixes.push(fixer.replaceText(parent, importLocalNames[importName]));
                  }
                });

                return fixes;
              } });

          }return ImportNamespaceSpecifier;}() };

    }return create;}() };


/**
                           * @param {Identifier[]} namespaceIdentifiers
                           * @returns {boolean} `true` if the namespace variable is more than just a glorified constant
                           */
function usesNamespaceAsObject(namespaceIdentifiers) {
  return !namespaceIdentifiers.every(function (identifier) {
    var parent = identifier.parent;

    // `namespace.x` or `namespace['x']`
    return (
      parent && parent.type === 'MemberExpression' && (
      parent.property.type === 'Identifier' || parent.property.type === 'Literal'));

  });
}

/**
   * @param {MemberExpression} memberExpression
   * @returns {string} the name of the member in the object expression, e.g. the `x` in `namespace.x`
   */
function getMemberPropertyName(memberExpression) {
  return memberExpression.property.type === 'Identifier' ?
  memberExpression.property.name :
  memberExpression.property.value;
}

/**
   * @param {ScopeManager} scopeManager
   * @param {ASTNode} node
   * @return {Set<string>}
   */
function getVariableNamesInScope(scopeManager, node) {
  var currentNode = node;
  var scope = scopeManager.acquire(currentNode);
  while (scope == null) {
    currentNode = currentNode.parent;
    scope = scopeManager.acquire(currentNode, true);
  }
  return new Set([].concat(_toConsumableArray(
  scope.variables.map(function (variable) {return variable.name;})), _toConsumableArray(
  scope.upper.variables.map(function (variable) {return variable.name;}))));

}

/**
   *
   * @param {*} names
   * @param {*} nameConflicts
   * @param {*} namespaceName
   */
function generateLocalNames(names, nameConflicts, namespaceName) {
  var localNames = {};
  names.forEach(function (name) {
    var localName = void 0;
    if (!nameConflicts[name].has(name)) {
      localName = name;
    } else if (!nameConflicts[name].has(String(namespaceName) + '_' + String(name))) {
      localName = String(namespaceName) + '_' + String(name);
    } else {
      for (var i = 1; i < Infinity; i++) {
        if (!nameConflicts[name].has(String(namespaceName) + '_' + String(name) + '_' + String(i))) {
          localName = String(namespaceName) + '_' + String(name) + '_' + String(i);
          break;
        }
      }
    }
    localNames[name] = localName;
  });
  return localNames;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1uYW1lc3BhY2UuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsInVybCIsImZpeGFibGUiLCJzY2hlbWEiLCJwcm9wZXJ0aWVzIiwiaWdub3JlIiwiaXRlbXMiLCJ1bmlxdWVJdGVtcyIsImNyZWF0ZSIsImNvbnRleHQiLCJmaXJzdE9wdGlvbiIsIm9wdGlvbnMiLCJpZ25vcmVHbG9icyIsIkltcG9ydE5hbWVzcGFjZVNwZWNpZmllciIsIm5vZGUiLCJmaW5kIiwicGFyZW50Iiwic291cmNlIiwidmFsdWUiLCJnbG9iIiwibWF0Y2hCYXNlIiwic2NvcGVWYXJpYWJsZXMiLCJnZXRTY29wZSIsInZhcmlhYmxlcyIsIm5hbWVzcGFjZVZhcmlhYmxlIiwidmFyaWFibGUiLCJkZWZzIiwibmFtZXNwYWNlUmVmZXJlbmNlcyIsInJlZmVyZW5jZXMiLCJuYW1lc3BhY2VJZGVudGlmaWVycyIsIm1hcCIsInJlZmVyZW5jZSIsImlkZW50aWZpZXIiLCJjYW5GaXgiLCJsZW5ndGgiLCJ1c2VzTmFtZXNwYWNlQXNPYmplY3QiLCJyZXBvcnQiLCJtZXNzYWdlIiwiZml4Iiwic2NvcGVNYW5hZ2VyIiwiZ2V0U291cmNlQ29kZSIsImZpeGVzIiwiaW1wb3J0TmFtZUNvbmZsaWN0cyIsImZvckVhY2giLCJpbXBvcnROYW1lIiwiZ2V0TWVtYmVyUHJvcGVydHlOYW1lIiwibG9jYWxDb25mbGljdHMiLCJnZXRWYXJpYWJsZU5hbWVzSW5TY29wZSIsImMiLCJhZGQiLCJpbXBvcnROYW1lcyIsIk9iamVjdCIsImtleXMiLCJpbXBvcnRMb2NhbE5hbWVzIiwiZ2VuZXJhdGVMb2NhbE5hbWVzIiwibmFtZSIsIm5hbWVkSW1wb3J0U3BlY2lmaWVycyIsInB1c2giLCJmaXhlciIsInJlcGxhY2VUZXh0Iiwiam9pbiIsImV2ZXJ5IiwicHJvcGVydHkiLCJtZW1iZXJFeHByZXNzaW9uIiwiY3VycmVudE5vZGUiLCJzY29wZSIsImFjcXVpcmUiLCJTZXQiLCJ1cHBlciIsIm5hbWVzIiwibmFtZUNvbmZsaWN0cyIsIm5hbWVzcGFjZU5hbWUiLCJsb2NhbE5hbWVzIiwibG9jYWxOYW1lIiwiaGFzIiwiaSIsIkluZmluaXR5Il0sIm1hcHBpbmdzIjoiOzs7OztBQUtBLHNDO0FBQ0EscUMsMlVBTkE7OztvWEFRQTtBQUNBO0FBQ0E7O0FBR0FBLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKQyxVQUFNLFlBREY7QUFFSkMsVUFBTTtBQUNKQyxXQUFLLDBCQUFRLGNBQVIsQ0FERCxFQUZGOztBQUtKQyxhQUFTLE1BTEw7QUFNSkMsWUFBUSxDQUFDO0FBQ1BKLFlBQU0sUUFEQztBQUVQSyxrQkFBWTtBQUNWQyxnQkFBUTtBQUNOTixnQkFBTSxPQURBO0FBRU5PLGlCQUFPO0FBQ0xQLGtCQUFNLFFBREQsRUFGRDs7QUFLTlEsdUJBQWEsSUFMUCxFQURFLEVBRkwsRUFBRCxDQU5KLEVBRFM7Ozs7OztBQXFCZkMsdUJBQVEsZ0JBQVVDLE9BQVYsRUFBbUI7QUFDekIsVUFBTUMsY0FBY0QsUUFBUUUsT0FBUixDQUFnQixDQUFoQixLQUFzQixFQUExQztBQUNBLFVBQU1DLGNBQWNGLFlBQVlMLE1BQWhDOztBQUVBLGFBQU87QUFDTFEsZ0NBREssaURBQ29CQyxJQURwQixFQUMwQjtBQUM3QixnQkFBSUYsZUFBZUEsWUFBWUcsSUFBWixDQUFpQix3QkFBUSw0QkFBVUQsS0FBS0UsTUFBTCxDQUFZQyxNQUFaLENBQW1CQyxLQUE3QixFQUFvQ0MsSUFBcEMsRUFBMEMsRUFBRUMsV0FBVyxJQUFiLEVBQTFDLENBQVIsRUFBakIsQ0FBbkIsRUFBNkc7QUFDM0c7QUFDRDs7QUFFRCxnQkFBTUMsaUJBQWlCWixRQUFRYSxRQUFSLEdBQW1CQyxTQUExQztBQUNBLGdCQUFNQyxvQkFBb0JILGVBQWVOLElBQWYsQ0FBb0IsVUFBQ1UsUUFBRCxVQUFjQSxTQUFTQyxJQUFULENBQWMsQ0FBZCxFQUFpQlosSUFBakIsS0FBMEJB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QUZELE1BRU8sSUFBSSxDQUFDZSxjQUFjZixJQUFkLEVBQW9CbUIsR0FBcEIsUUFBMkJILGFBQTNCLGlCQUE0Q2hCLElBQTVDLEVBQUwsRUFBMEQ7QUFDL0RrQix5QkFBZUYsYUFBZixpQkFBZ0NoQixJQUFoQztBQUNELEtBRk0sTUFFQTtBQUNMLFdBQUssSUFBSW9CLElBQUksQ0FBYixFQUFnQkEsSUFBSUMsUUFBcEIsRUFBOEJELEdBQTlCLEVBQW1DO0FBQ2pDLFlBQUksQ0FBQ0wsY0FBY2YsSUFBZCxFQUFvQm1CLEdBQXBCLFFBQTJCSCxhQUEzQixpQkFBNENoQixJQUE1QyxpQkFBb0RvQixDQUFwRCxFQUFMLEVBQStEO0FBQzdERiw2QkFBZUYsYUFBZixpQkFBZ0NoQixJQUFoQyxpQkFBd0NvQixDQUF4QztBQUNBO0FBQ0Q7QUFDRjtBQUNGO0FBQ0RILGVBQVdqQixJQUFYLElBQW1Ca0IsU0FBbkI7QUFDRCxHQWZEO0FBZ0JBLFNBQU9ELFVBQVA7QUFDRCIsImZpbGUiOiJuby1uYW1lc3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUnVsZSB0byBkaXNhbGxvdyBuYW1lc3BhY2UgaW1wb3J0XG4gKiBAYXV0aG9yIFJhZGVrIEJlbmtlbFxuICovXG5cbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUnVsZSBEZWZpbml0aW9uXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIHVybDogZG9jc1VybCgnbm8tbmFtZXNwYWNlJyksXG4gICAgfSxcbiAgICBmaXhhYmxlOiAnY29kZScsXG4gICAgc2NoZW1hOiBbe1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlnbm9yZToge1xuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdW5pcXVlSXRlbXM6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH1dLFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICBjb25zdCBmaXJzdE9wdGlvbiA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcbiAgICBjb25zdCBpZ25vcmVHbG9icyA9IGZpcnN0T3B0aW9uLmlnbm9yZTtcblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXIobm9kZSkge1xuICAgICAgICBpZiAoaWdub3JlR2xvYnMgJiYgaWdub3JlR2xvYnMuZmluZChnbG9iID0+IG1pbmltYXRjaChub2RlLnBhcmVudC5zb3VyY2UudmFsdWUsIGdsb2IsIHsgbWF0Y2hCYXNlOiB0cnVlIH0pKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNjb3BlVmFyaWFibGVzID0gY29udGV4dC5nZXRTY29wZSgpLnZhcmlhYmxlcztcbiAgICAgICAgY29uc3QgbmFtZXNwYWNlVmFyaWFibGUgPSBzY29wZVZhcmlhYmxlcy5maW5kKCh2YXJpYWJsZSkgPT4gdmFyaWFibGUuZGVmc1swXS5ub2RlID09PSBub2RlKTtcbiAgICAgICAgY29uc3QgbmFtZXNwYWNlUmVmZXJlbmNlcyA9IG5hbWVzcGFjZVZhcmlhYmxlLnJlZmVyZW5jZXM7XG4gICAgICAgIGNvbnN0IG5hbWVzcGFjZUlkZW50aWZpZXJzID0gbmFtZXNwYWNlUmVmZXJlbmNlcy5tYXAocmVmZXJlbmNlID0+IHJlZmVyZW5jZS5pZGVudGlmaWVyKTtcbiAgICAgICAgY29uc3QgY2FuRml4ID0gbmFtZXNwYWNlSWRlbnRpZmllcnMubGVuZ3RoID4gMCAmJiAhdXNlc05hbWVzcGFjZUFzT2JqZWN0KG5hbWVzcGFjZUlkZW50aWZpZXJzKTtcblxuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiBgVW5leHBlY3RlZCBuYW1lc3BhY2UgaW1wb3J0LmAsXG4gICAgICAgICAgZml4OiBjYW5GaXggJiYgKGZpeGVyID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlTWFuYWdlciA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpLnNjb3BlTWFuYWdlcjtcbiAgICAgICAgICAgIGNvbnN0IGZpeGVzID0gW107XG5cbiAgICAgICAgICAgIC8vIFBhc3MgMTogQ29sbGVjdCB2YXJpYWJsZSBuYW1lcyB0aGF0IGFyZSBhbHJlYWR5IGluIHNjb3BlIGZvciBlYWNoIHJlZmVyZW5jZSB3ZSB3YW50XG4gICAgICAgICAgICAvLyB0byB0cmFuc2Zvcm0sIHNvIHRoYXQgd2UgY2FuIGJlIHN1cmUgdGhhdCB3ZSBjaG9vc2Ugbm9uLWNvbmZsaWN0aW5nIGltcG9ydCBuYW1lc1xuICAgICAgICAgICAgY29uc3QgaW1wb3J0TmFtZUNvbmZsaWN0cyA9IHt9O1xuICAgICAgICAgICAgbmFtZXNwYWNlSWRlbnRpZmllcnMuZm9yRWFjaCgoaWRlbnRpZmllcikgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBwYXJlbnQgPSBpZGVudGlmaWVyLnBhcmVudDtcbiAgICAgICAgICAgICAgaWYgKHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ01lbWJlckV4cHJlc3Npb24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1wb3J0TmFtZSA9IGdldE1lbWJlclByb3BlcnR5TmFtZShwYXJlbnQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsQ29uZmxpY3RzID0gZ2V0VmFyaWFibGVOYW1lc0luU2NvcGUoc2NvcGVNYW5hZ2VyLCBwYXJlbnQpO1xuICAgICAgICAgICAgICAgIGlmICghaW1wb3J0TmFtZUNvbmZsaWN0c1tpbXBvcnROYW1lXSkge1xuICAgICAgICAgICAgICAgICAgaW1wb3J0TmFtZUNvbmZsaWN0c1tpbXBvcnROYW1lXSA9IGxvY2FsQ29uZmxpY3RzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBsb2NhbENvbmZsaWN0cy5mb3JFYWNoKChjKSA9PiBpbXBvcnROYW1lQ29uZmxpY3RzW2ltcG9ydE5hbWVdLmFkZChjKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQ2hvb3NlIG5ldyBuYW1lcyBmb3IgZWFjaCBpbXBvcnRcbiAgICAgICAgICAgIGNvbnN0IGltcG9ydE5hbWVzID0gT2JqZWN0LmtleXMoaW1wb3J0TmFtZUNvbmZsaWN0cyk7XG4gICAgICAgICAgICBjb25zdCBpbXBvcnRMb2NhbE5hbWVzID0gZ2VuZXJhdGVMb2NhbE5hbWVzKFxuICAgICAgICAgICAgICBpbXBvcnROYW1lcyxcbiAgICAgICAgICAgICAgaW1wb3J0TmFtZUNvbmZsaWN0cyxcbiAgICAgICAgICAgICAgbmFtZXNwYWNlVmFyaWFibGUubmFtZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyIHdpdGggYSBsaXN0IG9mIEltcG9ydFNwZWNpZmllcnNcbiAgICAgICAgICAgIGNvbnN0IG5hbWVkSW1wb3J0U3BlY2lmaWVycyA9IGltcG9ydE5hbWVzLm1hcCgoaW1wb3J0TmFtZSkgPT4gKFxuICAgICAgICAgICAgICBpbXBvcnROYW1lID09PSBpbXBvcnRMb2NhbE5hbWVzW2ltcG9ydE5hbWVdXG4gICAgICAgICAgICAgICAgPyBpbXBvcnROYW1lXG4gICAgICAgICAgICAgICAgOiBgJHtpbXBvcnROYW1lfSBhcyAke2ltcG9ydExvY2FsTmFtZXNbaW1wb3J0TmFtZV19YFxuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLnJlcGxhY2VUZXh0KG5vZGUsIGB7ICR7bmFtZWRJbXBvcnRTcGVjaWZpZXJzLmpvaW4oJywgJyl9IH1gKSk7XG5cbiAgICAgICAgICAgIC8vIFBhc3MgMjogUmVwbGFjZSByZWZlcmVuY2VzIHRvIHRoZSBuYW1lc3BhY2Ugd2l0aCByZWZlcmVuY2VzIHRvIHRoZSBuYW1lZCBpbXBvcnRzXG4gICAgICAgICAgICBuYW1lc3BhY2VJZGVudGlmaWVycy5mb3JFYWNoKChpZGVudGlmaWVyKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IGlkZW50aWZpZXIucGFyZW50O1xuICAgICAgICAgICAgICBpZiAocGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbXBvcnROYW1lID0gZ2V0TWVtYmVyUHJvcGVydHlOYW1lKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgZml4ZXMucHVzaChmaXhlci5yZXBsYWNlVGV4dChwYXJlbnQsIGltcG9ydExvY2FsTmFtZXNbaW1wb3J0TmFtZV0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaXhlcztcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuXG4vKipcbiAqIEBwYXJhbSB7SWRlbnRpZmllcltdfSBuYW1lc3BhY2VJZGVudGlmaWVyc1xuICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgbmFtZXNwYWNlIHZhcmlhYmxlIGlzIG1vcmUgdGhhbiBqdXN0IGEgZ2xvcmlmaWVkIGNvbnN0YW50XG4gKi9cbmZ1bmN0aW9uIHVzZXNOYW1lc3BhY2VBc09iamVjdChuYW1lc3BhY2VJZGVudGlmaWVycykge1xuICByZXR1cm4gIW5hbWVzcGFjZUlkZW50aWZpZXJzLmV2ZXJ5KChpZGVudGlmaWVyKSA9PiB7XG4gICAgY29uc3QgcGFyZW50ID0gaWRlbnRpZmllci5wYXJlbnQ7XG5cbiAgICAvLyBgbmFtZXNwYWNlLnhgIG9yIGBuYW1lc3BhY2VbJ3gnXWBcbiAgICByZXR1cm4gKFxuICAgICAgcGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicgJiZcbiAgICAgIChwYXJlbnQucHJvcGVydHkudHlwZSA9PT0gJ0lkZW50aWZpZXInIHx8IHBhcmVudC5wcm9wZXJ0eS50eXBlID09PSAnTGl0ZXJhbCcpXG4gICAgKTtcbiAgfSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtNZW1iZXJFeHByZXNzaW9ufSBtZW1iZXJFeHByZXNzaW9uXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgbWVtYmVyIGluIHRoZSBvYmplY3QgZXhwcmVzc2lvbiwgZS5nLiB0aGUgYHhgIGluIGBuYW1lc3BhY2UueGBcbiAqL1xuZnVuY3Rpb24gZ2V0TWVtYmVyUHJvcGVydHlOYW1lKG1lbWJlckV4cHJlc3Npb24pIHtcbiAgcmV0dXJuIG1lbWJlckV4cHJlc3Npb24ucHJvcGVydHkudHlwZSA9PT0gJ0lkZW50aWZpZXInXG4gICAgPyBtZW1iZXJFeHByZXNzaW9uLnByb3BlcnR5Lm5hbWVcbiAgICA6IG1lbWJlckV4cHJlc3Npb24ucHJvcGVydHkudmFsdWU7XG59XG5cbi8qKlxuICogQHBhcmFtIHtTY29wZU1hbmFnZXJ9IHNjb3BlTWFuYWdlclxuICogQHBhcmFtIHtBU1ROb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtTZXQ8c3RyaW5nPn1cbiAqL1xuZnVuY3Rpb24gZ2V0VmFyaWFibGVOYW1lc0luU2NvcGUoc2NvcGVNYW5hZ2VyLCBub2RlKSB7XG4gIGxldCBjdXJyZW50Tm9kZSA9IG5vZGU7XG4gIGxldCBzY29wZSA9IHNjb3BlTWFuYWdlci5hY3F1aXJlKGN1cnJlbnROb2RlKTtcbiAgd2hpbGUgKHNjb3BlID09IG51bGwpIHtcbiAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLnBhcmVudDtcbiAgICBzY29wZSA9IHNjb3BlTWFuYWdlci5hY3F1aXJlKGN1cnJlbnROb2RlLCB0cnVlKTtcbiAgfVxuICByZXR1cm4gbmV3IFNldChbXG4gICAgLi4uc2NvcGUudmFyaWFibGVzLm1hcCh2YXJpYWJsZSA9PiB2YXJpYWJsZS5uYW1lKSxcbiAgICAuLi5zY29wZS51cHBlci52YXJpYWJsZXMubWFwKHZhcmlhYmxlID0+IHZhcmlhYmxlLm5hbWUpLFxuICBdKTtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHsqfSBuYW1lc1xuICogQHBhcmFtIHsqfSBuYW1lQ29uZmxpY3RzXG4gKiBAcGFyYW0geyp9IG5hbWVzcGFjZU5hbWVcbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVMb2NhbE5hbWVzKG5hbWVzLCBuYW1lQ29uZmxpY3RzLCBuYW1lc3BhY2VOYW1lKSB7XG4gIGNvbnN0IGxvY2FsTmFtZXMgPSB7fTtcbiAgbmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgIGxldCBsb2NhbE5hbWU7XG4gICAgaWYgKCFuYW1lQ29uZmxpY3RzW25hbWVdLmhhcyhuYW1lKSkge1xuICAgICAgbG9jYWxOYW1lID0gbmFtZTtcbiAgICB9IGVsc2UgaWYgKCFuYW1lQ29uZmxpY3RzW25hbWVdLmhhcyhgJHtuYW1lc3BhY2VOYW1lfV8ke25hbWV9YCkpIHtcbiAgICAgIGxvY2FsTmFtZSA9IGAke25hbWVzcGFjZU5hbWV9XyR7bmFtZX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IEluZmluaXR5OyBpKyspIHtcbiAgICAgICAgaWYgKCFuYW1lQ29uZmxpY3RzW25hbWVdLmhhcyhgJHtuYW1lc3BhY2VOYW1lfV8ke25hbWV9XyR7aX1gKSkge1xuICAgICAgICAgIGxvY2FsTmFtZSA9IGAke25hbWVzcGFjZU5hbWV9XyR7bmFtZX1fJHtpfWA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbG9jYWxOYW1lc1tuYW1lXSA9IGxvY2FsTmFtZTtcbiAgfSk7XG4gIHJldHVybiBsb2NhbE5hbWVzO1xufVxuIl19