var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var DegreeLevel = sequelize.define('degree_level', {
    name: Sequelize.STRING

});


module.exports = DegreeLevel;