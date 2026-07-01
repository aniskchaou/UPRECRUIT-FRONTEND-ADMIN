var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var CV = sequelize.define('cv', {
    name: Sequelize.STRING,
    date : Sequelize.STRING,
    file : Sequelize.STRING

});


module.exports = CV;