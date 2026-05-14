const { tokenize } = require("./ssslang.js");

let tokens = tokenize("$[Throw a $[hammer; pebble at a $[wall; puddle]]]");
// throw a hammer
// throw a pebble at a wall
// throw a pebble at a puddle

/**
 * Throw a --> hammer
 * |
 *  ---> pebble at a --> wall
 *          |
 *           ---> puddle
 */
console.log(tokens);
