
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var ApplyJob = sequelize.define('apply_job', {
    condidate:Sequelize.STRING,
    jobOffer:Sequelize.STRING,
    dateApplication:Sequelize.STRING,
    status:Sequelize.STRING,
     appreciation:Sequelize.STRING

});


module.exports = ApplyJob;