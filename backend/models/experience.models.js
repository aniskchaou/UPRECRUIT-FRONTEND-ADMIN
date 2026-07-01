var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');
var Experience = sequelize.define('exprience', {
     title : Sequelize.STRING,
     company: Sequelize.STRING,
     location: Sequelize.STRING,
     startDate: Sequelize.STRING,
     endDate: Sequelize.STRING,
     status: Sequelize.STRING,
     description:Sequelize.STRING
});


module.exports = Experience;

