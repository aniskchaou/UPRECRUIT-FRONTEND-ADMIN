
const { findAllInterviews, createInterview, findInterviewById, deleteInterviewById, updateInterview, deleteAllInterviews } = require("../../services/interview.services");

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
        employees: req.body.employees,
        scheduleDate: req.body.scheduleDate,
        scheduleTime: req.body.scheduleTime,
        comment: req.body.comment,
        status: req.body.status,
        zoomLink: req.body.zoomLink,
        reminder: req.body.reminder,
        notes: req.body.notes,
        location: req.body.location,
        candidates: req.body.candidates
    }
    createInterview(user, res)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllInterviews(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findInterviewById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateInterview(id, req, res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteInterviewById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllInterviews(res)
};