var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var JobPage = sequelize.define('job_page', {
    title: Sequelize.STRING,
    subTitle: Sequelize.STRING
});


module.exports = JobPage;