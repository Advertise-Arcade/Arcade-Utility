const { model, Schema } = require("mongoose");

let blacklistserver = new Schema({
  Guild: String,
  Timestamp: String,
  Reason: String,
});

module.exports = model("blacklistserver", blacklistserver);
