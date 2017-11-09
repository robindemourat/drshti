var src = require("srt").fromString;

module.exports = function(str) {
  return src(str);
}