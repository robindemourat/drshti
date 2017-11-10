const fs = require('fs');
const path = require('path');
const async = require('async');
const ffmpeg = require('fluent-ffmpeg');
const moment = require('moment');

/**
 * Check that input is a video and save its duration
 * @param parameters - {timespan, filesname, input, output}
 * @param parameters.timespan - screenshots timespan in seconds
 * @param parameters.filesname - file format template e.g. `screenshot_%s.png`
 * @param parameters.input - input file path
 * @param parameters.output - output folder path
 */
function populateDuration(parameters) {
  return new Promise((resolve, reject) => {
    ffmpeg(parameters.input)
    .ffprobe(0, function(err, data) {
      if (data.streams) {
        var duration;
        const video = data.streams.find(function(stream) {
          return stream.codec_type === 'video';
        });
        if (video) {
          duration = video.duration;
          console.log('video lasts %s seconds', video.duration);
        }
        if (duration) {
          parameters.duration = duration;
          // durationCb(null, parameters);
          return resolve(parameters);
        } else {
          console.log('could not find duration');
          // durationCb({error: 'could not find duration'});
          return reject({error: 'could not find duration'});
        }
      } else {
        console.log('could not find streams data for video, leaving');
        return reject({error: 'no stream'});
      }
    });
  });
}

/**
 * Take screenshots according to parameters
 * @param parameters - {timespan, filesname, input, output}
 * @param parameters.timespan - screenshots timespan in seconds
 * @param parameters.filesname - file format template e.g. `screenshot_%s.png`
 * @param parameters.input - input file path
 * @param parameters.output - output folder path
 */
function takeScreenshots (parameters, subsIn) {
  return new Promise((resolve, reject) => {
    const timemarks = [];
    if (parameters.alignOnSubtitles && subsIn) {
      console.log('screenshots are defined using subtitles for defining timestamps');
      const subs = Object.keys(subsIn).map(key => subsIn[key]);
      subs.forEach(sub => {
        const timestamp = sub.startTime;
        timemarks.push(timestamp/1000);
      })
    }
    else if (parameters.duration && parameters.timespan) {
      console.log('screenshots are taken each %s seconds', parameters.timespan);
      var count = 0;
      while (count <= parameters.duration - parameters.timespan) {
        timemarks.push(count);
        count += parameters.timespan;
      }
    } else {
      console.log('no duration or timespan in parameters, cannot define timestamps for screenshots');
      return reject('not enough parameters');
    }
    const total = timemarks.length;
    var count = 0;

    console.log('output folder is ', parameters.output);
    console.log('there are %s screenshots', total);

    const packets = [];
    var packetCount = 0;
    const libLimit = 10;
    while (packetCount <= total) {
      packets.push(
          timemarks.slice(packetCount, packetCount + libLimit)
        );
      packetCount += libLimit;
    }
    console.log('splitting screenshots into %s packets', packets.length);
    async.mapSeries(packets, function(packet, packetCb) {
      console.log('starting taking screenshots for new packet');
      var cb = false;
      var command = ffmpeg(parameters.input)
          .screenshots({
            timestamps: packet,
            folder: parameters.output,
            filename : parameters.filesname || 'tn_%s.png'
          })
        .on('error', (err) => {
          console.log('error: ', err);
          packetCb(err);
        })
        .on('filenames', (filenames) => {
          console.log('Will generate ' + filenames.join(', '))
        })
        .on('end', () => {
          count++;
          console.log('Screenshots taken for current packet (%s/%s)', count, packets.length);

          setTimeout(() => {
            cb = true;
            return packetCb(null);
          }, 1000);
        });
    }, function(packetErrors) {
      console.log('all screenshots taken');
      if (packetErrors) {
        return reject(packetErrors);
      } else {
        return resolve(timemarks);
      }
    });
  });
}

module.exports = {
  populateDuration,
  takeScreenshots,
}