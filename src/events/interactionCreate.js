const { Collection, EmbedBuilder } = require("discord.js");
const { bold, blue, magenta } = require("colorette");

module.exports = async (client, interaction) => {
  const config = require("../config.json");
  const errorChannel = config.errorChannel;
  if (!interaction.isChatInputCommand()) return;

  const slashCommand = interaction.client.slashCommands.get(
    interaction.commandName
  );

  if (!slashCommand) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  const serverConfig = require("../Schemas/serverConfig");
  async function getServerConfig() {
    const guildID = interaction.guild.id;
    const data = await serverConfig.findOne({ Guild: guildID });

    if (data) {
      return data;
    } else {
      serverConfig.create({
        Guild: guildID,
        Prefix: interaction.client.config.prefix,
        levelingEnabled: true,
        nsfwEnabled: false,
        premium: false,
      });

      return serverConfig.findOne({ Guild: guildID });
    }
  }

  const serverConfigData = await getServerConfig();

  const owners = client.config.ownerID;

  if (slashCommand.config.owner && !owners.includes(interaction.user.id))
    return await interaction.reply({
      content: "You are not authorized to use this command.",
      ephemeral: true,
    });

  async function checkCommandPremium() {
    if (slashCommand.config.premium) {
      return true;
    } else {
      return false;
    }
  }

  const isPremium = await checkCommandPremium();

  if (isPremium && !serverConfigData.premium)
    return await interaction.reply({
      content:
        "This command is premium only! This guild does not have premium!",
      ephemeral: true,
    });

  const blacklistuser = require("../Schemas/blacklistuser");

  async function blacklistSystem() {
    const userID = interaction.user.id;
    const data = await blacklistuser.findOne({ User: userID });

    if (data) {
      interaction.reply(
        `You are blacklisted from using ${client.user.username}!\n**Reason:** \`${data.Reason}\`\n**Time:** \`${data.Timestamp} EST\``
      );
      return true; // Stop further execution if blacklisted
    } else {
      return false;
    }
  }

  const isBlacklisted = await blacklistSystem();
  if (isBlacklisted) return;

  if (slashCommand.config.nsfw && !interaction.channel.nsfw)
    return await interaction.reply({
      content: `This command must be ran inside of an NSFW locked channel!`,
      ephemeral: true,
    });

  if (slashCommand.config.nsfw && !serverConfigData.nsfwEnabled) {
    return await interaction.reply({
      content: `NSFW commands are disabled in this server!`,
      ephemeral: true,
    });
  }

  const { cooldowns } = interaction.client;

  if (!cooldowns.has(slashCommand.data.name)) {
    cooldowns.set(slashCommand.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(slashCommand.data.name);
  const defaultCooldownDuration = 3;
  const cooldownAmount =
    (slashCommand.cooldown ?? defaultCooldownDuration) * 1_000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1_000);
      return interaction.reply({
        content: `You are on a cooldown for \`${slashCommand.data.name}\`! You can use it again <t:${expiredTimestamp}:R>.`,
        ephemeral: true,
      });
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  incrementCommandUsage();

  try {
    await slashCommand.execute(interaction, client);
  } catch (error) {
    console.error(`❌ Error occured: ${error}`);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "❌ There was an error while executing this slash command!",
        ephemeral: true,
      });

      // Error Flag System
      const logChannel = await client.channels.fetch("1238923864529174539"); // Replace with your error log channel

      const member = interaction.user.tag;
      const guild = interaction.guild.name;
      const channel = interaction.channel.name;
      const errorTime = `<t:${Math.floor(Date.now() / 1000)}:R>`;

      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`❌ An error occured!`)
        .setDescription(
          `An error has occured while using a slash command!
        **Guild:** ${guild}
        **Channel:** ${channel}
        **User:** ${member}`
        )
        .setFields(
          { name: `Error Command:`, value: `\`${slashCommand.data.name}\`` },
          { name: `Error:`, value: `\`${error}\`` },
          { name: `Error Time:`, value: `${errorTime}` }
        )
        .setFooter({ text: `Error Log System` })
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } else {
      await interaction.reply({
        content: "❌ There was an error while executing this slash command!",
        ephemeral: true,
      });

      // Error Flag System
      const logChannel = await client.channels.fetch(errorChannel); // Error Log Channel in Xenco Development

      const member = interaction.user.tag;
      const guild = interaction.guild.name;
      const channel = interaction.channel.name;
      const errorTime = `<t:${Math.floor(Date.now() / 1000)}:R>`;

      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`❌ An error occured!`)
        .setDescription(
          `An error has occured while using a slash command!
        **Guild:** ${guild}
        **Channel:** ${channel}
        **User:** ${member}`
        )
        .setFields(
          { name: `Error Command:`, value: `\`${slashCommand.data.name}\`` },
          { name: `Error:`, value: `\`${error}\`` },
          { name: `Error Time:`, value: `${errorTime}` }
        )
        .setFooter({ text: `Error Log System` })
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    }
  }

  async function incrementCommandUsage() {
    try {
      const commandUsage = require("../Schemas/commandUsage");

      // Attempt to find existing command usage data
      const data = await commandUsage.findOne();

      if (data) {
        // Update existing data
        data.amountOfCommandsUsed++;
        await data.save();
      } else {
        // Create new data if none exists
        const newData = new commandUsage({ amountOfCommandsUsed: 1 });
        await newData.save();
      }
    } catch (error) {
      console.error("Error incrementing command usage:", error);
    }
  }
};
