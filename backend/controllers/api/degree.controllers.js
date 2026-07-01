
const { findAllDegrees, createDegree, findDegreeById, deleteDegreeById, updateDegree, deleteAllDegrees } = require("../../services/degree.services");

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
        name: req.body.name,
        type: req.body.type,
        level: req.body.level,
        university: req.body.university,
        location: req.body.location
    }
    createDegree(user, res)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllDegrees(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findDegreeById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateDegree(id, req, res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteDegreeById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllDegrees(res)
};