npm-environments(7) -- Running npm commands in different environments
======================================================================

## DESCRIPTION

npm supports running commands in different environments (e.g., development,
staging, production) using environment-specific configuration files. This
allows you to maintain separate configurations for different deployment
targets without modifying your main `.npmrc` file.

## USAGE

To run a command in a specific environment, use the `--env` flag:

    npm install --env staging
    npm publish --env production
    npm run build -e dev

The `-e` shorthand can be used in place of `--env`.

## ENVIRONMENT CONFIGURATION FILES

npm looks for environment-specific configuration in the following locations,
in order of priority:

1. Custom config directory (if `--env-config-dir` is specified):
   `{env-config-dir}/.npmrc.{environment}`

2. Project directory:
   `{project}/.npmrc.{environment}`

3. User home directory:
   `~/.npmrc.{environment}`

For example, if you run `npm install --env staging`, npm will look for:
- `./.npmrc.staging` (project directory)
- `~/.npmrc.staging` (user home directory)

The first file found will be used.

## CREATING ENVIRONMENT CONFIG FILES

Create environment-specific config files with the `.npmrc.{env}` naming pattern:

### Example: .npmrc.staging

    registry=https://staging-registry.example.com/
    //staging-registry.example.com/:_authToken=${STAGING_NPM_TOKEN}
    cache=/tmp/npm-staging-cache

### Example: .npmrc.production

    registry=https://registry.example.com/
    //registry.example.com/:_authToken=${PRODUCTION_NPM_TOKEN}
    strict-ssl=true

## ENVIRONMENT ALIASES

npm recognizes the following environment name aliases:

* `dev` -> `development`
* `prod` -> `production`
* `stg` or `stage` -> `staging`
* `local` -> `local`
* `test` -> `test`

For example, `npm install --env dev` is equivalent to
`npm install --env development`.

## ENVIRONMENT-SPECIFIC ENVIRONMENT VARIABLES

You can also set environment-specific configuration using environment
variables with the pattern `npm_config_{env}_{key}`:

    export npm_config_staging_registry=https://staging-registry.example.com/
    export npm_config_production_strict_ssl=true

When running with `--env staging`, npm will automatically include these
environment-specific variables in its configuration.

## CONFIGURATION PRIORITY

When using `--env`, the configuration priority is (highest to lowest):

1. Command line flags
2. Standard environment variables (`npm_config_*`)
3. Project `.npmrc`
4. **Environment-specific config (`.npmrc.{env}`)** <-- NEW
5. Environment-specific environment variables (`npm_config_{env}_*`)
6. User `.npmrc`
7. Global `.npmrc`
8. Built-in defaults

## CUSTOM CONFIG DIRECTORY

You can specify a custom directory for environment config files using
`--env-config-dir`:

    npm install --env staging --env-config-dir /etc/npm-envs

This will look for `/etc/npm-envs/.npmrc.staging`.

## EXAMPLES

### Setting up a staging environment

1. Create `.npmrc.staging` in your project:

       registry=https://staging.npmjs.example.com/
       //staging.npmjs.example.com/:_authToken=${STAGING_TOKEN}

2. Run commands targeting staging:

       npm install --env staging
       npm publish --env staging

### Using environment variables only

If you prefer not to create config files, you can use environment variables:

    # Set staging-specific config
    export npm_config_staging_registry=https://staging.example.com/
    export npm_config_staging_strict_ssl=false

    # Run with staging environment
    npm install --env staging

### CI/CD Pipeline Example

    # .github/workflows/deploy.yml
    jobs:
      deploy-staging:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v2
          - run: npm ci --env staging
          - run: npm run build --env staging
          - run: npm publish --env staging
        env:
          STAGING_TOKEN: ${{ secrets.STAGING_NPM_TOKEN }}

## SEE ALSO

* npm-config(7)
* npmrc(5)
* npm-config(1)
