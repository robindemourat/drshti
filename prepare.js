const path = require('path');
const fs = require('fs-extra');

const srt = require('./scripts/srt_to_json');
const scr = require('./scripts/screenshots');
const densecap = require('./scripts/densecap');
const getImgSize = require('./scripts/get_image_dimensions');
const enrichData = require('./scripts/enrich_data');


const temp = path.resolve(__dirname + '/temp/');
const screenshotsDir = temp + '/screenshots/';
const captionsDir = temp + '/captions/';
const inputDir = path.resolve(__dirname + '/data/');
const outputDir = path.resolve(__dirname + '/output/');
const inputSubtitles = path.resolve(__dirname + '/data/subtitles.srt');
const inputVideo = path.resolve(__dirname + '/data/video.avi');

const params = {
  input: inputVideo,
  output: screenshotsDir,
  alignOnSubtitles: true,
  // timespan: 1, // seconds
};

let subs;
let timemarks;
let results = [];


fs.remove(temp)
  // prepare dirs
  .then(() =>  fs.ensureDir(temp))
  .then(() =>  fs.ensureDir(screenshotsDir))
  .then(() =>  fs.ensureDir(captionsDir))
  .then(() =>  fs.ensureDir(outputDir))
  // convert subtitles to json
  .then(() => fs.readFile(inputSubtitles, 'utf8'))
  .then(str => {
    console.log('str', str);
    subs = srt(str);
    return fs.writeFile(temp + '/subs.json', JSON.stringify(subs))
  })
  // retrieve video duration
  .then(() => scr.populateDuration(params))
  // take a series of snapshots of the video
  .then(params => scr.takeScreenshots(params, subs))
  // get dimensions of first image for captionning analysis
  .then((timemarksTemp) => {
    timemarks = timemarksTemp;
    return fs.readdir(screenshotsDir)
            .then(names => getImgSize(screenshotsDir + names[0]));
  })
  // launch dense captionning analysis
  .then(size => densecap(screenshotsDir, captionsDir, size.width))

  // wrap analysis results in 1 file
  .then(() => fs.readdir(captionsDir))
  .then(dirs => {
    const retrieveData = dPath => {
      return new Promise((resolve, reject) => {
        fs.readFile(dPath)
          .then(str => {
            try{
              const d = JSON.parse(str);
              resolve(d.results[0]);
            } catch(e) {
              reject(e);
            }
          })
      })
    }
    let p = Promise.resolve();
    dirs.forEach((filename) => {
        if (filename.indexOf('tn') === -1) {
          return;
        }
        p = p.then(data => { 
          if(data) {
            results.push(data);
          }
          return retrieveData(captionsDir + filename + '/results.json');
        });
    });
    p = p.then(() => new Promise((resolve) => resolve(results)))
    return p;
  })
  .then(data => enrichData(results, timemarks, subs))
  .then(data => fs.writeFile(outputDir + '/data.json', JSON.stringify(data)))
  .catch(e => console.log(e))
