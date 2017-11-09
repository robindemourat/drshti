const exec = require('child_process').exec;

module.exports = function runDenseCap(inputDirPath, outputDirPath, width) {
  return new Promise((resolve, reject) => {
    // Execute the densecap command
    var cmd = `th run_model.lua -input_dir ${inputDirPath} -output_vis_dir ${outputDirPath}`;
    cmd += ` -image_size ${width}`;
    // if (!gpu) {
    //   cmd += ' -gpu -1';
    // }
    console.log(cmd);
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
        return resolve();
        console.log(stdout);
        // Read the JSON results
        var output = fs.readFileSync('results/results.json');
        var results = JSON.parse(output);
        // Send them back!
        response.send(results);
      }
    });
  });
}