var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var MemberNotification = sequelize.define('member_notification', {
    userId: Sequelize.INTEGER,
    type: Sequelize.STRING,
    title: Sequelize.STRING,
    message: Sequelize.STRING,
    readStatus: Sequelize.STRING,
    channel: Sequelize.STRING
});

module.exports = MemberNotification;
