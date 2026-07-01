var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var MemberSavedSearch = sequelize.define('member_saved_search', {
    userId: Sequelize.INTEGER,
    label: Sequelize.STRING,
    keyword: Sequelize.STRING,
    location: Sequelize.STRING,
    category: Sequelize.STRING,
    experienceLevel: Sequelize.STRING,
    jobType: Sequelize.STRING,
    minSalary: Sequelize.STRING,
    maxSalary: Sequelize.STRING
});

module.exports = MemberSavedSearch;
