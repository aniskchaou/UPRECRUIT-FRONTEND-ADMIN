
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Category = sequelize.define('category', {
    category: Sequelize.STRING
});


module.exports = Category;