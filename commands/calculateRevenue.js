const { SlashCommandBuilder } = require('discord.js');
const Tavern = require('../src/tavern.js');

const calculate = function() {
    const tavern = new Tavern();
    return tavern.simulate();
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