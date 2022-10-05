module.exports = async function(interaction, messages) {
    let alreadyReplied = false;
    let outMsg = '';
    for (let message of messages) {
        // Append the content of the mssage if possible.
        if (outMsg.length + message.length + '\n\n'.length < 2000) {
            outMsg += message + '\n\n';
        }
        // Otherwise send the current message.
        else {
            if (!alreadyReplied) {
                await interaction.reply(outMsg);
                alreadyReplied = true;
                outMsg = '';
            } else {
                await interaction.followUp(outMsg);
                outMsg = message + '\n\n';
            }
        }
    }

    // Send the remaining content of the message
    if (outMsg.length > 0) {
        if (!alreadyReplied) {
            await interaction.reply(outMsg);
        } else {
            await interaction.followUp(outMsg);
        }
    }
}