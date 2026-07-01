
const {  findAllSkills, createSkill, findSkillById, deleteSkillById, updateSkill, deleteAllSkills } = require("../../services/skill.services");

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
        name: req.body.name
    }
    createSkill(user,res)
};

exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllSkills(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findSkillById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateSkill(id, req,res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteSkillById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllSkills(res)
};