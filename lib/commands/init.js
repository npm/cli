const fs = require('fs')
const { relative, resolve } = require('path')
const mkdirp = require('mkdirp-infer-owner')
const initJson = require('init-package-json')
const npa = require('npm-package-arg')
const rpj = require('read-package-json-fast')
const libexec = require('libnpmexec')
const mapWorkspaces = require('@npmcli/map-workspaces')
const PackageJson = require('@npmcli/package-json')
const log = require('../utils/log-shim.js')
const updateWorkspaces = require('../workspaces/update-workspaces.js')

const BaseCommand = require('../base-command.js')

class Init extends BaseCommand { 
  static description = 'Create a package.json file'
  static params = [
    'yes',
    'force',
    'scope',
    'prefix', // Needs testing
    'workspace',
    'workspaces',
    'workspaces-update',
    'include-workspace-root',
  ] 
  static name = 'init'
  static usage = [
    '<package-spec> (same as `npx <package-spec>)',
    '<@scope> (same as `npx <@scope>/create`)',
  ]
  static ignoreImplicitWorkspace = false
  
  // feature prefix create: npm init --prefix=<unintatiated> === true;
  // fixQuircs: npm init is used in a npm root package that contains node_modules) but has no package.json
  // classic: npm init used from a none npm managed subfolder === true and process.cwd() === this.localPrefix.
  // if the prefix is uninitiated, takes care of it first!
  get isLocalPrefixUnInitiated() {
    const [ prefix, exists, npm ] = [this.npm.localPrefix, fs.existsSync, this.npm];
    return exists(prefix)
      ? !( exists(`${prefix}/package.json`) || exists(`${prefix}/node_modules`) )
      : (mkdirp(prefix).then(() =>  // enqueueed MicroTask to create it
         this.npm.output(`Creating folder: ${prefix} did not exist...`)))
         && true
  }
  
  // Helper to Conditional throw Errors out of a chain
  throwError(err) { throw err; }

  async exec (args, path = process.cwd(), { localPrefix } = this.npm) {
    // npm exec style 
    (args.length) ? (await this.execCreate({ args, path })) 
      // no args, uses classic init-package-json boilerplate
      // Prefix Option used with UnIntantiated path or got choosen because of node_modules exists in parent
      : await this.passToInitJson( this.isLocalPrefixUnInitiated ? localPrefix : path );
  }
  async execWorkspaces (args, filters, { localPrefix, flatOptions, config } = npm = this.npm,) {
    (flatOptions.includeWorkspaceRoot) && await this.exec(args);
    
    if (this.isLocalPrefixUnInitiated) { // const pkg = await rpj(resolve(localPrefix, 'package.json'))
      this.npm.output("You used --workspace or --workspaces with a uninitated prefix or root package");
      this.npm.output("If you did that by intend please rerun with --include-workspace-root or --iwr");
      this.npm.output(`so npm init runs in the root package first. And Creates it: used: ${localPrefix}`, );
      process.exit(0);
    };
    
    Promise.resolve(filters.map(filterArg => resolve(localPrefix, filterArg)))
      .then(async (wPaths) =>
        (wPaths.map(async (path, workspacePath = path) => {
          await mkdirp(path);
          (args.length) ? await this.execCreate({ args, path }) 
            : await this.passToInitJson(path);
          // skip setting workspace if current package.json glob already satisfies it  
          (wPath !== workspacePath) && await this.setWorkspaceOnLocalPrefix({ pkg, workspacePath })
        })) && //await this.reifyAllInitializedWorkspaces(wPaths));
          await updateWorkspaces({ 
            config, flatOptions, localPrefix, npm,
            workspaces: await Promise.all(wPaths
              .map(async (path) => await rpj(resolve(path, 'package.json')))
              .filter(({ name }) => name)
            ), // successfull resolved workspaces to containing workspaces names
        })
      );
  }
  // npm-exec style, runs in the context of each workspace filter  
  async execCreate ({ args: [ initerName, ...otherArgs ], path }, {
    flatOptions, flatOptions: { color }, localBin, globalBin, config 
  } = this.npm, runPath = path) {
    libexec({
      ...flatOptions, 
      args: [(/^@[^/]+$/.test(initerName)) 
        ? [initerName.split('@')].reduce(
          ( _initalStringReducerDescription, [,scope, version] ) => 
              (version) ? `${initerName}@${version}` : `@${scope}/create`, 
            `Handles: @<Scope> optional @<Scope>@<version>` && ""
          ) // `Handle: all other variants of @<Scope>/<packageName>@<version>` && 
        : (({ hosted, type, registry, rawSpec, name } = npa(initerName)) => (type === 'git' && hosted)
          ? (({ project }) => initerName.replace(`/${project}`, `/create-${project}`))(hosted)
          : (registry) ? `${name.replace(/^(@[^/]+\/)?/, '$1create-')}${rawSpec||''}` 
            : this.throwError(Object.assign(new Error(
                'Unrecognized initializer: ' + initerName +
                '\nFor more package binary executing power check out `npx`:' +
                '\nhttps://www.npmjs.com/package/npx'
              ), { code: 'EUNSUPPORTED' }))
      )(),
      ...otherArgs],
      color, localBin, globalBin, output: (...argsA) => this.npm.output(...argsA),
      path, runPath, scriptShell: config.get('script-shell') || undefined,
      yes: config.get('yes'),
    });
  }
  // no args, uses classic init-package-json boilerplate
  async passToInitJson(path = process.cwd(), { config } = this.npm) {
    const initFile = config.get('init-module')
    const displayText = ([text]) => text.split('\n').map((t)=>t.trimStart()).join('\n');
    log.pause();
    log.disableProgress();
    if (!config.get('yes') && !config.get('force')) {
      this.npm.output(displayText`This utility will walk you through creating a package.json file.
        It only covers the most common items, and tries to guess sensible defaults.
        
        See \`npm help init\` for definitive documentation on these fields
        and exactly what they do.
        
        Use \`npm install <pkg>\` afterwards to install a package and
        save it as a dependency in the package.json file.
        
        Press ^C at any time to quit.`)
    }

    // XXX promisify init-package-json
    await new Promise((res, rej) => {
      initJson(path, initFile, config, (er, data) => {
        log.resume()
        log.enableProgress()
        log.silly('package data', data)
        const logA = async (type,...msg) => { log[type](msg); };
        er ? er.message !== 'canceled' 
            ? rej(err) 
            : logA('warn','init', 'canceled').then(res)
           : logA('info','init', 'written successfully').then(()=>res(data))
      });
    });
  }
  async setWorkspaceOnLocalPrefix ({ pkg, workspacePath }, { localPrefix } = this.npm, cwd = localPrefix) {
    const tryFn = (fn) => { try { return fn() } catch (err) { return }; };
    for (const wPath of await mapWorkspaces({ cwd, pkg })) {
      // skip setting workspace if current package.json glob already satisfies it  
      (wPath !== workspacePath) && ['package.json', 'node_modules']
        .map((entry) => tryFn(()=>fs.statSync(resolve(workspacePath, entry))) && entry)
        // UnIntantiated workspace avoid touching the root package top-level package.json  
        .filter(maybeUndefined=>maybeUndefined).length && 
          await PackageJson.load(localPrefix)
            .then((pkgJson, { content: workspaces } = pkgJson) => (pkgJson.update({
              workspaces: (workspaces || []).concat(relative(localPrefix, workspacePath)),
            })) && pkgJson.save() );
      } 
  }
  
  async reifyAllInitializedWorkspaces(workspacesPaths, { 
    config,flatOptions,localPrefix, 
  } = npm = this.npm) {
    await updateWorkspaces({ 
      config, flatOptions, localPrefix, npm,
      workspaces: await Promise.all(workspacesPaths
        .map(async (path) => await rpj(resolve(path, 'package.json')))
        .filter(({ name }) => name)
      ), // successfull resolved workspaces to containing workspaces names
    });
  }
}

module.exports = Init;
