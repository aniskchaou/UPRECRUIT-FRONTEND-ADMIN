
const { findJob, findAllJobs, createJob, findJobById, deleteJobById, updateJob, deleteAllJobs } = require("../../services/job.services");

exports.search = (req, res) => {
    // Validate request

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    console.log(req.body)

    const user = {
        post: req.body.post,
        jobType: req.body.jobType,
        experienceLevel: req.body.experienceLevel,

    }
    findJob(user, res)
}


exports.create = (req, res) => {
    // Validate request

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a user
    const user = {
        post: req.body.post,
        description: req.body.description,
        start: req.body.start,
        end: req.body.end,
        location: req.body.location,
        requirement: req.body.requirement,
        active: req.body.active,
        salaryFrom: req.body.salaryFrom,
        salaryTo: req.body.salaryTo,
        hideSalary: req.body.hideSalary,
        jobType: req.body.jobType,
        position: req.body.position,
        gender: req.body.gender,
        feature: req.body.feature,
        degree: req.body.degree,
        experienceLevel: req.body.experienceLevel,
        deadline: req.body.deadline
    }
    createJob(user, res)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllJobs(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findJobById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateJob(id, req, res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteJobById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllJobs(res)
};