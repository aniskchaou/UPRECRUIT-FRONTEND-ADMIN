var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var LanguageLevel = sequelize.define('language_level', {
    name: Sequelize.STRING
});


module.exports = LanguageLevel;