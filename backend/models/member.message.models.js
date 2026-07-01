var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var MemberMessage = sequelize.define('member_message', {
    userId: Sequelize.INTEGER,
    recruiter: Sequelize.STRING,
    preview: Sequelize.STRING,
    unread: Sequelize.STRING
});

module.exports = MemberMessage;
