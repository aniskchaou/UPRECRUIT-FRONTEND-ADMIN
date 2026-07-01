var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Company = sequelize.define('company', {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    category: Sequelize.STRING,
    telephone: Sequelize.STRING,
    address: Sequelize.STRING,
    website: Sequelize.STRING,
    size: Sequelize.STRING,
    logo: Sequelize.STRING,
    about: Sequelize.STRING

});


module.exports = Company;


