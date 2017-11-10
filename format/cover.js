
const randomColor = () => {
  const r = parseInt(Math.random() * 255);
  const g = parseInt(Math.random() * 255);
  const b = parseInt(Math.random() * 255);
  return `rgba(${r},${g},${b}, 1)`
}
module.exports = function(metadata) {
  const color = randomColor();
  return `
<section class="page cover" style="background:${color}; position:relative;width:100%;height:100%">
  <h2>${metadata.title}</h2>
  <h3>${metadata.author}</h3>
  <h4>${metadata.published}</h4>
</section>
`;
}