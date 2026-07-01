var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var InsightContent = sequelize.define('insight_content', {
    category: Sequelize.STRING,
    title: Sequelize.STRING,
    excerpt: Sequelize.STRING,
    highlight: Sequelize.STRING
});

module.exports = InsightContent;
