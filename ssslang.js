const { writeFile, readFile } = require("node:fs/promises");

function tokenize(code) {
  const tokens = [];
  // first, read and tokenize the code given:
  let tokenStart = 0;
  for (let i = 0; i < code.length; i++) {
    if (code[i] === "$" && i + 1 < code.length && code[i + 1] === "[") {
      const item = code.substring(tokenStart, i);
      if (item.trim().length > 0) tokens.push({ type: "ITEM", value: item });

      tokens.push({ type: "START_EXP", value: "$[" });

      i++;
      tokenStart = i + 1;
    } else if (code[i] === ";") {
      tokens.push({ type: "ITEM", value: code.substring(tokenStart, i) });
      i++;
      tokenStart = i;
    } else if (code[i] === "]") {
      let _type = "ITEM"; // assumed type
      if (tokens[tokens.length - 1].type === "END_EXP") {
        // edge case:
        _type = "END_EXP";
      }
      tokens.push({ type: _type, value: code.substring(tokenStart, i) });
      tokens.push({ type: "END_EXP", value: "]" });

      if (i + 1 < code.length && code[i + 1] === ";") i++;
      i++;
      tokenStart = i;
    }
  }

  return tokens;
}

class NodeVisitor {
  // a list tracking all instances of NodeVisitors
  static instances = [];

  // the permutation that is being built by this visitor
  permutation = "";

  constructor() {
    NodeVisitor.instances.append(this);
  }

  consume(node) {
    if (node.tokens.length > 1) {
      this.split(node.tokens);
    }
  }

  split(sequence) {
    this.visitors.filter((v) => v === this);
    sequence.forEach((token) => {
      this.visitors.append(new NodeVisitor(token));
    });
  }
}

async function compile(inputFileName, outputFileName) {}

module.exports = { tokenize };
