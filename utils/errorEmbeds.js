const Discord = require("discord.js");
const fs = require("fs");

module.exports.errors = (message, command) => {

    let errorEmbed = new Discord.RichEmbed()
    .setTitle("⛔ Invalid Usage!")
    .setDescription(`**${command.help.description}**`)
    .addField("Command:", `\`${command.help.name}\``)
    .addField("Usage:", `\`\`\`${command.help.usage}\`\`\``)
    .addField("Example:", `\`\`\`${command.help.example}\`\`\``)
    .setColor("#ef5350");
    message.reply(errorEmbed);

}