const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");
const package = require("../../../package.json");

module.exports = {
  config: {
    owner: false,
    category: "info",
  },
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("host")
    .setDescription("🖥️ Gives information about the bot's host!")
    .setDMPermission(false),

  async execute(interaction, client) {
    const infoEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(
        `**${client.user.username} v${package.version} - Host Information**`
      )
      .addFields(
        {
          name: `Platform:`,
          value: `${os.platform()}`,
        },
        {
          name: `OS Version:`,
          value: `${os.release()}`,
        },
        {
          name: `CPU:`,
          value: os.cpus()[0].model,
        },
        {
          name: "CPU Cores:",
          value: `${os.cpus().length / 2}`,
        },
        {
          name: "Total RAM:",
          value: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        },
        {
          name: "Storage Used:",
          value: `${(
            (os.totalmem() - os.freemem()) /
            1024 /
            1024 /
            1024
          ).toFixed(2)} GB`,
        }
      );

    return await interaction.reply({ embeds: [infoEmbed] });
  },
};
