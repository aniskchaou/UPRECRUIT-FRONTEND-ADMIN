var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Contract = sequelize.define('contract', {
    subject: Sequelize.STRING,
    contractValue: Sequelize.STRING,
    contractType: Sequelize.STRING,
    condidate: Sequelize.STRING,
    startDate: Sequelize.STRING,
    endDate: Sequelize.STRING,
    description: Sequelize.STRING,
    notes: Sequelize.STRING,
    comments: Sequelize.STRING,
    templates: Sequelize.STRING,
    renew: Sequelize.STRING

});


module.exports = Contract;





