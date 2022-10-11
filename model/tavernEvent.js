const Dice = require('../util/dice.js');
const Currency = require('../util/currency.js');

module.exports = class TavernEvent {
    constructor(event = {}) {
        this.description = event.description;
        this.businessRollModifier = event.businessRollModifier;
        this.cost = (event.cost) ? new Currency().gold(Dice.parse(event.cost)) : null;
    }
}