const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    owner: false,
    premium: false,
    nsfw: false,
    category: "moderation",
    description: "Revokes an adwarn from a user!",
    usage: "adwarn_revoke <@user> <reason>",
  },
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("adwarn_revoke")
    .setDMPermission(false)
    .setDescription("Revoke a user's adwarn!")
    .addUserOption((option) =>
      option
        .setDescription("The user to revoke an adwarn from!")
        .setName("user")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setDescription("The reason for the removing!")
        .setName("reason")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    client = interaction.client;
    const userAdwarns = require("../../Schemas/userAdwarns");

    const moderator = interaction.user;
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    if (
      !interaction.member.roles.cache.some(
        (role) => role.id === "1118665903349977110"
      )
    ) {
      return await interaction.editReply({
        content: "❌ **You don't have permission to use this command!**",
        ephemeral: true,
      });
    }

    if (user.bot) {
      return await interaction.editReply({
        content: "❌ **You can't revoke an adwarn from a bot!**",
        ephemeral: true,
      });
    }

    if (user.id === moderator.id) {
      return await interaction.editReply({
        content: "❌ **You revoke a warn from yourself!**",
        ephemeral: true,
      });
    }

    const openModerationChannel = client.channels.cache.get(
      "1118661043191808071"
    );

    const userAdwarnData = await userAdwarns.findOne({ user: user.id });

    if (!userAdwarnData) {
      return await interaction.followUp({
        content: "❌ **This user has no adwarns!**",
        ephemeral: true,
      });
    } else {
      if (userAdwarnData.warns <= 0) {
        return await interaction.followUp({
          content: "❌ **This user has no adwarns!**",
          ephemeral: true,
        });
      }
      userAdwarnData.warns -= 1;
      await userAdwarnData.save();
    }

    const channelEmbed = new EmbedBuilder()
      .setTitle("Advertisement Warning - Revoked")
      .setColor("Green")
      .setAuthor({
        name: "Cot Advertisements",
        iconURL: `${interaction.guild.iconURL({ dynamic: true, size: 256 })}`,
      })
      .addFields(
        {
          name: "<:FA_user:1120340156344447057> User:",
          value: `<:FA_reply3:1120339686385270806> **User:** ${user}\n<:FA_reply3:1120339686385270806> **Reason:** ${reason}\n<:FA_reply3:1120339686385270806> **Warns:** ${userAdwarnData.warns}`,
        },
        {
          name: "<:FA_user:1120340156344447057> Moderator:",
          value: `<:FA_reply3:1120339686385270806> **Moderator:** ${moderator}\n<:FA_reply3:1120339686385270806> **Moderator ID:** \`${
            moderator.id
          }\`\n<:FA_reply3:1120339686385270806> **Date:** \`${new Date().toLocaleString()}\``,
        }
      )
      .setTimestamp()
      .setFooter({ text: `Made By @bella.js` });

    const userEmbed = new EmbedBuilder()
      .setTitle("Advertisement Warning - Revoked")
      .setColor("Green")
      .setAuthor({
        name: "Cot Advertisements",
        iconURL: `${interaction.guild.iconURL({ dynamic: true, size: 256 })}`,
      })
      .setDescription(
        `Hey ${user}, an advertisement warning of yours has been revoked!`
      )
      .setTimestamp()
      .setFooter({ text: `Made By @bella.js` });

    await openModerationChannel.send({
      content: `${user}`,
      embeds: [channelEmbed],
    });
    await user.send({ embeds: [userEmbed] });

    await interaction.followUp({
      ephemeral: true,
      content: `Successfully revoked adwarn from ${user}!`,
    });
  },
};
