var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var SummaryPage = sequelize.define('summary_page', {
    jobsPosted: Sequelize.STRING,
    allCompanies : Sequelize.STRING,
    totalMembers :Sequelize.STRING,
    happyMembers:Sequelize.STRING

});


module.exports = SummaryPage;
