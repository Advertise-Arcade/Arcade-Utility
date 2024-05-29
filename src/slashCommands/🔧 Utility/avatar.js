const { SlashCommandBuilder } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  config: {
    owner: false,
    premium: false,
    nsfw: false,
    category: "utility",
    description: "🏓 Replies with a specific user's avatar!",
    usage: "avatar <user>",
  },
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Replies with a specific user's avatar!")
    .setNSFW(false)
    .addUserOption((option) =>
      option
        .setDescription("The user you want to get the avatar of.")
        .setName("user")
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction, client) {
    const user = interaction.options.getUser("user");

    avatarURL = user.displayAvatarURL({ dynamic: true, size: 2048 });

    const avatarEmbed = new Discord.EmbedBuilder()
      .setTitle(`${user.username}'s Avatar`)
      .setDescription(`[Avatar URL](${avatarURL})`)
      .setColor(`Blurple`)
      .setImage(avatarURL)
      .setTimestamp();

    return await interaction.reply({ embeds: [avatarEmbed], ephemeral: true });
  },
};
