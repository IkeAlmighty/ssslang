const { tokenize, parse, generate } = require('./ssslang.js')

let tokens = tokenize('$[Letter $[a; b]]')
console.log(tokens)
let ast = parse(tokens);
console.log(JSON.stringify(ast, null, 3))

let s = generate(ast);
// console.log(s);

// console.log(outputs);

const d = {

    "type": "Expression",
    "children": [
        {
            "type": "Expression",
            "children": [
                {
                    "type": "Item",
                    "value": "Throw a "
                },
                {
                    "type": "Expression",
                    "children": [
                        {
                            "type": "Item",
                            "value": "hammer"
                        },
                        {
                            "type": "Item",
                            "value": " tea-cup"
                        }
                    ]
                },
                {
                    "type": "Item",
                    "value": "."
                }
            ]
        }
    ]
}