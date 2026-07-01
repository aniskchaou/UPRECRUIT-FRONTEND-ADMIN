var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var CareerLevel = sequelize.define('career_level', {
    name: Sequelize.STRING
});


module.exports = CareerLevel;