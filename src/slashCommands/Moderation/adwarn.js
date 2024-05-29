const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    owner: false,
    premium: false,
    nsfw: false,
    category: "moderation",
    description: "Warns a user for a violating advertisement!",
    usage: "adwarn <@user> <reason>",
  },
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("adwarn")
    .setDMPermission(false)
    .setDescription("Warns a user for a violating advertisement!")
    .addUserOption((option) =>
      option
        .setDescription("The user to warn!")
        .setName("user")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setDescription(
          "The channel where the violating advertisement was sent."
        )
        .setName("channel")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setDescription("The reason for the warning!")
        .setName("reason")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    client = interaction.client;
    const userAdwarns = require("../../Schemas/userAdwarns");

    const moderator = interaction.user;
    const user = interaction.options.getUser("user");
    const channel = interaction.options.getChannel("channel");
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
        content: "❌ **You can't warn a bot!**",
        ephemeral: true,
      });
    }

    if (user.id === moderator.id) {
      return await interaction.editReply({
        content: "❌ **You can't warn yourself!**",
        ephemeral: true,
      });
    }

    const openModerationChannel = client.channels.cache.get(
      "1118661043191808071"
    );

    const userAdwarnData = await userAdwarns.findOne({ user: user.id });

    if (!userAdwarnData) {
      userAdwarns.create({
        user: user.id,
        warns: 1,
      });
    } else {
      userAdwarnData.warns += 1;
      await userAdwarnData.save();
    }

    const channelEmbed = new EmbedBuilder()
      .setTitle("Advertisement Warning")
      .setColor("Red")
      .setAuthor({
        name: "Cot Advertisements",
        iconURL: `${interaction.guild.iconURL({ dynamic: true, size: 256 })}`,
      })
      .addFields(
        {
          name: "<:FA_user:1120340156344447057> User:",
          value: `<:FA_reply3:1120339686385270806> **User:** ${user}\n<:FA_reply3:1120339686385270806> **Channel:** ${channel}\n<:FA_reply3:1120339686385270806> **Reason:** ${reason}\n<:FA_reply3:1120339686385270806> **Warns:** ${userAdwarnData.warns}`,
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
      .setTitle("Advertisement Warning")
      .setColor("Yellow")
      .setAuthor({
        name: "Cot Advertisements",
        iconURL: `${interaction.guild.iconURL({ dynamic: true, size: 256 })}`,
      })
      .setDescription(
        `Hey ${user}, you have been warned for violating an advertisement rules! Read <#1118918441517207603> for information on advertisement rules!`
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
      content: `Successfully warned ${user}!`,
    });
  },
};
