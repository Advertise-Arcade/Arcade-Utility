const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    owner: false,
    premium: false,
    nsfw: false,
    category: "moderation",
    description: "Check how many adwarns a user has.",
    usage: "adwarn_amount <@user>",
  },
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("adwarn_amount")
    .setDMPermission(false)
    .setDescription("Check how many adwarns a user has!")
    .addUserOption((option) =>
      option
        .setDescription("The user to check the adwarns of!")
        .setName("user")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();

    const userAdwarns = require("../../Schemas/userAdwarns");
    const user = interaction.options.getUser("user");

    const userAdwarnsData = await userAdwarns.findOne({
      user: user.id,
    });

    let warnsEmbed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ text: `Cot Advertisements` });

    if (!userAdwarnsData) {
      warnsEmbed.setDescription(
        `<:FA_user:1120340156344447057> This user has no adwarns!`
      );
    } else {
      warnsEmbed.setDescription(
        `<:FA_user:1120340156344447057> This user has **${userAdwarnsData.warns}** adwarns.`
      );
    }

    await interaction.followUp({ embeds: [warnsEmbed] });
  },
};
