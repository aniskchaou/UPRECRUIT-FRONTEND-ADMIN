
const { findAllLanguages, createLanguage, findLanguageById, deleteLanguageById, updateLanguage, deleteAllLanguages } = require("../../services/language.services");

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
        language: req.body.language,
        level: req.body.level
    }
    createLanguage(user, res)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllLanguages(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findLanguageById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateLanguage(id, req, res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteLanguageById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllLanguages(res)
};