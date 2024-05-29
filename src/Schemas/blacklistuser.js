const { model, Schema } = require("mongoose");

let blacklistuser = new Schema({
  User: String,
  Timestamp: String,
  Reason: String,
});

module.exports = model("blacklistuser", blacklistuser);
