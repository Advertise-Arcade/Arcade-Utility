const { model, Schema } = require("mongoose");

let qotd = new Schema({
  timestamp: String,
});

module.exports = model("qotd", qotd);
