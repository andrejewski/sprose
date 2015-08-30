
var assert = require('assert');
var parser = require('../parser');

describe('parser', function() {
  describe('parse(text: string): ast', function() {
    // return true;
    function its(should, input, output) {
      it('should work on '+should, function() {
        assert.deepEqual(parser.parse(input), output);
      });
    }

    its('plain text', 'this is plain text', 'this is plain text');
    its('start of list', '(this is) some text', [['this is'], ' some text']);
    its('end of list', 'this is (some text)', ['this is ', ['some text']]);
    its('middle of list', 'this (is some) text', ['this ', ['is some'], ' text']);
    its('nested lists', 'this (is (some)) text', ['this ', ['is ', ['some']], ' text']);
    its('crazy lists', '(this) (is (some)) (text)', [['this'], ' ', ['is ', ['some']], ' ', ['text']]);

    its('escaped lists', 'this `(is some) text', 'this (is some) text');
    its('escaped nested lists', 'this `(is (some)) text', 'this (is (some)) text');

    // its('quoted lists', 'this ``(is some) text', 'this (is some) text');
    // its('quoted nested lists', 'this ``(is (some)) text', ['this (is ',['some'],') text']);
  });

  describe('nextStart(str: string): number', function() {
    it('should return -1 if start is not found', function() {
      var text = "this is some text";
      assert.equal(parser.nextStart(text), -1);
    });

    it('should return the leftmost start index', function() {
      var text = "this is (some) text";
      var tidx = text.indexOf('(');
      assert.equal(parser.nextStart(text), tidx);
    });

    it('should skip escaped start indices', function() {
      var text = "this `(is some) (text)";
      var tidx = text.lastIndexOf('(');
      assert.equal(parser.nextStart(text), tidx);
    });

    it('should return -1 if an unescaped start is not found', function() {
      var text = "this `(is some text)";
      assert.equal(parser.nextStart(text), -1);
    });

    it('should skip quoted start indices', function() {
      var text = "this ``(is (some)) text";
      var tidx = text.lastIndexOf('(');
      assert.equal(parser.nextStart(text), tidx);
    });
  });

  describe('nextEnd(str: string): number', function() {
    it('should return -1 if end is not found', function() {
      var text = "this is some text";
      assert.equal(parser.nextEnd(text), -1);
    });

    it('should return the leftmost end index', function() {
      var text = "this is) some text";
      var tidx = text.indexOf(')');
      assert.equal(parser.nextEnd(text), tidx);
    });

    it('should skip nested end indices', function() {
      var text = "this (is some) text)";
      var tidx = text.lastIndexOf(')');
      assert.equal(parser.nextEnd(text), tidx);
    });
  });

});

