
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Task = sequelize.define('todo', {
    task: Sequelize.STRING,
    status: Sequelize.STRING
});


module.exports = Task;