
/**
 * This class is used to help convert between currencies over time periods.
 *
 * Example usage:
 * new Currency().copper(60).fromMonthly().toWeekly().value();
 */
module.exports = function() {
    this.unit = 0;

    this.copper = function(amount) {
        this.unit = amount;
        return this;
    }
    this.silver = function(amount) {
        this.unit = amount * 10;
        return this;
    }
    this.gold = function(amount) {
        this.unit = amount * 100;
        return this;
    }
    this.platinum = function(amount) {
        this.unit = amount * 1000;
        return this;
    }

    this.fromDaily = function() {
        return this;
    }
    this.fromWeekly = function() {
        this.unit /= 10; // 10 days in a week.
        return this;
    }
    this.fromMonthly = function() {
        this.unit /= 30; // 30 days in a month
        return this;
    }

    this.toDaily = function() {
        return this;
    }
    this.toWeekly = function() {
        this.unit *= 10;
        return this;
    }
    this.toMonthly = function() {
        this.unit *= 30;
        return this;
    }

    this.toCopper = function() {
        return this;
    }
    this.toSilver = function() {
        this.unit /= 10;
        return this;
    }
    this.toGold = function() {
        this.unit /= 100;
        return this;
    }
    this.toPlatinum = function() {
        this.unit /= 1000;
        return this;
    }

    this.value = function() {
        return this.unit;
    }

    this.mult = function(val) {
        this.unit *= val;
        return this;
    }

    this.div = function(val) {
        this.unit /= val;
        return this;
    }

    this.toString = function() {
        let currentCopper = this.unit;
        const platinum = Math.floor(currentCopper / 1000); currentCopper -= platinum * 1000;
        const gold = Math.floor(currentCopper / 100); currentCopper -= gold * 100;
        const silver = Math.floor(currentCopper / 10); currentCopper -= silver * 10;
        const copper = Math.floor(currentCopper);

        let output = [];
        if (platinum > 0) output.push(platinum+"pp");
        if (gold > 0) output.push(gold+"gp");
        if (silver > 0) output.push(silver+"sp");
        if (copper > 0) output.push(copper+"cp");

        if (output.length === 0) output.push("0cp");

        return output.join(' ');
    }
}