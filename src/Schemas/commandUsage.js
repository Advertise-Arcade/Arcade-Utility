const { model, Schema } = require("mongoose");

let commandUsage = new Schema({
  amountOfCommandsUsed: Number,
});

module.exports = model("commandUsage", commandUsage);
