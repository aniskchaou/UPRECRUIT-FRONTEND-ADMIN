var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var NewsLetters = sequelize.define('newsletter', {
    email: Sequelize.STRING
});


module.exports = NewsLetters;