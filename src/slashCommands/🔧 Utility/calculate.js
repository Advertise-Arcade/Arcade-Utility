const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const mathjs = require("mathjs");

module.exports = {
  config: {
    owner: false,
    premium: false,
    nsfw: false,
    category: "utility",
    description: "🏓 Evaluates an expression!",
    usage: "ping",
  },
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("calculate")
    .setDescription("Evaluates an expression!")
    .setNSFW(false)
    .addStringOption((option) =>
      option
        .setName("expression")
        .setDescription("The expression to evaluate.")
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction, client) {
    const expression = interaction.options.getString("expression");

    try {
      mathjs.evaluate(expression);
    } catch {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`An error occurred:`)
            .setDescription(`Failed to evaluate!`)
            .setColor(`Red`)
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    }

    const result = mathjs.evaluate(expression);

    const embed = new EmbedBuilder()
      .setTitle(`Evaulation:`)
      .setDescription(`**${result}**`)
      .setColor(`Blurple`)
      .setTimestamp();

    return await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
