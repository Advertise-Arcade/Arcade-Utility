const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    owner: false,
    premium: false,
    nsfw: false,
    category: "fun",
    description: "How smart are you?",
    usage: "iq <@user>",
  },
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("iq")
    .setDescription("How smart are you?")
    .setNSFW(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to check!")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user") || interaction.user;

    let percent = Math.floor(Math.random() * 200);
    if (user.id === "829402172553822270") {
      percent = -1;
    }

    let response = "";

    if (percent < 60) {
      response = "⚠️ You are in the CRITICAL range! You are not very smart...";
    } else if (percent <= 100) {
      response = "You are average. Consider going back to school!";
    } else if (percent >= 101) {
      response = "🧠 You are very smart! Einstein is proud of you!";
    }

    const embed = new EmbedBuilder()
      .setTitle(`${user.username} has an IQ of **${percent}**!`)
      .setDescription(response)
      .setColor("Red")
      .setTimestamp();
    interaction.followUp({ embeds: [embed] });
  },
};
