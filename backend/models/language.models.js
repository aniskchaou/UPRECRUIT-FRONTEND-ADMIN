
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Language = sequelize.define('language', {
    language: Sequelize.STRING,
    level: Sequelize.STRING
});


module.exports = Language;