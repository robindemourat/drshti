var src = require("srt").fromString;

/**
 * Converts a srt-formatted string to js objects
 * @return {object} hashmap of the srts - {number (num), startTime (ms), endTime (ms), text (str)}
 */
module.exports = function(str) {
  return src(str);
}