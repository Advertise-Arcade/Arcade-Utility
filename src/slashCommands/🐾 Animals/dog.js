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
    .setName("dog")
    .setDescription("🐶 Fetches an image of a dog!")
    .setDMPermission(false)
    .setNSFW(false),
  async execute(interaction) {
    await interaction.deferReply();

    const axios = require("axios");

    async function getRandomDogImage() {
      try {
        const response = await axios.get(
          "https://api.thedogapi.com/v1/images/search"
        );
        const imageUrl = response.data[0].url; // Access image URL from response data
        return imageUrl;
      } catch (error) {
        console.error("Error fetching dog image:", error);
        return null; // Or handle the error differently
      }
    }

    const dogImage = await getRandomDogImage();

    if (dogImage) {
      const attachment = new AttachmentBuilder(dogImage, {
        name: "dog.jpg",
      });

      return await interaction.followUp({
        content: `**Here's a [dog](<${dogImage}>) for you!**`,
        files: [attachment],
      });
    } else {
      console.error("No dog image found.");
      return await interaction.followUp("No dog image found.");
    }
  },
};
