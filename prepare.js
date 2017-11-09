const path = require('path');
const fs = require('fs-extra');

const srt = require('./scripts/srt_to_json');
const scr = require('./scripts/screenshots');
const densecap = require('./scripts/densecap');
const getImgSize = require('./scripts/get_image_dimensions');


const temp = path.resolve(__dirname + '/temp/');
const screenshotsDir = temp + '/screenshots/';
const captionsDir = temp + '/captions/';
const inputDir = path.resolve(__dirname + '/data/');
const inputSubtitles = path.resolve(__dirname + '/data/subtitles.srt');
const inputVideo = path.resolve(__dirname + '/data/video.mp4');

const params = {
  input: inputVideo,
  output: screenshotsDir,
  timespan: 10, // seconds
};
let subs;

fs.remove(temp)
  .then(() =>  fs.ensureDir(temp))
  .then(() =>  fs.ensureDir(screenshotsDir))
  .then(() =>  fs.ensureDir(captionsDir))
  .then(() => fs.readFile(inputSubtitles, 'utf8'))
  .then(str => {
    subs = srt(str);
    return fs.writeFile(temp + '/subs.json', JSON.stringify(subs))
  })
  .then(() => scr.populateDuration(params))
  .then(params => scr.takeScreenshots(params))
  .then(() => {
    return getImgSize(screenshotsDir + 'tn_1.png');
  })
  .then(size => densecap(screenshotsDir, captionsDir, size.width))
  .then(() => {
    console.log('ok');
  })
