
var assert = require('assert');
var sprose = require('../');

describe('sprose', function() {
  describe('parse', function() {
    it('should evaluate text correctly', function() {
      var text = "I (b really) like cake.";
      var scope = {
        b: function(scope, input) {
          return "**" + scope.util.stringify(input) + "**";
        }
      };

      assert.equal(sprose.parse(scope, text), "I **really** like cake.");
    });
  });

  function puts(json) {
    // console.log(JSON.stringify(json, null, 2));
  }

  describe('parens()', function() {
    return true;
    it('should work on plain text', function() {
      var text = "this is plain text";
      var data = {type: 'text', value: text};
      assert.deepEqual(sprose.parens(text), data);
    });

    it('should work on start parens', function() {
      var text = "(cake is good) for nothing";
      var data = {
        type: 'list',
        value: [{
          type: 'list',
          value: [{
            type: 'text',
            value: 'cake is good'
          }]
        }, {
          type: 'text',
          value: ' for nothing'
        }]
      };

      puts(sprose.parens(text));
      assert.deepEqual(sprose.parens(text), data);
    });

    it('should work on end parens', function() {
      var text = "cake is good (for nothing)";
      var data = {
        type: 'list',
        value: [{
          type: 'text',
          value: 'cake is good '
        }, {
          type: 'list',
          value: [{
            type: 'text',
            value: 'for nothing'
          }]
        }]
      };

      puts(sprose.parens(text));
      assert.deepEqual(sprose.parens(text), data);
    });

    it('should work on inner parens', function() {
      var text = "this is (not cool or) awesome";
      var data = {
        type: 'list',
        value: [{
          type: 'text',
          value: 'this is '
        }, {
          type: 'list',
          value: [{
            type: 'text',
            value: 'not cool or'
          }]
        }, {
          type: 'text',
          value: ' awesome'
        }]
      };

      puts(sprose.parens(text));
      assert.deepEqual(sprose.parens(text), data);
    });

    it('should work on just parens', function() {
      var text = "(this is not cool or awesome)";
      var data = {
        type: 'list',
        value: [{
          type: 'list',
          value: [{
            type: 'text',
            value: 'this is not cool or awesome'
          }]
        }]
      };

      puts(sprose.parens(text));
      assert.deepEqual(sprose.parens(text), data);
    });

    it('should work on nested parens', function() {
      var text = "this is a (nested (nested)) statement";
      var data = {
        type: 'list',
        value: [{
          type: 'text',
          value: 'this is a '
        }, {
          type: 'list',
          value: [{
            type: 'text',
            value: 'nested '
          }, {
            type: 'list',
            value: [{type: 'text', value: 'nested'}]
          }]
        }, {
          type: 'text',
          value: ' statement'
        }]
      };

      puts(sprose.parens(text));
      assert.deepEqual(sprose.parens(text), data);
    });
  });

});

