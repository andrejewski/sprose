
var paul = require('paul');
var defaults = require('defaults');
var parse = require('parser').parse;
var util = require('./util');

function sprose(scope, text) {
  scope = defaults(scope || {}, {
    program: function(_, x) {
      return util.stringify(x);
    },
    parse: parse,
    util: util
  });
  var ast = tree(parse('program' + util.sep + text));
  return paul.walk(ast, function(node, walk, scope) {
    if(node.type !== 'list') return node.value;
    var args = walk(node.value, scope)
      .filter(function(node) { return node; })
    var caller = func(args);
    return typeof caller[0] === 'function'
      ? caller[0](scope, caller[1])
      : scope[caller[0]](scope, caller[1]);
  }, scope);
}

function func(list) {
  var head = list[0];
  if(typeof head === 'string' && head.indexOf(util.sep) !== -1) {
    var words = head.split(util.sep);
    var fname = words.shift();
    return [fname, [words.join(util.sep)].concat(list.slice(1))];
  }
  return [head, list.slice(1)];
}

function tree(ast) {
  return Array.isArray(ast)
    ? {type: 'list', value: ast.map(tree)}
    : {type: 'text', value: ast};
}

module.exports = {parse: sprose};

