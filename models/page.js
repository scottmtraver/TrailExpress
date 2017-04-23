var config = require('config');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.connectionString);

var model = sequelize.define('pages', {
  title: Sequelize.STRING,
  content: Sequelize.STRING,
  image_url: Sequelize.STRING,
  video_url: Sequelize.STRING,
},{
    timestamps: false
});

module.exports = model;