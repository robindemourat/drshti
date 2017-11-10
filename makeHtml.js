/**
 * Consumes analysis data to produce a book
 */
const fs = require('fs-extra');

const data = require('./output/data');
const metadata = require('./data/metadata.json')
const mhtml = require('./format/html');

const html = mhtml(data, metadata);

fs.writeFile('./output/index.html', html)
  .then(() => console.log('done written html'))
  .catch(error => console.log(error))


