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


function parse(tokens) {
    // This AST treats each expression as a node,
    // and it sets the children to whatever lists
    // border it. This makes it easier to translate
    // in the code generation step
    // as we can just track the paths we've taken
    // previously

    // so 'Throw a $[hammer, bucket].' results in 
    // ITEM'Thow a..' --> EXPR ----> ITEM'hammer' --> ITEM'.'
    //                     |
    //                      ---> ITEM'bucket' ---> ITEM'.'   

    // if we see ITEM, create an ITEM node and push it to the current ExpressionNode's child list
    // if we see START_EXP, then recursively call parseExpr, and push the resulting ExprNode to
    // the current ExprNode's child list.
    // if we see END_EXP, then return the current ExpressionNode that we are building


    // grammar 
    // EXP: ITEM EXP
    // ITEM: 

    function parseExpression(index) {
        const token = tokens[index];
        console.log('token: ', token)
        node = { value: null, children: [] }

        function parseItem(index) {
            const token = tokens[index];
            console.log('item: ', token);
            node.children.push({ value: token.value, children: null });
        }

        if (token.type === 'ITEM') {
            parseItem(index++);
        }
        else if (token.type === 'START_EXP') {
            parseExpression(++index);
        }
        else if (token.type === 'END_EXP') {
            return node;
        }
    }

    return parseExpression(0);
}

class GraphVisitor {
    constructor(node) {
        this.root = node;
        this.traversedCount = 0;
    }

    make(avoid) {
        // avoid is an array of paths.
        // a path is an array of indexes describing a path through
        // the graph. Each element holds the number of the index 
        // to not traverse among neighbors - the index of corresponds
        // to how many nodes have been traversed.
        // example : [[0], [1, 0]]: <path>]

        // make will use this.traversedCount and check each array
        // to determine whether it is allowed to traverse the next child.

        // example: 
        /**
         * Throw a --> hammer
         * |
         *  ---> pebble at a --> wall
         *          | 
         *           ---> puddle
         */
        // this avoid will avoid the paths of 'Throw a hammer' and 
        // 'Throw a pebble at a wall'
        const node = this.root;
        let result = this.root.value;

        // note: node is updated inside the loop, so this condition
        // terminates automatically when we reach a node that does not have 
        // a child
        for (let i = 0; i < node.children.length; i++) {
            for (let j = 0; j < avoid.length; j++) {
                if (i === avoid[j][this.traversedCount]) i++; // if the neighbor is in any avoid path, increment to the next neighbor
                else {
                    this.path.push(i) // otherwise push the path and add the value!
                    result += node.children[i].value;
                    node = node.children[i];
                    this.traversedCount++;
                }
            }
        }


        return [this.path, result]
    }

    resetPath() {
        this.path = [];
    }
}

function generate(node) {
    const visitor = new GraphVisitor(node);
    const paths = [];
    const expansions = [];
    while (true) {
        const [path, expansion] = visitor.make(avoid = [...paths]);
        visitor.resetPath();
        if (!path) break;
        paths.push(path);
        expansions.push(expansion)
    }

    return expansions;
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
