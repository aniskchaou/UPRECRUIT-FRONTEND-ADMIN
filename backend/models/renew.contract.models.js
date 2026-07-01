var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var RenewContract = sequelize.define('renew_contract', {
    contract: Sequelize.STRING,
    startDate: Sequelize.STRING,
    endDate: Sequelize.STRING,
    contractValue: Sequelize.STRING,
    status: Sequelize.STRING,
});


module.exports = RenewContract;
