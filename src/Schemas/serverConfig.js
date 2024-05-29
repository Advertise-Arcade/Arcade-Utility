const { model, Schema } = require("mongoose");

let serverConfig = new Schema({
  Guild: {
    type: String,
    required: true,
    unique: true,
  },
  Prefix: {
    type: String,
    required: true,
    default: "x!",
  },
  levelingEnabled: {
    type: Boolean,
    required: true,
    default: true,
  },
  nsfwEnabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  premium: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = model("serverConfig", serverConfig);
