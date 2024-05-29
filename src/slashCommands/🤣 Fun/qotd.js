const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    owner: false,
    premium: false,
    nsfw: false,
    category: "fun",
    description: "Creates a QOTD!",
    usage: "qotd <question>",
  },
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("qotd")
    .setDescription("Creates a QOTD!")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question for the QOTD!")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    1;

    const qotdModel = require("../../Schemas/qotd");
    let lastQotd = await qotdModel.findOne();

    if (!lastQotd) {
      await qotdModel.create({ timestamp: Date.now() });
      qotdModel.save();
      lastQotd = await qotdModel.findOne();
    }

    lastQotd.timestamp = Date.now();

    if (
      !interaction.member.roles.cache.some(
        (r) => r.id === "1129224161772970065" // Role is "Events Team"
      )
    ) {
      return await interaction.followUp({
        content: "❌ **You don't have permission to use this command!**",
        ephemeral: true,
      });
    }
    const question = interaction.options.getString("question");

    const qotdChannel = client.channels.cache.get("1118662577413685331");

    const qotdEmbed = new EmbedBuilder()
      .setTitle("Question of the Day:")
      .setDescription(`**${question}**`)
      .setColor("Red")
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setTimestamp();

    const qotdMessage = await qotdChannel.send({
      content: "<@&1118671758782898176>",
      embeds: [qotdEmbed],
    });

    await qotdMessage.startThread({
      name: "Answer Here!",
      reason: "Question of the Day",
    });

    await interaction.followUp({
      content: "✅ **Question of the Day created!**",
      ephemeral: true,
    });
  },
};
