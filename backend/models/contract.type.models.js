var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');
var ContractType = sequelize.define('contract_type', {
    type: Sequelize.STRING
});


module.exports = ContractType;





