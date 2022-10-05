const fs = require('fs');
const path = require('node:path');
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

module.exports = {
	data: new SlashCommandBuilder()
		.setName('upgrades')
		.setDescription('Display a list of available upgrades!'),
	async execute(interaction) {
        const upgrades = getAvailableUpgrades();

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

        let alreadyReplied = false;
        let outMsg = '';
        for (let outputMsg of outputMessages) {
            if (outMsg.length + outputMsg.length + '\n\n'.length < 2000) {
                outMsg += outputMsg + '\n\n';
            } else {
                if (!alreadyReplied) {
                    await interaction.reply(outMsg);
                    outMsg = '';
                    alreadyReplied = true;
                } else {
                    await interaction.followUp(outMsg);
                    outMsg = outputMsg + '\n\n';
                }
            }
        }
        if (outMsg.length > 0) {
            if (!alreadyReplied) {
                await interaction.reply(outMsg);
            } else {
                await interaction.followUp(outMsg);
            }
        }
	}
};