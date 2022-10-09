const mathOperators = '+-*/'.split('');

/**
 * Is the passed in character one of the listed splitter characters.
 */
function isMathOperator(char) {
	return mathOperators.includes(char);
}

/**
 * Roll 'x' number of dice with 'n' number of sides.
 * @param {int} numDie how many dice to roll
 * @param {int} sides the number of the sides the dice have
 * @returns the result of x dice being rolled
 */
const diceFn = function(numDie, sides) {
    // Handle when only one parameter passed in.
    if (sides == undefined) {
        sides = numDie;
        numDie = 1;
    }

    let sum = 0;
    for (let i = 0; i < numDie; i++) {
        sum += Math.floor(Math.random() * sides) + 1;
    }
    return sum;
};

/**
 * Given a string input, parse the dice roll, e.g. "3d4 + 16".
 * @param {string} input
 * @returns
 */
function parse(input) {
    // Format input
    input = input.toLowerCase();
    input = input.replaceAll(' ', '');

    const parts = parseParts(input);

    for (let i = 0; i < parts.length; i++) {
        if (parts[i].includes('d')) { // If the part is a dice roll e.g. "3d4"
            parts[i] = parseDice(parts[i]);
        } else if (!isMathOperator(parts[i])) { // If its just a straight number "34"
            parts[i] = parseInt(parts[i]);
        }
    }

    // Apply any math opperators
    for (let i = 0; i < parts.length; i++) {
        if (!isMathOperator(parts[i])) continue;

        const p1 = parts[i-1];
        const p2 = parts[i+1];
        let result = null;
        switch(parts[i]) {
            case '+': result = p1 + p2; break;
            case '-': result = p1 - p2; break;
            case '*': result = p1 * p2; break;
            case '/': result = p1 / p2; break;
        }
        parts.splice(i, 2);
        parts[i-1] = result;
        i -= 1;
    }

    return parts[0];
}

function parseDice(input) {
    const parts = input.split('d');
    const numDice = parts[0];
    const sides = parts[1];

    return diceFn(numDice, sides);
}

function parseParts(input) {
	const parts = [];
    let startIndex = 0;
    for (let i = 0; i < input.length; i++) {
        if (isMathOperator(input[i])) {
            parts.push(input.substring(startIndex, i));
            parts.push(input[i]);
            startIndex = i+1;
        }
    }

    if (startIndex !== input.length) {
        parts.push(input.substring(startIndex, input.length));
    }

    return parts;
}

module.exports = {
    dice: diceFn,
    parse: parse
}