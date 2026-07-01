var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var SubCategory = sequelize.define('sub_category', {
    category: Sequelize.STRING,
    name:Sequelize.STRING
});


module.exports = SubCategory;