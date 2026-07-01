var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var AcceptanceFeedBack = sequelize.define('acceptance_feedback', {
    name: Sequelize.STRING,
    description : Sequelize.STRING

});


module.exports = AcceptanceFeedBack;