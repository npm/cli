// Import the required dependencies
const BaseCommand = require('./base-command.js');

// Define the LifecycleCmd class that extends the BaseCommand class
class LifecycleCmd extends BaseCommand {
// Define the usage, shellout, workspaces, and ignoreImplicitWorkspace properties
static usage = ['[-- <args>]'];
static isShellout = true;
static workspaces = true;
static ignoreImplicitWorkspace = false;

// Define the exec method that executes the run-script command with the specified arguments
async exec(args) {
const scriptName = this.constructor.name.toLowerCase();
return this.npm.exec('run-script', [scriptName, ...args]);
}

// Define the execWorkspaces method that executes the run-script command with the specified arguments for each workspace
async execWorkspaces(args) {
const scriptName = this.constructor.name.toLowerCase();
return this.npm.exec('run-script', [scriptName, ...args], { workspaces: this.getWorkspaces() });
}
}

// Export the LifecycleCmd class
module.exports = LifecycleCmd;

