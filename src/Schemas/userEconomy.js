const { model, Schema } = require("mongoose");

let userEconomy = new Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  pocket: {
    type: Number,
    required: true,
    default: 0,
  },
  bank: {
    type: Number,
    required: true,
    default: 0,
  },
  lastDaily: {
    type: String,
    required: false,
    default: null,
  },
});

module.exports = model("userEconomy", userEconomy);
