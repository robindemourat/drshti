const gm = require('gm');

module.exports = function getImageDimension(path) {
  return new Promise((resolve, reject) => {
    // obtain the size of an image
    gm(path)
    .size(function (err, size) {
      if (!err) {
        return resolve(size);
      } else return reject(err);
    });
  })
}