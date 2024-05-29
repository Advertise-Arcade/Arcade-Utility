const { SlashCommandBuilder } = require("discord.js");
const Discord = require("discord.js");
const config = require("../../config.json");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
  config: {
    owner: false,
  },
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("Fetches an image of a cat/kitten!")
    .setDMPermission(false)
    .setNSFW(false),
  async execute(interaction) {
    await interaction.deferReply();

    const axios = require("axios");

    async function getRandomKittenImage() {
      try {
        const response = await axios.get(
          "https://api.thecatapi.com/v1/images/search"
        );
        const imageUrl = response.data[0].url; // Access image URL from response data
        return imageUrl;
      } catch (error) {
        console.error("Error fetching kitten image:", error);
        return null; // Or handle the error differently
      }
    }

    const kittenImage = await getRandomKittenImage();

    if (kittenImage) {
      const attachment = new AttachmentBuilder(kittenImage, {
        name: "kitten.jpg",
      });

      return await interaction.followUp({
        content: `**Here's a [kitten](<${kittenImage}>) for you!**`,
        files: [attachment],
      });
    } else {
      console.error("No kitten image found.");
      return await interaction.followUp("No kitten image found.");
    }
  },
};
