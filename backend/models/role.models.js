var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Role = sequelize.define('role', {
    name: Sequelize.STRING
});


module.exports = Role;