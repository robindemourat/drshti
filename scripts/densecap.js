const exec = require('child_process').exec;
const fs = require('fs');
const extra = require('fs-extra');

/**
 * Courtesy of Daniel Shiffman for this piece - https://github.com/shiffman/node-densecap
 */


/**
 * Executes densecap analysis with torch & lua bash command
 */
function processImage (inputImagePath, outputDirPath, width) {
  return new Promise((resolve, reject) => {
    // Execute the densecap command
    var cmd = `th run_model.lua -input_image ${inputImagePath} -output_vis_dir ${outputDirPath} -gpu -1 -image_size ${width}`;
    console.log('starting promise', cmd);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        reject(error);
      } else if (stderr) {
        console.log(stderr);
        reject(error);
      }
      // This is when it's finished
      else if (stdout) {
        console.log('done', stdout)
        return resolve();
      }
    });
  })
}

/**
 * Creates a dir for the densecap results and execute
 */
function monitorProcessImage(inputDirPath, outputDirPath, width, fileName) {
  return new Promise((resolve1, reject1) => {
          const imagePath = inputDirPath + fileName;
          const outputDir = outputDirPath + fileName;
          extra.ensureDir(outputDir)
            .then(() => processImage(imagePath, outputDir, width))
            .then(resolve1)
            .catch(reject1);
        });
}

/**
 * Supervises densecap analysis for a whole folder
 * Note : densecap provides a flag to process a whole folder
 * but I had to split images processing one by one due to memory issues.
 * I don't know if that's a bug or if I did not get something right.
 */
module.exports = function runDenseCap(inputDirPath, outputDirPath, width) {
  return new Promise((resolve, reject) => {
    fs.readdir(inputDirPath, (err, files) => {
      if (err) {
        return reject(err);
      }
      let p = Promise.resolve();
      files.forEach((filename) => {
          p = p.then(() => { return monitorProcessImage(inputDirPath, outputDirPath, width, filename); });
      });
      return p.then(resolve).catch(reject);
    })
  });
}