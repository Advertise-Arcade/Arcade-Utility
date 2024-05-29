const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  config: {
    owner: false,
    premium: false,
    nsfw: false,
    category: "actions",
    description: "🏓 Does a specified action to a user!",
    usage: "action <action> <user>",
  },
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("action")
    .setDescription("🏓 Evaluates an expression!")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("hug")
        .setDescription("Hugs a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to hug!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("kill")
        .setDescription("Kills a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to kill!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("nom")
        .setDescription("Noms a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to nom!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("slap")
        .setDescription("Slaps a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to slap!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("cuddle")
        .setDescription("Cuddles a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to cuddle!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("pat")
        .setDescription("Pats a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to pat!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("lick")
        .setDescription("Licks a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to lick!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("kiss")
        .setDescription("Kisses a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to kiss!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bonk")
        .setDescription("Bonks a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to bonk!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("kick")
        .setDescription("Kicks a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to kick!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("yeet")
        .setDescription("Yeets a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to yeet!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("pokes")
        .setDescription("Pokes a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to poke!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("handhold")
        .setDescription("Handholds a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to handhold!")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const actionType = interaction.options.getSubcommand();
    const member = interaction.options.getUser("user");

    const response = await fetch(`https://api.waifu.pics/sfw/${actionType}`, {
      headers: {
        Accept: "application/json", // Specify JSON response format
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const gif = data.url;

    // Button

    const gifButton = new ButtonBuilder()
      .setLabel("Gif URL")
      .setURL(gif)
      .setStyle(ButtonStyle.Link);

    const buttonRow = new ActionRowBuilder().addComponents(gifButton);

    if (member.id === interaction.member.id) {
      return interaction.followUp(
        "*You try to hug yourself... and fail miserably...* ;-;"
      );
    } else {
      const embed = new EmbedBuilder()
        .setAuthor({
          iconURL: `${interaction.user.displayAvatarURL({
            dynamic: true,
            size: 2048,
          })}`,
          name: `${interaction.user.tag} ${actionType}s ${member.tag}`,
        })
        .setImage(gif)
        .setTimestamp();

      const reply = await interaction.followUp({
        embeds: [embed],
        components: [buttonRow],
      });

      // Button Collector
      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 300000, // 300000 Milliseconds = 5 Minutes
      });

      collector.on("end", () => {
        gifButton.setDisabled(true);

        reply.edit({
          components: [buttonRow],
        });
      });
    }
  },
};
