
var listStart = '(';
var listEnd = ')';

function nextStart(str) {
  var tic = '`';
  var idx = str.indexOf(listStart);
  if(str.charAt(idx - 1) !== tic) return idx;
  if(str.charAt(idx - 2) === tic) {
    // `` quoted
    return (idx + 1) + nextStart(str.slice(idx + 1));
  } else {
    // ` escaped
    var rel = str.slice(idx + 1);
    var end = nextEnd(rel);
    var beg = nextStart(rel.slice(end));

    if(end === -1) return beg;
    if(beg === -1) return beg;
    return (idx + 1) + end + beg;
  }
}

function nextEnd(str) {
  var depth = 1;
  for(var idx = 0; idx < str.length; idx++) {
    var c = str.charAt(idx);
    if(c === listStart) depth++;
    if(c === listEnd) depth--;
    if(!depth) return idx;
  }
  return -1;
}

function normalize(str) {
  return str
    .replace(/``\(/g, '`(')
    .replace(/`\(/g, '(');
}

function _parse(state) {
  var list = [];
  var lead;
  while((lead = state.str.charAt(state.idx)) !== listEnd) {
    if(lead === listStart) {
      state.idx += listStart.length;
      list.push(_parse(state));
      if(state.idx >= state.str.length) break;
    } else {
      var str = state.str.slice(state.idx);
      var open = nextStart(str);
      var close = nextEnd(str);
      if(close !== -1 && close < open) {
        list.push(normalize(str.slice(0, close)));
        state.idx += close;
        break;
      }

      if(open === -1) {
        if(close === -1) {
          state.idx = state.str.length;
          if(!list.length) return normalize(str);
          list.push(normalize(str));
        } else {
          list.push(normalize(str.slice(0, close)));
          state.idx += close;
        }
        break;
      } else /*if (str.charAt(open - 1) === '`') {
        var quoteEnd = nextEnd(str.slice(open + 1));
        var quoteStr = str.slice(open, quoteEnd);
        list.push(parse(quoteStr));
        state.idx += quoteEnd;
      } else*/ {
        list.push(normalize(str.slice(0, open)));
        state.idx += open;
      }
    }
  }
  state.idx += listEnd.length;
  return list;
}

function parse(text) {
  return _parse({str: text, idx: 0});
}

module.exports = {
  parse: parse,
  nextStart: nextStart,
  nextEnd: nextEnd
};

