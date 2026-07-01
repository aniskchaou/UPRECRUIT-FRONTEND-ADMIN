
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Service = sequelize.define('service', {
    name: Sequelize.STRING,
    description: Sequelize.STRING

});


module.exports = Service;