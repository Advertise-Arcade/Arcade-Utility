const { SlashCommandBuilder } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { bold } = require("colorette"); // Importing the 'bold' function from the 'colorette' package

async function clean(client, text) {
  if (text && text.constructor.name == "Promise") text = await text;
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 1 });

  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));

  text =
    text.replaceAll(client.token, "[REDACTED]") &&
    text.replaceAll(`${client.token}`, "[REDACTED]");

  return text;
}

module.exports = {
  config: {
    owner: true,
  },
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("🔋 Evaluate JavaScript code!")
    .setNSFW(false)
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code you want to evaluate!")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();

    const code = interaction.options.getString("code");
    const startTime = Date.now();

    try {
      const evaled = eval(code);
      const cleaned = await clean(client, evaled);
      const executionTime = Date.now() - startTime;

      if (cleaned.length > 2000) {
        return interaction
          .followUp(
            "Message is over 2000 characters. Evaluation sent to console!"
          )
          .then(
            console.log(
              `${bold(
                "Evaluation:"
              )}\n${cleaned}\nExecution Time: ${executionTime}ms`
            )
          );
      }

      interaction.followUp(
        `<:icons_box:1234357860348067862> **Input:**\n${codeBlock(
          "js",
          code
        )}\n<:icons_box:1234357860348067862> **Output:**\n${codeBlock(
          "js",
          cleaned
        )}\n**Execution time:** \`${executionTime}ms\``
      );
    } catch (error) {
      const errorMessage = `<:icons_Wrong:1234358871850618890> **Error:**\n\`\`\`js\n${error}\n\`\`\``;
      interaction.followUp(errorMessage);
      console.error(`Eval Command Error Message: ${error}`);
    }
  },
};
