const { model, Schema } = require("mongoose");

let userAdwarn = new Schema({
  user: String,
  warns: Number,
});

module.exports = model("userAdwarn", userAdwarn);
