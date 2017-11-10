
/**
 * Find appropriate subs for each image being analyses with densecap
 */
module.exports = function(results, timemarks, subsInput) {
  const subs = Object.keys(subsInput).map(k => subsInput[k]);
  return new Promise((resolve, reject) => {
    const data = results.map((item, index) => {
      const fileName = item.img_name;
      // ugly - retrieves the number in `tn_10.png`
      const number = +fileName.split('_')[1].split('.')[0];
      const time = timemarks[number - 1] * 1000;
      const sub = subs.find(s => s.startTime >= time && s.endTime <= time);
      return Object.assign(item, {sub});
    });
    resolve(data);
  })
}