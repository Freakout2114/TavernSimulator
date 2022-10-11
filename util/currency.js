
/**
 * This class is used to help convert between currencies over time periods.
 *
 * Example usage:
 * new Currency().copper(60).fromMonthly().toWeekly().value();
 */
module.exports = class Currency {
    constructor(val = 0) {
        this.unit = val;
    }

    copper(amount) {
        this.unit = amount;
        return this;
    }
    silver(amount) {
        this.unit = amount * 10;
        return this;
    }
    gold(amount) {
        this.unit = amount * 100;
        return this;
    }
    platinum(amount) {
        this.unit = amount * 1000;
        return this;
    }

    fromDaily() {
        return this;
    }
    fromWeekly() {
        this.unit /= 10; // 10 days in a week.
        return this;
    }
    fromMonthly() {
        this.unit /= 30; // 30 days in a month
        return this;
    }

    toDaily() {
        return this;
    }
    toWeekly() {
        this.unit *= 10;
        return this;
    }
    toMonthly() {
        this.unit *= 30;
        return this;
    }

    toCopper() {
        return this;
    }
    toSilver() {
        this.unit /= 10;
        return this;
    }
    toGold() {
        this.unit /= 100;
        return this;
    }
    toPlatinum() {
        this.unit /= 1000;
        return this;
    }

    value() {
        return this.unit;
    }

    add(val) {
        this.unit += val;
        return this;
    }

    mult(val) {
        this.unit *= val;
        return this;
    }

    div(val) {
        this.unit /= val;
        return this;
    }

    toString() {
        let currentCopper = Math.abs(this.unit);
        // const platinum = Math.floor(currentCopper / 1000); currentCopper -= platinum * 1000;
        const gold = Math.floor(currentCopper / 100); currentCopper -= gold * 100;
        const silver = Math.floor(currentCopper / 10); currentCopper -= silver * 10;
        const copper = Math.floor(currentCopper);

        let output = [];
        // if (platinum > 0) output.push(platinum+"pp");
        if (gold > 0) output.push(gold+"gp");
        if (silver > 0) output.push(silver+"sp");
        if (copper > 0) output.push(copper+"cp");

        if (output.length === 0) output.push("0cp");

        let result = output.join(' ');
        if (this.unit < 0) {
            result = '-' + result;
        }

        return result;
    }
}