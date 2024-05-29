const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");

module.exports = {
  config: {
    owner: false,
    premium: false,
    nsfw: false,
    category: "utility",
    description: "🏓 Replies with bot and hosts uptime!",
    usage: "uptime",
  },
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("🏓 Replies with bot and hosts uptime!")
    .setNSFW(false)
    .setDMPermission(false),
  async execute(interaction, client) {
    await interaction.deferReply();

    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

    function format(seconds) {
      function pad(s) {
        return (s < 10 ? "0" : "") + s;
      }
      let hostHours = Math.floor(seconds / (60 * 60));
      let hostMinutes = Math.floor((seconds % (60 * 60)) / 60);
      let hostSeconds = Math.floor(seconds % 60);

      return `${pad(hostHours)} hours, ${pad(hostMinutes)} minutes, and ${pad(
        hostSeconds
      )} seconds`;
    }

    const hostUptime = os.uptime();
    const hostUptimeFormatted = format(hostUptime);

    const embed = new EmbedBuilder()
      .setTitle("Cot Utility Uptime:")
      .setAuthor({
        name: "Cot Utility",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("Random")
      .setDescription(
        `<:icons_djoin:1234359282716377098> Bot Uptime: **${uptime}**\n<:icons_djoin:1234359282716377098> Host Uptime: **${hostUptimeFormatted}**`
      );

    interaction.followUp({ embeds: [embed] });
  },
};
