var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var HeaderPage = sequelize.define('header_page', {
    title: Sequelize.STRING
});


module.exports = HeaderPage;
