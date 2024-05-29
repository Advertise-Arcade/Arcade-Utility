const { model, Schema } = require("mongoose");

let guildMessage = new Schema({
  guild: String,
  messages: Number,
  user: String,
});

module.exports = model("guildMessage", guildMessage);
