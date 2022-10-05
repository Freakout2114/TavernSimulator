const Currency = require('../util/currency.js');
module.exports = function() {

    this.valuation = 1;
    this.employeeCount = 8;

    this.getOverview = function(revenueObj) {
        const {
            baseProfit,
            employeeWages,
            upgrades,
            profit
        } = revenueObj;

        return `**Revenue**: ${profit.toString()}\n` +
            `\n` +
            `**Breakdown**\n` +
            `Base Profit: ${baseProfit.toString()}\n` +
            `Employee Wages: -${employeeWages.toString()}\n` +
            `Upgrade Bonuses: ${upgrades.toString()}`;
    }

    this.calculateRevenue = function() {
        const expectedCost = this.getExpectedCostPerTenday();
        const profitPercentage = (Math.random() * 38 - 8) / 100.0; // Range from -8% to +30%

        // Costs include N workers, where N = Expected Cost / 10 (round up). Non-living staff can count as 2 workers.
        const employeeCount = this.employeeCount;
        const employeeWage = new Currency().copper(60).fromMonthly().toWeekly();

        // If any staff are unpaid, add 3 gp per tenday to the profit.

        // If any paid staff are paid in part with room and board, add 1 gp per tenday to the profit.

        // If the tavern has any of the applicable upgrades that increase revenue (upgraded cobble streets, luxury beer engine,
        // luxury cellar, luxury hearth, luxury kitchen, luxury larder, luxury taproom), remember to add the appropriate amount to the final profit.

        // If one or more characters spend a full Downtime managing tavern operations, they may add 1d4 to the profit percentage roll.

        const baseProfit = expectedCost.mult(profitPercentage);
        const employeeWages = employeeWage.mult(employeeCount);
        const upgrades = new Currency();

        const profit = new Currency().copper(baseProfit.value() - employeeWages.value() + upgrades.value());

        return {
            baseProfit,
            employeeWages,
            upgrades,
            profit
        };

    }

    this.getQuality = function() {
        const valuation = this.valuation;
        if (valuation <= 5) {
            return 'Squalid';
        } else if (valuation <= 12) {
            return 'Poor';
        } else if (valuation <= 19) {
            return 'Modest';
        } else if (valuation <= 30) {
            return 'Confortable';
        } else if (valuation <= 44) {
            return 'Upscale';
        } else {
            return 'Aristocratic';
        }
    }

    /**
     * Once a tenday, the party should roll 2d20 - 10 to determine the profit percentage (range -8% to +30%).
     *
     * To calculate profits earned, multiply the percentage by the cost found on the chart below.
     *
     * Valuation    Tavern Quality      Expected Cost Per Tenday
     * 1-5          Squalid             45 gp
     * 6-12         Poor                60 gp
     * 13-19        Modest              75 gp
     * 20-30        Comfortable         95 gp
     * 31-44        Upscale             125 gp
     * 45+          Aristocratic        160 gp
     */
    this.getExpectedCostPerTenday = function() {
        const valuation = this.valuation;
        if (valuation <= 5) {
            return new Currency().gold(45);
        } else if (valuation <= 12) {
            return new Currency().gold(60);
        } else if (valuation <= 19) {
            return new Currency().gold(75);
        } else if (valuation <= 30) {
            return new Currency().gold(95);
        } else if (valuation <= 44) {
            return new Currency().gold(125);
        } else {
            return new Currency().gold(160);
        }
    }
};