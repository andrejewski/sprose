#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var sprose = require('../');

var args = process.argv.slice(2);
var src = args[0];

function cwd(filepath) {
  return path.join(process.cwd(), filepath);
}

var dest = cwd(args[1] || path.join(
  path.dirname(src),
  path.basename(src, path.extname(src))));

var textfile = cwd(src);
var codefile = cwd(path.join(
  path.dirname(src),
  path.basename(src, path.extname(src))));

var text = fs.readFileSync(textfile);
var code = require(codefile);
fs.writeFileSync(dest, sprose.parse(code, text));

