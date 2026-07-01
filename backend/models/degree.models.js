var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');
var Degree = sequelize.define('degree', {
     name : Sequelize.STRING,
     type: Sequelize.STRING,
     level: Sequelize.STRING,
     university: Sequelize.STRING,
     location: Sequelize.STRING,

});


module.exports = Degree;