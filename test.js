const { compile } = require('./ssslang.js');
const fs = require('fs');

console.log(JSON.stringify(compile(`
    Throw a $[hammer; tea-cup; rice cooker; small animal] at $[a wall; an enemy; the sky; the ground]. Gain $[1; 2; 3; 4] d6 of hp permenantly.
`)));

// // console.log(compile('the $[cat, dog, man, sheep] ate the $[grass, man, tortilla, smoke-grenade]'));
// for (let i = 0; i < 30; i++) {
//     fs.readFile('test.sslang', 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//             return;
//         }

//         console.log(compile(data));
//     });
// }