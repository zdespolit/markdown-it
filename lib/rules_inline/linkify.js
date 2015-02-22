// Autolink known protocols with higher priority than emphasis.
//
// http://example.com/test_-_this_is_not_italic_-_test
//

'use strict';


var normalizeLink = require('../common/utils').normalizeLink;


var KNOWN_PROTO_RE = /(?:http|https)$/;


module.exports = function linkify(state, silent) {
  var schema, len, url,
      pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x3A/* : */) { return false; }

  if (!state.md.options.linkify) { return false; }

  if (state.src.charCodeAt(pos + 1) !== 0x2F/* / */) { return false; }

  if (!KNOWN_PROTO_RE.test(state.pending)) { return false; }

  schema = state.pending.match(KNOWN_PROTO_RE)[0];
  len = state.md.linkify.testSchemaAt(state.src, schema + ':', pos + 1);

  if (len < 0) { return false; }

  url = schema + state.src.slice(pos, pos + 1 + len);

  if (!state.md.inline.validateLink(url)) { return false; }

  if (!silent) {
    state.pending = state.pending.slice(0, -schema.length);
    state.push({
      type: 'link_open',
      href: normalizeLink(url),
      target: '',
      level: state.level
    });
    state.push({
      type: 'text',
      content: url,
      level: state.level + 1
    });
    state.push({ type: 'link_close', level: state.level });
  }

  state.pos += 1 + len;
  return true;
};
