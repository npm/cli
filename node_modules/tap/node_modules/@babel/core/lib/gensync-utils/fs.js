"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stat = exports.readFile = void 0;

const fs = require("fs");

const gensync = require("gensync");

const readFile = gensync({
  sync: fs.readFileSync,
  errback: fs.readFile
});
exports.readFile = readFile;
const stat = gensync({
  sync: fs.statSync,
  errback: fs.stat
});
exports.stat = stat;