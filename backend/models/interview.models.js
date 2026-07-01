
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Interview = sequelize.define('interview', {
    candidates: Sequelize.STRING,
    employees: Sequelize.STRING,
    scheduleDate: Sequelize.STRING,
    scheduleTime: Sequelize.STRING,
    comment: Sequelize.STRING,
    status : Sequelize.STRING,
    zoomLink:Sequelize.STRING,
    reminder : Sequelize.STRING,
    notes:Sequelize.STRING,
    location:Sequelize.STRING
});


module.exports = Interview;