var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');
var Education = sequelize.define('education', {
     degree : Sequelize.STRING,
     university: Sequelize.STRING,
     result: Sequelize.STRING,
     startDate: Sequelize.STRING,
     endDate: Sequelize.STRING,
     status: Sequelize.STRING
});


module.exports = Education;


