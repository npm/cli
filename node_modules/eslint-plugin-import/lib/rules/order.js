'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();

var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);
var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);
var _staticRequire = require('../core/staticRequire');var _staticRequire2 = _interopRequireDefault(_staticRequire);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var defaultGroups = ['builtin', 'external', 'parent', 'sibling', 'index'];

// REPORTING AND FIXING

function reverse(array) {
  return array.map(function (v) {
    return Object.assign({}, v, { rank: -v.rank });
  }).reverse();
}

function getTokensOrCommentsAfter(sourceCode, node, count) {
  var currentNodeOrToken = node;
  var result = [];
  for (var i = 0; i < count; i++) {
    currentNodeOrToken = sourceCode.getTokenOrCommentAfter(currentNodeOrToken);
    if (currentNodeOrToken == null) {
      break;
    }
    result.push(currentNodeOrToken);
  }
  return result;
}

function getTokensOrCommentsBefore(sourceCode, node, count) {
  var currentNodeOrToken = node;
  var result = [];
  for (var i = 0; i < count; i++) {
    currentNodeOrToken = sourceCode.getTokenOrCommentBefore(currentNodeOrToken);
    if (currentNodeOrToken == null) {
      break;
    }
    result.push(currentNodeOrToken);
  }
  return result.reverse();
}

function takeTokensAfterWhile(sourceCode, node, condition) {
  var tokens = getTokensOrCommentsAfter(sourceCode, node, 100);
  var result = [];
  for (var i = 0; i < tokens.length; i++) {
    if (condition(tokens[i])) {
      result.push(tokens[i]);
    } else {
      break;
    }
  }
  return result;
}

function takeTokensBeforeWhile(sourceCode, node, condition) {
  var tokens = getTokensOrCommentsBefore(sourceCode, node, 100);
  var result = [];
  for (var i = tokens.length - 1; i >= 0; i--) {
    if (condition(tokens[i])) {
      result.push(tokens[i]);
    } else {
      break;
    }
  }
  return result.reverse();
}

function findOutOfOrder(imported) {
  if (imported.length === 0) {
    return [];
  }
  var maxSeenRankNode = imported[0];
  return imported.filter(function (importedModule) {
    var res = importedModule.rank < maxSeenRankNode.rank;
    if (maxSeenRankNode.rank < importedModule.rank) {
      maxSeenRankNode = importedModule;
    }
    return res;
  });
}

function findRootNode(node) {
  var parent = node;
  while (parent.parent != null && parent.parent.body == null) {
    parent = parent.parent;
  }
  return parent;
}

function findEndOfLineWithComments(sourceCode, node) {
  var tokensToEndOfLine = takeTokensAfterWhile(sourceCode, node, commentOnSameLineAs(node));
  var endOfTokens = tokensToEndOfLine.length > 0 ?
  tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1] :
  node.range[1];
  var result = endOfTokens;
  for (var i = endOfTokens; i < sourceCode.text.length; i++) {
    if (sourceCode.text[i] === '\n') {
      result = i + 1;
      break;
    }
    if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t' && sourceCode.text[i] !== '\r') {
      break;
    }
    result = i + 1;
  }
  return result;
}

function commentOnSameLineAs(node) {
  return function (token) {return (token.type === 'Block' || token.type === 'Line') &&
    token.loc.start.line === token.loc.end.line &&
    token.loc.end.line === node.loc.end.line;};
}

function findStartOfLineWithComments(sourceCode, node) {
  var tokensToEndOfLine = takeTokensBeforeWhile(sourceCode, node, commentOnSameLineAs(node));
  var startOfTokens = tokensToEndOfLine.length > 0 ? tokensToEndOfLine[0].range[0] : node.range[0];
  var result = startOfTokens;
  for (var i = startOfTokens - 1; i > 0; i--) {
    if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t') {
      break;
    }
    result = i;
  }
  return result;
}

function isPlainRequireModule(node) {
  if (node.type !== 'VariableDeclaration') {
    return false;
  }
  if (node.declarations.length !== 1) {
    return false;
  }
  var decl = node.declarations[0];
  var result = decl.id && (
  decl.id.type === 'Identifier' || decl.id.type === 'ObjectPattern') &&
  decl.init != null &&
  decl.init.type === 'CallExpression' &&
  decl.init.callee != null &&
  decl.init.callee.name === 'require' &&
  decl.init.arguments != null &&
  decl.init.arguments.length === 1 &&
  decl.init.arguments[0].type === 'Literal';
  return result;
}

function isPlainImportModule(node) {
  return node.type === 'ImportDeclaration' && node.specifiers != null && node.specifiers.length > 0;
}

function isPlainImportEquals(node) {
  return node.type === 'TSImportEqualsDeclaration' && node.moduleReference.expression;
}

function canCrossNodeWhileReorder(node) {
  return isPlainRequireModule(node) || isPlainImportModule(node) || isPlainImportEquals(node);
}

function canReorderItems(firstNode, secondNode) {
  var parent = firstNode.parent;var _sort =
  [
  parent.body.indexOf(firstNode),
  parent.body.indexOf(secondNode)].
  sort(),_sort2 = _slicedToArray(_sort, 2),firstIndex = _sort2[0],secondIndex = _sort2[1];
  var nodesBetween = parent.body.slice(firstIndex, secondIndex + 1);var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = nodesBetween[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var nodeBetween = _step.value;
      if (!canCrossNodeWhileReorder(nodeBetween)) {
        return false;
      }
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
  return true;
}

function fixOutOfOrder(context, firstNode, secondNode, order) {
  var sourceCode = context.getSourceCode();

  var firstRoot = findRootNode(firstNode.node);
  var firstRootStart = findStartOfLineWithComments(sourceCode, firstRoot);
  var firstRootEnd = findEndOfLineWithComments(sourceCode, firstRoot);

  var secondRoot = findRootNode(secondNode.node);
  var secondRootStart = findStartOfLineWithComments(sourceCode, secondRoot);
  var secondRootEnd = findEndOfLineWithComments(sourceCode, secondRoot);
  var canFix = canReorderItems(firstRoot, secondRoot);

  var newCode = sourceCode.text.substring(secondRootStart, secondRootEnd);
  if (newCode[newCode.length - 1] !== '\n') {
    newCode = newCode + '\n';
  }

  var message = '`' + String(secondNode.displayName) + '` import should occur ' + String(order) + ' import of `' + String(firstNode.displayName) + '`';

  if (order === 'before') {
    context.report({
      node: secondNode.node,
      message: message,
      fix: canFix && function (fixer) {return (
          fixer.replaceTextRange(
          [firstRootStart, secondRootEnd],
          newCode + sourceCode.text.substring(firstRootStart, secondRootStart)));} });


  } else if (order === 'after') {
    context.report({
      node: secondNode.node,
      message: message,
      fix: canFix && function (fixer) {return (
          fixer.replaceTextRange(
          [secondRootStart, firstRootEnd],
          sourceCode.text.substring(secondRootEnd, firstRootEnd) + newCode));} });


  }
}

function reportOutOfOrder(context, imported, outOfOrder, order) {
  outOfOrder.forEach(function (imp) {
    var found = imported.find(function () {function hasHigherRank(importedItem) {
        return importedItem.rank > imp.rank;
      }return hasHigherRank;}());
    fixOutOfOrder(context, found, imp, order);
  });
}

function makeOutOfOrderReport(context, imported) {
  var outOfOrder = findOutOfOrder(imported);
  if (!outOfOrder.length) {
    return;
  }
  // There are things to report. Try to minimize the number of reported errors.
  var reversedImported = reverse(imported);
  var reversedOrder = findOutOfOrder(reversedImported);
  if (reversedOrder.length < outOfOrder.length) {
    reportOutOfOrder(context, reversedImported, reversedOrder, 'after');
    return;
  }
  reportOutOfOrder(context, imported, outOfOrder, 'before');
}

function getSorter(ascending) {
  var multiplier = ascending ? 1 : -1;

  return function () {function importsSorter(importA, importB) {
      var result = void 0;

      if (importA < importB) {
        result = -1;
      } else if (importA > importB) {
        result = 1;
      } else {
        result = 0;
      }

      return result * multiplier;
    }return importsSorter;}();
}

function mutateRanksToAlphabetize(imported, alphabetizeOptions) {
  var groupedByRanks = imported.reduce(function (acc, importedItem) {
    if (!Array.isArray(acc[importedItem.rank])) {
      acc[importedItem.rank] = [];
    }
    acc[importedItem.rank].push(importedItem);
    return acc;
  }, {});

  var groupRanks = Object.keys(groupedByRanks);

  var sorterFn = getSorter(alphabetizeOptions.order === 'asc');
  var comparator = alphabetizeOptions.caseInsensitive ?
  function (a, b) {return sorterFn(String(a.value).toLowerCase(), String(b.value).toLowerCase());} :
  function (a, b) {return sorterFn(a.value, b.value);};

  // sort imports locally within their group
  groupRanks.forEach(function (groupRank) {
    groupedByRanks[groupRank].sort(comparator);
  });

  // assign globally unique rank to each import
  var newRank = 0;
  var alphabetizedRanks = groupRanks.sort().reduce(function (acc, groupRank) {
    groupedByRanks[groupRank].forEach(function (importedItem) {
      acc[String(importedItem.value) + '|' + String(importedItem.node.importKind)] = parseInt(groupRank, 10) + newRank;
      newRank += 1;
    });
    return acc;
  }, {});

  // mutate the original group-rank with alphabetized-rank
  imported.forEach(function (importedItem) {
    importedItem.rank = alphabetizedRanks[String(importedItem.value) + '|' + String(importedItem.node.importKind)];
  });
}

// DETECTING

function computePathRank(ranks, pathGroups, path, maxPosition) {
  for (var i = 0, l = pathGroups.length; i < l; i++) {var _pathGroups$i =
    pathGroups[i],pattern = _pathGroups$i.pattern,patternOptions = _pathGroups$i.patternOptions,group = _pathGroups$i.group,_pathGroups$i$positio = _pathGroups$i.position,position = _pathGroups$i$positio === undefined ? 1 : _pathGroups$i$positio;
    if ((0, _minimatch2['default'])(path, pattern, patternOptions || { nocomment: true })) {
      return ranks[group] + position / maxPosition;
    }
  }
}

function computeRank(context, ranks, importEntry, excludedImportTypes) {
  var impType = void 0;
  var rank = void 0;
  if (importEntry.type === 'import:object') {
    impType = 'object';
  } else if (importEntry.node.importKind === 'type' && ranks.omittedTypes.indexOf('type') === -1) {
    impType = 'type';
  } else {
    impType = (0, _importType2['default'])(importEntry.value, context);
  }
  if (!excludedImportTypes.has(impType)) {
    rank = computePathRank(ranks.groups, ranks.pathGroups, importEntry.value, ranks.maxPosition);
  }
  if (typeof rank === 'undefined') {
    rank = ranks.groups[impType];
  }
  if (importEntry.type !== 'import' && !importEntry.type.startsWith('import:')) {
    rank += 100;
  }

  return rank;
}

function registerNode(context, importEntry, ranks, imported, excludedImportTypes) {
  var rank = computeRank(context, ranks, importEntry, excludedImportTypes);
  if (rank !== -1) {
    imported.push(Object.assign({}, importEntry, { rank: rank }));
  }
}

function isModuleLevelRequire(node) {
  var n = node;
  // Handle cases like `const baz = require('foo').bar.baz`
  // and `const foo = require('foo')()`
  while (
  n.parent.type === 'MemberExpression' && n.parent.object === n ||
  n.parent.type === 'CallExpression' && n.parent.callee === n)
  {
    n = n.parent;
  }
  return (
    n.parent.type === 'VariableDeclarator' &&
    n.parent.parent.type === 'VariableDeclaration' &&
    n.parent.parent.parent.type === 'Program');

}

var types = ['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index', 'object', 'type'];

// Creates an object with type-rank pairs.
// Example: { index: 0, sibling: 1, parent: 1, external: 1, builtin: 2, internal: 2 }
// Will throw an error if it contains a type that does not exist, or has a duplicate
function convertGroupsToRanks(groups) {
  var rankObject = groups.reduce(function (res, group, index) {
    if (typeof group === 'string') {
      group = [group];
    }
    group.forEach(function (groupItem) {
      if (types.indexOf(groupItem) === -1) {
        throw new Error('Incorrect configuration of the rule: Unknown type `' +
        JSON.stringify(groupItem) + '`');
      }
      if (res[groupItem] !== undefined) {
        throw new Error('Incorrect configuration of the rule: `' + groupItem + '` is duplicated');
      }
      res[groupItem] = index;
    });
    return res;
  }, {});

  var omittedTypes = types.filter(function (type) {
    return rankObject[type] === undefined;
  });

  var ranks = omittedTypes.reduce(function (res, type) {
    res[type] = groups.length;
    return res;
  }, rankObject);

  return { groups: ranks, omittedTypes: omittedTypes };
}

function convertPathGroupsForRanks(pathGroups) {
  var after = {};
  var before = {};

  var transformed = pathGroups.map(function (pathGroup, index) {var
    group = pathGroup.group,positionString = pathGroup.position;
    var position = 0;
    if (positionString === 'after') {
      if (!after[group]) {
        after[group] = 1;
      }
      position = after[group]++;
    } else if (positionString === 'before') {
      if (!before[group]) {
        before[group] = [];
      }
      before[group].push(index);
    }

    return Object.assign({}, pathGroup, { position: position });
  });

  var maxPosition = 1;

  Object.keys(before).forEach(function (group) {
    var groupLength = before[group].length;
    before[group].forEach(function (groupIndex, index) {
      transformed[groupIndex].position = -1 * (groupLength - index);
    });
    maxPosition = Math.max(maxPosition, groupLength);
  });

  Object.keys(after).forEach(function (key) {
    var groupNextPosition = after[key];
    maxPosition = Math.max(maxPosition, groupNextPosition - 1);
  });

  return {
    pathGroups: transformed,
    maxPosition: maxPosition > 10 ? Math.pow(10, Math.ceil(Math.log10(maxPosition))) : 10 };

}

function fixNewLineAfterImport(context, previousImport) {
  var prevRoot = findRootNode(previousImport.node);
  var tokensToEndOfLine = takeTokensAfterWhile(
  context.getSourceCode(), prevRoot, commentOnSameLineAs(prevRoot));

  var endOfLine = prevRoot.range[1];
  if (tokensToEndOfLine.length > 0) {
    endOfLine = tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1];
  }
  return function (fixer) {return fixer.insertTextAfterRange([prevRoot.range[0], endOfLine], '\n');};
}

function removeNewLineAfterImport(context, currentImport, previousImport) {
  var sourceCode = context.getSourceCode();
  var prevRoot = findRootNode(previousImport.node);
  var currRoot = findRootNode(currentImport.node);
  var rangeToRemove = [
  findEndOfLineWithComments(sourceCode, prevRoot),
  findStartOfLineWithComments(sourceCode, currRoot)];

  if (/^\s*$/.test(sourceCode.text.substring(rangeToRemove[0], rangeToRemove[1]))) {
    return function (fixer) {return fixer.removeRange(rangeToRemove);};
  }
  return undefined;
}

function makeNewlinesBetweenReport(context, imported, newlinesBetweenImports) {
  var getNumberOfEmptyLinesBetween = function getNumberOfEmptyLinesBetween(currentImport, previousImport) {
    var linesBetweenImports = context.getSourceCode().lines.slice(
    previousImport.node.loc.end.line,
    currentImport.node.loc.start.line - 1);


    return linesBetweenImports.filter(function (line) {return !line.trim().length;}).length;
  };
  var previousImport = imported[0];

  imported.slice(1).forEach(function (currentImport) {
    var emptyLinesBetween = getNumberOfEmptyLinesBetween(currentImport, previousImport);

    if (newlinesBetweenImports === 'always' ||
    newlinesBetweenImports === 'always-and-inside-groups') {
      if (currentImport.rank !== previousImport.rank && emptyLinesBetween === 0) {
        context.report({
          node: previousImport.node,
          message: 'There should be at least one empty line between import groups',
          fix: fixNewLineAfterImport(context, previousImport) });

      } else if (currentImport.rank === previousImport.rank &&
      emptyLinesBetween > 0 &&
      newlinesBetweenImports !== 'always-and-inside-groups') {
        context.report({
          node: previousImport.node,
          message: 'There should be no empty line within import group',
          fix: removeNewLineAfterImport(context, currentImport, previousImport) });

      }
    } else if (emptyLinesBetween > 0) {
      context.report({
        node: previousImport.node,
        message: 'There should be no empty line between import groups',
        fix: removeNewLineAfterImport(context, currentImport, previousImport) });

    }

    previousImport = currentImport;
  });
}

function getAlphabetizeConfig(options) {
  var alphabetize = options.alphabetize || {};
  var order = alphabetize.order || 'ignore';
  var caseInsensitive = alphabetize.caseInsensitive || false;

  return { order: order, caseInsensitive: caseInsensitive };
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('order') },


    fixable: 'code',
    schema: [
    {
      type: 'object',
      properties: {
        groups: {
          type: 'array' },

        pathGroupsExcludedImportTypes: {
          type: 'array' },

        pathGroups: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pattern: {
                type: 'string' },

              patternOptions: {
                type: 'object' },

              group: {
                type: 'string',
                'enum': types },

              position: {
                type: 'string',
                'enum': ['after', 'before'] } },


            required: ['pattern', 'group'] } },


        'newlines-between': {
          'enum': [
          'ignore',
          'always',
          'always-and-inside-groups',
          'never'] },


        alphabetize: {
          type: 'object',
          properties: {
            caseInsensitive: {
              type: 'boolean',
              'default': false },

            order: {
              'enum': ['ignore', 'asc', 'desc'],
              'default': 'ignore' } },


          additionalProperties: false },

        warnOnUnassignedImports: {
          type: 'boolean',
          'default': false } },


      additionalProperties: false }] },




  create: function () {function importOrderRule(context) {
      var options = context.options[0] || {};
      var newlinesBetweenImports = options['newlines-between'] || 'ignore';
      var pathGroupsExcludedImportTypes = new Set(options['pathGroupsExcludedImportTypes'] || ['builtin', 'external', 'object']);
      var alphabetize = getAlphabetizeConfig(options);
      var ranks = void 0;

      try {var _convertPathGroupsFor =
        convertPathGroupsForRanks(options.pathGroups || []),pathGroups = _convertPathGroupsFor.pathGroups,maxPosition = _convertPathGroupsFor.maxPosition;var _convertGroupsToRanks =
        convertGroupsToRanks(options.groups || defaultGroups),groups = _convertGroupsToRanks.groups,omittedTypes = _convertGroupsToRanks.omittedTypes;
        ranks = {
          groups: groups,
          omittedTypes: omittedTypes,
          pathGroups: pathGroups,
          maxPosition: maxPosition };

      } catch (error) {
        // Malformed configuration
        return {
          Program: function () {function Program(node) {
              context.report(node, error.message);
            }return Program;}() };

      }
      var imported = [];

      return {
        ImportDeclaration: function () {function handleImports(node) {
            // Ignoring unassigned imports unless warnOnUnassignedImports is set
            if (node.specifiers.length || options.warnOnUnassignedImports) {
              var name = node.source.value;
              registerNode(
              context,
              {
                node: node,
                value: name,
                displayName: name,
                type: 'import' },

              ranks,
              imported,
              pathGroupsExcludedImportTypes);

            }
          }return handleImports;}(),
        TSImportEqualsDeclaration: function () {function handleImports(node) {
            var displayName = void 0;
            var value = void 0;
            var type = void 0;
            // skip "export import"s
            if (node.isExport) {
              return;
            }
            if (node.moduleReference.type === 'TSExternalModuleReference') {
              value = node.moduleReference.expression.value;
              displayName = value;
              type = 'import';
            } else {
              value = '';
              displayName = context.getSourceCode().getText(node.moduleReference);
              type = 'import:object';
            }
            registerNode(
            context,
            {
              node: node,
              value: value,
              displayName: displayName,
              type: type },

            ranks,
            imported,
            pathGroupsExcludedImportTypes);

          }return handleImports;}(),
        CallExpression: function () {function handleRequires(node) {
            if (!(0, _staticRequire2['default'])(node) || !isModuleLevelRequire(node)) {
              return;
            }
            var name = node.arguments[0].value;
            registerNode(
            context,
            {
              node: node,
              value: name,
              displayName: name,
              type: 'require' },

            ranks,
            imported,
            pathGroupsExcludedImportTypes);

          }return handleRequires;}(),
        'Program:exit': function () {function reportAndReset() {
            if (newlinesBetweenImports !== 'ignore') {
              makeNewlinesBetweenReport(context, imported, newlinesBetweenImports);
            }

            if (alphabetize.order !== 'ignore') {
              mutateRanksToAlphabetize(imported, alphabetize);
            }

            makeOutOfOrderReport(context, imported);

            imported = [];
          }return reportAndReset;}() };

    }return importOrderRule;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9vcmRlci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0R3JvdXBzIiwicmV2ZXJzZSIsImFycmF5IiwibWFwIiwidiIsIk9iamVjdCIsImFzc2lnbiIsInJhbmsiLCJnZXRUb2tlbnNPckNvbW1lbnRzQWZ0ZXIiLCJzb3VyY2VDb2RlIiwibm9kZSIsImNvdW50IiwiY3VycmVudE5vZGVPclRva2VuIiwicmVzdWx0IiwiaSIsImdldFRva2VuT3JDb21tZW50QWZ0ZXIiLCJwdXNoIiwiZ2V0VG9rZW5zT3JDb21tZW50c0JlZm9yZSIsImdldFRva2VuT3JDb21tZW50QmVmb3JlIiwidGFrZVRva2Vuc0FmdGVyV2hpbGUiLCJjb25kaXRpb24iLCJ0b2tlbnMiLCJsZW5ndGgiLCJ0YWtlVG9rZW5zQmVmb3JlV2hpbGUiLCJmaW5kT3V0T2ZPcmRlciIsImltcG9ydGVkIiwibWF4U2VlblJhbmtOb2RlIiwiZmlsdGVyIiwiaW1wb3J0ZWRNb2R1bGUiLCJyZXMiLCJmaW5kUm9vdE5vZGUiLCJwYXJlbnQiLCJib2R5IiwiZmluZEVuZE9mTGluZVdpdGhDb21tZW50cyIsInRva2Vuc1RvRW5kT2ZMaW5lIiwiY29tbWVudE9uU2FtZUxpbmVBcyIsImVuZE9mVG9rZW5zIiwicmFuZ2UiLCJ0ZXh0IiwidG9rZW4iLCJ0eXBlIiwibG9jIiwic3RhcnQiLCJsaW5lIiwiZW5kIiwiZmluZFN0YXJ0T2ZMaW5lV2l0aENvbW1lbnRzIiwic3RhcnRPZlRva2VucyIsImlzUGxhaW5SZXF1aXJlTW9kdWxlIiwiZGVjbGFyYXRpb25zIiwiZGVjbCIsImlkIiwiaW5pdCIsImNhbGxlZSIsIm5hbWUiLCJhcmd1bWVudHMiLCJpc1BsYWluSW1wb3J0TW9kdWxlIiwic3BlY2lmaWVycyIsImlzUGxhaW5JbXBvcnRFcXVhbHMiLCJtb2R1bGVSZWZlcmVuY2UiLCJleHByZXNzaW9uIiwiY2FuQ3Jvc3NOb2RlV2hpbGVSZW9yZGVyIiwiY2FuUmVvcmRlckl0ZW1zIiwiZmlyc3ROb2RlIiwic2Vjb25kTm9kZSIsImluZGV4T2YiLCJzb3J0IiwiZmlyc3RJbmRleCIsInNlY29uZEluZGV4Iiwibm9kZXNCZXR3ZWVuIiwic2xpY2UiLCJub2RlQmV0d2VlbiIsImZpeE91dE9mT3JkZXIiLCJjb250ZXh0Iiwib3JkZXIiLCJnZXRTb3VyY2VDb2RlIiwiZmlyc3RSb290IiwiZmlyc3RSb290U3RhcnQiLCJmaXJzdFJvb3RFbmQiLCJzZWNvbmRSb290Iiwic2Vjb25kUm9vdFN0YXJ0Iiwic2Vjb25kUm9vdEVuZCIsImNhbkZpeCIsIm5ld0NvZGUiLCJzdWJzdHJpbmciLCJtZXNzYWdlIiwiZGlzcGxheU5hbWUiLCJyZXBvcnQiLCJmaXgiLCJmaXhlciIsInJlcGxhY2VUZXh0UmFuZ2UiLCJyZXBvcnRPdXRPZk9yZGVyIiwib3V0T2ZPcmRlciIsImZvckVhY2giLCJpbXAiLCJmb3VuZCIsImZpbmQiLCJoYXNIaWdoZXJSYW5rIiwiaW1wb3J0ZWRJdGVtIiwibWFrZU91dE9mT3JkZXJSZXBvcnQiLCJyZXZlcnNlZEltcG9ydGVkIiwicmV2ZXJzZWRPcmRlciIsImdldFNvcnRlciIsImFzY2VuZGluZyIsIm11bHRpcGxpZXIiLCJpbXBvcnRzU29ydGVyIiwiaW1wb3J0QSIsImltcG9ydEIiLCJtdXRhdGVSYW5rc1RvQWxwaGFiZXRpemUiLCJhbHBoYWJldGl6ZU9wdGlvbnMiLCJncm91cGVkQnlSYW5rcyIsInJlZHVjZSIsImFjYyIsIkFycmF5IiwiaXNBcnJheSIsImdyb3VwUmFua3MiLCJrZXlzIiwic29ydGVyRm4iLCJjb21wYXJhdG9yIiwiY2FzZUluc2Vuc2l0aXZlIiwiYSIsImIiLCJTdHJpbmciLCJ2YWx1ZSIsInRvTG93ZXJDYXNlIiwiZ3JvdXBSYW5rIiwibmV3UmFuayIsImFscGhhYmV0aXplZFJhbmtzIiwiaW1wb3J0S2luZCIsInBhcnNlSW50IiwiY29tcHV0ZVBhdGhSYW5rIiwicmFua3MiLCJwYXRoR3JvdXBzIiwicGF0aCIsIm1heFBvc2l0aW9uIiwibCIsInBhdHRlcm4iLCJwYXR0ZXJuT3B0aW9ucyIsImdyb3VwIiwicG9zaXRpb24iLCJub2NvbW1lbnQiLCJjb21wdXRlUmFuayIsImltcG9ydEVudHJ5IiwiZXhjbHVkZWRJbXBvcnRUeXBlcyIsImltcFR5cGUiLCJvbWl0dGVkVHlwZXMiLCJoYXMiLCJncm91cHMiLCJzdGFydHNXaXRoIiwicmVnaXN0ZXJOb2RlIiwiaXNNb2R1bGVMZXZlbFJlcXVpcmUiLCJuIiwib2JqZWN0IiwidHlwZXMiLCJjb252ZXJ0R3JvdXBzVG9SYW5rcyIsInJhbmtPYmplY3QiLCJpbmRleCIsImdyb3VwSXRlbSIsIkVycm9yIiwiSlNPTiIsInN0cmluZ2lmeSIsInVuZGVmaW5lZCIsImNvbnZlcnRQYXRoR3JvdXBzRm9yUmFua3MiLCJhZnRlciIsImJlZm9yZSIsInRyYW5zZm9ybWVkIiwicGF0aEdyb3VwIiwicG9zaXRpb25TdHJpbmciLCJncm91cExlbmd0aCIsImdyb3VwSW5kZXgiLCJNYXRoIiwibWF4Iiwia2V5IiwiZ3JvdXBOZXh0UG9zaXRpb24iLCJwb3ciLCJjZWlsIiwibG9nMTAiLCJmaXhOZXdMaW5lQWZ0ZXJJbXBvcnQiLCJwcmV2aW91c0ltcG9ydCIsInByZXZSb290IiwiZW5kT2ZMaW5lIiwiaW5zZXJ0VGV4dEFmdGVyUmFuZ2UiLCJyZW1vdmVOZXdMaW5lQWZ0ZXJJbXBvcnQiLCJjdXJyZW50SW1wb3J0IiwiY3VyclJvb3QiLCJyYW5nZVRvUmVtb3ZlIiwidGVzdCIsInJlbW92ZVJhbmdlIiwibWFrZU5ld2xpbmVzQmV0d2VlblJlcG9ydCIsIm5ld2xpbmVzQmV0d2VlbkltcG9ydHMiLCJnZXROdW1iZXJPZkVtcHR5TGluZXNCZXR3ZWVuIiwibGluZXNCZXR3ZWVuSW1wb3J0cyIsImxpbmVzIiwidHJpbSIsImVtcHR5TGluZXNCZXR3ZWVuIiwiZ2V0QWxwaGFiZXRpemVDb25maWciLCJvcHRpb25zIiwiYWxwaGFiZXRpemUiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJ1cmwiLCJmaXhhYmxlIiwic2NoZW1hIiwicHJvcGVydGllcyIsInBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzIiwiaXRlbXMiLCJyZXF1aXJlZCIsImFkZGl0aW9uYWxQcm9wZXJ0aWVzIiwid2Fybk9uVW5hc3NpZ25lZEltcG9ydHMiLCJjcmVhdGUiLCJpbXBvcnRPcmRlclJ1bGUiLCJTZXQiLCJlcnJvciIsIlByb2dyYW0iLCJJbXBvcnREZWNsYXJhdGlvbiIsImhhbmRsZUltcG9ydHMiLCJzb3VyY2UiLCJUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uIiwiaXNFeHBvcnQiLCJnZXRUZXh0IiwiQ2FsbEV4cHJlc3Npb24iLCJoYW5kbGVSZXF1aXJlcyIsInJlcG9ydEFuZFJlc2V0Il0sIm1hcHBpbmdzIjoiQUFBQSxhOztBQUVBLHNDO0FBQ0EsZ0Q7QUFDQSxzRDtBQUNBLHFDOztBQUVBLElBQU1BLGdCQUFnQixDQUFDLFNBQUQsRUFBWSxVQUFaLEVBQXdCLFFBQXhCLEVBQWtDLFNBQWxDLEVBQTZDLE9BQTdDLENBQXRCOztBQUVBOztBQUVBLFNBQVNDLE9BQVQsQ0FBaUJDLEtBQWpCLEVBQXdCO0FBQ3RCLFNBQU9BLE1BQU1DLEdBQU4sQ0FBVSxVQUFVQyxDQUFWLEVBQWE7QUFDNUIsV0FBT0MsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JGLENBQWxCLEVBQXFCLEVBQUVHLE1BQU0sQ0FBQ0gsRUFBRUcsSUFBWCxFQUFyQixDQUFQO0FBQ0QsR0FGTSxFQUVKTixPQUZJLEVBQVA7QUFHRDs7QUFFRCxTQUFTTyx3QkFBVCxDQUFrQ0MsVUFBbEMsRUFBOENDLElBQTlDLEVBQW9EQyxLQUFwRCxFQUEyRDtBQUN6RCxNQUFJQyxxQkFBcUJGLElBQXpCO0FBQ0EsTUFBTUcsU0FBUyxFQUFmO0FBQ0EsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILEtBQXBCLEVBQTJCRyxHQUEzQixFQUFnQztBQUM5QkYseUJBQXFCSCxXQUFXTSxzQkFBWCxDQUFrQ0gsa0JBQWxDLENBQXJCO0FBQ0EsUUFBSUEsc0JBQXNCLElB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S0FBSzRDLFNBQUwsQ0FBZSxDQUFmLEVBQWtCb0UsS0FBL0I7QUFDQTBCO0FBQ0U1RSxtQkFERjtBQUVFO0FBQ0U5RCx3QkFERjtBQUVFZ0gscUJBQU9yRSxJQUZUO0FBR0VnQywyQkFBYWhDLElBSGY7QUFJRWIsb0JBQU0sU0FKUixFQUZGOztBQVFFMEYsaUJBUkY7QUFTRXpHLG9CQVRGO0FBVUVvTCx5Q0FWRjs7QUFZRCxXQWpCRCxPQUF5QmlCLGNBQXpCLElBakRLO0FBbUVMLHFDQUFnQixTQUFTQyxjQUFULEdBQTBCO0FBQ3hDLGdCQUFJbkMsMkJBQTJCLFFBQS9CLEVBQXlDO0FBQ3ZDRCx3Q0FBMEJuSCxPQUExQixFQUFtQy9DLFFBQW5DLEVBQTZDbUssc0JBQTdDO0FBQ0Q7O0FBRUQsZ0JBQUlRLFlBQVkzSCxLQUFaLEtBQXNCLFFBQTFCLEVBQW9DO0FBQ2xDa0MsdUNBQXlCbEYsUUFBekIsRUFBbUMySyxXQUFuQztBQUNEOztBQUVEbEcsaUNBQXFCMUIsT0FBckIsRUFBOEIvQyxRQUE5Qjs7QUFFQUEsdUJBQVcsRUFBWDtBQUNELFdBWkQsT0FBeUJzTSxjQUF6QixJQW5FSyxFQUFQOztBQWlGRCxLQTNHRCxPQUFpQlosZUFBakIsSUF6RWUsRUFBakIiLCJmaWxlIjoib3JkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCBpbXBvcnRUeXBlIGZyb20gJy4uL2NvcmUvaW1wb3J0VHlwZSc7XG5pbXBvcnQgaXNTdGF0aWNSZXF1aXJlIGZyb20gJy4uL2NvcmUvc3RhdGljUmVxdWlyZSc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuY29uc3QgZGVmYXVsdEdyb3VwcyA9IFsnYnVpbHRpbicsICdleHRlcm5hbCcsICdwYXJlbnQnLCAnc2libGluZycsICdpbmRleCddO1xuXG4vLyBSRVBPUlRJTkcgQU5EIEZJWElOR1xuXG5mdW5jdGlvbiByZXZlcnNlKGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdiwgeyByYW5rOiAtdi5yYW5rIH0pO1xuICB9KS5yZXZlcnNlKCk7XG59XG5cbmZ1bmN0aW9uIGdldFRva2Vuc09yQ29tbWVudHNBZnRlcihzb3VyY2VDb2RlLCBub2RlLCBjb3VudCkge1xuICBsZXQgY3VycmVudE5vZGVPclRva2VuID0gbm9kZTtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIGN1cnJlbnROb2RlT3JUb2tlbiA9IHNvdXJjZUNvZGUuZ2V0VG9rZW5PckNvbW1lbnRBZnRlcihjdXJyZW50Tm9kZU9yVG9rZW4pO1xuICAgIGlmIChjdXJyZW50Tm9kZU9yVG9rZW4gPT0gbnVsbCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGN1cnJlbnROb2RlT3JUb2tlbik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZ2V0VG9rZW5zT3JDb21tZW50c0JlZm9yZShzb3VyY2VDb2RlLCBub2RlLCBjb3VudCkge1xuICBsZXQgY3VycmVudE5vZGVPclRva2VuID0gbm9kZTtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIGN1cnJlbnROb2RlT3JUb2tlbiA9IHNvdXJjZUNvZGUuZ2V0VG9rZW5PckNvbW1lbnRCZWZvcmUoY3VycmVudE5vZGVPclRva2VuKTtcbiAgICBpZiAoY3VycmVudE5vZGVPclRva2VuID09IG51bGwpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChjdXJyZW50Tm9kZU9yVG9rZW4pO1xuICB9XG4gIHJldHVybiByZXN1bHQucmV2ZXJzZSgpO1xufVxuXG5mdW5jdGlvbiB0YWtlVG9rZW5zQWZ0ZXJXaGlsZShzb3VyY2VDb2RlLCBub2RlLCBjb25kaXRpb24pIHtcbiAgY29uc3QgdG9rZW5zID0gZ2V0VG9rZW5zT3JDb21tZW50c0FmdGVyKHNvdXJjZUNvZGUsIG5vZGUsIDEwMCk7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChjb25kaXRpb24odG9rZW5zW2ldKSkge1xuICAgICAgcmVzdWx0LnB1c2godG9rZW5zW2ldKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHRha2VUb2tlbnNCZWZvcmVXaGlsZShzb3VyY2VDb2RlLCBub2RlLCBjb25kaXRpb24pIHtcbiAgY29uc3QgdG9rZW5zID0gZ2V0VG9rZW5zT3JDb21tZW50c0JlZm9yZShzb3VyY2VDb2RlLCBub2RlLCAxMDApO1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IHRva2Vucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmIChjb25kaXRpb24odG9rZW5zW2ldKSkge1xuICAgICAgcmVzdWx0LnB1c2godG9rZW5zW2ldKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQucmV2ZXJzZSgpO1xufVxuXG5mdW5jdGlvbiBmaW5kT3V0T2ZPcmRlcihpbXBvcnRlZCkge1xuICBpZiAoaW1wb3J0ZWQubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGxldCBtYXhTZWVuUmFua05vZGUgPSBpbXBvcnRlZFswXTtcbiAgcmV0dXJuIGltcG9ydGVkLmZpbHRlcihmdW5jdGlvbiAoaW1wb3J0ZWRNb2R1bGUpIHtcbiAgICBjb25zdCByZXMgPSBpbXBvcnRlZE1vZHVsZS5yYW5rIDwgbWF4U2VlblJhbmtOb2RlLnJhbms7XG4gICAgaWYgKG1heFNlZW5SYW5rTm9kZS5yYW5rIDwgaW1wb3J0ZWRNb2R1bGUucmFuaykge1xuICAgICAgbWF4U2VlblJhbmtOb2RlID0gaW1wb3J0ZWRNb2R1bGU7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBmaW5kUm9vdE5vZGUobm9kZSkge1xuICBsZXQgcGFyZW50ID0gbm9kZTtcbiAgd2hpbGUgKHBhcmVudC5wYXJlbnQgIT0gbnVsbCAmJiBwYXJlbnQucGFyZW50LmJvZHkgPT0gbnVsbCkge1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cbiAgcmV0dXJuIHBhcmVudDtcbn1cblxuZnVuY3Rpb24gZmluZEVuZE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBub2RlKSB7XG4gIGNvbnN0IHRva2Vuc1RvRW5kT2ZMaW5lID0gdGFrZVRva2Vuc0FmdGVyV2hpbGUoc291cmNlQ29kZSwgbm9kZSwgY29tbWVudE9uU2FtZUxpbmVBcyhub2RlKSk7XG4gIGNvbnN0IGVuZE9mVG9rZW5zID0gdG9rZW5zVG9FbmRPZkxpbmUubGVuZ3RoID4gMFxuICAgID8gdG9rZW5zVG9FbmRPZkxpbmVbdG9rZW5zVG9FbmRPZkxpbmUubGVuZ3RoIC0gMV0ucmFuZ2VbMV1cbiAgICA6IG5vZGUucmFuZ2VbMV07XG4gIGxldCByZXN1bHQgPSBlbmRPZlRva2VucztcbiAgZm9yIChsZXQgaSA9IGVuZE9mVG9rZW5zOyBpIDwgc291cmNlQ29kZS50ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHNvdXJjZUNvZGUudGV4dFtpXSA9PT0gJ1xcbicpIHtcbiAgICAgIHJlc3VsdCA9IGkgKyAxO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChzb3VyY2VDb2RlLnRleHRbaV0gIT09ICcgJyAmJiBzb3VyY2VDb2RlLnRleHRbaV0gIT09ICdcXHQnICYmIHNvdXJjZUNvZGUudGV4dFtpXSAhPT0gJ1xccicpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXN1bHQgPSBpICsgMTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBjb21tZW50T25TYW1lTGluZUFzKG5vZGUpIHtcbiAgcmV0dXJuIHRva2VuID0+ICh0b2tlbi50eXBlID09PSAnQmxvY2snIHx8ICB0b2tlbi50eXBlID09PSAnTGluZScpICYmXG4gICAgICB0b2tlbi5sb2Muc3RhcnQubGluZSA9PT0gdG9rZW4ubG9jLmVuZC5saW5lICYmXG4gICAgICB0b2tlbi5sb2MuZW5kLmxpbmUgPT09IG5vZGUubG9jLmVuZC5saW5lO1xufVxuXG5mdW5jdGlvbiBmaW5kU3RhcnRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgbm9kZSkge1xuICBjb25zdCB0b2tlbnNUb0VuZE9mTGluZSA9IHRha2VUb2tlbnNCZWZvcmVXaGlsZShzb3VyY2VDb2RlLCBub2RlLCBjb21tZW50T25TYW1lTGluZUFzKG5vZGUpKTtcbiAgY29uc3Qgc3RhcnRPZlRva2VucyA9IHRva2Vuc1RvRW5kT2ZMaW5lLmxlbmd0aCA+IDAgPyB0b2tlbnNUb0VuZE9mTGluZVswXS5yYW5nZVswXSA6IG5vZGUucmFuZ2VbMF07XG4gIGxldCByZXN1bHQgPSBzdGFydE9mVG9rZW5zO1xuICBmb3IgKGxldCBpID0gc3RhcnRPZlRva2VucyAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICBpZiAoc291cmNlQ29kZS50ZXh0W2ldICE9PSAnICcgJiYgc291cmNlQ29kZS50ZXh0W2ldICE9PSAnXFx0Jykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdCA9IGk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gaXNQbGFpblJlcXVpcmVNb2R1bGUobm9kZSkge1xuICBpZiAobm9kZS50eXBlICE9PSAnVmFyaWFibGVEZWNsYXJhdGlvbicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKG5vZGUuZGVjbGFyYXRpb25zLmxlbmd0aCAhPT0gMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBkZWNsID0gbm9kZS5kZWNsYXJhdGlvbnNbMF07XG4gIGNvbnN0IHJlc3VsdCA9IGRlY2wuaWQgJiZcbiAgICAoZGVjbC5pZC50eXBlID09PSAnSWRlbnRpZmllcicgfHwgZGVjbC5pZC50eXBlID09PSAnT2JqZWN0UGF0dGVybicpICYmXG4gICAgZGVjbC5pbml0ICE9IG51bGwgJiZcbiAgICBkZWNsLmluaXQudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJyAmJlxuICAgIGRlY2wuaW5pdC5jYWxsZWUgIT0gbnVsbCAmJlxuICAgIGRlY2wuaW5pdC5jYWxsZWUubmFtZSA9PT0gJ3JlcXVpcmUnICYmXG4gICAgZGVjbC5pbml0LmFyZ3VtZW50cyAhPSBudWxsICYmXG4gICAgZGVjbC5pbml0LmFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiZcbiAgICBkZWNsLmluaXQuYXJndW1lbnRzWzBdLnR5cGUgPT09ICdMaXRlcmFsJztcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gaXNQbGFpbkltcG9ydE1vZHVsZShub2RlKSB7XG4gIHJldHVybiBub2RlLnR5cGUgPT09ICdJbXBvcnREZWNsYXJhdGlvbicgJiYgbm9kZS5zcGVjaWZpZXJzICE9IG51bGwgJiYgbm9kZS5zcGVjaWZpZXJzLmxlbmd0aCA+IDA7XG59XG5cbmZ1bmN0aW9uIGlzUGxhaW5JbXBvcnRFcXVhbHMobm9kZSkge1xuICByZXR1cm4gbm9kZS50eXBlID09PSAnVFNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbicgJiYgbm9kZS5tb2R1bGVSZWZlcmVuY2UuZXhwcmVzc2lvbjtcbn1cblxuZnVuY3Rpb24gY2FuQ3Jvc3NOb2RlV2hpbGVSZW9yZGVyKG5vZGUpIHtcbiAgcmV0dXJuIGlzUGxhaW5SZXF1aXJlTW9kdWxlKG5vZGUpIHx8IGlzUGxhaW5JbXBvcnRNb2R1bGUobm9kZSkgfHwgaXNQbGFpbkltcG9ydEVxdWFscyhub2RlKTtcbn1cblxuZnVuY3Rpb24gY2FuUmVvcmRlckl0ZW1zKGZpcnN0Tm9kZSwgc2Vjb25kTm9kZSkge1xuICBjb25zdCBwYXJlbnQgPSBmaXJzdE5vZGUucGFyZW50O1xuICBjb25zdCBbZmlyc3RJbmRleCwgc2Vjb25kSW5kZXhdID0gW1xuICAgIHBhcmVudC5ib2R5LmluZGV4T2YoZmlyc3ROb2RlKSxcbiAgICBwYXJlbnQuYm9keS5pbmRleE9mKHNlY29uZE5vZGUpLFxuICBdLnNvcnQoKTtcbiAgY29uc3Qgbm9kZXNCZXR3ZWVuID0gcGFyZW50LmJvZHkuc2xpY2UoZmlyc3RJbmRleCwgc2Vjb25kSW5kZXggKyAxKTtcbiAgZm9yIChjb25zdCBub2RlQmV0d2VlbiBvZiBub2Rlc0JldHdlZW4pIHtcbiAgICBpZiAoIWNhbkNyb3NzTm9kZVdoaWxlUmVvcmRlcihub2RlQmV0d2VlbikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGZpeE91dE9mT3JkZXIoY29udGV4dCwgZmlyc3ROb2RlLCBzZWNvbmROb2RlLCBvcmRlcikge1xuICBjb25zdCBzb3VyY2VDb2RlID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCk7XG5cbiAgY29uc3QgZmlyc3RSb290ID0gZmluZFJvb3ROb2RlKGZpcnN0Tm9kZS5ub2RlKTtcbiAgY29uc3QgZmlyc3RSb290U3RhcnQgPSBmaW5kU3RhcnRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgZmlyc3RSb290KTtcbiAgY29uc3QgZmlyc3RSb290RW5kID0gZmluZEVuZE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBmaXJzdFJvb3QpO1xuXG4gIGNvbnN0IHNlY29uZFJvb3QgPSBmaW5kUm9vdE5vZGUoc2Vjb25kTm9kZS5ub2RlKTtcbiAgY29uc3Qgc2Vjb25kUm9vdFN0YXJ0ID0gZmluZFN0YXJ0T2ZMaW5lV2l0aENvbW1lbnRzKHNvdXJjZUNvZGUsIHNlY29uZFJvb3QpO1xuICBjb25zdCBzZWNvbmRSb290RW5kID0gZmluZEVuZE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBzZWNvbmRSb290KTtcbiAgY29uc3QgY2FuRml4ID0gY2FuUmVvcmRlckl0ZW1zKGZpcnN0Um9vdCwgc2Vjb25kUm9vdCk7XG5cbiAgbGV0IG5ld0NvZGUgPSBzb3VyY2VDb2RlLnRleHQuc3Vic3RyaW5nKHNlY29uZFJvb3RTdGFydCwgc2Vjb25kUm9vdEVuZCk7XG4gIGlmIChuZXdDb2RlW25ld0NvZGUubGVuZ3RoIC0gMV0gIT09ICdcXG4nKSB7XG4gICAgbmV3Q29kZSA9IG5ld0NvZGUgKyAnXFxuJztcbiAgfVxuXG4gIGNvbnN0IG1lc3NhZ2UgPSBgXFxgJHtzZWNvbmROb2RlLmRpc3BsYXlOYW1lfVxcYCBpbXBvcnQgc2hvdWxkIG9jY3VyICR7b3JkZXJ9IGltcG9ydCBvZiBcXGAke2ZpcnN0Tm9kZS5kaXNwbGF5TmFtZX1cXGBgO1xuXG4gIGlmIChvcmRlciA9PT0gJ2JlZm9yZScpIHtcbiAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICBub2RlOiBzZWNvbmROb2RlLm5vZGUsXG4gICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgZml4OiBjYW5GaXggJiYgKGZpeGVyID0+XG4gICAgICAgIGZpeGVyLnJlcGxhY2VUZXh0UmFuZ2UoXG4gICAgICAgICAgW2ZpcnN0Um9vdFN0YXJ0LCBzZWNvbmRSb290RW5kXSxcbiAgICAgICAgICBuZXdDb2RlICsgc291cmNlQ29kZS50ZXh0LnN1YnN0cmluZyhmaXJzdFJvb3RTdGFydCwgc2Vjb25kUm9vdFN0YXJ0KVxuICAgICAgICApKSxcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChvcmRlciA9PT0gJ2FmdGVyJykge1xuICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgIG5vZGU6IHNlY29uZE5vZGUubm9kZSxcbiAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICBmaXg6IGNhbkZpeCAmJiAoZml4ZXIgPT5cbiAgICAgICAgZml4ZXIucmVwbGFjZVRleHRSYW5nZShcbiAgICAgICAgICBbc2Vjb25kUm9vdFN0YXJ0LCBmaXJzdFJvb3RFbmRdLFxuICAgICAgICAgIHNvdXJjZUNvZGUudGV4dC5zdWJzdHJpbmcoc2Vjb25kUm9vdEVuZCwgZmlyc3RSb290RW5kKSArIG5ld0NvZGVcbiAgICAgICAgKSksXG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVwb3J0T3V0T2ZPcmRlcihjb250ZXh0LCBpbXBvcnRlZCwgb3V0T2ZPcmRlciwgb3JkZXIpIHtcbiAgb3V0T2ZPcmRlci5mb3JFYWNoKGZ1bmN0aW9uIChpbXApIHtcbiAgICBjb25zdCBmb3VuZCA9IGltcG9ydGVkLmZpbmQoZnVuY3Rpb24gaGFzSGlnaGVyUmFuayhpbXBvcnRlZEl0ZW0pIHtcbiAgICAgIHJldHVybiBpbXBvcnRlZEl0ZW0ucmFuayA+IGltcC5yYW5rO1xuICAgIH0pO1xuICAgIGZpeE91dE9mT3JkZXIoY29udGV4dCwgZm91bmQsIGltcCwgb3JkZXIpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbWFrZU91dE9mT3JkZXJSZXBvcnQoY29udGV4dCwgaW1wb3J0ZWQpIHtcbiAgY29uc3Qgb3V0T2ZPcmRlciA9IGZpbmRPdXRPZk9yZGVyKGltcG9ydGVkKTtcbiAgaWYgKCFvdXRPZk9yZGVyLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBUaGVyZSBhcmUgdGhpbmdzIHRvIHJlcG9ydC4gVHJ5IHRvIG1pbmltaXplIHRoZSBudW1iZXIgb2YgcmVwb3J0ZWQgZXJyb3JzLlxuICBjb25zdCByZXZlcnNlZEltcG9ydGVkID0gcmV2ZXJzZShpbXBvcnRlZCk7XG4gIGNvbnN0IHJldmVyc2VkT3JkZXIgPSBmaW5kT3V0T2ZPcmRlcihyZXZlcnNlZEltcG9ydGVkKTtcbiAgaWYgKHJldmVyc2VkT3JkZXIubGVuZ3RoIDwgb3V0T2ZPcmRlci5sZW5ndGgpIHtcbiAgICByZXBvcnRPdXRPZk9yZGVyKGNvbnRleHQsIHJldmVyc2VkSW1wb3J0ZWQsIHJldmVyc2VkT3JkZXIsICdhZnRlcicpO1xuICAgIHJldHVybjtcbiAgfVxuICByZXBvcnRPdXRPZk9yZGVyKGNvbnRleHQsIGltcG9ydGVkLCBvdXRPZk9yZGVyLCAnYmVmb3JlJyk7XG59XG5cbmZ1bmN0aW9uIGdldFNvcnRlcihhc2NlbmRpbmcpIHtcbiAgY29uc3QgbXVsdGlwbGllciA9IGFzY2VuZGluZyA/IDEgOiAtMTtcblxuICByZXR1cm4gZnVuY3Rpb24gaW1wb3J0c1NvcnRlcihpbXBvcnRBLCBpbXBvcnRCKSB7XG4gICAgbGV0IHJlc3VsdDtcblxuICAgIGlmIChpbXBvcnRBIDwgaW1wb3J0Qikge1xuICAgICAgcmVzdWx0ID0gLTE7XG4gICAgfSBlbHNlIGlmIChpbXBvcnRBID4gaW1wb3J0Qikge1xuICAgICAgcmVzdWx0ID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0ICogbXVsdGlwbGllcjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbXV0YXRlUmFua3NUb0FscGhhYmV0aXplKGltcG9ydGVkLCBhbHBoYWJldGl6ZU9wdGlvbnMpIHtcbiAgY29uc3QgZ3JvdXBlZEJ5UmFua3MgPSBpbXBvcnRlZC5yZWR1Y2UoZnVuY3Rpb24oYWNjLCBpbXBvcnRlZEl0ZW0pIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWNjW2ltcG9ydGVkSXRlbS5yYW5rXSkpIHtcbiAgICAgIGFjY1tpbXBvcnRlZEl0ZW0ucmFua10gPSBbXTtcbiAgICB9XG4gICAgYWNjW2ltcG9ydGVkSXRlbS5yYW5rXS5wdXNoKGltcG9ydGVkSXRlbSk7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xuXG4gIGNvbnN0IGdyb3VwUmFua3MgPSBPYmplY3Qua2V5cyhncm91cGVkQnlSYW5rcyk7XG5cbiAgY29uc3Qgc29ydGVyRm4gPSBnZXRTb3J0ZXIoYWxwaGFiZXRpemVPcHRpb25zLm9yZGVyID09PSAnYXNjJyk7XG4gIGNvbnN0IGNvbXBhcmF0b3IgPSBhbHBoYWJldGl6ZU9wdGlvbnMuY2FzZUluc2Vuc2l0aXZlXG4gICAgPyAoYSwgYikgPT4gc29ydGVyRm4oU3RyaW5nKGEudmFsdWUpLnRvTG93ZXJDYXNlKCksIFN0cmluZyhiLnZhbHVlKS50b0xvd2VyQ2FzZSgpKVxuICAgIDogKGEsIGIpID0+IHNvcnRlckZuKGEudmFsdWUsIGIudmFsdWUpO1xuXG4gIC8vIHNvcnQgaW1wb3J0cyBsb2NhbGx5IHdpdGhpbiB0aGVpciBncm91cFxuICBncm91cFJhbmtzLmZvckVhY2goZnVuY3Rpb24oZ3JvdXBSYW5rKSB7XG4gICAgZ3JvdXBlZEJ5UmFua3NbZ3JvdXBSYW5rXS5zb3J0KGNvbXBhcmF0b3IpO1xuICB9KTtcblxuICAvLyBhc3NpZ24gZ2xvYmFsbHkgdW5pcXVlIHJhbmsgdG8gZWFjaCBpbXBvcnRcbiAgbGV0IG5ld1JhbmsgPSAwO1xuICBjb25zdCBhbHBoYWJldGl6ZWRSYW5rcyA9IGdyb3VwUmFua3Muc29ydCgpLnJlZHVjZShmdW5jdGlvbihhY2MsIGdyb3VwUmFuaykge1xuICAgIGdyb3VwZWRCeVJhbmtzW2dyb3VwUmFua10uZm9yRWFjaChmdW5jdGlvbihpbXBvcnRlZEl0ZW0pIHtcbiAgICAgIGFjY1tgJHtpbXBvcnRlZEl0ZW0udmFsdWV9fCR7aW1wb3J0ZWRJdGVtLm5vZGUuaW1wb3J0S2luZH1gXSA9IHBhcnNlSW50KGdyb3VwUmFuaywgMTApICsgbmV3UmFuaztcbiAgICAgIG5ld1JhbmsgKz0gMTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG5cbiAgLy8gbXV0YXRlIHRoZSBvcmlnaW5hbCBncm91cC1yYW5rIHdpdGggYWxwaGFiZXRpemVkLXJhbmtcbiAgaW1wb3J0ZWQuZm9yRWFjaChmdW5jdGlvbihpbXBvcnRlZEl0ZW0pIHtcbiAgICBpbXBvcnRlZEl0ZW0ucmFuayA9IGFscGhhYmV0aXplZFJhbmtzW2Ake2ltcG9ydGVkSXRlbS52YWx1ZX18JHtpbXBvcnRlZEl0ZW0ubm9kZS5pbXBvcnRLaW5kfWBdO1xuICB9KTtcbn1cblxuLy8gREVURUNUSU5HXG5cbmZ1bmN0aW9uIGNvbXB1dGVQYXRoUmFuayhyYW5rcywgcGF0aEdyb3VwcywgcGF0aCwgbWF4UG9zaXRpb24pIHtcbiAgZm9yIChsZXQgaSA9IDAsIGwgPSBwYXRoR3JvdXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IHsgcGF0dGVybiwgcGF0dGVybk9wdGlvbnMsIGdyb3VwLCBwb3NpdGlvbiA9IDEgfSA9IHBhdGhHcm91cHNbaV07XG4gICAgaWYgKG1pbmltYXRjaChwYXRoLCBwYXR0ZXJuLCBwYXR0ZXJuT3B0aW9ucyB8fCB7IG5vY29tbWVudDogdHJ1ZSB9KSkge1xuICAgICAgcmV0dXJuIHJhbmtzW2dyb3VwXSArIChwb3NpdGlvbiAvIG1heFBvc2l0aW9uKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY29tcHV0ZVJhbmsoY29udGV4dCwgcmFua3MsIGltcG9ydEVudHJ5LCBleGNsdWRlZEltcG9ydFR5cGVzKSB7XG4gIGxldCBpbXBUeXBlO1xuICBsZXQgcmFuaztcbiAgaWYgKGltcG9ydEVudHJ5LnR5cGUgPT09ICdpbXBvcnQ6b2JqZWN0Jykge1xuICAgIGltcFR5cGUgPSAnb2JqZWN0JztcbiAgfSBlbHNlIGlmIChpbXBvcnRFbnRyeS5ub2RlLmltcG9ydEtpbmQgPT09ICd0eXBlJyAmJiByYW5rcy5vbWl0dGVkVHlwZXMuaW5kZXhPZigndHlwZScpID09PSAtMSkge1xuICAgIGltcFR5cGUgPSAndHlwZSc7XG4gIH0gZWxzZSB7XG4gICAgaW1wVHlwZSA9IGltcG9ydFR5cGUoaW1wb3J0RW50cnkudmFsdWUsIGNvbnRleHQpO1xuICB9XG4gIGlmICghZXhjbHVkZWRJbXBvcnRUeXBlcy5oYXMoaW1wVHlwZSkpIHtcbiAgICByYW5rID0gY29tcHV0ZVBhdGhSYW5rKHJhbmtzLmdyb3VwcywgcmFua3MucGF0aEdyb3VwcywgaW1wb3J0RW50cnkudmFsdWUsIHJhbmtzLm1heFBvc2l0aW9uKTtcbiAgfVxuICBpZiAodHlwZW9mIHJhbmsgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmFuayA9IHJhbmtzLmdyb3Vwc1tpbXBUeXBlXTtcbiAgfVxuICBpZiAoaW1wb3J0RW50cnkudHlwZSAhPT0gJ2ltcG9ydCcgJiYgIWltcG9ydEVudHJ5LnR5cGUuc3RhcnRzV2l0aCgnaW1wb3J0OicpKSB7XG4gICAgcmFuayArPSAxMDA7XG4gIH1cblxuICByZXR1cm4gcmFuaztcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJOb2RlKGNvbnRleHQsIGltcG9ydEVudHJ5LCByYW5rcywgaW1wb3J0ZWQsIGV4Y2x1ZGVkSW1wb3J0VHlwZXMpIHtcbiAgY29uc3QgcmFuayA9IGNvbXB1dGVSYW5rKGNvbnRleHQsIHJhbmtzLCBpbXBvcnRFbnRyeSwgZXhjbHVkZWRJbXBvcnRUeXBlcyk7XG4gIGlmIChyYW5rICE9PSAtMSkge1xuICAgIGltcG9ydGVkLnB1c2goT2JqZWN0LmFzc2lnbih7fSwgaW1wb3J0RW50cnksIHsgcmFuayB9KSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNNb2R1bGVMZXZlbFJlcXVpcmUobm9kZSkge1xuICBsZXQgbiA9IG5vZGU7XG4gIC8vIEhhbmRsZSBjYXNlcyBsaWtlIGBjb25zdCBiYXogPSByZXF1aXJlKCdmb28nKS5iYXIuYmF6YFxuICAvLyBhbmQgYGNvbnN0IGZvbyA9IHJlcXVpcmUoJ2ZvbycpKClgXG4gIHdoaWxlIChcbiAgICAobi5wYXJlbnQudHlwZSA9PT0gJ01lbWJlckV4cHJlc3Npb24nICYmIG4ucGFyZW50Lm9iamVjdCA9PT0gbikgfHxcbiAgICAobi5wYXJlbnQudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJyAmJiBuLnBhcmVudC5jYWxsZWUgPT09IG4pXG4gICkge1xuICAgIG4gPSBuLnBhcmVudDtcbiAgfVxuICByZXR1cm4gKFxuICAgIG4ucGFyZW50LnR5cGUgPT09ICdWYXJpYWJsZURlY2xhcmF0b3InICYmXG4gICAgbi5wYXJlbnQucGFyZW50LnR5cGUgPT09ICdWYXJpYWJsZURlY2xhcmF0aW9uJyAmJlxuICAgIG4ucGFyZW50LnBhcmVudC5wYXJlbnQudHlwZSA9PT0gJ1Byb2dyYW0nXG4gICk7XG59XG5cbmNvbnN0IHR5cGVzID0gWydidWlsdGluJywgJ2V4dGVybmFsJywgJ2ludGVybmFsJywgJ3Vua25vd24nLCAncGFyZW50JywgJ3NpYmxpbmcnLCAnaW5kZXgnLCAnb2JqZWN0JywgJ3R5cGUnXTtcblxuLy8gQ3JlYXRlcyBhbiBvYmplY3Qgd2l0aCB0eXBlLXJhbmsgcGFpcnMuXG4vLyBFeGFtcGxlOiB7IGluZGV4OiAwLCBzaWJsaW5nOiAxLCBwYXJlbnQ6IDEsIGV4dGVybmFsOiAxLCBidWlsdGluOiAyLCBpbnRlcm5hbDogMiB9XG4vLyBXaWxsIHRocm93IGFuIGVycm9yIGlmIGl0IGNvbnRhaW5zIGEgdHlwZSB0aGF0IGRvZXMgbm90IGV4aXN0LCBvciBoYXMgYSBkdXBsaWNhdGVcbmZ1bmN0aW9uIGNvbnZlcnRHcm91cHNUb1JhbmtzKGdyb3Vwcykge1xuICBjb25zdCByYW5rT2JqZWN0ID0gZ3JvdXBzLnJlZHVjZShmdW5jdGlvbihyZXMsIGdyb3VwLCBpbmRleCkge1xuICAgIGlmICh0eXBlb2YgZ3JvdXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICBncm91cCA9IFtncm91cF07XG4gICAgfVxuICAgIGdyb3VwLmZvckVhY2goZnVuY3Rpb24oZ3JvdXBJdGVtKSB7XG4gICAgICBpZiAodHlwZXMuaW5kZXhPZihncm91cEl0ZW0pID09PSAtMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBjb25maWd1cmF0aW9uIG9mIHRoZSBydWxlOiBVbmtub3duIHR5cGUgYCcgK1xuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGdyb3VwSXRlbSkgKyAnYCcpO1xuICAgICAgfVxuICAgICAgaWYgKHJlc1tncm91cEl0ZW1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvcnJlY3QgY29uZmlndXJhdGlvbiBvZiB0aGUgcnVsZTogYCcgKyBncm91cEl0ZW0gKyAnYCBpcyBkdXBsaWNhdGVkJyk7XG4gICAgICB9XG4gICAgICByZXNbZ3JvdXBJdGVtXSA9IGluZGV4O1xuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG4gIH0sIHt9KTtcblxuICBjb25zdCBvbWl0dGVkVHlwZXMgPSB0eXBlcy5maWx0ZXIoZnVuY3Rpb24odHlwZSkge1xuICAgIHJldHVybiByYW5rT2JqZWN0W3R5cGVdID09PSB1bmRlZmluZWQ7XG4gIH0pO1xuXG4gIGNvbnN0IHJhbmtzID0gb21pdHRlZFR5cGVzLnJlZHVjZShmdW5jdGlvbihyZXMsIHR5cGUpIHtcbiAgICByZXNbdHlwZV0gPSBncm91cHMubGVuZ3RoO1xuICAgIHJldHVybiByZXM7XG4gIH0sIHJhbmtPYmplY3QpO1xuXG4gIHJldHVybiB7IGdyb3VwczogcmFua3MsIG9taXR0ZWRUeXBlcyB9O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UGF0aEdyb3Vwc0ZvclJhbmtzKHBhdGhHcm91cHMpIHtcbiAgY29uc3QgYWZ0ZXIgPSB7fTtcbiAgY29uc3QgYmVmb3JlID0ge307XG5cbiAgY29uc3QgdHJhbnNmb3JtZWQgPSBwYXRoR3JvdXBzLm1hcCgocGF0aEdyb3VwLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHsgZ3JvdXAsIHBvc2l0aW9uOiBwb3NpdGlvblN0cmluZyB9ID0gcGF0aEdyb3VwO1xuICAgIGxldCBwb3NpdGlvbiA9IDA7XG4gICAgaWYgKHBvc2l0aW9uU3RyaW5nID09PSAnYWZ0ZXInKSB7XG4gICAgICBpZiAoIWFmdGVyW2dyb3VwXSkge1xuICAgICAgICBhZnRlcltncm91cF0gPSAxO1xuICAgICAgfVxuICAgICAgcG9zaXRpb24gPSBhZnRlcltncm91cF0rKztcbiAgICB9IGVsc2UgaWYgKHBvc2l0aW9uU3RyaW5nID09PSAnYmVmb3JlJykge1xuICAgICAgaWYgKCFiZWZvcmVbZ3JvdXBdKSB7XG4gICAgICAgIGJlZm9yZVtncm91cF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIGJlZm9yZVtncm91cF0ucHVzaChpbmRleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHBhdGhHcm91cCwgeyBwb3NpdGlvbiB9KTtcbiAgfSk7XG5cbiAgbGV0IG1heFBvc2l0aW9uID0gMTtcblxuICBPYmplY3Qua2V5cyhiZWZvcmUpLmZvckVhY2goKGdyb3VwKSA9PiB7XG4gICAgY29uc3QgZ3JvdXBMZW5ndGggPSBiZWZvcmVbZ3JvdXBdLmxlbmd0aDtcbiAgICBiZWZvcmVbZ3JvdXBdLmZvckVhY2goKGdyb3VwSW5kZXgsIGluZGV4KSA9PiB7XG4gICAgICB0cmFuc2Zvcm1lZFtncm91cEluZGV4XS5wb3NpdGlvbiA9IC0xICogKGdyb3VwTGVuZ3RoIC0gaW5kZXgpO1xuICAgIH0pO1xuICAgIG1heFBvc2l0aW9uID0gTWF0aC5tYXgobWF4UG9zaXRpb24sIGdyb3VwTGVuZ3RoKTtcbiAgfSk7XG5cbiAgT2JqZWN0LmtleXMoYWZ0ZXIpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGNvbnN0IGdyb3VwTmV4dFBvc2l0aW9uID0gYWZ0ZXJba2V5XTtcbiAgICBtYXhQb3NpdGlvbiA9IE1hdGgubWF4KG1heFBvc2l0aW9uLCBncm91cE5leHRQb3NpdGlvbiAtIDEpO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHBhdGhHcm91cHM6IHRyYW5zZm9ybWVkLFxuICAgIG1heFBvc2l0aW9uOiBtYXhQb3NpdGlvbiA+IDEwID8gTWF0aC5wb3coMTAsIE1hdGguY2VpbChNYXRoLmxvZzEwKG1heFBvc2l0aW9uKSkpIDogMTAsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGZpeE5ld0xpbmVBZnRlckltcG9ydChjb250ZXh0LCBwcmV2aW91c0ltcG9ydCkge1xuICBjb25zdCBwcmV2Um9vdCA9IGZpbmRSb290Tm9kZShwcmV2aW91c0ltcG9ydC5ub2RlKTtcbiAgY29uc3QgdG9rZW5zVG9FbmRPZkxpbmUgPSB0YWtlVG9rZW5zQWZ0ZXJXaGlsZShcbiAgICBjb250ZXh0LmdldFNvdXJjZUNvZGUoKSwgcHJldlJvb3QsIGNvbW1lbnRPblNhbWVMaW5lQXMocHJldlJvb3QpKTtcblxuICBsZXQgZW5kT2ZMaW5lID0gcHJldlJvb3QucmFuZ2VbMV07XG4gIGlmICh0b2tlbnNUb0VuZE9mTGluZS5sZW5ndGggPiAwKSB7XG4gICAgZW5kT2ZMaW5lID0gdG9rZW5zVG9FbmRPZkxpbmVbdG9rZW5zVG9FbmRPZkxpbmUubGVuZ3RoIC0gMV0ucmFuZ2VbMV07XG4gIH1cbiAgcmV0dXJuIChmaXhlcikgPT4gZml4ZXIuaW5zZXJ0VGV4dEFmdGVyUmFuZ2UoW3ByZXZSb290LnJhbmdlWzBdLCBlbmRPZkxpbmVdLCAnXFxuJyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU5ld0xpbmVBZnRlckltcG9ydChjb250ZXh0LCBjdXJyZW50SW1wb3J0LCBwcmV2aW91c0ltcG9ydCkge1xuICBjb25zdCBzb3VyY2VDb2RlID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCk7XG4gIGNvbnN0IHByZXZSb290ID0gZmluZFJvb3ROb2RlKHByZXZpb3VzSW1wb3J0Lm5vZGUpO1xuICBjb25zdCBjdXJyUm9vdCA9IGZpbmRSb290Tm9kZShjdXJyZW50SW1wb3J0Lm5vZGUpO1xuICBjb25zdCByYW5nZVRvUmVtb3ZlID0gW1xuICAgIGZpbmRFbmRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgcHJldlJvb3QpLFxuICAgIGZpbmRTdGFydE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBjdXJyUm9vdCksXG4gIF07XG4gIGlmICgvXlxccyokLy50ZXN0KHNvdXJjZUNvZGUudGV4dC5zdWJzdHJpbmcocmFuZ2VUb1JlbW92ZVswXSwgcmFuZ2VUb1JlbW92ZVsxXSkpKSB7XG4gICAgcmV0dXJuIChmaXhlcikgPT4gZml4ZXIucmVtb3ZlUmFuZ2UocmFuZ2VUb1JlbW92ZSk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gbWFrZU5ld2xpbmVzQmV0d2VlblJlcG9ydCAoY29udGV4dCwgaW1wb3J0ZWQsIG5ld2xpbmVzQmV0d2VlbkltcG9ydHMpIHtcbiAgY29uc3QgZ2V0TnVtYmVyT2ZFbXB0eUxpbmVzQmV0d2VlbiA9IChjdXJyZW50SW1wb3J0LCBwcmV2aW91c0ltcG9ydCkgPT4ge1xuICAgIGNvbnN0IGxpbmVzQmV0d2VlbkltcG9ydHMgPSBjb250ZXh0LmdldFNvdXJjZUNvZGUoKS5saW5lcy5zbGljZShcbiAgICAgIHByZXZpb3VzSW1wb3J0Lm5vZGUubG9jLmVuZC5saW5lLFxuICAgICAgY3VycmVudEltcG9ydC5ub2RlLmxvYy5zdGFydC5saW5lIC0gMVxuICAgICk7XG5cbiAgICByZXR1cm4gbGluZXNCZXR3ZWVuSW1wb3J0cy5maWx0ZXIoKGxpbmUpID0+ICFsaW5lLnRyaW0oKS5sZW5ndGgpLmxlbmd0aDtcbiAgfTtcbiAgbGV0IHByZXZpb3VzSW1wb3J0ID0gaW1wb3J0ZWRbMF07XG5cbiAgaW1wb3J0ZWQuc2xpY2UoMSkuZm9yRWFjaChmdW5jdGlvbihjdXJyZW50SW1wb3J0KSB7XG4gICAgY29uc3QgZW1wdHlMaW5lc0JldHdlZW4gPSBnZXROdW1iZXJPZkVtcHR5TGluZXNCZXR3ZWVuKGN1cnJlbnRJbXBvcnQsIHByZXZpb3VzSW1wb3J0KTtcblxuICAgIGlmIChuZXdsaW5lc0JldHdlZW5JbXBvcnRzID09PSAnYWx3YXlzJ1xuICAgICAgICB8fCBuZXdsaW5lc0JldHdlZW5JbXBvcnRzID09PSAnYWx3YXlzLWFuZC1pbnNpZGUtZ3JvdXBzJykge1xuICAgICAgaWYgKGN1cnJlbnRJbXBvcnQucmFuayAhPT0gcHJldmlvdXNJbXBvcnQucmFuayAmJiBlbXB0eUxpbmVzQmV0d2VlbiA9PT0gMCkge1xuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZTogcHJldmlvdXNJbXBvcnQubm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiAnVGhlcmUgc2hvdWxkIGJlIGF0IGxlYXN0IG9uZSBlbXB0eSBsaW5lIGJldHdlZW4gaW1wb3J0IGdyb3VwcycsXG4gICAgICAgICAgZml4OiBmaXhOZXdMaW5lQWZ0ZXJJbXBvcnQoY29udGV4dCwgcHJldmlvdXNJbXBvcnQpLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudEltcG9ydC5yYW5rID09PSBwcmV2aW91c0ltcG9ydC5yYW5rXG4gICAgICAgICYmIGVtcHR5TGluZXNCZXR3ZWVuID4gMFxuICAgICAgICAmJiBuZXdsaW5lc0JldHdlZW5JbXBvcnRzICE9PSAnYWx3YXlzLWFuZC1pbnNpZGUtZ3JvdXBzJykge1xuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZTogcHJldmlvdXNJbXBvcnQubm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiAnVGhlcmUgc2hvdWxkIGJlIG5vIGVtcHR5IGxpbmUgd2l0aGluIGltcG9ydCBncm91cCcsXG4gICAgICAgICAgZml4OiByZW1vdmVOZXdMaW5lQWZ0ZXJJbXBvcnQoY29udGV4dCwgY3VycmVudEltcG9ydCwgcHJldmlvdXNJbXBvcnQpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVtcHR5TGluZXNCZXR3ZWVuID4gMCkge1xuICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICBub2RlOiBwcmV2aW91c0ltcG9ydC5ub2RlLFxuICAgICAgICBtZXNzYWdlOiAnVGhlcmUgc2hvdWxkIGJlIG5vIGVtcHR5IGxpbmUgYmV0d2VlbiBpbXBvcnQgZ3JvdXBzJyxcbiAgICAgICAgZml4OiByZW1vdmVOZXdMaW5lQWZ0ZXJJbXBvcnQoY29udGV4dCwgY3VycmVudEltcG9ydCwgcHJldmlvdXNJbXBvcnQpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJldmlvdXNJbXBvcnQgPSBjdXJyZW50SW1wb3J0O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxwaGFiZXRpemVDb25maWcob3B0aW9ucykge1xuICBjb25zdCBhbHBoYWJldGl6ZSA9IG9wdGlvbnMuYWxwaGFiZXRpemUgfHwge307XG4gIGNvbnN0IG9yZGVyID0gYWxwaGFiZXRpemUub3JkZXIgfHwgJ2lnbm9yZSc7XG4gIGNvbnN0IGNhc2VJbnNlbnNpdGl2ZSA9IGFscGhhYmV0aXplLmNhc2VJbnNlbnNpdGl2ZSB8fCBmYWxzZTtcblxuICByZXR1cm4geyBvcmRlciwgY2FzZUluc2Vuc2l0aXZlIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIHVybDogZG9jc1VybCgnb3JkZXInKSxcbiAgICB9LFxuXG4gICAgZml4YWJsZTogJ2NvZGUnLFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGdyb3Vwczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcGF0aEdyb3Vwczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgcGF0dGVybjoge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXR0ZXJuT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBncm91cDoge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICBlbnVtOiB0eXBlcyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgIGVudW06IFsnYWZ0ZXInLCAnYmVmb3JlJ10sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsncGF0dGVybicsICdncm91cCddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICduZXdsaW5lcy1iZXR3ZWVuJzoge1xuICAgICAgICAgICAgZW51bTogW1xuICAgICAgICAgICAgICAnaWdub3JlJyxcbiAgICAgICAgICAgICAgJ2Fsd2F5cycsXG4gICAgICAgICAgICAgICdhbHdheXMtYW5kLWluc2lkZS1ncm91cHMnLFxuICAgICAgICAgICAgICAnbmV2ZXInLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFscGhhYmV0aXplOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgY2FzZUluc2Vuc2l0aXZlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBvcmRlcjoge1xuICAgICAgICAgICAgICAgIGVudW06IFsnaWdub3JlJywgJ2FzYycsICdkZXNjJ10sXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogJ2lnbm9yZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgd2Fybk9uVW5hc3NpZ25lZEltcG9ydHM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIGltcG9ydE9yZGVyUnVsZSAoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG4gICAgY29uc3QgbmV3bGluZXNCZXR3ZWVuSW1wb3J0cyA9IG9wdGlvbnNbJ25ld2xpbmVzLWJldHdlZW4nXSB8fCAnaWdub3JlJztcbiAgICBjb25zdCBwYXRoR3JvdXBzRXhjbHVkZWRJbXBvcnRUeXBlcyA9IG5ldyBTZXQob3B0aW9uc1sncGF0aEdyb3Vwc0V4Y2x1ZGVkSW1wb3J0VHlwZXMnXSB8fCBbJ2J1aWx0aW4nLCAnZXh0ZXJuYWwnLCAnb2JqZWN0J10pO1xuICAgIGNvbnN0IGFscGhhYmV0aXplID0gZ2V0QWxwaGFiZXRpemVDb25maWcob3B0aW9ucyk7XG4gICAgbGV0IHJhbmtzO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgcGF0aEdyb3VwcywgbWF4UG9zaXRpb24gfSA9IGNvbnZlcnRQYXRoR3JvdXBzRm9yUmFua3Mob3B0aW9ucy5wYXRoR3JvdXBzIHx8IFtdKTtcbiAgICAgIGNvbnN0IHsgZ3JvdXBzLCBvbWl0dGVkVHlwZXMgfSA9IGNvbnZlcnRHcm91cHNUb1JhbmtzKG9wdGlvbnMuZ3JvdXBzIHx8IGRlZmF1bHRHcm91cHMpO1xuICAgICAgcmFua3MgPSB7XG4gICAgICAgIGdyb3VwcyxcbiAgICAgICAgb21pdHRlZFR5cGVzLFxuICAgICAgICBwYXRoR3JvdXBzLFxuICAgICAgICBtYXhQb3NpdGlvbixcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIE1hbGZvcm1lZCBjb25maWd1cmF0aW9uXG4gICAgICByZXR1cm4ge1xuICAgICAgICBQcm9ncmFtOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQobm9kZSwgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cbiAgICBsZXQgaW1wb3J0ZWQgPSBbXTtcblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbjogZnVuY3Rpb24gaGFuZGxlSW1wb3J0cyhub2RlKSB7XG4gICAgICAgIC8vIElnbm9yaW5nIHVuYXNzaWduZWQgaW1wb3J0cyB1bmxlc3Mgd2Fybk9uVW5hc3NpZ25lZEltcG9ydHMgaXMgc2V0XG4gICAgICAgIGlmIChub2RlLnNwZWNpZmllcnMubGVuZ3RoIHx8IG9wdGlvbnMud2Fybk9uVW5hc3NpZ25lZEltcG9ydHMpIHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gbm9kZS5zb3VyY2UudmFsdWU7XG4gICAgICAgICAgcmVnaXN0ZXJOb2RlKFxuICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgdmFsdWU6IG5hbWUsXG4gICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBuYW1lLFxuICAgICAgICAgICAgICB0eXBlOiAnaW1wb3J0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByYW5rcyxcbiAgICAgICAgICAgIGltcG9ydGVkLFxuICAgICAgICAgICAgcGF0aEdyb3Vwc0V4Y2x1ZGVkSW1wb3J0VHlwZXNcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgVFNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbjogZnVuY3Rpb24gaGFuZGxlSW1wb3J0cyhub2RlKSB7XG4gICAgICAgIGxldCBkaXNwbGF5TmFtZTtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICBsZXQgdHlwZTtcbiAgICAgICAgLy8gc2tpcCBcImV4cG9ydCBpbXBvcnRcInNcbiAgICAgICAgaWYgKG5vZGUuaXNFeHBvcnQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUubW9kdWxlUmVmZXJlbmNlLnR5cGUgPT09ICdUU0V4dGVybmFsTW9kdWxlUmVmZXJlbmNlJykge1xuICAgICAgICAgIHZhbHVlID0gbm9kZS5tb2R1bGVSZWZlcmVuY2UuZXhwcmVzc2lvbi52YWx1ZTtcbiAgICAgICAgICBkaXNwbGF5TmFtZSA9IHZhbHVlO1xuICAgICAgICAgIHR5cGUgPSAnaW1wb3J0JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgICAgIGRpc3BsYXlOYW1lID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCkuZ2V0VGV4dChub2RlLm1vZHVsZVJlZmVyZW5jZSk7XG4gICAgICAgICAgdHlwZSA9ICdpbXBvcnQ6b2JqZWN0JztcbiAgICAgICAgfVxuICAgICAgICByZWdpc3Rlck5vZGUoXG4gICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZSxcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICByYW5rcyxcbiAgICAgICAgICBpbXBvcnRlZCxcbiAgICAgICAgICBwYXRoR3JvdXBzRXhjbHVkZWRJbXBvcnRUeXBlc1xuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIENhbGxFeHByZXNzaW9uOiBmdW5jdGlvbiBoYW5kbGVSZXF1aXJlcyhub2RlKSB7XG4gICAgICAgIGlmICghaXNTdGF0aWNSZXF1aXJlKG5vZGUpIHx8ICFpc01vZHVsZUxldmVsUmVxdWlyZShub2RlKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuYW1lID0gbm9kZS5hcmd1bWVudHNbMF0udmFsdWU7XG4gICAgICAgIHJlZ2lzdGVyTm9kZShcbiAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICB2YWx1ZTogbmFtZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBuYW1lLFxuICAgICAgICAgICAgdHlwZTogJ3JlcXVpcmUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmFua3MsXG4gICAgICAgICAgaW1wb3J0ZWQsXG4gICAgICAgICAgcGF0aEdyb3Vwc0V4Y2x1ZGVkSW1wb3J0VHlwZXNcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICAnUHJvZ3JhbTpleGl0JzogZnVuY3Rpb24gcmVwb3J0QW5kUmVzZXQoKSB7XG4gICAgICAgIGlmIChuZXdsaW5lc0JldHdlZW5JbXBvcnRzICE9PSAnaWdub3JlJykge1xuICAgICAgICAgIG1ha2VOZXdsaW5lc0JldHdlZW5SZXBvcnQoY29udGV4dCwgaW1wb3J0ZWQsIG5ld2xpbmVzQmV0d2VlbkltcG9ydHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFscGhhYmV0aXplLm9yZGVyICE9PSAnaWdub3JlJykge1xuICAgICAgICAgIG11dGF0ZVJhbmtzVG9BbHBoYWJldGl6ZShpbXBvcnRlZCwgYWxwaGFiZXRpemUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZU91dE9mT3JkZXJSZXBvcnQoY29udGV4dCwgaW1wb3J0ZWQpO1xuXG4gICAgICAgIGltcG9ydGVkID0gW107XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19