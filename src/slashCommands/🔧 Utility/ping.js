const { SlashCommandBuilder } = require("discord.js");
const Discord = require("discord.js");
const config = require("../../config.json");

module.exports = {
  config: {
    owner: false,
    premium: false,
    nsfw: false,
    category: "utility",
    description: "🏓 Replies with bot and API latency!",
    usage: "ping",
  },
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with bot and API latency!")
    .setNSFW(false)
    .setDMPermission(false),
  async execute(interaction, client) {
    // Make embed show "pinging..."
    const pinging = new Discord.EmbedBuilder()
      .setTitle("Ping Command:")
      .setColor("Random")
      .setDescription(`Awaiting Pinging...`);

    const msg = await interaction.reply({
      embeds: [pinging],
      fetchReply: true,
    });
    const apiLatency = msg.createdTimestamp - interaction.createdTimestamp;

    const pingEmbed = new Discord.EmbedBuilder()
      .setTitle("Pong!")
      .setColor(`${config.embedColor}`)
      .setDescription(
        `> 🏓 Bot Latency: **${
          Date.now() - interaction.createdTimestamp
        }ms**\n\n> 🏓 API Latency: **${Math.round(apiLatency)}ms**`
      )
      .setTimestamp();

    msg.edit({ embeds: [pingEmbed] }).catch(console.error);
  },
};
