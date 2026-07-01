var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var JobType = sequelize.define('job_type', {
    name: Sequelize.STRING
});


module.exports = JobType;