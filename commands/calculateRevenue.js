const { SlashCommandBuilder } = require('discord.js');
const Tavern = require('../src/tavern.js');

const calculate = function() {
    const tavern = new Tavern();
    const revenueObj = tavern.calculateRevenue();
    const overview = tavern.getOverview(revenueObj);
    return overview;
}

 module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculaterevenue')
        .setDescription('Calculate the revenue for the tavern.'),
    async execute(interaction) {
        const result = calculate();
        await interaction.reply(result);
    },
};