const fs = require('fs');
const path = require('node:path');
const messageReply = require('../util/messageReply.js');
const { SlashCommandBuilder } = require('discord.js');

const getUpgrades = function() {
    const upgradesPath = path.join(__dirname, '..', 'upgrades.json');
    const rawdata = fs.readFileSync(upgradesPath);
    const upgrades = JSON.parse(rawdata);

    return Object.values(upgrades);
}

const getAvailableUpgrades = function() {
    const upgrades = getUpgrades();
    return upgrades.filter(upgrade => {
        return upgrade.purchased === null || (upgrade.purchased + 1) < upgrade.cost.length;
    });
}

const sendMessages = async function(interaction, upgrades = []) {
    const outputMessages = [];

    for (let upgrade of upgrades) {
        const cost = upgrade.cost.map(val => `${val}gp`).join(', ');
        const valuation = upgrade.valuation.map(val => `+${val}`).join(', ');
        const benefit = (upgrade.benefit.length > 0) ? `\n**Benefit:** ${upgrade.benefit}` : '';
        const purchasedLevel = (upgrade.purchased !== null) ? `\n**Purchased**: Level ${upgrade.purchased+1}` : '';
        outputMessages.push(
            `**__${upgrade.title}__**\n` +
            `${upgrade.description}\n` +
            `**Cost:** ${cost}\n` +
            `**Valuation:** ${valuation}` +
            benefit +
            purchasedLevel
       );
    }

    messageReply(interaction, outputMessages);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('upgrades')
		.setDescription('Display a list of available upgrades!'),
	async execute(interaction) {
        const upgrades = getAvailableUpgrades();
        await sendMessages(interaction, upgrades);
	}
};