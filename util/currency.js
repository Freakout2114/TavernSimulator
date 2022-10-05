
/**
 * This class is used to help convert between currencies over time periods.
 *
 * Example usage:
 * new Currency().copper(60).fromMonthly().toWeekly().value();
 */
module.exports = function() {
    this.copper = 0;

    this.copper = function(amount) {
        this.copper = amount;
        return this;
    }
    this.silver = function(amount) {
        this.copper = amount * 10;
        return this;
    }
    this.gold = function(amount) {
        this.copper = amount * 100;
        return this;
    }
    this.platinum = function(amount) {
        this.copper = amount * 1000;
        return this;
    }

    this.fromDaily = function() {
        return this;
    }
    this.fromWeekly = function() {
        this.copper /= 10; // 10 days in a week.
        return this;
    }
    this.fromMonthly = function() {
        this.copper /= 30; // 30 days in a month
        return this;
    }

    this.toDaily = function() {
        return this;
    }
    this.toWeekly = function() {
        this.copper *= 10;
        return this;
    }
    this.toMonthly = function() {
        this.copper *= 30;
        return this;
    }

    this.toCopper = function() {
        return this;
    }
    this.toSilver = function() {
        this.copper *= 10;
        return this;
    }
    this.toGold = function() {
        this.copper *= 100;
        return this;
    }
    this.toPlatinum = function() {
        this.copper *= 1000;
        return this;
    }

    this.value = function() {
        return this.copper;
    }
}