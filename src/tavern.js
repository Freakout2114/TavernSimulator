const fs = require('fs');
const path = require('node:path');
const Currency = require('../util/currency.js');
const Dice = require('../util/dice.js');
const jsonLoader = require('../util/jsonLoader.js');
const TavernEvent = require('../model/tavernEvent.js');

module.exports = class Tavern {
    constructor() {
        this.valuation = this.calculateValuation();
        this.employeeCount = 8;
        this.balance = new Currency();
    }

    simulate() {
        // Generate tavern performance
        let percentage = Math.random();

        // Get the tavern event
        const tavernEvent = this.getTavernEvent();

        if (tavernEvent) {
            if (tavernEvent.businessRollModifier) {
                percentage += tavernEvent.businessRollModifier / 100.0;
            }
        }

        const revenueObj = this.calculateRevenue(percentage, tavernEvent);

        // Update balance
        this.balance.add(revenueObj.profit.value());

        const overview = this.getOverview(revenueObj, tavernEvent);

        console.log("overview: \n", overview);
        return overview;
    }

    /**
     * Output layout?
     *
     * **Net Value**: $$$
     *
     * **Revenue**: $$$
     *
     * **Breakdown**:
     * Base Profit: $$$
     * Employee Wages: $$$
     * Upgrade Bonuses: $$$
     * Tavern event: $$$
     *
     * Tavern Quality: Poor (Valuation: 10)
     *
     * **Tavern Event**:
     * Bla bla bla bla
     *
     * **Ongoing events**:
     * Bla bla bla
     */
    getOverview(revenueObj, tavernEvent) {
        const {
            baseProfit,
            employeeWages,
            upgrades,
            profit,
            tavernPerformance,
            businessResult
        } = revenueObj;

        const output = [];
        output.push(`**Balance**: ${this.balance.toString()}`);
        output.push(``);
        output.push(`**Revenue**: ${profit.toString()}`);
        output.push(``);
        output.push(`**Breakdown**`);
        output.push(`Base Profit: ${baseProfit.toString()} | ${tavernPerformance} week`);
        output.push(`Upgrade Bonuses: ${upgrades.toString()}`);
        output.push(`Employee Wages: -${employeeWages.toString()}`);

        if (tavernEvent) {
            output.push(`Business Result: ${businessResult.toString()}`);
        }

        if (tavernEvent.cost) {
            output.push(`Tavern event: -${tavernEvent.cost.toString()}`);
        }

        output.push(``);
        output.push(`Tavern Quality: ${this.getQuality().name} (Valuation: ${this.valuation})`);

        if (tavernEvent) {
            output.push(`\n**Tavern Event**`);
            output.push(tavernEvent.description);
        }

        return output.join('\n');
    }

    calculateRevenue(percentage, tavernEvent) {
        console.log("Percentage Rolled: ", percentage);
        this.calculateValuation();

        const expectedCost = this.getExpectedCostPerTenday();
        const profitPercentage = (percentage * 38 - 8) / 100.0; // Range from -8% to +30%
        const tavernPerformance = this.getTavernPerformance(percentage)

        // Costs include N workers, where N = Expected Cost / 10 (round up). Non-living staff can count as 2 workers.
        const employeeCount = this.employeeCount;
        const employeeWage = new Currency().copper(60).fromMonthly().toWeekly();

        // If any staff are unpaid, add 3 gp per tenday to the profit.

        // If any paid staff are paid in part with room and board, add 1 gp per tenday to the profit.

        // If the tavern has any of the applicable upgrades that increase revenue (upgraded cobble streets, luxury beer engine,
        // luxury cellar, luxury hearth, luxury kitchen, luxury larder, luxury taproom), remember to add the appropriate amount to the final profit.

        // If one or more characters spend a full Downtime managing tavern operations, they may add 1d4 to the profit percentage roll.

        // Tavern event
        let businessResult = 0;
        if (tavernEvent) {
            console.log("tavernEvent.businessRollModifier: ", tavernEvent.businessRollModifier);
            const businessRollModifier = (tavernEvent.businessRollModifier || 0) / 100.0;
            const getBusinessResult = this.getBusinessResult(percentage + businessRollModifier);
            console.log("getBusinessResult: ", getBusinessResult);
            businessResult = new Currency().gold(Dice.parse(getBusinessResult));
            console.log("businessResult: ", businessResult.toString());
        }

        console.log("expectedCost: ", expectedCost.toString());

        const baseProfit = expectedCost.mult(profitPercentage);
        const employeeWages = employeeWage.mult(employeeCount);
        const upgrades = new Currency().gold(this.calculateUpgradeRevenue());
        const tavernEventCost = (tavernEvent.cost) ? tavernEvent.cost : new Currency();

        const profit = new Currency().copper(
            baseProfit.value()
            + upgrades.value()
            - employeeWages.value()
            - tavernEventCost.value()
            + businessResult.value()
        );

        return {
            baseProfit,
            employeeWages,
            upgrades,
            profit,
            tavernPerformance,
            businessResult
        };
    }

    calculateValuation() {
        const purchasedUpgrades = this.getPurchasedUpgrades();
        let valuation = 0;

        for (let upgrade of purchasedUpgrades) {
            valuation += upgrade.valuation[upgrade.purchased];
        }
        this.valuation = valuation;
        return valuation;
    }

    calculateUpgradeRevenue() {
        const purchasedUpgrades = this.getPurchasedUpgrades();
        let revenue = 0;

        for (let upgrade of purchasedUpgrades) {
            if (upgrade.revenue !== null) {
                revenue += upgrade.revenue;
            }
        }
        return revenue;
    }

    getUpgrades() {
        const upgradesPath = path.join(__dirname, '..', 'upgrades.json');
        const rawdata = fs.readFileSync(upgradesPath);
        const upgrades = JSON.parse(rawdata);

        return Object.values(upgrades);
    }

    getPurchasedUpgrades() {
        const upgrades = this.getUpgrades();
        return upgrades.filter(upgrade => upgrade.purchased !== null);
    }

    getQuality() {
        const valuation = this.valuation;
        if (valuation <= 5) { return { index: 0, name: 'Squalid' }; }
        else if (valuation <= 12) { return { index: 1, name: 'Poor' }; }
        else if (valuation <= 19) { return { index: 2, name: 'Modest' }; }
        else if (valuation <= 49) { return { index: 3, name: 'Confortable' }; }
        else if (valuation <= 69) { return { index: 4, name: 'Wealthy' }; }
        else { return { index: 5, name: 'Aristocratic' }; }
    }

    getTavernPerformance(percentage) {
        const tavernPerformance = [
            'Ghost Town',
            'Empty',
            'Slow',
            'Quiet',
            'Busy',
            'Normal',
            'Packed',
            'Flooded',
            'Full-on',
            'Bustling',
            'Chaotic'
        ];

        percentage = Math.max(0.0, Math.min(1.0, percentage));

        return tavernPerformance[Math.floor(tavernPerformance.length * percentage)];
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
    getExpectedCostPerTenday() {
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

    getBusinessResult(percentage) {
        const d100 = percentage * 100;
        const tavernQualityIndex = this.getQuality().index;
        let index = 0;

        console.log("d100: ", d100);

        if (d100 > 20) index++;
        if (d100 > 30) index++;
        if (d100 > 40) index++;
        if (d100 > 60) index++;
        if (d100 > 80) index++;
        if (d100 > 90) index++;
        if (d100 > 110) index++;
        if (d100 > 130) index++;

        return [
            [ // "01-20"
                "0 - 3d10 * 3",
                "0 - 3d10 * 4",
                "0 - 3d10 * 5",
                "0 - 3d10 * 6",
                "0 - 3d10 * 8",
                "0 - 3d10 * 10"
            ],
            [ // "21-30"
                "0 - 2d8 * 3",
                "0 - 2d8 * 4",
                "0 - 2d8 * 5",
                "0 - 2d8 * 6",
                "0 - 2d8 * 8",
                "0 - 2d8 * 10"
            ],
            [ // "31-40"
                "0 - 1d6 * 3",
                "0 - 1d6 * 4",
                "0 - 1d6 * 5",
                "0 - 1d6 * 6",
                "0 - 1d6 * 8",
                "0 - 1d6 * 10"
            ],
            [ // "41-60"
                "0",
                "0",
                "0",
                "0",
                "0",
                "0"
            ],
            [ // "61-80"
                "1d6",
                "1d6 * 3",
                "1d6 * 5",
                "1d6 * 7",
                "1d6 * 9",
                "1d6 * 12"
            ],
            [ // "81-90"
                "2d8",
                "2d8 * 3",
                "2d8 * 5",
                "2d8 * 7",
                "2d8 * 9",
                "2d8 * 12"
            ],
            [ // "91-110"
                "3d10",
                "3d10 * 3",
                "3d10 * 5",
                "3d10 * 7",
                "3d10 * 9",
                "3d10 * 12"
            ],
            [ // "111-130"
                "5d10",
                "5d10 * 3",
                "5d10 * 5",
                "5d10 * 7",
                "5d10 * 9",
                "5d10 * 12"
            ],
            [ // "131+"
                "7d10",
                "7d10 * 3",
                "7d10 * 5",
                "7d10 * 7",
                "7d10 * 9",
                "7d10 * 12"
            ]
        ][index][tavernQualityIndex];
    }

    getTavernEvent() {
        const threshold = 0.3;

        // if (Math.random() > threshold) {
        //     return null;
        // }
        const index = Math.floor(Math.random() * 100);
        // const index = 3;
        const events = Object.values(jsonLoader('../events.json'));
        const event = events[index];

        return new TavernEvent(event);
    }
};