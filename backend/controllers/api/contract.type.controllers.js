
const { findAllContactTypes, createContactType, findContactTypeById, deleteContactTypeById, updateContactType, deleteAllContactTypes } = require("../../services/contract.type.services");

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
        type: req.body.type,

    }
    createContactType(user)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllContactTypes(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findContactTypeById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateContactType(id, req)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteContactTypeById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllContactTypes(res)
};