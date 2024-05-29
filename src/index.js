// Discord Requires
const { Client, Partials, Collection } = require("discord.js");
const process = require("node:process");

// Colorette Requiress
const { bold, red, redBright } = require("colorette"); // Importing the 'bold' function from the 'colorette' package

// Node Requires
const fs = require("fs");
const path = require("path");

if (!fs.existsSync(path.join(__dirname, "config.json"))) {
  console.warn(
    `${bold(red("[WARN]"))} config.json does not exist! Please create one.`
  );
  process.exit(1);
}

// Get config
const config = require("./config.json");

if (!config.token) {
  console.warn(
    `${bold(red("[WARN]"))} Token is not set! Please check "config.json"`
  );
  process.exit(1);
} else if (!config.prefix) {
  console.warn(
    `${bold(red("[WARN]"))} Prefix is not set! Please check "config.json"`
  );
  process.exit(1);
} else if (!config.mongoURL) {
  console.warn(
    `${bold(red("[WARN]"))} Mongo URL is not set! Please check "config.json"`
  );
  process.exit(1);
} else if (!config.clientId) {
  console.warn(
    `${bold(red("[WARN]"))} Client ID is not set! Please check "config.json"`
  );
  process.exit(1);
} else if (!config.guildId) {
  console.warn(
    `${bold(red("[WARN]"))} Guild ID is not set! Please check "config.json"`
  );
  process.exit(1);
} else if (!config.errorChannel) {
  console.warn(
    `${bold(
      red("[WARN]")
    )} Error Channel is not set! Please check "config.json"`
  );
  process.exit(1);
}

// Set token variable to config.token
const token = config.token;

// Declare client
const client = new Client({
  messageCacheLifetime: 60,
  fetchAllMembers: true,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 500,
  allowedMentions: {
    repliedUsers: false,
  },
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember,
  ],
  shards: "auto",
  intents: 3276799,
});

// Make config available within client
client.config = config;

process.on("uncaughtException", (error) => {
  console.log(`${bold(red("[ERROR]"))} ${error}`);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(`${bold(red("[ERROR]"))} ${err} ${origin}`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(
    `${bold(
      red("[ERROR]")
    )} Unhandled promise at: ${promise}\nReason: ${reason}`
  );
});

// Get Events
const events = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
for (const file of events) {
  const eventName = file.split(".")[0];
  const event = require(`./events/${file}`);
  client.on(eventName, event.bind(null, client));
}

client.totalEvents = events.length;

// Make message commands a collection
client.commands = new Collection();

// Read directories function
function readFilesRecursively(directory, fileList = []) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    if (fs.statSync(filePath).isDirectory()) {
      // If it's a directory, recursively read its files
      readFilesRecursively(filePath, fileList);
    } else {
      // If it's a file, add it to the list
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Declare Cooldowns
client.cooldowns = new Collection();

// Directory containing commands
const commandsDir = "./src/commands";

// Get all JavaScript files recursively from the commands directory
const commandFiles = readFilesRecursively(commandsDir).filter((file) =>
  file.endsWith(".js")
);

// Get Total Commands, make it available through client, and log it
client.totalCommands = commandFiles.length;

for (const file of commandFiles) {
  const commandName = path.parse(file).name;
  const command = require(path.resolve(file));

  client.commands.set(commandName, command);
}

// Slash Command Stuff

client.slashCommands = new Collection();

const foldersPath = path.join(__dirname, "./slashCommands");
const slashCommandFolders = fs.readdirSync(foldersPath);

for (const folder of slashCommandFolders) {
  const slashCommandsPath = path.join(foldersPath, folder);
  const slashCommandFiles = fs
    .readdirSync(slashCommandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of slashCommandFiles) {
    const slashFilePath = path.join(slashCommandsPath, file);
    const slashCommand = require(slashFilePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in slashCommand && "execute" in slashCommand) {
      client.slashCommands.set(slashCommand.data.name, slashCommand);
    } else {
      console.log(
        `${bold(
          red("[WARN]")
        )} The slash command at ${slashFilePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.utils = new Collection();

// Login
client.login(token);
