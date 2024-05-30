const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const package = require("../../../package.json");
const { ownerID } = require("../../config.json");

module.exports = {
  config: {
    owner: false,
    category: "info",
  },
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("🤖 Gives information about the bot!")
    .setDMPermission(false),

  async execute(interaction, client) {
    const commandUsage = require("../../Schemas/commandUsage");
    const commandUsageData = await commandUsage.findOne();

    const developer = await client.users.fetch(ownerID);
    const creationTimestamp = `<t:${parseInt(
      client.user.createdTimestamp / 1000
    )}:R>`;

    const infoEmbed = new EmbedBuilder()
      .setAuthor({ name: client.user.username })
      .setColor("Blurple")
      .setFooter({ text: `Bot ID: ${client.user.id}` })
      .addFields(
        {
          name: `Version:`,
          value: `${package.version}`,
          inline: true,
        },
        {
          name: `Developer:`,
          value: `\`@${developer.username}\``,
          inline: true,
        },
        {
          name: `Created:`,
          value: `${creationTimestamp}`,
          inline: true,
        },
        {
          name: `Total Commands:`,
          value: `${client.slashCommands.size}`,
          inline: true,
        },
        {
          name: `Commands Used:`,
          value: `${commandUsageData.amountOfCommandsUsed}`,
          inline: true,
        }
      );

    return await interaction.reply({ embeds: [infoEmbed], ephemeral: true });
  },
};
