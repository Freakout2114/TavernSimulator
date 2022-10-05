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

const { SlashCommandBuilder } = require('discord.js');
const Tavern = require('../src/tavern.js');

const calculate = function() {
    return new Tavern().calculateRevenue();
}

 module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculaterevenue')
        .setDescription('Calculate the revenue for the tavern.'),
    async execute(interaction) {
        const profit = calculate();
        await interaction.reply('Revenue: ' + profit);
    },
};