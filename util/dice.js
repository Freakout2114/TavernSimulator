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

module.exports = {
    dice: diceFn
}