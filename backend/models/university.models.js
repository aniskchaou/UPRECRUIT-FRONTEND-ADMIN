var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var University = sequelize.define('university', {
    university: Sequelize.STRING,
    location: Sequelize.STRING
});


module.exports = University;