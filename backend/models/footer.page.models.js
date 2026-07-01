var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var FooterPage = sequelize.define('footer_page', {
    title1: Sequelize.STRING,
    title2: Sequelize.STRING,
    title3: Sequelize.STRING,
    title4: Sequelize.STRING,
    address: Sequelize.STRING,
    email: Sequelize.STRING,
    phone: Sequelize.STRING,
    skype: Sequelize.STRING,
    fax: Sequelize.STRING
});


module.exports = FooterPage;
