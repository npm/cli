#!/usr/bin/env node

const verMajor = parseInt(process.versions.node.split(".")[0], 10);

if (verMajor <= 6) {
  require("../dist/node6-card");
} else {
  require("../dist/card");
}
