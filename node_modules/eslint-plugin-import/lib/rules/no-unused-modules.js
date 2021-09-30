'use strict';var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};





var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _ignore = require('eslint-module-utils/ignore');
var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _path = require('path');
var _readPkgUp = require('read-pkg-up');var _readPkgUp2 = _interopRequireDefault(_readPkgUp);
var _object = require('object.values');var _object2 = _interopRequireDefault(_object);
var _arrayIncludes = require('array-includes');var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} /**
                                                                                                                                                                                                                                                                                                                                                                                                       * @fileOverview Ensures that modules contain exports and/or all
                                                                                                                                                                                                                                                                                                                                                                                                       * modules are consumed within other modules.
                                                                                                                                                                                                                                                                                                                                                                                                       * @author René Fermann
                                                                                                                                                                                                                                                                                                                                                                                                       */ // eslint/lib/util/glob-util has been moved to eslint/lib/util/glob-utils with version 5.3
// and has been moved to eslint/lib/cli-engine/file-enumerator in version 6
var listFilesToProcess = void 0;try {var FileEnumerator = require('eslint/lib/cli-engine/file-enumerator').FileEnumerator;
  listFilesToProcess = function listFilesToProcess(src, extensions) {
    var e = new FileEnumerator({
      extensions: extensions });

    return Array.from(e.iterateFiles(src), function (_ref) {var filePath = _ref.filePath,ignored = _ref.ignored;return {
        ignored: ignored,
        filename: filePath };});

  };
} catch (e1) {
  // Prevent passing invalid options (extensions array) to old versions of the function.
  // https://github.com/eslint/eslint/blob/v5.16.0/lib/util/glob-utils.js#L178-L280
  // https://github.com/eslint/eslint/blob/v5.2.0/lib/util/glob-util.js#L174-L269
  var originalListFilesToProcess = void 0;
  try {
    originalListFilesToProcess = require('eslint/lib/util/glob-utils').listFilesToProcess;
    listFilesToProcess = function listFilesToProcess(src, extensions) {
      return originalListFilesToProcess(src, {
        extensions: extensions });

    };
  } catch (e2) {
    originalListFilesToProcess = require('eslint/lib/util/glob-util').listFilesToProcess;

    listFilesToProcess = function listFilesToProcess(src, extensions) {
      var patterns = src.reduce(function (carry, pattern) {
        return carry.concat(extensions.map(function (extension) {
          return (/\*\*|\*\./.test(pattern) ? pattern : String(pattern) + '/**/*' + String(extension));
        }));
      }, src.slice());

      return originalListFilesToProcess(patterns);
    };
  }
}

var EXPORT_DEFAULT_DECLARATION = 'ExportDefaultDeclaration';
var EXPORT_NAMED_DECLARATION = 'ExportNamedDeclaration';
var EXPORT_ALL_DECLARATION = 'ExportAllDeclaration';
var IMPORT_DECLARATION = 'ImportDeclaration';
var IMPORT_NAMESPACE_SPECIFIER = 'ImportNamespaceSpecifier';
var IMPORT_DEFAULT_SPECIFIER = 'ImportDefaultSpecifier';
var VARIABLE_DECLARATION = 'VariableDeclaration';
var FUNCTION_DECLARATION = 'FunctionDeclaration';
var CLASS_DECLARATION = 'ClassDeclaration';
var IDENTIFIER = 'Identifier';
var OBJECT_PATTERN = 'ObjectPattern';
var TS_INTERFACE_DECLARATION = 'TSInterfaceDeclaration';
var TS_TYPE_ALIAS_DECLARATION = 'TSTypeAliasDeclaration';
var TS_ENUM_DECLARATION = 'TSEnumDeclaration';
var DEFAULT = 'default';

function forEachDeclarationIdentifier(declaration, cb) {
  if (declaration) {
    if (
    declaration.type === FUNCTION_DECLARATION ||
    declaration.type === CLASS_DECLARATION ||
    declaration.type === TS_INTERFACE_DECLARATION ||
    declaration.type === TS_TYPE_ALIAS_DECLARATION ||
    declaration.type === TS_ENUM_DECLARATION)
    {
      cb(declaration.id.name);
    } else if (declaration.type === VARIABLE_DECLARATION) {
      declaration.declarations.forEach(function (_ref2) {var id = _ref2.id;
        if (id.type === OBJECT_PATTERN) {
          (0, _ExportMap.recursivePatternCapture)(id, function (pattern) {
            if (pattern.type === IDENTIFIER) {
              cb(pattern.name);
            }
          });
        } else {
          cb(id.name);
        }
      });
    }
  }
}

/**
   * List of imports per file.
   *
   * Represented by a two-level Map to a Set of identifiers. The upper-level Map
   * keys are the paths to the modules containing the imports, while the
   * lower-level Map keys are the paths to the files which are being imported
   * from. Lastly, the Set of identifiers contains either names being imported
   * or a special AST node name listed above (e.g ImportDefaultSpecifier).
   *
   * For example, if we have a file named foo.js containing:
   *
   *   import { o2 } from './bar.js';
   *
   * Then we will have a structure that looks like:
   *
   *   Map { 'foo.js' => Map { 'bar.js' => Set { 'o2' } } }
   *
   * @type {Map<string, Map<string, Set<string>>>}
   */
var importList = new Map();

/**
                             * List of exports per file.
                             *
                             * Represented by a two-level Map to an object of metadata. The upper-level Map
                             * keys are the paths to the modules containing the exports, while the
                             * lower-level Map keys are the specific identifiers or special AST node names
                             * being exported. The leaf-level metadata object at the moment only contains a
                             * `whereUsed` property, which contains a Set of paths to modules that import
                             * the name.
                             *
                             * For example, if we have a file named bar.js containing the following exports:
                             *
                             *   const o2 = 'bar';
                             *   export { o2 };
                             *
                             * And a file named foo.js containing the following import:
                             *
                             *   import { o2 } from './bar.js';
                             *
                             * Then we will have a structure that looks like:
                             *
                             *   Map { 'bar.js' => Map { 'o2' => { whereUsed: Set { 'foo.js' } } } }
                             *
                             * @type {Map<string, Map<string, object>>}
                             */
var exportList = new Map();

var ignoredFiles = new Set();
var filesOutsideSrc = new Set();

var isNodeModule = function isNodeModule(path) {
  return (/\/(node_modules)\//.test(path));
};

/**
    * read all files matching the patterns in src and ignoreExports
    *
    * return all files matching src pattern, which are not matching the ignoreExports pattern
    */
var resolveFiles = function resolveFiles(src, ignoreExports, context) {
  var extensions = Array.from((0, _ignore.getFileExtensions)(context.settings));

  var srcFiles = new Set();
  var srcFileList = listFilesToProcess(src, extensions);

  // prepare list of ignored files
  var ignoredFilesList = listFilesToProcess(ignoreExports, extensions);
  ignoredFilesList.forEach(function (_ref3) {var filename = _ref3.filename;return ignoredFiles.add(filename);});

  // prepare list of source files, don't consider files from node_modules
  srcFileList.filter(function (_ref4) {var filename = _ref4.filename;return !isNodeModule(filename);}).forEach(function (_ref5) {var filename = _ref5.filename;
    srcFiles.add(filename);
  });
  return srcFiles;
};

/**
    * parse all source files and build up 2 maps containing the existing imports and exports
    */
var prepareImportsAndExports = function prepareImportsAndExports(srcFiles, context) {
  var exportAll = new Map();
  srcFiles.forEach(function (file) {
    var exports = new Map();
    var imports = new Map();
    var currentExports = _ExportMap2['default'].get(file, context);
    if (currentExports) {var
      dependencies = currentExports.dependencies,reexports = currentExports.reexports,localImportList = currentExports.imports,namespace = currentExports.namespace;

      // dependencies === export * from
      var currentExportAll = new Set();
      dependencies.forEach(function (getDependency) {
        var dependency = getDependency();
        if (dependency === null) {
          return;
        }

        currentExportAll.add(dependency.path);
      });
      exportAll.set(file, currentExportAll);

      reexports.forEach(function (value, key) {
        if (key === DEFAULT) {
          exports.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: new Set() });
        } else {
          exports.set(key, { whereUsed: new Set() });
        }
        var reexport = value.getImport();
        if (!reexport) {
          return;
        }
        var localImport = imports.get(reexport.path);
        var currentValue = void 0;
        if (value.local === DEFAULT) {
          currentValue = IMPORT_DEFAULT_SPECIFIER;
        } else {
          currentValue = value.local;
        }
        if (typeof localImport !== 'undefined') {
          localImport = new Set([].concat(_toConsumableArray(localImport), [currentValue]));
        } else {
          localImport = new Set([currentValue]);
        }
        imports.set(reexport.path, localImport);
      });

      localImportList.forEach(function (value, key) {
        if (isNodeModule(key)) {
          return;
        }
        var localImport = imports.get(key) || new Set();
        value.declarations.forEach(function (_ref6) {var importedSpecifiers = _ref6.importedSpecifiers;return (
            importedSpecifiers.forEach(function (specifier) {return localImport.add(specifier);}));});

        imports.set(key, localImport);
      });
      importList.set(file, imports);

      // build up export list only, if file is not ignored
      if (ignoredFiles.has(file)) {
        return;
      }
      namespace.forEach(function (value, key) {
        if (key === DEFAULT) {
          exports.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: new Set() });
        } else {
          exports.set(key, { whereUsed: new Set() });
        }
      });
    }
    exports.set(EXPORT_ALL_DECLARATION, { whereUsed: new Set() });
    exports.set(IMPORT_NAMESPACE_SPECIFIER, { whereUsed: new Set() });
    exportList.set(file, exports);
  });
  exportAll.forEach(function (value, key) {
    value.forEach(function (val) {
      var currentExports = exportList.get(val);
      var currentExport = currentExports.get(EXPORT_ALL_DECLARATION);
      currentExport.whereUsed.add(key);
    });
  });
};

/**
    * traverse through all imports and add the respective path to the whereUsed-list
    * of the corresponding export
    */
var determineUsage = function determineUsage() {
  importList.forEach(function (listValue, listKey) {
    listValue.forEach(function (value, key) {
      var exports = exportList.get(key);
      if (typeof exports !== 'undefined') {
        value.forEach(function (currentImport) {
          var specifier = void 0;
          if (currentImport === IMPORT_NAMESPACE_SPECIFIER) {
            specifier = IMPORT_NAMESPACE_SPECIFIER;
          } else if (currentImport === IMPORT_DEFAULT_SPECIFIER) {
            specifier = IMPORT_DEFAULT_SPECIFIER;
          } else {
            specifier = currentImport;
          }
          if (typeof specifier !== 'undefined') {
            var exportStatement = exports.get(specifier);
            if (typeof exportStatement !== 'undefined') {var
              whereUsed = exportStatement.whereUsed;
              whereUsed.add(listKey);
              exports.set(specifier, { whereUsed: whereUsed });
            }
          }
        });
      }
    });
  });
};

var getSrc = function getSrc(src) {
  if (src) {
    return src;
  }
  return [process.cwd()];
};

/**
    * prepare the lists of existing imports and exports - should only be executed once at
    * the start of a new eslint run
    */
var srcFiles = void 0;
var lastPrepareKey = void 0;
var doPreparation = function doPreparation(src, ignoreExports, context) {
  var prepareKey = JSON.stringify({
    src: (src || []).sort(),
    ignoreExports: (ignoreExports || []).sort(),
    extensions: Array.from((0, _ignore.getFileExtensions)(context.settings)).sort() });

  if (prepareKey === lastPrepareKey) {
    return;
  }

  importList.clear();
  exportList.clear();
  ignoredFiles.clear();
  filesOutsideSrc.clear();

  srcFiles = resolveFiles(getSrc(src), ignoreExports, context);
  prepareImportsAndExports(srcFiles, context);
  determineUsage();
  lastPrepareKey = prepareKey;
};

var newNamespaceImportExists = function newNamespaceImportExists(specifiers) {return (
    specifiers.some(function (_ref7) {var type = _ref7.type;return type === IMPORT_NAMESPACE_SPECIFIER;}));};

var newDefaultImportExists = function newDefaultImportExists(specifiers) {return (
    specifiers.some(function (_ref8) {var type = _ref8.type;return type === IMPORT_DEFAULT_SPECIFIER;}));};

var fileIsInPkg = function fileIsInPkg(file) {var _readPkgUp$sync =
  _readPkgUp2['default'].sync({ cwd: file, normalize: false }),path = _readPkgUp$sync.path,pkg = _readPkgUp$sync.pkg;
  var basePath = (0, _path.dirname)(path);

  var checkPkgFieldString = function checkPkgFieldString(pkgField) {
    if ((0, _path.join)(basePath, pkgField) === file) {
      return true;
    }
  };

  var checkPkgFieldObject = function checkPkgFieldObject(pkgField) {
    var pkgFieldFiles = (0, _object2['default'])(pkgField).map(function (value) {return (0, _path.join)(basePath, value);});
    if ((0, _arrayIncludes2['default'])(pkgFieldFiles, file)) {
      return true;
    }
  };

  var checkPkgField = function checkPkgField(pkgField) {
    if (typeof pkgField === 'string') {
      return checkPkgFieldString(pkgField);
    }

    if ((typeof pkgField === 'undefined' ? 'undefined' : _typeof(pkgField)) === 'object') {
      return checkPkgFieldObject(pkgField);
    }
  };

  if (pkg['private'] === true) {
    return false;
  }

  if (pkg.bin) {
    if (checkPkgField(pkg.bin)) {
      return true;
    }
  }

  if (pkg.browser) {
    if (checkPkgField(pkg.browser)) {
      return true;
    }
  }

  if (pkg.main) {
    if (checkPkgFieldString(pkg.main)) {
      return true;
    }
  }

  return false;
};

module.exports = {
  meta: {
    type: 'suggestion',
    docs: { url: (0, _docsUrl2['default'])('no-unused-modules') },
    schema: [{
      properties: {
        src: {
          description: 'files/paths to be analyzed (only for unused exports)',
          type: 'array',
          minItems: 1,
          items: {
            type: 'string',
            minLength: 1 } },


        ignoreExports: {
          description:
          'files/paths for which unused exports will not be reported (e.g module entry points)',
          type: 'array',
          minItems: 1,
          items: {
            type: 'string',
            minLength: 1 } },


        missingExports: {
          description: 'report modules without any exports',
          type: 'boolean' },

        unusedExports: {
          description: 'report exports without any usage',
          type: 'boolean' } },


      not: {
        properties: {
          unusedExports: { 'enum': [false] },
          missingExports: { 'enum': [false] } } },


      anyOf: [{
        not: {
          properties: {
            unusedExports: { 'enum': [true] } } },


        required: ['missingExports'] },
      {
        not: {
          properties: {
            missingExports: { 'enum': [true] } } },


        required: ['unusedExports'] },
      {
        properties: {
          unusedExports: { 'enum': [true] } },

        required: ['unusedExports'] },
      {
        properties: {
          missingExports: { 'enum': [true] } },

        required: ['missingExports'] }] }] },




  create: function () {function create(context) {var _ref9 =





      context.options[0] || {},src = _ref9.src,_ref9$ignoreExports = _ref9.ignoreExports,ignoreExports = _ref9$ignoreExports === undefined ? [] : _ref9$ignoreExports,missingExports = _ref9.missingExports,unusedExports = _ref9.unusedExports;

      if (unusedExports) {
        doPreparation(src, ignoreExports, context);
      }

      var file = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();

      var checkExportPresence = function () {function checkExportPresence(node) {
          if (!missingExports) {
            return;
          }

          if (ignoredFiles.has(file)) {
            return;
          }

          var exportCount = exportList.get(file);
          var exportAll = exportCount.get(EXPORT_ALL_DECLARATION);
          var namespaceImports = exportCount.get(IMPORT_NAMESPACE_SPECIFIER);

          exportCount['delete'](EXPORT_ALL_DECLARATION);
          exportCount['delete'](IMPORT_NAMESPACE_SPECIFIER);
          if (exportCount.size < 1) {
            // node.body[0] === 'undefined' only happens, if everything is commented out in the file
            // being linted
            context.report(node.body[0] ? node.body[0] : node, 'No exports found');
          }
          exportCount.set(EXPORT_ALL_DECLARATION, exportAll);
          exportCount.set(IMPORT_NAMESPACE_SPECIFIER, namespaceImports);
        }return checkExportPresence;}();

      var checkUsage = function () {function checkUsage(node, exportedValue) {
          if (!unusedExports) {
            return;
          }

          if (ignoredFiles.has(file)) {
            return;
          }

          if (fileIsInPkg(file)) {
            return;
          }

          if (filesOutsideSrc.has(file)) {
            return;
          }

          // make sure file to be linted is included in source files
          if (!srcFiles.has(file)) {
            srcFiles = resolveFiles(getSrc(src), ignoreExports, context);
            if (!srcFiles.has(file)) {
              filesOutsideSrc.add(file);
              return;
            }
          }

          exports = exportList.get(file);

          // special case: export * from
          var exportAll = exports.get(EXPORT_ALL_DECLARATION);
          if (typeof exportAll !== 'undefined' && exportedValue !== IMPORT_DEFAULT_SPECIFIER) {
            if (exportAll.whereUsed.size > 0) {
              return;
            }
          }

          // special case: namespace import
          var namespaceImports = exports.get(IMPORT_NAMESPACE_SPECIFIER);
          if (typeof namespaceImports !== 'undefined') {
            if (namespaceImports.whereUsed.size > 0) {
              return;
            }
          }

          // exportsList will always map any imported value of 'default' to 'ImportDefaultSpecifier'
          var exportsKey = exportedValue === DEFAULT ? IMPORT_DEFAULT_SPECIFIER : exportedValue;

          var exportStatement = exports.get(exportsKey);

          var value = exportsKey === IMPORT_DEFAULT_SPECIFIER ? DEFAULT : exportsKey;

          if (typeof exportStatement !== 'undefined') {
            if (exportStatement.whereUsed.size < 1) {
              context.report(
              node, 'exported declaration \'' +
              value + '\' not used within other modules');

            }
          } else {
            context.report(
            node, 'exported declaration \'' +
            value + '\' not used within other modules');

          }
        }return checkUsage;}();

      /**
                                 * only useful for tools like vscode-eslint
                                 *
                                 * update lists of existing exports during runtime
                                 */
      var updateExportUsage = function () {function updateExportUsage(node) {
          if (ignoredFiles.has(file)) {
            return;
          }

          var exports = exportList.get(file);

          // new module has been created during runtime
          // include it in further processing
          if (typeof exports === 'undefined') {
            exports = new Map();
          }

          var newExports = new Map();
          var newExportIdentifiers = new Set();

          node.body.forEach(function (_ref10) {var type = _ref10.type,declaration = _ref10.declaration,specifiers = _ref10.specifiers;
            if (type === EXPORT_DEFAULT_DECLARATION) {
              newExportIdentifiers.add(IMPORT_DEFAULT_SPECIFIER);
            }
            if (type === EXPORT_NAMED_DECLARATION) {
              if (specifiers.length > 0) {
                specifiers.forEach(function (specifier) {
                  if (specifier.exported) {
                    newExportIdentifiers.add(specifier.exported.name);
                  }
                });
              }
              forEachDeclarationIdentifier(declaration, function (name) {
                newExportIdentifiers.add(name);
              });
            }
          });

          // old exports exist within list of new exports identifiers: add to map of new exports
          exports.forEach(function (value, key) {
            if (newExportIdentifiers.has(key)) {
              newExports.set(key, value);
            }
          });

          // new export identifiers added: add to map of new exports
          newExportIdentifiers.forEach(function (key) {
            if (!exports.has(key)) {
              newExports.set(key, { whereUsed: new Set() });
            }
          });

          // preserve information about namespace imports
          var exportAll = exports.get(EXPORT_ALL_DECLARATION);
          var namespaceImports = exports.get(IMPORT_NAMESPACE_SPECIFIER);

          if (typeof namespaceImports === 'undefined') {
            namespaceImports = { whereUsed: new Set() };
          }

          newExports.set(EXPORT_ALL_DECLARATION, exportAll);
          newExports.set(IMPORT_NAMESPACE_SPECIFIER, namespaceImports);
          exportList.set(file, newExports);
        }return updateExportUsage;}();

      /**
                                        * only useful for tools like vscode-eslint
                                        *
                                        * update lists of existing imports during runtime
                                        */
      var updateImportUsage = function () {function updateImportUsage(node) {
          if (!unusedExports) {
            return;
          }

          var oldImportPaths = importList.get(file);
          if (typeof oldImportPaths === 'undefined') {
            oldImportPaths = new Map();
          }

          var oldNamespaceImports = new Set();
          var newNamespaceImports = new Set();

          var oldExportAll = new Set();
          var newExportAll = new Set();

          var oldDefaultImports = new Set();
          var newDefaultImports = new Set();

          var oldImports = new Map();
          var newImports = new Map();
          oldImportPaths.forEach(function (value, key) {
            if (value.has(EXPORT_ALL_DECLARATION)) {
              oldExportAll.add(key);
            }
            if (value.has(IMPORT_NAMESPACE_SPECIFIER)) {
              oldNamespaceImports.add(key);
            }
            if (value.has(IMPORT_DEFAULT_SPECIFIER)) {
              oldDefaultImports.add(key);
            }
            value.forEach(function (val) {
              if (val !== IMPORT_NAMESPACE_SPECIFIER &&
              val !== IMPORT_DEFAULT_SPECIFIER) {
                oldImports.set(val, key);
              }
            });
          });

          node.body.forEach(function (astNode) {
            var resolvedPath = void 0;

            // support for export { value } from 'module'
            if (astNode.type === EXPORT_NAMED_DECLARATION) {
              if (astNode.source) {
                resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
                astNode.specifiers.forEach(function (specifier) {
                  var name = specifier.local.name;
                  if (specifier.local.name === DEFAULT) {
                    newDefaultImports.add(resolvedPath);
                  } else {
                    newImports.set(name, resolvedPath);
                  }
                });
              }
            }

            if (astNode.type === EXPORT_ALL_DECLARATION) {
              resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
              newExportAll.add(resolvedPath);
            }

            if (astNode.type === IMPORT_DECLARATION) {
              resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
              if (!resolvedPath) {
                return;
              }

              if (isNodeModule(resolvedPath)) {
                return;
              }

              if (newNamespaceImportExists(astNode.specifiers)) {
                newNamespaceImports.add(resolvedPath);
              }

              if (newDefaultImportExists(astNode.specifiers)) {
                newDefaultImports.add(resolvedPath);
              }

              astNode.specifiers.forEach(function (specifier) {
                if (specifier.type === IMPORT_DEFAULT_SPECIFIER ||
                specifier.type === IMPORT_NAMESPACE_SPECIFIER) {
                  return;
                }
                newImports.set(specifier.imported.name, resolvedPath);
              });
            }
          });

          newExportAll.forEach(function (value) {
            if (!oldExportAll.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(EXPORT_ALL_DECLARATION);
              oldImportPaths.set(value, imports);

              var _exports = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports !== 'undefined') {
                currentExport = _exports.get(EXPORT_ALL_DECLARATION);
              } else {
                _exports = new Map();
                exportList.set(value, _exports);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports.set(EXPORT_ALL_DECLARATION, { whereUsed: whereUsed });
              }
            }
          });

          oldExportAll.forEach(function (value) {
            if (!newExportAll.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](EXPORT_ALL_DECLARATION);

              var _exports2 = exportList.get(value);
              if (typeof _exports2 !== 'undefined') {
                var currentExport = _exports2.get(EXPORT_ALL_DECLARATION);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newDefaultImports.forEach(function (value) {
            if (!oldDefaultImports.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(IMPORT_DEFAULT_SPECIFIER);
              oldImportPaths.set(value, imports);

              var _exports3 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports3 !== 'undefined') {
                currentExport = _exports3.get(IMPORT_DEFAULT_SPECIFIER);
              } else {
                _exports3 = new Map();
                exportList.set(value, _exports3);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports3.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: whereUsed });
              }
            }
          });

          oldDefaultImports.forEach(function (value) {
            if (!newDefaultImports.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](IMPORT_DEFAULT_SPECIFIER);

              var _exports4 = exportList.get(value);
              if (typeof _exports4 !== 'undefined') {
                var currentExport = _exports4.get(IMPORT_DEFAULT_SPECIFIER);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newNamespaceImports.forEach(function (value) {
            if (!oldNamespaceImports.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(IMPORT_NAMESPACE_SPECIFIER);
              oldImportPaths.set(value, imports);

              var _exports5 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports5 !== 'undefined') {
                currentExport = _exports5.get(IMPORT_NAMESPACE_SPECIFIER);
              } else {
                _exports5 = new Map();
                exportList.set(value, _exports5);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports5.set(IMPORT_NAMESPACE_SPECIFIER, { whereUsed: whereUsed });
              }
            }
          });

          oldNamespaceImports.forEach(function (value) {
            if (!newNamespaceImports.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](IMPORT_NAMESPACE_SPECIFIER);

              var _exports6 = exportList.get(value);
              if (typeof _exports6 !== 'undefined') {
                var currentExport = _exports6.get(IMPORT_NAMESPACE_SPECIFIER);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newImports.forEach(function (value, key) {
            if (!oldImports.has(key)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(key);
              oldImportPaths.set(value, imports);

              var _exports7 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports7 !== 'undefined') {
                currentExport = _exports7.get(key);
              } else {
                _exports7 = new Map();
                exportList.set(value, _exports7);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports7.set(key, { whereUsed: whereUsed });
              }
            }
          });

          oldImports.forEach(function (value, key) {
            if (!newImports.has(key)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](key);

              var _exports8 = exportList.get(value);
              if (typeof _exports8 !== 'undefined') {
                var currentExport = _exports8.get(key);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });
        }return updateImportUsage;}();

      return {
        'Program:exit': function () {function ProgramExit(node) {
            updateExportUsage(node);
            updateImportUsage(node);
            checkExportPresence(node);
          }return ProgramExit;}(),
        'ExportDefaultDeclaration': function () {function ExportDefaultDeclaration(node) {
            checkUsage(node, IMPORT_DEFAULT_SPECIFIER);
          }return ExportDefaultDeclaration;}(),
        'ExportNamedDeclaration': function () {function ExportNamedDeclaration(node) {
            node.specifiers.forEach(function (specifier) {
              checkUsage(node, specifier.exported.name);
            });
            forEachDeclarationIdentifier(node.declaration, function (name) {
              checkUsage(node, name);
            });
          }return ExportNamedDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby11bnVzZWQtbW9kdWxlcy5qcyJdLCJuYW1lcyI6WyJsaXN0RmlsZXNUb1Byb2Nlc3MiLCJGaWxlRW51bWVyYXRvciIsInJlcXVpcmUiLCJzcmMiLCJleHRlbnNpb25zIiwiZSIsIkFycmF5IiwiZnJvbSIsIml0ZXJhdGVGaWxlcyIsImZpbGVQYXRoIiwiaWdub3JlZCIsImZpbGVuYW1lIiwiZTEiLCJvcmlnaW5hbExpc3RGaWxlc1RvUHJvY2VzcyIsImUyIiwicGF0dGVybnMiLCJyZWR1Y2UiLCJjYXJyeSIsInBhdHRlcm4iLCJjb25jYXQiLCJtYXAiLCJleHRlbnNpb24iLCJ0ZXN0Iiwic2xpY2UiLCJFWFBPUlRfREVGQVVMVF9ERUNMQVJBVElPTiIsIkVYUE9SVF9OQU1FRF9ERUNMQVJBVElPTiIsIkVYUE9SVF9BTExfREVDTEFSQVRJT04iLCJJTVBPUlRfREVDTEFSQVRJT04iLCJJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiIsIklNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiIsIlZBUklBQkxFX0RFQ0xBUkFUSU9OIiwiRlVOQ1RJT05fREVDTEFSQVRJT04iLCJDTEFTU19ERUNMQVJBVElPTiIsIklERU5USUZJRVIiLCJPQkpFQ1RfUEFUVEVSTiIsIlRTX0lOVEVSRkFDRV9ERUNMQVJBVElPTiIsIlRTX1RZUEVfQUxJQVNfREVDTEFSQVRJT04iLCJUU19FTlVNX0RFQ0xBUkFUSU9OIiwiREVGQVVMVCIsImZvckVhY2hEZWNsYXJhdGlvbklkZW50aWZpZXIiLCJkZWNsYXJhdGlvbiIsImNiIiwidHlwZSIsImlkIiwibmFtZSIsImRlY2xhcmF0aW9ucyIsImZvckVhY2giLCJpbXBvcnRMaXN0IiwiTWFwIiwiZXhwb3J0TGlzdCIsImlnbm9yZWRGaWxlcyIsIlNldCIsImZpbGVzT3V0c2lkZVNyYyIsImlzTm9kZU1vZHVsZSIsInBhdGgiLCJyZXNvbHZlRmlsZXMiLCJpZ25vcmVFeHBvcnRzIiwiY29udGV4dCIsInNldHRpbmdzIiwic3JjRmlsZXMiLCJzcmNGaWxlTGlzdCIsImlnbm9yZWRGaWxlc0xpc3QiLCJhZGQiLCJmaWx0ZXIiLCJwcmVwYXJlSW1wb3J0c0FuZEV4cG9ydHMiLCJleHBvcnRBbGwiLCJleHBvcnRzIiwiaW1wb3J0cyIsImN1cnJlbnRFeHBvcnRzIiwiRXhwb3J0cyIsImdldCIsImZpbGUiLCJkZXBlbmRlbmNpZXMiLCJyZWV4cG9ydHMiLCJsb2NhbEltcG9ydExpc3QiLCJuYW1lc3BhY2UiLCJjdXJyZW50RXhwb3J0QWxsIiwiZGVwZW5kZW5jeSIsImdldERlcGVuZGVuY3kiLCJzZXQiLCJ2YWx1ZSIsImtleSIsIndoZXJlVXNlZCIsInJlZXhwb3J0IiwiZ2V0SW1wb3J0IiwibG9jYWxJbXBvcnQiLCJjdXJyZW50VmFsdWUiLCJsb2NhbCIsImltcG9ydGVkU3BlY2lmaWVycyIsInNwZWNpZmllciIsImhhcyIsInZhbCIsImN1cnJlbnRFeHBvcnQiLCJkZXRlcm1pbmVVc2FnZSIsImxpc3RWYWx1ZSIsImxpc3RLZXkiLCJjdXJyZW50SW1wb3J0IiwiZXhwb3J0U3RhdGVtZW50IiwiZ2V0U3JjIiwicHJvY2VzcyIsImN3ZCIsImxhc3RQcmVwYXJlS2V5IiwiZG9QcmVwYXJhdGlvbiIsInByZXBhcmVLZXkiLCJKU09OIiwic3RyaW5naWZ5Iiwic29ydCIsImNsZWFyIiwibmV3TmFtZXNwYWNlSW1wb3J0RXhpc3RzIiwic3BlY2lmaWVycyIsInNvbWUiLCJuZXdEZWZhdWx0SW1wb3J0RXhpc3RzIiwiZmlsZUlzSW5Qa2ciLCJyZWFkUGtnVXAiLCJzeW5jIiwibm9ybWFsaXplIiwicGtnIiwiYmFzZVBhdGgiLCJjaGVja1BrZ0ZpZWxkU3RyaW5nIiwicGtnRmllbGQiLCJjaGVja1BrZ0ZpZWxkT2JqZWN0IiwicGtnRmllbGRGaWxlcyIsImNoZWNrUGtnRmllbGQiLCJiaW4iLCJicm93c2VyIiwibWFpbiIsIm1vZHVsZSIsIm1ldGEiLCJkb2NzIiwidXJsIiwic2NoZW1hIiwicHJvcGVydGllcyIsImRlc2NyaXB0aW9uIiwibWluSXRlbXMiLCJpdGVtcyIsIm1pbkxlbmd0aCIsIm1pc3NpbmdFeHBvcnRzIiwidW51c2VkRXhwb3J0cyIsIm5vdCIsImFueU9mIiwicmVxdWlyZWQiLCJjcmVhdGUiLCJvcHRpb25zIiwiZ2V0UGh5c2ljYWxGaWxlbmFtZSIsImdldEZpbGVuYW1lIiwiY2hlY2tFeHBvcnRQcmVzZW5jZSIsImV4cG9ydENvdW50IiwibmFtZXNwYWNlSW1wb3J0cyIsInNpemUiLCJyZXBvcnQiLCJub2RlIiwiYm9keSIsImNoZWNrVXNhZ2UiLCJleHBvcnRlZFZhbHVlIiwiZXhwb3J0c0tleSIsInVwZGF0ZUV4cG9ydFVzYWdlIiwibmV3RXhwb3J0cyIsIm5ld0V4cG9ydElkZW50aWZpZXJzIiwibGVuZ3RoIiwiZXhwb3J0ZWQiLCJ1cGRhdGVJbXBvcnRVc2FnZSIsIm9sZEltcG9ydFBhdGhzIiwib2xkTmFtZXNwYWNlSW1wb3J0cyIsIm5ld05hbWVzcGFjZUltcG9ydHMiLCJvbGRFeHBvcnRBbGwiLCJuZXdFeHBvcnRBbGwiLCJvbGREZWZhdWx0SW1wb3J0cyIsIm5ld0RlZmF1bHRJbXBvcnRzIiwib2xkSW1wb3J0cyIsIm5ld0ltcG9ydHMiLCJyZXNvbHZlZFBhdGgiLCJhc3ROb2RlIiwic291cmNlIiwicmF3IiwicmVwbGFjZSIsImltcG9ydGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFNQSx5QztBQUNBO0FBQ0Esc0Q7QUFDQSxxQztBQUNBO0FBQ0Esd0M7QUFDQSx1QztBQUNBLCtDLHVWQWJBOzs7OzBZQWVBO0FBQ0E7QUFDQSxJQUFJQSwyQkFBSixDQUNBLElBQUksQ0FDRixJQUFNQyxpQkFBaUJDLFFBQVEsdUNBQVIsRUFBaURELGNBQXhFO0FBQ0FELHVCQUFxQiw0QkFBVUcsR0FBVixFQUFlQyxVQUFmLEVBQTJCO0FBQzlDLFFBQU1DLElBQUksSUFBSUosY0FBSixDQUFtQjtBQUMzQkcsa0JBQVlBLFVBRGUsRUFBbkIsQ0FBVjs7QUFHQSxXQUFPRSxNQUFNQyxJQUFOLENBQVdGLEVBQUVH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Z0I7QUFDakMsZ0JBQUksQ0FBQ3dGLFdBQVcvRSxHQUFYLENBQWVULEdBQWYsQ0FBTCxFQUEwQjtBQUN4QixrQkFBTWQsVUFBVThGLGVBQWUzRixHQUFmLENBQW1CVSxLQUFuQixDQUFoQjtBQUNBYixnQ0FBZWMsR0FBZjs7QUFFQSxrQkFBTWYsWUFBVWpCLFdBQVdxQixHQUFYLENBQWVVLEtBQWYsQ0FBaEI7QUFDQSxrQkFBSSxPQUFPZCxTQUFQLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ2xDLG9CQUFNMEIsZ0JBQWdCMUIsVUFBUUksR0FBUixDQUFZVyxHQUFaLENBQXRCO0FBQ0Esb0JBQUksT0FBT1csYUFBUCxLQUF5QixXQUE3QixFQUEwQztBQUN4Q0EsZ0NBQWNWLFNBQWQsV0FBK0JYLElBQS9CO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsV0FiRDtBQWNELFNBclFLLDRCQUFOOztBQXVRQSxhQUFPO0FBQ0wscUNBQWdCLDJCQUFRO0FBQ3RCb0YsOEJBQWtCTCxJQUFsQjtBQUNBVSw4QkFBa0JWLElBQWxCO0FBQ0FMLGdDQUFvQkssSUFBcEI7QUFDRCxXQUpELHNCQURLO0FBTUwsaURBQTRCLHdDQUFRO0FBQ2xDRSx1QkFBV0YsSUFBWCxFQUFpQnpILHdCQUFqQjtBQUNELFdBRkQsbUNBTks7QUFTTCwrQ0FBMEIsc0NBQVE7QUFDaEN5SCxpQkFBS3pDLFVBQUwsQ0FBZ0IvRCxPQUFoQixDQUF3QixxQkFBYTtBQUNuQzBHLHlCQUFXRixJQUFYLEVBQWlCN0QsVUFBVXNFLFFBQVYsQ0FBbUJuSCxJQUFwQztBQUNELGFBRkQ7QUFHQUwseUNBQTZCK0csS0FBSzlHLFdBQWxDLEVBQStDLFVBQUNJLElBQUQsRUFBVTtBQUN2RDRHLHlCQUFXRixJQUFYLEVBQWlCMUcsSUFBakI7QUFDRCxhQUZEO0FBR0QsV0FQRCxpQ0FUSyxFQUFQOztBQWtCRCxLQXhjRCxpQkFwRWUsRUFBakIiLCJmaWxlIjoibm8tdW51c2VkLW1vZHVsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXcgRW5zdXJlcyB0aGF0IG1vZHVsZXMgY29udGFpbiBleHBvcnRzIGFuZC9vciBhbGxcbiAqIG1vZHVsZXMgYXJlIGNvbnN1bWVkIHdpdGhpbiBvdGhlciBtb2R1bGVzLlxuICogQGF1dGhvciBSZW7DqSBGZXJtYW5uXG4gKi9cblxuaW1wb3J0IEV4cG9ydHMsIHsgcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUgfSBmcm9tICcuLi9FeHBvcnRNYXAnO1xuaW1wb3J0IHsgZ2V0RmlsZUV4dGVuc2lvbnMgfSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2lnbm9yZSc7XG5pbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5pbXBvcnQgeyBkaXJuYW1lLCBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVhZFBrZ1VwIGZyb20gJ3JlYWQtcGtnLXVwJztcbmltcG9ydCB2YWx1ZXMgZnJvbSAnb2JqZWN0LnZhbHVlcyc7XG5pbXBvcnQgaW5jbHVkZXMgZnJvbSAnYXJyYXktaW5jbHVkZXMnO1xuXG4vLyBlc2xpbnQvbGliL3V0aWwvZ2xvYi11dGlsIGhhcyBiZWVuIG1vdmVkIHRvIGVzbGludC9saWIvdXRpbC9nbG9iLXV0aWxzIHdpdGggdmVyc2lvbiA1LjNcbi8vIGFuZCBoYXMgYmVlbiBtb3ZlZCB0byBlc2xpbnQvbGliL2NsaS1lbmdpbmUvZmlsZS1lbnVtZXJhdG9yIGluIHZlcnNpb24gNlxubGV0IGxpc3RGaWxlc1RvUHJvY2VzcztcbnRyeSB7XG4gIGNvbnN0IEZpbGVFbnVtZXJhdG9yID0gcmVxdWlyZSgnZXNsaW50L2xpYi9jbGktZW5naW5lL2ZpbGUtZW51bWVyYXRvcicpLkZpbGVFbnVtZXJhdG9yO1xuICBsaXN0RmlsZXNUb1Byb2Nlc3MgPSBmdW5jdGlvbiAoc3JjLCBleHRlbnNpb25zKSB7XG4gICAgY29uc3QgZSA9IG5ldyBGaWxlRW51bWVyYXRvcih7XG4gICAgICBleHRlbnNpb25zOiBleHRlbnNpb25zLFxuICAgIH0pO1xuICAgIHJldHVybiBBcnJheS5mcm9tKGUuaXRlcmF0ZUZpbGVzKHNyYyksICh7IGZpbGVQYXRoLCBpZ25vcmVkIH0pID0+ICh7XG4gICAgICBpZ25vcmVkLFxuICAgICAgZmlsZW5hbWU6IGZpbGVQYXRoLFxuICAgIH0pKTtcbiAgfTtcbn0gY2F0Y2ggKGUxKSB7XG4gIC8vIFByZXZlbnQgcGFzc2luZyBpbnZhbGlkIG9wdGlvbnMgKGV4dGVuc2lvbnMgYXJyYXkpIHRvIG9sZCB2ZXJzaW9ucyBvZiB0aGUgZnVuY3Rpb24uXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lc2xpbnQvZXNsaW50L2Jsb2IvdjUuMTYuMC9saWIvdXRpbC9nbG9iLXV0aWxzLmpzI0wxNzgtTDI4MFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZXNsaW50L2VzbGludC9ibG9iL3Y1LjIuMC9saWIvdXRpbC9nbG9iLXV0aWwuanMjTDE3NC1MMjY5XG4gIGxldCBvcmlnaW5hbExpc3RGaWxlc1RvUHJvY2VzcztcbiAgdHJ5IHtcbiAgICBvcmlnaW5hbExpc3RGaWxlc1RvUHJvY2VzcyA9IHJlcXVpcmUoJ2VzbGludC9saWIvdXRpbC9nbG9iLXV0aWxzJykubGlzdEZpbGVzVG9Qcm9jZXNzO1xuICAgIGxpc3RGaWxlc1RvUHJvY2VzcyA9IGZ1bmN0aW9uIChzcmMsIGV4dGVuc2lvbnMpIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbExpc3RGaWxlc1RvUHJvY2VzcyhzcmMsIHtcbiAgICAgICAgZXh0ZW5zaW9uczogZXh0ZW5zaW9ucyxcbiAgICAgIH0pO1xuICAgIH07XG4gIH0gY2F0Y2ggKGUyKSB7XG4gICAgb3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3MgPSByZXF1aXJlKCdlc2xpbnQvbGliL3V0aWwvZ2xvYi11dGlsJykubGlzdEZpbGVzVG9Qcm9jZXNzO1xuXG4gICAgbGlzdEZpbGVzVG9Qcm9jZXNzID0gZnVuY3Rpb24gKHNyYywgZXh0ZW5zaW9ucykge1xuICAgICAgY29uc3QgcGF0dGVybnMgPSBzcmMucmVkdWNlKChjYXJyeSwgcGF0dGVybikgPT4ge1xuICAgICAgICByZXR1cm4gY2FycnkuY29uY2F0KGV4dGVuc2lvbnMubWFwKChleHRlbnNpb24pID0+IHtcbiAgICAgICAgICByZXR1cm4gL1xcKlxcKnxcXCpcXC4vLnRlc3QocGF0dGVybikgPyBwYXR0ZXJuIDogYCR7cGF0dGVybn0vKiovKiR7ZXh0ZW5zaW9ufWA7XG4gICAgICAgIH0pKTtcbiAgICAgIH0sIHNyYy5zbGljZSgpKTtcblxuICAgICAgcmV0dXJuIG9yaWdpbmFsTGlzdEZpbGVzVG9Qcm9jZXNzKHBhdHRlcm5zKTtcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IEVYUE9SVF9ERUZBVUxUX0RFQ0xBUkFUSU9OID0gJ0V4cG9ydERlZmF1bHREZWNsYXJhdGlvbic7XG5jb25zdCBFWFBPUlRfTkFNRURfREVDTEFSQVRJT04gPSAnRXhwb3J0TmFtZWREZWNsYXJhdGlvbic7XG5jb25zdCBFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OID0gJ0V4cG9ydEFsbERlY2xhcmF0aW9uJztcbmNvbnN0IElNUE9SVF9ERUNMQVJBVElPTiA9ICdJbXBvcnREZWNsYXJhdGlvbic7XG5jb25zdCBJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiA9ICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInO1xuY29uc3QgSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSID0gJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInO1xuY29uc3QgVkFSSUFCTEVfREVDTEFSQVRJT04gPSAnVmFyaWFibGVEZWNsYXJhdGlvbic7XG5jb25zdCBGVU5DVElPTl9ERUNMQVJBVElPTiA9ICdGdW5jdGlvbkRlY2xhcmF0aW9uJztcbmNvbnN0IENMQVNTX0RFQ0xBUkFUSU9OID0gJ0NsYXNzRGVjbGFyYXRpb24nO1xuY29uc3QgSURFTlRJRklFUiA9ICdJZGVudGlmaWVyJztcbmNvbnN0IE9CSkVDVF9QQVRURVJOID0gJ09iamVjdFBhdHRlcm4nO1xuY29uc3QgVFNfSU5URVJGQUNFX0RFQ0xBUkFUSU9OID0gJ1RTSW50ZXJmYWNlRGVjbGFyYXRpb24nO1xuY29uc3QgVFNfVFlQRV9BTElBU19ERUNMQVJBVElPTiA9ICdUU1R5cGVBbGlhc0RlY2xhcmF0aW9uJztcbmNvbnN0IFRTX0VOVU1fREVDTEFSQVRJT04gPSAnVFNFbnVtRGVjbGFyYXRpb24nO1xuY29uc3QgREVGQVVMVCA9ICdkZWZhdWx0JztcblxuZnVuY3Rpb24gZm9yRWFjaERlY2xhcmF0aW9uSWRlbnRpZmllcihkZWNsYXJhdGlvbiwgY2IpIHtcbiAgaWYgKGRlY2xhcmF0aW9uKSB7XG4gICAgaWYgKFxuICAgICAgZGVjbGFyYXRpb24udHlwZSA9PT0gRlVOQ1RJT05fREVDTEFSQVRJT04gfHxcbiAgICAgIGRlY2xhcmF0aW9uLnR5cGUgPT09IENMQVNTX0RFQ0xBUkFUSU9OIHx8XG4gICAgICBkZWNsYXJhdGlvbi50eXBlID09PSBUU19JTlRFUkZBQ0VfREVDTEFSQVRJT04gfHxcbiAgICAgIGRlY2xhcmF0aW9uLnR5cGUgPT09IFRTX1RZUEVfQUxJQVNfREVDTEFSQVRJT04gfHxcbiAgICAgIGRlY2xhcmF0aW9uLnR5cGUgPT09IFRTX0VOVU1fREVDTEFSQVRJT05cbiAgICApIHtcbiAgICAgIGNiKGRlY2xhcmF0aW9uLmlkLm5hbWUpO1xuICAgIH0gZWxzZSBpZiAoZGVjbGFyYXRpb24udHlwZSA9PT0gVkFSSUFCTEVfREVDTEFSQVRJT04pIHtcbiAgICAgIGRlY2xhcmF0aW9uLmRlY2xhcmF0aW9ucy5mb3JFYWNoKCh7IGlkIH0pID0+IHtcbiAgICAgICAgaWYgKGlkLnR5cGUgPT09IE9CSkVDVF9QQVRURVJOKSB7XG4gICAgICAgICAgcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUoaWQsIChwYXR0ZXJuKSA9PiB7XG4gICAgICAgICAgICBpZiAocGF0dGVybi50eXBlID09PSBJREVOVElGSUVSKSB7XG4gICAgICAgICAgICAgIGNiKHBhdHRlcm4ubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2IoaWQubmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIExpc3Qgb2YgaW1wb3J0cyBwZXIgZmlsZS5cbiAqXG4gKiBSZXByZXNlbnRlZCBieSBhIHR3by1sZXZlbCBNYXAgdG8gYSBTZXQgb2YgaWRlbnRpZmllcnMuIFRoZSB1cHBlci1sZXZlbCBNYXBcbiAqIGtleXMgYXJlIHRoZSBwYXRocyB0byB0aGUgbW9kdWxlcyBjb250YWluaW5nIHRoZSBpbXBvcnRzLCB3aGlsZSB0aGVcbiAqIGxvd2VyLWxldmVsIE1hcCBrZXlzIGFyZSB0aGUgcGF0aHMgdG8gdGhlIGZpbGVzIHdoaWNoIGFyZSBiZWluZyBpbXBvcnRlZFxuICogZnJvbS4gTGFzdGx5LCB0aGUgU2V0IG9mIGlkZW50aWZpZXJzIGNvbnRhaW5zIGVpdGhlciBuYW1lcyBiZWluZyBpbXBvcnRlZFxuICogb3IgYSBzcGVjaWFsIEFTVCBub2RlIG5hbWUgbGlzdGVkIGFib3ZlIChlLmcgSW1wb3J0RGVmYXVsdFNwZWNpZmllcikuXG4gKlxuICogRm9yIGV4YW1wbGUsIGlmIHdlIGhhdmUgYSBmaWxlIG5hbWVkIGZvby5qcyBjb250YWluaW5nOlxuICpcbiAqICAgaW1wb3J0IHsgbzIgfSBmcm9tICcuL2Jhci5qcyc7XG4gKlxuICogVGhlbiB3ZSB3aWxsIGhhdmUgYSBzdHJ1Y3R1cmUgdGhhdCBsb29rcyBsaWtlOlxuICpcbiAqICAgTWFwIHsgJ2Zvby5qcycgPT4gTWFwIHsgJ2Jhci5qcycgPT4gU2V0IHsgJ28yJyB9IH0gfVxuICpcbiAqIEB0eXBlIHtNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLCBTZXQ8c3RyaW5nPj4+fVxuICovXG5jb25zdCBpbXBvcnRMaXN0ID0gbmV3IE1hcCgpO1xuXG4vKipcbiAqIExpc3Qgb2YgZXhwb3J0cyBwZXIgZmlsZS5cbiAqXG4gKiBSZXByZXNlbnRlZCBieSBhIHR3by1sZXZlbCBNYXAgdG8gYW4gb2JqZWN0IG9mIG1ldGFkYXRhLiBUaGUgdXBwZXItbGV2ZWwgTWFwXG4gKiBrZXlzIGFyZSB0aGUgcGF0aHMgdG8gdGhlIG1vZHVsZXMgY29udGFpbmluZyB0aGUgZXhwb3J0cywgd2hpbGUgdGhlXG4gKiBsb3dlci1sZXZlbCBNYXAga2V5cyBhcmUgdGhlIHNwZWNpZmljIGlkZW50aWZpZXJzIG9yIHNwZWNpYWwgQVNUIG5vZGUgbmFtZXNcbiAqIGJlaW5nIGV4cG9ydGVkLiBUaGUgbGVhZi1sZXZlbCBtZXRhZGF0YSBvYmplY3QgYXQgdGhlIG1vbWVudCBvbmx5IGNvbnRhaW5zIGFcbiAqIGB3aGVyZVVzZWRgIHByb3BlcnR5LCB3aGljaCBjb250YWlucyBhIFNldCBvZiBwYXRocyB0byBtb2R1bGVzIHRoYXQgaW1wb3J0XG4gKiB0aGUgbmFtZS5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgaWYgd2UgaGF2ZSBhIGZpbGUgbmFtZWQgYmFyLmpzIGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZyBleHBvcnRzOlxuICpcbiAqICAgY29uc3QgbzIgPSAnYmFyJztcbiAqICAgZXhwb3J0IHsgbzIgfTtcbiAqXG4gKiBBbmQgYSBmaWxlIG5hbWVkIGZvby5qcyBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgaW1wb3J0OlxuICpcbiAqICAgaW1wb3J0IHsgbzIgfSBmcm9tICcuL2Jhci5qcyc7XG4gKlxuICogVGhlbiB3ZSB3aWxsIGhhdmUgYSBzdHJ1Y3R1cmUgdGhhdCBsb29rcyBsaWtlOlxuICpcbiAqICAgTWFwIHsgJ2Jhci5qcycgPT4gTWFwIHsgJ28yJyA9PiB7IHdoZXJlVXNlZDogU2V0IHsgJ2Zvby5qcycgfSB9IH0gfVxuICpcbiAqIEB0eXBlIHtNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLCBvYmplY3Q+Pn1cbiAqL1xuY29uc3QgZXhwb3J0TGlzdCA9IG5ldyBNYXAoKTtcblxuY29uc3QgaWdub3JlZEZpbGVzID0gbmV3IFNldCgpO1xuY29uc3QgZmlsZXNPdXRzaWRlU3JjID0gbmV3IFNldCgpO1xuXG5jb25zdCBpc05vZGVNb2R1bGUgPSBwYXRoID0+IHtcbiAgcmV0dXJuIC9cXC8obm9kZV9tb2R1bGVzKVxcLy8udGVzdChwYXRoKTtcbn07XG5cbi8qKlxuICogcmVhZCBhbGwgZmlsZXMgbWF0Y2hpbmcgdGhlIHBhdHRlcm5zIGluIHNyYyBhbmQgaWdub3JlRXhwb3J0c1xuICpcbiAqIHJldHVybiBhbGwgZmlsZXMgbWF0Y2hpbmcgc3JjIHBhdHRlcm4sIHdoaWNoIGFyZSBub3QgbWF0Y2hpbmcgdGhlIGlnbm9yZUV4cG9ydHMgcGF0dGVyblxuICovXG5jb25zdCByZXNvbHZlRmlsZXMgPSAoc3JjLCBpZ25vcmVFeHBvcnRzLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IGV4dGVuc2lvbnMgPSBBcnJheS5mcm9tKGdldEZpbGVFeHRlbnNpb25zKGNvbnRleHQuc2V0dGluZ3MpKTtcblxuICBjb25zdCBzcmNGaWxlcyA9IG5ldyBTZXQoKTtcbiAgY29uc3Qgc3JjRmlsZUxpc3QgPSBsaXN0RmlsZXNUb1Byb2Nlc3Moc3JjLCBleHRlbnNpb25zKTtcblxuICAvLyBwcmVwYXJlIGxpc3Qgb2YgaWdub3JlZCBmaWxlc1xuICBjb25zdCBpZ25vcmVkRmlsZXNMaXN0ID0gIGxpc3RGaWxlc1RvUHJvY2VzcyhpZ25vcmVFeHBvcnRzLCBleHRlbnNpb25zKTtcbiAgaWdub3JlZEZpbGVzTGlzdC5mb3JFYWNoKCh7IGZpbGVuYW1lIH0pID0+IGlnbm9yZWRGaWxlcy5hZGQoZmlsZW5hbWUpKTtcblxuICAvLyBwcmVwYXJlIGxpc3Qgb2Ygc291cmNlIGZpbGVzLCBkb24ndCBjb25zaWRlciBmaWxlcyBmcm9tIG5vZGVfbW9kdWxlc1xuICBzcmNGaWxlTGlzdC5maWx0ZXIoKHsgZmlsZW5hbWUgfSkgPT4gIWlzTm9kZU1vZHVsZShmaWxlbmFtZSkpLmZvckVhY2goKHsgZmlsZW5hbWUgfSkgPT4ge1xuICAgIHNyY0ZpbGVzLmFkZChmaWxlbmFtZSk7XG4gIH0pO1xuICByZXR1cm4gc3JjRmlsZXM7XG59O1xuXG4vKipcbiAqIHBhcnNlIGFsbCBzb3VyY2UgZmlsZXMgYW5kIGJ1aWxkIHVwIDIgbWFwcyBjb250YWluaW5nIHRoZSBleGlzdGluZyBpbXBvcnRzIGFuZCBleHBvcnRzXG4gKi9cbmNvbnN0IHByZXBhcmVJbXBvcnRzQW5kRXhwb3J0cyA9IChzcmNGaWxlcywgY29udGV4dCkgPT4ge1xuICBjb25zdCBleHBvcnRBbGwgPSBuZXcgTWFwKCk7XG4gIHNyY0ZpbGVzLmZvckVhY2goZmlsZSA9PiB7XG4gICAgY29uc3QgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBpbXBvcnRzID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGN1cnJlbnRFeHBvcnRzID0gRXhwb3J0cy5nZXQoZmlsZSwgY29udGV4dCk7XG4gICAgaWYgKGN1cnJlbnRFeHBvcnRzKSB7XG4gICAgICBjb25zdCB7IGRlcGVuZGVuY2llcywgcmVleHBvcnRzLCBpbXBvcnRzOiBsb2NhbEltcG9ydExpc3QsIG5hbWVzcGFjZSAgfSA9IGN1cnJlbnRFeHBvcnRzO1xuXG4gICAgICAvLyBkZXBlbmRlbmNpZXMgPT09IGV4cG9ydCAqIGZyb21cbiAgICAgIGNvbnN0IGN1cnJlbnRFeHBvcnRBbGwgPSBuZXcgU2V0KCk7XG4gICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaChnZXREZXBlbmRlbmN5ID0+IHtcbiAgICAgICAgY29uc3QgZGVwZW5kZW5jeSA9IGdldERlcGVuZGVuY3koKTtcbiAgICAgICAgaWYgKGRlcGVuZGVuY3kgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RXhwb3J0QWxsLmFkZChkZXBlbmRlbmN5LnBhdGgpO1xuICAgICAgfSk7XG4gICAgICBleHBvcnRBbGwuc2V0KGZpbGUsIGN1cnJlbnRFeHBvcnRBbGwpO1xuXG4gICAgICByZWV4cG9ydHMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSBERUZBVUxUKSB7XG4gICAgICAgICAgZXhwb3J0cy5zZXQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSLCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cG9ydHMuc2V0KGtleSwgeyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWV4cG9ydCA9ICB2YWx1ZS5nZXRJbXBvcnQoKTtcbiAgICAgICAgaWYgKCFyZWV4cG9ydCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbG9jYWxJbXBvcnQgPSBpbXBvcnRzLmdldChyZWV4cG9ydC5wYXRoKTtcbiAgICAgICAgbGV0IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlLmxvY2FsID09PSBERUZBVUxUKSB7XG4gICAgICAgICAgY3VycmVudFZhbHVlID0gSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IHZhbHVlLmxvY2FsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbG9jYWxJbXBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgbG9jYWxJbXBvcnQgPSBuZXcgU2V0KFsuLi5sb2NhbEltcG9ydCwgY3VycmVudFZhbHVlXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxJbXBvcnQgPSBuZXcgU2V0KFtjdXJyZW50VmFsdWVdKTtcbiAgICAgICAgfVxuICAgICAgICBpbXBvcnRzLnNldChyZWV4cG9ydC5wYXRoLCBsb2NhbEltcG9ydCk7XG4gICAgICB9KTtcblxuICAgICAgbG9jYWxJbXBvcnRMaXN0LmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKGlzTm9kZU1vZHVsZShrZXkpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxvY2FsSW1wb3J0ID0gaW1wb3J0cy5nZXQoa2V5KSB8fCBuZXcgU2V0KCk7XG4gICAgICAgIHZhbHVlLmRlY2xhcmF0aW9ucy5mb3JFYWNoKCh7IGltcG9ydGVkU3BlY2lmaWVycyB9KSA9PlxuICAgICAgICAgIGltcG9ydGVkU3BlY2lmaWVycy5mb3JFYWNoKHNwZWNpZmllciA9PiBsb2NhbEltcG9ydC5hZGQoc3BlY2lmaWVyKSlcbiAgICAgICAgKTtcbiAgICAgICAgaW1wb3J0cy5zZXQoa2V5LCBsb2NhbEltcG9ydCk7XG4gICAgICB9KTtcbiAgICAgIGltcG9ydExpc3Quc2V0KGZpbGUsIGltcG9ydHMpO1xuXG4gICAgICAvLyBidWlsZCB1cCBleHBvcnQgbGlzdCBvbmx5LCBpZiBmaWxlIGlzIG5vdCBpZ25vcmVkXG4gICAgICBpZiAoaWdub3JlZEZpbGVzLmhhcyhmaWxlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBuYW1lc3BhY2UuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSBERUZBVUxUKSB7XG4gICAgICAgICAgZXhwb3J0cy5zZXQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSLCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cG9ydHMuc2V0KGtleSwgeyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGV4cG9ydHMuc2V0KEVYUE9SVF9BTExfREVDTEFSQVRJT04sIHsgd2hlcmVVc2VkOiBuZXcgU2V0KCkgfSk7XG4gICAgZXhwb3J0cy5zZXQoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIsIHsgd2hlcmVVc2VkOiBuZXcgU2V0KCkgfSk7XG4gICAgZXhwb3J0TGlzdC5zZXQoZmlsZSwgZXhwb3J0cyk7XG4gIH0pO1xuICBleHBvcnRBbGwuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgIHZhbHVlLmZvckVhY2godmFsID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRFeHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRFeHBvcnQgPSBjdXJyZW50RXhwb3J0cy5nZXQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoa2V5KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIHRyYXZlcnNlIHRocm91Z2ggYWxsIGltcG9ydHMgYW5kIGFkZCB0aGUgcmVzcGVjdGl2ZSBwYXRoIHRvIHRoZSB3aGVyZVVzZWQtbGlzdFxuICogb2YgdGhlIGNvcnJlc3BvbmRpbmcgZXhwb3J0XG4gKi9cbmNvbnN0IGRldGVybWluZVVzYWdlID0gKCkgPT4ge1xuICBpbXBvcnRMaXN0LmZvckVhY2goKGxpc3RWYWx1ZSwgbGlzdEtleSkgPT4ge1xuICAgIGxpc3RWYWx1ZS5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICBjb25zdCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQoa2V5KTtcbiAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFsdWUuZm9yRWFjaChjdXJyZW50SW1wb3J0ID0+IHtcbiAgICAgICAgICBsZXQgc3BlY2lmaWVyO1xuICAgICAgICAgIGlmIChjdXJyZW50SW1wb3J0ID09PSBJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUikge1xuICAgICAgICAgICAgc3BlY2lmaWVyID0gSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVI7XG4gICAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50SW1wb3J0ID09PSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpIHtcbiAgICAgICAgICAgIHNwZWNpZmllciA9IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3BlY2lmaWVyID0gY3VycmVudEltcG9ydDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiBzcGVjaWZpZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCBleHBvcnRTdGF0ZW1lbnQgPSBleHBvcnRzLmdldChzcGVjaWZpZXIpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRTdGF0ZW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHsgd2hlcmVVc2VkIH0gPSBleHBvcnRTdGF0ZW1lbnQ7XG4gICAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQobGlzdEtleSk7XG4gICAgICAgICAgICAgIGV4cG9ydHMuc2V0KHNwZWNpZmllciwgeyB3aGVyZVVzZWQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG5jb25zdCBnZXRTcmMgPSBzcmMgPT4ge1xuICBpZiAoc3JjKSB7XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuICByZXR1cm4gW3Byb2Nlc3MuY3dkKCldO1xufTtcblxuLyoqXG4gKiBwcmVwYXJlIHRoZSBsaXN0cyBvZiBleGlzdGluZyBpbXBvcnRzIGFuZCBleHBvcnRzIC0gc2hvdWxkIG9ubHkgYmUgZXhlY3V0ZWQgb25jZSBhdFxuICogdGhlIHN0YXJ0IG9mIGEgbmV3IGVzbGludCBydW5cbiAqL1xubGV0IHNyY0ZpbGVzO1xubGV0IGxhc3RQcmVwYXJlS2V5O1xuY29uc3QgZG9QcmVwYXJhdGlvbiA9IChzcmMsIGlnbm9yZUV4cG9ydHMsIGNvbnRleHQpID0+IHtcbiAgY29uc3QgcHJlcGFyZUtleSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICBzcmM6IChzcmMgfHwgW10pLnNvcnQoKSxcbiAgICBpZ25vcmVFeHBvcnRzOiAoaWdub3JlRXhwb3J0cyB8fCBbXSkuc29ydCgpLFxuICAgIGV4dGVuc2lvbnM6IEFycmF5LmZyb20oZ2V0RmlsZUV4dGVuc2lvbnMoY29udGV4dC5zZXR0aW5ncykpLnNvcnQoKSxcbiAgfSk7XG4gIGlmIChwcmVwYXJlS2V5ID09PSBsYXN0UHJlcGFyZUtleSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGltcG9ydExpc3QuY2xlYXIoKTtcbiAgZXhwb3J0TGlzdC5jbGVhcigpO1xuICBpZ25vcmVkRmlsZXMuY2xlYXIoKTtcbiAgZmlsZXNPdXRzaWRlU3JjLmNsZWFyKCk7XG5cbiAgc3JjRmlsZXMgPSByZXNvbHZlRmlsZXMoZ2V0U3JjKHNyYyksIGlnbm9yZUV4cG9ydHMsIGNvbnRleHQpO1xuICBwcmVwYXJlSW1wb3J0c0FuZEV4cG9ydHMoc3JjRmlsZXMsIGNvbnRleHQpO1xuICBkZXRlcm1pbmVVc2FnZSgpO1xuICBsYXN0UHJlcGFyZUtleSA9IHByZXBhcmVLZXk7XG59O1xuXG5jb25zdCBuZXdOYW1lc3BhY2VJbXBvcnRFeGlzdHMgPSBzcGVjaWZpZXJzID0+XG4gIHNwZWNpZmllcnMuc29tZSgoeyB0eXBlIH0pID0+IHR5cGUgPT09IElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcblxuY29uc3QgbmV3RGVmYXVsdEltcG9ydEV4aXN0cyA9IHNwZWNpZmllcnMgPT5cbiAgc3BlY2lmaWVycy5zb21lKCh7IHR5cGUgfSkgPT4gdHlwZSA9PT0gSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKTtcblxuY29uc3QgZmlsZUlzSW5Qa2cgPSBmaWxlID0+IHtcbiAgY29uc3QgeyBwYXRoLCBwa2cgfSA9IHJlYWRQa2dVcC5zeW5jKHsgY3dkOiBmaWxlLCBub3JtYWxpemU6IGZhbHNlIH0pO1xuICBjb25zdCBiYXNlUGF0aCA9IGRpcm5hbWUocGF0aCk7XG5cbiAgY29uc3QgY2hlY2tQa2dGaWVsZFN0cmluZyA9IHBrZ0ZpZWxkID0+IHtcbiAgICBpZiAoam9pbihiYXNlUGF0aCwgcGtnRmllbGQpID09PSBmaWxlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgY2hlY2tQa2dGaWVsZE9iamVjdCA9IHBrZ0ZpZWxkID0+IHtcbiAgICBjb25zdCBwa2dGaWVsZEZpbGVzID0gdmFsdWVzKHBrZ0ZpZWxkKS5tYXAodmFsdWUgPT4gam9pbihiYXNlUGF0aCwgdmFsdWUpKTtcbiAgICBpZiAoaW5jbHVkZXMocGtnRmllbGRGaWxlcywgZmlsZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBjaGVja1BrZ0ZpZWxkID0gcGtnRmllbGQgPT4ge1xuICAgIGlmICh0eXBlb2YgcGtnRmllbGQgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gY2hlY2tQa2dGaWVsZFN0cmluZyhwa2dGaWVsZCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwa2dGaWVsZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBjaGVja1BrZ0ZpZWxkT2JqZWN0KHBrZ0ZpZWxkKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHBrZy5wcml2YXRlID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHBrZy5iaW4pIHtcbiAgICBpZiAoY2hlY2tQa2dGaWVsZChwa2cuYmluKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKHBrZy5icm93c2VyKSB7XG4gICAgaWYgKGNoZWNrUGtnRmllbGQocGtnLmJyb3dzZXIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAocGtnLm1haW4pIHtcbiAgICBpZiAoY2hlY2tQa2dGaWVsZFN0cmluZyhwa2cubWFpbikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHsgdXJsOiBkb2NzVXJsKCduby11bnVzZWQtbW9kdWxlcycpIH0sXG4gICAgc2NoZW1hOiBbe1xuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBzcmM6IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2ZpbGVzL3BhdGhzIHRvIGJlIGFuYWx5emVkIChvbmx5IGZvciB1bnVzZWQgZXhwb3J0cyknLFxuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgbWluSXRlbXM6IDEsXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgbWluTGVuZ3RoOiAxLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGlnbm9yZUV4cG9ydHM6IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICdmaWxlcy9wYXRocyBmb3Igd2hpY2ggdW51c2VkIGV4cG9ydHMgd2lsbCBub3QgYmUgcmVwb3J0ZWQgKGUuZyBtb2R1bGUgZW50cnkgcG9pbnRzKScsXG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBtaW5JdGVtczogMSxcbiAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICBtaW5MZW5ndGg6IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgbWlzc2luZ0V4cG9ydHM6IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ3JlcG9ydCBtb2R1bGVzIHdpdGhvdXQgYW55IGV4cG9ydHMnLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgfSxcbiAgICAgICAgdW51c2VkRXhwb3J0czoge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAncmVwb3J0IGV4cG9ydHMgd2l0aG91dCBhbnkgdXNhZ2UnLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBub3Q6IHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHVudXNlZEV4cG9ydHM6IHsgZW51bTogW2ZhbHNlXSB9LFxuICAgICAgICAgIG1pc3NpbmdFeHBvcnRzOiB7IGVudW06IFtmYWxzZV0gfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBhbnlPZjpbe1xuICAgICAgICBub3Q6IHtcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICB1bnVzZWRFeHBvcnRzOiB7IGVudW06IFt0cnVlXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVkOiBbJ21pc3NpbmdFeHBvcnRzJ10sXG4gICAgICB9LCB7XG4gICAgICAgIG5vdDoge1xuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIG1pc3NpbmdFeHBvcnRzOiB7IGVudW06IFt0cnVlXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVkOiBbJ3VudXNlZEV4cG9ydHMnXSxcbiAgICAgIH0sIHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHVudXNlZEV4cG9ydHM6IHsgZW51bTogW3RydWVdIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVkOiBbJ3VudXNlZEV4cG9ydHMnXSxcbiAgICAgIH0sIHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIG1pc3NpbmdFeHBvcnRzOiB7IGVudW06IFt0cnVlXSB9LFxuICAgICAgICB9LFxuICAgICAgICByZXF1aXJlZDogWydtaXNzaW5nRXhwb3J0cyddLFxuICAgICAgfV0sXG4gICAgfV0sXG4gIH0sXG5cbiAgY3JlYXRlOiBjb250ZXh0ID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBzcmMsXG4gICAgICBpZ25vcmVFeHBvcnRzID0gW10sXG4gICAgICBtaXNzaW5nRXhwb3J0cyxcbiAgICAgIHVudXNlZEV4cG9ydHMsXG4gICAgfSA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcblxuICAgIGlmICh1bnVzZWRFeHBvcnRzKSB7XG4gICAgICBkb1ByZXBhcmF0aW9uKHNyYywgaWdub3JlRXhwb3J0cywgY29udGV4dCk7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZSA9IGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSA/IGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSgpIDogY29udGV4dC5nZXRGaWxlbmFtZSgpO1xuXG4gICAgY29uc3QgY2hlY2tFeHBvcnRQcmVzZW5jZSA9IG5vZGUgPT4ge1xuICAgICAgaWYgKCFtaXNzaW5nRXhwb3J0cykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChpZ25vcmVkRmlsZXMuaGFzKGZpbGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXhwb3J0Q291bnQgPSBleHBvcnRMaXN0LmdldChmaWxlKTtcbiAgICAgIGNvbnN0IGV4cG9ydEFsbCA9IGV4cG9ydENvdW50LmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgIGNvbnN0IG5hbWVzcGFjZUltcG9ydHMgPSBleHBvcnRDb3VudC5nZXQoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuXG4gICAgICBleHBvcnRDb3VudC5kZWxldGUoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICBleHBvcnRDb3VudC5kZWxldGUoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuICAgICAgaWYgKGV4cG9ydENvdW50LnNpemUgPCAxKSB7XG4gICAgICAgIC8vIG5vZGUuYm9keVswXSA9PT0gJ3VuZGVmaW5lZCcgb25seSBoYXBwZW5zLCBpZiBldmVyeXRoaW5nIGlzIGNvbW1lbnRlZCBvdXQgaW4gdGhlIGZpbGVcbiAgICAgICAgLy8gYmVpbmcgbGludGVkXG4gICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUuYm9keVswXSA/IG5vZGUuYm9keVswXSA6IG5vZGUsICdObyBleHBvcnRzIGZvdW5kJyk7XG4gICAgICB9XG4gICAgICBleHBvcnRDb3VudC5zZXQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTiwgZXhwb3J0QWxsKTtcbiAgICAgIGV4cG9ydENvdW50LnNldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiwgbmFtZXNwYWNlSW1wb3J0cyk7XG4gICAgfTtcblxuICAgIGNvbnN0IGNoZWNrVXNhZ2UgPSAobm9kZSwgZXhwb3J0ZWRWYWx1ZSkgPT4ge1xuICAgICAgaWYgKCF1bnVzZWRFeHBvcnRzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGlnbm9yZWRGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlsZUlzSW5Qa2coZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlsZXNPdXRzaWRlU3JjLmhhcyhmaWxlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIG1ha2Ugc3VyZSBmaWxlIHRvIGJlIGxpbnRlZCBpcyBpbmNsdWRlZCBpbiBzb3VyY2UgZmlsZXNcbiAgICAgIGlmICghc3JjRmlsZXMuaGFzKGZpbGUpKSB7XG4gICAgICAgIHNyY0ZpbGVzID0gcmVzb2x2ZUZpbGVzKGdldFNyYyhzcmMpLCBpZ25vcmVFeHBvcnRzLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKCFzcmNGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgICBmaWxlc091dHNpZGVTcmMuYWRkKGZpbGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQoZmlsZSk7XG5cbiAgICAgIC8vIHNwZWNpYWwgY2FzZTogZXhwb3J0ICogZnJvbVxuICAgICAgY29uc3QgZXhwb3J0QWxsID0gZXhwb3J0cy5nZXQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICBpZiAodHlwZW9mIGV4cG9ydEFsbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZXhwb3J0ZWRWYWx1ZSAhPT0gSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKSB7XG4gICAgICAgIGlmIChleHBvcnRBbGwud2hlcmVVc2VkLnNpemUgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHNwZWNpYWwgY2FzZTogbmFtZXNwYWNlIGltcG9ydFxuICAgICAgY29uc3QgbmFtZXNwYWNlSW1wb3J0cyA9IGV4cG9ydHMuZ2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcbiAgICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlSW1wb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaWYgKG5hbWVzcGFjZUltcG9ydHMud2hlcmVVc2VkLnNpemUgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGV4cG9ydHNMaXN0IHdpbGwgYWx3YXlzIG1hcCBhbnkgaW1wb3J0ZWQgdmFsdWUgb2YgJ2RlZmF1bHQnIHRvICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJ1xuICAgICAgY29uc3QgZXhwb3J0c0tleSA9IGV4cG9ydGVkVmFsdWUgPT09IERFRkFVTFQgPyBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIgOiBleHBvcnRlZFZhbHVlO1xuXG4gICAgICBjb25zdCBleHBvcnRTdGF0ZW1lbnQgPSBleHBvcnRzLmdldChleHBvcnRzS2V5KTtcblxuICAgICAgY29uc3QgdmFsdWUgPSBleHBvcnRzS2V5ID09PSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIgPyBERUZBVUxUIDogZXhwb3J0c0tleTtcblxuICAgICAgaWYgKHR5cGVvZiBleHBvcnRTdGF0ZW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmIChleHBvcnRTdGF0ZW1lbnQud2hlcmVVc2VkLnNpemUgPCAxKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgYGV4cG9ydGVkIGRlY2xhcmF0aW9uICcke3ZhbHVlfScgbm90IHVzZWQgd2l0aGluIG90aGVyIG1vZHVsZXNgXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBgZXhwb3J0ZWQgZGVjbGFyYXRpb24gJyR7dmFsdWV9JyBub3QgdXNlZCB3aXRoaW4gb3RoZXIgbW9kdWxlc2BcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogb25seSB1c2VmdWwgZm9yIHRvb2xzIGxpa2UgdnNjb2RlLWVzbGludFxuICAgICAqXG4gICAgICogdXBkYXRlIGxpc3RzIG9mIGV4aXN0aW5nIGV4cG9ydHMgZHVyaW5nIHJ1bnRpbWVcbiAgICAgKi9cbiAgICBjb25zdCB1cGRhdGVFeHBvcnRVc2FnZSA9IG5vZGUgPT4ge1xuICAgICAgaWYgKGlnbm9yZWRGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KGZpbGUpO1xuXG4gICAgICAvLyBuZXcgbW9kdWxlIGhhcyBiZWVuIGNyZWF0ZWQgZHVyaW5nIHJ1bnRpbWVcbiAgICAgIC8vIGluY2x1ZGUgaXQgaW4gZnVydGhlciBwcm9jZXNzaW5nXG4gICAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGV4cG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5ld0V4cG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgICBjb25zdCBuZXdFeHBvcnRJZGVudGlmaWVycyA9IG5ldyBTZXQoKTtcblxuICAgICAgbm9kZS5ib2R5LmZvckVhY2goKHsgdHlwZSwgZGVjbGFyYXRpb24sIHNwZWNpZmllcnMgfSkgPT4ge1xuICAgICAgICBpZiAodHlwZSA9PT0gRVhQT1JUX0RFRkFVTFRfREVDTEFSQVRJT04pIHtcbiAgICAgICAgICBuZXdFeHBvcnRJZGVudGlmaWVycy5hZGQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSA9PT0gRVhQT1JUX05BTUVEX0RFQ0xBUkFUSU9OKSB7XG4gICAgICAgICAgaWYgKHNwZWNpZmllcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc3BlY2lmaWVycy5mb3JFYWNoKHNwZWNpZmllciA9PiB7XG4gICAgICAgICAgICAgIGlmIChzcGVjaWZpZXIuZXhwb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICBuZXdFeHBvcnRJZGVudGlmaWVycy5hZGQoc3BlY2lmaWVyLmV4cG9ydGVkLm5hbWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yRWFjaERlY2xhcmF0aW9uSWRlbnRpZmllcihkZWNsYXJhdGlvbiwgKG5hbWUpID0+IHtcbiAgICAgICAgICAgIG5ld0V4cG9ydElkZW50aWZpZXJzLmFkZChuYW1lKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIG9sZCBleHBvcnRzIGV4aXN0IHdpdGhpbiBsaXN0IG9mIG5ldyBleHBvcnRzIGlkZW50aWZpZXJzOiBhZGQgdG8gbWFwIG9mIG5ldyBleHBvcnRzXG4gICAgICBleHBvcnRzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKG5ld0V4cG9ydElkZW50aWZpZXJzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgbmV3RXhwb3J0cy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBuZXcgZXhwb3J0IGlkZW50aWZpZXJzIGFkZGVkOiBhZGQgdG8gbWFwIG9mIG5ldyBleHBvcnRzXG4gICAgICBuZXdFeHBvcnRJZGVudGlmaWVycy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGlmICghZXhwb3J0cy5oYXMoa2V5KSkge1xuICAgICAgICAgIG5ld0V4cG9ydHMuc2V0KGtleSwgeyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIHByZXNlcnZlIGluZm9ybWF0aW9uIGFib3V0IG5hbWVzcGFjZSBpbXBvcnRzXG4gICAgICBjb25zdCBleHBvcnRBbGwgPSBleHBvcnRzLmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgIGxldCBuYW1lc3BhY2VJbXBvcnRzID0gZXhwb3J0cy5nZXQoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuXG4gICAgICBpZiAodHlwZW9mIG5hbWVzcGFjZUltcG9ydHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG5hbWVzcGFjZUltcG9ydHMgPSB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH07XG4gICAgICB9XG5cbiAgICAgIG5ld0V4cG9ydHMuc2V0KEVYUE9SVF9BTExfREVDTEFSQVRJT04sIGV4cG9ydEFsbCk7XG4gICAgICBuZXdFeHBvcnRzLnNldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiwgbmFtZXNwYWNlSW1wb3J0cyk7XG4gICAgICBleHBvcnRMaXN0LnNldChmaWxlLCBuZXdFeHBvcnRzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogb25seSB1c2VmdWwgZm9yIHRvb2xzIGxpa2UgdnNjb2RlLWVzbGludFxuICAgICAqXG4gICAgICogdXBkYXRlIGxpc3RzIG9mIGV4aXN0aW5nIGltcG9ydHMgZHVyaW5nIHJ1bnRpbWVcbiAgICAgKi9cbiAgICBjb25zdCB1cGRhdGVJbXBvcnRVc2FnZSA9IG5vZGUgPT4ge1xuICAgICAgaWYgKCF1bnVzZWRFeHBvcnRzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IG9sZEltcG9ydFBhdGhzID0gaW1wb3J0TGlzdC5nZXQoZmlsZSk7XG4gICAgICBpZiAodHlwZW9mIG9sZEltcG9ydFBhdGhzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBvbGRJbXBvcnRQYXRocyA9IG5ldyBNYXAoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb2xkTmFtZXNwYWNlSW1wb3J0cyA9IG5ldyBTZXQoKTtcbiAgICAgIGNvbnN0IG5ld05hbWVzcGFjZUltcG9ydHMgPSBuZXcgU2V0KCk7XG5cbiAgICAgIGNvbnN0IG9sZEV4cG9ydEFsbCA9IG5ldyBTZXQoKTtcbiAgICAgIGNvbnN0IG5ld0V4cG9ydEFsbCA9IG5ldyBTZXQoKTtcblxuICAgICAgY29uc3Qgb2xkRGVmYXVsdEltcG9ydHMgPSBuZXcgU2V0KCk7XG4gICAgICBjb25zdCBuZXdEZWZhdWx0SW1wb3J0cyA9IG5ldyBTZXQoKTtcblxuICAgICAgY29uc3Qgb2xkSW1wb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgIGNvbnN0IG5ld0ltcG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgICBvbGRJbXBvcnRQYXRocy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZS5oYXMoRVhQT1JUX0FMTF9ERUNMQVJBVElPTikpIHtcbiAgICAgICAgICBvbGRFeHBvcnRBbGwuYWRkKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlLmhhcyhJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUikpIHtcbiAgICAgICAgICBvbGROYW1lc3BhY2VJbXBvcnRzLmFkZChrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZS5oYXMoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKSkge1xuICAgICAgICAgIG9sZERlZmF1bHRJbXBvcnRzLmFkZChrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlLmZvckVhY2godmFsID0+IHtcbiAgICAgICAgICBpZiAodmFsICE9PSBJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiAmJlxuICAgICAgICAgICAgICB2YWwgIT09IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUikge1xuICAgICAgICAgICAgb2xkSW1wb3J0cy5zZXQodmFsLCBrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgbm9kZS5ib2R5LmZvckVhY2goYXN0Tm9kZSA9PiB7XG4gICAgICAgIGxldCByZXNvbHZlZFBhdGg7XG5cbiAgICAgICAgLy8gc3VwcG9ydCBmb3IgZXhwb3J0IHsgdmFsdWUgfSBmcm9tICdtb2R1bGUnXG4gICAgICAgIGlmIChhc3ROb2RlLnR5cGUgPT09IEVYUE9SVF9OQU1FRF9ERUNMQVJBVElPTikge1xuICAgICAgICAgIGlmIChhc3ROb2RlLnNvdXJjZSkge1xuICAgICAgICAgICAgcmVzb2x2ZWRQYXRoID0gcmVzb2x2ZShhc3ROb2RlLnNvdXJjZS5yYXcucmVwbGFjZSgvKCd8XCIpL2csICcnKSwgY29udGV4dCk7XG4gICAgICAgICAgICBhc3ROb2RlLnNwZWNpZmllcnMuZm9yRWFjaChzcGVjaWZpZXIgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc3BlY2lmaWVyLmxvY2FsLm5hbWU7XG4gICAgICAgICAgICAgIGlmIChzcGVjaWZpZXIubG9jYWwubmFtZSA9PT0gREVGQVVMVCkge1xuICAgICAgICAgICAgICAgIG5ld0RlZmF1bHRJbXBvcnRzLmFkZChyZXNvbHZlZFBhdGgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0ltcG9ydHMuc2V0KG5hbWUsIHJlc29sdmVkUGF0aCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhc3ROb2RlLnR5cGUgPT09IEVYUE9SVF9BTExfREVDTEFSQVRJT04pIHtcbiAgICAgICAgICByZXNvbHZlZFBhdGggPSByZXNvbHZlKGFzdE5vZGUuc291cmNlLnJhdy5yZXBsYWNlKC8oJ3xcIikvZywgJycpLCBjb250ZXh0KTtcbiAgICAgICAgICBuZXdFeHBvcnRBbGwuYWRkKHJlc29sdmVkUGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXN0Tm9kZS50eXBlID09PSBJTVBPUlRfREVDTEFSQVRJT04pIHtcbiAgICAgICAgICByZXNvbHZlZFBhdGggPSByZXNvbHZlKGFzdE5vZGUuc291cmNlLnJhdy5yZXBsYWNlKC8oJ3xcIikvZywgJycpLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoIXJlc29sdmVkUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc05vZGVNb2R1bGUocmVzb2x2ZWRQYXRoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChuZXdOYW1lc3BhY2VJbXBvcnRFeGlzdHMoYXN0Tm9kZS5zcGVjaWZpZXJzKSkge1xuICAgICAgICAgICAgbmV3TmFtZXNwYWNlSW1wb3J0cy5hZGQocmVzb2x2ZWRQYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobmV3RGVmYXVsdEltcG9ydEV4aXN0cyhhc3ROb2RlLnNwZWNpZmllcnMpKSB7XG4gICAgICAgICAgICBuZXdEZWZhdWx0SW1wb3J0cy5hZGQocmVzb2x2ZWRQYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhc3ROb2RlLnNwZWNpZmllcnMuZm9yRWFjaChzcGVjaWZpZXIgPT4ge1xuICAgICAgICAgICAgaWYgKHNwZWNpZmllci50eXBlID09PSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIgfHxcbiAgICAgICAgICAgICAgICBzcGVjaWZpZXIudHlwZSA9PT0gSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3SW1wb3J0cy5zZXQoc3BlY2lmaWVyLmltcG9ydGVkLm5hbWUsIHJlc29sdmVkUGF0aCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBuZXdFeHBvcnRBbGwuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghb2xkRXhwb3J0QWxsLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBsZXQgaW1wb3J0cyA9IG9sZEltcG9ydFBhdGhzLmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBpbXBvcnRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaW1wb3J0cyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW1wb3J0cy5hZGQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICAgICAgb2xkSW1wb3J0UGF0aHMuc2V0KHZhbHVlLCBpbXBvcnRzKTtcblxuICAgICAgICAgIGxldCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGxldCBjdXJyZW50RXhwb3J0O1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGV4cG9ydExpc3Quc2V0KHZhbHVlLCBleHBvcnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdoZXJlVXNlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgICBleHBvcnRzLnNldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OLCB7IHdoZXJlVXNlZCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBvbGRFeHBvcnRBbGwuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghbmV3RXhwb3J0QWxsLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpbXBvcnRzLmRlbGV0ZShFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcblxuICAgICAgICAgIGNvbnN0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEV4cG9ydCA9IGV4cG9ydHMuZ2V0KEVYUE9SVF9BTExfREVDTEFSQVRJT04pO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50RXhwb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5kZWxldGUoZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbmV3RGVmYXVsdEltcG9ydHMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghb2xkRGVmYXVsdEltcG9ydHMuaGFzKHZhbHVlKSkge1xuICAgICAgICAgIGxldCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGltcG9ydHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpbXBvcnRzID0gbmV3IFNldCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbXBvcnRzLmFkZChJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuICAgICAgICAgIG9sZEltcG9ydFBhdGhzLnNldCh2YWx1ZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgICBsZXQgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBsZXQgY3VycmVudEV4cG9ydDtcbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0ID0gZXhwb3J0cy5nZXQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGV4cG9ydExpc3Quc2V0KHZhbHVlLCBleHBvcnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdoZXJlVXNlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgICBleHBvcnRzLnNldChJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIsIHsgd2hlcmVVc2VkIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG9sZERlZmF1bHRJbXBvcnRzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICBpZiAoIW5ld0RlZmF1bHRJbXBvcnRzLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpbXBvcnRzLmRlbGV0ZShJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuXG4gICAgICAgICAgY29uc3QgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RXhwb3J0ID0gZXhwb3J0cy5nZXQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudEV4cG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgY3VycmVudEV4cG9ydC53aGVyZVVzZWQuZGVsZXRlKGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG5ld05hbWVzcGFjZUltcG9ydHMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghb2xkTmFtZXNwYWNlSW1wb3J0cy5oYXModmFsdWUpKSB7XG4gICAgICAgICAgbGV0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgaW1wb3J0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGltcG9ydHMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGltcG9ydHMuYWRkKElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcbiAgICAgICAgICBvbGRJbXBvcnRQYXRocy5zZXQodmFsdWUsIGltcG9ydHMpO1xuXG4gICAgICAgICAgbGV0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldCh2YWx1ZSk7XG4gICAgICAgICAgbGV0IGN1cnJlbnRFeHBvcnQ7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY3VycmVudEV4cG9ydCA9IGV4cG9ydHMuZ2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGV4cG9ydExpc3Quc2V0KHZhbHVlLCBleHBvcnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdoZXJlVXNlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgICBleHBvcnRzLnNldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiwgeyB3aGVyZVVzZWQgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb2xkTmFtZXNwYWNlSW1wb3J0cy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgaWYgKCFuZXdOYW1lc3BhY2VJbXBvcnRzLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpbXBvcnRzLmRlbGV0ZShJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG5cbiAgICAgICAgICBjb25zdCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQud2hlcmVVc2VkLmRlbGV0ZShmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBuZXdJbXBvcnRzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKCFvbGRJbXBvcnRzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgbGV0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgaW1wb3J0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGltcG9ydHMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGltcG9ydHMuYWRkKGtleSk7XG4gICAgICAgICAgb2xkSW1wb3J0UGF0aHMuc2V0KHZhbHVlLCBpbXBvcnRzKTtcblxuICAgICAgICAgIGxldCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGxldCBjdXJyZW50RXhwb3J0O1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChrZXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHBvcnRzID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgZXhwb3J0TGlzdC5zZXQodmFsdWUsIGV4cG9ydHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudEV4cG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQud2hlcmVVc2VkLmFkZChmaWxlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgd2hlcmVVc2VkID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgd2hlcmVVc2VkLmFkZChmaWxlKTtcbiAgICAgICAgICAgIGV4cG9ydHMuc2V0KGtleSwgeyB3aGVyZVVzZWQgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb2xkSW1wb3J0cy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmICghbmV3SW1wb3J0cy5oYXMoa2V5KSkge1xuICAgICAgICAgIGNvbnN0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGltcG9ydHMuZGVsZXRlKGtleSk7XG5cbiAgICAgICAgICBjb25zdCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50RXhwb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5kZWxldGUoZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICdQcm9ncmFtOmV4aXQnOiBub2RlID0+IHtcbiAgICAgICAgdXBkYXRlRXhwb3J0VXNhZ2Uobm9kZSk7XG4gICAgICAgIHVwZGF0ZUltcG9ydFVzYWdlKG5vZGUpO1xuICAgICAgICBjaGVja0V4cG9ydFByZXNlbmNlKG5vZGUpO1xuICAgICAgfSxcbiAgICAgICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nOiBub2RlID0+IHtcbiAgICAgICAgY2hlY2tVc2FnZShub2RlLCBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuICAgICAgfSxcbiAgICAgICdFeHBvcnROYW1lZERlY2xhcmF0aW9uJzogbm9kZSA9PiB7XG4gICAgICAgIG5vZGUuc3BlY2lmaWVycy5mb3JFYWNoKHNwZWNpZmllciA9PiB7XG4gICAgICAgICAgY2hlY2tVc2FnZShub2RlLCBzcGVjaWZpZXIuZXhwb3J0ZWQubmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBmb3JFYWNoRGVjbGFyYXRpb25JZGVudGlmaWVyKG5vZGUuZGVjbGFyYXRpb24sIChuYW1lKSA9PiB7XG4gICAgICAgICAgY2hlY2tVc2FnZShub2RlLCBuYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19