var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var DegreeType = sequelize.define('degree_type', {
     name : Sequelize.STRING


});


module.exports = DegreeType;