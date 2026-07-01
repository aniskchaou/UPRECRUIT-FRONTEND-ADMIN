
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Salary = sequelize.define('salary', {
    current: Sequelize.STRING,
    expected: Sequelize.STRING
});


module.exports = Salary;