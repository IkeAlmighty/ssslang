const { writeFile, readFile } = require('node:fs/promises')

function tokenize(code) {
    const tokens = []
    // first, read and tokenize the code given:
    let tokenStart = 0;
    for (let i = 0; i < code.length; i++) {
        if (code[i] === '$' && i + 1 < code.length && code[i + 1] === '[') {
            const item = code.substring(tokenStart, i);
            if (item.trim().length > 0) tokens.push({ type: 'ITEM', value: item })

            tokens.push({ type: "START_EXP", value: '$[' });

            i++;
            tokenStart = i + 1;
        }

        else if (code[i] === ';') {
            tokens.push({ type: "ITEM", value: code.substring(tokenStart, i) });
            i++;
            tokenStart = i;
        }

        else if (code[i] === ']') {
            tokens.push({ type: "ITEM", value: code.substring(tokenStart, i) })
            tokens.push({ type: 'END_EXP', value: ']' });

            if (i + 1 < code.length && code[i + 1] === ';') i++;
            i++;
            tokenStart = i;
        }
    }

    return tokens;
}

class ExpressionNode {
    constructor(children = []) {
        this.type = "Expression";
        this.children = children;
    }

    accept(visitor) {
        return visitor.visitExpressionNode(this);
    }
}

class ItemNode {
    constructor(value) {
        this.type = "Item";
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitItemNode(this);
    }
}

class NodeVisitor {
    constructor() {
        this.expansions = [""];
    }

    visitExpressionNode(node) {


    }

    visitItemNode(node) {
        for (let i = 0; i < this.expansions.length; i++) {
            this.expansions[i] = node.value + this.expansions[i];
        }
    }
}

function parse(tokens) {
    let index = 0;

    function parseExpression() {
        let children = [];
        while (index < tokens.length) {
            let token = tokens[index++]; // weird syntax - but the increment happens after the read

            if (token.type === 'START_EXP') {
                children.push(parseExpression());
            }
            else if (token.type === 'ITEM') {
                children.push(new ItemNode(token.value));
            }
            else if (token.type === 'END_EXP') {
                return new ExpressionNode(children);
            }
            else {
                throw new Error(`Invalid Token Type: ${token}`)
            }
        }

        return new ExpressionNode(children);
    }

    return parseExpression().children[0]; // parser
}

function generate(node) {
    const generator = new NodeVisitor();
    node.accept(generator);

    return generator.expansions;
}



async function compile(inputFileName, outputFileName) {
    const input = await readFile(inputFileName, 'utf-8');
    //TODO: compile the input into expanded output.

    let tokens = tokenize(input);
    let ast = parse(tokens);

    let output = generate(ast);
    await writeFile(outputFileName, output);
}

if (require.main === module) {
    const [_node, _ssslang, inputFileName, outputFileName] = process.argv;
    compile(inputFileName, outputFileName);
}

module.exports = { tokenize, parse, generate };
