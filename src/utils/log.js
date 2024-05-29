const colorette = require("colorette");

module.exports = {
  info(text) {
    console.info(colorette.gray("[INFO] ") + text);
  },

  warn(text) {
    console.warn(colorette.yellow("[WARN] ") + text);
  },

  error(err) {
    console.error(colorette.red("[ERROR] ") + err);
  },

  success(text) {
    console.log(colorette.green("[SUCCESS] ") + text);
  },

  debug(text) {
    console.debug(colorette.yellowBright("[DEBUG] ") + text);
  },

  log(text) {
    console.log(colorette.whiteBright("[LOG] ") + text);
  },
};
