const scale = require('d3-scale');
const array = require('d3-array');

const getArea = box => {
  // const x1 = box[0];
  // const y1 = box[1];
  // const x2 = box[2];
  // const y2 = box[3];
  // const w = x2 - x1;
  // const h = y2 - y1;
  const w = box[2];
  const h = box[3];
  return w * h;
}

const setElement = (text, opacity, size, left, top) =>
  `<p style="opacity:${opacity};font-size:${size}px;left:${left}%;top:${top}%;position:absolute">
  ${text}
</p>`;

const setFrame = (caption, opacity, left, top, width, height) =>
  `<div style="opacity:${opacity/5};left:${left}%;top:${top}%;position:absolute;width:${width}%; height:${height}%;background:grey">
</div>`;
module.exports = function makePage(data) {

  const scoreRange = array.extent(data.scores);
  const areaRange = array.extent(data.boxes.map(getArea));
  const xRange = array.extent(data.boxes, d => d[0]);
  const yRange = array.extent(data.boxes, d => d[1]);

  const opacityScale = scale.scaleLinear()
    .domain(scoreRange)
    .range([0.3, 1]);

  const sizeScale = scale.scaleLinear()
    .domain(areaRange)
    .range([1, 50]);

  const xScale = scale.scaleLinear()
    .domain(xRange)
    .range([0, 90]);

  const yScale = scale.scaleLinear()
    .domain(yRange)
    .range([0, 90]);


  const elements = data.captions.map((caption, index) => {
    const opacity = opacityScale(data.scores[index]);
    const size = sizeScale(data.scores[index]);
    const left = xScale(data.boxes[index][0]);
    const top = xScale(data.boxes[index][1]);
    return setElement(caption, opacity, size, left, top);
  }).join('\n');

  const frames = data.captions.map((caption, index) => {
    const opacity = opacityScale(data.scores[index]);
    const left = xScale(data.boxes[index][0]);
    const top = xScale(data.boxes[index][1]);
    const width = xScale(data.boxes[index][2]);
    const height = yScale(data.boxes[index][3]);
    return setFrame(caption, opacity, left, top, width, height);
  }).join('\n');

  const src = '../temp/screenshots/' + data.img_name;

  return `
<section class="page"  style="position:relative;width:100%;height:100%">
  <h2 style="position:absolute;left:1em;bottom:1em;">${data.subtitle || ''}</h2>
  <img src="${src}" />
  <div className="elements">
  ${frames}
  </div>
  <div className="elements">
  ${elements}
  </div>
</section>
`
}