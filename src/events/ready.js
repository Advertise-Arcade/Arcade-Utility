const { bold, cyan, greenBright } = require("colorette");
const os = require("os");

const config = require("../config.json");
const package = require("../../package.json");

const mongoose = require("mongoose");
const mongoURL = config.mongoURL;

// Ready event for bot startup.
module.exports = async (client) => {
  (async () => {
    try {
      await mongoose.connect(mongoURL || "", {});
      console.log(`[${greenBright("+")}] MongoDB Connected`);
    } catch (error) {
      console.log(`❌ Error occured: ${error}`);
    }
  })();

  console.clear();
  console.log(`${cyan("========================================")}`);
  console.log(`╔ Total Commands: ${bold(client.totalCommands)} ◝`);
  console.log(`╠ Total Slash Commands: ${bold(client.slashCommands.size)}`);
  console.log(`╠ Total Events: ${bold(client.totalEvents)}`);
  console.log(`╠ Total Guilds: ${bold(client.guilds.cache.size)}`);
  console.log(`╠ Total Users: ${bold(client.users.cache.size)}`);
  console.log(`╠ Bot Version: ${bold("v" + package.version)}`);
  console.log(`╠ CPU: ${bold(`${os.cpus()[0].model}`)}`);
  console.log(
    `╠ Total RAM: ${bold(`${Math.round(os.totalmem() / 1024 / 1024)} MB`)}`
  );
  console.log(
    `╠ Storage Used: ${bold(
      `${Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)} MB`
    )}`
  );
  console.log(`╠ Platform: ${bold(os.platform())}`);
  console.log(`╚ Launch Time: ${bold(`${new Date().toLocaleString()}`)} ◞`);
  console.log(`${cyan("========================================")}`);

  console.log(
    `[${greenBright("+")}] Logged in as ${bold(
      client.user.tag
    )} || Bot ID: ${bold(client.user.id)}`
  );

  const activities = [`/help | Cot Utility`, `Akai is King of Cot's`];

  let currentActivityIndex = 0;

  setInterval(() => {
    totalUsers = client.users.size - client.guilds.size;
    totalChannels = client.channels.size;
    totalServers = client.guilds.size;

    currentActivityIndex = (currentActivityIndex + 1) % activities.length;
    const newActivity = activities[currentActivityIndex];
    client.user.setActivity(newActivity);
  }, 5000);
};
