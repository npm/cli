const Arborist = require("@npmcli/arborist");
const { readFileSync, writeFile } = require("fs");
const { join } = require("path");

// Generates our dependency graph documents in DEPENDENCIES.md.

// To re-create npm-cli-repos.txt run:
// npx -p @npmcli/stafftools gh repos --json | json -a name | sort > scripts/npm-cli-repos.txt
const repos = readFileSync(join(__dirname, "npm-cli-repos.txt"), "utf-8").trim().split("\n");

// these have a different package name than the repo name, and are ours.
const aliases = {
  semver: "node-semver",
  abbrev: "abbrev-js",
};

// These are entries in npm-cli-repos.txt that correlate to namespaced repos.
// If we see a bare package with just this name, it's NOT ours
const namespaced = [
  "arborist",
  "config",
  "disparity-colors",
  "eslint-config",
  "exec",
  "fs",
  "git",
  "installed-package-contents",
  "lint",
  "map-workspaces",
  "metavuln-calculator",
  "move-file",
  "name-from-folder",
  "node-gyp",
  "package-json",
  "promise-spawn",
  "run-script",
  "template-oss",
];

function isOurs(name) {
  if (name.startsWith("libnpm") || name.startsWith("@npmcli") || aliases[name]) {
    return true;
  }
  if (namespaced.includes(name)) {
    return false;
  }
  return repos.includes(name);
}

function escapeName(name) {
  return name.startsWith("@") ? `${stripName(name)}["${name}"]` : name;
}

function stripName(name) {
  return name.startsWith("@")
    ? `${name.slice(1).split("/")[0]}-${name.slice(1).split("/")[1]}`
    : name;
}

async function main() {
  // add all of the cli's public workspaces as package names
  const arborist = new Arborist({ prefix: __dirname, path: __dirname });
  const tree = await arborist.loadVirtual({ path: __dirname, name: "npm" });
  tree.name = "npm";

  const [annotationsOurs, hierarchyOurs] = walk(tree, true);
  const [annotationsAll] = walk(tree, false);

  const out = [
    "# npm dependencies",
    "",
    "## `github.com/npm/` only",
    "```mermaid",
    "graph LR;",
    ...annotationsOurs.sort(),
    "```",
    "",
    "## all dependencies",
    "```mermaid",
    "graph LR;",
    ...annotationsAll.sort(),
    "```",
    "",
    "## npm dependency hierarchy",
    "",
    "These are the groups of dependencies in npm that depend on each other.",
    "Each group depends on packages lower down the chain, nothing depends on",
    "packages higher up the chain.",
    "",
    ` - ${hierarchyOurs.reverse().join("\n - ")}`,
  ];

  await writeFile(join(__dirname, "DEPENDENCIES.md"), out.join("\n"));
}

function walk(tree, onlyOurs) {
  const annotations = [];
  const dependedBy = {};

  iterate(tree, dependedBy, annotations, onlyOurs);

  const allDeps = new Set(Object.keys(dependedBy));
  const foundDeps = new Set();
  const hierarchy = [];

  if (onlyOurs) {
    while (allDeps.size) {
      const level = [];

      for (const dep of allDeps) {
        if (!dependedBy[dep].size) {
          level.push(dep);
          foundDeps.add(dep);
        }
      }

      for (const dep of allDeps) {
        for (const found of foundDeps) {
          allDeps.delete(found);
          dependedBy[dep].delete(found);
        }
      }

      if (!level.length) {
        const remaining = `Remaining deps: ${[...allDeps.keys()]}`;
        throw new Error(`Would do an infinite loop here, need to debug. ${remaining}`);
      }

      hierarchy.push(level.join(", "));
    }
  }

  return [annotations, hierarchy];
}

function iterate(node, dependedBy, annotations, onlyOurs) {
  if (!dependedBy[node.packageName]) {
    dependedBy[node.packageName] = new Set();
  }
  for (const [name, edge] of node.edgesOut) {
    if ((!onlyOurs || isOurs(name)) && !node.dev) {
      if (!dependedBy[node.packageName].has(edge.name)) {
        dependedBy[node.packageName].add(edge.name);
        annotations.push(`  ${stripName(node.packageName)}-->${escapeName(edge.name)};`);
        if (edge.to) {
          iterate(edge.to.target, dependedBy, annotations, onlyOurs);
        }
      }
    }
  }
}

main();
