var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');
var RefusalFeedBack = sequelize.define('refusal_feedback', {
    name: Sequelize.STRING,
    description : Sequelize.STRING,


});


module.exports = RefusalFeedBack;