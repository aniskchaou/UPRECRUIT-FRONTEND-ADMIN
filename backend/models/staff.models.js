
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Staff = sequelize.define('staff', {
    full_name: Sequelize.STRING,
    password: Sequelize.STRING,
    calling_code: Sequelize.STRING,
    role: Sequelize.STRING,
});


module.exports = Staff;