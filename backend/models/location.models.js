
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Location = sequelize.define('location', {
    city: Sequelize.STRING,
    country: Sequelize.STRING
});


module.exports = Location;