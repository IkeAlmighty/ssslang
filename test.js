const { expandOnce, expandAll, compile } = require('./ssslang.js');

let expansions = expandAll(`Throw a $[hammer; tea-cup; rice cooker; small animal] at $[a wall; an enemy; the sky; the ground]. Gain $[1; 2; 3; 4] d6 of hp permenantly.`);
expansions.forEach(e => console.log(e));
