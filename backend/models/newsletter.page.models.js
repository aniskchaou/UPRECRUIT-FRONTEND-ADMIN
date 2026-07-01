

var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var NewsLetterPage = sequelize.define('newsletter_page', {
    title: Sequelize.STRING,
    subTitle : Sequelize.STRING

});


module.exports = NewsLetterPage;
