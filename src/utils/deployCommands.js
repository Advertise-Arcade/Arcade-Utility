const { REST, Routes } = require("discord.js");
const { clientId, token, guildId } = require("../config.json"); // Add guildId to your config
const fs = require("fs");
const path = require("path");

const { green, bold, red } = require("colorette");

const slashCommands = [];
const foldersPath = path.join(__dirname, "../slashCommands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const slashCommand = require(filePath);

    if ("data" in slashCommand && "execute" in slashCommand) {
      slashCommands.push({
        command: slashCommand.data.toJSON(),
        developer: slashCommand.config?.developer || false, // Default to false if not specified
      });
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    const globalCommands = slashCommands
      .filter((cmd) => !cmd.developer)
      .map((cmd) => cmd.command);
    const guildCommands = slashCommands
      .filter((cmd) => cmd.developer)
      .map((cmd) => cmd.command);

    console.log(
      `${green("[INFO]")} Deploying Slash Commands To Cot Utility...`
    );

    if (slashCommands.length > 0) {
      console.log(
        `[${green("+")}] Deploying ${bold(
          slashCommands.length.toLocaleString()
        )} Total Slash Commands`
      );
    } else {
      console.error(`${red("[ERROR]")} No Slash Commands To Deploy`);
    }

    if (globalCommands.length > 0) {
      await rest.put(Routes.applicationCommands(clientId), {
        body: globalCommands,
      });
      console.log(
        `[${green("+")}] Reloaded ${bold(
          globalCommands.length.toLocaleString()
        )} Global Application Slash Commands`
      );
    }

    if (guildCommands.length > 0) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: guildCommands,
      });
      console.log(
        `[${green("+")}] Reloaded ${bold(
          guildCommands.length.toLocaleString()
        )} Guild Application Slash Commands`
      );
    }
  } catch (error) {
    console.error(error);
  }
})();
