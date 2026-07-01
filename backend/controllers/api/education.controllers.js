
const { findAllEducations, createEducation, findEducationById, deleteEducationById, updateEducation, deleteAllEducations } = require("../../services/education.services");

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
        degree: req.body.degree,
        university: req.body.university,
        result: req.body.result,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        status: req.body.status,
    }
    createEducation(user,res)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllEducations(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findEducationById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateEducation(id, req,res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteEducationById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllEducations(res)
};