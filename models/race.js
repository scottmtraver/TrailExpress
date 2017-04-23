var config = require('config');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.connectionString);

var model = sequelize.define('races', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  date: Sequelize.STRING,
  registration_time: Sequelize.STRING,
  start_time: Sequelize.STRING,
  cost: Sequelize.STRING,
  distance: Sequelize.STRING,
  image_url: Sequelize.STRING,
  results_url: Sequelize.STRING,
  course_url: Sequelize.STRING,
  course_description: Sequelize.STRING,
  //venu
  //sponsor
},{
    timestamps: false
});

module.exports = model;