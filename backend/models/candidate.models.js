
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');
var Candidate = sequelize.define('candidate', {
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    phone: Sequelize.STRING,
    details: Sequelize.STRING,
    dateOfBirth: Sequelize.STRING,
    gender: Sequelize.STRING,
    skills: Sequelize.STRING,
    note: Sequelize.STRING,
    nationality: Sequelize.STRING,
    city: Sequelize.STRING,
    country: Sequelize.STRING,
    categoryJob: Sequelize.STRING,
    address: Sequelize.STRING,
    careerLevel: Sequelize.STRING,
    experience: Sequelize.STRING,
    language: Sequelize.STRING,
    salary: Sequelize.STRING,
    remoteWork: Sequelize.STRING,
    immediateAvailable: Sequelize.STRING,
    summary: Sequelize.STRING,
    cv: Sequelize.STRING,
    coverLetter: Sequelize.STRING,
    skills: Sequelize.STRING,
    jobRole: Sequelize.STRING,
    password: Sequelize.STRING
});


module.exports = Candidate;



