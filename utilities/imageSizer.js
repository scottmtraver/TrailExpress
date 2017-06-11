var _ = require('lodash');

function processImageWidth(entities, width) {
  _.forEach(entities, function (e) {
    // scale factor
    e.image_url = e.image_url.split('upload/').join('upload/c_scale,w_' + width + '/');
  });
}

module.exports = {
    processImageWidth: processImageWidth
};