const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");
const serverConfigSchema = require("../../Schemas/serverConfig");

module.exports = {
  config: {
    owner: false,
  },
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Edit the server's configuration!")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("prefix")
        .setDescription("Change the server's prefix!")
        .addStringOption((option) =>
          option
            .setName("prefix")
            .setDescription("The new prefix!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("leveling")
        .setDescription("Enable or disable leveling!")
        .addBooleanOption((option) =>
          option
            .setName("enabled")
            .setDescription("Enable or disable leveling!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("get")
        .setDescription("View the server's configuration!")
    )
    .setNSFW(false),
  async execute(interaction) {
    await interaction.deferReply();
    const serverConfig = await serverConfigSchema.findOne({
      Guild: interaction.guild.id,
    });

    if (!serverConfig) {
      serverConfig.create({
        Guild: interaction.guild.id,
        Prefix: interaction.client.config.prefix,
        levelingEnabled: true,
        nsfwEnabled: false,
        premium: false,
      });
    }

    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "prefix") {
      const newPrefix = interaction.options.getString("prefix");
      serverConfig.Prefix = newPrefix;
      await serverConfig.save();
    } else if (subcommand === "leveling") {
      const levelingEnabled = interaction.options.getBoolean("enabled");
      serverConfig.levelingEnabled = levelingEnabled;
      await serverConfig.save();
    }

    const configEmbed = new EmbedBuilder()
      .setTitle("Cot Utility - Server Configuration:")
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setColor("Red")
      .setDescription(
        `**╔ Prefix:** ${serverConfig.Prefix}\n**╠ Leveling:** ${
          serverConfig.levelingEnabled ? "Enabled" : "Disabled"
        }\n**╚ Premium:** ${serverConfig.premium ? "Enabled" : "Disabled"}`
      )
      .setFooter({ text: `Requested By ${interaction.user.tag}` })
      .setTimestamp();

    return await interaction.followUp({ embeds: [configEmbed] });
  },
};
