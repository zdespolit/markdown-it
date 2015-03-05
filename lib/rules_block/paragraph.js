// Paragraph

'use strict';


module.exports = function paragraph(state, startLine/*, endLine*/) {
  var endLine, content,
      nextLine = startLine + 1,
      terminatorLoop;

  endLine = state.lineMax;

  // jump line-by-line until empty one or EOF
  if (nextLine < endLine && !state.isEmpty(nextLine)) {
    terminatorLoop = state.md.block.ruler.loops.paragraph;

    for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
      // this would be a code block normally, but after paragraph
      // it's considered a lazy continuation regardless of what's there
      if (state.tShift[nextLine] - state.blkIndent > 3) { continue; }

      // Some tags can terminate paragraph without empty line.
      if (terminatorLoop(state, nextLine, endLine, true)) { break; }
    }
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

  state.line = nextLine;
  state.tokens.push({
    type: 'paragraph_open',
    tight: false,
    lines: [ startLine, state.line ],
    level: state.level
  });
  state.tokens.push({
    type: 'inline',
    content: content,
    level: state.level + 1,
    lines: [ startLine, state.line ],
    children: []
  });
  state.tokens.push({
    type: 'paragraph_close',
    tight: false,
    level: state.level
  });

  return true;
};
