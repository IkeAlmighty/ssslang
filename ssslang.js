const fs = require('fs');

function compile(code) {

    /**
     * Possible States:
     * TEXT -> $
     * $ -> ( or )
     * ( -> )
     * )
     * [
     * ]
     */

    // first, iterate through code characters, and look for $
    for (let i = 0; i < code.length; i++) {
        let char = code[i];
        if (char === '$' && i + 2 < code.length) {
            let startExpr = i;

            // branch for inline inserts:
            if (i + 1 < code.length && code[i + 1] === '[') {

                // iterate forward until either end of code or end of list insertion
                for (; code[i] != ']' && i < code.length; i++);

                // if the end of code has been reached without finding closing symbol, then throw error
                if (i >= code.length) throw Error(`character ${startExpr + 1} does not have a closing ']'.`);

                let endExpr = i;
                let values = code.substring(startExpr + 2, i).split(';').map(v => v.trim());

                // append the other possibilities to the end of the code string:
                let expansions = [];
                values.forEach(insert => {
                    expansions.push(code.substring(0, startExpr) + insert + code.substring(i + 1, code.length));
                });

                i = i - (i - startExpr) + values[0].length;
            }
            // branch for file inserts:
            else if (i + 1 < code.length && code[i + 1] === '(') {
                // for newline seperated value file insertions:

                // iterate forward until either end of code or end of list insertion
                for (; code[i] != ')' && i < code.length; i++);

                // if the end of code has been reached without finding closing symbol, then throw error
                if (i >= code.length) throw Error(`character ${startExpr + 1} does not have a closing ')'.`);

                let filepath = code.substring(startExpr + 2, i).trim();

                // read file:
                const data = fs.readFileSync(filepath, 'utf8');
                let values = data.split(/[\n\t\r]+/)

                // choose a random value to insert:
                let insert = values[Math.floor(Math.random() * values.length)];

                code = code.substring(0, startExpr) + insert + code.substring(i + 1, code.length);
                i = i - (i - startExpr) + insert.length;

            }
        }
    }

    return code;
}

// if this is the executing file, then run as a cli tool:
if (!module.parent) {

    if (process.argv.length === 1) {
        process.stdout.write('please include a filepath to .ssslang file');
    }
    else if (process.argv.length === 2) {
        const filepath = process.argv[1];
        const code = fs.readFileSync(filepath, 'utf-8');

        process.stdout.write(compile(code));
    }
    else if (process.argv.length === 3) {
        const filepath = process.argv[1];
        const outputfilepath = process.argv[2];
        const code = fs.readFileSync(filepath, 'utf-8');

        fs.writeFile(outputfilepath, compile(code));
    }
    else {
        process.stdout.write('Invalid number of arguments. Use: `ssslang <filename> OPTIONAL:<outputfilename>`')
    }
}


module.exports = { compile }