const page = require('./page');
const cov = require('./cover');

module.exports = function(data, metadata) {
  const pages = data.map(page);
  const cover = cov(metadata);
  return `
<html> 
  <head>
    <style>
body{
  font-family: sans-serif;
}
h2{
  background: black;
  color: white;
  padding: 1em;
  display: inline;
}
.elements{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
img{
  filter: blur(50px);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position :absolute;
}
.cover{
  padding: 10%;
}
.cover h1, .cover h2, .cover h3{
  padding: 1em;
}
    </style>
  </head>
  <body>
    ${cover}
    ${pages}
  </body>
</html>
`
}