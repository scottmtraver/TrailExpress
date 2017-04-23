var config = require('config');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.connectionString);

var model = sequelize.define('sponsors', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  link_url: Sequelize.STRING,
  image_url: Sequelize.STRING,
},{
    timestamps: false
});

module.exports = model;