const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    owner: false,
    premium: false,
    nsfw: false,
    category: "fun",
    description: "How gay are you?",
    usage: "gay <@user>",
  },
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("gay")
    .setDescription("How gay are you?")
    .setNSFW(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to check")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user") || interaction.user;

    let percent = Math.floor(Math.random() * 101);
    if (user.id === "829402172553822270") {
      percent = 999;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${user.username} is **${percent}%** gay. 🌈`)
      .setColor("Red")
      .setTimestamp();
    interaction.followUp({ embeds: [embed] });
  },
};
