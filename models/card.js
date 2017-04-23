var config = require('config');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.connectionString);

var model = sequelize.define('cards', {
  title: Sequelize.STRING,
  content: Sequelize.STRING,
  image_url: Sequelize.STRING,
  is_active: Sequelize.BOOLEAN,
},{
    timestamps: false
});

module.exports = model;