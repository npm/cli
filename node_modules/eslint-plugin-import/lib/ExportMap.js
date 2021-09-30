'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();exports.












































































































































































































































































































































































































































































































































































































































































































recursivePatternCapture = recursivePatternCapture;var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);var _doctrine = require('doctrine');var _doctrine2 = _interopRequireDefault(_doctrine);var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);var _eslint = require('eslint');var _parse = require('eslint-module-utils/parse');var _parse2 = _interopRequireDefault(_parse);var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);var _ignore = require('eslint-module-utils/ignore');var _ignore2 = _interopRequireDefault(_ignore);var _hash = require('eslint-module-utils/hash');var _unambiguous = require('eslint-module-utils/unambiguous');var unambiguous = _interopRequireWildcard(_unambiguous);var _tsconfigLoader = require('tsconfig-paths/lib/tsconfig-loader');var _arrayIncludes = require('array-includes');var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj['default'] = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var parseConfigFileTextToJson = void 0;var log = (0, _debug2['default'])('eslint-plugin-import:ExportMap');var exportCache = new Map();var tsConfigCache = new Map();var ExportMap = function () {function ExportMap(path) {_classCallCheck(this, ExportMap);this.path = path;this.namespace = new Map(); // todo: restructure to key on path, value is resolver + map of names
    this.reexports = new Map(); /**
                                 * star-exports
                                 * @type {Set} of () => ExportMap
                                 */this.dependencies = new Set(); /**
                                                                   * dependencies of this module that are not explicitly re-exported
                                                                   * @type {Map} from path = () => ExportMap
                                                                   */this.imports = new Map();this.errors = [];}_createClass(ExportMap, [{ key: 'has', /**
                                                                                                                                                        * Note that this does not check explicitly re-exported names for existence
                                                                                                                                                        * in the base namespace, but it will expand all `export * from '...'` exports
                                                                                                                                                        * if not found in the explicit namespace.
                                                                                                                                                        * @param  {string}  name
                                                                                                                                                        * @return {Boolean} true if `name` is exported by this module.
                                                                                                                                                        */value: function () {function has(name) {if (this.namespace.has(name)) return true;if (this.reexports.has(name)) return true; // default exports must be explicitly re-exported (#328)
        if (name !== 'default') {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {for (var _iterator = this.dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var dep = _step.value;var innerMap = dep(); // todo: report as unresolved?
              if (!innerMap) continue;if (innerMap.has(name)) return true;}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}}return false;}return has;}() /**
                                                                                                                                                                                                                                                                                                                                 * ensure that imported name fully resolves.
                                                                                                                                                                                                                                                                                                                                 * @param  {string} name
                                                                                                                                                                                                                                                                                                                                 * @return {{ found: boolean, path: ExportMap[] }}
                                                                                                                                                                                                                                                                                                                                 */ }, { key: 'hasDeep', value: function () {function hasDeep(name) {if (this.namespace.has(name)) return { found: true, path: [this] };if (this.reexports.has(name)) {var reexports = this.reexports.get(name);var imported = reexports.getImport(); // if import is ignored, return explicit 'null'
          if (imported == null) return { found: true, path: [this] }; // safeguard against cycles, only if name matches
          if (imported.path === this.path && reexports.local === name) {return { found: false, path: [this] };}var deep = imported.hasDeep(reexports.local);deep.path.unshift(this);return deep;} // default exports must be explicitly re-exported (#328)
        if (name !== 'default') {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {for (var _iterator2 = this.dependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var dep = _step2.value;var innerMap = dep();if (innerMap == null) return { found: true, path: [this] }; // todo: report as unresolved?
              if (!innerMap) continue; // safeguard against cycles
              if (innerMap.path === this.path) continue;var innerValue = innerMap.hasDeep(name);if (innerValue.found) {innerValue.path.unshift(this);return innerValue;}}} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}}return { found: false, path: [this] };}return hasDeep;}() }, { key: 'get', value: function () {function get(name) {if (this.namespace.has(name)) return this.namespace.get(name);if (this.reexports.has(name)) {var reexports = this.reexports.get(name);var imported = reexports.getImport(); // if import is ignored, return explicit 'null'
          if (imported == null) return null; // safeguard against cycles, only if name matches
          if (imported.path === this.path && reexports.local === name) return undefined;return imported.get(reexports.local);} // default exports must be explicitly re-exported (#328)
        if (name !== 'default') {var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {for (var _iterator3 = this.dependencies[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var dep = _step3.value;var innerMap = dep(); // todo: report as unresolved?
              if (!innerMap) continue; // safeguard against cycles
              if (innerMap.path === this.path) continue;var innerValue = innerMap.get(name);if (innerValue !== undefined) return innerValue;}} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3['return']) {_iterator3['return']();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}}return undefined;}return get;}() }, { key: 'forEach', value: function () {function forEach(callback, thisArg) {var _this = this;this.namespace.forEach(function (v, n) {return callback.call(thisArg, v, n, _this);});this.reexports.forEach(function (reexports, name) {var reexported = reexports.getImport(); // can't look up meta for ignored re-exports (#348)
          callback.call(thisArg, reexported && reexported.get(reexports.local), name, _this);});this.dependencies.forEach(function (dep) {var d = dep(); // CJS / ignored dependencies won't exist (#717)
          if (d == null) return;d.forEach(function (v, n) {return n !== 'default' && callback.call(thisArg, v, n, _this);});});}return forEach;}() // todo: keys, values, entries?
  }, { key: 'reportErrors', value: function () {function reportErrors(context, declaration) {context.report({ node: declaration.source, message: 'Parse errors in imported module \'' + String(declaration.source.value) + '\': ' + ('' + String(this.errors.map(function (e) {return String(e.message) + ' (' + String(e.lineNumber) + ':' + String(e.column) + ')';}).join(', '))) });}return reportErrors;}() }, { key: 'hasDefault', get: function () {function get() {return this.get('default') != null;}return get;}() // stronger than this.has
  }, { key: 'size', get: function () {function get() {var size = this.namespace.size + this.reexports.size;this.dependencies.forEach(function (dep) {var d = dep(); // CJS / ignored dependencies won't exist (#717)
          if (d == null) return;size += d.size;});return size;}return get;}() }]);return ExportMap;}(); /**
                                                                                                         * parse docs from the first node that has leading comments
                                                                                                         */exports['default'] = ExportMap;function captureDoc(source, docStyleParsers) {var metadata = {}; // 'some' short-circuits on first 'true'
  for (var _len = arguments.length, nodes = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {nodes[_key - 2] = arguments[_key];}nodes.some(function (n) {try {var leadingComments = void 0; // n.leadingComments is legacy `attachComments` behavior
      if ('leadingComments' in n) {leadingComments = n.leadingComments;} else if (n.range) {leadingComments = source.getCommentsBefore(n);}if (!leadingComments || leadingComments.length === 0) return false;for (var name in docStyleParsers) {var doc = docStyleParsers[name](leadingComments);if (doc) {metadata.doc = doc;}}return true;} catch (err) {return false;}});return metadata;}var availableDocStyleParsers = { jsdoc: captureJsDoc, tomdoc: captureTomDoc }; /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * parse JSDoc from leading comments
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * @param {object[]} comments
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * @return {{ doc: object }}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              */function captureJsDoc(comments) {var doc = void 0; // capture XSDoc
  comments.forEach(function (comment) {// skip non-block comments
    if (comment.type !== 'Block') return;try {doc = _doctrine2['default'].parse(comment.value, { unwrap: true });} catch (err) {/* don't care, for now? maybe add to `errors?` */}});return doc;} /**
                                                                                                                                                                                                    * parse TomDoc section from comments
                                                                                                                                                                                                    */function captureTomDoc(comments) {// collect lines up to first paragraph break
  var lines = [];for (var i = 0; i < comments.length; i++) {var comment = comments[i];if (comment.value.match(/^\s*$/)) break;lines.push(comment.value.trim());} // return doctrine-like object
  var statusMatch = lines.join(' ').match(/^(Public|Internal|Deprecated):\s*(.+)/);if (statusMatch) {return { description: statusMatch[2], tags: [{ title: statusMatch[1].toLowerCase(), description: statusMatch[2] }] };}}var supportedImportTypes = new Set(['ImportDefaultSpecifier', 'ImportNamespaceSpecifier']);ExportMap.get = function (source, context) {var path = (0, _resolve2['default'])(source, context);if (path == null) return null;return ExportMap['for'](childContext(path, context));};ExportMap['for'] = function (context) {var path = context.path;var cacheKey = (0, _hash.hashObject)(context).digest('hex');var exportMap = exportCache.get(cacheKey); // return cached ignore
  if (exportMap === null) return null;var stats = _fs2['default'].statSync(path);if (exportMap != null) {// date equality check
    if (exportMap.mtime - stats.mtime === 0) {return exportMap;} // future: check content equality?
  } // check valid extensions first
  if (!(0, _ignore.hasValidExtension)(path, context)) {exportCache.set(cacheKey, null);return null;} // check for and cache ignore
  if ((0, _ignore2['default'])(path, context)) {log('ignored path due to ignore settings:', path);exportCache.set(cacheKey, null);return null;}var content = _fs2['default'].readFileSync(path, { encoding: 'utf8' }); // check for and cache unambiguous modules
  if (!unambiguous.test(content)) {log('ignored path due to unambiguous regex:', path);exportCache.set(cacheKey, null);return null;}log('cache miss', cacheKey, 'for path', path);exportMap = ExportMap.parse(path, content, context); // ambiguous modules return null
  if (exportMap == null) return null;exportMap.mtime = stats.mtime;exportCache.set(cacheKey, exportMap);return exportMap;};ExportMap.parse = function (path, content, context) {var m = new ExportMap(path);var isEsModuleInteropTrue = isEsModuleInterop();var ast = void 0;try {ast = (0, _parse2['default'])(path, content, context);} catch (err) {log('parse error:', path, err);m.errors.push(err);return m; // can't continue
  }if (!unambiguous.isModule(ast)) return null;var docstyle = context.settings && context.settings['import/docstyle'] || ['jsdoc'];var docStyleParsers = {};docstyle.forEach(function (style) {docStyleParsers[style] = availableDocStyleParsers[style];}); // attempt to collect module doc
  if (ast.comments) {ast.comments.some(function (c) {if (c.type !== 'Block') return false;try {var doc = _doctrine2['default'].parse(c.value, { unwrap: true });if (doc.tags.some(function (t) {return t.title === 'module';})) {m.doc = doc;return true;}} catch (err) {/* ignore */}return false;});}var namespaces = new Map();function remotePath(value) {return _resolve2['default'].relative(value, path, context.settings);}function resolveImport(value) {var rp = remotePath(value);if (rp == null) return null;return ExportMap['for'](childContext(rp, context));}function getNamespace(identifier) {if (!namespaces.has(identifier.name)) return;return function () {return resolveImport(namespaces.get(identifier.name));};}function addNamespace(object, identifier) {var nsfn = getNamespace(identifier);if (nsfn) {Object.defineProperty(object, 'namespace', { get: nsfn });}return object;}function processSpecifier(s, n, m) {var nsource = n.source && n.source.value;var exportMeta = {};var local = void 0;switch (s.type) {case 'ExportDefaultSpecifier':if (!nsource) return;local = 'default';break;case 'ExportNamespaceSpecifier':m.namespace.set(s.exported.name, Object.defineProperty(exportMeta, 'namespace', { get: function () {function get() {return resolveImport(nsource);}return get;}() }));return;case 'ExportAllDeclaration':m.namespace.set(s.exported.name, addNamespace(exportMeta, s.source.value));return;case 'ExportSpecifier':if (!n.source) {m.namespace.set(s.exported.name, addNamespace(exportMeta, s.local));return;} // else falls through
      default:local = s.local.name;break;} // todo: JSDoc
    m.reexports.set(s.exported.name, { local: local, getImport: function () {function getImport() {return resolveImport(nsource);}return getImport;}() });}function captureDependency(_ref, isOnlyImportingTypes) {var source = _ref.source;var importedSpecifiers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Set();if (source == null) return null;var p = remotePath(source.value);if (p == null) return null;var declarationMetadata = { // capturing actual node reference holds full AST in memory!
      source: { value: source.value, loc: source.loc }, isOnlyImportingTypes: isOnlyImportingTypes, importedSpecifiers: importedSpecifiers };var existing = m.imports.get(p);if (existing != null) {existing.declarations.add(declarationMetadata);return existing.getter;}var getter = thunkFor(p, context);m.imports.set(p, { getter: getter, declarations: new Set([declarationMetadata]) });return getter;}var source = makeSourceCode(content, ast);function readTsConfig() {var tsConfigInfo = (0, _tsconfigLoader.tsConfigLoader)({ cwd: context.parserOptions && context.parserOptions.tsconfigRootDir || process.cwd(), getEnv: function () {function getEnv(key) {return process.env[key];}return getEnv;}() });try {if (tsConfigInfo.tsConfigPath !== undefined) {var jsonText = _fs2['default'].readFileSync(tsConfigInfo.tsConfigPath).toString();if (!parseConfigFileTextToJson) {var _require = require('typescript'); // this is because projects not using TypeScript won't have typescript installed
          parseConfigFileTextToJson = _require.parseConfigFileTextToJson;}return parseConfigFileTextToJson(tsConfigInfo.tsConfigPath, jsonText).config;}} catch (e) {// Catch any errors
    }return null;}function isEsModuleInterop() {var cacheKey = (0, _hash.hashObject)({ tsconfigRootDir: context.parserOptions && context.parserOptions.tsconfigRootDir }).digest('hex');var tsConfig = tsConfigCache.get(cacheKey);if (typeof tsConfig === 'undefined') {tsConfig = readTsConfig();tsConfigCache.set(cacheKey, tsConfig);}return tsConfig && tsConfig.compilerOptions ? tsConfig.compilerOptions.esModuleInterop : false;}ast.body.forEach(function (n) {if (n.type === 'ExportDefaultDeclaration') {var exportMeta = captureDoc(source, docStyleParsers, n);if (n.declaration.type === 'Identifier') {addNamespace(exportMeta, n.declaration);}m.namespace.set('default', exportMeta);return;}if (n.type === 'ExportAllDeclaration') {var getter = captureDependency(n, n.exportKind === 'type');if (getter) m.dependencies.add(getter);if (n.exported) {processSpecifier(n, n.exported, m);}return;} // capture namespaces in case of later export
    if (n.type === 'ImportDeclaration') {// import type { Foo } (TS and Flow)
      var declarationIsType = n.importKind === 'type'; // import './foo' or import {} from './foo' (both 0 specifiers) is a side effect and
      // shouldn't be considered to be just importing types
      var specifiersOnlyImportingTypes = n.specifiers.length;var importedSpecifiers = new Set();n.specifiers.forEach(function (specifier) {if (supportedImportTypes.has(specifier.type)) {importedSpecifiers.add(specifier.type);}if (specifier.type === 'ImportSpecifier') {importedSpecifiers.add(specifier.imported.name);} // import { type Foo } (Flow)
        specifiersOnlyImportingTypes = specifiersOnlyImportingTypes && specifier.importKind === 'type';});captureDependency(n, declarationIsType || specifiersOnlyImportingTypes, importedSpecifiers);var ns = n.specifiers.find(function (s) {return s.type === 'ImportNamespaceSpecifier';});if (ns) {namespaces.set(ns.local.name, n.source.value);}return;}if (n.type === 'ExportNamedDeclaration') {// capture declaration
      if (n.declaration != null) {switch (n.declaration.type) {case 'FunctionDeclaration':case 'ClassDeclaration':case 'TypeAlias': // flowtype with babel-eslint parser
          case 'InterfaceDeclaration':case 'DeclareFunction':case 'TSDeclareFunction':case 'TSEnumDeclaration':case 'TSTypeAliasDeclaration':case 'TSInterfaceDeclaration':case 'TSAbstractClassDeclaration':case 'TSModuleDeclaration':m.namespace.set(n.declaration.id.name, captureDoc(source, docStyleParsers, n));break;case 'VariableDeclaration':n.declaration.declarations.forEach(function (d) {return recursivePatternCapture(d.id, function (id) {return m.namespace.set(id.name, captureDoc(source, docStyleParsers, d, n));});});break;}}n.specifiers.forEach(function (s) {return processSpecifier(s, n, m);});}var exports = ['TSExportAssignment'];if (isEsModuleInteropTrue) {exports.push('TSNamespaceExportDeclaration');} // This doesn't declare anything, but changes what's being exported.
    if ((0, _arrayIncludes2['default'])(exports, n.type)) {var exportedName = n.type === 'TSNamespaceExportDeclaration' ? n.id.name : n.expression && n.expression.name || n.expression.id && n.expression.id.name || null;var declTypes = ['VariableDeclaration', 'ClassDeclaration', 'TSDeclareFunction', 'TSEnumDeclaration', 'TSTypeAliasDeclaration', 'TSInterfaceDeclaration', 'TSAbstractClassDeclaration', 'TSModuleDeclaration'];var exportedDecls = ast.body.filter(function (_ref2) {var type = _ref2.type,id = _ref2.id,declarations = _ref2.declarations;return (0, _arrayIncludes2['default'])(declTypes, type) && (id && id.name === exportedName || declarations && declarations.find(function (d) {return d.id.name === exportedName;}));});if (exportedDecls.length === 0) {// Export is not referencing any local declaration, must be re-exporting
        m.namespace.set('default', captureDoc(source, docStyleParsers, n));return;}if (isEsModuleInteropTrue // esModuleInterop is on in tsconfig
      && !m.namespace.has('default') // and default isn't added already
      ) {m.namespace.set('default', {}); // add default export
        }exportedDecls.forEach(function (decl) {if (decl.type === 'TSModuleDeclaration') {if (decl.body && decl.body.type === 'TSModuleDeclaration') {m.namespace.set(decl.body.id.name, captureDoc(source, docStyleParsers, decl.body));} else if (decl.body && decl.body.body) {decl.body.body.forEach(function (moduleBlockNode) {// Export-assignment exports all members in the namespace,
              // explicitly exported or not.
              var namespaceDecl = moduleBlockNode.type === 'ExportNamedDeclaration' ? moduleBlockNode.declaration : moduleBlockNode;if (!namespaceDecl) {// TypeScript can check this for us; we needn't
              } else if (namespaceDecl.type === 'VariableDeclaration') {namespaceDecl.declarations.forEach(function (d) {return recursivePatternCapture(d.id, function (id) {return m.namespace.set(id.name, captureDoc(source, docStyleParsers, decl, namespaceDecl, moduleBlockNode));});});} else {m.namespace.set(namespaceDecl.id.name, captureDoc(source, docStyleParsers, moduleBlockNode));}});}} else {// Export as default
          m.namespace.set('default', captureDoc(source, docStyleParsers, decl));}});}});if (isEsModuleInteropTrue // esModuleInterop is on in tsconfig
  && m.namespace.size > 0 // anything is exported
  && !m.namespace.has('default') // and default isn't added already
  ) {m.namespace.set('default', {}); // add default export
    }return m;}; /**
                  * The creation of this closure is isolated from other scopes
                  * to avoid over-retention of unrelated variables, which has
                  * caused memory leaks. See #1266.
                  */function thunkFor(p, context) {return function () {return ExportMap['for'](childContext(p, context));};} /**
                                                                                                                              * Traverse a pattern/identifier node, calling 'callback'
                                                                                                                              * for each leaf identifier.
                                                                                                                              * @param  {node}   pattern
                                                                                                                              * @param  {Function} callback
                                                                                                                              * @return {void}
                                                                                                                              */function recursivePatternCapture(pattern, callback) {switch (pattern.type) {case 'Identifier': // base case
      callback(pattern);break;case 'ObjectPattern':pattern.properties.forEach(function (p) {if (p.type === 'ExperimentalRestProperty' || p.type === 'RestElement') {callback(p.argument);return;}recursivePatternCapture(p.value, callback);});break;case 'ArrayPattern':pattern.elements.forEach(function (element) {if (element == null) return;if (element.type === 'ExperimentalRestProperty' || element.type === 'RestElement') {callback(element.argument);return;}recursivePatternCapture(element, callback);});break;case 'AssignmentPattern':callback(pattern.left);break;}} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * don't hold full context object in memory, just grab what we need.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */function childContext(path, context) {var settings = context.settings,parserOptions = context.parserOptions,parserPath = context.parserPath;return { settings: settings, parserOptions: parserOptions, parserPath: parserPath, path: path };} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * sometimes legacy support isn't _that_ hard... right?
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */function makeSourceCode(text, ast) {if (_eslint.SourceCode.length > 1) {// ESLint 3
    return new _eslint.SourceCode(text, ast);} else {// ESLint 4, 5
    return new _eslint.SourceCode({ text: text, ast: ast });}}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FeHBvcnRNYXAuanMiXSwibmFtZXMiOlsicmVjdXJzaXZlUGF0dGVybkNhcHR1cmUiLCJ1bmFtYmlndW91cyIsInBhcnNlQ29uZmlnRmlsZVRleHRUb0pzb24iLCJsb2ciLCJleHBvcnRDYWNoZSIsIk1hcCIsInRzQ29uZmlnQ2FjaGUiLCJFeHBvcnRNYXAiLCJwYXRoIiwibmFtZXNwYWNlIiwicmVleHBvcnRzIiwiZGVwZW5kZW5jaWVzIiwiU2V0IiwiaW1wb3J0cyIsImVycm9ycyIsIm5hbWUiLCJoYXMiLCJkZXAiLCJpbm5lck1hcCIsImZvdW5kIiwiZ2V0IiwiaW1wb3J0ZWQiLCJnZXRJbXBvcnQiLCJsb2NhbCIsImRlZXAiLCJoYXNEZWVwIiwidW5zaGlmdCIsImlubmVyVmFsdWUiLCJ1bmRlZmluZWQiLCJjYWxsYmFjayIsInRoaXNBcmciLCJmb3JFYWNoIiwidiIsIm4iLCJjYWxsIiwicmVleHBvcnRlZCIsImQiLCJjb250ZXh0IiwiZGVjbGFyYXRpb24iLCJyZXBvcnQiLCJub2RlIiwic291cmNlIiwibWVzc2FnZSIsInZhbHVlIiwibWFwIiwiZSIsImxpbmVOdW1iZXIiLCJjb2x1bW4iLCJqb2luIiwic2l6ZSIsImNhcHR1cmVEb2MiLCJkb2NTdHlsZVBhcnNlcnMiLCJtZXRhZGF0YSIsIm5vZGVzIiwic29tZSIsImxlYWRpbmdDb21tZW50cyIsInJhbmdlIiwiZ2V0Q29tbWVudHNCZWZvcmUiLCJsZW5ndGgiLCJkb2MiLCJlcnIiLCJhdmFpbGFibGVEb2NTdHlsZVBhcnNlcnMiLCJqc2RvYyIsImNhcHR1cmVKc0RvYyIsInRvbWRvYyIsImNhcHR1cmVUb21Eb2MiLCJjb21tZW50cyIsImNvbW1lbnQiLCJ0eXBlIiwiZG9jdHJpbmUiLCJwYXJzZSIsInVud3JhcCIsImxpbmVzIiwiaSIsIm1hdGNoIiwicHVzaCIsInRyaW0iLCJzdGF0dXNNYXRjaCIsImRlc2NyaXB0aW9uIiwidGFncyIsInRpdGxlIiwidG9Mb3dlckNhc2UiLCJzdXBwb3J0ZWRJbXBvcnRUeXBlcyIsImNoaWxkQ29udGV4dCIsImNhY2hlS2V5IiwiZGlnZXN0IiwiZXhwb3J0TWFwIiwic3RhdHMiLCJmcyIsInN0YXRTeW5jIiwibXRpbWUiLCJzZXQiLCJjb250ZW50IiwicmVhZEZpbGVTeW5jIiwiZW5jb2RpbmciLCJ0ZXN0IiwibSIsImlzRXNNb2R1bGVJbnRlcm9wVHJ1ZSIsImlzRXNNb2R1bGVJbnRlcm9wIiwiYXN0IiwiaXNNb2R1bGUiLCJkb2NzdHlsZSIsInNldHRpbmdzIiwic3R5bGUiLCJjIiwidCIsIm5hbWVzcGFjZXMiLCJyZW1vdGVQYXRoIiwicmVzb2x2ZSIsInJlbGF0aXZlIiwicmVzb2x2ZUltcG9ydCIsInJwIiwiZ2V0TmFtZXNwYWNlIiwiaWRlbnRpZmllciIsImFkZE5hbWVzcGFjZSIsIm9iamVjdCIsIm5zZm4iLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInByb2Nlc3NTcGVjaWZpZXIiLCJzIiwibnNvdXJjZSIsImV4cG9ydE1ldGEiLCJleHBvcnRlZCIsImNhcHR1cmVEZXBlbmRlbmN5IiwiaXNPbmx5SW1wb3J0aW5nVHlwZXMiLCJpbXBvcnRlZFNwZWNpZmllcnMiLCJwIiwiZGVjbGFyYXRpb25NZXRhZGF0YSIsImxvYyIsImV4aXN0aW5nIiwiZGVjbGFyYXRpb25zIiwiYWRkIiwiZ2V0dGVyIiwidGh1bmtGb3IiLCJtYWtlU291cmNlQ29kZSIsInJlYWRUc0NvbmZpZyIsInRzQ29uZmlnSW5mbyIsImN3ZCIsInBhcnNlck9wdGlvbnMiLCJ0c2NvbmZpZ1Jvb3REaXIiLCJwcm9jZXNzIiwiZ2V0RW52Iiwia2V5IiwiZW52IiwidHNDb25maWdQYXRoIiwianNvblRleHQiLCJ0b1N0cmluZyIsInJlcXVpcmUiLCJjb25maWciLCJ0c0NvbmZpZyIsImNvbXBpbGVyT3B0aW9ucyIsImVzTW9kdWxlSW50ZXJvcCIsImJvZHkiLCJleHBvcnRLaW5kIiwiZGVjbGFyYXRpb25Jc1R5cGUiLCJpbXBvcnRLaW5kIiwic3BlY2lmaWVyc09ubHlJbXBvcnRpbmdUeXBlcyIsInNwZWNpZmllcnMiLCJzcGVjaWZpZXIiLCJucyIsImZpbmQiLCJpZCIsImV4cG9ydHMiLCJleHBvcnRlZE5hbWUiLCJleHByZXNzaW9uIiwiZGVjbFR5cGVzIiwiZXhwb3J0ZWREZWNscyIsImZpbHRlciIsImRlY2wiLCJtb2R1bGVCbG9ja05vZGUiLCJuYW1lc3BhY2VEZWNsIiwicGF0dGVybiIsInByb3BlcnRpZXMiLCJhcmd1bWVudCIsImVsZW1lbnRzIiwiZWxlbWVudCIsImxlZnQiLCJwYXJzZXJQYXRoIiwidGV4dCIsIlNvdXJjZUNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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NUcsSUFBUixLQUFpQiwwQkFBakIsSUFBK0M0RyxRQUFRNUcsSUFBUixLQUFpQixhQUFwRSxFQUFtRixDQUNqRnZDLFNBQVNtSixRQUFRRixRQUFqQixFQUNBLE9BQ0QsQ0FDRDlLLHdCQUF3QmdMLE9BQXhCLEVBQWlDbkosUUFBakMsRUFDRCxDQVBELEVBUUEsTUFFRixLQUFLLG1CQUFMLENBQ0VBLFNBQVMrSSxRQUFRSyxJQUFqQixFQUNBLE1BNUJGLENBOEJELEMsQ0FFRDs7eWpCQUdBLFNBQVM5RixZQUFULENBQXNCM0UsSUFBdEIsRUFBNEI2QixPQUE1QixFQUFxQyxLQUMzQmlFLFFBRDJCLEdBQ2FqRSxPQURiLENBQzNCaUUsUUFEMkIsQ0FDakJxQyxhQURpQixHQUNhdEcsT0FEYixDQUNqQnNHLGFBRGlCLENBQ0Z1QyxVQURFLEdBQ2E3SSxPQURiLENBQ0Y2SSxVQURFLENBRW5DLE9BQU8sRUFDTDVFLGtCQURLLEVBRUxxQyw0QkFGSyxFQUdMdUMsc0JBSEssRUFJTDFLLFVBSkssRUFBUCxDQU1ELEMsQ0FHRDs7MHlCQUdBLFNBQVMrSCxjQUFULENBQXdCNEMsSUFBeEIsRUFBOEJoRixHQUE5QixFQUFtQyxDQUNqQyxJQUFJaUYsbUJBQVcxSCxNQUFYLEdBQW9CLENBQXhCLEVBQTJCLENBQ3pCO0FBQ0EsV0FBTyxJQUFJMEgsa0JBQUosQ0FBZUQsSUFBZixFQUFxQmhGLEdBQXJCLENBQVAsQ0FDRCxDQUhELE1BR08sQ0FDTDtBQUNBLFdBQU8sSUFBSWlGLGtCQUFKLENBQWUsRUFBRUQsVUFBRixFQUFRaEYsUUFBUixFQUFmLENBQVAsQ0FDRCxDQUNGIiwiZmlsZSI6IkV4cG9ydE1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5cbmltcG9ydCBkb2N0cmluZSBmcm9tICdkb2N0cmluZSc7XG5cbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5cbmltcG9ydCB7IFNvdXJjZUNvZGUgfSBmcm9tICdlc2xpbnQnO1xuXG5pbXBvcnQgcGFyc2UgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9wYXJzZSc7XG5pbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnO1xuaW1wb3J0IGlzSWdub3JlZCwgeyBoYXNWYWxpZEV4dGVuc2lvbiB9IGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvaWdub3JlJztcblxuaW1wb3J0IHsgaGFzaE9iamVjdCB9IGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvaGFzaCc7XG5pbXBvcnQgKiBhcyB1bmFtYmlndW91cyBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3VuYW1iaWd1b3VzJztcblxuaW1wb3J0IHsgdHNDb25maWdMb2FkZXIgfSBmcm9tICd0c2NvbmZpZy1wYXRocy9saWIvdHNjb25maWctbG9hZGVyJztcblxuaW1wb3J0IGluY2x1ZGVzIGZyb20gJ2FycmF5LWluY2x1ZGVzJztcblxubGV0IHBhcnNlQ29uZmlnRmlsZVRleHRUb0pzb247XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdlc2xpbnQtcGx1Z2luLWltcG9ydDpFeHBvcnRNYXAnKTtcblxuY29uc3QgZXhwb3J0Q2FjaGUgPSBuZXcgTWFwKCk7XG5jb25zdCB0c0NvbmZpZ0NhY2hlID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBvcnRNYXAge1xuICBjb25zdHJ1Y3RvcihwYXRoKSB7XG4gICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG5ldyBNYXAoKTtcbiAgICAvLyB0b2RvOiByZXN0cnVjdHVyZSB0byBrZXkgb24gcGF0aCwgdmFsdWUgaXMgcmVzb2x2ZXIgKyBtYXAgb2YgbmFtZXNcbiAgICB0aGlzLnJlZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAvKipcbiAgICAgKiBzdGFyLWV4cG9ydHNcbiAgICAgKiBAdHlwZSB7U2V0fSBvZiAoKSA9PiBFeHBvcnRNYXBcbiAgICAgKi9cbiAgICB0aGlzLmRlcGVuZGVuY2llcyA9IG5ldyBTZXQoKTtcbiAgICAvKipcbiAgICAgKiBkZXBlbmRlbmNpZXMgb2YgdGhpcyBtb2R1bGUgdGhhdCBhcmUgbm90IGV4cGxpY2l0bHkgcmUtZXhwb3J0ZWRcbiAgICAgKiBAdHlwZSB7TWFwfSBmcm9tIHBhdGggPSAoKSA9PiBFeHBvcnRNYXBcbiAgICAgKi9cbiAgICB0aGlzLmltcG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgfVxuXG4gIGdldCBoYXNEZWZhdWx0KCkgeyByZXR1cm4gdGhpcy5nZXQoJ2RlZmF1bHQnKSAhPSBudWxsOyB9IC8vIHN0cm9uZ2VyIHRoYW4gdGhpcy5oYXNcblxuICBnZXQgc2l6ZSgpIHtcbiAgICBsZXQgc2l6ZSA9IHRoaXMubmFtZXNwYWNlLnNpemUgKyB0aGlzLnJlZXhwb3J0cy5zaXplO1xuICAgIHRoaXMuZGVwZW5kZW5jaWVzLmZvckVhY2goZGVwID0+IHtcbiAgICAgIGNvbnN0IGQgPSBkZXAoKTtcbiAgICAgIC8vIENKUyAvIGlnbm9yZWQgZGVwZW5kZW5jaWVzIHdvbid0IGV4aXN0ICgjNzE3KVxuICAgICAgaWYgKGQgPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgc2l6ZSArPSBkLnNpemU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNpemU7XG4gIH1cblxuICAvKipcbiAgICogTm90ZSB0aGF0IHRoaXMgZG9lcyBub3QgY2hlY2sgZXhwbGljaXRseSByZS1leHBvcnRlZCBuYW1lcyBmb3IgZXhpc3RlbmNlXG4gICAqIGluIHRoZSBiYXNlIG5hbWVzcGFjZSwgYnV0IGl0IHdpbGwgZXhwYW5kIGFsbCBgZXhwb3J0ICogZnJvbSAnLi4uJ2AgZXhwb3J0c1xuICAgKiBpZiBub3QgZm91bmQgaW4gdGhlIGV4cGxpY2l0IG5hbWVzcGFjZS5cbiAgICogQHBhcmFtICB7c3RyaW5nfSAgbmFtZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGBuYW1lYCBpcyBleHBvcnRlZCBieSB0aGlzIG1vZHVsZS5cbiAgICovXG4gIGhhcyhuYW1lKSB7XG4gICAgaWYgKHRoaXMubmFtZXNwYWNlLmhhcyhuYW1lKSkgcmV0dXJuIHRydWU7XG4gICAgaWYgKHRoaXMucmVleHBvcnRzLmhhcyhuYW1lKSkgcmV0dXJuIHRydWU7XG5cbiAgICAvLyBkZWZhdWx0IGV4cG9ydHMgbXVzdCBiZSBleHBsaWNpdGx5IHJlLWV4cG9ydGVkICgjMzI4KVxuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIGZvciAoY29uc3QgZGVwIG9mIHRoaXMuZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGNvbnN0IGlubmVyTWFwID0gZGVwKCk7XG5cbiAgICAgICAgLy8gdG9kbzogcmVwb3J0IGFzIHVucmVzb2x2ZWQ/XG4gICAgICAgIGlmICghaW5uZXJNYXApIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChpbm5lck1hcC5oYXMobmFtZSkpIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBlbnN1cmUgdGhhdCBpbXBvcnRlZCBuYW1lIGZ1bGx5IHJlc29sdmVzLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWVcbiAgICogQHJldHVybiB7eyBmb3VuZDogYm9vbGVhbiwgcGF0aDogRXhwb3J0TWFwW10gfX1cbiAgICovXG4gIGhhc0RlZXAobmFtZSkge1xuICAgIGlmICh0aGlzLm5hbWVzcGFjZS5oYXMobmFtZSkpIHJldHVybiB7IGZvdW5kOiB0cnVlLCBwYXRoOiBbdGhpc10gfTtcblxuICAgIGlmICh0aGlzLnJlZXhwb3J0cy5oYXMobmFtZSkpIHtcbiAgICAgIGNvbnN0IHJlZXhwb3J0cyA9IHRoaXMucmVleHBvcnRzLmdldChuYW1lKTtcbiAgICAgIGNvbnN0IGltcG9ydGVkID0gcmVleHBvcnRzLmdldEltcG9ydCgpO1xuXG4gICAgICAvLyBpZiBpbXBvcnQgaXMgaWdub3JlZCwgcmV0dXJuIGV4cGxpY2l0ICdudWxsJ1xuICAgICAgaWYgKGltcG9ydGVkID09IG51bGwpIHJldHVybiB7IGZvdW5kOiB0cnVlLCBwYXRoOiBbdGhpc10gfTtcblxuICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzLCBvbmx5IGlmIG5hbWUgbWF0Y2hlc1xuICAgICAgaWYgKGltcG9ydGVkLnBhdGggPT09IHRoaXMucGF0aCAmJiByZWV4cG9ydHMubG9jYWwgPT09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHsgZm91bmQ6IGZhbHNlLCBwYXRoOiBbdGhpc10gfTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVlcCA9IGltcG9ydGVkLmhhc0RlZXAocmVleHBvcnRzLmxvY2FsKTtcbiAgICAgIGRlZXAucGF0aC51bnNoaWZ0KHRoaXMpO1xuXG4gICAgICByZXR1cm4gZGVlcDtcbiAgICB9XG5cblxuICAgIC8vIGRlZmF1bHQgZXhwb3J0cyBtdXN0IGJlIGV4cGxpY2l0bHkgcmUtZXhwb3J0ZWQgKCMzMjgpXG4gICAgaWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuICAgICAgZm9yIChjb25zdCBkZXAgb2YgdGhpcy5kZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgY29uc3QgaW5uZXJNYXAgPSBkZXAoKTtcbiAgICAgICAgaWYgKGlubmVyTWFwID09IG51bGwpIHJldHVybiB7IGZvdW5kOiB0cnVlLCBwYXRoOiBbdGhpc10gfTtcbiAgICAgICAgLy8gdG9kbzogcmVwb3J0IGFzIHVucmVzb2x2ZWQ/XG4gICAgICAgIGlmICghaW5uZXJNYXApIGNvbnRpbnVlO1xuXG4gICAgICAgIC8vIHNhZmVndWFyZCBhZ2FpbnN0IGN5Y2xlc1xuICAgICAgICBpZiAoaW5uZXJNYXAucGF0aCA9PT0gdGhpcy5wYXRoKSBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBpbm5lclZhbHVlID0gaW5uZXJNYXAuaGFzRGVlcChuYW1lKTtcbiAgICAgICAgaWYgKGlubmVyVmFsdWUuZm91bmQpIHtcbiAgICAgICAgICBpbm5lclZhbHVlLnBhdGgudW5zaGlmdCh0aGlzKTtcbiAgICAgICAgICByZXR1cm4gaW5uZXJWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IGZvdW5kOiBmYWxzZSwgcGF0aDogW3RoaXNdIH07XG4gIH1cblxuICBnZXQobmFtZSkge1xuICAgIGlmICh0aGlzLm5hbWVzcGFjZS5oYXMobmFtZSkpIHJldHVybiB0aGlzLm5hbWVzcGFjZS5nZXQobmFtZSk7XG5cbiAgICBpZiAodGhpcy5yZWV4cG9ydHMuaGFzKG5hbWUpKSB7XG4gICAgICBjb25zdCByZWV4cG9ydHMgPSB0aGlzLnJlZXhwb3J0cy5nZXQobmFtZSk7XG4gICAgICBjb25zdCBpbXBvcnRlZCA9IHJlZXhwb3J0cy5nZXRJbXBvcnQoKTtcblxuICAgICAgLy8gaWYgaW1wb3J0IGlzIGlnbm9yZWQsIHJldHVybiBleHBsaWNpdCAnbnVsbCdcbiAgICAgIGlmIChpbXBvcnRlZCA9PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzLCBvbmx5IGlmIG5hbWUgbWF0Y2hlc1xuICAgICAgaWYgKGltcG9ydGVkLnBhdGggPT09IHRoaXMucGF0aCAmJiByZWV4cG9ydHMubG9jYWwgPT09IG5hbWUpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAgIHJldHVybiBpbXBvcnRlZC5nZXQocmVleHBvcnRzLmxvY2FsKTtcbiAgICB9XG5cbiAgICAvLyBkZWZhdWx0IGV4cG9ydHMgbXVzdCBiZSBleHBsaWNpdGx5IHJlLWV4cG9ydGVkICgjMzI4KVxuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIGZvciAoY29uc3QgZGVwIG9mIHRoaXMuZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGNvbnN0IGlubmVyTWFwID0gZGVwKCk7XG4gICAgICAgIC8vIHRvZG86IHJlcG9ydCBhcyB1bnJlc29sdmVkP1xuICAgICAgICBpZiAoIWlubmVyTWFwKSBjb250aW51ZTtcblxuICAgICAgICAvLyBzYWZlZ3VhcmQgYWdhaW5zdCBjeWNsZXNcbiAgICAgICAgaWYgKGlubmVyTWFwLnBhdGggPT09IHRoaXMucGF0aCkgY29udGludWU7XG5cbiAgICAgICAgY29uc3QgaW5uZXJWYWx1ZSA9IGlubmVyTWFwLmdldChuYW1lKTtcbiAgICAgICAgaWYgKGlubmVyVmFsdWUgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGlubmVyVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB0aGlzLm5hbWVzcGFjZS5mb3JFYWNoKCh2LCBuKSA9PlxuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2LCBuLCB0aGlzKSk7XG5cbiAgICB0aGlzLnJlZXhwb3J0cy5mb3JFYWNoKChyZWV4cG9ydHMsIG5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHJlZXhwb3J0ZWQgPSByZWV4cG9ydHMuZ2V0SW1wb3J0KCk7XG4gICAgICAvLyBjYW4ndCBsb29rIHVwIG1ldGEgZm9yIGlnbm9yZWQgcmUtZXhwb3J0cyAoIzM0OClcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgcmVleHBvcnRlZCAmJiByZWV4cG9ydGVkLmdldChyZWV4cG9ydHMubG9jYWwpLCBuYW1lLCB0aGlzKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGVwZW5kZW5jaWVzLmZvckVhY2goZGVwID0+IHtcbiAgICAgIGNvbnN0IGQgPSBkZXAoKTtcbiAgICAgIC8vIENKUyAvIGlnbm9yZWQgZGVwZW5kZW5jaWVzIHdvbid0IGV4aXN0ICgjNzE3KVxuICAgICAgaWYgKGQgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICBkLmZvckVhY2goKHYsIG4pID0+XG4gICAgICAgIG4gIT09ICdkZWZhdWx0JyAmJiBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHYsIG4sIHRoaXMpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHRvZG86IGtleXMsIHZhbHVlcywgZW50cmllcz9cblxuICByZXBvcnRFcnJvcnMoY29udGV4dCwgZGVjbGFyYXRpb24pIHtcbiAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICBub2RlOiBkZWNsYXJhdGlvbi5zb3VyY2UsXG4gICAgICBtZXNzYWdlOiBgUGFyc2UgZXJyb3JzIGluIGltcG9ydGVkIG1vZHVsZSAnJHtkZWNsYXJhdGlvbi5zb3VyY2UudmFsdWV9JzogYCArXG4gICAgICAgICAgICAgICAgICBgJHt0aGlzLmVycm9yc1xuICAgICAgICAgICAgICAgICAgICAubWFwKGUgPT4gYCR7ZS5tZXNzYWdlfSAoJHtlLmxpbmVOdW1iZXJ9OiR7ZS5jb2x1bW59KWApXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKCcsICcpfWAsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBwYXJzZSBkb2NzIGZyb20gdGhlIGZpcnN0IG5vZGUgdGhhdCBoYXMgbGVhZGluZyBjb21tZW50c1xuICovXG5mdW5jdGlvbiBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCAuLi5ub2Rlcykge1xuICBjb25zdCBtZXRhZGF0YSA9IHt9O1xuXG4gIC8vICdzb21lJyBzaG9ydC1jaXJjdWl0cyBvbiBmaXJzdCAndHJ1ZSdcbiAgbm9kZXMuc29tZShuID0+IHtcbiAgICB0cnkge1xuXG4gICAgICBsZXQgbGVhZGluZ0NvbW1lbnRzO1xuXG4gICAgICAvLyBuLmxlYWRpbmdDb21tZW50cyBpcyBsZWdhY3kgYGF0dGFjaENvbW1lbnRzYCBiZWhhdmlvclxuICAgICAgaWYgKCdsZWFkaW5nQ29tbWVudHMnIGluIG4pIHtcbiAgICAgICAgbGVhZGluZ0NvbW1lbnRzID0gbi5sZWFkaW5nQ29tbWVudHM7XG4gICAgICB9IGVsc2UgaWYgKG4ucmFuZ2UpIHtcbiAgICAgICAgbGVhZGluZ0NvbW1lbnRzID0gc291cmNlLmdldENvbW1lbnRzQmVmb3JlKG4pO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWxlYWRpbmdDb21tZW50cyB8fCBsZWFkaW5nQ29tbWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIGZvciAoY29uc3QgbmFtZSBpbiBkb2NTdHlsZVBhcnNlcnMpIHtcbiAgICAgICAgY29uc3QgZG9jID0gZG9jU3R5bGVQYXJzZXJzW25hbWVdKGxlYWRpbmdDb21tZW50cyk7XG4gICAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgICBtZXRhZGF0YS5kb2MgPSBkb2M7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbWV0YWRhdGE7XG59XG5cbmNvbnN0IGF2YWlsYWJsZURvY1N0eWxlUGFyc2VycyA9IHtcbiAganNkb2M6IGNhcHR1cmVKc0RvYyxcbiAgdG9tZG9jOiBjYXB0dXJlVG9tRG9jLFxufTtcblxuLyoqXG4gKiBwYXJzZSBKU0RvYyBmcm9tIGxlYWRpbmcgY29tbWVudHNcbiAqIEBwYXJhbSB7b2JqZWN0W119IGNvbW1lbnRzXG4gKiBAcmV0dXJuIHt7IGRvYzogb2JqZWN0IH19XG4gKi9cbmZ1bmN0aW9uIGNhcHR1cmVKc0RvYyhjb21tZW50cykge1xuICBsZXQgZG9jO1xuXG4gIC8vIGNhcHR1cmUgWFNEb2NcbiAgY29tbWVudHMuZm9yRWFjaChjb21tZW50ID0+IHtcbiAgICAvLyBza2lwIG5vbi1ibG9jayBjb21tZW50c1xuICAgIGlmIChjb21tZW50LnR5cGUgIT09ICdCbG9jaycpIHJldHVybjtcbiAgICB0cnkge1xuICAgICAgZG9jID0gZG9jdHJpbmUucGFyc2UoY29tbWVudC52YWx1ZSwgeyB1bndyYXA6IHRydWUgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvKiBkb24ndCBjYXJlLCBmb3Igbm93PyBtYXliZSBhZGQgdG8gYGVycm9ycz9gICovXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZG9jO1xufVxuXG4vKipcbiAgKiBwYXJzZSBUb21Eb2Mgc2VjdGlvbiBmcm9tIGNvbW1lbnRzXG4gICovXG5mdW5jdGlvbiBjYXB0dXJlVG9tRG9jKGNvbW1lbnRzKSB7XG4gIC8vIGNvbGxlY3QgbGluZXMgdXAgdG8gZmlyc3QgcGFyYWdyYXBoIGJyZWFrXG4gIGNvbnN0IGxpbmVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29tbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjb21tZW50ID0gY29tbWVudHNbaV07XG4gICAgaWYgKGNvbW1lbnQudmFsdWUubWF0Y2goL15cXHMqJC8pKSBicmVhaztcbiAgICBsaW5lcy5wdXNoKGNvbW1lbnQudmFsdWUudHJpbSgpKTtcbiAgfVxuXG4gIC8vIHJldHVybiBkb2N0cmluZS1saWtlIG9iamVjdFxuICBjb25zdCBzdGF0dXNNYXRjaCA9IGxpbmVzLmpvaW4oJyAnKS5tYXRjaCgvXihQdWJsaWN8SW50ZXJuYWx8RGVwcmVjYXRlZCk6XFxzKiguKykvKTtcbiAgaWYgKHN0YXR1c01hdGNoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBzdGF0dXNNYXRjaFsyXSxcbiAgICAgIHRhZ3M6IFt7XG4gICAgICAgIHRpdGxlOiBzdGF0dXNNYXRjaFsxXS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBkZXNjcmlwdGlvbjogc3RhdHVzTWF0Y2hbMl0sXG4gICAgICB9XSxcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IHN1cHBvcnRlZEltcG9ydFR5cGVzID0gbmV3IFNldChbJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInLCAnSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyJ10pO1xuXG5FeHBvcnRNYXAuZ2V0ID0gZnVuY3Rpb24gKHNvdXJjZSwgY29udGV4dCkge1xuICBjb25zdCBwYXRoID0gcmVzb2x2ZShzb3VyY2UsIGNvbnRleHQpO1xuICBpZiAocGF0aCA9PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gRXhwb3J0TWFwLmZvcihjaGlsZENvbnRleHQocGF0aCwgY29udGV4dCkpO1xufTtcblxuRXhwb3J0TWFwLmZvciA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gIGNvbnN0IHsgcGF0aCB9ID0gY29udGV4dDtcblxuICBjb25zdCBjYWNoZUtleSA9IGhhc2hPYmplY3QoY29udGV4dCkuZGlnZXN0KCdoZXgnKTtcbiAgbGV0IGV4cG9ydE1hcCA9IGV4cG9ydENhY2hlLmdldChjYWNoZUtleSk7XG5cbiAgLy8gcmV0dXJuIGNhY2hlZCBpZ25vcmVcbiAgaWYgKGV4cG9ydE1hcCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgc3RhdHMgPSBmcy5zdGF0U3luYyhwYXRoKTtcbiAgaWYgKGV4cG9ydE1hcCAhPSBudWxsKSB7XG4gICAgLy8gZGF0ZSBlcXVhbGl0eSBjaGVja1xuICAgIGlmIChleHBvcnRNYXAubXRpbWUgLSBzdGF0cy5tdGltZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIGV4cG9ydE1hcDtcbiAgICB9XG4gICAgLy8gZnV0dXJlOiBjaGVjayBjb250ZW50IGVxdWFsaXR5P1xuICB9XG5cbiAgLy8gY2hlY2sgdmFsaWQgZXh0ZW5zaW9ucyBmaXJzdFxuICBpZiAoIWhhc1ZhbGlkRXh0ZW5zaW9uKHBhdGgsIGNvbnRleHQpKSB7XG4gICAgZXhwb3J0Q2FjaGUuc2V0KGNhY2hlS2V5LCBudWxsKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIGNoZWNrIGZvciBhbmQgY2FjaGUgaWdub3JlXG4gIGlmIChpc0lnbm9yZWQocGF0aCwgY29udGV4dCkpIHtcbiAgICBsb2coJ2lnbm9yZWQgcGF0aCBkdWUgdG8gaWdub3JlIHNldHRpbmdzOicsIHBhdGgpO1xuICAgIGV4cG9ydENhY2hlLnNldChjYWNoZUtleSwgbnVsbCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKHBhdGgsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcblxuICAvLyBjaGVjayBmb3IgYW5kIGNhY2hlIHVuYW1iaWd1b3VzIG1vZHVsZXNcbiAgaWYgKCF1bmFtYmlndW91cy50ZXN0KGNvbnRlbnQpKSB7XG4gICAgbG9nKCdpZ25vcmVkIHBhdGggZHVlIHRvIHVuYW1iaWd1b3VzIHJlZ2V4OicsIHBhdGgpO1xuICAgIGV4cG9ydENhY2hlLnNldChjYWNoZUtleSwgbnVsbCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsb2coJ2NhY2hlIG1pc3MnLCBjYWNoZUtleSwgJ2ZvciBwYXRoJywgcGF0aCk7XG4gIGV4cG9ydE1hcCA9IEV4cG9ydE1hcC5wYXJzZShwYXRoLCBjb250ZW50LCBjb250ZXh0KTtcblxuICAvLyBhbWJpZ3VvdXMgbW9kdWxlcyByZXR1cm4gbnVsbFxuICBpZiAoZXhwb3J0TWFwID09IG51bGwpIHJldHVybiBudWxsO1xuXG4gIGV4cG9ydE1hcC5tdGltZSA9IHN0YXRzLm10aW1lO1xuXG4gIGV4cG9ydENhY2hlLnNldChjYWNoZUtleSwgZXhwb3J0TWFwKTtcbiAgcmV0dXJuIGV4cG9ydE1hcDtcbn07XG5cblxuRXhwb3J0TWFwLnBhcnNlID0gZnVuY3Rpb24gKHBhdGgsIGNvbnRlbnQsIGNvbnRleHQpIHtcbiAgY29uc3QgbSA9IG5ldyBFeHBvcnRNYXAocGF0aCk7XG4gIGNvbnN0IGlzRXNNb2R1bGVJbnRlcm9wVHJ1ZSA9IGlzRXNNb2R1bGVJbnRlcm9wKCk7XG5cbiAgbGV0IGFzdDtcbiAgdHJ5IHtcbiAgICBhc3QgPSBwYXJzZShwYXRoLCBjb250ZW50LCBjb250ZXh0KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nKCdwYXJzZSBlcnJvcjonLCBwYXRoLCBlcnIpO1xuICAgIG0uZXJyb3JzLnB1c2goZXJyKTtcbiAgICByZXR1cm4gbTsgLy8gY2FuJ3QgY29udGludWVcbiAgfVxuXG4gIGlmICghdW5hbWJpZ3VvdXMuaXNNb2R1bGUoYXN0KSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZG9jc3R5bGUgPSAoY29udGV4dC5zZXR0aW5ncyAmJiBjb250ZXh0LnNldHRpbmdzWydpbXBvcnQvZG9jc3R5bGUnXSkgfHwgWydqc2RvYyddO1xuICBjb25zdCBkb2NTdHlsZVBhcnNlcnMgPSB7fTtcbiAgZG9jc3R5bGUuZm9yRWFjaChzdHlsZSA9PiB7XG4gICAgZG9jU3R5bGVQYXJzZXJzW3N0eWxlXSA9IGF2YWlsYWJsZURvY1N0eWxlUGFyc2Vyc1tzdHlsZV07XG4gIH0pO1xuXG4gIC8vIGF0dGVtcHQgdG8gY29sbGVjdCBtb2R1bGUgZG9jXG4gIGlmIChhc3QuY29tbWVudHMpIHtcbiAgICBhc3QuY29tbWVudHMuc29tZShjID0+IHtcbiAgICAgIGlmIChjLnR5cGUgIT09ICdCbG9jaycpIHJldHVybiBmYWxzZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRvYyA9IGRvY3RyaW5lLnBhcnNlKGMudmFsdWUsIHsgdW53cmFwOiB0cnVlIH0pO1xuICAgICAgICBpZiAoZG9jLnRhZ3Muc29tZSh0ID0+IHQudGl0bGUgPT09ICdtb2R1bGUnKSkge1xuICAgICAgICAgIG0uZG9jID0gZG9jO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHsgLyogaWdub3JlICovIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IG5hbWVzcGFjZXMgPSBuZXcgTWFwKCk7XG5cbiAgZnVuY3Rpb24gcmVtb3RlUGF0aCh2YWx1ZSkge1xuICAgIHJldHVybiByZXNvbHZlLnJlbGF0aXZlKHZhbHVlLCBwYXRoLCBjb250ZXh0LnNldHRpbmdzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVJbXBvcnQodmFsdWUpIHtcbiAgICBjb25zdCBycCA9IHJlbW90ZVBhdGgodmFsdWUpO1xuICAgIGlmIChycCA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gRXhwb3J0TWFwLmZvcihjaGlsZENvbnRleHQocnAsIGNvbnRleHQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5hbWVzcGFjZShpZGVudGlmaWVyKSB7XG4gICAgaWYgKCFuYW1lc3BhY2VzLmhhcyhpZGVudGlmaWVyLm5hbWUpKSByZXR1cm47XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHJlc29sdmVJbXBvcnQobmFtZXNwYWNlcy5nZXQoaWRlbnRpZmllci5uYW1lKSk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZE5hbWVzcGFjZShvYmplY3QsIGlkZW50aWZpZXIpIHtcbiAgICBjb25zdCBuc2ZuID0gZ2V0TmFtZXNwYWNlKGlkZW50aWZpZXIpO1xuICAgIGlmIChuc2ZuKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnbmFtZXNwYWNlJywgeyBnZXQ6IG5zZm4gfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb2Nlc3NTcGVjaWZpZXIocywgbiwgbSkge1xuICAgIGNvbnN0IG5zb3VyY2UgPSBuLnNvdXJjZSAmJiBuLnNvdXJjZS52YWx1ZTtcbiAgICBjb25zdCBleHBvcnRNZXRhID0ge307XG4gICAgbGV0IGxvY2FsO1xuXG4gICAgc3dpdGNoIChzLnR5cGUpIHtcbiAgICBjYXNlICdFeHBvcnREZWZhdWx0U3BlY2lmaWVyJzpcbiAgICAgIGlmICghbnNvdXJjZSkgcmV0dXJuO1xuICAgICAgbG9jYWwgPSAnZGVmYXVsdCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdFeHBvcnROYW1lc3BhY2VTcGVjaWZpZXInOlxuICAgICAgbS5uYW1lc3BhY2Uuc2V0KHMuZXhwb3J0ZWQubmFtZSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydE1ldGEsICduYW1lc3BhY2UnLCB7XG4gICAgICAgIGdldCgpIHsgcmV0dXJuIHJlc29sdmVJbXBvcnQobnNvdXJjZSk7IH0sXG4gICAgICB9KSk7XG4gICAgICByZXR1cm47XG4gICAgY2FzZSAnRXhwb3J0QWxsRGVjbGFyYXRpb24nOlxuICAgICAgbS5uYW1lc3BhY2Uuc2V0KHMuZXhwb3J0ZWQubmFtZSwgYWRkTmFtZXNwYWNlKGV4cG9ydE1ldGEsIHMuc291cmNlLnZhbHVlKSk7XG4gICAgICByZXR1cm47XG4gICAgY2FzZSAnRXhwb3J0U3BlY2lmaWVyJzpcbiAgICAgIGlmICghbi5zb3VyY2UpIHtcbiAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KHMuZXhwb3J0ZWQubmFtZSwgYWRkTmFtZXNwYWNlKGV4cG9ydE1ldGEsIHMubG9jYWwpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gZWxzZSBmYWxscyB0aHJvdWdoXG4gICAgZGVmYXVsdDpcbiAgICAgIGxvY2FsID0gcy5sb2NhbC5uYW1lO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gdG9kbzogSlNEb2NcbiAgICBtLnJlZXhwb3J0cy5zZXQocy5leHBvcnRlZC5uYW1lLCB7IGxvY2FsLCBnZXRJbXBvcnQ6ICgpID0+IHJlc29sdmVJbXBvcnQobnNvdXJjZSkgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjYXB0dXJlRGVwZW5kZW5jeSh7IHNvdXJjZSB9LCBpc09ubHlJbXBvcnRpbmdUeXBlcywgaW1wb3J0ZWRTcGVjaWZpZXJzID0gbmV3IFNldCgpKSB7XG4gICAgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHAgPSByZW1vdGVQYXRoKHNvdXJjZS52YWx1ZSk7XG4gICAgaWYgKHAgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBkZWNsYXJhdGlvbk1ldGFkYXRhID0ge1xuICAgICAgLy8gY2FwdHVyaW5nIGFjdHVhbCBub2RlIHJlZmVyZW5jZSBob2xkcyBmdWxsIEFTVCBpbiBtZW1vcnkhXG4gICAgICBzb3VyY2U6IHsgdmFsdWU6IHNvdXJjZS52YWx1ZSwgbG9jOiBzb3VyY2UubG9jIH0sXG4gICAgICBpc09ubHlJbXBvcnRpbmdUeXBlcyxcbiAgICAgIGltcG9ydGVkU3BlY2lmaWVycyxcbiAgICB9O1xuXG4gICAgY29uc3QgZXhpc3RpbmcgPSBtLmltcG9ydHMuZ2V0KHApO1xuICAgIGlmIChleGlzdGluZyAhPSBudWxsKSB7XG4gICAgICBleGlzdGluZy5kZWNsYXJhdGlvbnMuYWRkKGRlY2xhcmF0aW9uTWV0YWRhdGEpO1xuICAgICAgcmV0dXJuIGV4aXN0aW5nLmdldHRlcjtcbiAgICB9XG5cbiAgICBjb25zdCBnZXR0ZXIgPSB0aHVua0ZvcihwLCBjb250ZXh0KTtcbiAgICBtLmltcG9ydHMuc2V0KHAsIHsgZ2V0dGVyLCBkZWNsYXJhdGlvbnM6IG5ldyBTZXQoW2RlY2xhcmF0aW9uTWV0YWRhdGFdKSB9KTtcbiAgICByZXR1cm4gZ2V0dGVyO1xuICB9XG5cbiAgY29uc3Qgc291cmNlID0gbWFrZVNvdXJjZUNvZGUoY29udGVudCwgYXN0KTtcblxuICBmdW5jdGlvbiByZWFkVHNDb25maWcoKSB7XG4gICAgY29uc3QgdHNDb25maWdJbmZvID0gdHNDb25maWdMb2FkZXIoe1xuICAgICAgY3dkOlxuICAgICAgICAoY29udGV4dC5wYXJzZXJPcHRpb25zICYmIGNvbnRleHQucGFyc2VyT3B0aW9ucy50c2NvbmZpZ1Jvb3REaXIpIHx8XG4gICAgICAgIHByb2Nlc3MuY3dkKCksXG4gICAgICBnZXRFbnY6IChrZXkpID0+IHByb2Nlc3MuZW52W2tleV0sXG4gICAgfSk7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0c0NvbmZpZ0luZm8udHNDb25maWdQYXRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QganNvblRleHQgPSBmcy5yZWFkRmlsZVN5bmModHNDb25maWdJbmZvLnRzQ29uZmlnUGF0aCkudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKCFwYXJzZUNvbmZpZ0ZpbGVUZXh0VG9Kc29uKSB7XG4gICAgICAgICAgLy8gdGhpcyBpcyBiZWNhdXNlIHByb2plY3RzIG5vdCB1c2luZyBUeXBlU2NyaXB0IHdvbid0IGhhdmUgdHlwZXNjcmlwdCBpbnN0YWxsZWRcbiAgICAgICAgICAoeyBwYXJzZUNvbmZpZ0ZpbGVUZXh0VG9Kc29uIH0gPSByZXF1aXJlKCd0eXBlc2NyaXB0JykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJzZUNvbmZpZ0ZpbGVUZXh0VG9Kc29uKHRzQ29uZmlnSW5mby50c0NvbmZpZ1BhdGgsIGpzb25UZXh0KS5jb25maWc7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gQ2F0Y2ggYW55IGVycm9yc1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNFc01vZHVsZUludGVyb3AoKSB7XG4gICAgY29uc3QgY2FjaGVLZXkgPSBoYXNoT2JqZWN0KHtcbiAgICAgIHRzY29uZmlnUm9vdERpcjogY29udGV4dC5wYXJzZXJPcHRpb25zICYmIGNvbnRleHQucGFyc2VyT3B0aW9ucy50c2NvbmZpZ1Jvb3REaXIsXG4gICAgfSkuZGlnZXN0KCdoZXgnKTtcbiAgICBsZXQgdHNDb25maWcgPSB0c0NvbmZpZ0NhY2hlLmdldChjYWNoZUtleSk7XG4gICAgaWYgKHR5cGVvZiB0c0NvbmZpZyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRzQ29uZmlnID0gcmVhZFRzQ29uZmlnKCk7XG4gICAgICB0c0NvbmZpZ0NhY2hlLnNldChjYWNoZUtleSwgdHNDb25maWcpO1xuICAgIH1cblxuICAgIHJldHVybiB0c0NvbmZpZyAmJiB0c0NvbmZpZy5jb21waWxlck9wdGlvbnMgPyB0c0NvbmZpZy5jb21waWxlck9wdGlvbnMuZXNNb2R1bGVJbnRlcm9wIDogZmFsc2U7XG4gIH1cblxuICBhc3QuYm9keS5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgaWYgKG4udHlwZSA9PT0gJ0V4cG9ydERlZmF1bHREZWNsYXJhdGlvbicpIHtcbiAgICAgIGNvbnN0IGV4cG9ydE1ldGEgPSBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBuKTtcbiAgICAgIGlmIChuLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICBhZGROYW1lc3BhY2UoZXhwb3J0TWV0YSwgbi5kZWNsYXJhdGlvbik7XG4gICAgICB9XG4gICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCBleHBvcnRNZXRhKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobi50eXBlID09PSAnRXhwb3J0QWxsRGVjbGFyYXRpb24nKSB7XG4gICAgICBjb25zdCBnZXR0ZXIgPSBjYXB0dXJlRGVwZW5kZW5jeShuLCBuLmV4cG9ydEtpbmQgPT09ICd0eXBlJyk7XG4gICAgICBpZiAoZ2V0dGVyKSBtLmRlcGVuZGVuY2llcy5hZGQoZ2V0dGVyKTtcbiAgICAgIGlmIChuLmV4cG9ydGVkKSB7XG4gICAgICAgIHByb2Nlc3NTcGVjaWZpZXIobiwgbi5leHBvcnRlZCwgbSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY2FwdHVyZSBuYW1lc3BhY2VzIGluIGNhc2Ugb2YgbGF0ZXIgZXhwb3J0XG4gICAgaWYgKG4udHlwZSA9PT0gJ0ltcG9ydERlY2xhcmF0aW9uJykge1xuICAgICAgLy8gaW1wb3J0IHR5cGUgeyBGb28gfSAoVFMgYW5kIEZsb3cpXG4gICAgICBjb25zdCBkZWNsYXJhdGlvbklzVHlwZSA9IG4uaW1wb3J0S2luZCA9PT0gJ3R5cGUnO1xuICAgICAgLy8gaW1wb3J0ICcuL2Zvbycgb3IgaW1wb3J0IHt9IGZyb20gJy4vZm9vJyAoYm90aCAwIHNwZWNpZmllcnMpIGlzIGEgc2lkZSBlZmZlY3QgYW5kXG4gICAgICAvLyBzaG91bGRuJ3QgYmUgY29uc2lkZXJlZCB0byBiZSBqdXN0IGltcG9ydGluZyB0eXBlc1xuICAgICAgbGV0IHNwZWNpZmllcnNPbmx5SW1wb3J0aW5nVHlwZXMgPSBuLnNwZWNpZmllcnMubGVuZ3RoO1xuICAgICAgY29uc3QgaW1wb3J0ZWRTcGVjaWZpZXJzID0gbmV3IFNldCgpO1xuICAgICAgbi5zcGVjaWZpZXJzLmZvckVhY2goc3BlY2lmaWVyID0+IHtcbiAgICAgICAgaWYgKHN1cHBvcnRlZEltcG9ydFR5cGVzLmhhcyhzcGVjaWZpZXIudHlwZSkpIHtcbiAgICAgICAgICBpbXBvcnRlZFNwZWNpZmllcnMuYWRkKHNwZWNpZmllci50eXBlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3BlY2lmaWVyLnR5cGUgPT09ICdJbXBvcnRTcGVjaWZpZXInKSB7XG4gICAgICAgICAgaW1wb3J0ZWRTcGVjaWZpZXJzLmFkZChzcGVjaWZpZXIuaW1wb3J0ZWQubmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbXBvcnQgeyB0eXBlIEZvbyB9IChGbG93KVxuICAgICAgICBzcGVjaWZpZXJzT25seUltcG9ydGluZ1R5cGVzID1cbiAgICAgICAgICBzcGVjaWZpZXJzT25seUltcG9ydGluZ1R5cGVzICYmIHNwZWNpZmllci5pbXBvcnRLaW5kID09PSAndHlwZSc7XG4gICAgICB9KTtcbiAgICAgIGNhcHR1cmVEZXBlbmRlbmN5KG4sIGRlY2xhcmF0aW9uSXNUeXBlIHx8IHNwZWNpZmllcnNPbmx5SW1wb3J0aW5nVHlwZXMsIGltcG9ydGVkU3BlY2lmaWVycyk7XG5cbiAgICAgIGNvbnN0IG5zID0gbi5zcGVjaWZpZXJzLmZpbmQocyA9PiBzLnR5cGUgPT09ICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInKTtcbiAgICAgIGlmIChucykge1xuICAgICAgICBuYW1lc3BhY2VzLnNldChucy5sb2NhbC5uYW1lLCBuLnNvdXJjZS52YWx1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG4udHlwZSA9PT0gJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nKSB7XG4gICAgICAvLyBjYXB0dXJlIGRlY2xhcmF0aW9uXG4gICAgICBpZiAobi5kZWNsYXJhdGlvbiAhPSBudWxsKSB7XG4gICAgICAgIHN3aXRjaCAobi5kZWNsYXJhdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgJ0Z1bmN0aW9uRGVjbGFyYXRpb24nOlxuICAgICAgICBjYXNlICdDbGFzc0RlY2xhcmF0aW9uJzpcbiAgICAgICAgY2FzZSAnVHlwZUFsaWFzJzogLy8gZmxvd3R5cGUgd2l0aCBiYWJlbC1lc2xpbnQgcGFyc2VyXG4gICAgICAgIGNhc2UgJ0ludGVyZmFjZURlY2xhcmF0aW9uJzpcbiAgICAgICAgY2FzZSAnRGVjbGFyZUZ1bmN0aW9uJzpcbiAgICAgICAgY2FzZSAnVFNEZWNsYXJlRnVuY3Rpb24nOlxuICAgICAgICBjYXNlICdUU0VudW1EZWNsYXJhdGlvbic6XG4gICAgICAgIGNhc2UgJ1RTVHlwZUFsaWFzRGVjbGFyYXRpb24nOlxuICAgICAgICBjYXNlICdUU0ludGVyZmFjZURlY2xhcmF0aW9uJzpcbiAgICAgICAgY2FzZSAnVFNBYnN0cmFjdENsYXNzRGVjbGFyYXRpb24nOlxuICAgICAgICBjYXNlICdUU01vZHVsZURlY2xhcmF0aW9uJzpcbiAgICAgICAgICBtLm5hbWVzcGFjZS5zZXQobi5kZWNsYXJhdGlvbi5pZC5uYW1lLCBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBuKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1ZhcmlhYmxlRGVjbGFyYXRpb24nOlxuICAgICAgICAgIG4uZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zLmZvckVhY2goKGQpID0+XG4gICAgICAgICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShkLmlkLFxuICAgICAgICAgICAgICBpZCA9PiBtLm5hbWVzcGFjZS5zZXQoaWQubmFtZSwgY2FwdHVyZURvYyhzb3VyY2UsIGRvY1N0eWxlUGFyc2VycywgZCwgbikpKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbi5zcGVjaWZpZXJzLmZvckVhY2goKHMpID0+IHByb2Nlc3NTcGVjaWZpZXIocywgbiwgbSkpO1xuICAgIH1cblxuICAgIGNvbnN0IGV4cG9ydHMgPSBbJ1RTRXhwb3J0QXNzaWdubWVudCddO1xuICAgIGlmIChpc0VzTW9kdWxlSW50ZXJvcFRydWUpIHtcbiAgICAgIGV4cG9ydHMucHVzaCgnVFNOYW1lc3BhY2VFeHBvcnREZWNsYXJhdGlvbicpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZG9lc24ndCBkZWNsYXJlIGFueXRoaW5nLCBidXQgY2hhbmdlcyB3aGF0J3MgYmVpbmcgZXhwb3J0ZWQuXG4gICAgaWYgKGluY2x1ZGVzKGV4cG9ydHMsIG4udHlwZSkpIHtcbiAgICAgIGNvbnN0IGV4cG9ydGVkTmFtZSA9IG4udHlwZSA9PT0gJ1RTTmFtZXNwYWNlRXhwb3J0RGVjbGFyYXRpb24nXG4gICAgICAgID8gbi5pZC5uYW1lXG4gICAgICAgIDogKG4uZXhwcmVzc2lvbiAmJiBuLmV4cHJlc3Npb24ubmFtZSB8fCAobi5leHByZXNzaW9uLmlkICYmIG4uZXhwcmVzc2lvbi5pZC5uYW1lKSB8fCBudWxsKTtcbiAgICAgIGNvbnN0IGRlY2xUeXBlcyA9IFtcbiAgICAgICAgJ1ZhcmlhYmxlRGVjbGFyYXRpb24nLFxuICAgICAgICAnQ2xhc3NEZWNsYXJhdGlvbicsXG4gICAgICAgICdUU0RlY2xhcmVGdW5jdGlvbicsXG4gICAgICAgICdUU0VudW1EZWNsYXJhdGlvbicsXG4gICAgICAgICdUU1R5cGVBbGlhc0RlY2xhcmF0aW9uJyxcbiAgICAgICAgJ1RTSW50ZXJmYWNlRGVjbGFyYXRpb24nLFxuICAgICAgICAnVFNBYnN0cmFjdENsYXNzRGVjbGFyYXRpb24nLFxuICAgICAgICAnVFNNb2R1bGVEZWNsYXJhdGlvbicsXG4gICAgICBdO1xuICAgICAgY29uc3QgZXhwb3J0ZWREZWNscyA9IGFzdC5ib2R5LmZpbHRlcigoeyB0eXBlLCBpZCwgZGVjbGFyYXRpb25zIH0pID0+IGluY2x1ZGVzKGRlY2xUeXBlcywgdHlwZSkgJiYgKFxuICAgICAgICAoaWQgJiYgaWQubmFtZSA9PT0gZXhwb3J0ZWROYW1lKSB8fCAoZGVjbGFyYXRpb25zICYmIGRlY2xhcmF0aW9ucy5maW5kKChkKSA9PiBkLmlkLm5hbWUgPT09IGV4cG9ydGVkTmFtZSkpXG4gICAgICApKTtcbiAgICAgIGlmIChleHBvcnRlZERlY2xzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBFeHBvcnQgaXMgbm90IHJlZmVyZW5jaW5nIGFueSBsb2NhbCBkZWNsYXJhdGlvbiwgbXVzdCBiZSByZS1leHBvcnRpbmdcbiAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KCdkZWZhdWx0JywgY2FwdHVyZURvYyhzb3VyY2UsIGRvY1N0eWxlUGFyc2VycywgbikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIGlzRXNNb2R1bGVJbnRlcm9wVHJ1ZSAvLyBlc01vZHVsZUludGVyb3AgaXMgb24gaW4gdHNjb25maWdcbiAgICAgICAgJiYgIW0ubmFtZXNwYWNlLmhhcygnZGVmYXVsdCcpIC8vIGFuZCBkZWZhdWx0IGlzbid0IGFkZGVkIGFscmVhZHlcbiAgICAgICkge1xuICAgICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCB7fSk7IC8vIGFkZCBkZWZhdWx0IGV4cG9ydFxuICAgICAgfVxuICAgICAgZXhwb3J0ZWREZWNscy5mb3JFYWNoKChkZWNsKSA9PiB7XG4gICAgICAgIGlmIChkZWNsLnR5cGUgPT09ICdUU01vZHVsZURlY2xhcmF0aW9uJykge1xuICAgICAgICAgIGlmIChkZWNsLmJvZHkgJiYgZGVjbC5ib2R5LnR5cGUgPT09ICdUU01vZHVsZURlY2xhcmF0aW9uJykge1xuICAgICAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KGRlY2wuYm9keS5pZC5uYW1lLCBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBkZWNsLmJvZHkpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRlY2wuYm9keSAmJiBkZWNsLmJvZHkuYm9keSkge1xuICAgICAgICAgICAgZGVjbC5ib2R5LmJvZHkuZm9yRWFjaCgobW9kdWxlQmxvY2tOb2RlKSA9PiB7XG4gICAgICAgICAgICAgIC8vIEV4cG9ydC1hc3NpZ25tZW50IGV4cG9ydHMgYWxsIG1lbWJlcnMgaW4gdGhlIG5hbWVzcGFjZSxcbiAgICAgICAgICAgICAgLy8gZXhwbGljaXRseSBleHBvcnRlZCBvciBub3QuXG4gICAgICAgICAgICAgIGNvbnN0IG5hbWVzcGFjZURlY2wgPSBtb2R1bGVCbG9ja05vZGUudHlwZSA9PT0gJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nID9cbiAgICAgICAgICAgICAgICBtb2R1bGVCbG9ja05vZGUuZGVjbGFyYXRpb24gOlxuICAgICAgICAgICAgICAgIG1vZHVsZUJsb2NrTm9kZTtcblxuICAgICAgICAgICAgICBpZiAoIW5hbWVzcGFjZURlY2wpIHtcbiAgICAgICAgICAgICAgICAvLyBUeXBlU2NyaXB0IGNhbiBjaGVjayB0aGlzIGZvciB1czsgd2UgbmVlZG4ndFxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5hbWVzcGFjZURlY2wudHlwZSA9PT0gJ1ZhcmlhYmxlRGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlRGVjbC5kZWNsYXJhdGlvbnMuZm9yRWFjaCgoZCkgPT5cbiAgICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKGQuaWQsIChpZCkgPT4gbS5uYW1lc3BhY2Uuc2V0KFxuICAgICAgICAgICAgICAgICAgICBpZC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBkZWNsLCBuYW1lc3BhY2VEZWNsLCBtb2R1bGVCbG9ja05vZGUpLFxuICAgICAgICAgICAgICAgICAgKSksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtLm5hbWVzcGFjZS5zZXQoXG4gICAgICAgICAgICAgICAgICBuYW1lc3BhY2VEZWNsLmlkLm5hbWUsXG4gICAgICAgICAgICAgICAgICBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBtb2R1bGVCbG9ja05vZGUpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEV4cG9ydCBhcyBkZWZhdWx0XG4gICAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KCdkZWZhdWx0JywgY2FwdHVyZURvYyhzb3VyY2UsIGRvY1N0eWxlUGFyc2VycywgZGVjbCkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChcbiAgICBpc0VzTW9kdWxlSW50ZXJvcFRydWUgLy8gZXNNb2R1bGVJbnRlcm9wIGlzIG9uIGluIHRzY29uZmlnXG4gICAgJiYgbS5uYW1lc3BhY2Uuc2l6ZSA+IDAgLy8gYW55dGhpbmcgaXMgZXhwb3J0ZWRcbiAgICAmJiAhbS5uYW1lc3BhY2UuaGFzKCdkZWZhdWx0JykgLy8gYW5kIGRlZmF1bHQgaXNuJ3QgYWRkZWQgYWxyZWFkeVxuICApIHtcbiAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCB7fSk7IC8vIGFkZCBkZWZhdWx0IGV4cG9ydFxuICB9XG5cbiAgcmV0dXJuIG07XG59O1xuXG4vKipcbiAqIFRoZSBjcmVhdGlvbiBvZiB0aGlzIGNsb3N1cmUgaXMgaXNvbGF0ZWQgZnJvbSBvdGhlciBzY29wZXNcbiAqIHRvIGF2b2lkIG92ZXItcmV0ZW50aW9uIG9mIHVucmVsYXRlZCB2YXJpYWJsZXMsIHdoaWNoIGhhc1xuICogY2F1c2VkIG1lbW9yeSBsZWFrcy4gU2VlICMxMjY2LlxuICovXG5mdW5jdGlvbiB0aHVua0ZvcihwLCBjb250ZXh0KSB7XG4gIHJldHVybiAoKSA9PiBFeHBvcnRNYXAuZm9yKGNoaWxkQ29udGV4dChwLCBjb250ZXh0KSk7XG59XG5cblxuLyoqXG4gKiBUcmF2ZXJzZSBhIHBhdHRlcm4vaWRlbnRpZmllciBub2RlLCBjYWxsaW5nICdjYWxsYmFjaydcbiAqIGZvciBlYWNoIGxlYWYgaWRlbnRpZmllci5cbiAqIEBwYXJhbSAge25vZGV9ICAgcGF0dGVyblxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUocGF0dGVybiwgY2FsbGJhY2spIHtcbiAgc3dpdGNoIChwYXR0ZXJuLnR5cGUpIHtcbiAgY2FzZSAnSWRlbnRpZmllcic6IC8vIGJhc2UgY2FzZVxuICAgIGNhbGxiYWNrKHBhdHRlcm4pO1xuICAgIGJyZWFrO1xuXG4gIGNhc2UgJ09iamVjdFBhdHRlcm4nOlxuICAgIHBhdHRlcm4ucHJvcGVydGllcy5mb3JFYWNoKHAgPT4ge1xuICAgICAgaWYgKHAudHlwZSA9PT0gJ0V4cGVyaW1lbnRhbFJlc3RQcm9wZXJ0eScgfHwgcC50eXBlID09PSAnUmVzdEVsZW1lbnQnKSB7XG4gICAgICAgIGNhbGxiYWNrKHAuYXJndW1lbnQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShwLnZhbHVlLCBjYWxsYmFjayk7XG4gICAgfSk7XG4gICAgYnJlYWs7XG5cbiAgY2FzZSAnQXJyYXlQYXR0ZXJuJzpcbiAgICBwYXR0ZXJuLmVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGlmIChlbGVtZW50ID09IG51bGwpIHJldHVybjtcbiAgICAgIGlmIChlbGVtZW50LnR5cGUgPT09ICdFeHBlcmltZW50YWxSZXN0UHJvcGVydHknIHx8IGVsZW1lbnQudHlwZSA9PT0gJ1Jlc3RFbGVtZW50Jykge1xuICAgICAgICBjYWxsYmFjayhlbGVtZW50LmFyZ3VtZW50KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUoZWxlbWVudCwgY2FsbGJhY2spO1xuICAgIH0pO1xuICAgIGJyZWFrO1xuXG4gIGNhc2UgJ0Fzc2lnbm1lbnRQYXR0ZXJuJzpcbiAgICBjYWxsYmFjayhwYXR0ZXJuLmxlZnQpO1xuICAgIGJyZWFrO1xuICB9XG59XG5cbi8qKlxuICogZG9uJ3QgaG9sZCBmdWxsIGNvbnRleHQgb2JqZWN0IGluIG1lbW9yeSwganVzdCBncmFiIHdoYXQgd2UgbmVlZC5cbiAqL1xuZnVuY3Rpb24gY2hpbGRDb250ZXh0KHBhdGgsIGNvbnRleHQpIHtcbiAgY29uc3QgeyBzZXR0aW5ncywgcGFyc2VyT3B0aW9ucywgcGFyc2VyUGF0aCB9ID0gY29udGV4dDtcbiAgcmV0dXJuIHtcbiAgICBzZXR0aW5ncyxcbiAgICBwYXJzZXJPcHRpb25zLFxuICAgIHBhcnNlclBhdGgsXG4gICAgcGF0aCxcbiAgfTtcbn1cblxuXG4vKipcbiAqIHNvbWV0aW1lcyBsZWdhY3kgc3VwcG9ydCBpc24ndCBfdGhhdF8gaGFyZC4uLiByaWdodD9cbiAqL1xuZnVuY3Rpb24gbWFrZVNvdXJjZUNvZGUodGV4dCwgYXN0KSB7XG4gIGlmIChTb3VyY2VDb2RlLmxlbmd0aCA+IDEpIHtcbiAgICAvLyBFU0xpbnQgM1xuICAgIHJldHVybiBuZXcgU291cmNlQ29kZSh0ZXh0LCBhc3QpO1xuICB9IGVsc2Uge1xuICAgIC8vIEVTTGludCA0LCA1XG4gICAgcmV0dXJuIG5ldyBTb3VyY2VDb2RlKHsgdGV4dCwgYXN0IH0pO1xuICB9XG59XG4iXX0=