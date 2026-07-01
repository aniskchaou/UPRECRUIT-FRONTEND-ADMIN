var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var MemberPreference = sequelize.define('member_preference', {
    userId: Sequelize.INTEGER,
    hideProfile: Sequelize.STRING,
    anonymizeProfile: Sequelize.STRING,
    emailAlerts: Sequelize.STRING,
    pushAlerts: Sequelize.STRING,
    recruiterMessages: Sequelize.STRING,
    twoFactorEnabled: Sequelize.STRING,
    bookmarkedJobs: Sequelize.TEXT
});

module.exports = MemberPreference;
