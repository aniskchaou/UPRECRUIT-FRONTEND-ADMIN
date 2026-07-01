var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var MemberProfile = sequelize.define('member_profile', {
    userId: Sequelize.INTEGER,
    emailVerified: Sequelize.STRING,
    phoneVerified: Sequelize.STRING,
    onboardingCompleted: Sequelize.STRING,
    wizardStep: Sequelize.STRING,
    preferredRoles: Sequelize.TEXT,
    preferredLocation: Sequelize.STRING,
    preferredSalary: Sequelize.STRING,
    preferredJobTypes: Sequelize.TEXT,
    workExperiences: Sequelize.TEXT,
    educations: Sequelize.TEXT,
    profileSkills: Sequelize.TEXT,
    certifications: Sequelize.TEXT,
    profileLanguages: Sequelize.TEXT,
    portfolioLinks: Sequelize.TEXT,
    profilePictureUrl: Sequelize.STRING,
    videoIntroUrl: Sequelize.STRING,
    profileVisibility: Sequelize.STRING,
    resumeVersions: Sequelize.TEXT,
    resumeBuilderContent: Sequelize.TEXT,
});

module.exports = MemberProfile;
