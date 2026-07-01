
const { findAllExperiences, createExperience, findExperienceById, deleteExperienceById, updateExperience, deleteAllExperiences } = require("../../services/experience.services");

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
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        status: req.body.status,
        description: req.body.description,
    }
    createExperience(user,res)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllExperiences(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findExperienceById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateExperience(id, req,res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteExperienceById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllExperiences(res)
};