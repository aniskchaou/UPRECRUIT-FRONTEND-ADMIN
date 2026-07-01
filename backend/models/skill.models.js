
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Skill = sequelize.define('skill', {
    name: Sequelize.STRING

});


module.exports = Skill;